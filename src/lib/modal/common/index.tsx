import React, { useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import './index.scss';

import { generalShowDialog } from 'src/modules/general';
import { Modal } from '../../../components';

interface Props {
    onOk: () => void;
    okText?: string;
    cancelText?: string;
    hideOk?: boolean;
    hideCancel?: boolean;
    header?: string;
    children: React.ReactNode;
    name: string;
}

export const BaseModal: React.FC<Props> = ({
    header,
    children,
    onOk,
    okText,
    cancelText,
    hideOk,
    hideCancel,
    name,
}) => {
    const dispatch = useDispatch();

    const handleCancel = useCallback(() => {
        dispatch(generalShowDialog(name, undefined));
    }, [name]);

    const headerContent = useMemo(() => {
        return <div className={classNames('pg-exchange-modal-submit-header')}>{header}</div>;
    }, [header]);

    const childrenContent = useMemo(() => {
        return <div className={classNames('pg-exchange-modal-submit-body', 'n-base-dialog__content')}>{children}</div>;
    }, [children]);

    const footerContent = useMemo(() => {
        return (
            <div className={classNames('pg-exchange-modal-submit-footer', 'n-base-dialog__footer')}>
                {hideCancel !== true ? (
                    <div>
                        <Button
                            block={true}
                            className="btn-block mr-1 mt-1 btn-lg"
                            onClick={handleCancel}
                            size="lg"
                            variant="secondary">
                            {cancelText}
                        </Button>
                    </div>
                ) : null}
                {hideOk !== true ? (
                    <div>
                        <Button
                            block={true}
                            className="btn-block mr-1 mt-1 btn-lg"
                            onClick={onOk}
                            size="lg"
                            variant="primary">
                            {okText}
                        </Button>
                    </div>
                ) : null}
            </div>
        );
    }, [hideOk, cancelText, hideCancel, okText, onOk]);

    return <Modal show={true} header={headerContent} content={childrenContent} footer={footerContent} />;
};
