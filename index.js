#!/usr/bin/env node

const { program } = require("commander");
const OBSWebSocket = require("obs-websocket-js");
const { version } = require("./package.json");

program
  .option(
    "-a, --address <address>",
    "the address configured in OBS under Tools > WebSockets Server Settings",
    "localhost:4444"
  )
  .option(
    "-p, --password <password>",
    "the password configured in OBS under Tools > WebSockets Server Settings"
  )
  .arguments("<request-name> [request-arguments]")
  .description("Remote control OBS from the command line.", {
    "request-name":
      "for example, ‘SetRecordingFolder’; see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md for the complete list",
    "request-arguments": `for example, ‘{ "rec-folder": "/tmp/" }’`,
  })
  .version(version)
  .action(async (requestName, requestArguments, { address, password }) => {
    try {
      const obs = new OBSWebSocket();
      await obs.connect({ address, password });
      console.log(
        JSON.stringify(
          await obs.send(
            requestName,
            requestArguments === undefined
              ? undefined
              : JSON.parse(requestArguments)
          ),
          undefined,
          2
        )
      );
      await obs.disconnect();
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : JSON.stringify(error, undefined, 2)
      );
      process.exit(1);
    }
  })
  .parseAsync();
