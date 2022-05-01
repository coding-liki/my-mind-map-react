// import {Camera} from "../../Lib/Svg/Editor/Camera";
import React, {RefObject} from "react";
import {Node} from '../../Lib/Models/Node'
import {NodeView} from "../../Lib/Views/NodeView";
import {Vector} from "../../Lib/Math";
import {ReactComponent as Arrow} from '../../img/arrow.svg';
import {LinkType} from "../../Lib/Models/Link";

type Props = {
    node: Node;
}

type State = {
    nodeView: NodeView
    arrowWidth: number | null
}

class Link extends React.Component<Props, State> {
    arrow: RefObject<SVGSVGElement>


    constructor(props: Props) {
        super(props);
        this.arrow = React.createRef<SVGSVGElement>();

        let nodeView = new NodeView(this.props.node);
        nodeView.updateLink();
        this.state = {
            nodeView: nodeView,
            arrowWidth: null
        }
    }

    componentDidMount() {
        this.calculateArrowWidth();

    }

    render() {
        if (this.state.nodeView.link) {
            if (this.state.arrowWidth === null) {
                this.calculateArrowWidth();
            }
            let arrowRotationVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position);

            let arrowRotationRad = Vector.atan(arrowRotationVector.y / arrowRotationVector.x);
            if (arrowRotationVector.x < 0) {
                // console.log("меньше")
                arrowRotationRad += Math.PI;
            }

            let arrowRotation = arrowRotationRad * 180 / Math.PI - 90;

            let arrowPosition = this.state.nodeView.link.nodeFrom.position.clone().add(this.state.nodeView.link.nodeTo.position).div(2)


            if (this.state.arrowWidth !== null) {
                let addVector = new Vector(-this.state.arrowWidth / 2 + 0.5, 0);

                addVector.rotate(new Vector(0, 0), arrowRotationRad - Math.PI / 2);
                arrowPosition.add(addVector);
            }

            let transform = "translate(" + (arrowPosition.x) + "," + arrowPosition.y + ") ";

            if (this.state.arrowWidth !== null) {
                transform += " rotate(" + arrowRotation + ")"

            }
            return (
                <g>
                    {this.renderLines()}
                    <g ref={this.arrow} transform={
                        transform
                    }>
                        <Arrow/>
                    </g>
                </g>
            );
        }

        return undefined;
    }

    private renderLines() {
        if (this.state.nodeView.link) {
            let arrowRotationVector, arrowRotationRad, addVector;
            switch (this.state.nodeView.link.type) {
                case LinkType.first:
                    return (
                        <line x1={this.state.nodeView.link.nodeFrom.position.x}
                              y1={this.state.nodeView.link.nodeFrom.position.y}
                              x2={this.state.nodeView.link.nodeTo.position.x}
                              y2={this.state.nodeView.link.nodeTo.position.y}
                              stroke="#000"
                              strokeWidth="1"/>
                    )
                case LinkType.second:
                    arrowRotationVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position);

                    arrowRotationRad = Vector.atan(arrowRotationVector.y / arrowRotationVector.x);
                    addVector = new Vector(3, 0);

                    addVector.rotate(new Vector(0, 0), arrowRotationRad - Math.PI / 2);
                    return (
                        <g>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x + addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x - addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y - addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x - addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                        </g>
                    )
                case LinkType.third:
                    arrowRotationVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position);

                    arrowRotationRad = Vector.atan(arrowRotationVector.y / arrowRotationVector.x);
                    addVector = new Vector(5, 0);

                    addVector.rotate(new Vector(0, 0), arrowRotationRad - Math.PI / 2);
                    return (
                        <g>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x - addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y - addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x - addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x + addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x - addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                        </g>
                    )
                case LinkType.fourth:
                    arrowRotationVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position);

                    arrowRotationRad = Vector.atan(arrowRotationVector.y / arrowRotationVector.x);
                    addVector = new Vector(7, 0);

                    addVector.rotate(new Vector(0, 0), arrowRotationRad - Math.PI / 2);
                    return (
                        <g>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x - addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y - addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x - addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x + addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x - addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x - addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y - addVector.y}
                                  x2={this.state.nodeView.link.nodeTo.position.x + addVector.x}
                                  y2={this.state.nodeView.link.nodeTo.position.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                        </g>
                    )
            }
        }

        return undefined;

    }

    private calculateArrowWidth() {
        if (this.arrow.current && this.state.nodeView.link) {

            let boundaries = this.arrow.current.getBoundingClientRect();

            this.setState({arrowWidth: (boundaries.width) + 1.25});//14.64*2;
        }
    }
}

export default Link;