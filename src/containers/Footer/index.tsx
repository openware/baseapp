import * as React from 'react';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';

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

class FooterComponent extends React.Component<LocationProps> {
    public render() {
        const { location } = this.props;
        const shouldRenderFooter = !noFooterRoutes.some(r => location.pathname.includes(r));

        if (!shouldRenderFooter) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <span>Powered by</span>
                    <a href="https://www.openware.com">openware.com</a>
                </footer>
            </React.Fragment>
        );
    }
}

export const Footer = withRouter(FooterComponent as any);
