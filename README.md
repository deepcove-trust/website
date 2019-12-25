# Installation Instructions

This repository holds the Deep Cove website and Discover Deep Cove API. 

**System Requirements:**
* Digital Ocean Droplet - The $5 a month droplet is enough
* Dotnet Core SDK
* Apache Webserver
* Let's Encrypt (Free SSL)


**Installation Instructions:**

The steps outlined below assume that you store the website in the directory `/opt/deepcove`
1. Setup a droplet with the required software
2. Clone the repository:
   * `$ mkdir /opt/deepcove`
   * `$ cd /opt/deepcove`
   * `$ git clone https://github.com/ssm-deepcove/website`
   * `$ cd website`
3. Make an `appsettings.json` file in the `website` directory using the example below 
4. Build the website `$ dotnet publish -c Release`
5. Create a start script one level up from the repository:
   * `$ cd ..`
   * `$ sudo nano start.sh` // Script goes here (Use the example below)
6. Create a system service in `/etc/systemd/system` (See Below)
7. Setup a Virtual Host (See Below)
8. Migrate the database in the `$ dotnet run ef database update`
9. Start and enable the service


## Example Files

### AppSettings
```json
{
  "ConnectionStrings": {
    "MsSqlConnection": "Server=(localdb)\\MSSQLLocalDB;Database=;",
    "MySqlConnection": "Server=;Database=;Uid=;Pwd=;",
    "Use": "MsSqlConnection"
  },
  "LoginSettings": {
    "PasswordResetTokenLength": 30,
    "NewAccountResetTokenLength": 24
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "EmailConfiguration": {
    "Sender": {
      "Name": "Deep Cove Outdoor Education Trust",
      "Address": "noreply@deepcovehostel.co.nz",
      "ReplyTo": "office@deepcovehostel.co.nz"
    },
    "MailTrap": {
      "Server": "smtp.mailtrap.io",
      "ServerPort": 465,
      "Username": "",
      "Password": ""
    },
    "Mailgun": {
      "ApiKey": "",
      "ApiBaseUrl": "https://api.mailgun.net/v3",
      "YourDomain": ""
    }
  },
  "RecaptchaSettings": {
    "SiteKey": "",
    "SecretKey": "",
    "Version": "v2"
  }
}
```

### Start Script
```bash
#!/bin/bash
cd /opt/deepcove/website/bin/Release/netcoreapp2.2/publish
dotnet Deepcove-Trust-Website.dll --urls=http://localhost:6000
```

### System Service
Available commands `$ systemctl [start|stop|enable|disable] deepcove.service`
```bash
[Unit]
Description=Autostart and restart service for the Deep Cove website

[Service]
WorkingDirectory=/opt/deepcove
ExecStart=/bin/bash /opt/deepcove/start.sh
Restart=always
RestartSec=15
KillSignal=SIGINT
SyslogIdentifier=deep-cove-server
User=root
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
```

### Virtual Host
1. Create a virtual host in `/etc/apache/sites-available` 
2. `$ a2ensite {confname}.conf`
3. `$ systemctl reload apache2`
```
//todo
```
