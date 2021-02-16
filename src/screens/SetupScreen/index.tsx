import * as React from 'react';
import { Button } from 'react-bootstrap';
import { SetupInfoBlock, SetupFormBlock } from '../../components';
import logo from '../../assets/images/setup/logo.svg';
// import bgStep1 from '../../assets/images/setup/step1-background.svg';
// import bgStep2 from '../../assets/images/setup/step2-background.svg';
// import bgStep3 from '../../assets/images/setup/step3-background.svg';

interface SetupScreenState {
    currentStep: number;
}

export class SetupScreen extends React.Component<{}, SetupScreenState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            currentStep: 0,
        };
    }

    public render() {
        return (
            <div className="setup-screen">
                {this.renderCurrentStep()}
            </div>
        );
    }

    public renderCurrentStep = () => {
        const { currentStep } = this.state;

        switch (currentStep) {
            case 0:
                return (
                    <React.Fragment>
                        <div className="setup-screen__left">
                            <SetupInfoBlock
                                logo={logo}
                                backgroundImage={""}
                                title="Installation"
                                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                            />
                        </div>
                        <div className="setup-screen__right">
                            <div className="setup-screen__right-wrapper">
                                <SetupFormBlock
                                    title="General Settings"
                                    subtitle="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
                                >
                                    children
                                </SetupFormBlock>
                                <SetupFormBlock
                                    title="Admin account"
                                    subtitle="Create the first admin account for your exchange to access the admin panel."
                                >
                                    <Button
                                        block={true}
                                        type="button"
                                        size="lg"
                                        variant="primary"
                                        onClick={e => this.handleChangeCurrentStep(1)}
                                    >
                                        Next
                                    </Button>
                                </SetupFormBlock>
                            </div>
                        </div>
                    </React.Fragment>
                );
            case 1:
                return (
                    <React.Fragment>
                        <div className="setup-screen__left">
                            <SetupInfoBlock
                                logo={logo}
                                backgroundImage={""}
                                title="Configure the liquidity network"
                                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                            />
                        </div>
                        <div className="setup-screen__right">
                            <div className="setup-screen__right-wrapper">
                                <SetupFormBlock
                                    title="Select Markets"
                                    subtitle="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                                >
                                    <Button
                                        block={true}
                                        type="button"
                                        size="lg"
                                        variant="primary"
                                        onClick={e => this.handleChangeCurrentStep(2)}
                                    >
                                        Save
                                    </Button>
                                </SetupFormBlock>
                            </div>
                        </div>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <div className="setup-screen__left">
                            <SetupInfoBlock
                                logo={logo}
                                backgroundImage={""}
                                title="Welcome to OpenDax software"
                                description=""
                            />
                        </div>
                        <div className="setup-screen__right">
                            <div className="setup-screen__right-wrapper">
                                <SetupFormBlock
                                    title="Congratulations  exchange is live!"
                                    subtitle="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                                >
                                    children
                                </SetupFormBlock>
                            </div>
                        </div>
                    </React.Fragment>
                );
        }
    };

    private handleChangeCurrentStep = (currentStep: number) => {
        this.setState({
            currentStep,
        });
    };
}
