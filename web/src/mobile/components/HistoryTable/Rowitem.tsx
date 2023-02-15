import * as React from 'react';
import { Decimal } from '../../../components/Decimal';
import { localeDate } from '../../../helpers';

const RowItemComponent = (props) => {
    return (
        <div className="cr-mobile-table-row">
            <div className="cr-mobile-table-row__amount">
                <div className="cr-mobile-table-row__amount-value">
                    <Decimal fixed={props.fixed} thousSep=",">
                        {props.amount}
                    </Decimal>
                </div>
                <span className="cr-mobile-table-row__amount-currency">{props.currency}</span>
            </div>
            <div className="cr-mobile-table-row__date">{localeDate(props.createdAt, 'fullDate')}</div>
        </div>
    );
};

const RowItem = React.memo(RowItemComponent);

export { RowItem };
