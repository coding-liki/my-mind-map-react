import React, {ChangeEvent} from "react";
import {NodeView} from "../../Lib/Views/NodeView";
import '../../css/TextEditor.css';
import {NodeSelected} from "../../Lib/Constants/Events";
import {EventDispatcher} from "../../Lib/EventDispatcher";
import {NODE} from "../../Lib/Constants/EventDispatcherNames";

type Props = {
    nodeView: NodeView
}

type State = {
    nodeView: NodeView
}

class TextEditor extends React.Component<Props, State> {

    state: State
    nodeEventDispatcher: EventDispatcher = EventDispatcher.instance(NODE);

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {nodeView: props.nodeView}
    }

    textChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.props.nodeView.node.updateText(event.target.value);

        this.setState(this.state)
    }

    render() {
        let width = (this.props.nodeView.nodeTextWidth * 1.2);
        let height = (this.props.nodeView.nodeTextHeight + 4);

        return this.props.nodeView ? (
            <foreignObject
                transform={"translate(" + (this.props.nodeView.node.position.x - width / 2-2) + ", " + (this.props.nodeView.node.position.y - height / 2) + ")"}
                width={width + "px"}
                height={height + "px"}
                fill="white">

                <div className={"textEditor"}>
                            <textarea onChange={this.textChanged} onMouseDown={() => {
                                this.nodeEventDispatcher.dispatch(new NodeSelected(this.props.nodeView.node.id));
                            }} className={"alexander "} value={this.props.nodeView.node.text}
                                      style={{width: width + "px", height: height + "px", resize: "none"}}></textarea>
                </div>
            </foreignObject>
        ) : null;
    }
}


export default TextEditor;