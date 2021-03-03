import bchRegex from 'bitcoincash-regex';

export const formatCCYAddress = (currency: string, address: string): string => {
    if (address) {
        if (currency === 'BCH') {
            if (bchRegex().test(address)) {
                return address;
                // TODO: find less heavy way to do this
                //     return bch.Address(address).toString(bch.Address.CashAddrFormat);
            } else {
                return '';
            }

            // if (bch.Address.isValid(address)) {
            //     return bch.Address(address).toString(bch.Address.CashAddrFormat);
            // } else {
            //     return '';
            // }
        } else {
            return address;
        }
    } else {
        return '';
    }
};
