# PomoDi Bot

This Discord bot enables users to create and manage Pomodoro sessions directly within Discord voice channels. It helps maintain focus during work sessions and ensures timely breaks by providing real-time notifications and updates.

## Features

- **Pomodoro Session Management**: Start and stop Pomodoro sessions in your Discord voice channels.
- **Real-Time Notifications**: Alerts for the start of work sessions and breaks, with periodic updates on remaining time.
- **Flexible Timers**: Customize work and break durations to suit your needs.
- **Voice Channel Integration**: Sessions are linked to specific voice channels, ensuring all participants are on the same page.

## Try
[Bot Invite Link](https://discord.com/oauth2/authorize?client_id=1271435477450231870&scope=bot&permissions=10240)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/thatcodechap/pomodi.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd pomodi
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Set Up Discord Bot**:
   - Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
   - Add your bot token to the `app.js` file:
     ```javascript
     const TOKEN = '<Your Discord Bot Token Here>';
     ```

5. **Register Commands**:
   - In your bot's application page, navigate to **"Bot"** > **"OAuth2"** > **"URL Generator"**.
   - Select the `applications.commands` scope and generate an OAuth2 URL.
   - Use the URL to invite the bot to your server.
   - Once the bot is in your server, you can register commands using the Discord API:
     - Create a new `commands.js` file or add the following code to an existing file:

       ```javascript
       import { REST, Routes } from 'discord.js';

       const commands = [
           {
               name: 'start',
               description: 'Start a Pomodoro session',
               options: [
                   {
                       name: 'timer',
                       type: 'STRING',
                       description: 'Set the work and break time (e.g., 25-5)',
                       required: true,
                       choices: [
                        {
                            "name": "25 Minutes work, 5 Minutes break",
                            "value": "25-5"
                        }
                       ]
                   },
               ],
           },
           {
               name: 'stop',
               description: 'Stop the active Pomodoro session',
           },
       ];

       const rest = new REST({ version: '10' }).setToken('<Your Discord Bot Token Here>');

       (async () => {
           try {
               console.log('Started refreshing application (/) commands.');

               await rest.put(
                   Routes.applicationGuildCommands('<Your Client ID>', '<Your Guild ID>'),
                   { body: commands },
               );

               console.log('Successfully reloaded application (/) commands.');
           } catch (error) {
               console.error(error);
           }
       })();
       ```

     - Replace `<Your Client ID>` and `<Your Guild ID>` with your actual client and guild IDs.
     - Run the script to register the commands:

       ```bash
       node commands.js
       ```

6. **Run the Bot**:
   ```bash
   npm start
   ```

## Usage

1. **Start a Pomodoro Session**:
   - Join a voice channel and use the `/start timer <work-time>-<break-time>` command to begin a session. For example:
     ```
     /start timer 25-5
     ```
   - The bot will notify all members in the voice channel when the session starts and provide periodic updates on the remaining time.

2. **Stop a Session**:
   - Use the `/stop` command to end an active session in your voice channel.

3. **Check Status**:
   - The bot automatically provides updates on the remaining time for work and break periods.

## Files Overview

- **`app.js`**: Main bot file handling command interactions, session management, and bot startup.
- **`DiscordSession.js`**: Manages Discord-specific session behavior, including notifications in text channels.
- **`Pomodoro.js`**: Core Pomodoro timer logic, including session control and observer notifications.

## Screenshots
<img src="https://i.imgur.com/a8paG6A.png" width="200px">   <img src="https://i.imgur.com/2Ck1A1i.png" width="200px">

## Contributing

Feel free to submit issues or pull requests for new features or improvements. Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
