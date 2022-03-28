import type {fn1} from "./Helpers/Types";

type handlerCallback = fn1<KeyboardEvent, void>;

export class Handler {
    keys: string[];
    handler: handlerCallback

    constructor(keys: string[], handler: handlerCallback) {
        this.keys = keys;
        this.handler = handler;
    }
}

export class KeyPressHandler {
    map = [];
    // @ts-ignore
    keyStates: boolean[string] = {};

    subscribed: boolean = false;
    processDownEvent = (event: KeyboardEvent) => {
        this.keyStates[event.code] = true;
    }

    processUpEvent = (event: KeyboardEvent) => {
        this.processPress(event);
        this.keyStates[event.code] = false;
    }

    subscribe() {
        if (!this.subscribed) {
            document.addEventListener("keydown", this.processDownEvent)

            document.addEventListener("keyup", this.processUpEvent)
        }

    }

    pressed(code: string): boolean{
        return this.keyStates[code];
    }


    processPress(event: KeyboardEvent) {
        let keysUp = Object.keys(this.keyStates).filter((state: string) => this.keyStates[state]).sort();
        let handlers = this.map.filter((handler: Handler) => handler.keys.sort().toString() === keysUp.toString());

        handlers.forEach((handler: Handler) => {
            handler.handler(event);
        })
    }
}