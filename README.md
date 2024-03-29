
- [ ] Binary releases:
    - [ ] Have both a tarball and a plain executable
    - [ ] The tarball is good because it keeps the mode of the file (executable, +x)
    - [ ] The plain executables are good because of my REAPER actions (ReaPack can’t uncompress)
- [ ] Use deno?
- [ ] Use obs-websocket-js again?
- Marco Scalet

<h1 align="center">obs-cli</h1>
<h3 align="center">Remote control OBS from the command line</h3>
<p align="center">
<a href="https://github.com/leafac/obs-cli"><img alt="Source" src="https://img.shields.io/badge/Source---"></a>
<a href="https://www.npmjs.com/package/obs-cli"><img alt="Package" src="https://badge.fury.io/js/obs-cli.svg"></a>
<a href="https://github.com/leafac/obs-cli/actions"><img alt="Continuous Integration" src="https://github.com/leafac/obs-cli/workflows/.github/workflows/main.yml/badge.svg"></a>
</p>

### Requirements

- [OBS](https://obsproject.com)
- [obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/)

In macOS you may install the requirements with [Homebrew](https://brew.sh):

```console
$ brew install obs obs-websocket
```

### Installation

#### Option 1: Download the Executable

<https://github.com/leafac/obs-cli/releases/latest>

#### Option 2: Use [`npm`](https://www.npmjs.com)

For this option you must have [Node.js](https://nodejs.org/) installed. In macOS you may install it with [Homebrew](https://brew.sh):

```console
$ brew install node
```

You may install obs-cli implicitly on first use by relying on `npx`, which comes with Node.js, for example:

```console
$ npx obs-cli StartRecording
```

Or you may wish to avoid the `npx` prefix with an explicit global installation of obs-cli through `npm`, which also comes with Node.js:

```console
$ npm install --global obs-cli
```

Now you may simply run, for example:

```console
$ obs-cli StartRecording
```

Finally, you may wish to install obs-cli on a project managed by `npm`:

```console
$ npm install obs-cli
```

### Usage

```
Usage: obs-cli [options] <request[=arguments]...>

Remote control OBS from the command line.

Arguments:
  request[=arguments]        a request name (for example, ‘GetRecordingFolder’), optionally followed by arguments (for example, ‘SetRecordingFolder='{ "rec-folder":
                             "/tmp/" }'’) (see https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md for the complete list of requests
                             and their arguments)

Options:
  -a, --address <address>    the address to the machine in which OBS is running and the port configured in OBS under Tools > WebSockets Server Settings (default:
                             "localhost:4444")
  -p, --password <password>  the password configured in OBS under Tools > WebSockets Server Settings
  -f, --field <field>        project a field out of the OBS response, for example, given an OBS response of ‘[{ ..., "streaming": false, ...}]’ and a <field> of
                             ‘0.streaming’, obs-cli outputs just ‘false’; this is a convenience for applications that need only one part of the response
  -V, --version              output the version number
  -h, --help                 display help for command
```

For example:

```console
$ npx obs-cli GetRecordingFolder
[
  {
    "message-id": "1",
    "rec-folder": "/Users/leafac/Videos",
    "status": "ok",
    "messageId": "1",
    "recFolder": "/Users/leafac/Videos"
  }
]

$ npx obs-cli --field 0.rec-folder GetRecordingFolder
/Users/leafac/Videos

$ npx obs-cli SetRecordingFolder='{ "rec-folder": "/tmp/" }'
[
  {
    "message-id": "1",
    "status": "ok",
    "messageId": "1"
  }
]

$ npx obs-cli GetRecordingFolder SetRecordingFolder='{ "rec-folder": "/Users/leafac/Videos" }' GetRecordingFolder
[
  {
    "message-id": "1",
    "rec-folder": "/tmp/",
    "status": "ok",
    "messageId": "1",
    "recFolder": "/tmp/"
  },
  {
    "message-id": "2",
    "status": "ok",
    "messageId": "2"
  },
  {
    "message-id": "3",
    "rec-folder": "/Users/leafac/Videos",
    "status": "ok",
    "messageId": "3",
    "recFolder": "/Users/leafac/Videos"
  }
]
```

obs-cli is a thin wrapper around [obs-websocket-js](https://github.com/haganbmj/obs-websocket-js), which in turn is a wrapper around [obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/). Read the documentations for those projects to learn more about what you can do with obs-cli. In particular, [here’s the list of possible requests](https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md).

obs-cli is similar in spirit (and equal in name) to [this other project](https://github.com/muesli/obs-cli). The main differences are: 1. It’s written in Node.js instead of Go; and 2. It [supports authentication](https://github.com/muesli/obs-cli/issues/2) and everything else that obs-websocket provides, while that other project, judging by its documentation, seems to support only a few kinds of requests.
