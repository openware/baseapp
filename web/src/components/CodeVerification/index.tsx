import classnames from 'classnames';
import * as React from 'react';

export interface CodeVerificationProps {
    placeholder: string;
    type: string;
    codeLength: number;
    code: string;
    inputMode?: 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    onChange: (value: string) => void;
    onSubmit?: (e: any) => void; // tslint:disable-line
    showPaste2FA?: boolean;
    isMobile?: boolean;
}

export class CodeVerification extends React.Component<CodeVerificationProps> {
    public render() {
        const { code, type, inputMode, onSubmit, showPaste2FA, isMobile } = this.props;

        return (
            <div className="pg-code-verification">
                <div className="pg-code-verification__wrapper">
                    {this.getCodeBlocks()}
                </div>
                <div className="pg-code-verification__input">
                    <input
                        autoFocus={true}
                        type={type}
                        value={code}
                        inputMode={inputMode}
                        onChange={this.onCodeChange}
                        onKeyPress={onSubmit}
                    />
                    {isMobile && showPaste2FA && <div className="pg-code-verification__paste" onClick={() => this.paste2FA()}>Paste 2FA</div>}
                </div>
            </div>
        );
    }

    public getCodeBlocks = () => {
        const { code, placeholder, codeLength } = this.props;
        const codeItems = code.split('');

        for (let i = 0; i < codeLength; i++) {
            if (!codeItems[i]) {
                codeItems[i] = placeholder;
            }
        }

        let isPlaceholder = false;

        return codeItems.map((item, i) => {
            const cx = classnames('pg-code-verification__wrapper-item', {
                'pg-code-verification__wrapper-item-placeholder': item === placeholder,
                'pg-code-verification__wrapper-item-placeholder-border': item === placeholder && !isPlaceholder,
            });

            if (item === placeholder) {
                isPlaceholder = true;
            }

            return (
                <div className={cx} key={i}>
                    {item}
                </div>
            );
        });
    };

    private onCodeChange = e => {
        if (e.target.value.length <= this.props.codeLength && (e.target.value.match(/^[0-9\b]+$/) || e.target.value === '')) {
            this.props.onChange(e.target.value);
        }
    };

    private async paste2FA() {
        const text = await navigator.clipboard?.readText();
        let inputList = '';

        for (const code of text) {
            inputList += code.toString();
            if (inputList.length <= this.props.codeLength && (!inputList || inputList.match(/^[0-9\b]+$/))) {
                this.props.onChange(inputList);
            }
        }
    }
}
