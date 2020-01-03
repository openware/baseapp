Example of usage:

```js
const onClick = label => alert(`Clicked: ${label}`);

<div style={{ display: 'flex', justifyContent: 'space-between'}}>
    <PercentageButton label="Active" onClick={onClick}/>
    <PercentageButton label="Another" className='cr-percentage-button' onClick={onClick}/>
</div>
```
