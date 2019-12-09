#!/usr/bin/env node
const http = require('http');
const mockserver = require('mockserver');
var markets = require('./markets.js');
var RangerMock = require('./ranger.js');
const argv = require('yargs').argv;
const fs = require('fs');
const portWS = argv.portWS || 9003;

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });

var server = new RangerMock(portWS, markets);

fs.watch('./mocks', (curr, prev) => {
  console.log(`reloading mock websocket`);
  server.close();
  delete require.cache[require.resolve('./ranger.js')]
  delete require.cache[require.resolve('./markets.js')]
  RangerMock = require('./ranger.js')
  markets = require('./markets.js');
  server = new RangerMock(portWS, markets);
});
