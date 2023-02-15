export const getTotalPrice = (amount: string, priceMarket: number, proposals: string[][]) => {
    if (proposals.length === 0) {
        return Number(amount) * priceMarket;
    }

    for (const p of proposals) {
        if (p.length < 2) {
            return Number(amount) * priceMarket;
        }
    }

    let sum = Number(amount);

    const list = proposals;
    let total = 0;

    for (const proposal of list) {
        if (!sum) {
            break;
        }

        if (sum <= Number(proposal[1])) {
            total += sum * Number(proposal[0]);
            sum = 0;
        } else {
            total += Number(proposal[1]) * Number(proposal[0]);
            sum -= Number(proposal[1]);
        }
    }

    if (sum > 0 && list.length >= 1) {
        // sum is bigger then order book liqudity
        const lastPrice = Number(list[list.length - 1][0]);
        total += lastPrice * sum;
    }

    return total;
};

export const getAmount = (avaiblePrice: number, proposals: string[][], value: number) => {
    let sum = avaiblePrice * value;

    const list = proposals;
    let totalAmount = 0;

    for (const proposal of list) {
        if (!sum) {
            break;
        }

        if (sum <= Number(proposal[0]) * Number(proposal[1])) {
            totalAmount += sum / Number(proposal[0]);
            sum = 0;
        } else {
            totalAmount += Number(proposal[1]);
            sum -= Number(proposal[0]) * Number(proposal[1]);
        }
    }

    return totalAmount;
};
