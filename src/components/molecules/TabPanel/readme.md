TabPanel example:

```js
const panels = [
    {
        label: 'Deposit',
        content: (
            <div>
                <h4>Deposit</h4>
                <p>Deposit lorem ipsum dolor sit amet.</p>
                <input id="d" type="text" />
            </div>
        ),
    },
    {
        label: 'Withdraw',
        content: (
            <div>
                <h4>Withdraw</h4>
                <p>Withdraw lorem ipsum dolor sit amet.</p>
                <input id="w" type="text" />
            </div>
        ),
    },
    {
        label: 'Hidden',
        hidden: true,
        content: (
            <div>
                <h4>Hidden</h4>
                <p>Hidden lorem ipsum dolor sit amet.</p>
            </div>
        ),
    },
    {
        label: 'Disabled',
        disabled: true,
        content: (
            <div>
                <h4>Disabled</h4>
                <p>Disabled lorem ipsum dolor sit amet.</p>
            </div>
        ),
    },
];

const handleTabChange = (index, label) => console.log(index, label);

<TabPanel
    fixed={false}
    hideMode="hide"
    onTabChange={handleTabChange}
    panels={panels}
/>
```
