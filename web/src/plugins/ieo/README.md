# IEO Baseapp plugin

The IEO plugin allows you to receive custom Baseapp image with IEO section

## Setting up

In order to set up IEO plugin for Baseapp and receive images to a registry add an item to [images.yaml](https://github.com/openware/assembly-line/blob/master/images.yaml).

## Deployment configs

Baseapp IEO plugin is pretty customisable. If you want to have a basic IEO plugin, set up these configs to your `env.js` file.

```javascript
plugins: [{
        name: 'ieo',
        config: {
            fields: {
                name: 'IEO',
                description: true,
                ratio: true,
                metadata: true,
            },
        }
}]
```

In order to have **Auctions** plugin set these to `env.js`

```javascript
plugins: [{
        name: 'ieo',
        config: {
            fields: {
                name: 'Auctions',
                description: false,
                ratio: false,
                metadata: false,
            },
        }
}]
```
