#!/usr/bin/env node
const http = require('http');
const mockserver = require('mockserver');
const markets = require('./markets.js')
const RangerMock = require('./ranger.js')
const argv = require('yargs').argv;
const portWS = argv.portWS || 9003;

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });

class Mock {
    constructor(directory, port, verbose = true) {
        http.createServer(mockserver(directory, verbose)).listen(port, (error) => {
            if (error) {
                console.log(`Mock server ${version} unhandled exception`, error);
                return;
            }

            if (verbose) {
                const url = `http://0.0.0.0:${port}`.green
                console.log(`Mockserver serving ${directory} on: ${url}`);
            }
        })
    }
}

new RangerMock(portWS, markets);
