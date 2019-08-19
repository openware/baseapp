import * as jwt from 'jsonwebtoken';
import * as React from 'react';
import { LockScreen } from '../../screens/LockScreen';

interface Props {
    version: string;
    buildExpire: string;
    tenkoKey: string;
    licenseFetch: () => void;
    setLicenseExpiration: (payload) => void;
    token: string;
    tokenFetching: boolean;
}

class GuardWrapper extends React.Component<Props> {
    public componentDidMount() {
        const { tenkoKey, token } = this.props;
        if (tenkoKey && !this.tokenValid(token)) {
            this.props.licenseFetch();
        }
    }

    public render() {
        const { version, buildExpire, tokenFetching, token } = this.props;
        let expirationTime: number | undefined;

        if (buildExpire) {
            expirationTime = parseInt(buildExpire, 10);
        }

        if (expirationTime && Date.now() > expirationTime) {
            return <LockScreen type="expired"/>;
        } else if (version === 'Lite' && tokenFetching) {
            return <div>Loading...</div>;
        } else if (version === 'Lite' && !tokenFetching && !this.tokenValid(token)) {
            return <LockScreen type="license"/>;
        } else {
            return this.props.children;
        }
    }

    private tokenValid = (token: string): boolean => {
        const { tenkoKey } = this.props;
        const algorithms = ['RS256'];

        if (token) {
            try {
                const { domain, expire_at } = jwt.verify(token, atob(tenkoKey), { algorithms: algorithms });
                if (!domain || !expire_at) {
                    return false;
                } else if (window.location.hostname !== domain) {
                    return false;
                }
                this.props.setLicenseExpiration({ expiresAt: expire_at });
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}

export {
    GuardWrapper,
};
