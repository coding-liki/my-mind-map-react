import React, {MouseEvent} from 'react';
import {Button} from "@mui/material";
import {EventDispatcher} from "../../../Lib/EventDispatcher";
import {PAGE} from "../../../Lib/Constants/EventDispatcherNames";
import {PAGE_ENABLED, PageEnabled} from "../../../Lib/Constants/Events";

type Props = {
    active?: boolean;
    pageName: string;
}

type State = {
    active: boolean;
}

class PageButton extends React.Component<Props, State> {
    state: State;
    eventDispatcher: EventDispatcher = EventDispatcher.instance(PAGE);

    constructor(props: Props) {
        super(props);
        this.state = {
            active: props.active !== undefined ? props.active : false
        }
    }

    componentDidMount() {
        this.eventDispatcher.subscribe(PAGE_ENABLED, (event: PageEnabled) => {
            this.setState({active: this.props.pageName === event.pageName});
        })
    }

    buttonClicked = (event: MouseEvent) => {
        this.eventDispatcher.dispatch(new PageEnabled(this.props.pageName));
    }

    render() {
        return (<Button onClick={this.buttonClicked}
                        variant={this.state.active ? "contained" : "outlined"}>{this.props.children}</Button>);
    }
}

export default PageButton;
