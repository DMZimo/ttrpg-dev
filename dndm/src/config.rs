use anyhow::Result;
use directories::UserDirs;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub base_path: PathBuf,
    pub services: ServicesConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServicesConfig {
    pub vtt: VttConfig,
    pub website: WebsiteConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VttConfig {
    pub name: String,
    pub url: String,
    pub path: PathBuf,
    pub data_path: PathBuf,
    pub session_name: String,
    pub host: String,
    pub port: u16,
    pub startup_command: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebsiteConfig {
    pub name: String,
    pub url: String,
    pub path: PathBuf,
    pub session_name: String,
    pub port: u16,
}

impl Config {
    pub fn new() -> Result<Self> {
        let user_dirs =
            UserDirs::new().ok_or_else(|| anyhow::anyhow!("Could not get user directories"))?;
        let base_path = user_dirs.home_dir().join("zimolabs").join("ttrpg");

        let vtt_path = base_path.join("fvtt");
        let vtt_data_path = base_path.join("fvtt-data");
        let website_path = base_path.join("website");

        Ok(Config {
            base_path: base_path.clone(),
            services: ServicesConfig {
                vtt: VttConfig {
                    name: "🎲 Foundry VTT".to_string(),
                    url: "http://localhost:30000".to_string(),
                    path: vtt_path.clone(),
                    data_path: vtt_data_path.clone(),
                    session_name: "dndm-vtt".to_string(),
                    host: "localhost".to_string(),
                    port: 30000,
                    startup_command: format!("node main.js --dataPath={}", vtt_data_path.display()),
                },
                website: WebsiteConfig {
                    name: "🚀 Website Dev Server".to_string(),
                    url: "http://localhost:31000".to_string(),
                    path: website_path,
                    session_name: "dndm-website".to_string(),
                    port: 31000,
                },
            },
        })
    }

    pub fn validate_vtt_installation(&self) -> bool {
        self.services.vtt.path.exists()
            && self.services.vtt.data_path.exists()
            && self.services.vtt.path.join("main.js").exists()
    }

    pub fn validate_website_path(&self) -> bool {
        self.services.website.path.exists()
    }
}
