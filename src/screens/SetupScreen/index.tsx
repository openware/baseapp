import * as React from 'react';
import { Button, ThemeProvider } from 'react-bootstrap';
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
import { CloseSetupIcon } from 'src/assets/images/setup/CloseSetupIcon';
import { SetupCongratsBlock } from 'src/components/SetupComponents/SetupCongratsBlock';

interface SetupScreenState {
    currentStep: number;
    exchangeName: string;
    exchangeUrl: string;
    email: string;
    password: string;
    confirmPassword: string;
    showSignIn: boolean;
    availableMarkets: string[];
    addedMarkets: string[];
    selectedAvailableMarkets: string[];
    selectedAddedMarkets: string[];
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
            showSignIn: false,
            availableMarkets: ['btc/usdt', 'eth/usdt', 'ltc/usdt'],
            addedMarkets: [],
            selectedAvailableMarkets: [],
            selectedAddedMarkets: [],
        };
    }

    public render() {
        return (
            <div className="setup-screen">
                {this.renderCurrentStep()}
            </div>
        );
    }

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    }

    private handleChangePassword = (value: string) => {
        this.setState({
            password: value,
        });
    }

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
        });
    }

    private handleChangeExchangeName = (value: string) => {
        this.setState({
            exchangeName: value,
        });
    }

    private handleChangeExchangeUrl = (value: string) => {
        this.setState({
            exchangeUrl: value,
        });
    }

    private handleSelectAvailableMarket = (value: string[]) => {
        this.setState({
            selectedAvailableMarkets: value,
        });
    }

    private handleSelectAddedMarket = (value: string[]) => {
        this.setState({
            selectedAddedMarkets: value,
        });
    }

    private handleAddMarket = () => {
        console.log(this.state.addedMarkets, this.state.selectedAvailableMarkets);

        this.setState(prevState => {
            return {
                addedMarkets: [...prevState.addedMarkets, ...prevState.selectedAvailableMarkets],
                selectedAvailableMarkets: [],
                // availableMarkets:  // TODO: remove selected item from available market list
            }
        });
    }

    private handleAddAllMarkets = () => {

    }

    private handleRemoveMarket = () => {

    }

    private handleRemoveAllMarkets = () => {

    }

    public renderCurrentStep = () => {
        const {
            currentStep,
            exchangeName,
            exchangeUrl,
            email,
            password,
            confirmPassword,
            showSignIn,
            availableMarkets,
            addedMarkets,
            selectedAvailableMarkets,
            selectedAddedMarkets,
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
                                { showSignIn ? 
                                    <SetupFormBlock
                                        title="Admin account"
                                        subtitle="Sign in the first admin account for your exchange to access the admin panel."
                                    >
                                        <SetupRegisterForm
                                            email={email}
                                            password={password}
                                            handleChangeEmail={this.handleChangeEmail}
                                            handleChangePassword={this.handleChangePassword}
                                        />
                                        <div className="setup-screen__sign-in">
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
                                    : <SetupFormBlock
                                        title="Admin account"
                                        subtitle="Create the first admin account for your exchange to access the admin panel."
                                    >
                                        <SetupRegisterForm
                                            email={email}
                                            password={password}
                                            confirmPassword={confirmPassword}
                                            showConfirmPassword={true}
                                            handleChangeEmail={this.handleChangeEmail}
                                            handleChangePassword={this.handleChangePassword}
                                            handleChangeConfirmPassword={this.handleChangeConfirmPassword}
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
                                }
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
                                        handleChangeExchangeName={this.handleChangeExchangeName}
                                        handleChangeExchangeUrl={this.handleChangeExchangeUrl}
                                    />
                                    <div className="setup-screen__step-footer">
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
                                    <SetupMarketsBlock 
                                        availableMarkets={availableMarkets}
                                        addedMarkets={addedMarkets}
                                        selectedAvailableMarkets={selectedAvailableMarkets}
                                        selectedAddedMarkets={selectedAddedMarkets}
                                        handleSelectAvailableMarket={this.handleSelectAvailableMarket}
                                        handleSelectAddedMarket={this.handleSelectAddedMarket}
                                        handleAdd={this.handleAddMarket}
                                        handleAddAll={this.handleAddAllMarkets}
                                        handleRemove={this.handleRemoveMarket}
                                        handleRemoveAll={this.handleRemoveAllMarkets}
                                    />
                                    <div className="setup-screen__step-footer">
                                        <Button
                                            block={true}
                                            type="button"
                                            size="lg"
                                            variant="primary"
                                            onClick={e => this.handleChangeCurrentStep(3)}
                                        >
                                            Next
                                        </Button>
                                    </div>
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
                                <div className="setup-screen__right-wrapper__close" onClick={() => this.handleCompleteSetup()}><CloseSetupIcon /></div>
                                <SetupFormBlock
                                    title={`Congratulations ${exchangeName} exchange is live!`}
                                    subtitle="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
                                >
                                    <SetupCongratsBlock />
                                </SetupFormBlock>
                                <div className="setup-screen__step-footer__congrat">
                                    <Button
                                        block={true}
                                        type="button"
                                        size="lg"
                                        variant="primary"
                                        onClick={e => this.handleCompleteSetup()}
                                    >
                                        Continue and Customize
                                    </Button>
                                </div>
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

    private handleCompleteSetup = () => {
        window.location.replace('/trading/dashbtc#settings');
    }
}
