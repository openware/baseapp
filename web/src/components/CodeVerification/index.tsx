import classnames from 'classnames';
import React, { FC, ReactElement, useCallback } from 'react';

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

const CodeVerification: FC<CodeVerificationProps> = (props: CodeVerificationProps): ReactElement => {
    const {
        code,
        codeLength,
        inputMode,
        isMobile,
        onSubmit,
        placeholder,
        showPaste2FA,
        type,
    } = props;

    const getCodeBlocks = useCallback(() => {
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

    const onCodeChange = e => {
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

    return (
        <div className="pg-code-verification">
            <div className="pg-code-verification__wrapper">
                {getCodeBlocks()}
            </div>
            <div className="pg-code-verification__input">
                <input
                    autoFocus={true}
                    type={type}
                    value={code}
                    inputMode={inputMode}
                    onChange={onCodeChange}
                    onKeyPress={onSubmit}
                />
                {isMobile && showPaste2FA && <div className="pg-code-verification__paste" onClick={() => paste2FA()}>Paste 2FA</div>}
            </div>
        </div>
    );
};

export {
    CodeVerification,
}
