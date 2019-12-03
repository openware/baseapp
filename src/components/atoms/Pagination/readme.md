Example of usage:

```js
  const onClickPrevPage = () => console.log(1);
  
  const onClickNextPage = () => console.log(2);

  <Pagination 
    firstElemIndex={1}
    lastElemIndex={6}
    total={30}
    page={0}
    nextPageExists={true}
    onClickPrevPage={onClickPrevPage}
    onClickNextPage={onClickNextPage}
  />
```