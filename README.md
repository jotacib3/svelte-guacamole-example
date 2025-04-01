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
- SSH connection preconfigured

## Docker Services

The project includes four main services:

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

### SSH Server
- Alpine-based lightweight SSH server
- Preconfigured with root access
- Used for testing SSH connections through Guacamole
- Default credentials: username: `root`, password: `password123`

## SSH Server Setup

### Creating the SSH Server

Create a `Dockerfile.ssh` for a lightweight SSH server:

```dockerfile
FROM alpine:latest

# Install OpenSSH
RUN apk add --no-cache openssh \
    && ssh-keygen -A \
    && echo "root:password123" | chpasswd

# Configure SSH
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
```

### Building and Running

1. Build the SSH server image:
```bash
docker build -t ssh-test -f Dockerfile.ssh .
```

2. Run the SSH container:
```bash
docker run -d --name ssh-server -p 2222:22 ssh-test
```

3. Connect the SSH server to Guacamole network:
```bash
docker network connect svelte-example_guacamole_net ssh-server
```

### Connection Options

There are several ways to connect to the SSH server:

1. **Direct SSH Connection (from host machine)**:
   ```bash
   ssh root@localhost -p 2222
   ```
   - Host: localhost
   - Port: 2222
   - Username: root
   - Password: password123

2. **Guacamole Connection Options**:

   a. Using Docker container name (Recommended):
   ```json
   {
     "hostname": "ssh-server",
     "port": "22",
     "username": "root",
     "password": "password123"
   }
   ```
   - Best option for Docker environments
   - Uses internal Docker networking
   - More secure as it doesn't expose ports to host
   - Requires container to be on same network

   b. Using host.docker.internal:
   ```json
   {
     "hostname": "host.docker.internal",
     "port": "2222",
     "username": "root",
     "password": "password123"
   }
   ```
   - Works when container needs to access host
   - Requires port mapping on host
   - Less secure as ports are exposed

   c. Using localhost (Not Recommended):
   ```json
   {
     "hostname": "localhost",
     "port": "2222",
     "username": "root",
     "password": "password123"
   }
   ```
   - Won't work from inside containers
   - "localhost" refers to the container itself

### Best Practices

1. **Network Setup**:
   - Always use Docker's internal networking when possible
   - Connect SSH container to Guacamole network
   - Avoid exposing ports unless necessary

2. **Security**:
   - Change default passwords
   - Use SSH keys instead of passwords in production
   - Limit network access appropriately
   - Consider using environment variables for sensitive data

3. **Troubleshooting**:
   - Verify network connectivity: `docker network inspect svelte-example_guacamole_net`
   - Check container logs: `docker logs ssh-server`
   - Ensure SSH service is running: `docker exec ssh-server ps aux | grep sshd`
   - Test network connectivity: `docker exec guacamole ping ssh-server`

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

## SvelteKit Integration

El proyecto incluye una integración completa de SvelteKit con Guacamole:

### Conexión SSH
- Página dedicada para conexiones SSH en `/guacamole`
- Autenticación mediante JSON Web Token
- Conexión automática al servidor SSH configurado
- Interfaz embebida de Guacamole dentro de SvelteKit

### Implementación
- Utiliza el endpoint de API de Guacamole para autenticación
- Encriptación de datos de conexión con AES-128-CBC
- Manejo de tokens de autenticación
- Interfaz responsive con Tailwind CSS

## Additional Resources

- [Apache Guacamole Documentation](https://guacamole.apache.org/doc/gug/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
