import React from 'react';
import {EventDispatcher} from "../../../Lib/EventDispatcher";
import {PAGE} from "../../../Lib/Constants/EventDispatcherNames";
import {PAGE_ENABLED, PageEnabled} from "../../../Lib/Constants/Events";
import '../../../css/Page.css';

type Props = {
    active?: boolean;
    pageName: string;
    visibleName?: string;
}

type State = {
    active: boolean
}

class Page extends React.Component<Props, State> {
    eventDispatcher: EventDispatcher = EventDispatcher.instance(PAGE);

    constructor(props: Props) {
        super(props);
        this.state = {
            active: props.active ? props.active : false
        }
    }

    componentDidMount() {
        this.eventDispatcher.subscribe(PAGE_ENABLED, (event: PageEnabled) => {
            this.setState({active: this.props.pageName === event.pageName});
        })
    }

    renderPage() {
        return (
            <section className="column full">
                <header className="center">
                    <h2>{this.props.visibleName ? this.props.visibleName : this.props.pageName}</h2>
                </header>
                <article className="full bordered">{this.props.children}</article>
            </section>
        );
    }

    render() {
        return this.state.active ? this.renderPage() : null;
    }
}

export default Page;