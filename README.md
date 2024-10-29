# commover

[![npm version](https://img.shields.io/npm/v/commover)](https://npmjs.com/package/commover)
![weekly downloads](https://img.shields.io/npm/dw/commover)
![license](https://img.shields.io/npm/l/commover)
![stars](https://img.shields.io/github/stars/emosheeep/commover)

Batch remove unused `@ts-expect-error` directive comment lines, especially helpful when using with [**ts-migrate**](https://github.com/airbnb/ts-migrate).

> What does `commover` mean? It's a composite word that represents _**com**ment re**mover**_ ahahaha :)

# Motivation

**ts-migrate** is such an useful tool that helps us fix historical TS errors incrementally in our projects. But sometimes it's not perfect as well for some reason. There're lots of unused `@ts-expect-error` directive added to the code, which causes TS compile errors.

> error TS2578: Unused '@ts-expect-error' directive


This project is designed for this, which will read your compile log, parse and remove the corresponding lines.

# Usage

Global install the tool with `pnpm` first.


```shell
pnpm install -g commover # or npm/yarn
```

Compile ts, output a log file, and then call `commover` command with the file.

```shell
tsc --noEmit > tsc.log # or tsc -b, output compile log to `tsc.log`
commover tsc.log # will read `tsc.log` and handle parsed errors as need
```
Then you'll get these logs

```
Removed line: src/tests/demo.ts:3
Removed line: src/index.ts:3
...
```

# Options


```txt
> commover -h     
Usage: commover [options] <path>

Batch remove unused @ts-expect-error comments, especially helpful when using with ts-migrate.

Arguments:
  path           Path to the ts compile log.

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

# License

[MIT](./LICENSE) License © 2024 [秦旭洋](https://github.com/emosheeep)