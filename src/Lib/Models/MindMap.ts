import type {Node} from "./Node";
import RandomGenerator from "../../Svg/RandomGenerator";

export default class MindMap {
    id: number;
    name: string;
    nodes: Node[];

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
}