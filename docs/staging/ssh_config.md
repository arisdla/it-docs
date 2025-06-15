# SSH Config

## My default

```bash title="~/.ssh/config"
# === Global (default) SSH settings for all hosts ===
Host *
    IgnoreUnknown UseKeychain
    UseKeychain yes
    ServerAliveInterval 30
    ServerAliveCountMax 10
```

- IgnoreUnknown

  - Purpose: Tells the SSH client to ignore any options in the config file that it doesn’t recognize or understand.

- UseKeychain

  - Purpose: On macOS, this tells SSH to use the system Keychain to store and retrieve passphrases for your SSH keys.

- ServerAliveInterval 30

  - Tells your SSH client to send a “keepalive” message to the server every 30 seconds.
  - Prevents your SSH connection from timing out or being closed by firewalls or network equipment due to inactivity.

- ServerAliveCountMax 10

  - If the server fails to respond to the keepalive messages, the SSH client will try 10 times (so, over 300 seconds, if interval is 30).
  - If there’s no response after 10 keepalives (so, 5 minutes), the SSH client will disconnect.


## Host Blocks

### Servers

```bash title="~/.ssh/config"
# Server 1 config
Host hostname
    HostName 192.1.1.100
    User username
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_user_ed25519
# IdentityFile ~/.ssh/id_ed25519_sk_rk_user_key6857
```

### GitHub

```bash title="~/.ssh/config"
# GitHub SSH config for user1
Host git-user1
    HostName github.com
    User git
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/user1_ed25519

# GitHub SSH config for user2
Host git-user2
    HostName github.com
    User git
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/user2_ed25519
```
