import { Client, GatewayIntentBits} from 'discord.js'
import {DiscordSession} from './DiscordSession.js'

const TOKEN = '<Your Discord Bot Token Here>'
const START_COMMAND = 'start'
const START_COMMAND_OPTION = 'timer'
const STOP_COMMAND = 'stop'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
let activeSessions = {}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  try{
    if (!interaction.isChatInputCommand()) return;

    if (interaction.isChatInputCommand()) {
      if(interaction.commandName === START_COMMAND){
        let member = interaction.member
        if(member.voice.channel == null)
          interaction.reply({content: "Join a voice channel to start a session!", ephemeral: true})
        else if(member.voice.channel.id in activeSessions)
          interaction.reply({content: "Session already exists!", ephemeral: true})
        else{
          await interaction.reply({content: "Letsss Goooo"})
          let textChannel = interaction.channel
          let sessionType = interaction.options.getString(START_COMMAND_OPTION).split('-')
          let voiceChannel = member.voice.channel
          activeSessions[voiceChannel.id] = new DiscordSession(voiceChannel, sessionType, textChannel)
        }
      }else if(interaction.commandName == STOP_COMMAND){
        let member = interaction.member
        if(member.voice.channel == null)
          interaction.reply({content: "You are not in any session to stop!", ephemeral: true})
        else if(!(member.voice.channel.id in activeSessions))
          interaction.reply({content: "No session is active!", ephemeral: true})
        else{
          await interaction.reply({content:"Session stopped :("})
          activeSessions[member.voice.channel.id].stop()
          delete activeSessions[member.voice.channel.id]
        }
      }
    }
  }catch(e){
    console.log(e)
  }
});

client.login(TOKEN);