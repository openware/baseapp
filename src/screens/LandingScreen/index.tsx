import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';

type Props = InjectedIntlProps;

class LandingScreenClass extends React.Component<Props> {
    public renderMarketsTable() {
        return (
            <div className="pg-landing-screen__markets-table">
                <div className="pg-landing-screen__markets-table__wrap">
                    <MarketsTable />
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderMarketsTable()}
            </div>
        );
    }
}

export const LandingScreen = withRouter(injectIntl(LandingScreenClass));
