import React, {MouseEvent, RefObject, WheelEvent} from 'react';
import Page from "../Lib/Page/Page";
import {EDITOR_PAGE} from "../../Lib/Constants/Pages";
import {Camera} from "../../Lib/Svg/Editor/Camera";
import {Vector} from "../../Lib/Math";
import {ViewPort} from "../../Lib/Svg/Editor/ViewPort";
import {
    NODE_SELECTED,
    NODE_START_EDIT, NodeLinkUpdated,
    NodeSelected,
    NodeStartEdit,
    PAGE_ENABLED,
    PageEnabled
} from "../../Lib/Constants/Events";
import {EventDispatcher} from "../../Lib/EventDispatcher";
import {NODE, PAGE} from "../../Lib/Constants/EventDispatcherNames";
import MindMap from "../../Lib/Models/MindMap";
import {Handler, KeyPressHandler} from "../../Lib/KeyPressHandler";
import Node from "../Node/Node";
import {Node as NodeModel} from "../../Lib/Models/Node";
import Link from "../Node/Link";
import TextEditor from "../Node/TextEditor";
import {NodeView} from "../../Lib/Views/NodeView";
import {LinkType} from "../../Lib/Models/Link";
import ConfirmationDialog from "../Lib/Window/ConfirmationDialog";
import MindMapHistory from "../../Lib/Models/MindMapHistory";
import LocalStorage from "../../Lib/LocalStorage";
import {HAS_CHECKBOX} from "../../Lib/Constants/NodeTypes";

type Props = {
    active?: boolean
    mindMap: MindMap
}

type State = {
    camera: Camera
    mindMap: MindMap
    editingNodeView?: NodeView
    deleteDialogOpen: boolean
}

class EditorPage extends React.Component<Props, State> {
    keyboardHandler: KeyPressHandler = new KeyPressHandler();
    mousePosition: Vector = new Vector();
    lastMousePosition: Vector = new Vector();
    eventDispatcher: EventDispatcher = EventDispatcher.instance(PAGE);
    nodeEventDispatcher: EventDispatcher = EventDispatcher.instance(NODE);
    svgNode: RefObject<SVGSVGElement>;
    state: State;
    selectedNodeId: number = 0;

    nodeViews: { [key: number]: NodeView } = {};
    mouseEvent?: MouseEvent;
    lastMouseEvent?: MouseEvent;

    static readonly MOUSE_STATE_DOWN: string = 'down';
    static readonly MOUSE_STATE_UP: string = 'up';

    static readonly MOUSE_MODE_MOVE: string = 'move';

    mouseState: string = EditorPage.MOUSE_STATE_UP;
    mouseMode: string = EditorPage.MOUSE_MODE_MOVE;
    mindMapHistory: MindMapHistory;

    saveInterval?: NodeJS.Timer;
    constructor(props: Props) {
        super(props);
        this.svgNode = React.createRef<SVGSVGElement>();
        this.state = {
            camera: new Camera(new Vector(0, 0, -1), new ViewPort(new Vector(0, 0), new Vector(0, 0))),
            mindMap: this.props.mindMap,
            deleteDialogOpen: false
        }

        this.mindMapHistory = new MindMapHistory(this.state.mindMap);

        this.updateNodes(false);

    }

    addNewNode = () => {
        if (this.selectedNodeId > 0) {
            this.mindMapHistory.push();
            this.state.mindMap.addChildNode(this.nodeViews[this.selectedNodeId].node)
            this.updateNodes();

        }
    }

    componentDidMount() {
        this.updateNodes();

        let handler = new Handler(["ShiftLeft", "Equal"], () => {
            this.addNewNode();
        });
        this.keyboardHandler.map.push(handler)
        handler = new Handler(["ShiftRight", "Equal"], () => {
            this.addNewNode();
        });
        this.keyboardHandler.map.push(handler)

        handler = new Handler(["ShiftRight", "KeyP"], () => {
            this.incrementLink();
        });

        this.keyboardHandler.map.push(handler)

        handler = new Handler(["ShiftRight", "KeyL"], () => {
            this.decrementLink();
        });
        this.keyboardHandler.map.push(handler)

        handler = new Handler(["Delete"], () => {
            if (this.selectedNodeId > 0) {
                this.setState({
                    deleteDialogOpen: true
                });
            }
        });

        this.keyboardHandler.map.push(handler)

        handler = new Handler(["ShiftLeft", "KeyC"], () => {
            this.toggleCheckboxType();
        });
        this.keyboardHandler.map.push(handler)


        // handler = new Handler(["ControlLeft", "KeyZ"], () => {
        //     this.mindMapHistory.up();
        //     this.setState({
        //         mindMap: this.mindMapHistory.current
        //     });
        // });
        // this.keyboardHandler.map.push(handler)
        //
        // handler = new Handler(["ShiftLeft", "ControlLeft", "KeyZ"], () => {
        //     this.mindMapHistory.down();
        //     this.setState({
        //         mindMap: this.mindMapHistory.current
        //     });
        // });
        //
        // this.keyboardHandler.map.push(handler)


        window.onresize = () => {
            this.onWindowResize();
        }

        this.eventDispatcher.subscribe(PAGE_ENABLED, this.pageEnabled)
        this.nodeEventDispatcher.subscribe(NODE_SELECTED, this.nodeSelected);
        this.nodeEventDispatcher.subscribe(NODE_START_EDIT, this.nodeStartEdit);

        this.onWindowResize();

        this.keyboardHandler.subscribe();

        this.saveInterval = setInterval(() => {
            LocalStorage.set('lastMindMap', this.state.mindMap.toJson());
            console.log("save mind map");
        }, 2000);
    }

