mod clients;
mod proto;
mod server;
mod tools;
mod util;

use anyhow::Result;
use rmcp::ServiceExt;
use rmcp::transport::io::stdio;
use tracing_subscriber::{EnvFilter, fmt};

#[tokio::main]
async fn main() -> Result<()> {
    fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("bostrom-mcp starting");

    let server = server::BostromMcp::from_env().await?;
    let service = server.serve(stdio()).await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    service.waiting().await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;

    Ok(())
}
