---
sidebar_position: 30
sidebar_label: Configure Email
---

# Configure Notifications and Alerts (Email)

This example is using `msmtp` to send emails.

More about msmtp: [marlam.de/msmtp/](https://marlam.de/msmtp/)

## Configure the MTA (msmtp)

### Install `msmtp`

```bash
apt-get update
apt-get install -y msmtp
```

### Create or edit the msmtp config file

Add  SMTP configuration (example):

```bash title="/etc/msmtprc"
defaults
auth           on
tls            on
tls_starttls   off # I set off for mailjat
tls_trust_file /etc/ssl/certs/ca-certificates.crt # if have one
logfile        /var/log/msmtp.log

account        default
host           smtp.gmail.com
port           587 # I use 465 for mailjet
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password
```

### Set permissions

```bash
chmod 600 /etc/msmtprc
# 👆 This is for permission for normal configuration
# 👇 This is for permission for Nagios to access
chmod 644 /etc/msmtprc

# verify permission
ls -l /etc/msmtprc
```

### Test Email Sending

Try sending a test email to verify `msmtp` works:

```bash
echo "Test email" | msmtp your-email@example.com
```

## Configure Nagios

### Update the notify commands

Replace `/bin/mail` or `mail` command with `msmtp`, like:

```bash title="/opt/nagios/etc/objects/commands.cfg"
define command{
    command_name    notify-host-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/msmtp $CONTACTEMAIL$
}

define command{
    command_name    notify-service-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n\n$SERVICEOUTPUT$\n" | /usr/bin/msmtp $CONTACTEMAIL$
}

```

my configs:

```bash
# 'notify-host-by-email' command definition
define command{
    command_name    notify-host-by-email
    command_line    /usr/bin/printf "%b" "To: $CONTACTEMAIL$\nSubject: ** $NOTIFICATIONTYPE$ Host Alert: $HOSTNAME$ is $HOSTSTATE$ **\n\n***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nAddress: $HOSTADDRESS$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/msmtp -t
}

# 'notify-service-by-email' command definition
define command{
    command_name    notify-service-by-email
    command_line    /usr/bin/printf "%b" "To: $CONTACTEMAIL$\nSubject: ** $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **\n\n***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n$SERVICEOUTPUT$\n" | /usr/bin/msmtp -t
}
```

### Restart Nagios

verify config changes and restart Nagios
