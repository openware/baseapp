import * as React from 'react';
import { PG_TITLE_PREFIX } from '../constants';

const Titled = <P extends {} = {}, S extends {} = {}>
(title: string) => (Child: React.ComponentClass<P, S>) => {
    return class extends React.Component<P, S> {
        public componentWillReceiveProps(next: P) {
            // nothing
        }

        public componentDidMount() {
            document.title = [PG_TITLE_PREFIX, title].join(': ');
        }

        public render() {
            return <Child {...this.props} />;
        }
    };
};

export {
    Titled,
};
