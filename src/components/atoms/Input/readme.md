Example of usage:

```js
  const handleChange = () => undefined;
  const onKeyPress = (event) => {
      if (event.key === "Enter") {
        console.log("Enter");
      }
  }; 

  <Input
    type="text"
    placeholder="Placeholder"
    min="0"
    onChangeValue={handleChange}
    onKeyPress={onKeyPress}
    />
```