import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { IntlProps } from '../../';
import { RootState, selectConfigsLoading } from '../../modules';

interface ReduxProps {
    configsLoading: boolean;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

const noFooterRoutes = ['/confirm', '/404', '/500'];

type FooterProps = LocationProps & ReduxProps & IntlProps;

class FooterComponent extends React.Component<FooterProps> {
    public render() {
        const { location, configsLoading } = this.props;
        const shouldRenderFooter = !noFooterRoutes.some((r) => location.pathname.includes(r));

        if (!shouldRenderFooter || configsLoading) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <span>{this.translate('pagy.body.footer.powered_by')}</span>
                    <a href="https://www.openware.com">openware.com</a>
                </footer>
            </React.Fragment>
        );
    }

    public translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    configsLoading: selectConfigsLoading(state),
});

export const Footer = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps)
)(FooterComponent) as React.ComponentClass;
