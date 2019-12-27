```js
const data = [
  ['eth/btc', '0.0710000'],
  ['xpr/btc', '0.0710000'],
  ['xpr/ltc', '0.0710000'],
  ['usdt/btc', '0.0710000'],
  ['ltc/btc', '0.0710000'],
];

const headers = ['Pair', 'Price', '24h Change'];

const index = 0;

const onSelect = (index) => console.log(index);

<Markets data={data} onSelect={onSelect} headers={headers} rowKeyIndex={index}/>
```
