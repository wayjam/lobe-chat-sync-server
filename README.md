# lobe-chat-sync-server

simple sync server for lobe-chat.

Currently (2024-04), LobeChat only supports client-to-client synchronization. This project can achieve cloud synchronization by using Puppeteer to continuously visit the LobeChat application on the server side.

Deployment requires some environment variables:

| Name                             | Required | Default                   | Example                   |
|----------------------------------|----------|---------------------------|---------------------------|
| BROWSER_USER_DATA_DIR            | Yes      |                           | ./data                    |
| LOBECHAT_URL                     | No       | https://chat.lobehub.com/ | https://chat.example.com/ |
| LOBECHAT_ACCESS_CODE             | No       | (None)                    | password                  |
| LOBECHA_SERVER_NAME              | No       | Sync Server               | Cloud Server              |
| LOBECHAT_WEBRTC_CHANNEL_NAME     | Yes      |                           | my_channel                |
| LOBECHAT_WEBRTC_CHANNEL_PASSWORD | Yes      |                           | my_password               |
| REFRESH_INTERVAL                 | No       | 300                       | 60                        |

> [!TIP]
> By default, lobe-chat-sync-server refreshes the application page every 5 minutes to prevent potential WebRTC connection and synchronization exceptions.
> The refresh interval can be customized by `REFRESH_INTERVAL`, setting it to 0 to disable page auto refresh.

> [!WARNING]
> lobe-chat-sync-server is only designed for synchronization of multiple devices by a single user, please pay attention to your own data privacy.
> If necessary, a separate instance should be deployed for each user and isolated using a different path `BROWSER_USER_DATA_DIR`.