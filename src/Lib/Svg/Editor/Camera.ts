import {Vector} from "../../Math";
import {ViewPort} from "./ViewPort";

export interface WithPosition{
    position: Vector;
}

export class Camera implements WithPosition{
    position: Vector;
    initPosition: Vector;

    initViewPort: ViewPort;

    constructor(position: Vector, viewPort: ViewPort, initPosition?: Vector) {
        this.position = position;
        this.initPosition = initPosition ? initPosition : position.clone();
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


    move(dir: Vector, withPosition: WithPosition = this ): Camera{
        let diff = this.position.z/this.initPosition.z;

        withPosition.position.add(dir.mul(diff));

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