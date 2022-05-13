import React from 'react';
import Page from "../Lib/Page/Page";
import {LIST_PAGE} from "../../Lib/Constants/Pages";
import MindMap from "../../Lib/Models/MindMap";

type Props = {
    active?: boolean;
    mindMaps: MindMap[];
}

type State = {
    // active: boolean
}

class ListPage extends React.Component<Props, State> {

    render() {
        return (
            <Page pageName={LIST_PAGE} active={this.props.active} visibleName="Список карт">
                {this.props.mindMaps.map((mindMap) => {
                    return (
                        <div className={"row"}>
                            {mindMap.name}
                        </div>
                    )
                })}
            </Page>
        );
    }
}


export default ListPage;
