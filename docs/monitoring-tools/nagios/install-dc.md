---
sidebar_position: 20
sidebar_label: Install w/ Docker Compose
---

# Install Nagios with Docker Compose

Using 3rd party image:

- [jasonrivers/nagios](https://hub.docker.com/r/jasonrivers/nagios)

tag during my setup: [tag 4.5.7](https://hub.docker.com/layers/jasonrivers/nagios/4.5.7/images/sha256-2a7c2b20d118baf92b47b69a3901e68dd7664617801b94e560bc4d6564d6ae54)

## Prerequisites

### 1. OS

Ubuntu 24.04

#### Update system and change hostname

```bash
sudo apt update && sudo apt upgrade -y
sudo hostnamectl set-hostname edith
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

## Initial Nagios

### Define docker compose

```bash
cd ~
mkdir nagios
cd nagios
vi docker-compose.yml
```

```yaml title="docker-compose.yml"
services:
  nagios:
    image: jasonrivers/nagios:latest
    container_name: nagios
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - nagios-etc:/opt/nagios/etc
      - nagios-var:/opt/nagios/var
      - nagios-plugins:/opt/nagios/libexec

volumes:
  nagios-etc:
  nagios-var:
  nagios-plugins:
```

:::note

not exposing volumes to host directory for now, too much trouble with the permissions using jasonrivers/nagios.

:::

### Launch container

```bash
docker compose up -d
```

check status and log

```bash
docker ps --filter "name=nagios"
docker logs nagios | tail -n 20
```

### Auth and Access Control

Will configure inside the container

```bash
docker compose exec nagios bash
```

#### Add/update user pw

Once jumped into the container, add/update user with:

```bash
htpasswd /opt/nagios/etc/htpasswd.users newuser
```

Delete unwanted user in `/opt/nagios/etc/htpasswd.users`

### Contacts and Contact Groups

#### Define contacts and groupes

```bash title="/opt/nagios/etc/objects/contacts.cfg"
define contact {

    contact_name            newuser             ; Short name of user
    use                     generic-contact     ; Inherit default values from generic-contact template (defined above)
    alias                   Name_newuser Admin   ; Full name of user
    service_notification_period    24x7
    host_notification_period       24x7
    service_notification_options   w,u,c,r
    host_notification_options      d,u,r
    service_notification_commands  notify-service-by-email
    host_notification_commands     notify-host-by-email
    email                          newuser@example.com ; 
}

define contactgroup {

    contactgroup_name       admins
    alias                   Nagios Administrators
    members                 newuser
}
```

#### Update permissions

```bash
for d in \
  authorized_for_system_information \
  authorized_for_configuration_information \
  authorized_for_system_commands \
  authorized_for_all_hosts \
  authorized_for_all_services; do
  sed -i "s/^${d}=.*/${d}=nagiosadmin,newuser/" /opt/nagios/etc/cgi.cfg
done
```

#### Restart Nagios to apply permissions

Always verify before apply changes

```bash
nagios -v /opt/nagios/etc/nagios.cfg
```

On the host, restart nagios container

```bash
docker compose restart nagios
```

### Add Nginx server for Nagios

`/etc/nginx/sites-available/nagios.conf`:

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

    # Currently using auth_basic in the container
    # auth_basic           "Nagios Login";
    # auth_basic_user_file /etc/nginx/.htpasswd;

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
sudo ln -s /etc/nginx/sites-available/nagios.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Defining Monitoring

### Hosts

Create host config file

```bash title="/opt/nagios/etc/objects/host1.cfg"
##
## Host and basic services for Host 1
##

define host {
  use                     linux-server
  host_name               hostname1       ; ← replace
  alias                   Host 1          ; ← replace
  address                 10.0.0.10       ; ← replace
  max_check_attempts      5
  check_interval          5
  retry_interval          1
}

define service {
  use                     generic-service
  host_name               hostname1
  service_description     PING
  check_command           check_ping!100.0,20%!500.0,60%
}

define service {
  use                     generic-service
  host_name               hostname1
  service_description     SSH
  check_command           check_ssh
}
```

### Services

Example of defining websites on host1.

Create config file:

```bash title="/opt/nagios/etc/objects/host1-websites.cfg"
##
## HTTPS checks for all your websites on host1
##

define service {
  use                     generic-service
  host_name               hostname1
  service_description     website1
  check_command           check_http!-H website1.your.domain -u / -S -p 443
}

define service {
  use                     generic-service
  host_name               hostname1
  service_description     website2
  check_command           check_http!-H website2.your.domain -u / -S -p 443
}

#####
# for service in subdirectory
#####
define service {
  use                     generic-service
  host_name               hostname1
  service_description     service desc
  check_command           check_http!-H website1.your.domain -u /dirname/ -S --sni -p 443
  contact_groups          admins # to define particular groups
}
```

### Apply configs

#### Add configs to Nagios

Add newly created config files `host1.cfg` and `host1-websites.cfg` to `nagios.cfg`

```bash title="/opt/nagios/etc/nagios.cfg"
# Definitions for monitoring
cfg_file=/opt/nagios/etc/objects/localhost.cfg
cfg_file=/opt/nagios/etc/objects/host1.cfg
cfg_file=/opt/nagios/etc/objects/host1-websites.cfg
```

#### Verify the and restart Nagios

```bash
nagios -v /opt/nagios/etc/nagios.cfg
```

```bash
docker compose restart nagios
```