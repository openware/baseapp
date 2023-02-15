import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../';
import { TipIcon } from '../../assets/images/TipIcon';

interface Props {
    children: React.ReactNode;
    hint: string;
}

export const WarningMessage = (props: Props) => {
    return (
        <div className="cr-warning-message">
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 300 }} overlay={<Tooltip title={props.hint} />}>
                <div className="cr-deposit-crypto-tabs__card-title-tip">
                    <TipIcon />
                </div>
            </OverlayTrigger>
            {props.children}
        </div>
    );
};
