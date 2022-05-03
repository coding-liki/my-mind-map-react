import {Link} from "../Models/Link";
import type {Node} from "../Models/Node";
import RandomGenerator from "../../Svg/RandomGenerator";
import EditableText from "../../Svg/EditableText";
import {RefObject} from "react";

export class NodeView {
    node: Node;

    constructor(node: Node) {
        this.node = node;
    }

    link?: Link;
    nodeElement?: RefObject<SVGGElement>;

    nodePath: string = '';
    nodeTextWidth: number = 0;
    nodeTextHeight: number = 0;
    selected: boolean = false;

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
        if (this.nodeElement && this.nodeElement.current) {
            let textElement: SVGGraphicsElement|null = this.nodeElement.current.querySelector('.text');
            if(textElement) {
                let bBox = textElement.getBBox();

                this.nodeTextWidth = bBox.width;
                this.nodeTextHeight = bBox.height;

                let generator: RandomGenerator = new RandomGenerator();
                this.nodePath = generator.generateBorder(this.nodeTextWidth * 1.2, this.nodeTextHeight * 1.7, 0, 0);
            }
        }
        return this;
    }

    refillText(): NodeView {
        if (this.nodeElement && this.nodeElement.current) {
            let textElement: SVGGraphicsElement|null = this.nodeElement.current.querySelector('.text');
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