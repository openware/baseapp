import * as React from 'react';
import { SetupFormInput } from '../';
import { Button } from 'react-bootstrap';
import { DOMAIN_REGEX } from '../../../helpers';

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
            exchangeUrl: '',
        };
    }

    public render() {
        const { exchangeName, exchangeUrl } = this.state;
        const validExchangeUrl = !!exchangeUrl.match(DOMAIN_REGEX);

        return (
            <React.Fragment>
                <form className="setup-general-settings-form">
                    <SetupFormInput
                        label="Exchange Name"
                        value={exchangeName}
                        tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                        handleChangeInput={this.handleChangeExchangeName}
                    />
                    <SetupFormInput
                        label="Exchange Url"
                        value={exchangeUrl}
                        tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                        handleChangeInput={this.handleChangeExchangeUrl}
                    />
                </form>
                <div className="setup-screen__step-footer">
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleCreateSettingsSecrets}
                        disabled={!validExchangeUrl || !exchangeName}
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
