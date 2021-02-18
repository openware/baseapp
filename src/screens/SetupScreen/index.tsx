import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    SetupInfoBlock,
    SetupFormBlock,
    SetupGeneralSettingsForm,
    SetupRegisterForm,
    SetupLoginForm,
    SetupMarketsBlock,
} from '../../components';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import logo from '../../assets/images/setup/logo.svg';
import bgStep1 from '../../assets/images/setup/step1-background.png';
import bgStep2 from '../../assets/images/setup/step2-background.png';
import bgStep3 from '../../assets/images/setup/step3-background.png';
import { CloseSetupIcon } from 'src/assets/images/setup/CloseSetupIcon';
import { SetupCongratsBlock } from 'src/components/SetupComponents/SetupCongratsBlock';
import {
    getMarketsAdminList,
    MarketItem,
    selectMarketsAdminList,
    RootState,
    selectUserLoggedIn,
    updateMarketFetch,
    userFetch,
    selectUserInfo,
    User,
    signIn,
    signUp,
    LanguageState,
} from '../../modules';
import { sessionCheckInterval, wizardStep } from '../../api';

interface SetupScreenState {
    currentStep: number;
}

interface ReduxProps {
    markets: MarketItem[];
    user: User;
    userLoggedIn: boolean;
}

interface DispatchProps {
    getMarketsList: typeof getMarketsAdminList;
    updateMarket: typeof updateMarketFetch;
    userFetch: typeof userFetch;
    signIn: typeof signIn;
    signUp: typeof signUp;
}

interface OwnProps {
    i18n: LanguageState['lang'];
}

type Props = ReduxProps & DispatchProps & OwnProps;

export class Setup extends React.Component<Props, SetupScreenState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            currentStep: wizardStep(),
        };
    }

    public componentDidMount () {
        // this.setState({
        //     currentStep: wizardStep(),
        // });

        // const { userLoggedIn } = this.props;

        // if (!userLoggedIn) {
            // this.props.userFetch();
        // }
    }

    public render() {
        return (
            <div className="setup-screen">
                {this.renderCurrentStep()}
            </div>
        );
    }

    public renderCurrentStep = () => {
        const { userLoggedIn } = this.props;
        const { currentStep } = this.state;

        // if (!currentStep) {
        //     window.location.replace('/');
        //     return null;
        // }

        console.log(wizardStep(), currentStep, userLoggedIn);

        if (currentStep > 1 && !userLoggedIn) {
            console.log('renderLogin');
            return this.renderLogin();
        }

        switch (currentStep) {
            case 1:
                console.log('case1');
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
                                    <SetupRegisterForm handleRegister={this.handleRegister} />
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
                                    <SetupGeneralSettingsForm handleCreateSettingsSecrets={this.handleCreateSettingsSecrets} />
                                </SetupFormBlock>
                            </div>
                        </div>
                    </React.Fragment>
                );
            case 3:
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
                                        marketsList={this.props.markets}
                                        handleClickSave={this.handleSaveMarketsList}
                                        fetchMarkets={this.props.getMarketsList}
                                    />
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
                                <div className="setup-screen__right-wrapper__close" onClick={this.handleCompleteSetup}>
                                    <CloseSetupIcon />
                                </div>
                                <SetupFormBlock
                                    title={`Congratulations exchange is live!`}
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
                                        onClick={this.handleCompleteSetup}
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

    private renderLogin = () => {
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
                            subtitle="Sign in the first admin account for your exchange to access the admin panel."
                        >
                            <SetupLoginForm handleLogin={this.handleLogin} />
                        </SetupFormBlock>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    private handleChangeCurrentStep = (currentStep: number) => {
        this.setState({
            currentStep,
        });
    };

    private handleCompleteSetup = () => {
        window.location.replace('/trading/dashbtc#settings');
    }

    private handleLogin = (email: string, password: string) => {
        const payload = {
            email,
            password,
        };

        this.props.signIn(payload);
    };

    private handleRegister = (email: string, password: string, confirmPassword: string) => {
        //TODO: validate email REGEX and confirmPassword

        const { i18n } = this.props;
        const payload = {
            email,
            password,
            data: JSON.stringify({
                language: i18n,
            }),
        };

        this.props.signUp(payload);

        this.handleChangeCurrentStep(2);
    };

    private handleCreateSettingsSecrets = (exchangeName: string, exchangeUrl: string) => {
        const exchangeNamePayload = {
            key: 'exchange_name',
            value: exchangeName,
        };
        const exchangeUrlPayload = {
            key: 'exchange_url',
            value: exchangeUrl,
        };

        this.addSecret(exchangeNamePayload);
        this.addSecret(exchangeUrlPayload);
        this.handleChangeCurrentStep(3);
    };

    private handleSaveMarketsList = (list: string[]) => {
        console.log('handleSaveMarketsList: ', list);
        this.handleChangeCurrentStep(4);
    };

    private addSecret = ({ key, value }) => {
        console.log(`${key}: ${value}`);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarketsAdminList(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    getMarketsList: () => dispatch(getMarketsAdminList()),
    updateMarket: payload => dispatch(updateMarketFetch(payload)),
    userFetch: () => dispatch(userFetch()),
    signIn: payload => dispatch(signIn(payload)),
    signUp: credentials => dispatch(signUp(credentials)),
});

export const SetupScreen = connect(mapStateToProps, mapDispatchToProps)(Setup);
