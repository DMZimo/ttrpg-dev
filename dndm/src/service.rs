use std::collections::HashMap;
use anyhow::{Result, anyhow};
use crate::config::Config;
use crate::session::SessionManager;

#[derive(Debug, Clone)]
pub enum ServiceStatus {
    Running,
    Stopped,
    Error(String),
}

impl ServiceStatus {
    pub fn as_str(&self) -> &str {
        match self {
            ServiceStatus::Running => "Running",
            ServiceStatus::Stopped => "Stopped", 
            ServiceStatus::Error(_) => "Error",
        }
    }
}

#[derive(Debug)]
pub struct ServiceInfo {
    pub name: String,
    pub status: ServiceStatus,
    pub url: Option<String>,
    pub session_name: String,
}

pub struct ServiceManager {
    config: Config,
    session_manager: SessionManager,
}

impl ServiceManager {
    pub fn new() -> Result<Self> {
        Ok(Self {
            config: Config::new()?,
            session_manager: SessionManager::new(),
        })
    }

    pub async fn start_service(&self, service_name: &str) -> Result<()> {
        match service_name {
            "vtt" => self.start_vtt_service().await,
            "website" => self.start_website_service().await,
            _ => Err(anyhow!("Unknown service: {}", service_name)),
        }
    }

    pub async fn stop_service(&self, service_name: &str) -> Result<()> {
        match service_name {
            "vtt" => self.stop_vtt_service().await,
            "website" => self.stop_website_service().await,
            _ => Err(anyhow!("Unknown service: {}", service_name)),
        }
    }

    pub async fn start_all_services(&self) -> Result<()> {
        println!("🚀 Starting all services...");
        
        if let Err(e) = self.start_service("vtt").await {
            eprintln!("Failed to start VTT: {}", e);
        }
        
        if let Err(e) = self.start_service("website").await {
            eprintln!("Failed to start website: {}", e);
        }

        Ok(())
    }

    pub async fn stop_all_services(&self) -> Result<()> {
        println!("🛑 Stopping all services...");
        
        if let Err(e) = self.stop_service("vtt").await {
            eprintln!("Failed to stop VTT: {}", e);
        }
        
        if let Err(e) = self.stop_service("website").await {
            eprintln!("Failed to stop website: {}", e);
        }

        Ok(())
    }

    pub async fn get_all_statuses(&self) -> HashMap<String, ServiceInfo> {
        let mut statuses = HashMap::new();
        
        statuses.insert("vtt".to_string(), self.get_vtt_status().await);
        statuses.insert("website".to_string(), self.get_website_status().await);
        
        statuses
    }

    pub async fn attach_to_service(&self, service_name: &str) -> Result<()> {
        let session_name = match service_name {
            "vtt" => &self.config.services.vtt.session_name,
            "website" => &self.config.services.website.session_name,
            _ => return Err(anyhow!("Unknown service: {}", service_name)),
        };

        self.session_manager.attach_to_session(session_name)
    }

    async fn start_vtt_service(&self) -> Result<()> {
        let vtt_config = &self.config.services.vtt;
        
        if self.session_manager.session_exists(&vtt_config.session_name)? {
            println!("⚠️  VTT session already exists. Use 'dndm attach vtt' to connect.");
            return Ok(());
        }

        if !self.config.validate_vtt_installation() {
            return Err(anyhow!(
                "❌ Foundry VTT installation not found at: {}", 
                vtt_config.path.display()
            ));
        }

        println!("🎲 Starting Foundry VTT...");
        
        self.session_manager.create_session(
            &vtt_config.session_name,
            &vtt_config.path.to_string_lossy(),
        )?;

        self.session_manager.send_command(
            &vtt_config.session_name,
            &vtt_config.startup_command,
        )?;

        println!("✅ Foundry VTT started successfully!");
        println!("   📍 URL: {}", vtt_config.url);
        println!("   🗂️  Data Path: {}", vtt_config.data_path.display());
        
        Ok(())
    }

    async fn stop_vtt_service(&self) -> Result<()> {
        let vtt_config = &self.config.services.vtt;
        
        self.session_manager.kill_session(&vtt_config.session_name)?;
        println!("✅ Foundry VTT stopped successfully!");
        
        Ok(())
    }

    async fn start_website_service(&self) -> Result<()> {
        let website_config = &self.config.services.website;
        
        if self.session_manager.session_exists(&website_config.session_name)? {
            println!("⚠️  Website session already exists.");
            return Ok(());
        }

        if !self.config.validate_website_path() {
            return Err(anyhow!(
                "❌ Website path not found at: {}", 
                website_config.path.display()
            ));
        }

        println!("🚀 Starting website development server...");
        
        self.session_manager.create_session(
            &website_config.session_name,
            &website_config.path.to_string_lossy(),
        )?;

        // Assuming npm dev script for now
        self.session_manager.send_command(
            &website_config.session_name,
            "npm run dev",
        )?;

        println!("✅ Website development server started!");
        println!("   📍 URL: {}", website_config.url);
        
        Ok(())
    }

    async fn stop_website_service(&self) -> Result<()> {
        let website_config = &self.config.services.website;
        
        self.session_manager.kill_session(&website_config.session_name)?;
        println!("✅ Website development server stopped!");
        
        Ok(())
    }

    async fn get_vtt_status(&self) -> ServiceInfo {
        let vtt_config = &self.config.services.vtt;
        let is_running = self.session_manager
            .session_exists(&vtt_config.session_name)
            .unwrap_or(false);

        ServiceInfo {
            name: vtt_config.name.clone(),
            status: if is_running { ServiceStatus::Running } else { ServiceStatus::Stopped },
            url: if is_running { Some(vtt_config.url.clone()) } else { None },
            session_name: vtt_config.session_name.clone(),
        }
    }

    async fn get_website_status(&self) -> ServiceInfo {
        let website_config = &self.config.services.website;
        let is_running = self.session_manager
            .session_exists(&website_config.session_name)
            .unwrap_or(false);

        ServiceInfo {
            name: website_config.name.clone(),
            status: if is_running { ServiceStatus::Running } else { ServiceStatus::Stopped },
            url: if is_running { Some(website_config.url.clone()) } else { None },
            session_name: website_config.session_name.clone(),
        }
    }
}
