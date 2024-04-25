class GameEvent {
    eventName = "GameEvent";

    listeners = [];

    constructor(newEventName) {
        this.eventName = newEventName;
    }

    Trigger() {
        for(let i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
        }
    }
}

let GAME_EVENTS = [new GameEvent("Reset")];

function CreateEvent(eventName) {
    GAME_EVENTS.push(new GameEvent(eventName));
}

function EmitEvent(eventName) {
    for(let event of GAME_EVENTS) {
        if (eventName == event.eventName) {
            event.Trigger();
        }
    }
}

function BindEvent(targetEvent, newFunction) {
    let event = GAME_EVENTS.find((event) => event.eventName == targetEvent);
    event.listeners.push(newFunction);
}
