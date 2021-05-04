import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { UploadFile } from 'src/components';
import { p2pDisputeFetch, P2POrder } from 'src/modules';

interface ParentProps {
    order: P2POrder;
}

type Props = ParentProps;

const REASON_MESSAGES = {
    notReceive: 'Did not receive my fiat',
    tooLong: 'Transaction taking too long',
    amountDifferent: 'Transaction amount is different to order value',
};

const Dispute: FC<Props> = (props: Props): ReactElement => {
    const [attachment, setAttachment] = useState<File[]>([]);
    const [message, setMessage] = useState<string>('');
    const [messageFocused, setMessageFocused] = useState<boolean>(false);

    const [notReceive, setNotReceive] = useState<boolean>(false);
    const [tooLong, setTooLong] = useState<boolean>(false);
    const [amountDifferent, setAmountDifferent] = useState<boolean>(false);
    const [reason, setReason] = useState<string>('');

    const { order } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const translate = useCallback((id: string, value?: any) => formatMessage({ id }, { ...value }), [formatMessage]);

    const handleUploadScan = useCallback((uploadEvent) => {
        const allFiles: File[] = uploadEvent.target.files;
        const maxDocsCount = 1;
        const additionalFileList = Array.from(allFiles).length > maxDocsCount ?  Array.from(allFiles).slice(0, maxDocsCount) : Array.from(allFiles);

        setAttachment(additionalFileList);
    }, []);

    const clickNotReceive = useCallback((e, message) => {
        if (e) {
            e.preventDefault();
            setNotReceive(!notReceive);
            setTooLong(false);
            setAmountDifferent(false);
            setReason(message);
        }
    }, [notReceive]);

    const clickTooLong = useCallback((e, message) => {
        if (e) {
            e.preventDefault();
            setTooLong(!tooLong);
            setAmountDifferent(false);
            setNotReceive(false);
            setReason(message);
        }
    }, [tooLong]);

    const clickAmountDifferent = useCallback((e, message) => {
        if (e) {
            e.preventDefault();
            setAmountDifferent(!amountDifferent);
            setTooLong(false);
            setNotReceive(false);
            setReason(message);
        }
    }, [amountDifferent]);

    const handleSubmitCLick = useCallback(() => {
        if (order) {
            const request = new FormData();
            request.append('attachment', attachment[0]);
            request.append('order_id', String(order.id));
            request.append('message', `Reason: ${reason}. ${message}`);

            dispatch(p2pDisputeFetch(request));
            history.push('/p2p');
        }
    }, [order, attachment, message, reason]);

    const checkBoxField = useCallback((id: string, checked: boolean, onClick: (e, message) => void) => (
        <Form className="cr-dispute__checkbox" onClick={e => onClick(e, REASON_MESSAGES[id])}>
            <Form.Check
                type="checkbox"
                custom
                id={id}
                checked={checked}
                readOnly={true}
                label={translate(`page.body.p2p.dispute.checkbox.${id}`)}
            />
        </Form>
    ), []);

    const messageFocusClass = useCallback(() => (
        classnames('cr-dispute__group', {
            'cr-dispute--focused': messageFocused,
        })
    ), [messageFocused]);

    return (
        <div className="cr-dispute">
            <div className="cr-dispute__block">
                <span className="bold-36 red">{translate('page.body.p2p.dispute.title')}</span>
                <span className="description">{translate('page.body.p2p.dispute.description')}</span>
            </div>
            <UploadFile
                id="attachment"
                label={translate('page.body.p2p.dispute.attachment.label')}
                buttonText={translate('page.body.p2p.dispute.attachment.btn')}
                sizesText={translate('page.body.p2p.dispute.attachment.description')}
                handleUploadScan={handleUploadScan}
                uploadedFile={attachment[0] && (attachment[0] as File).name}
            />
            {checkBoxField('notReceive', notReceive, clickNotReceive)}
            {checkBoxField('tooLong', tooLong, clickTooLong)}
            {checkBoxField('amountDifferent', amountDifferent, clickAmountDifferent)}
            <div className="cr-dispute__input">
                <div className="cr-dispute__input-label">{translate('page.body.p2p.dispute.message.label')}</div>
                <div className={messageFocusClass()}>
                    <Form.Control
                        placeholder={translate('page.body.p2p.dispute.message.placeholder')}
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        onFocus={() => setMessageFocused(!messageFocused)}
                        className="cr-dispute__input__textarea"
                        as="textarea"
                        rows={3}
                    />
                </div>
            </div>
            <div className="cr-dispute__btn-wrapper__grid">
                <Button
                    onClick={handleSubmitCLick}
                    size="lg"
                    variant="primary"
                    disabled={!attachment.length}
                >
                    {translate('page.body.p2p.dispute.submit')}
                </Button>
            </div>
        </div>
    );
};

export {
    Dispute,
};
