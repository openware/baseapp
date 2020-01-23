import * as React from 'react';
import { Button } from 'react-bootstrap';
import { ClockIcon } from '../../assets/images/ClockIcon';

export interface ExpiredSessionModalProps {
    title: string;
    buttonLabel: string;
    handleSubmitExpSessionModal: () => void;
    handleChangeExpSessionModalState: () => void;
}

export class ExpiredSessionModal extends React.Component<ExpiredSessionModalProps> {
    public render() {
        const { title, buttonLabel } = this.props;

        return (
            <div className="expired-session-modal">
                <div className="cr-modal">
                    <div className="cr-email-form">
                        <div className="cr-email-form__options-group">
                            <div className="cr-email-form__option">
                                <div className="cr-email-form__option-inner">
                                    <ClockIcon className="clock-icon" alt="clock" />&nbsp;&nbsp;{title}
                                    <span
                                        className="cr-email-form__close"
                                        onClick={this.props.handleChangeExpSessionModalState}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="cr-email-form__form-content">
                            <div className="cr-email-form__button-wrapper">
                                <Button
                                    block={true}
                                    type="button"
                                    onClick={this.props.handleSubmitExpSessionModal}
                                    size="lg"
                                    variant="primary"
                                >
                                    {buttonLabel}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
