export const TICK_GAP_IN_SECONDS = 3

export class PomodoroSession{
    constructor(workInMinutes, breakInMinutes){
        this.workInMinutes = workInMinutes
        this.breakInMinutes = breakInMinutes
        this.observers = []
        this.status = 0
    }
    subscribe(observer){
        this.observers.push(observer)
    }
    async start(){
        if(this.observers.length == 0)
            throw Error("Cannot start without a subscriber");
        this.status = 1;
        let seconds = 0;
        let currentTimer = 1
        let target = this.workInMinutes*60
        this.observers.forEach(observer=>{
            observer.work()
        })
        while(true){
            if(this.status == 0)
                return
            await new Promise(resolve => setTimeout(resolve, TICK_GAP_IN_SECONDS*1000));
            seconds = seconds + TICK_GAP_IN_SECONDS;
            this.observers.forEach(observer=>observer.tick());
            if(seconds == target){
                if(currentTimer == 1){
                    this.observers.forEach(observer=>observer.break())
                    target = this.breakInMinutes*60
                    currentTimer = 0
                    seconds = 0
                }else{
                    this.observers.forEach(observer=>observer.work())
                    target = this.workInMinutes*60
                    currentTimer = 1
                    seconds = 0
                }
            }
        }
    }
    stop(){
        this.status = 0;
    }
}

export class PomodoroObserver{
    tick(){return}
    work(){return}
    break(){return}
}