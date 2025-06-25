use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Frame, Terminal,
};
use std::io;
use crate::service::{ServiceManager, ServiceStatus};

pub async fn run_tui(service_manager: ServiceManager) -> Result<()> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Create app state
    let mut selected_index = 0;
    let services = vec!["vtt", "website"];

    loop {
        let statuses = service_manager.get_all_statuses().await;
        
        terminal.draw(|f| {
            render_ui(f, &services, &statuses, selected_index);
        })?;

        if let Event::Key(key) = event::read()? {
            match key.code {
                KeyCode::Char('q') => break,
                KeyCode::Up => {
                    if selected_index > 0 {
                        selected_index -= 1;
                    }
                }
                KeyCode::Down => {
                    if selected_index < services.len() - 1 {
                        selected_index += 1;
                    }
                }
                KeyCode::Enter => {
                    let service = services[selected_index];
                    let status = &statuses[service];
                    
                    match status.status {
                        ServiceStatus::Running => {
                            let _ = service_manager.stop_service(service).await;
                        }
                        ServiceStatus::Stopped => {
                            let _ = service_manager.start_service(service).await;
                        }
                        ServiceStatus::Error(_) => {
                            let _ = service_manager.start_service(service).await;
                        }
                    }
                }
                KeyCode::Char('a') => {
                    let service = services[selected_index];
                    let _ = service_manager.attach_to_service(service).await;
                    break; // Exit TUI after attach
                }
                _ => {}
            }
        }
    }

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    Ok(())
}

fn render_ui(
    f: &mut Frame,
    services: &[&str],
    statuses: &std::collections::HashMap<String, crate::service::ServiceInfo>,
    selected_index: usize,
) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(1)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(0),
            Constraint::Length(3),
        ])
        .split(f.size());

    // Header
    let header = Paragraph::new("🎲 D&D Campaign Manager")
        .style(Style::default().fg(Color::Cyan))
        .block(Block::default().borders(Borders::ALL));
    f.render_widget(header, chunks[0]);

    // Service list
    let items: Vec<ListItem> = services
        .iter()
        .enumerate()
        .map(|(i, &service)| {
            let status_info = &statuses[service];
            let (status_symbol, status_color) = match status_info.status {
                ServiceStatus::Running => ("🟢", Color::Green),
                ServiceStatus::Stopped => ("🔴", Color::Red),
                ServiceStatus::Error(_) => ("⚠️", Color::Yellow),
            };

            let url = status_info.url.as_deref().unwrap_or("-");
            
            let content = vec![Line::from(vec![
                Span::raw(status_symbol),
                Span::raw(" "),
                Span::styled(&status_info.name, Style::default().fg(status_color)),
                Span::raw(" ("),
                Span::raw(url),
                Span::raw(")"),
            ])];

            let mut item = ListItem::new(content);
            if i == selected_index {
                item = item.style(Style::default().bg(Color::DarkGray));
            }
            item
        })
        .collect();

    let services_list = List::new(items)
        .block(Block::default().title("Services").borders(Borders::ALL))
        .highlight_style(Style::default().add_modifier(Modifier::BOLD))
        .highlight_symbol("▶ ");

    f.render_widget(services_list, chunks[1]);

    // Footer
    let footer = Paragraph::new("↑↓: Navigate | Enter: Start/Stop | A: Attach | Q: Quit")
        .style(Style::default().fg(Color::Gray))
        .block(Block::default().borders(Borders::ALL));
    f.render_widget(footer, chunks[2]);
}
