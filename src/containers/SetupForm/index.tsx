import * as React from 'react';
import { SetupFormBlock } from 'src/components';

export class SetupForm extends React.Component {
    public render() {
        return (
            <div>
                <SetupFormBlock 
                    title={'General Settings'}
                    subtitle={'subtitle'}
                    children={<div>children</div>}
                />
            </div>
        );
    }
}
