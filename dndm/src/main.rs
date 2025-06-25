use clap::{Parser, Subcommand};
use anyhow::Result;

mod config;
mod session;
mod service;
mod ui;

use crate::service::ServiceManager;
use crate::ui::display::DisplayManager;

#[derive(Parser)]
#[command(name = "dndm")]
#[command(about = "D&D Campaign Manager - Rust Edition")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start a service
    Start {
        /// Service to start (vtt, website)
        service: Option<String>,
    },
    /// Stop a service
    Stop {
        /// Service to stop (vtt, website)
        service: Option<String>,
    },
    /// Show service status
    Status,
    /// Attach to a service session
    Attach {
        /// Service to attach to
        service: String,
    },
    /// Interactive TUI mode
    Tui,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    let service_manager = ServiceManager::new()?;
    let display = DisplayManager::new();

    match cli.command {
        Commands::Start { service } => {
            if let Some(service_name) = service {
                service_manager.start_service(&service_name).await?;
            } else {
                service_manager.start_all_services().await?;
            }
        }
        Commands::Stop { service } => {
            if let Some(service_name) = service {
                service_manager.stop_service(&service_name).await?;
            } else {
                service_manager.stop_all_services().await?;
            }
        }
        Commands::Status => {
            let statuses = service_manager.get_all_statuses().await;
            display.show_service_status(&statuses)?;
        }
        Commands::Attach { service } => {
            service_manager.attach_to_service(&service).await?;
        }
        Commands::Tui => {
            crate::ui::tui::run_tui(service_manager).await?;
        }
    }

    Ok(())
}
