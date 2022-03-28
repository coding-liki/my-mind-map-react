const SVG_NS: string = "http://www.w3.org/2000/svg";

export default class EditableText {
    text: string = "";

    getTSpans(): Element[] {
        let lines: string[] = this.text.split("\n");
        let tSpans: Element[] = [];
        let first: boolean = true;
        lines.forEach((line) => {
            let tSpan = document.createElementNS(SVG_NS, "tspan");
            tSpan.textContent = line;
            tSpan.setAttributeNS(null, 'x', "0");
            if (first) {
                first = false;
                tSpan.setAttributeNS(null, 'y', "1em");
            } else {
                tSpan.setAttributeNS(null, 'dy', "1em");

            }
            tSpans.push(tSpan);
        })

        return tSpans;
    }
}