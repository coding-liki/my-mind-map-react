// export interface EventInterface{
//     getName(): string;
// }

import {NodeView} from "../Views/NodeView";

export interface Event {
    name: string;
}

/************** Page events *************/
export const PAGE_ENABLED = 'pageEnabled';
export const PAGE_DISABLED_BEFORE = 'pageDisabledBefore';
export const PAGE_ENABLED_AFTER = 'pageEnabledAfter';
export const PAGE_DISABLED_AFTER = 'pageDisabledAfter';
export const PAGE_SET_NAME = 'pageSetName';
export const PAGE_UPDATED = 'pageUpdated';

export class PageEnabled implements Event {
    name = PAGE_ENABLED;

    pageName: string;

    constructor(pageName: string) {
        this.pageName = pageName;
    }
}

export class PageDisabledBefore implements Event {
    name: string = PAGE_DISABLED_BEFORE;

    pageName: string;

    constructor(pageName: string) {
        this.pageName = pageName;
    }
}

export class PageEnabledAfter implements Event {
    name: string = PAGE_ENABLED_AFTER;

    pageName: string;

    constructor(pageName: string) {
        this.pageName = pageName;
    }
}

export class PageDisabledAfter implements Event {
    name: string = PAGE_DISABLED_AFTER;

    pageName: string;

    constructor(pageName: string) {
        this.pageName = pageName;
    }
}

export class PageSetName implements Event {
    name: string = PAGE_SET_NAME;

    pageVisibleName: string;

    constructor(pageVisibleName: string) {
        this.pageVisibleName = pageVisibleName;
    }
}

export class PageUpdated implements Event {
    name: string = PAGE_UPDATED;

    pageName: string;

    constructor(pageName: string) {
        this.pageName = pageName;
    }
}

/*****************************************/

/************** Node Events **************/
export const NODE_UPDATE_TEXT = 'nodeUpdateText';
export const NODE_START_EDIT = 'nodeStartEdit';
export const NODE_SELECTED = 'nodeSelected';

export class NodeUpdateText implements Event {
    name: string = NODE_UPDATE_TEXT;
    nodeId: number;

    constructor(nodeId: number) {
        this.nodeId = nodeId;
    }
}

export class NodeStartEdit implements Event {
    name: string = NODE_START_EDIT;
    nodeView: NodeView;

    constructor(nodeView: NodeView) {
        this.nodeView = nodeView;
    }
}

export class NodeSelected implements Event {
    name: string = NODE_SELECTED;
    nodeId: number;

    constructor(nodeId: number) {
        this.nodeId = nodeId;
    }
}


/*****************************************/
