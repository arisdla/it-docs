---
sidebar_position: 800
sidebar_label: Backup & restore
---

# Backup and Restore Zabbix

:::warning

This documentation is currently a WIP.

:::

This backup and restore doc is currently for me running Zabbix Server in docker.

## Backup

```bash
# create backup directory if it doesn't exist
mkdir backup
```

### 1. Freeze your current image digests

```bash
out=backup/zabbix-compose-with-digests-$(date +'%Y-%m-%d_%H-%M-%S').yml && \
docker compose -f docker-compose.yml config --resolve-image-digests > "$out" && \
echo "Exported to $out"
```

### 2. Save each image to tarballs

Next, export all of the images your stack is using. For each service, run:

*replace `backup/bk_filename.yml` to the actual backup filename.*

```bash
bk_config=backup/bk_filename.yml
IMAGE=$(grep image $bk_config \
        | grep zabbix-server-mysql \
        | awk '{print $2}')
docker pull $IMAGE
docker save $IMAGE -o backup/images/$(basename $IMAGE | tr /:@ _).tar

IMAGE=$(grep image $bk_config \
        | grep zabbix-web-service \
        | awk '{print $2}')
docker pull $IMAGE
docker save $IMAGE -o backup/images/$(basename $IMAGE | tr /:@ _).tar

IMAGE=$(grep image $bk_config \
        | grep zabbix-web-nginx-mysql \
        | awk '{print $2}')
docker pull $IMAGE
docker save $IMAGE -o backup/images/$(basename $IMAGE | tr /:@ _).tar

IMAGE=$(grep image $bk_config \
        | grep zabbix-agent \
        | awk '{print $2}')
docker pull $IMAGE
docker save $IMAGE -o backup/images/$(basename $IMAGE | tr /:@ _).tar

IMAGE=$(grep -E '^\s*image:\s*(.+/)?mysql(:|@|$)' "$bk_config" \
    | awk '{ print $2 }')
docker pull $IMAGE
docker save $IMAGE -o backup/images/$(basename $IMAGE | tr /:@ _).tar
```

Storing all of these .tar files means you can later docker load them and be certain you’ve got the exact same binaries.

### 3. Dump your database (or snapshot the volume)

#### Option A: Logical dump via mysqldump

A clean way to capture the Zabbix schema and data:

```bash
mkdir -p backup/db
docker exec zabbix-db \
  sh -c 'exec mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
         --routines --events --all-databases' \
  > backup/db/all-databases.sql
```

#### Option B: Volume snapshot

If you prefer a block-level copy of the MySQL datadir:

```bash
mkdir -p backup/volumes
docker run --rm \
  -v zbx_db_data:/volume \
  -v "$(pwd)/backup/volumes":/backup \
  busybox \
  tar czf /backup/zbx_db_data_$(date +%F_%H%M).tar.gz -C /volume .
```

Either method works—dumps are easier to migrate across MySQL versions; snapshots restore fastest in an all-Docker rollback.

## Restore from backup

### 1. Load images

### 2. Recreate volumes

- If you did a volume snapshot:

    ```bash
    docker volume create zbx_db_data
    tar xzf backup/volumes/zbx_db_data_YYYY-MM-DD_HHMM.tar.gz \
    -C /var/lib/docker/volumes/zbx_db_data/_data
    ```

- If you did a dump: start the zabbix-db container and then:

    ```bash
    docker exec -i zabbix-db \
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" < backup/db/all-databases.sql
    ```

### 3. Deploy

```bash
docker-compose -f backup/change-me.yml up -d
```

## Automating & scheduling

TBD
