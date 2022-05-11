import React, {Fragment} from 'react';
import Header from "./Header";
import '../css/PageContainer.css';
import EditorPage from "./Pages/EditorPage";
import ListPage from "./Pages/ListPage";
import MindMap from "../Lib/Models/MindMap";
import RandomGenerator from "../Svg/RandomGenerator";
import LocalStorage from "../Lib/LocalStorage";

function AllPages() {
    function generateMindMap() {
        let firstNode = RandomGenerator.generateNode(0, 0, 1, 'Первая нода' +
            "\nс кучей вещей");
        let secondNode = RandomGenerator.generateNode(100, 100, 2, 'Вторая нода');

        let thirdNode = RandomGenerator.generateNode(200, 200, 3, 'Третья нода');

        let fourthNode = RandomGenerator.generateNode(100, 300, 4, 'Четвёртая нода');

        let fifthNode = RandomGenerator.generateNode(0, 200, 5, 'Пятая нода');

        secondNode.parentLinkNode = firstNode;
        secondNode.parentNode = firstNode;

        thirdNode.parentLinkNode = secondNode;
        thirdNode.parentNode = firstNode;

        fourthNode.parentLinkNode = thirdNode;
        fourthNode.parentNode = firstNode;

        fifthNode.parentLinkNode = fourthNode;
        fifthNode.parentNode = firstNode;

        return new MindMap(1, "First Mind Map", [
            firstNode,
            secondNode,
            thirdNode,
            fourthNode,
            fifthNode
        ]);
    }

    function getMindMap() {
        let mindMapRaw: string|null = LocalStorage.get('lastMindMap');
        let mindMap: MindMap;

        if(!mindMapRaw) {
            mindMap = generateMindMap();
        } else {
            mindMap = MindMap.fromJson(JSON.parse(mindMapRaw));
        }

        return mindMap;
    }

    let mindMap = getMindMap();

    return (<Fragment>
        <EditorPage active={true} mindMap={mindMap}/>
        <ListPage/>
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