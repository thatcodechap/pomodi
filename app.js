import { Client, GatewayIntentBits} from 'discord.js'
import {DiscordSessionHandler} from './DiscordSession.js'

const TOKEN = '<Your Discord Bot Token Here>'
const START_COMMAND = 'start'
const START_COMMAND_TIMER_OPTION = 'timer'
const START_COMMAND_CYCLES_OPTION = 'cycles'
const STOP_COMMAND = 'stop'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const sessionHandler = new DiscordSessionHandler()

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
        else if(sessionHandler.get(member.voice.channel) != null)
          interaction.reply({content: "Session already exists!", ephemeral: true})
        else{
          await interaction.reply({content: "Letsss Goooo"})
          let textChannel = interaction.channel
          let sessionType = interaction.options.getString(START_COMMAND_TIMER_OPTION).split('-')
          let cycles = interaction.options.getInteger(START_COMMAND_CYCLES_OPTION)
          let voiceChannel = member.voice.channel
          if(cycles == null)
            cycles = -1
          sessionHandler.create(textChannel, voiceChannel, sessionType, cycles)
        }
      }else if(interaction.commandName == STOP_COMMAND){
        let member = interaction.member
        if(member.voice.channel == null)
          interaction.reply({content: "You are not in any session to stop!", ephemeral: true})
        else if(sessionHandler.get(member.voice.channel) == null)
          interaction.reply({content: "No session is active!", ephemeral: true})
        else{
          await interaction.reply({content:"Session stopped :("})
          sessionHandler.delete(member.voice.channel)
        }
      }
    }
  }catch(e){
    console.log(e)
  }
});

client.login(TOKEN);