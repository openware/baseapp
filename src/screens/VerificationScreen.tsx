import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
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

export interface RouterProps {
    location: {
        search: string;
    };
}

type Props = DispatchProps & RouterProps & ReduxProps;

export const extractToken = (props: RouterProps) => new URLSearchParams(props.location.search).get('confirmation_token');

class Verification extends React.Component<Props> {
    public componentDidMount() {
        const token = extractToken(this.props);
        if (token) {
            this.props.verification({ token });
        }
    }

    public render() {
        return (
            <Redirect to={'/signin'} />
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
