import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { compose } from 'redux';
import {
    RootState,
    selectBlocklistAccessLoading,
    selectBlocklistAccessSuccess,
    sendAccessToken,
} from '../../modules';

interface LocationProps extends RouterProps {
    location: {
        search: string;
    };
}

interface MagicLinkState {
    token: string;
}

interface ReduxProps {
    success: boolean;
    loading: boolean;
}

interface DispatchProps {
    sendAccessToken: typeof sendAccessToken;
}

export type MagicLinkProps = LocationProps & ReduxProps & DispatchProps;

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
            this.props.sendAccessToken({ whitelink_token: token });
        } else {
            this.props.history.replace('/');
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: MagicLinkProps) {
        if (!this.props.success && nextProps.success) {
            this.props.history.replace('/');
        }
    }

    public render() {
        const { loading } = this.props;

        if (loading) {
            return (
                <div className="pg-loader-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        return null;
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    success: selectBlocklistAccessLoading(state),
    loading: selectBlocklistAccessSuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    sendAccessToken: payload => dispatch(sendAccessToken(payload)),
});

export const MagicLink = compose(
    withRouter,
    connect(mapStateToProps, mapDispatchProps),
)(MagicLinkScreen) as React.ComponentClass;
