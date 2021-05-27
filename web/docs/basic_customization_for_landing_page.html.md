## How to customize landing page (React)

From this tutorial you will learn how to customize landing page for OpenDAX, just if you want to make it more personalized.

### 1. Clone Baseapp
```bash
git clone https://github.com/openware/baseapp.git
```

### 2. Start dev server
```bash
cd baseapp/web
yarn install && yarn start-mock
```

###### server will start on localhost:3000
### 3. Change text description
let's change title: ```Welcome to Baseapp.
Buy, sell and trade digital currency.```
1. copy ```Welcome to Baseapp``` and search with this in the en.ts and ru.ts. You will find on the line#104 id and text: page.body.landing.marketInfo.title.text1.
2. change text from ```Welcome to Baseapp``` to ```Welcome to our App```. After you save this file you will see changes on the UI.

###### you can do same steps for second part ```Buy, sell and trade digital currency.```
```Buy, sell and trade digital currency.``` -> ```Buy, sell and trade```

### 4. Change component
let's change section ```Baseapp platform features```
1. open file: web\src\screens\LandingScreen\index.tsx
2. remove code from line#129 to line#189
You should have 
```javascript
    <LandingBlock className="pg-landing-screen__features"></LandingBlock>
```
3. inside section let's put some custom: 
```javascript
    <LandingBlock className="pg-landing-screen__features">
        <div>
            <h2>Quick transfers</h2>
            <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis, id aliquam mauris mauris</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis, id aliquam mauris mauris. Lorem magna nullam id dolor dolor quis venenatis mauris. Augue tellus praesent ut ultrices faucibus scelerisque vitae, nullam. Pulvinar egestas justo nisi convallis tellus integiaculis lacus.</p>
        </div>
        <img src="" alt="some image" />
    </LandingBlock>
```
After saving file you will see changes on the UI;
### 5. Change CSS for component

let's change styles for the part which we added to our landing page

1. open file: web\src\screens\LandingScreen\LandingScreen.pcss
2. find &__features and add:
```css
    .landing-block__content {
      flex-flow: row;
      min-height: fit-content;

      div {
        max-width: 600px;
  
        h2 {
          margin-bottom: 42px;
        }
    
        h3 {
          margin-bottom: 36px;
        }
    
        p {
          font-size: 12px;
        }
      }
    }
```

And that’s it, now you have your custom title and block on the landing page.

and small advice:
   1. find the UI component which you want to change.
   2. find this component inside code (baseapp).
   3. make some customization
