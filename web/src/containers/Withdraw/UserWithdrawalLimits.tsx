import { OverlayTrigger } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { TipIcon } from '../../assets/images/TipIcon';
import { Tooltip, Decimal } from '../../components';
import { useUserWithdrawalsFetch, useFeeGroupFetch, useWithdrawLimits } from '../../hooks';
import {
    selectWithdrawLimits,
    selectFeeGroup,
    selectUserWithdrawalLimitsDay,
    selectUserWithdrawalLimitsMonth,    
} from '../../modules';
import { GLOBAL_PLATFORM_CURRENCY, DEFAULT_FIAT_PRECISION } from '../../constants';

interface UserWithdrawalLimitsProps {
    currencyId: string;
    price: string;
    fixed: number;
}

export const UserWithdrawalLimits = React.memo((props: UserWithdrawalLimitsProps) => {
    const { fixed, price, currencyId } = props;
    const { formatMessage } = useIntl();

    useUserWithdrawalsFetch();
    useFeeGroupFetch();
    useWithdrawLimits();

    const withdrawLimit = useSelector(selectWithdrawLimits);
    const usedWithdrawalLimitDay = useSelector(selectUserWithdrawalLimitsDay);
    const usedWithdrawalLimitMonth = useSelector(selectUserWithdrawalLimitsMonth);
    const feeGroup = useSelector(selectFeeGroup);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const currentUserWithdrawalLimitGroup = withdrawLimit?.find(item => item.group === feeGroup.group) || withdrawLimit?.find(item => item.group === 'any');

    const estimatedValueDay = (+currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay) / +price;
    const estimatedValueMonth = (+currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth) / +price;

    const canvas = document.getElementsByClassName('cr-withdrawal-limits__group-arc');

    const ctxList = [...canvas].map((ctx: HTMLCanvasElement) => {
        ctx.width = 46;
        ctx.height = 46;
    
        return ctx && ctx.getContext('2d')
    });
    
    const draw = useCallback((usedLimit, limit, id) => {
        const rad = (+usedLimit * 100) / +limit;
        const offset = Math.PI * 1.5;
        const angle = (Math.PI * 2 * +rad) / 100;
        const end = -angle + offset + 0.01;

        ctxList.forEach((ctx, index) => {
            if (id === index && ctx) {
                ctx.clearRect(0, 0, 46, 46);
                ctx.beginPath();
                ctx.strokeStyle = '#3C78E0';
                ctx.lineWidth = 4;
                ctx.arc(21, 24, 18, offset, end);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(91, 100, 136, 0.24)';
                ctx.lineWidth = 4;
                ctx.arc(21, 24, 18, offset, 100);
                ctx.stroke();
            }
        });
    }, [usedWithdrawalLimitDay, currentUserWithdrawalLimitGroup, currencyId])

    draw(usedWithdrawalLimitDay, currentUserWithdrawalLimitGroup?.limit_24_hour, 0);
    draw(usedWithdrawalLimitMonth, currentUserWithdrawalLimitGroup?.limit_1_month, 1);

    const renderTime = useCallback((period) => {
        switch (period) {
            case 'D':
                return 'in 24 hours';
            case 'M':
                return 'in 1 month';
            default:
                return;
        }
    }, []);

    const renderArcBlock = useCallback((period, estimatedValue, limit) => {
        return (
            <div className="cr-withdrawal-limits__group">
                <canvas className="cr-withdrawal-limits__group-arc"></canvas>
                <div className="cr-withdrawal-limits__group-info">
                    <div className="cr-withdrawal-limits__group-info-usdt">
                        <Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{limit?.toString()}</Decimal>&nbsp;{GLOBAL_PLATFORM_CURRENCY}
                        <span className="cr-withdrawal-limits__group-info-period">&nbsp;/{period}</span></div>
                    <div className="cr-withdrawal-limits__group-info-currency">
                        <Decimal fixed={fixed} thousSep=",">{estimatedValue?.toString()}</Decimal>&nbsp;{currencyId?.toUpperCase()}
                        <span className="cr-withdrawal-limits__group-info-period">&nbsp;| {renderTime(period)}</span></div>
                </div>
            </div>
        );
    }, [price, fixed, usedWithdrawalLimitDay, usedWithdrawalLimitMonth, feeGroup, currentUserWithdrawalLimitGroup]);

    return (
        <React.Fragment>
            <div className="cr-withdrawal-limits">
                <h3>{translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit')}</h3>
                <span className="cr-withdrawal-limits__fee-group">{feeGroup.group}</span>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 300 }}
                    overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.tip" />}>
                    <div className="cr-withdrawal-limits__title-tip">
                        <TipIcon />
                    </div>
                </OverlayTrigger>
            </div>
            {renderArcBlock('D', estimatedValueDay, +currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay)}
            {renderArcBlock('M', estimatedValueMonth, +currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth)}
        </React.Fragment>
    );
});
