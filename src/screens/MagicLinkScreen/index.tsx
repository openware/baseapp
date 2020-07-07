import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { compose } from 'redux';
import { sendAccessToken } from '../../modules';

interface LocationProps extends RouterProps {
    location: {
        search: string;
    };
}

interface MagicLinkState {
    token: string;
}

interface DispatchProps {
    sendAccessToken: typeof sendAccessToken;
}

export type MagicLinkProps = LocationProps & DispatchProps;

class MagicLinkScreen extends React.Component<MagicLinkProps, MagicLinkState> {
    constructor(props: MagicLinkProps) {
        super(props);

        this.state = {
            token: '',
        };
    }

    public componentDidMount() {
        const urlParams = new URLSearchParams(this.props.location.search);
        const token = urlParams.get('token') as string;

        if (token) {
            this.props.sendAccessToken({ allowlink_token: token });
        } else {
            this.props.history.replace('/');
        }
    }

    public render() {
        return null;
    }
}

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    sendAccessToken: payload => dispatch(sendAccessToken(payload)),
});

export const MagicLink = compose(
    withRouter,
    connect(null, mapDispatchProps),
)(MagicLinkScreen) as React.ComponentClass;
