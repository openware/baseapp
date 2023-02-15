import * as React from 'react';
import { ArrowIcon } from '../../../containers/ToolBar/icons/ArrowIcon';

interface Props {
    backTitle?: string;
    title: string;
    onGoBack: () => void;
}

const SubheaderComponent = (props: Props) => {
    return (
        <div className="cr-mobile-subheader">
            <div className="cr-mobile-subheader__back" onClick={props.onGoBack}>
                <ArrowIcon />
                <span className="cr-mobile-subheader__back-item">{props.backTitle}</span>
            </div>
            <div className="cr-mobile-subheader__title">{props.title}</div>
            <div className="cr-mobile-subheader__close" />
        </div>
    );
};

const Subheader = React.memo(SubheaderComponent);

export { Subheader };
