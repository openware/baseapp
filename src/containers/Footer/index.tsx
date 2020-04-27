import * as React from 'react';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';

class FooterComponent extends React.Component<RouterProps> {
    public render() {
        if (this.props.history.location.pathname.startsWith('/confirm')) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <span>Powered by</span>
                    <a href="https://www.ansobit.com">ansobit.com</a>
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
