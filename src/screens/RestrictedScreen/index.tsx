import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { IntlProps } from '../../';
import { setDocumentTitle } from '../../helpers';
import { RootState, selectPlatformAccessStatus } from '../../modules';

interface ReduxProps {
    status: string;
}

type Props = RouterProps & IntlProps & ReduxProps;

class Restricted extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('404');
        if (this.props.status.length && this.props.status !== 'restricted') {
            this.props.history.replace('/');
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (!this.props.status.length && nextProps.status.length && nextProps.status !== 'restricted') {
            this.props.history.replace('/');
        }
    }

    public render() {
        return (
            <div className="pg-restricted-screen">
                <div className="pg-restricted-screen__title">404</div>
                <div className="pg-restricted-screen__content">{this.translate('page.body.restricted')}</div>
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, unknown, RootState> = (state) => ({
    status: selectPlatformAccessStatus(state),
});

export const RestrictedScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps)
)(Restricted) as React.ComponentClass;
