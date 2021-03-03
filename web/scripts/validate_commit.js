#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const validate = require('@openware/coding-standards/dist').isCommitMsgValid;

const main = argv => {
    const lines = fs.readFileSync(argv[2]).toString()
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length !== 0 && !x.startsWith('#'));

    for (line of lines) {
        const { right } = validate(line);
        if (right) {
            console.error(`
${chalk.red(right)}: ${line}

Please read the commit message guidelines: ${chalk.blue.bold('http://chris.beams.io/posts/git-commit/')}
`);
            return 1;
        }
    }
    return 0;
};

process.exit(main(process.argv));
