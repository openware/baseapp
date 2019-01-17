import { Button } from '@openware/components';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { LegalDocuments } from '../LegalDocuments';

export interface FooterState {
    showModal: boolean;
}

class Footer extends React.Component<{}, FooterState> {
    public state = {
        showModal: false,
    };

    public render() {
        const { showModal } = this.state;
        return(
            <footer className="pg-footer">
                <span className="pg-footer__link" onClick={this.toggleModal}>Legal documents</span>
                <LegalDocuments
                    isOpen={showModal}
                    footer={<Button label={'Ok'} onClick={this.toggleModal}/>}
                />
                <Link className="pg-footer__link" to="/help">
                    FAQ
                </Link>
            </footer>
        );
    }

    private toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };
}

export {
    Footer,
};
