import * as React from 'react';
import { SetupFormInput } from '..';

export interface SetupGeneralSettingsFormProps {
    exchangeName: string;
    exchangeUrl: string;
    handleChangeExchangeName: (value: string) => void;
    handleChangeExchangeUrl: (value: string) => void;
}

export class SetupGeneralSettingsForm extends React.Component<SetupGeneralSettingsFormProps> {
    public render() {
        const { 
            exchangeName,
            exchangeUrl,
            handleChangeExchangeName,
            handleChangeExchangeUrl,
        } = this.props;

        return (
            <form className="setup-general-settings-form">
                <SetupFormInput
                    label="Exchange Name"
                    value={exchangeName}
                    tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                    handleChangeInput={handleChangeExchangeName}
                />
                <SetupFormInput
                    label="Exchange Url"
                    value={exchangeUrl}
                    tooltipText="Consequat cupidatat officia duis duis enim voluptate cillum consectetur amet qui commodo proident elit."
                    handleChangeInput={handleChangeExchangeUrl}
                />
            </form>
        );
    }
}
