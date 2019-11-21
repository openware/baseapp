import * as React from 'react';
import { IEODetails } from '../../components/IEODetails';
import { IEOInfo } from '../../components/IEOInfo';
import { IEOProjectIntroduction } from '../../components/IEOProjectIntroduction';

interface PropsIEO {
    value?: number;
}

type Props = PropsIEO;

class IEODetailsScreen extends React.Component<Props> {
    public render() {
        return (
            <div className="container pg-ieo-page">
                <div className="pg-ieo-page__info">
                    <IEOInfo />
                </div>
                <div className="pg-ieo-page__details">
                    <IEODetails />
                </div>
                <div className="pg-ieo-page__product-intiduction">
                    <IEOProjectIntroduction />
                </div>
            </div>
        );
    }
}

export {
    IEODetailsScreen,
};
