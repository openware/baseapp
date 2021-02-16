import * as React from 'react';
import { SetupFormInput } from '..';

export interface GeneralSettingFormProps {
    exchangeName: string;
    exchangeUrl: string;
}

export class GeneralSettingForm extends React.Component<GeneralSettingFormProps> {
    public render() {
        const { exchangeName, exchangeUrl } = this.props;

        return (
            <form className="general-setting-form">
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
    }

    private onChangeExchangeUrl = val => {
        console.log('exchange url: ', val);
    }
}