import {Vector} from "../Lib/Math";
import {NodeView} from "../Lib/Views/NodeView";
import {Node} from "../Lib/Models/Node";

export default class RandomGenerator {
    minAmplitude: number = 0;
    maxAmplitude: number = 1;
    static vergesCount: number = 15;

    PIHalf: number = Math.PI / 2;

    generateBorder(width: number, height: number, minAmplitude: number, maxAmplitude: number, verges: number = RandomGenerator.vergesCount): string {
        this.minAmplitude = minAmplitude;
        this.maxAmplitude = maxAmplitude;

        let a: number = width / 2;
        let b: number = height / 2;

        let PI2: number = 2 * Math.PI;
        let step: number = PI2 / verges;

        let first: boolean = true;
        let aPoint: Vector = new Vector(Vector.cos(0) * a, Vector.sin(0) * b);
        let bPoint: Vector = new Vector(Vector.cos(step) * a, Vector.sin(step) * b);

        let aBezier: Vector = this.generateBezierDot(aPoint, bPoint, "left");
        let bBezier: Vector = this.generateBezierDot(aPoint, bPoint, "right");

        let firstBezier: Vector = aBezier.clone();
        let firstDot: Vector = aPoint.clone();

        let pathText: string = "M" + a + " 0 ";

        for (let alpha: number = step; alpha < PI2 - 0.01; alpha += step) {
            let mode: string = first ? "C" : "S";
            first ? first = false : aPoint = bPoint.clone();


            bPoint = new Vector(Vector.cos(alpha) * a, Vector.sin(alpha) * b);

            bBezier = this.generateBezierDot(aPoint, bPoint, "right");

            if (mode === "C") {
                pathText = pathText + this.generateCPart(aBezier, bBezier, bPoint);
            } else {
                pathText = pathText + this.generateSPart(bBezier, bPoint);
            }
            aBezier = bBezier.clone();
        }

        return pathText + this.generateSPart(firstBezier.rotate(firstDot, Math.PI), firstDot);
    }

    getRandom(minAmplitude: number, maxAmplitude: number): number {
        return Math.random() * (maxAmplitude - minAmplitude) + minAmplitude;
    }

    generateBezierDot(a: Vector, b: Vector, type: string): Vector {
        let random: number = this.getRandom(this.minAmplitude, this.maxAmplitude);
        let half: Vector = b.clone().sub(a).div(2);

        if (type === 'left') {
            return a.clone().add(half).rotate(a.clone().add(half).add(half.clone().mul(random)), this.PIHalf);
        } else {
            return a.clone().add(half).rotate(a.clone().add(half).sub(half.clone().mul(random)), -this.PIHalf);
        }
    }

    generateCPart(aBezier: Vector, bBezier: Vector, b: Vector): string {
        return " C" + aBezier.x + " " + aBezier.y + " ," + bBezier.x + " " + bBezier.y + " ," + b.x + " " + b.y;
    }

    generateSPart(bBezier: Vector, b: Vector): string {
        return " S" + bBezier.x + " " + bBezier.y + " ," + b.x + " " + b.y;
    }

    static generateNode(x: number, y: number, id: number, text: string = 'Новая Нода'): Node {
        let node: Node = new Node(id, text,  new Vector(x, y));

        return node;
        // return new NodeView(node);
    }
};