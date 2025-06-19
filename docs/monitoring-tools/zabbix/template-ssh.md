---
sidebar_position: 410
sidebar_label: Template SSH
---

# Template for Monitorying SSH

## What to do not using template?

We can add items to check for host.

Assuming the target host is already added to monitoring:

- Find the target host in the **Host** list
- Open **Items** of the host
- Choose **Create item**:

  - **Name**: SSH Check
  - **Type**: Simple check
  - **Key**: `net.tcp.service[ssh]`
  - **Type of information**: Numeric (unsigned)
  - **Update interval**: e.g., 60 seconds
  - **Add**

And we have to add that to each host we want to use, so... let's use Template.

## Create template

### Add template

- Go to **Templates**
- Click **Create template**
- Template name: e.g. SSH Monitoring
- Groups: e.g. “Custom Templates/Services”
- **Add**

### Add item for template

Find the template in the list:

- Open **Items** of the template
- Choose **Create item**:
  - **Name**: SSH Check
  - **Type**: Simple check
  - **Key**: `net.tcp.service[ssh]`
  - **Type of information**: Numeric (unsigned)
  - **Update interval**: e.g., 60 seconds
  - **Add**

### Add trigger for template

Find the template in the list:

- Open **Triggers** of the template
- Choose **Create trigger**:
  - **Name**: `SSH is DOWN on {HOST.NAME}`
  - **Severity**: e.g. “High”
  - **Expression**: `min(/SSH Monitoring/net.tcp.service[ssh],3m)=0` 👈 This means: “Alert if, in the last 3 minutes, the minimum value is 0 (SSH was down for all three checks).”
  - **Key**: `net.tcp.service[ssh]`
  - **Add**

### Add to host

Select the template on the host.
