import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { ArrowLeftIcon } from 'src/assets/images/setup/ArrowLeftIcon';

interface ParentProps {
    description: string;
    replyMessage: string;
    handleChangeStep: (value: number) => void;
    handleSetDescription: (value: string) => void;
    handleSetReplyMessage: (value: string) => void;
    handleSubmit: () => void;
}

type Props = ParentProps;

const CreateOfferStep3: FC<Props> = (props: Props): ReactElement => {
    const [descFocused, setDescFocused] = useState<boolean>(false);
    const [replyFocused, setReplytFocused] = useState<boolean>(false);

    const { description, replyMessage } = props;
    const { formatMessage } = useIntl();

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const descFocusClass = useCallback(() => (
        classnames('cr-email-form__group', {
            'cr-email-form__group--focused': descFocused,
        })
    ), [descFocused]);

    const replyFocusClass = useCallback(() => (
        classnames('cr-create-offer__group', {
            'cr-create-offer--focused': replyFocused,
        })
    ), [replyFocused]);

    return (
        <div className="cr-create-offer">
            <div className="form-padding">
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.description')}</div>
                    <div className={descFocusClass()}>
                        <Form.Control
                            placeholder={translate('page.body.p2p.create.offer.description.placeholder')}
                            onChange={e => props.handleSetDescription(e.target.value)}
                            value={description}
                            onFocus={() => setDescFocused(!descFocused)}
                            className="cr-create-offer__textarea"
                            autoFocus={true}
                            as="textarea"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.replyMessage')}</div>
                    <div className={replyFocusClass()}>
                        <Form.Control
                            placeholder={translate('page.body.p2p.create.offer.replyMessage.placeholder')}
                            onChange={e => props.handleSetReplyMessage(e.target.value)}
                            value={replyMessage}
                            onFocus={() => setReplytFocused(!replyFocused)}
                            className="cr-create-offer__textarea"
                            as="textarea"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="cr-create-offer__btn-wrapper__grid">
                    <Button
                        onClick={() => props.handleChangeStep(1)}
                        size="lg"
                        variant="secondary"
                    >
                        <ArrowLeftIcon className="icon-left" />
                        <span>{translate('page.body.p2p.create.offer.back')}</span>
                    </Button>
                    <Button
                        onClick={props.handleSubmit}
                        size="lg"
                        variant="primary"
                    >
                        {translate('page.body.p2p.create.offer.create_order').toUpperCase()}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export {
    CreateOfferStep3,
};
