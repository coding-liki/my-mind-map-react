import {Vector} from "../../Math";
import {ViewPort} from "./ViewPort";

export class Camera {
    position: Vector;
    initPosition: Vector;

    initViewPort: ViewPort;

    constructor(position: Vector, viewPort: ViewPort) {
        this.position = position;
        this.initPosition = position.clone();
        this.initViewPort = viewPort;
    }

    zoom(zoomPoint: Vector, percent: number): Camera {

        let direction = zoomPoint.clone().sub(this.position);
        let distance = direction.length();

        this.position.add(direction.norm().mul(distance*percent));

        if(this.position.z > 0){
            this.position.z = -1;
        }
        return this;
    }


    move(dir: Vector): Camera{
        let diff = this.position.z/this.initPosition.z;

        this.position.add(dir.mul(diff));

        return this;
    }

    getViewPort(): ViewPort {
        let diff = this.position.z/this.initPosition.z;
        let newDimensions = this.initViewPort.dimensions.clone().mul(diff);
        let newPosition = this.position.clone().sub(newDimensions.clone().div(2));
        newPosition.z = 0;

        return new ViewPort(newPosition, newDimensions );
    }

}