    private incrementLink() {
        if (this.selectedNodeId > 0) {
            let selectedNode = this.nodeViews[this.selectedNodeId].node;
            if (selectedNode.parentNode) {
                switch (selectedNode.getLinkType()) {
                    case LinkType.fourth:
                        selectedNode.parentNode = selectedNode.parentLinkNode;
                        break;
                    default:
                        if (selectedNode.parentNode.parentNode) {
                            selectedNode.parentNode = selectedNode.parentNode.parentNode;
                        } else {
                            selectedNode.parentNode = selectedNode.parentLinkNode;
                        }
                }

                this.nodeEventDispatcher.dispatch(new NodeLinkUpdated(this.selectedNodeId));
            }
        }

    }

    private decrementLink() {
        if (this.selectedNodeId > 0) {
            let selectedNode = this.nodeViews[this.selectedNodeId].node
            if (selectedNode.parentNode) {
                switch (selectedNode.getLinkType()) {
                    case LinkType.first:
                        if (selectedNode.parentLinkNode?.parentNode?.parentNode?.parentNode) {
                            selectedNode.parentNode = selectedNode.parentLinkNode.parentNode.parentNode.parentNode;
                        } else if (selectedNode.parentLinkNode?.parentNode?.parentNode) {
                            selectedNode.parentNode = selectedNode.parentLinkNode.parentNode.parentNode;
                        } else if (selectedNode.parentLinkNode?.parentNode) {
                            selectedNode.parentNode = selectedNode.parentLinkNode.parentNode;
                        }
                        break;
                    case LinkType.second:
                        selectedNode.parentNode = selectedNode.parentLinkNode;
                        break;
                    case LinkType.third:
                        selectedNode.parentNode = selectedNode.parentLinkNode?.parentNode;
                        break;
                    case LinkType.fourth:
                        selectedNode.parentNode = selectedNode.parentLinkNode?.parentNode?.parentNode;
                        break;
                }

                this.nodeEventDispatcher.dispatch(new NodeLinkUpdated(this.selectedNodeId));
            }
        }
    }

    componentWillUnmount() {
        this.eventDispatcher.unsubscribe(PAGE_ENABLED, this.pageEnabled)
        this.nodeEventDispatcher.unsubscribe(NODE_SELECTED, this.nodeSelected);
        this.nodeEventDispatcher.unsubscribe(NODE_START_EDIT, this.nodeStartEdit);

        if(this.saveInterval) {
            clearInterval(this.saveInterval)
        }
    }

    private nodeStartEdit = (event: NodeStartEdit) => {
        if (this.state.editingNodeView === event.nodeView) {
            this.setState({editingNodeView: undefined})
        } else {
            this.setState({editingNodeView: event.nodeView})
        }
    }

    nodeSelected = (event: NodeSelected) => {
        if (event.nodeId !== 0) {
            let nodeIndex = this.state.mindMap.nodes.indexOf(this.nodeViews[event.nodeId].node);
            let node = this.state.mindMap.nodes[nodeIndex];
            this.state.mindMap.nodes.splice(nodeIndex, 1)
            this.state.mindMap.nodes.push(node);
            this.setState(this.state);
        }

        if (event.nodeId !== this.state.editingNodeView?.node.id) {
            this.setState({editingNodeView: undefined})
        }

        this.selectedNodeId = event.nodeId;
    }

    pageEnabled = (event: PageEnabled) => {
        if (event.pageName === EDITOR_PAGE) {
            this.onWindowResize();
        }
    }

