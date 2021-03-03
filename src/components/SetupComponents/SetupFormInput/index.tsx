import * as React from 'react';
import { TipIcon } from '../../../assets/images/TipIcon';

export interface SetupFormInputProps {
    label: string;
    value: string;
    type?: string;
    tooltipText?: string;
    handleChangeInput: (value: string) => void;
    handleFocus?: (type: string) => void;
}

interface SetupFormInputState {
    showTooltip: boolean;
}

export class SetupFormInput extends React.Component<SetupFormInputProps, SetupFormInputState> {
    constructor(props: SetupFormInputProps) {
        super(props);

        this.state = {
          showTooltip: false,
        };
    }

    public render() {
        const { label, value, type, tooltipText } = this.props;

        return (
            <div className="setup-form-input">
                <label>{label}</label>
                <div className="setup-form-input__input">
                    <input
                        autoComplete="false"
                        type={type || 'text'}
                        onChange={this.handleChangeValue}
                        value={value}
                        onFocus={() => this.handleFocus('in')}
                        onBlur={() => this.handleFocus('out')}
                    />
                    {tooltipText && this.renderTooltipInfo()}
                </div>
            </div>
        );
    }

    private renderTooltipInfo = () => {
        const { tooltipText } = this.props;
        const { showTooltip } = this.state;

        return (
            <React.Fragment>
                <div className="setup-form-input__input__tooltip" onMouseEnter={() => this.handleShowTooltip()} onMouseLeave={() => this.handleHideTooltip()}>
                    <TipIcon />
                </div>
                {showTooltip &&
                    <div className="setup-form-input__input__info">
                        {tooltipText}
                    </div>
                }
            </React.Fragment>
        );
    };

    private handleShowTooltip = () => {
        this.setState({
            showTooltip: true,
        });
    };

    private handleHideTooltip = () => {
        this.setState({
            showTooltip: false,
        });
    }

    private handleChangeValue = e => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };

    private handleFocus = (type: string) => {
        this.props.handleFocus && this.props.handleFocus(type);
    };
}
