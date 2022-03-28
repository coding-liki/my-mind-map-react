import React from 'react';
import {Button, ButtonGroup} from "@mui/material";

function Logo() {
    return (
        <div className="logo">Vinilla La Puh <div className="smaller">(Mind Maps)</div></div>
    );
}


function Header() {
    return (
        <header>
            <Logo/>
            <div className="right">
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button>One</Button>
                    <Button>Two</Button>
                    <Button>Three</Button>
                </ButtonGroup>
            </div>
        </header>
    )
}

export default Header;