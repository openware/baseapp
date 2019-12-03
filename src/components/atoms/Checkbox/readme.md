Example of usage:

```js
const handleCheckboxChange = (e) => {
  console.log(e.target.checked);
}

<div>
  <Checkbox
    label="Default checkbox"
    onChange={handleCheckboxChange}
  />
  <Checkbox
    checked={true}
    onChange={handleCheckboxChange}
    disabled
    label="Disabled checked checkbox"
  />
  <Checkbox
    checked={false}
    onChange={handleCheckboxChange}
    disabled
    label="Disabled unchecked checkbox"
  />
</div>
```
