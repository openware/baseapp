import {
  TabPanel,
} from '@openware/components';

import * as React from 'react';
import { ExchangeElement } from './component';

const renderTabs = () => {
    return [
        {
            content: <ExchangeElement type="buy" />,
            label: 'Buy',
        },
        {
            content: <ExchangeElement type="sell" />,
            label: 'Sell',
        },
    ];
};

export const Exchange: React.FunctionComponent= () => {
    return (
        <div className="pg-exchange pg-container">
            <div className="pg-exchange__tabs-content">
                <TabPanel panels={renderTabs()} />
            </div>
        </div>
    );
};
