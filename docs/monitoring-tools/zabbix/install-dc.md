---
sidebar_position: 20
sidebar_label: Install w/ Docker Compose
---

# Install Zabbix with Docker Compose

Currently won't cover for Installing Zabbix from sources or packages, see the official docs instead: [https://www.zabbix.com/documentation/7.0/en/manual/installation/install](https://www.zabbix.com/documentation/7.0/en/manual/installation/install)

Official Docker images:

| Component                                           | Docker repository                                            |
| :-------------------------------------------------- | :----------------------------------------------------------- |
| **Zabbix agent**                                    | [zabbix/zabbix-agent](https://hub.docker.com/r/zabbix/zabbix-agent/) |
| **Zabbix server**                                   |                                                              |
| with MySQL support                                  | [zabbix/zabbix-server-mysql](https://hub.docker.com/r/zabbix/zabbix-server-mysql/) |
| with PostgreSQL support                             | [zabbix/zabbix-server-pgsql](https://hub.docker.com/r/zabbix/zabbix-server-pgsql/) |
| **Zabbix web interface**                            |                                                              |
| based on Apache2 web server with MySQL support      | [zabbix/zabbix-web-apache-mysql](https://hub.docker.com/r/zabbix/zabbix-web-apache-mysql/) |
| based on Apache2 web server with PostgreSQL support | [zabbix/zabbix-web-apache-pgsql](https://hub.docker.com/r/zabbix/zabbix-web-apache-pgsql/) |
| based on Nginx web server with MySQL support        | [zabbix/zabbix-web-nginx-mysql](https://hub.docker.com/r/zabbix/zabbix-web-nginx-mysql/) |
| based on Nginx web server with PostgreSQL support   | [zabbix/zabbix-web-nginx-pgsql](https://hub.docker.com/r/zabbix/zabbix-web-nginx-pgsql/) |
| **Zabbix proxy**                                    |                                                              |
| with SQLite3 support                                | [zabbix/zabbix-proxy-sqlite3](https://hub.docker.com/r/zabbix/zabbix-proxy-sqlite3/) |
| with MySQL support                                  | [zabbix/zabbix-proxy-mysql](https://hub.docker.com/r/zabbix/zabbix-proxy-mysql/) |
| **Zabbix Java gateway**                             | [zabbix/zabbix-java-gateway](https://hub.docker.com/r/zabbix/zabbix-java-gateway/) |

I'm using **alpine** since it's more lightweighted.

## Prerequisites

### 1. OS

Ubuntu 24.04

#### Update system and change hostname

```bash
sudo apt update && sudo apt upgrade -y
sudo hostnamectl set-hostname tars
sudo vi /etc/hosts

# confirm
hostnamectl
```

#### Add user

```bash
sudo adduser aris
sudo usermod -aG sudo aris

sudo mkdir -p /home/aris/.ssh
sudo vi /home/aris/.ssh/authorized_keys

sudo chown -R aris:aris /home/aris/.ssh
sudo chmod 700 /home/aris/.ssh
sudo chmod 600 /home/aris/.ssh/authorized_keys
```

#### Check sshd config

```bash
sudo vi /etc/ssh/sshd_config
```

```bash
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo service ssh restart
sudo systemctl status ssh
```

#### Update UFW default

```bash
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### 2. Docker

👉 [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

```bash
sudo apt update && sudo apt upgrade -y
```

**Set up Docker's `apt` repository**

```bash
sudo apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### Install the Docker packages

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

#### permissions to user, skip sudo

```bash
sudo usermod -aG docker aris

# (Log out and back in, or run `newgrp docker` to apply immediately)
```

#### check

```bash
docker run --rm hello-world
docker compose version
```

### 3. Nginx

#### Install nginx

```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo systemctl status nginx
```

#### Update UFW for Nginx

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Initial Zabbix

### Define docker compose

```bash
cd ~
mkdir zabbix
cd zabbix
vi docker-compose.yml
```

```yaml title="docker-compose.yml"
services:
  zabbix-db:
    image: mysql:8.0
    container_name: zabbix-db
    environment:
      MYSQL_DATABASE: zabbix
      MYSQL_USER: zabbix
      MYSQL_PASSWORD: zabbix_pass
      MYSQL_ROOT_PASSWORD: root_pass
      MYSQL_ALLOW_EMPTY_PASSWORD: "no"
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_bin
    volumes:
      - zbx_db_data:/var/lib/mysql
    restart: unless-stopped

  zabbix-server:
    image: zabbix/zabbix-server-mysql:alpine-7.2-latest
    container_name: zabbix-server
    environment:
      DB_SERVER_HOST: zabbix-db
      MYSQL_DATABASE: zabbix
      MYSQL_USER: zabbix
      MYSQL_PASSWORD: zabbix_pass
      MYSQL_ROOT_PASSWORD: root_pass
      ZBX_SERVER_NAME: "Zabbix Docker"
    depends_on:
      - zabbix-db
    links:
      - zabbix-db:mysql
    restart: unless-stopped
  
  zabbix-web:
    image: zabbix/zabbix-web-nginx-mysql:alpine-7.2-latest
    container_name: zabbix-web
    environment:
      DB_SERVER_HOST: zabbix-db
      MYSQL_DATABASE: zabbix
      MYSQL_USER: zabbix
      MYSQL_PASSWORD: zabbix_pass
      MYSQL_ROOT_PASSWORD: root_pass
      ZBX_SERVER_HOST: zabbix-server
      PHP_TZ: America/New_York
    depends_on:
      - zabbix-server
      - zabbix-db
    ports:
      - "8080:8080"
    restart: unless-stopped

  zabbix-agent:
    image: zabbix/zabbix-agent:alpine-7.2-latest
    container_name: zabbix-agent
    environment:
      ZBX_SERVER_HOST: zabbix-server
    depends_on:
      - zabbix-server
    restart: unless-stopped

volumes:
  zbx_db_data:
```

### Launch container

```bash
docker compose up -d
```

check status and log

```bash
docker ps --filter "name=zabbix"
```

### Change Admin password

Since there is no official environment variable for password, The password for the default `Admin` user is always `zabbix` at first.

It's better not expose the zabbix server and web to the outside until the default password has been changed.

#### Option A: Change It in the Web UI

Make sure only you can access the web:

- Log in to the Zabbix web interface as Admin (password: zabbix by default).
- Click on your user in the top right corner (or go to Administration → Users).
- Edit the Admin user.
- Enter a new password and save.

#### Option B: Change It Using SQL

Advanced, Useful for Automation or Recovery

**a. Enter the DB container:**

```bash
docker exec -it zabbix-db mysql -u root -p
# Enter your root password (root_pass)
```

**b. Select the Zabbix database:**

```sql
USE zabbix;
```

**c. Change the Admin password:**

Zabbix 6.x and newer versions **use bcrypt hashing**

- Using Python:

```python
import bcrypt
password = b"YOUR_NEW_PASSWORD"
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed)
```

- Or using [bcrypt-generator.com](https://bcrypt-generator.com)

Update password for `Admin`

```sql
UPDATE users SET passwd='$2y$12$abcdefgh...' WHERE username='Admin';
```

**d. Exit MySQL, then restart Zabbix server:**

```bash
docker compose restart zabbix-server
```

### Add Nginx server for Zabbix

`/etc/nginx/sites-available/zabbix.conf`:

```bash
server {
    listen 80;
    listen [::]:80;
    server_name change.domain.name;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name change.domain.name;

    ssl_certificate     /etc/ssl/file.to.cert.pem;
    ssl_certificate_key /etc/ssl/file.to.cert.key;

    location / {
        proxy_pass         http://127.0.0.1:8080;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    }
}
```

#### Enable site

```bash
sudo ln -s /etc/nginx/sites-available/zabbix.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Auth and Access Control

In the web UI:

- Go to **Users → Users** in Zabbix.
- Add users

## Fix error: Agent Not available

By default, you'll see the error in the web UI:

```bash
Interface         Status          Error
127.0.0.1:10050   Not available   Get value from agent failed: Cannot establish TCP connection to [[127.0.0.1]:10050]: [111] Connection refused
```

- Because Zabbix server is trying to connect to agent at `127.0.0.1:10050` (localhost).
- In  Docker, each container has its own `127.0.0.1`. So from the **server** container, `127.0.0.1` refers to itself, not the agent.
- The correct address should be the **service name** (`zabbix-agent`), or its container IP.

### Change the monitored host’s “Agent interface” in Zabbix UI

- Go to **Configuration → Hosts** in Zabbix.
- Find the host you are monitoring (usually "Zabbix server").
- **Edit** the host.
- In the **Agent interfaces** section, change `127.0.0.1` to `zabbix-agent` (the service name in Docker Compose), or use the Docker internal IP (not recommended, service name is best).
- **Port** should remain 10050.
- Save and test.

### (Optional) Expose Agent Port to Host

If you want to access the agent from your host, add this to your `zabbix-agent` service:

```yaml
    ports:
      - "10050:10050"
```

But this is only needed if you're testing outside Docker or with external Zabbix servers.

## Fix Geomap

- By default, Geomap tries to use the host's IP address to guess the location using a geolocation database.
- If the server is running in Docker and has an IP like 127.0.0.1, localhost, or a private/internal Docker network IP (e.g., 172.x.x.x), the geolocation database can’t map it to a real-world location.
- When it can’t map the IP, it may display something strange like "Rīga."

### Fix it

- Go to **Data collection → Hosts**.
- Click on your host (e.g., “Zabbix server”).
- Click the “Inventory” tab.
- Set Location **latitude** and Location **longitude** to the real location (e.g., for Montréal).
  - Latitude: `45.5017`
  - Longitude: `-73.5673`
- Save the changes.
