use anyhow::{anyhow, Result};
use std::os::unix::process::CommandExt;
use std::process::Command;

pub struct SessionManager;

impl SessionManager {
    pub fn new() -> Self {
        Self
    }

    pub fn session_exists(&self, session_name: &str) -> Result<bool> {
        let output = Command::new("tmux")
            .args(&["has-session", "-t", session_name])
            .output()?;

        Ok(output.status.success())
    }

    pub fn create_session(&self, session_name: &str, working_dir: &str) -> Result<()> {
        if self.session_exists(session_name)? {
            return Err(anyhow!("Session '{}' already exists", session_name));
        }

        let output = Command::new("tmux")
            .args(&["new-session", "-d", "-s", session_name, "-c", working_dir])
            .output()?;

        if !output.status.success() {
            return Err(anyhow!("Failed to create session '{}'", session_name));
        }

        Ok(())
    }

    pub fn send_command(&self, session_name: &str, command: &str) -> Result<()> {
        if !self.session_exists(session_name)? {
            return Err(anyhow!("Session '{}' does not exist", session_name));
        }

        let output = Command::new("tmux")
            .args(&["send-keys", "-t", session_name, command, "Enter"])
            .output()?;

        if !output.status.success() {
            return Err(anyhow!(
                "Failed to send command to session '{}'",
                session_name
            ));
        }

        Ok(())
    }

    pub fn kill_session(&self, session_name: &str) -> Result<()> {
        if !self.session_exists(session_name)? {
            return Ok(()); // Already doesn't exist
        }

        let output = Command::new("tmux")
            .args(&["kill-session", "-t", session_name])
            .output()?;

        if !output.status.success() {
            return Err(anyhow!("Failed to kill session '{}'", session_name));
        }

        Ok(())
    }

    pub fn attach_to_session(&self, session_name: &str) -> Result<()> {
        if !self.session_exists(session_name)? {
            return Err(anyhow!("Session '{}' does not exist", session_name));
        }

        // Use exec to replace current process with tmux attach
        std::process::Command::new("tmux")
            .args(&["attach-session", "-t", session_name])
            .exec();

        // This line should never be reached if exec succeeds
        Err(anyhow!("Failed to attach to session '{}'", session_name))
    }
}
