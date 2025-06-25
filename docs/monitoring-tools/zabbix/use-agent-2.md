---
sidebar_position: 120
sidebar_label: Zabbix Agent 2
---

# Install & Configure Zabbix Agent 2

This doc only cover install Agent 2 component on Linux, Ubuntu in my case.

Always verify the [official docs](https://www.zabbix.com/documentation)

## Prerequisites

Mine for this doc:

```bash
hostnamectl
#   Virtualization: kvm
# Operating System: Ubuntu 24.04.2 LTS              
#           Kernel: Linux 6.8.0-60-generic
#     Architecture: x86-64
#   Hardware Model: Compute Instance
```

### smartmontools

**smartmontools** is required for Zabbix agent 2.

```bash
dpkg -l | grep smartmontools
which smartctl
```

#### Install smartmontools

```bash
sudo apt update
sudo apt install smartmontools
```

## Install from Zabbix repository

### a. Install Zabbix repository

```bash
sudo wget https://repo.zabbix.com/zabbix/7.2/release/ubuntu/pool/main/z/zabbix-release/zabbix-release_latest_7.2+ubuntu24.04_all.deb
sudo dpkg -i zabbix-release_latest_7.2+ubuntu24.04_all.deb
sudo apt update
```

### b. Install Zabbix agent 2

```bash
sudo apt install zabbix-agent2
```

### c. Optional: install agent plugins

You may want to install Zabbix agent 2 plugins.

```bash
sudo apt install zabbix-agent2-plugin-mongodb zabbix-agent2-plugin-mssql zabbix-agent2-plugin-postgresql
```

### d. Start agent process

Start Zabbix agent 2 process and make it start at system boot.

```bash
sudo systemctl restart zabbix-agent2
sudo systemctl enable zabbix-agent2
```

## Open firewall port `10050`

For better security, restrict access to just your Zabbix server.

### Allow only from Zabbix server’s IP

```bash
sudo ufw allow from ZABBIX_SERVER_IP to any port 10050 proto tcp
```

### Check firewall rules

```bash
sudo ufw status numbered
```

### Reload or enable UFW

```bash
sudo ufw enable
```

## Configure Agent

Check `/etc/zabbix/zabbix_agent2.conf`:

`Server`= should contain your Zabbix server’s IP address.

Restart agent:

```bash
sudo systemctl restart zabbix-agent2
```

## Encrypt connection

Here using TLS with Pre-Shared Key (PSK), for other method, consult official docs.

For supported tools and key size limit, check the official docs.

### a. Generate a PSK on the agent machine

Example to generate a 256-bit (32 bytes) PSK with OpenSSL:

```bash
sudo openssl rand -hex 32 | sudo tee /etc/zabbix/zabbix_agent2.psk > /dev/null
```

### b. Configure the agent for PSK

```bash title="/etc/zabbix/zabbix_agent2.conf"
TLSConnect=psk
TLSAccept=psk
TLSPSKIdentity=MyZabbixPSK
TLSPSKFile=/etc/zabbix/zabbix_agent2.psk
```

:::warning

Do not put sensitive information in PSK identity string - it is transmitted over the network unencrypted.

:::

Restart the agent

```bash
sudo systemctl restart zabbix-agent2
```

## Add monitoring to Zabbix Server

Template: `Linux by Zabbix agent`

## Extra: server container connect to agent on the host

This for my setup with my config of `docker-compose.yml` and host running **Agent 2**

### a. Check the zabbix-server container IP address

```bash
docker exec -it zabbix-server ip a
# 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
#    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
#    inet 127.0.0.1/8 scope host lo
#       valid_lft forever preferred_lft forever
#    inet6 ::1/128 scope host 
#       valid_lft forever preferred_lft forever
#2: eth0@if11: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
#    link/ether b6:9f:96:2d:4a:7a brd ff:ff:ff:ff:ff:ff
#    inet 172.18.0.4/16 brd 172.18.255.255 scope global eth0
#       valid_lft forever preferred_lft forever
```

`172.18.0.4` is the IP address of the zabbix-server container.

### b. Add Zabbix server IP to UFW

```bash
sudo ufw allow from 172.18.0.4 to any port 10050 proto tcp
sudo ufw enable
```

### c. Configure Agent for Zabbix server

Make Sure Zabbix Agent 2 Listens on All Interfaces

```bash title="/etc/zabbix/zabbix_agent2.conf"
ListenIP=0.0.0.0
```

Add the Zabbix server IP address to Agent configuration

```bash title="/etc/zabbix/zabbix_agent2.conf"
ListenIP=172.18.0.4
```

restart agent

```bash
sudo systemctl restart zabbix-agent2
```

### d. Test from the Zabbix server container

```bash
docker exec -it zabbix-server nc -vz HOST_SERVER_IP 10050
```

For debugging, check zabbix agent log:

```bash
sudo tail -f /var/log/zabbix/zabbix_agent2.log
```
