const consist = (a, b) => {
    return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
};

export const handleFilter = (item, term) => {
    return consist(item.currency, term);
};
