MarketDepths example:

```js

const testData = [
  { bid: 4500, name: 'Total : 4500' },
  { bid: 3500, name: 'Total : 7000' },
  { bid: 2359, name: 'Total : 8986' },
  { bid: 2256, name: 'Total : 4500' },
  { bid: 2222, name: 'Total : 4660' },
  { bid: 2190, name: 'Total : 5400' },
  { bid: 2014, name: 'Total : 4500' },
  { bid: 2003 },
  { bid: 1970 },
  { bid: 1905 },
  { bid: 1900 },
  { bid: 1890 },
  { bid: 1670 },
  { bid: 560 },
  { bid: 480 },
  { bid: 470 },
  { bid: 310 },
  { bid: 234 },
  { bid: 100, ask: 110 },
  { ask: 800 },
  { ask: 940 },
  { ask: 967 },
  { ask: 999 },
  { ask: 1100 },
  { ask: 1130 },
  { ask: 1800 },
  { ask: 2100 },
  { ask: 2600 },
  { ask: 3800 },
  { ask: 4100 },
  { ask: 4300 },
  { ask: 4370 },
  { ask: 4500 },
  { ask: 4680 },
  { ask: 4790 },
  { ask: 4800 },
  { ask: 5100 },
  { ask: 5250 },
];

const stylesTest = {
  strokeGrid: 'rgba(98, 113, 139, 0.2)',
  gridBackgroundEnd: 'rgba(31,42,52,1)',
  gridBackgroundStart: 'rgba(15,20,37,1)',
  strokeAxis: 'rgba(122,150,166,1)',
  strokeAreaBid: 'rgba(91,165,132,1)',
  fillAreaBid: 'rgba(91,165,132,1)',
  strokeAreaAsk: 'rgba(233,91,91,1)',
  fillAreaAsk: 'rgba(233,91,91,1)',
};

<MarketDepths
    data={testData}
    colors={stylesTest}
    hideCartesianGrid={true}
    chartType="linear"
    gradientHide={true}
/>

```
