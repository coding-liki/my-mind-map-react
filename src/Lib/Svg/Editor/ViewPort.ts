import {Vector} from "../../Math";

export class ViewPort{
    position: Vector;

    dimensions: Vector;

    constructor(position: Vector, dimensions: Vector) {
        this.position = position;
        this.dimensions = dimensions;
    }
}