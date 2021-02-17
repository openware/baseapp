/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/** also modify tsconfig */
const alias = {
    lib: path.join(__dirname, '../src/lib'),
    src: path.join(__dirname, '../src'),
};

function transformToJestAlias() {
    const jestAlias = {};
    Object.keys(alias).forEach((key) => (jestAlias[`^${key}(.*)$`] = `${alias[key].replace('../', '')}$1`));
    return jestAlias;
}

module.exports = {
    webpack: alias,
    jest: transformToJestAlias(),
};
