Example of usage:

```js
const onClick = label => alert(`Clicked: ${label}`);

<div style={{ display: 'flex', justifyContent: 'space-between'}}>
    <Button label="Active" onClick={onClick}/>
    <Button label="Another" onClick={onClick}/>
    <Button label="Disabled" disabled />
</div>
```
