import * as React from 'react';

interface Props {
    onClose: () => void;
}

class GuardModalComponent extends React.Component<Props> {
    public render() {
        return (
            <div className="cr-modal-guard">
                <div className="cr-modal">
                    <form className="cr-email-form">
                        <div className="pg-change-password-screen">
                            {this.renderChangeModalHeader()}
                            <div className="cr-email-form__form-content">
                                <p className="cr-email-form__form-text">This feature is unavailable.</p>
                                <p className="cr-email-form__form-text">For unlocking please visit openware.com</p>
                            </div>
                            <div className="cr-email-form__button-wrapper">
                                <a href="https://www.openware.com/" className="cr-email-form__button">
                                    visit openware
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    private renderChangeModalHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    Error
                    <div className="cr-email-form__cros-icon" onClick={this.handleCancel}>
                        <img src={require('../../assets/images/close.svg')}/>
                    </div>
                </div>
            </div>
        </div>
    );

    private handleCancel = () => this.props.onClose();
}

export {
    GuardModalComponent as GuardModal,
};
