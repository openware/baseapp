export function handleFilter(item, term) {
    return consist(item.currency, term);
};

function consist(a, b) {
    return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
}
