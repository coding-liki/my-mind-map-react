import MindMap from "./MindMap";
import _ from "lodash";

class MindMapHistory{
    history: Array<MindMap> = [];

    currentIndex: number = -1;
    current: MindMap;
    constructor(mindMap: MindMap) {
        this.current = mindMap
        this.push()
    }

    push(){
        this.history.splice(this.currentIndex)
        console.log(this.history)
        this.history.push(_.cloneDeep(this.current))
        this.currentIndex++;
    }

    up(){
        console.log("try up");
        if(this.currentIndex > 0) {
            this.currentIndex --;
            this.current =this.history[this.currentIndex];
        }
    }

    down(){
        console.log("try down");

        if(this.currentIndex < this.history.length-1){
            this.currentIndex ++;
            this.current =this.history[this.currentIndex];
        }
    }
}

export default MindMapHistory;

