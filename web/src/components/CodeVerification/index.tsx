import classnames from 'classnames';
import React, { FC, ReactElement, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { PasteIcon } from 'src/assets/images/PasteIcon';

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
    message?: string;
}

const CodeVerification: FC<CodeVerificationProps> = (props: CodeVerificationProps): ReactElement => {
    const { code, codeLength, inputMode, onSubmit, placeholder, showPaste2FA = true, type, message } = props;

    const { formatMessage } = useIntl();

    const getCodeBlocks = useMemo(() => {
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
    }, [code]);

    const onCodeChange = (e) => {
        if (e.target.value.length <= codeLength && (e.target.value.match(/^[0-9\b]+$/) || e.target.value === '')) {
            props.onChange(e.target.value);
        }
    };

    const paste2FA = async () => {
        const text = await navigator.clipboard?.readText();
        let inputList = '';

        for (const char of text) {
            inputList += char.toString();
            if (inputList.length <= codeLength && (!inputList || inputList.match(/^[0-9\b]+$/))) {
                props.onChange(inputList);
            }
        }
    };

    const renderPaste2FA = useMemo(() => {
        const buttonText = !props.isMobile ? formatMessage({ id: 'page.body.profile.whitelisted.paste' }) : null;
        return showPaste2FA ? (
            <div className="pg-code-verification__paste" onClick={paste2FA}>
                <PasteIcon />
                {buttonText}
            </div>
        ) : null;
    }, [showPaste2FA, paste2FA]);

    return (
        <div className="pg-code-verification">
            <div className="pg-code-verification__label">
                {message || formatMessage({ id: 'page.body.profile.whitelisted.add.beneficiary.2fa' })}
            </div>
            <div className="pg-code-verification__block">
                <div className="pg-code-verification__block__content">
                    <div className="pg-code-verification__wrapper">{getCodeBlocks}</div>
                    <div className="pg-code-verification__input">
                        <input
                            autoFocus={true}
                            type={type}
                            value={code}
                            inputMode={inputMode}
                            onChange={onCodeChange}
                            onKeyPress={onSubmit}
                        />
                    </div>
                </div>
                {renderPaste2FA}
            </div>
        </div>
    );
};

export { CodeVerification };
