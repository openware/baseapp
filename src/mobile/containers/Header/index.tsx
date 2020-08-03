import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { RootState, selectUserLoggedIn } from '../../../modules';
import { HeaderComponent } from '../../components';

interface ReduxProps {
    userLoggedIn: boolean;
}

type Props = ReduxProps & InjectedIntlProps;

class HeaderContainer extends React.Component<Props> {
    public render() {
        return (
            <HeaderComponent
                translate={this.translate}
                userLoggedIn={this.props.userLoggedIn}
            />
        );
    }

    public translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    userLoggedIn: selectUserLoggedIn(state),
});

export const Header = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps),
)(HeaderContainer) as React.ComponentClass;
