import React, {Fragment} from 'react';
import Header from "./Header";
import '../css/PageContainer.css';
import EditorPage from "./Pages/EditorPage";
import ListPage from "./Pages/ListPage";
import MindMap from "../Lib/Models/MindMap";

function AllPages() {
    return (<Fragment>
        <EditorPage active={true} mindMap={new MindMap(1, "First Mind Map", [])}/>
        <ListPage />
    </Fragment>);
}
function PageContainer() {
    return (
      <div className="page-container full">
          <Header/>
          <AllPages/>
      </div>
    );
}
export default PageContainer;