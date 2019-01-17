module.exports = {
    'roots': [
        '<rootDir>'
    ],
    'snapshotSerializers': ['enzyme-to-json/serializer'],
    'setupTestFrameworkScriptFile': '<rootDir>/enzymeSetup.ts',
    'transform': {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },
    'transformIgnorePatterns': [
        "<rootDir>/node_modules/(?!lodash-es)"
    ],
    'moduleNameMapper': {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|scss|pcss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
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
    'testURL': "http://localhost",
    'collectCoverage': false,
    'collectCoverageFrom': [
        "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
        "<rootDir>/(node_modules|build|dist|docs|charting_library)/**",
    ],
};
