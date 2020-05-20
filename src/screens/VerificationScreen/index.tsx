import * as React from 'react';
import { injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { Redirect } from 'react-router';
import { compose } from 'redux';
import { languages } from '../../api';
import { IntlProps } from '../../index';
import {
    changeLanguage,
    RootState,
    selectEmailVerified,
    verificationFetch,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface DispatchProps {
    verification: typeof verificationFetch;
    changeLanguage: typeof changeLanguage;
}

interface ReduxProps {
    isEmailVerified?: boolean;
    error?: CommonError;
}

export interface RouterProps {
    location: {
        search: string;
    };
}

type Props = DispatchProps & RouterProps & ReduxProps;

export const extractToken = (props: RouterProps) => new URLSearchParams(props.location.search).get('confirmation_token');
export const extractLang = (props: RouterProps) => new URLSearchParams(props.location.search).get('lang');

class Verification extends React.Component<Props, IntlProps> {
    public componentDidMount() {
        const token = extractToken(this.props);
        const lang = extractLang(this.props);

        if (token) {
            this.props.verification({ token });
        }

        if (lang && languages.includes(lang.toLowerCase())) {
            this.props.changeLanguage(lang.toLowerCase());
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
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        verification: data => dispatch(verificationFetch(data)),
        changeLanguage: lang => dispatch(changeLanguage(lang)),
    });

export const VerificationScreen = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(Verification) as React.ComponentClass;
