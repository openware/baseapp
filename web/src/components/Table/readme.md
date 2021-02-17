Table example:

```js

let data = [
    ['12:00', 'Market', 'BTC/USD', 'buy', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'buy', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'sell', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'buy', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'sell', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'buy', 8000, '1.4', '112000'],
    ['12:00', 'Market', 'BTC/USD', 'sell', 8000, '1.4', '112000']
];

const header = ['Time', 'Type', 'Pairs', 'Action', 'Price', 'Amount', 'Total'];

const filterType = (headerKey, searchKey) => item => {
    const typeIndex = header.indexOf(headerKey);
    return item[typeIndex] === searchKey;
};

const filters = [
    {
        name: 'Bids',
        filter: filterType('Action', 'buy'),
    },
    {
        name: 'Asks',
        filter: filterType('Action', 'sell'),
    },
    {
        name: 'All',
        filter: () => true,
    },
];


<Table
    data={data}
    header={header}
    titleComponent={<div>Table header</div>}
    filters={filters}
/>

```
