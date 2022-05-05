import type {Node} from "./Node";
import RandomGenerator from "../../Svg/RandomGenerator";
import {EventDispatcher} from "../EventDispatcher";
import {NODE} from "../Constants/EventDispatcherNames";
import {NodeLinkUpdated, NodeUpdateText} from "../Constants/Events";

export default class MindMap {
    id: number;
    name: string;
    nodes: Node[];
    eventDispatcher = EventDispatcher.instance(NODE);

    constructor(id: number, name: string, nodes: Node[]) {
        this.id = id;
        this.name = name;
        this.nodes = nodes;
    }

    addChildNode(rootNode: Node){
        let id = 0;

        this.nodes.forEach((node: Node) => {
            if(node.id > id){
                id = node.id;
            }
        })

        id++;

        let childNode = RandomGenerator.generateNode(rootNode.position.x, rootNode.position.y+200, id);
        childNode.parentLinkNode = rootNode;
        childNode.parentNode = rootNode;

        this.nodes.push(childNode)
    }

    deleteNode(nodeToDelete: Node){
        this.nodes.forEach((node: Node) => {
            if(node.parentLinkNode === nodeToDelete){
                if(nodeToDelete.parentLinkNode){
                    node.parentLinkNode = nodeToDelete.parentLinkNode
                    node.parentNode = nodeToDelete.parentNode
                } else {
                    node.parentLinkNode = undefined;
                    node.parentNode = undefined;
                }

                this.eventDispatcher.dispatch(new NodeLinkUpdated(node.id))
            }
        })

        let nodeIndex = this.nodes.indexOf(nodeToDelete);
        this.nodes.splice(nodeIndex, 1)
    }
}