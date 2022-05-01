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
        let type: LinkType =  LinkType.first
        let parent = this.parentLinkNode;
        while(parent !== this.parentNode){
            parent = parent?.parentLinkNode;
            type++;
        }
        return type;
    }

    updateText(newText: string){
        if(newText.length < 1){
            newText = "Пусто";
        }
        this.text = newText
        this.eventDispatcher.dispatch(new NodeUpdateText(this.id))
    }
}