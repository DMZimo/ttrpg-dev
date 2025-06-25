use crate::service::ServiceInfo;
use anyhow::Result;
use std::collections::HashMap;

pub struct DisplayManager;

impl DisplayManager {
    pub fn new() -> Self {
        Self
    }

    pub fn show_service_status(&self, statuses: &HashMap<String, ServiceInfo>) -> Result<()> {
        println!("\n🎲 D&D Campaign Manager Status");
        println!("═══════════════════════════════════");

        let mut running_count = 0;
        let total_count = statuses.len();

        for (_service_key, info) in statuses {
            let status_icon = match info.status {
                crate::service::ServiceStatus::Running => {
                    running_count += 1;
                    "🟢"
                }
                crate::service::ServiceStatus::Stopped => "🔴",
                crate::service::ServiceStatus::Error(_) => "⚠️",
            };

            let url_display = info.url.as_deref().unwrap_or("-");

            println!(
                "{} {} {} ({})",
                status_icon,
                info.name,
                info.status.as_str(),
                url_display
            );
        }

        println!("───────────────────────────────────");

        let overall_status = if running_count == total_count {
            "🎉 Ready for Gaming!"
        } else if running_count > 0 {
            "⚠️  Partially Ready"
        } else {
            "🔴 Not Ready"
        };

        println!(
            "{} ({}/{} services running)",
            overall_status, running_count, total_count
        );
        println!();

        Ok(())
    }
}
