#!/usr/bin/env node
const { spawn } = require('child_process');
const RangerMock = require('../mocks/ranger');
const colors = require('colors');

const argv = require('yargs').argv;
const apiV2Port = argv.portV2 || 9002;
const rangerPort = argv.rangerPort || 9011;
const help = argv.h || argv.help;

const markets = [
  'BTC/ZAR',
  'BCH/ZAR',
  'ETH/BTC',
  'DASH/BTC',
  'EUR/USD',
]

const startMock = (port, version) => {
  const log = (message) => console.log(`Mock ${version}: ${message}`.trim());
  const mock = spawn("./mocks/mocksrv.js", ["--port", port, "--dir", `mocks`]);
  mock.stdout.on('data', log);
  mock.stderr.on('data', log);
  mock.on('close', (code) => {
    log(`process exited with code ${code}`.red);
    process.exit();
  });
  return mock;
}

if (help) {
  console.log([
    "Usage:",
    "  start_mock.js [ARGS]",
    "",
    "Options:",
    "  --api-v2-port=PORT   - Port for the v2 API mockserver to listen on",
    "  --ranger-port=PORT   - Port for Ranger mock to listen on",
  ].join("\n"));
} else {
  const mockV2 = startMock(apiV2Port, "v2")
  new RangerMock(rangerPort, markets);

  function exitHandler(options, exitCode) {
    mockV2.kill('SIGINT');
  }
  process.on('exit', exitHandler.bind(null, { cleanup: true }));
}
