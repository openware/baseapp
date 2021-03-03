export const precisionRegExp = (precision: number) => new RegExp(precision ?
    `^(?:[\\d-]*\\.?[\\d-]{0,${precision}}|[\\d-]*\\.[\\d-])$` :
    `^(?:[\\d-]*)$`,
);
