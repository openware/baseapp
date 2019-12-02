module.exports = {
    'roots': [
        '<rootDir>'
    ],
    'transform': {
        '^.+\\.(tsx|ts)$': 'ts-jest',
        '^.+\\.(jsx|js)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/svgTransform.js',
    },
    'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|jsx)?$',
    'moduleFileExtensions': [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
        'css',
        'scss',
    ],
    'snapshotSerializers': ['enzyme-to-json/serializer'],
    'transformIgnorePatterns': [
        "<rootDir>/node_modules/(?!lodash-es)"
    ],
    'moduleNameMapper': {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|scss|pcss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    'testURL': "http://localhost",
    'collectCoverage': false,
    'collectCoverageFrom': [
        "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
        "!<rootDir>/src/charting_library/**",
    ],
};
