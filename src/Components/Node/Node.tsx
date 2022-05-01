import React from "react";
import {Node as NodeModel} from "../../Lib/Models/Node"
import {NodeView} from "../../Lib/Views/NodeView";
import '../../css/Node.css';
import {NODE_SELECTED, NODE_UPDATE_TEXT, NodeSelected, NodeStartEdit, NodeUpdateText} from "../../Lib/Constants/Events";
import {EventDispatcher} from "../../Lib/EventDispatcher";
import {NODE} from "../../Lib/Constants/EventDispatcherNames";

type Props = {
    node: NodeModel
}

type State = {
    nodeView: NodeView
}

class Node extends React.Component<Props, State> {
    eventDispatcher: EventDispatcher = EventDispatcher.instance(NODE);

    constructor(props: Props) {
        super(props);

        let nodeView = new NodeView(this.props.node);
        nodeView.nodeElement = React.createRef<SVGGElement>();
        this.state = {
            nodeView: nodeView
        };
    }

    componentDidMount() {
        this.eventDispatcher.subscribe(NODE_SELECTED, (event: NodeSelected) => {
            let nodeView = this.state.nodeView;
            nodeView.selected = this.state.nodeView.node.id === event.nodeId;
            this.setState({nodeView: nodeView});
        })

        this.eventDispatcher.subscribe(NODE_UPDATE_TEXT, (event: NodeUpdateText) => {
            if(this.state.nodeView.node.id === event.nodeId) {
                this.state.nodeView.refillText();
                this.setState(this.state);
            }
        })

        this.state.nodeView.refillText();
        this.setState(this.state);
    }

    render() {
        return (
            <g className="node" ref={this.state.nodeView.nodeElement}
               transform={"translate(" + this.state.nodeView.node.position.x + "," + this.state.nodeView.node.position.y + ")"}
               onDoubleClick={() => {
                   this.eventDispatcher.dispatch(new NodeStartEdit(this.state.nodeView));
               }}>

                <g className="colorWhite">
                    <path id={"border" + this.state.nodeView.node.id}
                          d={this.state.nodeView.nodePath}
                          stroke="black"
                          fill="currentColor"
                          strokeWidth={this.state.nodeView.selected ? 4 : 2}
                    />
                </g>
                <g>
                    {
                        this.state.nodeView.nodePath &&
                        <path
                            stroke="black"
                            fill="white" strokeWidth="2"
                            d={this.state.nodeView.nodePath}
                        />
                    }
                </g>
                <g className="text"
                   transform={"translate(0, " + (-this.state.nodeView.nodeTextHeight-6) / 2 + ")"}
                >
                    <text className="unselectable alexander" textAnchor="middle" fontSize="20">
                    </text>
                </g>
                <g className="colorTransparent">
                    <use xlinkHref={"#border"+this.state.nodeView.node.id} fill="transparent"
                         onMouseDown={(event) => {
                             event.preventDefault();

                             setTimeout(()=> {
                                 this.eventDispatcher.dispatch(new NodeSelected(this.state.nodeView.node.id));
                             });
                         }}
                         />
                </g>

            </g>
        );
    }
}

export default Node;