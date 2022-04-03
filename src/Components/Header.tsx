import React from 'react';
import {Button, ButtonGroup} from "@mui/material";
import PageButton from "./Lib/Page/PageButton";
import {EDITOR_PAGE, LIST_PAGE} from "../Lib/Constants/Pages";

function Logo() {
    return (
        <div className="logo">Vinilla La Puh<div className="smaller">(Mind Maps)</div></div>
    );
}


function Header() {
    return (
        <header className="column">
            <div className="row"><Logo/></div>
            <div className="row">
                <div className="center">
                    <ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
                        <PageButton active={true} pageName={EDITOR_PAGE}>Редактор</PageButton>
                        <PageButton pageName={LIST_PAGE}>Список карт</PageButton>
                    </ButtonGroup>
                </div>
            </div>
        </header>
    )
}

export default Header;