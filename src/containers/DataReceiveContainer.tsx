import {useEffect, useState} from 'react';
import postRobot from 'post-robot';
import {Entity} from '@flowfact/types';
import {EstateInformation} from '../components/EstateInformation/EstateInformation';
import {__MODULE_KEY__} from '../globals';

interface DataEvent {
    data: Entity;
}

export const DataReceiveContainer = () => {
    const [entity, setEntity] = useState<Entity>();

    // Depending on the integration of the widget, the data passed to the widget is different.
    useEffect(() => {
        postRobot.on(`data_${__MODULE_KEY__}`, async (event: DataEvent) => {
            // As example, we expect this widget to be integrated inside an estate entity context
            setEntity(event.data);
        });
    }, []);

    if (!entity) {
        // return what ever you want
        return null;
    }

    return (
        <EstateInformation estateEntity={entity}/>
    )
}
