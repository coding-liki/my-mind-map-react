import React from 'react';
import Page from "../Lib/Page/Page";
import {LIST_PAGE} from "../../Lib/Constants/Pages";

type Props = {
    active?: boolean;
}

type State = {
    // active: boolean
}

class ListPage extends React.Component<Props, State> {

    render() {
        return (
            <Page pageName={LIST_PAGE} active={this.props.active} visibleName="Список карт"></Page>
        );
    }
}


export default ListPage;
