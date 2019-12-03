FIlterInput example:

```js
const data = [
    {
        cryptoCode: 'BTC',
        address: 'p12MWEVJ00'
    },
    {
        cryptoCode: 'ETH',
        address: 'X12MWEVJ00'
    },
    {
        cryptoCode: 'XRP',
        address: 'z12MWEVJ00'
    }
];
const resultFunc = (result) => console.log(result);
const consist = (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
const filter = (wallet, term) => {
    return consist(wallet.cryptoCode, term) ||
     consist(wallet.address, term)
};

<FilterInput
    onFilter={resultFunc}
    filter={filter}
    data={data}
/> 
```
