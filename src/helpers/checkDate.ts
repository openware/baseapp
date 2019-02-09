export const isDateInFuture = (date: string) => {
    const [day, month, year] = date.split('/');
    const inputDate = new Date(`${month}/${day}/${year}`);
    const curDate = new Date();

    return inputDate > curDate;
};
