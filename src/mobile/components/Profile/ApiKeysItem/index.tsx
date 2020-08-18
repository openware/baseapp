import classnames from 'classnames';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { localeDate } from '../../../../helpers';

const ApiKeysItemComponent = props => {
    const { index, item } = props;
    const intl = useIntl();

    const createdAt = localeDate(item.created_at, 'fullDate');
    const updatedAt = localeDate(item.updated_at, 'fullDate');

    const statusClassName = classnames({
        'color-green': item.state === 'active',
        'color-red':  item.state !== 'active',
    });

    return (
        <div key={index} className="pg-mobile-profile-api-keys-item">
            <div className="pg-mobile-profile-api-keys-item__row">
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <span className={statusClassName}>{item.state}</span>
                </div>
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <Form>
                        <Form.Check
                            type="switch"
                            id={`api-key-${index}`}
                            label=""
                            onChange={() => props.handleUpdateKey(item)}
                            checked={item.state === 'active'}
                        />
                    </Form>
                </div>
            </div>
            <div className="pg-mobile-profile-api-keys-item__row">
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.kid' })}</span>
                    <span className="pg-mobile-profile-api-keys-item__row__block__value">{item.kid}</span>
                </div>
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.algorithm' })}</span>
                    <span className="pg-mobile-profile-api-keys-item__row__block__value">{item.algorithm}</span>
                </div>
            </div>
            <div className="pg-mobile-profile-api-keys-item__row">
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.created' })}</span>
                    <span className="pg-mobile-profile-api-keys-item__row__block__value">{createdAt}</span>
                </div>
                <div className="pg-mobile-profile-api-keys-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.profile.apiKeys.item.updated' })}</span>
                    <span className="pg-mobile-profile-api-keys-item__row__block__value">{updatedAt}</span>
                </div>
            </div>
        </div>
    );
};

export const ApiKeysItem = React.memo(ApiKeysItemComponent);
