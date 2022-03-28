import type {Node} from "./Node";

export default class MindMap {
    id: number;
    name: string;
    nodes: Node[];

    constructor(id: number, name: string, nodes: Node[]) {
        this.id = id;
        this.name = name;
        this.nodes = nodes;
    }
}