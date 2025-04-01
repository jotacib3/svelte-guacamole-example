I'll combine the default SvelteKit README content with the Guacamole integration information:

# Svelte Guacamole Integration

Everything you need to build a Svelte project with Guacamole integration, powered by [`sv`](https://github.com/sveltejs/cli).

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- Git

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Guacamole Database:
First, create the initialization SQL script:
```bash
mkdir init
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --postgresql > init/initdb.sql
```

3. Start Docker Services:
```bash
docker compose up -d
```

This will start:
- PostgreSQL database
- Guacamole daemon (guacd)
- Guacamole web application

4. Verify the services are running:
```bash
docker compose ps
```

## Developing

Once you've set up the project, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Guacamole Configuration

The project uses Guacamole with JSON authentication. Default configuration:
- Guacamole Web Interface: `http://localhost:8080/guacamole`
- PostgreSQL Database
- JSON Authentication enabled
- Shared secret key for authentication

## Docker Services

The project includes three main services:

### PostgreSQL
- Stores Guacamole configuration and user data
- Persistent volume for data storage
- Automatically initialized with required schema

### guacd (Guacamole Daemon)
- Handles remote desktop protocols
- Supports RDP, VNC, SSH
- Includes file sharing and recording capabilities

### Guacamole Web Application
- Main web interface
- JSON authentication enabled
- Connects to guacd for protocol handling
- Integrates with PostgreSQL for data storage

## Environment Variables

Key environment variables in docker-compose.yml:
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `JSON_SECRET_KEY`: Secret key for JSON authentication

## Troubleshooting

1. If services don't start:
```bash
docker compose logs
```

2. To reset the database:
```bash
docker compose down -v
docker compose up -d
```

3. If Guacamole isn't accessible:
- Check if all containers are running
- Verify network configuration
- Check logs for specific services

## Additional Resources

- [Apache Guacamole Documentation](https://guacamole.apache.org/doc/gug/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
