# Password Tip

###### This document provides description, defaults, possible values and methods for Password Tip component
#

## Props

Variable name | Require | Possible values | Description |
| ------ | ------ | ------ | ------ |
| passwordErrorFirstSolved | Yes | boolean | for approve first hint; ```at least 8 characters``` |
| passwordErrorSecondSolved | Yes | boolean | for approve second hint: ```at least One capital letter and lowercase letter```  |
| passwordErrorFirstSolved | Yes | boolean | for approve third hint: ```at least 1 digit``` |
| translate | No |(id: string) => string  | function for translate password hints |

## Translation variable

###### For changing text go to src\translations\en.ts

| Text | Translation variable |
| ------ | ------ | ------ |
| What influence on password strength | password.strength.tip.influence |
| At least 8 characters | password.strength.tip.number.characters |
| at least One capital letter and lowercase letter | password.strength.tip.letter |
| At least One digit | password.strength.tip.digit |