import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { kycSteps } from '../../api';
import { CrossIcon } from '../../assets/images/kyc/CrossIcon';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { Address, Documents, Identity, Phone } from '../../containers';
import { getVerificationStep, setDocumentTitle } from '../../helpers';
import {
    Label,
    labelFetch,
    RootState,
    selectApplyWindowEnvsTriggerState,
    selectLabelData,
    selectSidebarState,
    toggleSidebar,
} from '../../modules';
import {
    CustomizationSettingsInterface,
    LogoInterface,
} from '../../themes';

interface ReduxProps {
    applyWindowEnvsTrigger: boolean;
    isSidebarOpen: boolean;
    labels: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
    toggleSidebar: typeof toggleSidebar;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

interface State {
    image: LogoInterface | undefined;
}

class ConfirmComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            image: undefined,
        };
    }

    public componentDidMount() {
        const { labels, isSidebarOpen } = this.props;
        setDocumentTitle('Confirm');
        this.props.labelFetch();

        if (labels.length) {
            this.handleCheckUserLabels(labels);
        }

        isSidebarOpen && this.props.toggleSidebar(false);
        this.handleGetImageFromConfig();
    }

    public componentDidUpdate(prevProps: Props) {
        const { applyWindowEnvsTrigger, labels } = this.props;

        if (labels.length && JSON.stringify(labels) !== JSON.stringify(prevProps.labels)) {
            this.handleCheckUserLabels(labels);
        }

        if (prevProps.applyWindowEnvsTrigger !== applyWindowEnvsTrigger) {
            this.handleGetImageFromConfig();
        }
    }

    public renderVerificationStep = (step: string) => {
        switch (step) {
            case 'phone':    return <Phone />;
            case 'profile':  return <Identity />;
            case 'document': return <Documents />;
            case 'address':  return <Address />;
            default: return 'Something went wrong';
        }
    };

    public render() {
        const { history } = this.props;
        const { image } = this.state;

        const step = this.handleGetVerificationStep();

        return (
            <div className="pg-container pg-confirm">
                <div className="pg-confirm__logo">
                    {image?.url ? (
                        <img
                            src={image.url}
                            alt="Header logo"
                            style={{ width: image?.width ? `${image.width}px` : 'auto'}}
                        />
                    ) : (
                        <LogoIcon
                            styles={{ width: image?.width ? `${image.width}px` : 'auto'}}
                        />
                    )}
                </div>
                <h3 className="pg-confirm__title">
                    <FormattedMessage id={`page.confirm.title.${step}`} />
                    <CrossIcon
                        className="pg-confirm__title__icon"
                        onClick={e => history.push('/profile')}
                    />
                </h3>
                <div className="pg-confirm__content">
                    {this.renderVerificationStep(step)}
                </div>
            </div>
        );
    }

    private handleGetVerificationStep = (): string => {
        const { labels } = this.props;

        return getVerificationStep(labels);
    };

    private handleCheckUserLabels = (labels: Label[]) => {
        const pendingLabelExists = Boolean(labels.find(label => kycSteps().includes(label.key) && ['pending', 'drafted', 'submitted'].includes(label.value) && label.scope === 'private'));
        const passedSteps = kycSteps().filter((step: string) => labels.find(label => step === label.key && label.value === 'verified' && label.scope === 'private'));

        if (pendingLabelExists || (kycSteps().length === passedSteps.length)) {
            this.props.history.push('/profile');
        }
    };

    private handleGetImageFromConfig = () => {
        const settingsFromConfig: CustomizationSettingsInterface | undefined =
            window.env?.palette ? JSON.parse(window.env.palette) : undefined;

        this.setState({ image: settingsFromConfig?.['header_logo'] });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    applyWindowEnvsTrigger: selectApplyWindowEnvsTriggerState(state),
    isSidebarOpen: selectSidebarState(state),
    labels: selectLabelData(state),
});

const mapDispatchToProps = dispatch => ({
    labelFetch: () => dispatch(labelFetch()),
    toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
});

export const ConfirmScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmComponent) as any; // tslint:disable-line
