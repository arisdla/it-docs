---
sidebar_position: 120
sidebar_label: Monitor Docker
---

# Monitoring Docker

Using **Zabbix Agent 2**

Always verify the [official docs](https://www.zabbix.com/documentation)

## Prerequisites

Host has Agent 2 installed.

Agent 2 comes with the docker plugin, so no other plugins needed.

### Docker permissions

Add `zabbix` user to the `docker` group

```bash
sudo usermod -aG docker zabbix
```

Test connection

```bash
docker exec -it zabbix-server zabbix_get -s HOST_SERVER_IP -k docker.info
```

## Add monitoring

Docker template should be included already.

Add new host and choose template **Docker by Zabbix agent 2**
