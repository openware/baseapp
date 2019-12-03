import * as React from 'react';

interface CloseButtonProps {
    /**
     * Callback called on button click
     */
    onClick: () => void;
}

const CloseButton: React.FunctionComponent<CloseButtonProps> = (props: CloseButtonProps) => (
    <button className="cr-close-button" onClick={props.onClick} />
);

export {
    CloseButton,
    CloseButtonProps,
};
