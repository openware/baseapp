import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { offersFetch, selectP2PPaymentMethodsData } from '../modules';

export const useP2POffersFetch = ({
    limit = DEFAULT_TABLE_PAGE_LIMIT,
    page = 0,
    side = 'buy',
    payment_method = '',
    base = '',
    quote = '',
    sort = '',
}) => {
    const dispatch = useDispatch();
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);

    React.useEffect(() => {
        const paymentMethodId = paymentMethods.find((i) => i.name === payment_method);
        dispatch(
            offersFetch({
                limit,
                page,
                side: side === 'buy' ? 'sell' : 'buy',
                payment_method: paymentMethodId?.id,
                base: base?.toLowerCase(),
                quote: quote?.toLowerCase(),
                sort: sort,
            }),
        );
    }, [limit, page, side, payment_method, base, quote, paymentMethods, sort]);
};
