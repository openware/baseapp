import { handleIncrementalUpdate } from './';

describe('Describe incremental update of order book asks', () => {
    it('should append value to order book', () => {
        const asks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const newAskOrder: string[] = ['0.50', '0.7'];

        const updatedAsks: string[][] = [
            ['0.50', '0.7'],
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const result = handleIncrementalUpdate(asks, newAskOrder, 'asks');
        expect(result).toEqual(updatedAsks);
    });

    it('should update existing value in order book', () => {
        const asks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const newAskOrder: string[] = ['0.70', '0.2'];

        const updatedAsks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '0.2'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const result = handleIncrementalUpdate(asks, newAskOrder, 'asks');
        expect(result).toEqual(updatedAsks);
    });

    it('should remove value from order book if value is empty', () => {
        const asks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const newAskOrder: string[] = ['0.90', ''];

        const updatedAsks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.95', '0.5'],
        ];

        const result = handleIncrementalUpdate(asks, newAskOrder, 'asks');
        expect(result).toEqual(updatedAsks);
    });

    it('should remove value from order book if value is zero', () => {
        const asks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.90', '1.5'],
            ['0.95', '0.5'],
        ];

        const newAskOrder: string[] = ['0.90', '0'];

        const updatedAsks: string[][] = [
            ['0.60', '0.1'],
            ['0.70', '1.5'],
            ['0.75', '2.0'],
            ['0.80', '3.0'],
            ['0.95', '0.5'],
        ];

        const result = handleIncrementalUpdate(asks, newAskOrder, 'asks');
        expect(result).toEqual(updatedAsks);
    });
});

describe('Describe incremental update of order book bids', () => {
    it('should append value to order book', () => {
        const bids: string[][] = [
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const newBidOrder: string[] = ['1.00', '0.7'];

        const updatedBids: string[][] = [
            ['1.00', '0.7'],
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const result = handleIncrementalUpdate(bids, newBidOrder, 'bids');
        expect(result).toEqual(updatedBids);
    });

    it('should update existing value in order book', () => {
        const bids: string[][] = [
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const newBidOrder: string[] = ['0.60', '0.2'];

        const updatedBids: string[][] = [
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.2'],
        ];

        const result = handleIncrementalUpdate(bids, newBidOrder, 'bids');
        expect(result).toEqual(updatedBids);
    });

    it('should remove value from order book if value id empty', () => {
        const bids: string[][] = [
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const newBidOrder: string[] = ['0.90', ''];

        const updatedBids: string[][] = [
            ['0.95', '0.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const result = handleIncrementalUpdate(bids, newBidOrder, 'bids');
        expect(result).toEqual(updatedBids);
    });

    it('should remove value from order book if value is number', () => {
        const bids: string[][] = [
            ['0.95', '0.5'],
            ['0.90', '1.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const newBidOrder: string[] = ['0.90', '0.00'];

        const updatedBids: string[][] = [
            ['0.95', '0.5'],
            ['0.80', '3.0'],
            ['0.75', '2.0'],
            ['0.70', '1.5'],
            ['0.60', '0.1'],
        ];

        const result = handleIncrementalUpdate(bids, newBidOrder, 'bids');
        expect(result).toEqual(updatedBids);
    });
});
