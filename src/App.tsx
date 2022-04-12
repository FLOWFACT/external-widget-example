import './App.css'
import {useEffect, useState} from 'react';
import postRobot from 'post-robot';
import {Authentication, CaasManagementServiceTypes, EnvironmentManagementInstance, StageTypes, VersionTagTypes} from '@flowfact/api-services';
import {DataReceiveContainer} from './containers/DataReceiveContainer';
import {__MODULE_KEY__} from './globals';
import {AuthenticationData} from '@flowfact/types';
import {CommonUtil} from '@flowfact/utils';

interface InitialData {
    environment: {
        stage: StageTypes;
        versionTag: VersionTagTypes;
    };
    tokens: AuthenticationData;
}

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    /**
     * This useEffect is important. It will be only executed on the first mount of the react application.
     * It should set the environment information to call the correct FLOWFACT API and it logs in via tokens.
     */
    useEffect(() => {
        postRobot.on(`initial_${__MODULE_KEY__}`, async ({data}: { data: InitialData }) => {
            const {environment, tokens} = data;

            // Set the environment information (this is optional)
            // The environment can be development, staging or production.
            EnvironmentManagementInstance.setStage(environment.stage);
            EnvironmentManagementInstance.setVersionTag(environment.versionTag);

            // login via the send token
            const userSession = await Authentication.loginWithTokens(tokens);
            if (userSession.isValid()) {
                setLoggedIn(true);
            }
        });

        // This is completely optional! You just need this if you want to define your own height and width.
        // Or do not want to see a scrollbar
        const element = document.querySelector('body');
        CommonUtil.onElementHeightChange(element, () => {
            postRobot.send(window.parent, `resize_${__MODULE_KEY__}`, {
                scrollHeight: element!.scrollHeight,
                clientHeight: element!.clientHeight,
                scrollWidth: element!.scrollWidth,
                clientWidth: element!.scrollWidth
            });
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            // 3rd argument can be undefined here, because we just have to tell the main frontend, that the widget is
            // ready loaded.
            postRobot.send(window.parent, `ready_${__MODULE_KEY__}`, undefined);
        }
    }, [isLoggedIn]);


    return (
        <div className="application">
            {!isLoggedIn ? <div>You need to be logged in</div> : null}
            {/* it is important that this component is mounted and has registered it's on `data` handler before `ready` is sent  */}
            <DataReceiveContainer/>
        </div>
    );
}

export default App
