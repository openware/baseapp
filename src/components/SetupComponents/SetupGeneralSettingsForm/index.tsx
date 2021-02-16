import * as React from 'react';
import { SetupFormInput } from '..';

export interface SetupGeneralSettingsFormProps {
    exchangeName: string;
    exchangeUrl: string;
}

export class SetupGeneralSettingsForm extends React.Component<SetupGeneralSettingsFormProps> {
    public render() {
        const { exchangeName, exchangeUrl } = this.props;

        return (
            <form className="setup-general-settings-form">
                <SetupFormInput
                    label="Exchange Name"
                    value={exchangeName}
                    tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                    handleChangeInput={this.onChangeExchangeName}
                />
                <SetupFormInput
                    label="Exchange Url"
                    value={exchangeUrl}
                    tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                    handleChangeInput={this.onChangeExchangeUrl}
                />
            </form>
        );
    }

    private onChangeExchangeName = val => {
        console.log('exchange name: ', val);
    };

    private onChangeExchangeUrl = val => {
        console.log('exchange url: ', val);
    };
}
