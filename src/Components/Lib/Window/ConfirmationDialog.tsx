import React, {MouseEventHandler} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

type Props = {
    title: string
    open: boolean
    onConfirm: MouseEventHandler
    onCancel: MouseEventHandler
}

class ConfirmationDialog extends React.Component<Props, any> {
    render() {
        return (
            <Dialog
                open={this.props.open}
            >
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent dividers>
                    {this.props.children}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={this.props.onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={this.props.onConfirm}>Ok</Button>
                </DialogActions>
            </Dialog>
        )
    }
}


export default ConfirmationDialog;