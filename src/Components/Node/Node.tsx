import React from "react";
import {Node as NodeModel} from "../../Lib/Models/Node"
import {NodeView} from "../../Lib/Views/NodeView";
type Props = {
    node: NodeModel
}

type State = {
    nodeView: NodeView
}

class Node extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            nodeView: new NodeView(this.props.node)
        };

    }

    componentDidMount(){
        
    }

    render() {
        return undefined;
    }
}

export default Node;