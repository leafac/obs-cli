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
- [Node.js](https://nodejs.org/)

In macOS you may use [Homebrew](https://brew.sh) to install the requirements:

```console
$ brew cask install obs obs-websocket && brew install node
```

### Installation

You may use obs-cli without having to explicitly install it by relying on [`npx`](https://github.com/npm/npx), for example:

```console
$ npx obs-cli StartRecording
```

Or you may wish to install obs-cli on your machine to avoid the `npx` prefix:

```console
$ npm install --global obs-cli
```

Now you may simply run, for example:

```console
$ npx obs-cli StartRecording
```

Finally, you may wish to install obs-cli on a project:

```console
$ npm install obs-cli
```

### Usage

```
Usage: obs-cli [options] <request-name> [request-arguments]

Remote control OBS from the command line.

Arguments:
  request-name               for example, ‘SetRecordingFolder’; see
                             https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md for the
                             complete list
  request-arguments          for example, ‘{ "rec-folder": "/tmp/" }’

Options:
  -V, --version              output the version number
  -a, --address <address>    the address configured in OBS under Tools > WebSockets Server Settings (default: "localhost:4444")
  -p, --password <password>  for example, ‘$up3rSecretP@ssw0rd’
  -h, --help                 display help for command
```

For example:

```console
$ npx obs-cli SetRecordingFolder '{ "rec-folder": "/Users/leafac/Videos" }'
{ 'message-id': '1', status: 'ok', messageId: '1' }

$ npx obs-cli GetRecordingFolder
{
  "message-id": "1",
  "rec-folder": "/Users/leafac/Videos",
  "status": "ok",
  "messageId": "1",
  "recFolder": "/Users/leafac/Videos"
}
```

obs-cli is a thin wrapper around [obs-websocket-js](https://github.com/haganbmj/obs-websocket-js), which in turn is a wrapper around [obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/). Read the documentations for those projects to learn more about what you can do with obs-cli. In particular, [here’s the list of possible requests](https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md).
