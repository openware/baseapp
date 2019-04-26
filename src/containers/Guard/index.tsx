import * as React from 'react';
import { LockScreen } from '../../screens/LockScreen';

class GuardWrapper extends React.Component {
    public render() {
        let expirationTime: number | undefined;

        if (process.env.BUILD_EXPIRE) {
            expirationTime = parseInt(process.env.BUILD_EXPIRE, 10);
        }

        if (expirationTime && Date.now() > expirationTime) {
            return <LockScreen/>;
        } else {
            return this.props.children;
        }
    }
}

export {
    GuardWrapper,
};
