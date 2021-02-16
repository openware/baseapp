import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    SetupInfoBlock,
    SetupFormBlock,
    SetupGeneralSettingsForm,
    SetupRegisterForm,
    SetupMarketsBlock,
} from '../../components';
import logo from '../../assets/images/setup/logo.svg';
import bgStep1 from '../../assets/images/setup/step1-background.png';
import bgStep2 from '../../assets/images/setup/step2-background.png';
import bgStep3 from '../../assets/images/setup/step3-background.png';

interface SetupScreenState {
    currentStep: number;
    exchangeName: string;
    exchangeUrl: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export class SetupScreen extends React.Component<{}, SetupScreenState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            currentStep: 0,
            exchangeName: '',
            exchangeUrl: '',
            email: '',
            password: '',
            confirmPassword: '',
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
        const {
            currentStep,
            exchangeName,
            exchangeUrl,
            email,
            password,
            confirmPassword,
        } = this.state;

        switch (currentStep) {
            case 0:
                return (
                    <React.Fragment>
                        <div className="setup-screen__left">
                            <SetupInfoBlock
                                logo={logo}
                                backgroundImage={bgStep1}
                                title="Installation"
                                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                            />
                        </div>
                        <div className="setup-screen__right">
                            <div className="setup-screen__right-wrapper">
                                <SetupFormBlock
                                    title="Admin account"
                                    subtitle="Create the first admin account for your exchange to access the admin panel."
                                >
                                    <SetupRegisterForm
                                        email={email}
                                        password={password}
                                        confirmPassword={confirmPassword}
                                    />
                                    <div className="setup-screen__agreement">
                                        <div className="setup-screen__agreement__term">
                                            <label className="container">I  agree all statements in <a href="#"> terms of service</a>
                                                <input type="checkbox" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <Button
                                            block={true}
                                            type="button"
                                            size="lg"
                                            variant="primary"
                                            onClick={e => this.handleChangeCurrentStep(1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
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
                                backgroundImage={bgStep1}
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
                                    <SetupGeneralSettingsForm
                                        exchangeName={exchangeName}
                                        exchangeUrl={exchangeUrl}
                                    />
                                    <div className="setup-screen__save-general-settings">
                                        <Button
                                            block={true}
                                            type="button"
                                            size="lg"
                                            variant="primary"
                                            onClick={e => this.handleChangeCurrentStep(2)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </SetupFormBlock>
                            </div>
                        </div>
                    </React.Fragment>
                );
            case 2:
                return (
                    <React.Fragment>
                        <div className="setup-screen__left">
                            <SetupInfoBlock
                                logo={logo}
                                backgroundImage={bgStep2}
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
                                    <SetupMarketsBlock />
                                    <Button
                                        block={true}
                                        type="button"
                                        size="lg"
                                        variant="primary"
                                        onClick={e => this.handleChangeCurrentStep(3)}
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
                                backgroundImage={bgStep3}
                                title="Welcome to OpenDax software"
                                description=""
                            />
                        </div>
                        <div className="setup-screen__right">
                            <div className="setup-screen__right-wrapper">
                                <SetupFormBlock
                                    title="Congratulations  exchange is live!"
                                    subtitle="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                                />
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
