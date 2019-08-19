import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {
    expiresAt: string;
}

class FooterComponent extends React.Component<Props> {
    public render() {
        if (location.pathname.startsWith('/confirm')) {
            return <React.Fragment />;
        }

        const { expiresAt } = this.props;
        const startDate = expiresAt ? (+expiresAt * 1000) : '';
        const today = new Date().getTime();

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <span>Powered by</span>
                    <a href="https://www.openware.com">openware.com</a>
                    {startDate && <span>EXPIRE IN <b>{Math.ceil((startDate - today) / (3600 * 1000 * 24))} days</b></span>}
                </footer>
            </React.Fragment>
        );
    }
}

// tslint:disable-next-line:no-any
const Footer = withRouter(FooterComponent as any) as any;

export {
    Footer,
};
