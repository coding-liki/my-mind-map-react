import React from 'react';
import PageButton from "./Page/PageButton";


class WithContextMenu  extends React.Component<any, any> {
    render() {
        console.log(PageButton)
        return (
            <div >
                {this.props.children}
            </div>
        );
    }
}