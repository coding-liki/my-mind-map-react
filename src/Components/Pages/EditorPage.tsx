import React, {MouseEvent, WheelEvent} from 'react';
import Page from "../Lib/Page/Page";
import {EDITOR_PAGE} from "../../Lib/Constants/Pages";
import {Camera} from "../../Lib/Svg/Editor/Camera";
import {Vector} from "../../Lib/Math";
import {ViewPort} from "../../Lib/Svg/Editor/ViewPort";
import {PAGE_ENABLED, PageEnabled} from "../../Lib/Constants/Events";
import {EventDispatcher} from "../../Lib/EventDispatcher";
import {PAGE} from "../../Lib/Constants/EventDispatcherNames";
import MindMap from "../../Lib/Models/MindMap";

type Props = {
    active?: boolean;
    mindMap: MindMap;
}

type State = {
    camera: Camera
}

class EditorPage extends React.Component<Props, State> {
    mousePosition: Vector = new Vector();
    lastMousePosition: Vector = new Vector();
    eventDispatcher: EventDispatcher = EventDispatcher.instance(PAGE);
    svgNode;
    state: State;


    mouseEvent?: MouseEvent ;
    lastMouseEvent?: MouseEvent ;
    static readonly MOUSE_STATE_DOWN: string = 'down';
    static readonly MOUSE_STATE_UP: string = 'up';

    static readonly MOUSE_MODE_MOVE: string = 'move';

    mouseState: string = EditorPage.MOUSE_STATE_UP;
    mouseMode: string = EditorPage.MOUSE_MODE_MOVE;

    constructor(props: Props) {
        super(props);
        this.svgNode = React.createRef<SVGSVGElement>();
        this.state = {
            camera: new Camera(new Vector(0, 0, -1), new ViewPort(new Vector(0, 0), new Vector(0, 0)))
        }
    }

    componentDidMount() {
        window.onresize = () => {
            this.onWindowResize();
        }
        this.eventDispatcher.subscribe(PAGE_ENABLED, (event: PageEnabled) => {
            if (event.pageName === EDITOR_PAGE) {
                this.onWindowResize();
            }
        })
        this.onWindowResize();
    }

    onWindowResize = () => {
        if (this.svgNode.current) {
            let computedStyle = getComputedStyle(document.body);
            // @ts-ignore
            let editorRect = this.svgNode.current.getBoundingClientRect();

            let width = document.body.offsetWidth - editorRect.left - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
            let height = document.body.offsetHeight - editorRect.top - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);

            let newPosition = this.state.camera.position.clone().subXY(width / 2, height / 2);
            newPosition.z = -1;
            let newDimensions = new Vector(width, height);

            this.setState({camera: new Camera(this.state.camera.position.clone(), new ViewPort(newPosition, newDimensions), newPosition)});
        }
    }

    mouseMove = (event: MouseEvent) => {
        this.lastMouseEvent = this.mouseEvent;
        this.mouseEvent = event;

        if (this.mouseState === EditorPage.MOUSE_STATE_DOWN) {
            this.processMouseMove();
        }
    }

    processMouseMove() {
        if(this.lastMouseEvent && this.mouseEvent) {
            switch (this.mouseMode) {
                case EditorPage.MOUSE_MODE_MOVE:
                    this.state.camera.move(
                        new Vector(
                            this.lastMouseEvent.clientX - this.mouseEvent.clientX,
                            this.lastMouseEvent.clientY - this.mouseEvent.clientY
                        )
                    );

                    this.setState(this.state);
                    break;
            }
        }
    }

    zoom = (event: WheelEvent) => {
        let delta = event.deltaY * (-0.0015);
        this.state.camera.zoom(this.mousePosition, delta);

        this.updateMousePosition()
        this.setState(this.state);

    }

    updateMousePosition() {
        this.lastMousePosition = this.mousePosition.clone();
        if (this.lastMouseEvent && this.svgNode.current) {
            let computedStyle = getComputedStyle(this.svgNode.current);

            let editorRect = this.svgNode.current.getBoundingClientRect();
            let widthRatio = this.state.camera.initViewPort.dimensions.x / this.state.camera.getViewPort().dimensions.x;
            let heightRatio = this.state.camera.initViewPort.dimensions.y / this.state.camera.getViewPort().dimensions.y;

            this.mousePosition = new Vector(
                this.lastMouseEvent.clientX - editorRect.left - parseFloat(computedStyle.borderLeftWidth),
                this.lastMouseEvent.clientY - editorRect.top - parseFloat(computedStyle.borderTopWidth)
            );
            this.mousePosition.x /= widthRatio;
            this.mousePosition.y /= heightRatio;

            this.mousePosition.add(this.state.camera.getViewPort().position);
        }
    }

    render() {
        return (
            <div className="bordered column full">
            <Page pageName={EDITOR_PAGE} active={this.props.active} visibleName={this.props.mindMap.name} >
                <svg
                    ref={this.svgNode}
                    onMouseMove={this.mouseMove}
                    onWheel={this.zoom}
                    onMouseDown={()=>{this.mouseState = EditorPage.MOUSE_STATE_DOWN}}
                    onMouseUp={()=>{this.mouseState = EditorPage.MOUSE_STATE_UP}}
                    width={this.state.camera.initViewPort.dimensions.x}
                    height={this.state.camera.initViewPort.dimensions.y}
                    viewBox={this.state.camera.getViewPort().getString()}
                >
                    <circle cx="0" cy="0" r="5" fill="red"/>
                    <circle cx="10" cy="10" r="5" fill="red"/>
                    {/*{#each map.nodes as node }*/}
                    {/*<NodeNew nodeView={node}/>*/}
                    {/*{/each}*/}
                    {/*{#if  stateProcessor.editedNodeView}*/}
                    {/*    <foreignObject transform="translate({-( stateProcessor.editedNodeView.nodeTextWidth*1.2)/2+ stateProcessor.editedNodeView.node.position.x}, { stateProcessor.editedNodeView.node.position.y})"*/}
                    {/*    width="{ stateProcessor.editedNodeView.nodeTextWidth*1.2+2}px" height="{ stateProcessor.editedNodeView.nodeTextHeight+4}px">*/}
                    {/*    <div xmlns="http://www.w3.org/1999/xhtml">*/}
                    {/*    <NodeEditor bind:value={ stateProcessor.editedNodeView.node.text} nodeId="{ stateProcessor.editedNodeView.node.id}" hidden={false}*/}
                    {/*    width="{ stateProcessor.editedNodeView.nodeTextWidth*1.2}" height="{ stateProcessor.editedNodeView.nodeTextHeight+4}"/>*/}
                    {/*    </div>*/}
                    {/*    </foreignObject>*/}
                    {/*{/if}*/}
                </svg>
            </Page>
            </div>
        );
    }
}


export default EditorPage;
