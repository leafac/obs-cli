#!/usr/bin/env node

const { program } = require("commander");
const OBSWebSocket = require("obs-websocket-js");
const { version } = require("./package.json");

program
  .option(
    "-a, --address <address>",
    "the address to the machine in which OBS is running and the port configured in OBS under Tools > WebSockets Server Settings",
    "localhost:4444"
  )
  .option(
    "-p, --password <password>",
    "the password configured in OBS under Tools > WebSockets Server Settings"
  )
  .arguments("<request[=arguments]...>")
  .description("Remote control OBS from the command line.", {
    "request[=arguments]": `a request name (for example, ‘GetRecordingFolder’), optionally followed by arguments (for example, ‘SetRecordingFolder='{ "rec-folder": "/tmp/" }'’) (see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md for the complete list of requests and their arguments)`,
  })
  .action(async (requestsStrings, { address, password }) => {
    try {
      const requests = [];
      for (const request of requestsStrings) {
        const index = request.indexOf("=");
        if (index === -1) requests.push([request]);
        else
          requests.push([
            request.slice(0, index),
            JSON.parse(request.slice(index + 1)),
          ]);
      }

      const responses = [];
      const obs = new OBSWebSocket();
      await obs.connect({ address, password });
      for (const request of requests)
        responses.push(await obs.send(...request));
      await obs.disconnect();

      console.log(JSON.stringify(responses, undefined, 2));
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : JSON.stringify(error, undefined, 2)
      );
      process.exit(1);
    }
  })
  .version(version)
  .parseAsync();
