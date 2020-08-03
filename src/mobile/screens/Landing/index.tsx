import * as React from 'react';
import { MarketsTable } from '../../../containers';

const LandingComponent = () => {
    return (
        <div className="pg-landing-screen-mobile">
            <MarketsTable />
        </div>
    );
};

export const LandingScreenMobile = React.memo(LandingComponent);
