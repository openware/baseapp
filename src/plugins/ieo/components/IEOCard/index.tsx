import * as React from 'react';
import { DataIEOInterface } from '../../modules';

interface Props {
    ieo: DataIEOInterface;
    iconUrl?: string | null;
    translations;
    onIEOSelect: (ieo: DataIEOInterface) => void;
}

export class IEOCard extends React.Component<Props> {
    public render() {
        const {
            currency_id,
            name,
            starts_at,
            finishes_at,
            supply,
        } = this.props.ieo;
        const { iconUrl } = this.props;

        return (
            <div className="pg-ieo__card">
                <div className="pg-ieo__card-header pg-container">
                    {iconUrl && <img className="pg-ieo__card-header__icon" src={iconUrl} />}
                    <span className="pg-ieo__card-header__text">{currency_id}</span>
                </div>
                <div className="pg-ieo__card-content pg-container">
                    <span className="pg-ieo__card-content__title">{name}</span>
                    <span className="pg-ieo__card-content__text">info</span>
                    <div className="pg-ieo__card-content-block">
                        <span className="pg-ieo__card-content-block__text">
                            Goal
                        </span>
                        <span className="pg-ieo__card-content-block__text text-bold">
                            {supply}
                        </span>
                        <span className="pg-ieo__card-content-block__text">
                            Start date
                        </span>
                        <span className="pg-ieo__card-content-block__text text-bold">
                            {starts_at}
                        </span>
                        <span className="pg-ieo__card-content-block__text">
                            End date
                        </span>
                        <span className="pg-ieo__card-content-block__text text-bold">
                            {finishes_at}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

