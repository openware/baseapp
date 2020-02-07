export const passwordErrorFirstSolution = (value: string) => value.match(/.{8,80}/g);
export const passwordErrorSecondSolution = (value: string) => value.match(/(?=.*[a-z])(?=.*[A-Z]).*/g);
export const passwordErrorThirdSolution = (value: string) => value.match(/[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*/g);
