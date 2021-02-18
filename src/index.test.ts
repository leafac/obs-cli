import { test, expect } from "@jest/globals";
import shell from "shelljs";

const help = shell.exec("npx ts-node src/index.ts --help", { silent: true })
  .stdout;

const examples = help.split("Examples:")[1].trim();

const examplesChunks = examples.split("\n\n");

while (examplesChunks.length > 0) {
  const description = examplesChunks.shift()!.trim().slice(0, -1);
  const consoleChunk = examplesChunks.shift()!.trim();
  const [commandLine, ...expectedOutputLines] = consoleChunk.split("\n");
  const commandArguments = commandLine.replace("$ obs-cli ", "").trim();
  const expectedOutput = expectedOutputLines
    .map((line) => line.replace(/^\s{4}/, ""))
    .join("\n")
    .trim();
  test(description, () => {
    const shellReturnValue = shell.exec(
      `npx ts-node src/index.ts ${commandArguments}`,
      {
        silent: true,
      }
    );
    expect((shellReturnValue.stdout + shellReturnValue.stderr).trim()).toMatch(
      expectedOutput
    );
  });
}
