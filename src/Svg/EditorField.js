import { Vector } from "../Lib/Math";

export default class EditorField {
    zoom = 1;
    previousZoom = 1;
    position = new Vector();
    viewBox = new Vector();
    mousePosition = new Vector();
    initMousePosition = new Vector();
    lastMousePosition = new Vector();
    initPosition = new Vector();

    constructor(width, height){
        this.viewBox.x = width;
        this.viewBox.y = height;
    }

    updateViewBox(width, height){
        this.viewBox.x = width;
        this.viewBox.y = height;

        return this;
    }


    getViewBoxString(){
        let zoomedPosition = this.position.clone().mul(this.zoom);
        let zoomedViewBox  = this.viewBox.clone().mul(this.zoom);

        return zoomedPosition.x +" "+zoomedPosition.y+" "+zoomedViewBox.x+" "+zoomedViewBox.y;
    }

    updateMousePosition(x, y){
        this.lastMousePosition = this.mousePosition.clone();
        this.mousePosition.x = x;
        this.mousePosition.y = y;

        return this;
    }

    movePositionByMousePosition(){
        this.position.sub(this.mousePosition).add(this.lastMousePosition);

        return this;
    }

    freezeMousePosition(){
        this.initMousePosition = this.mousePosition.clone();
        this.initPosition = this.position.clone();
    }

    freezeZoom() {
        this.previousZoom = this.zoom;
    }
    updateZoomByMousePosition(){
        let fullOffset = this.mousePosition.clone().sub(this.initMousePosition);
        let dist = -fullOffset.x;
        // let lastZoom = this.zoom;

        // let zoomOffset = this.initMousePosition.clone();

        // zoomOffset.y = 0;

        // this.position = this.initPosition.clone().add(zoomOffset);
        if(this.zoom < 1){
            this.zoom = this.previousZoom + dist*this.zoom*0.001;
        } else {
            this.zoom = this.previousZoom +  dist/this.zoom*0.001;
        }

        if(this.zoom < 0) {
            this.zoom = 0;
        } else if(this.zoom > 100){
            this.zoom =100;
        }
        // let zoomOffsetLength = zoomOffset.length();

        // zoomOffset.norm().mul(zoomOffsetLength*this.zoom )
        // mouseFieldPosition.mul(this.zoom - this.previousZoom);
        //
        // let initPositionZoomed = this.initPosition.clone().mul(this.previousZoom/this.zoom);
        //
        // let zoomOffset  = this.initMousePosition.clone().mul(this.previousZoom).sub(this.initMousePosition.clone().add(this.initPosition).mul(this.previousZoom/this.zoom));//.add(this.initPosition);
        // //
        // // // zoomOffset.y = 0;
        // this.position = this.initPosition.clone().sub(zoomOffset)//.sub(initPositionZoomed);

        return this;
    }
    
    static generateNode(x,y, id){
        // return {
        //     id: id,
        //     width: 0,
        //     height: 0,
        //     position: new Vector(x,y),
        //     text: "Новая нода",
        //     borderPath: "",
        //     textElement: null,
        //     pathElement: null,
        //     selected: false,
        //     needRegen: true,
        //     needRecalcLink: true,
        //     parentId: null,
        //     totalLength: 0,
        //     pathPoints: {}
        // };
    }

}