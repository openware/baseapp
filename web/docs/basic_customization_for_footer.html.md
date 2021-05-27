## How to customize footer (SSR)

From this tutorial you will learn how to customize footer for OpenDAX, just if you want to make it more personalized.

We have 2 footers on the platform. First inside React on the landing page and second one comes from server;
###### If you want customize footer for landing page follow to the docs: ```basic_customization_for_landing_page```

### 1. Clone Baseapp
```bash
git clone https://github.com/openware/baseapp.git
```

### 2. Customize footer
let's add to the footer some links / social links

1. open file ```views\layouts\footer.html```
2. add some custom code
```html
<footer>
    <div class="cr-footer__info">
        Copyright &copy; 2021
        <a href="https://github.com/openware" target="_blank">openware</a>
    </div>
    <div class="cr-footer__social-links">
        <div class="pg-landing-screen__footer__wrap__social__row">
            <a href="https://medium.com/openware" target="_blank"><img src="put_your_image" alt="Medium" /></a>
            <a href="https://www.linkedin.com/company/openware-com" target="_blank"><img src="put_your_image" alt="LinkedIn" /></a>
            <a href="https://twitter.com/openwarecom" target="_blank"><img src="put_your_image" alt="Twitter" /></a>
            <a href="https://www.youtube.com/channel/UCGrRNy-EpI67ivdAL5z4JIg" target="_blank"><img src="put_your_image" alt="YouTube" /></a>
        </div>
    </div>
</footer>
```

###### for styles customization you have 2 solutions:
1. add tag <style> at the top of file and put css inside;
2. create file inside react(web/src) and put your css in this file;

### 3. Enable footer on server side 
update env ```RENDER_FOOTER``` to true or...

1. open file ```handlers\index.go```
2. update ```renderFooter, err = strconv.ParseBool(utils.GetEnv("RENDER_FOOTER", "true"))```

### 4. Start local dev server
follow the guide: https://github.com/openware/baseapp/blob/master/README.md
