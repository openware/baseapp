import * as React from 'react';
import { injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

const noFooterRoutes = [
    '/confirm',
    '/404',
    '/500',
];

type FooterProps = LocationProps & IntlProps;

class FooterComponent extends React.Component<FooterProps> {
    public render() {
        const { location } = this.props;
        const shouldRenderFooter = !noFooterRoutes.some(r => location.pathname.includes(r));

        if (!shouldRenderFooter) {
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

    public translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const Footer = compose(
    injectIntl,
    withRouter,
)(FooterComponent) as React.ComponentClass;
