# Password strength meter

###### This document provides description, defaults, possible values and methods for Password strength meter component
#
```passwordEntropyStep``` - variable for changing entropy step, setting on **frontend.env**. **Default**: 6

## Props

Variable name | Require | Default value | Possible values | Description |
| ------ | ------ | ------ | ------ | ------ |
| currentPasswordEntropy | Yes | 0 | any positive int | current entropy for password which you enter ( post request to barong **password/validate**)  |
| minPasswordEntropy | Yes | 0 | any positive int | minimal entropy required by password ( Setting on **barong.env**  ) |
| passwordExist | Yes | - | boolean | checking if value in password field exist for showing password strength meter |
| passwordErrorFirstSolved | Yes | - | boolean | for approve first hint; ```at least 8 characters``` |
| passwordErrorSecondSolved | Yes | - | boolean | for approve second hint: ```at least One capital letter and lowercase letter``` |
| passwordErrorThirdSolved | Yes | - | boolean | for approve third hint: ```at least 1 digit``` |
| passwordPopUp | Yes | - | boolean | show tooltip with password strength status |
| translate | Yes | - | (id: string) => string  | function for translate password status |

| Status | Translation variable | Description |
| ------ | ------ | ------ |
| Too weak | page.header.signUp.password.too.weak | ```currentPasswordEntropy < minPasswordEntropy || !passwordLengthSolved``` |
| Weak | page.header.signUp.password.weak | ```(currentPasswordEntropy <= minPasswordEntropy && passwordLengthSolved) || passwordLengthSolved``` |

**Next status avaible only if:** ```passwordSuccess = true```
#
```AVG_PASSWORD_ENTROPY =  minPasswordEntropy + passwordEntropyStep```
```STRONG_PASSWORD_ENTROPY = minPasswordEntropy + passwordEntropyStep * 2```

|  |  |  |
| ---- | ---- | ----- |
| Good | page.header.signUp.password.good | ```currentPasswordEntropy > minPasswordEntropy && currentPasswordEntropy < AVG_PASSWORD_ENTROPY``` |
| Strong | page.header.signUp.password.strong | ```currentPasswordEntropy >= minPasswordEntropy && currentPasswordEntropy < AVG_PASSWORD_ENTROPY``` |
| Very Strong | page.header.signUp.password.very.strong | ```props.currentPasswordEntropy >= STRONG_PASSWORD_ENTROPY``` |

##### All status naming can be change in src/translations

### Colors
##### For changing colors go to src/styles/colors.pcss

| Status | Variable name | Default value| Possible values |
| ------ | ------ | ------ | ------ |
| Too weak | password-strength-meter-too_weak | R: 232 G: 94 B: 89 | rgb |
| Weak | password-strength-meter-weak | R: 232 G: 175 B: 89 | rgb |
| Good | password-strength-meter_good | R: 141 G: 224 B: 112 | rgb |
| Strong | password-strengt-meter-strong | R: 78 G: 206 B: 149 | rgb |
| Very Strong | password-strength-meter-very-strong | R: 108 G: 239 B: 239 | rgb |
