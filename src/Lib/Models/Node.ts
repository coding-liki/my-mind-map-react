import type {Vector} from "../Math";
import type MindMap from "./MindMap";
import {LinkType} from "./Link";
import {WithPosition} from "../Svg/Editor/Camera";
import {EventDispatcher} from "../EventDispatcher";
import {NODE} from "../Constants/EventDispatcherNames";
import {NodeUpdateText} from "../Constants/Events";


export class Node implements WithPosition{

    id: number;
    text: string;
    position: Vector;
    eventDispatcher = EventDispatcher.instance(NODE);

    constructor(id: number, text: string, position: Vector) {
        this.id = id;
        this.text = text;
        this.position = position;
    }

    parentNode?: Node;
    parentLinkNode?: Node;
    toMindMap?: MindMap;

    getLinkType(): LinkType {
        return LinkType.first;
    }

    updateText(newText: string){
        this.text = newText
        this.eventDispatcher.dispatch(new NodeUpdateText(this.id))
    }
}