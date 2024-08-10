import {PomodoroSession, PomodoroObserver, TICK_GAP_IN_SECONDS} from "./Pomodoro.js"

export class DiscordSession{
    constructor(voiceChannel, type, textChannel){
        this.voiceChannel = voiceChannel
        this.type = type
        this.textChannel = textChannel
        this.pomodoroSession = new PomodoroSession(type[0], type[1])
        this.pomodoroObserver = new DiscordSessionPomodoroObserver(textChannel, voiceChannel, type)
        this.pomodoroSession.subscribe(this.pomodoroObserver)
        this.pomodoroSession.start()
    }
    stop(){
        this.pomodoroSession.stop()
    }
}

class DiscordSessionPomodoroObserver extends PomodoroObserver{
    constructor(textChannel, voiceChannel, sessionType){
        super()
        this.textChannel = textChannel
        this.voiceChannel = voiceChannel
        this.sessionType = sessionType
        this.counter = sessionType[0]*60
        this.ticker = 0
        this.activeMessage = null
    }
    async work(){
        this.counter = this.sessionType[0]*60
        this.ticker = 0
        let mentions = []
        this.voiceChannel.members.each(member=>{
            mentions.push(`<@${member.id}>`)
        })
        let text = "## Time to studyyy guysss ! Wake upp"
        await this.textChannel.send({content: text})
        this.activeMessage = this.textChannel.send("Time Remaining")
        this.textChannel.send(mentions.join(' '))
    }
    tick(){
        this.counter = this.counter - TICK_GAP_IN_SECONDS
        let minutesRemaining = this.counter/60
        let secondsRemaining = this.counter%60
        let text = ">>> Time remaining**```"+`${parseInt(minutesRemaining)} Min ${secondsRemaining} sec`+"```**"
        Promise.resolve(this.activeMessage)
        .then(message =>
            {this.activeMessage = message;
            this.activeMessage.edit({content: text})
        })
    }
    async break(){
        this.counter = this.sessionType[1]*60
        this.ticker = 1
        let mentions = []
        this.voiceChannel.members.each(member=>{
            mentions.push(`<@${member.id}>`)
        })
        let text = "## Time for break guysss ! Enjoyyy "
        await this.textChannel.send({content: text})
        this.activeMessage = this.textChannel.send("Time Remaining")
        this.textChannel.send(mentions.join(' '))
    }
}