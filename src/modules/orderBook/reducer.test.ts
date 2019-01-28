import * as actions from './actions';
import {
  depthReducer,
  initialDepth,
  initialOrderBook,
  orderBookReducer,
} from './reducer';

describe('orderBook reducer', () => {
  const fakeMarket = {
    id: 'btczar',
    name: 'BTC/ZAR',
    bid_fee: '0.0015',
    ask_fee: '0.0015',
    ask_unit: 'btc',
    bid_unit: 'zar',
    min_ask_price: '0.0',
    max_bid_price: '0.0',
    min_ask_amount: '0.0',
    min_bid_amount: '0.0',
    ask_precision: 4,
    bid_precision: 4,
};

  const fakeOrderBook = {
    asks: [
      {
        id: 202440,
        side: 'sell',
        price: '0.99',
        avg_price: '0.99',
        state: 'wait',
        market: 'btczar',
        created_at: '2018-11-21T15:19:48+01:00',
        volume: '0.12',
        remaining_volume: '0.09',
        executed_volume: '0.03',
        trades_count: 1,
      },
    ],
    bids: [
      {
        id: 203599,
        side: 'buy',
        price: '0.01',
        avg_price: '0.01',
        state: 'wait',
        market: 'btczar',
        created_at: '2018-12-14T14:20:12+01:00',
        volume: '0.1',
        remaining_volume: '0.041',
        executed_volume: '0.059',
        trades_count: 1,
      },
    ],
    loading: true,
  };

  const fakeDepth = {
    asks: [
      [ '0.99', '1' ],
      [ '0.75', '1' ],
      [ '0.70', '1' ],
      [ '0.60', '0.1' ],
    ],
    bids: [
      [ '0.50', '0.041' ],
      [ '0.49', '0.5' ],
      [ '0.26', '25' ],
    ],
    currentPrice: '',
    loading: true,
  };

  it('should handle ORDER_BOOK_FETCH', () => {
    const expectedState = { ...initialOrderBook, loading: true, error: undefined };
    expect(orderBookReducer(initialOrderBook, actions.orderBookFetch(fakeMarket))).toEqual(expectedState);
  });

  it('should handle DEPTH_FETCH', () => {
    const expectedState = { ...initialDepth, loading: true, error: undefined };
    expect(depthReducer(initialDepth, actions.depthFetch(fakeMarket))).toEqual(expectedState);
  });

  /* tslint:disable */
  it('should handle ORDER_BOOK_DATA', () => {
    const expectedState = { ...fakeOrderBook, loading: false, error: undefined };
    expect(orderBookReducer(fakeOrderBook, actions.orderBookData(fakeOrderBook))).toEqual(expectedState);
  });

  it('should handle DEPTH_DATA', () => {
    const expectedState = { ...fakeDepth, loading: false, error: undefined };
    expect(depthReducer(fakeDepth, actions.depthData(fakeDepth))).toEqual(expectedState);
  });
  /* tslint:enable */

});
