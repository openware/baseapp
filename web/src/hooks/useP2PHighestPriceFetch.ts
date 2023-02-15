import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Currency, p2pHighestPriceFetch } from '../modules';

export const useP2PHighestPriceFetch = (base?: Currency, quote?: Currency) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (base && quote) {
            dispatch(
                p2pHighestPriceFetch({
                    base: base.id.toLowerCase(),
                    quote: quote.id.toLowerCase(),
                }),
            );
        }
    }, [base, quote, p2pHighestPriceFetch]);
};
