import { Button } from '@openware/components';
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { LegalDocuments } from '../LegalDocuments';

export interface FooterState {
    showModal: boolean;
}

// tslint:disable
class Foot extends React.Component<{}, FooterState> {
    public state = {
        showModal: false,
    };

    public render() {
        const { showModal } = this.state;
        return(
          <React.Fragment>
          {!['/confirm'].some(r=> location.pathname.includes(r)) &&
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
          }
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
