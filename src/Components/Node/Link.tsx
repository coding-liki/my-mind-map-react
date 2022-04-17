import {Camera} from "../../Lib/Svg/Editor/Camera";
import React from "react";
import {Node} from '../../Lib/Models/Node'
import {NodeView} from "../../Lib/Views/NodeView";
type Props = {
    node: Node;
}

type State = {
    nodeView: NodeView
}

class Link extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        let nodeView = new NodeView(this.props.node);
        nodeView.updateLink();
        this.state = {
            nodeView: nodeView
        }
    }
    render() {
        return (
            <g >
                <line x1={this.state.nodeView.link?.nodeFrom.position.x} y1={this.state.nodeView.link?.nodeFrom.position.y} x2={this.state.nodeView.link?.nodeTo.position.x} y2={this.state.nodeView.link?.nodeTo.position.y} stroke="#000"
                      strokeWidth="2"/>
            </g>
        );
    }
}

export default Link;