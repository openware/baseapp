import * as React from 'react';
import { HistoryTab } from '../containers/HistoryTab';
import { Titled } from '../decorators';

@Titled('History')
export class HistoryScreen extends React.Component {
    public render() {
        return (
            <HistoryTab />
        );
    }
}
