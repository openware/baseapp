import * as React from 'react';
import { SetupFormInput } from '../';
import { Button } from 'react-bootstrap';
import { DOMAIN_REGEX, EXCHANGE_NAME_REGEX } from '../../../helpers';

export interface SetupGeneralSettingsFormProps {
    handleCreateSettingsSecrets: (exchangeName: string, exchangeUrl: string) => void;
}

export interface SetupGeneralSettingsFormState {
    exchangeName: string;
    exchangeUrl: string;
}

export class SetupGeneralSettingsForm extends React.Component<SetupGeneralSettingsFormProps, SetupGeneralSettingsFormState> {
    constructor(props: SetupGeneralSettingsFormProps) {
        super(props);

        this.state = {
            exchangeName: '',
            exchangeUrl: window.location.origin,
        };
    }

    public render() {
        const { exchangeName, exchangeUrl } = this.state;
        const validExchangeUrl = !!exchangeUrl.match(DOMAIN_REGEX);
        const validExchangeName = exchangeName && !!exchangeName.match(EXCHANGE_NAME_REGEX);

        return (
            <React.Fragment>
                <form className="setup-general-settings-form">
                    <SetupFormInput
                        label="Exchange Name"
                        value={exchangeName}
                        tooltipText="Public name of your exchange"
                        handleChangeInput={this.handleChangeExchangeName}
                    />
                    <SetupFormInput
                        label="Exchange Url"
                        value={exchangeUrl}
                        tooltipText="Using that URL users will be able to access the landing page of your trading platform"
                        handleChangeInput={this.handleChangeExchangeUrl}
                    />
                </form>
                <div className="setup-screen__button">
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleCreateSettingsSecrets}
                        disabled={!validExchangeUrl || !validExchangeName}
                    >
                        Next
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeExchangeName = (value: string) => {
        this.setState({
            exchangeName: value,
        });
    };

    private handleChangeExchangeUrl = (value: string) => {
        this.setState({
            exchangeUrl: value,
        });
    };

    private handleCreateSettingsSecrets = () => {
        const { exchangeName, exchangeUrl } = this.state;

        this.props.handleCreateSettingsSecrets(exchangeName, exchangeUrl);
    };
}
