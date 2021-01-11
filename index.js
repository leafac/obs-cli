#!/usr/bin/env node

const { program } = require("commander");
const OBSWebSocket = require("obs-websocket-js");
const { version } = require("./package.json");

(async () => {
  const {
    args: [requestName, requestArgumentsString],
    address,
    password,
  } = program
    .version(version)
    .arguments("<request-name> [request-arguments]")
    .description("Remote control OBS from the command line.", {
      "request-name":
        "for example, ‘SetRecordingFolder’; see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md for the complete list",
      "request-arguments": `for example, ‘{ "rec-folder": "/tmp/" }’`,
    })
    .option(
      "-a, --address <address>",
      "the address configured in OBS under Tools > WebSockets Server Settings",
      "localhost:4444"
    )
    .option(
      "-p, --password <password>",
      "the password configured in OBS under Tools > WebSockets Server Settings"
    )
    .parse();
  if (requestName === undefined) {
    program.outputHelp();
    process.exit(1);
  }
  let requestArguments;
  try {
    if (requestArgumentsString !== undefined)
      requestArguments = JSON.parse(requestArgumentsString);
  } catch (error) {
    console.error(`Failed to parse request-arguments: ${error}`);
    process.exit(1);
  }

  const obs = new OBSWebSocket();
  try {
    await obs.connect({ address, password });
  } catch (error) {
    console.error(
      `Failed to connect to OBS:\n${JSON.stringify(error, undefined, 2)}`
    );
    process.exit(1);
  }
  try {
    console.log(
      JSON.stringify(
        await obs.send(requestName, requestArguments),
        undefined,
        2
      )
    );
    await obs.disconnect();
  } catch (error) {
    console.error(
      `Failed to run request:\n${JSON.stringify(error, undefined, 2)}`
    );
    process.exit(1);
  }
})();
