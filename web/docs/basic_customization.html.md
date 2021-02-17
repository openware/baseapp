## How to change logo + favicon and title

From this tutorial you will learn how to customize [frontend application](https://github.com/openware/baseapp) for [OpenDAX](https://github.com/openware/opendax), just if you want to make it more personalized.

**Reminder:**

* Here is [previous customization tutorial](https://medium.com/openware/change-baseapp-logo-and-deploy-in-opendax-8506c865ee99) where you can find how to update logo for Baseapp version 2.4.

In newer 2.5 and 2.6 versions exchange logo is represented as SVG element inside React Function Component instead of simple png image from 2.4 version.

The roadmap is pretty short:

* clone [Baseapp](https://github.com/openware/baseapp)
* change the logo and favicon
* edit page title

Should be easy as always. Let’s start.

### 1. Clone Baseapp
```bash
cd /home/app
git clone https://github.com/openware/baseapp.git
```

### 2. Change the logo and favicon

So to start with, you can download some [random SVG image](https://www.flaticon.com/svg/static/icons/svg/2933/2933116.svg) and [favicon in ICO format](https://icon-icons.com/downloadimage.php\?id\=51091\&root\=516/ICO/512/\&file\=coin_money_icon-icons.com_51091.ico).

To change the logo follow next steps:

```bash
  #this is the folder where all the default logos and images are
  cd /home/app/baseapp/src/assets/images

  # backup the default one, just in case we do something wrong
  cp LogoIcon.tsx LogoIcon.tsx.bak

  # download the new SVG logo
  curl https://www.flaticon.com/svg/static/icons/svg/2933/2933116.svg -o logo.svg

  # open new logo.svg via vim first and copy whole <svg>
  vim logo.svg

  # open LogoIcon.tsx, delete everything inside LogoIcon const and  paste <svg> from logo.svg
  vim LogoIcon.tsx
```

```javascript
  export const LogoIcon: React.FC<LogoIconProps> = (props: LogoIconProps) => (
      <svg width="118" height="20" viewBox="0 0 118 20" fill="none" className={props.className}>  // replace
          <path ... fill="var(--primary-text-color)"/>  // replace
          <path ... fill="var(--primary-text-color)"/>  // replace
          <path ... fill="var(--primary-text-color)"/>  // replace
          <path ... fill="var(--primary-text-color)"/>  // replace
          <path ... fill="var(--icons)"/>               // replace
      </svg>                                            // replace
  );
```

Last step - add className={props.className} to the opening <svg> tag. It should look like this

```html
  <svg className={props.className} ...other_attributes>
```

**Pay attention** that most of the `<svg>` images have `width` and `height` attributes which are already preseted so, probably, you will have to change them.
Keep the ratio between width and height for downloaded image, but don’t use height bigger than 60px (it will overflow the Header).

So in the end my opening SVG tag inside the **LogoIcon.tsx** looks like that:

```html
  <svg className={props.className} width=”60" height=”60" viewBox=”0 0 512 512">
```

Now let’s replace favicon.ico:

```bash
  # this is the folder where React stores favicon.ico, index.htm and manifest.json
  cd /home/app/baseapp/public

  # backup the default favicon
  cp favicon.ico favicon.ico.bak

  # download the new one
  curl https://icon-icons.com/downloadimage.php\?id\=51091\&root\=516/ICO/512/\&file\=coin_money_icon-icons.com_51091.ico -o favicon.ico
```
### 3. Edit the page title

To edit title of the webpage we have to change it in two files:

```bash
# open index.html and edit 'Cryptobase' name between <title> tag
cd /home/app/baseapp/public
vim index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    ...
    <title>Cryptobase</title>  // change name here
</head>

# this is the folder where React application constants stored
cd /home/app/baseapp/src/constants

# open index.ts file and edit PG_TITLE_PREFIX constant
vim index.ts

export const PG_TITLE_PREFIX = 'Cryptobase'; // change name here
```

And that’s it, now you have your frontend with your own logo, favicon and title.
