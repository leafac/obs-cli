#!/usr/bin/env node

import process from "process";
import crypto from "crypto";
import WebSocket from "ws";
import commander from "commander";
import lodash from "lodash";

commander.program
  .arguments("<request>")
  .description("Remote control OBS from the command line.", {
    request: `An obs-websocket request object as JSON (for example, ‘{ "request-type": "SetRecordingFolder", "message-id": "1", "rec-folder": "/tmp" }’) (see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md).`,
  })
  .option(
    "-a, --address <address>",
    "The address to the machine on which OBS is running including the port configured in OBS under ‘Tools > WebSockets Server Settings’.",
    "localhost:4444"
  )
  .option(
    "-p, --password <password>",
    "The password configured in OBS under ‘Tools > WebSockets Server Settings’."
  )
  .option(
    "-g, --get <path>",
    "A field to get from the response (see § Examples for an example and https://lodash.com/docs/4.17.15#get for the syntax) (this is a convenience for applications that need one part of the response and can’t parse the JSON output easily)."
  )
  .version(require("../package.json").version)
  .addHelpText(
    "after",
    `
Examples:

  A request without extra arguments:

    $ obs-cli '{ "request-type": "GetStreamingStatus", "message-id": "1" }'
    {
      "message-id": "1",
      "preview-only": false,
      "recording": false,
      "recording-paused": false,
      "status": "ok",
      "streaming": false
    }

  A request with extra arguments:

    $ obs-cli '{ "request-type": "SetRecordingFolder", "message-id": "1", "rec-folder": "/tmp" }'
    {
      "message-id": "1",
      "status": "ok"
    }

  Multiple requests with ‘ExecuteBatch’ (see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md#executebatch):

    $ obs-cli '{ "request-type": "ExecuteBatch", "message-id": "1", "requests": [ { "request-type": "GetRecordingFolder" }, { "request-type": "SetRecordingFolder", "rec-folder": "/Users/leafac/Videos" }, { "request-type": "GetRecordingFolder" } ] }'
    {
      "message-id": "1",
      "results": [
        {
          "message-id": "",
          "rec-folder": "/tmp",
          "status": "ok"
        },
        {
          "message-id": "",
          "status": "ok"
        },
        {
          "message-id": "",
          "rec-folder": "/Users/leafac/Videos",
          "status": "ok"
        }
      ],
      "status": "ok"
    }

  The ‘--get’ option:

    $ obs-cli --get recording-paused '{ "request-type": "GetStreamingStatus", "message-id": "1" }'
    false

  When OBS can’t be found (for example, if OBS isn’t installed or isn’t running, or if obs-websocket isn’t installed or isn’t running, or if they’re running on a different address, and so forth):

    $ obs-cli --address localhost:5555 '{ "request-type": "GetStreamingStatus", "message-id": "1" }'
    {
      "errno": -61,
      "code": "ECONNREFUSED",
      "syscall": "connect",
      "address": "127.0.0.1",
      "port": 5555
    }

  Invalid request type:

    $ obs-cli '{ "request-type": "NonExistent", "message-id": "1" }' 
    {
      "error": "invalid request type",
      "message-id": "1",
      "status": "error"
    }
`
  )
  .action(
    (
      request: string,
      {
        address,
        password,
        get: getPath,
      }: {
        address: string;
        password: string | undefined;
        get: string | undefined;
      }
    ) => {
      const ws = new WebSocket(`ws://${address}`);

      ws.on("open", () => {
        ws.send(
          password !== undefined
            ? JSON.stringify({
                "request-type": "GetAuthRequired",
                "message-id": "obs-cli/authentication/step-1",
              })
            : request
        );
      });

      ws.on("message", (data) => {
        const response = JSON.parse(String(data));
        if (response["status"] !== "ok") {
          console.error(JSON.stringify(response, undefined, 2));
          process.exit(1);
        }
        switch (response["message-id"]) {
          case "obs-cli/authentication/step-1":
            const { challenge, salt } = response;
            ws.send(
              JSON.stringify({
                "request-type": "Authenticate",
                "message-id": "obs-cli/authentication/step-2",
                auth: sha256(sha256(password + salt) + challenge),
              })
            );
            break;

          case "obs-cli/authentication/step-2":
            ws.send(request);
            break;

          default:
            ws.close();

            const output =
              getPath === undefined ? response : lodash.get(response, getPath);
            console.log(
              typeof output === "string"
                ? output
                : JSON.stringify(output, undefined, 2)
            );
            break;
        }
      });

      ws.on("error", (error) => {
        console.error(JSON.stringify(error, undefined, 2));
        process.exit(1);
      });
    }
  )
  .parse();

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("base64");
}
