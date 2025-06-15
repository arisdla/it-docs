# SCP (Secure Copy)

## Basic

```bash
scp [options] source destination

# copy file to server
scp file.txt arthur@192.168.1.10:/home/arthur/

# copy file from server
scp arthur@192.168.1.10:/home/arthur/file.txt .

# use SSH key
scp -i ~/.ssh/my_special_key file.txt arthur@192.168.1.10:/home/arthur/
```

## Using with a host block

```bash
scp file.txt myserver:/home/arthur/
scp myserver:/home/arthur/file.txt
```

## Options

`-r` — Copy directories recursively

```bash
scp -r mydir myserver:/home/arthur/
```

`-P PORT` — Specify an SSH port (note the capital P!)

```bash
scp -P 2222 file.txt myserver:/home/arthur/
```
