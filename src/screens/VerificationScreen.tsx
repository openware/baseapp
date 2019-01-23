import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import { Redirect } from 'react-router';
import {
    AuthError,
    RootState,
    selectAuthError,
    selectEmailVerified,
    verificationFetch,
} from '../modules';

interface DispatchProps {
    verification: typeof verificationFetch;
}

interface ReduxProps {
    isEmailVerified?: boolean;
    error?: AuthError;
}

interface RouterProps {
    location: {
        search: string;
    };
}

type Props = DispatchProps & RouterProps & ReduxProps;


class Verification extends React.Component<Props> {
    public componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const token = queryParams.get('confirmation_token');
        if (token) {
            this.props.verification({ confirmation_token: token });
        }
    }

    public render() {
        const { isEmailVerified, error } = this.props;
        return (
            isEmailVerified ? <Redirect to={'/signin'} /> : <h3 className="pg-sign-up-screen">{error && error.message}</h3>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    isEmailVerified: selectEmailVerified(state),
    error: selectAuthError(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        verification: data => dispatch(verificationFetch(data)),
    });

const VerificationScreen = connect(mapStateToProps, mapDispatchToProps)(Verification);

export {
    VerificationScreen,
};
