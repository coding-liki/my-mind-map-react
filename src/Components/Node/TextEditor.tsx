import React, {ChangeEvent, RefObject} from "react";
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

    textEditor: RefObject<HTMLTextAreaElement>
    state: State
    nodeEventDispatcher: EventDispatcher = EventDispatcher.instance(NODE);

    constructor(props: Props) {
        super(props);
        this.textEditor = React.createRef<HTMLTextAreaElement>();
        // this.nodeEventDispatcher.subscribe(NODE_START_EDIT, (event: NodeStartEdit) => {
        //     console.log("trying to trigger focus")
        //     triggerFocus( this.textEditor.current);
        // })
        this.state = {nodeView: props.nodeView}
    }

    textChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {

        this.props.nodeView.node.updateText(this.prepareText(event.target.value));

        this.setState(this.state)
    }

    prepareText(text: string): string {
        text = text.replace(/^\s+$/g, 'Пусто')
        // // text = text.replace(/ $/g, '')
        // text = text.replace(/^ /g, '')
        // // text = text.replace(/\n\n/g, '\n')
        // text = text.replace(/^\n/g, '')
        // text = text.replace(/\n /g, '\n')
        // text = text.replace(/ \n/g, '\n')
        // text = text.replace(/\n$/g, '')

        return text;
    }

    componentDidMount() {
        this.textEditor.current?.focus();
    }

    render() {
        let width = (this.props.nodeView.nodeTextWidth * 1.2);
        let height = (this.props.nodeView.nodeTextHeight + 4);

        return this.props.nodeView ? (
            <foreignObject
                transform={"translate(" + (this.props.nodeView.node.position.x - width / 2 - 2) + ", " + (this.props.nodeView.node.position.y - height / 2) + ")"}
                width={width + "px"}
                height={height + "px"}
                fill="white">

                <div className={"textEditor"}>
                            <textarea
                                ref={this.textEditor}
                                onChange={this.textChanged} onMouseDown={() => {
                                this.nodeEventDispatcher.dispatch(new NodeSelected(this.props.nodeView.node.id));
                            }} className={"alexander "} value={this.props.nodeView.node.text}
                                style={{width: (width - 10) + "px", height: (height - 6) + "px", resize: "none"}}></textarea>
                </div>
            </foreignObject>
        ) : null;
    }
}


export default TextEditor;