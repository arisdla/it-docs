# ssh-keygen

## Basic

```bash
ssh-keygen
```

### Specify key type and file name

```bash
ssh-keygen -t ed25519 -f ~/.ssh/my_new_key
ssh-keygen -t ed25519 -f ~/.ssh/github_user1

# RSA (older, but still use it sometimes)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/my_new_rsa_key
```

### Add key to an SSH agent

```bash
ssh-add ~/.ssh/my_new_key
ssh-add ~/.ssh/github_user1
ssh-add ~/.ssh/my_new_rsa_key

# macOS only
ssh-add -K ~/.ssh/my_new_key
ssh-add -K ~/.ssh/github_user1
ssh-add -K ~/.ssh/my_new_rsa_key

# List keys in the agent
ssh-add -l

# Remove a key from the agent
ssh-add -d ~/.ssh/my_new_key

# Remove all keys from the agent
ssh-add -D

# Start the SSH agent if not running
eval "$(ssh-agent -s)"
```

## Security Key `-sk`

I'm using Yubikey.

### SK: Basic

```bash
ssh-keygen -t ed25519-sk -f ~/.ssh/my_sk_key

# mine
ssh-keygen -t ed25519-sk \
  -O resident \
  -O application=ssh:application_name \
  -C "my comments" \
  -f ~/.ssh/my_sk_key
```


### Discovering Resident Keys

```bash
ssh-keygen -K
```