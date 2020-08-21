const alias = require('./webpack/alias');

module.exports = {
    setupFilesAfterEnv: ['jest-enzyme', '<rootDir>/jest/setup.tsx'],
    testEnvironment: 'enzyme',
    verbose: true,
    moduleNameMapper: {
        ...alias.jest,
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
        '^react-scroll-to-component$': 'identity-obj-proxy',
    },
    globals: {
        __webpack_hash__: '1',
    },
    // ---------------------------------------------------------------------------
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.(tsx|ts)$': 'ts-jest',
        '^.+\\.(jsx|js)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/jest/svg-transform.js',
    },
    testRegex: '.src/units/.*.(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|jsx)?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'css', 'scss'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
    testURL: 'http://localhost'
};

// moduleNameMapper: {
//     '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
//         '<rootDir>/__mocks__/fileMock.js',
//     '\\.(css|scss|pcss)$': '<rootDir>/__mocks__/styleMock.js',
// },
