import {AddressType, Entity, EntityFieldValues} from '@flowfact/types';
import {useEffect, useMemo, useState} from 'react';
import {MultimediaItem, MultimediaServiceInstance} from '@flowfact/api-services';

import './EstateInformation.css'
import {PlainEntityUtil} from '@flowfact/utils';

export interface EstateInformationProps {
    estateEntity: Entity;
}

export const EstateInformation = (props: EstateInformationProps) => {
    const {estateEntity} = props;

    const [mainImage, setMainImage] = useState<MultimediaItem>();

    useEffect(() => {
        (async function () {
            const schemaName = estateEntity._metadata.schema;
            // flowfact_client is a special multimedia album. It is always present  and used for all main images in your FLOWFACT application for estates, contacts and more
            const response = await MultimediaServiceInstance.albumAssignment.fetchAssignments(schemaName, estateEntity.id, 'flowfact_client', false);
            if (response.isSuccessful2xx && response.data) {
                const assignment = response.data.assignments['main_image'][0];
                if (assignment) {
                    setMainImage(assignment.multimedia as MultimediaItem);
                }
            }
        })()
    }, [estateEntity]);

    const address = useMemo(() => {
        const address = PlainEntityUtil.getFirstValueOfField<AddressType>(estateEntity.addresses as EntityFieldValues);
        if (!address) {
            return '';
        }
        return `${address.street}, ${address.zipcode} ${address.city}`;
    }, [estateEntity]);


    return (
        <div className="estate">
            <div className="image">
                <img src={mainImage?.fileReference} alt={mainImage?.description || 'Image'}/>
            </div>
            <div className="data-container">
                <h4 className="item headline">{PlainEntityUtil.getFirstValueOfField(estateEntity.internaldescription as EntityFieldValues) || 'Headline'}</h4>
                <div className="item">
                    <span className="label">Identifier</span>
                    <span className="value">{PlainEntityUtil.getFirstValueOfField(estateEntity.identifier as EntityFieldValues)}</span>
                </div>
                <div className="item">
                    <span className="label">Address</span>
                    <span className="value">{address}</span>
                </div>
            </div>
        </div>
    )
}
