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
    updateMarketFetch,
    userFetch,
    selectUserInfo,
    User,
    signIn,
    signUp,
    LanguageState,
    MarketUpdateItem,
    selectUserFetching,
    selectMarketsAdminUpdate,
    selectEnabledMarketsAdminList,
    platformCreate,
    selectSignUpSuccess,
    selectPlatformCreateSuccess,
} from '../../modules';
import { wizardStep } from '../../api';

interface SetupScreenState {
    currentStep: string;
}

interface ReduxProps {
    markets: MarketItem[];
    user: User;
    userLoading: boolean;
    enabledMarkets: MarketUpdateItem[];
    signUpSuccess: boolean;
    platformCreateSuccess: boolean;
    marketsSuccess: boolean;
}

interface DispatchProps {
    getMarketsList: typeof getMarketsAdminList;
    enableMarkets: typeof updateMarketFetch;
    userFetch: typeof userFetch;
    signIn: typeof signIn;
    signUp: typeof signUp;
    platformCreate: typeof platformCreate;
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

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.props.user.email && nextProps.user.email && this.state.currentStep === '1') {
            this.setState({
                currentStep: '2',
            });
        }

        if (!this.props.platformCreateSuccess && nextProps.platformCreateSuccess) {
            this.setState({
                currentStep: '3',
            });
        }

        if (!this.props.marketsSuccess && nextProps.marketsSuccess) {
            this.setState({
                currentStep: '4',
            });
        }

        if (!this.props.user.email && nextProps.user.email && wizardStep() !== '1') {
            this.setState({
                currentStep: wizardStep(),
            });
        }
    }

    public componentDidMount() {
        if (wizardStep() !== '1') {
            this.setState({
                currentStep: wizardStep(),
            });
        }
    }

    public render() {
        return (
            <div className="setup-screen">
                {this.renderCurrentStep()}
            </div>
        );
    }

    public renderCurrentStep = () => {
        const { user } = this.props;
        const { currentStep } = this.state;

        if (+currentStep > 1 && !user.email.length) {
            return this.renderLogin();
        } else {
            switch (currentStep) {
                case '1':
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
                case '2':
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
                case '3':
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
                case '4':
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
                default:
                    window.location.replace('/');
              }
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

    private handleCompleteSetup = () => {
        const { enabledMarkets } = this.props;

        if (enabledMarkets.length) {
            window.location.replace(`/trading/${enabledMarkets[0].id}#settings`);
        }
    }

    private handleLogin = (email: string, password: string) => {
        const payload = {
            email,
            password,
        };

        this.props.signIn(payload);
    };

    private handleRegister = (email: string, password: string, confirmPassword: string) => {
        const { i18n } = this.props;
        const payload = {
            email,
            password,
            data: JSON.stringify({
                language: i18n,
            }),
        };
        const callbackAction = {
            scope: 'public',
            component: 'global',
            key: 'wizard_step',
            value: '2',
        };

        this.props.signUp(payload, callbackAction);
    };

    private handleCreateSettingsSecrets = (exchangeName: string, exchangeUrl: string) => {
        const payload = {
            platform_name: exchangeName,
            platform_url: exchangeUrl,
        };
        const callbackAction = {
            scope: 'public',
            component: 'global',
            key: 'wizard_step',
            value: '3',
        };

        this.props.platformCreate(payload, callbackAction);
    };

    private handleSaveMarketsList = (list: MarketUpdateItem[]) => {
        const callbackAction = {
            scope: 'public',
            component: 'global',
            key: 'wizard_step',
            value: 'false',
        };
        this.props.enableMarkets(list, callbackAction);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarketsAdminList(state),
    user: selectUserInfo(state),
    userLoading: selectUserFetching(state),
    marketsSuccess: selectMarketsAdminUpdate(state),
    enabledMarkets: selectEnabledMarketsAdminList(state),
    signUpSuccess: selectSignUpSuccess(state),
    platformCreateSuccess: selectPlatformCreateSuccess(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    getMarketsList: () => dispatch(getMarketsAdminList()),
    enableMarkets: (payload, cbAction) => dispatch(updateMarketFetch(payload, cbAction)),
    userFetch: () => dispatch(userFetch()),
    signIn: payload => dispatch(signIn(payload)),
    signUp: (credentials, cbAction) => dispatch(signUp(credentials, cbAction)),
    platformCreate: (payload, cbAction) => dispatch(platformCreate(payload, cbAction)),
});

export const SetupScreen = connect(mapStateToProps, mapDispatchToProps)(Setup);
