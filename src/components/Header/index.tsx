import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { NavBar } from '../NavBar';

interface HeaderState {
    isActive: boolean;
}

// tslint:disable
class Head extends React.Component<any, HeaderState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isActive: false,
        };
    }

    public render() {
        const { location } = this.props;
        const { isActive } = this.state;
        const link = `/wallets/btc/deposit`;
        return (
          <React.Fragment>
          {!location.pathname.includes('/profile') &&
            <header className={`pg-header ${isActive ? 'pg-header--active' : ''}`}>
                <div className="pg-container pg-header__content">
                    <a className="pg-header__logo" href={link}>
                      <div className="pg-logo">
                          Logo
                      </div>
                    </a>
                    <div className="pg-header__navbar">
                        <NavBar onLinkChange={this.toggleModal}/>
                    </div>
                    <div
                        onClick={this.toggleModal}
                        className={`pg-header__toggler ${isActive ? 'pg-header__toggler--active' : ''}`}
                    >
                        <span className="pg-header__toggler-item"/>
                        <span className="pg-header__toggler-item"/>
                        <span className="pg-header__toggler-item"/>
                    </div>
                </div>
            </header>
          }
          </React.Fragment>
        );
    }

    private toggleModal = () => {
        this.setState(prev => ({
            isActive: !prev.isActive,
        }));
    }
}

// tslint:disable-next-line
const Header = withRouter(Head as any);

export {
    HeaderState,
    Header,
};
