import React, {Fragment} from 'react';
import Header from "./Header";
import '../css/PageContainer.css';
import EditorPage from "./Pages/EditorPage";
import ListPage from "./Pages/ListPage";
import MindMap from "../Lib/Models/MindMap";
import RandomGenerator from "../Svg/RandomGenerator";

function AllPages() {
    let firstNode = RandomGenerator.generateNode(0,0,1, 'Первая нода' +
        "\nс кучей вещей");
    let secondNode = RandomGenerator.generateNode(100,100,2, 'Вторая нода');

    secondNode.parentLinkNode = firstNode;
    secondNode.parentNode = firstNode;

    return (<Fragment>
        <EditorPage active={true} mindMap={new MindMap(1, "First Mind Map", [
            firstNode,
            secondNode
        ])}/>
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