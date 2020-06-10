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

class MagicLink extends React.Component<MagicLinkProps, MagicLinkState> {
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
            this.props.sendAccessToken({ whitelink_token: token});
        }
    }

    public render() {
        return null;
    }
}

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    sendAccessToken: payload => dispatch(sendAccessToken(payload)),
});

export const MagicLinkWrapper = compose(
    withRouter,
    connect(null, mapDispatchProps),
)(MagicLink) as React.ComponentType;
