import {PomodoroSession, PomodoroObserver, TICK_GAP_IN_SECONDS} from "./Pomodoro.js"

export class DiscordSessionHandler{
    constructor(){
        this.activeSessions = {}
    }
    get(voiceChannel){
        return this.activeSessions[voiceChannel.id]
    }
    create(textChannel, voiceChannel, sessionType, cycles){
        let newPomodoroSession = new PomodoroSession(sessionType[0], sessionType[1])
        let newDiscordSessionPomodoroObserver = new DiscordSessionPomodoroObserver(textChannel, voiceChannel, sessionType, cycles, ()=>this.delete(voiceChannel))
        newPomodoroSession.subscribe(newDiscordSessionPomodoroObserver)
        this.activeSessions[voiceChannel.id] = newPomodoroSession
        newPomodoroSession.start()
    }
    delete(voiceChannel){
        this.activeSessions[voiceChannel.id].stop()
        delete this.activeSessions[voiceChannel.id]
    }
}

class DiscordSessionPomodoroObserver extends PomodoroObserver{
    constructor(textChannel, voiceChannel, sessionType, cycles, selfDestructor){
        super()
        this.textChannel = textChannel
        this.voiceChannel = voiceChannel
        this.sessionType = sessionType
        this.selfDestructor = selfDestructor
        this.counter = sessionType[0]*60
        this.cycles = cycles
        this.currentCycles = 0
        this.ticker = 0
        this.activeMessage = null
    }
    async work(){
        if(this.currentCycles == this.cycles)
            return this.selfDestructor()
        this.counter = this.sessionType[0]*60
        this.ticker = 0
        let mentions = []
        this.voiceChannel.members.each(member=>{
            mentions.push(`<@${member.id}>`)
        })
        if(mentions.length == 0){
            this.selfDestructor()
            return
        }
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
        if(mentions.length == 0){
            this.selfDestructor()
            return
        }
        let text = "## Time for break guysss ! Enjoyyy "
        await this.textChannel.send({content: text})
        this.activeMessage = this.textChannel.send("Time Remaining")
        this.textChannel.send(mentions.join(' '))
        this.currentCycles = this.currentCycles + 1
    }
}