import * as React from 'react';
import { SetupInfoBlock } from '../../components';
import { SetupForm } from '../../containers';

export class SetupScreen extends React.Component {
    public render() {
        return (
            <div className="setup-screen">
                <div className="setup-screen__left">
                    <SetupInfoBlock
                        logo="opendax"
                        backgroundImage=""
                        title="Installation"
                        description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                    />
                </div>
                <div className="setup-screen__right">
                    <SetupForm />
                </div>
            </div>
        );
    }
}
