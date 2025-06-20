---
sidebar_position: 30
sidebar_label: Configure Alerts
---

# Configure Zabbix Alerts

## Configure Email

### Add a New Media Type for Email

- Go to **Alerts → Media types**
- Find **Email** or **Email (HTML)** in the media list
- **Edit**

**Configure like this:**

```txt
Type: Email
SMTP server: (e.g., smtp.gmail.com or your provider’s server)
SMTP server port: (e.g., 587 for TLS, 465 for SSL)
SMTP HELO: (usually leave as zabbix-server or your domain)
SMTP email: (your from email address, e.g., Zabbix Notifications <zabbix@yourdomain.com>)
Connection security: (choose STARTTLS for port 587, or SSL/TLS for 465)
Authentication: Yes
Username: (your SMTP username)
Password: (your SMTP password)
```

**Example for Gmail:**

```txt
SMTP server: smtp.gmail.com
SMTP server port: 587
SMTP email: youraddress@gmail.com
Connection security: STARTTLS
Username: youraddress@gmail.com
Password: (your app password if 2FA is enabled)
```

Check **Enabled** and **Save**

### Set Up an Email Recipient

- Go to **Users → Users**
- Choose an user
- Click **Media** tab
- **Add** Media

### Add an Action to Send Email Alerts

TBD
