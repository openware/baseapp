import React, { FC, ReactElement, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { ArrowRight } from 'src/assets/images/ArrowRight';
import { LockedIcon } from 'src/assets/images/LockedIcon';

interface Props {
    text: string;
    link: string;
    buttonText: string;
}

export const LockedComponent: FC<Props> = (props: Props): ReactElement => {
    const { text, link, buttonText } = props;
    const history = useHistory();

    const handleClick = useCallback(() => history.push(link), []);

    return (
        <div className="cr-locked">
            <LockedIcon className="cr-locked__icon" />
            <span className="cr-locked__content">{text}</span>
            <Button onClick={handleClick} size="lg" variant="secondary" className="cr-locked__btn-content">
                {buttonText} <ArrowRight className="cr-locked__btn-icon" />
            </Button>
        </div>
    );
};