    private updateNodes(updateState = true) {
        this.state.mindMap.nodes.forEach((node: NodeModel) => {
            this.nodeViews[node.id] = new NodeView(node);
            setTimeout(() => this.nodeEventDispatcher.dispatch(new NodeLinkUpdated(node.id)), 10);
        });

        if (updateState) {
            setTimeout(() => this.setState(this.state));
        }

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
        event.preventDefault();
        this.lastMouseEvent = this.mouseEvent;
        this.mouseEvent = event;

        if (this.mouseState === EditorPage.MOUSE_STATE_DOWN) {
            this.processMouseMove();
        }
    }

    processMouseMove() {
        if (this.lastMouseEvent && this.mouseEvent) {
            switch (this.mouseMode) {
                case EditorPage.MOUSE_MODE_MOVE:
                    if (this.keyboardHandler.pressed('ShiftLeft') || this.keyboardHandler.pressed('ShiftRight')) {
                        this.state.camera.move(
                            new Vector(
                                this.lastMouseEvent.clientX - this.mouseEvent.clientX,
                                this.lastMouseEvent.clientY - this.mouseEvent.clientY
                            )
                        );

                        this.setState(this.state);
                    } else if (this.selectedNodeId > 0 && !this.state.editingNodeView) {
                        let node = this.nodeViews[this.selectedNodeId].node;
                        this.state.camera.move(new Vector(
                            this.mouseEvent.clientX - this.lastMouseEvent.clientX,
                            this.mouseEvent.clientY - this.lastMouseEvent.clientY
                        ), node);
                        this.setState(this.state);
                    }
                    break;
            }
        }
    }

    zoom = (event: WheelEvent) => {
        if (this.keyboardHandler.pressed('ShiftLeft') || this.keyboardHandler.pressed('ShiftRight')) {
            let delta = event.deltaY * (-0.0015);
            this.state.camera.zoom(this.mousePosition, delta);

            this.updateMousePosition()
            this.setState(this.state);
        }
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


    renderLinks() {
        return this.state.mindMap.nodes.map((value: NodeModel) => {
            if (value && value.parentLinkNode) {
                return (
                    <Link key={value.id} nodeView={this.nodeViews[value.id]} camera={this.state.camera}/>
                )
            } else {
                return null;
            }
        });
    }

    renderNodes() {
        return this.state.mindMap.nodes.map((value: NodeModel) => {
            if (value) {
                return (
                    <Node key={value.id} nodeView={this.nodeViews[value.id]}/>
                )
            } else {
                return null;
            }
        })
            ;
    }

    render() {
        return (
            <div className="bordered column full">
                <Page pageName={EDITOR_PAGE} active={this.props.active} visibleName={this.state.mindMap.name}>
                    <svg
                        ref={this.svgNode}
                        onMouseMove={this.mouseMove}
                        onWheel={this.zoom}
                        onMouseDown={(event: MouseEvent<SVGSVGElement | HTMLElement>) => {
                            if (this.svgNode.current === event.target) {
                                this.nodeEventDispatcher.dispatch(new NodeSelected(0));
                            }
                            this.mouseState = EditorPage.MOUSE_STATE_DOWN

                        }}
                        onMouseUp={() => {
                            this.mouseState = EditorPage.MOUSE_STATE_UP;
                        }}
                        width={this.state.camera.initViewPort.dimensions.x}
                        height={this.state.camera.initViewPort.dimensions.y}
                        viewBox={this.state.camera.getViewPort().getString()}
                    >
                        <circle cx="0" cy="0" r="5" fill="red"/>

                        {this.renderLinks()}
                        {this.renderNodes()}

                        {
                            this.state.editingNodeView &&
                            <TextEditor nodeView={this.state.editingNodeView}></TextEditor>
                        }

                        {
                            this.renderDeleteDialog()
                        }
                    </svg>
                </Page>
            </div>
        );
    }

    private renderDeleteDialog() {
        return (
            <ConfirmationDialog
                open={this.state.deleteDialogOpen}
                title={"?????????? ???????????????"}
                onConfirm={this.deleteNode}
                onCancel={() => {
                    this.setState({
                        deleteDialogOpen: false
                    })
                }}
            >
                ?????????? ?????????????? ???????? {this.selectedNodeId}.
            </ConfirmationDialog>
        )
    }

    private deleteNode = () => {
        this.state.mindMap.deleteNode(this.nodeViews[this.selectedNodeId].node)
        this.setState({
            deleteDialogOpen: false
        });
        this.mindMapHistory.push();
    }

    private toggleCheckboxType() {
        if(this.selectedNodeId > 0) {
            let selectedNode = this.nodeViews[this.selectedNodeId];
            selectedNode.node.toggleType(HAS_CHECKBOX)
            this.setState({});
        }
    }
}


export default EditorPage;
