OrderBook example:

```js

const data = [
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121],
    [123, 14, 121]
];

const orderEntry = [1, 0.2, 3, 2, 0.5];

const maxVolume = 3;
const headers = ['Amount', 'Total', 'Price'];
const onSelect = (index) => console.log(index);

<OrderBook
    side={'right'}
    maxVolume={maxVolume}
    orderBookEntry={orderEntry}
    rowBackgroundColor={'rgba(255, 255, 255, 0.5)'}
    data={data}
    title={'Bids'}
    headers={headers}
    onSelect={onSelect}
 />
```
