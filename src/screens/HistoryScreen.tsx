import * as React from 'react';
import { HistoryTab } from '../components/HistoryTab';
import { Titled } from '../decorators';

@Titled('History')
class HistoryScreen extends React.Component {
    public render() {
        return (
            <HistoryTab />
        );
    }
}

export {
    HistoryScreen,
};
