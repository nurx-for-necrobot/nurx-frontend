# nurx-frontend
A web-based frontend for NecroBot.

## Compiling

```
npm install
npm run build
```

## Installation

1. Ensure you have the nurx version of Necro (for the meantime, until it gets merged into NecroBot/master). Get it here: https://github.com/tstiegler/NecroBot

2. Set the following config.json parameters.

```
UseWebsocket: true,
WebSocketType: "nurx"
```

3. Start NecroBot and wait for it to log in.

4. (Do this once) Open a browser and navigate to https://localhost:14251 and accept the self signed certificate.

5. Open nurx-frontend/dist/index.html

6. Click the new tab button and then click "Create New Tab".

7. Enjoy. 