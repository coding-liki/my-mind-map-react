import type {Vector} from "../Math";
import type MindMap from "./MindMap";
import {LinkType} from "./Link";
import {WithPosition} from "../Svg/Editor/Camera";


export class Node implements WithPosition{

    id: number;
    text: string;
    position: Vector;

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
}