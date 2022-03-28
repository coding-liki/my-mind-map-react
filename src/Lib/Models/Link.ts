import type {Node} from "./Node";

export class Link {
    nodeFrom: Node;
    nodeTo: Node;
    type: LinkType;

    constructor(nodeFrom: Node, nodeTo: Node, type: LinkType) {
        this.nodeTo = nodeTo;
        this.nodeFrom = nodeFrom;
        this.type = type;
    }

}

export enum LinkType { first, second, third, fourth };