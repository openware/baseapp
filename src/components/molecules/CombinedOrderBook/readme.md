OrderBook example:

```js

const dataAsks = [
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
];

const dataBids = [
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
];

const orderEntryAsks = [0.1, 0.2, 0.3, 0.4, 0.5];
const orderEntryBids = [0.1, 0.2, 0.3, 0.4, 0.5];

const maxVolume = 3;
const headers = ['Amount', 'Total', 'Price'];
const onSelectAsks = (index) => console.log(index);
const onSelectBids = (index) => console.log(index);

const isLarge = false;

const lastPrice = <React.Fragment><span className={'pg-order-book__market-negative'}>123</span><span>Last Market Price</span></React.Fragment>;

<CombinedOrderBook
    maxVolume={maxVolume}
    orderBookEntryAsks={orderEntryAsks}
    orderBookEntryBids={orderEntryBids}
    rowBackgroundColorAsks={'rgba(255, 255, 255, 0.5)'}
    rowBackgroundColorBids={'rgba(255, 255, 255, 0.5)'}
    dataAsks={dataAsks}
    dataBids={dataBids}
    headers={headers}
    lastPrice={lastPrice}
    onSelectAsks={onSelectAsks}
    onSelectBids={onSelectBids}
    isLarge={isLarge}
 />
```
