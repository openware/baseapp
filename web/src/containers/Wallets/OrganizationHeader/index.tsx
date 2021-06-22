import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Decimal } from 'src/components';

const OrganizationHeader: FC = (): ReactElement => {
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    //TODO: Get calculated values from new Peatio Api.
    const MOCK_HEADER_DATA = {
        totalLimit: 488981.31,
        totalAvailable: 488981.31,
        totalUsed: 488981.31,
    }

    return (
        <div className="pg-organization-header">
            <div className="pg-organization-header__title">{translate('page.body.dashboard.title')}</div>
            <div className="pg-organization-header__header">
                <div className="pg-organization-header__header__box">
                    <div className="pg-organization-header__header__box__label">{translate('page.body.dashboard.totalLimitValue')}</div>
                    <div>${Decimal.format(MOCK_HEADER_DATA.totalLimit, 2, ',')}</div>
                </div>
                <div className="pg-organization-header__header__box">
                    <div className="pg-organization-header__header__box__label">{translate('page.body.dashboard.available')}</div>
                    <div>${Decimal.format(MOCK_HEADER_DATA.totalAvailable, 2, ',')}</div>
                </div>
                <div className="pg-organization-header__header__box">
                    <div className="pg-organization-header__header__box__label">{translate('page.body.dashboard.used')}</div>
                    <div>${Decimal.format(MOCK_HEADER_DATA.totalUsed, 2, ',')}</div>
                </div>
            </div>
        </div>
    );
};

export {
    OrganizationHeader,
};
