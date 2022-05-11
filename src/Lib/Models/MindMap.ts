import {Node} from "./Node";
import RandomGenerator from "../../Svg/RandomGenerator";
import {EventDispatcher} from "../EventDispatcher";
import {NODE} from "../Constants/EventDispatcherNames";
import {NodeLinkUpdated} from "../Constants/Events";
import {Vector} from "../Math";
import {NodeView} from "../Views/NodeView";

type NodeJson = {
    id: number;
    text: string;
    position: Vector;
    parentId?: number;
    parentLinkId?: number;
}
type MindMapJson = {
    id: number;
    name: string;
    nodes: NodeJson[];
}
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

    static fromJson(json: MindMapJson): MindMap {
        let nodesMap: { [key: number]: Node } = [];
        let nodes: Node[] = [];
        json.nodes.forEach((node: NodeJson) => {
            nodesMap[node.id] = new Node(node.id, node.text, node.position);
            nodes.push(nodesMap[node.id]);
        });

        json.nodes.forEach((node: NodeJson) => {
           if(node.parentId){
               nodesMap[node.id].parentNode = nodesMap[node.parentId];
           }
            if(node.parentLinkId){
                nodesMap[node.id].parentLinkNode = nodesMap[node.parentLinkId];
            }
        });

        return new MindMap(json.id, json.name, nodes)
    }

    toJson(): string
    {
        let nodesJson: NodeJson[] = this.nodes.map((node: Node) => {
            return {
                id: node.id,
                text: node.text,
                position: node.position,
                parentId: node.parentNode?.id,
                parentLinkId: node.parentLinkNode?.id,
            }
        });

        let mindMap: MindMapJson = {
            id: this.id,
            name: this.name,
            nodes: nodesJson
        }

        return JSON.stringify(mindMap);
    }

    addChildNode(rootNode: Node) {
        let id = 0;

        this.nodes.forEach((node: Node) => {
            if (node.id > id) {
                id = node.id;
            }
        })

        id++;

        let childNode = RandomGenerator.generateNode(rootNode.position.x, rootNode.position.y + 200, id);
        childNode.parentLinkNode = rootNode;
        childNode.parentNode = rootNode;

        this.nodes.push(childNode)
    }

    deleteNode(nodeToDelete: Node) {
        this.nodes.forEach((node: Node) => {
            if (node.parentLinkNode === nodeToDelete) {
                if (nodeToDelete.parentLinkNode) {
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