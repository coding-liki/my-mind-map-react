import {Link} from "../Models/Link";
import type {Node} from "../Models/Node";
import RandomGenerator from "../../Svg/RandomGenerator";
import EditableText from "../../Svg/EditableText";

export class NodeView {
    node: Node;

    constructor(node: Node) {
        this.node = node;
    }

    link?: Link;
    nodeElement?: SVGElement;

    nodePath?: string;
    nodeTextWidth?: number;
    nodeTextHeight?: number;

    updateLink(): NodeView {
        if (this.node.parentLinkNode) {
            this.link = new Link(
                this.node.parentLinkNode,
                this.node,
                this.node.getLinkType()
            );
        }
        return this;
    }

    regeneratePath(): NodeView {
        console.log('regen', this.node.id);
        if (this.nodeElement) {
            let textElement: SVGGraphicsElement|null = this.nodeElement.querySelector('.text');
            if(textElement) {
                let bBox = textElement.getBBox();

                this.nodeTextWidth = bBox.width;
                this.nodeTextHeight = bBox.height;

                let generator: RandomGenerator = new RandomGenerator();
                this.nodePath = generator.generateBorder(this.nodeTextWidth * 1.2, this.nodeTextHeight * 1.7, 0.1, 0.3);
            }
        }
        return this;
    }

    refillText(): NodeView {
        if (this.nodeElement) {
            let textElement: SVGGraphicsElement|null = this.nodeElement.querySelector('.text');
            if(textElement) {
                textElement.children[0].innerHTML = '';
                let editableText = new EditableText();
                editableText.text = this.node.text;
                editableText.getTSpans().forEach((span) => {
                    if(textElement) {
                        textElement.children[0].appendChild(span);
                    }
                })

                return this.regeneratePath();
            }
        }

        return this;
    }
}