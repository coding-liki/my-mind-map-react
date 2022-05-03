// import {Camera} from "../../Lib/Svg/Editor/Camera";
import React, {RefObject} from "react";
import {Node} from '../../Lib/Models/Node'
import {NodeView} from "../../Lib/Views/NodeView";
import {Vector} from "../../Lib/Math";
import {ReactComponent as Arrow} from '../../img/arrow.svg';
import {LinkType} from "../../Lib/Models/Link";
import {EventDispatcher} from "../../Lib/EventDispatcher";
import {NODE} from "../../Lib/Constants/EventDispatcherNames";
import {NODE_LINK_UPDATED, NodeLinkUpdated, NodeSelected} from "../../Lib/Constants/Events";

type Props = {
    nodeView: NodeView;
}

type State = {
    nodeView: NodeView
    arrowWidth: number | null
}

class Link extends React.Component<Props, State> {
    arrow: RefObject<SVGSVGElement>
    nodeEventDispatcher: EventDispatcher = EventDispatcher.instance(NODE);

    constructor(props: Props) {
        super(props);
        this.arrow = React.createRef<SVGSVGElement>();

        this.state = {
            nodeView: this.props.nodeView,
            arrowWidth: null
        }
    }

    componentDidMount() {
        this.state.nodeView.updateLink()

        // if (this.state.arrowWidth === null) {
        //     this.calculateArrowWidth();
        // }
        this.nodeEventDispatcher.subscribe(NODE_LINK_UPDATED, this.nodeLinkUpdated);
        this.setState({arrowWidth: null})
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (this.state.arrowWidth === null) {
            this.calculateArrowWidth();
        }

    }

    componentWillUnmount() {
        this.nodeEventDispatcher.unsubscribe(NODE_LINK_UPDATED, this.nodeLinkUpdated);
    }

    nodeLinkUpdated = (event: NodeLinkUpdated) => {
        if (this.state.nodeView.node.id === event.nodeId) {
            this.state.nodeView.updateLink();
            this.setState(this.state);
        }
    }

    render() {
        if (this.state.nodeView && this.state.nodeView.link) {

            let arrowRotationVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position);

            let arrowRotationRad = Vector.atan(arrowRotationVector.y / arrowRotationVector.x);
            if (arrowRotationVector.x < 0) {
                arrowRotationRad += Math.PI;
            }

            let arrowRotation = arrowRotationRad * 180 / Math.PI - 90;

            let linePosition = this.getArrowPosition(arrowRotationRad + Math.PI);

            let transform = "";
            if (linePosition) {
                let arrowPosition = linePosition.clone();

                if (this.state.arrowWidth !== null) {
                    let addVector = new Vector(-this.state.arrowWidth / 2 + 0.5, 0);

                    addVector.rotate(new Vector(0, 0), arrowRotationRad - Math.PI / 2);
                    arrowPosition.add(addVector);
                }

                transform = "translate(" + (arrowPosition.x) + "," + arrowPosition.y + ") ";
            }
            if (this.state.arrowWidth !== null) {
                transform += " rotate(" + arrowRotation + ")"

            }
            return (
                <g onMouseDown={() => {
                    this.nodeEventDispatcher.dispatch(new NodeSelected(0));
                }}
                >
                    {linePosition && this.renderLines(linePosition)}
                    <g ref={this.arrow} transform={
                        transform
                    }>
                        <Arrow/>
                    </g>
                </g>
            );
        }

        return null;
    }

    private getArrowPosition(alpha: number) {

        alpha = alpha %(Math.PI*2);

        if(this.state.nodeView.nodeElement?.current && this.state.nodeView.link) {
            let pathElement: SVGGeometryElement|null = this.state.nodeView.nodeElement.current.querySelector('.path');
            if(pathElement && pathElement.getTotalLength() > 0) {
                let length = pathElement.getTotalLength();
                let point = pathElement.getPointAtLength(alpha/(Math.PI*2)*length);
                let arrowVector = this.state.nodeView.link.nodeTo.position.clone().sub(this.state.nodeView.link.nodeFrom.position)

                arrowVector.norm().mul(17);
                return new Vector(point.x, point.y).add(this.state.nodeView.link.nodeTo.position).sub(arrowVector);

            }
        }

        return undefined;
    }

    private renderLines(arrowPosition: Vector) {
        if (this.state.nodeView.link) {
            let arrowRotationVector, arrowRotationRad, addVector;
            switch (this.state.nodeView.link.type) {
                case LinkType.first:
                    return (
                        <line x1={this.state.nodeView.link.nodeFrom.position.x}
                              y1={this.state.nodeView.link.nodeFrom.position.y}
                              x2={arrowPosition.x}
                              y2={arrowPosition.y}
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
                                  x2={arrowPosition.x + addVector.x}
                                  y2={arrowPosition.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x - addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y - addVector.y}
                                  x2={arrowPosition.x - addVector.x}
                                  y2={arrowPosition.y - addVector.y}
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
                                  x2={arrowPosition.x - addVector.x}
                                  y2={arrowPosition.y - addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={arrowPosition.x + addVector.x}
                                  y2={arrowPosition.y + addVector.y}
                                  stroke="#000"
                                  strokeWidth="1"/>
                            <line x1={this.state.nodeView.link.nodeFrom.position.x + addVector.x}
                                  y1={this.state.nodeView.link.nodeFrom.position.y + addVector.y}
                                  x2={arrowPosition.x - addVector.x}
                                  y2={arrowPosition.y - addVector.y}
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

            this.setState({arrowWidth: (boundaries.width) + 1.25});
        }
    }

}

export default Link;