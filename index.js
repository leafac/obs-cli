#!/usr/bin/env node

const { program } = require("commander");
const OBSWebSocket = require("obs-websocket-js");
const { version } = require("./package.json");

(async () => {
  program
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
    .option("-p, --password <password>", "for example, ‘$up3rSecretP@ssw0rd’")
    .parse();
  const {
    args: [requestName, rawRequestArguments],
    address,
    password,
  } = program;
  if (requestName === undefined) {
    program.outputHelp();
    process.exit(1);
  }
  let requestArguments;
  try {
    if (rawRequestArguments !== undefined)
      requestArguments = JSON.parse(rawRequestArguments);
  } catch (error) {
    console.error(
      `Failed to parse requestArguments: ` + JSON.stringify(error, undefined, 2)
    );
    process.exit(1);
  }

  const obs = new OBSWebSocket();
  try {
    await obs.connect({ address, password });
  } catch (error) {
    console.error(
      `Failed to connect to OBS: ` + JSON.stringify(error, undefined, 2)
    );
    process.exit(1);
  }
  try {
    console.log(await obs.send(requestName, requestArguments));
    await obs.disconnect();
  } catch (error) {
    console.error(
      `Failed to run request: ` + JSON.stringify(error, undefined, 2)
    );
    process.exit(1);
  }
})();
