import { Button } from '@openware/components';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { LegalDocuments } from '../LegalDocuments';

export interface FooterState {
    showModal: boolean;
}

class Foot extends React.Component<{}, FooterState> {
    public state = {
        showModal: false,
    };

    public render() {
        const { showModal } = this.state;
        if (location.pathname.startsWith('/confirm')) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <span className="pg-footer__link" onClick={this.toggleModal}>
                        <FormattedMessage id="page.footer.legalDocuments" />
                    </span>
                    <LegalDocuments
                        isOpen={showModal}
                        footer={<Button label={'Ok'} onClick={this.toggleModal} />}
                    />
                    <Link className="pg-footer__link" to="/help">
                        <FormattedMessage id="page.footer.faq" />
                    </Link>
                </footer>
            </React.Fragment>
        );
    }

    private toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };
}

// tslint:disable-next-line
const Footer = withRouter(Foot as any);

export {
    Footer,
};
