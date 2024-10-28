#!/usr/bin/env node
import 'zx/globals';
import { program } from 'commander';
import { type ErrorGroup, groupErrors } from './utils';
import { name, description, version } from '../package.json';

/**
 * Ensure that the current behavior is purely comment lines
 */
const commentLineReg = [
  /** // @ts-expect-error → Starts with // and possible spaces */
  /^\s*\/\//,
  /** {/* @ts-expect-error → Starts with {/ and possible spaces */
  /^\s*\{\s*\/\*.*\*\/\s*}/,
];

program
  .name(name)
  .description(description)
  .version(version)
  .argument('<path>', 'Path to the ts compile log.')
  .action((input) => {
    try {
      const errorGroup = groupErrors(fs.readFileSync(input, 'utf8'));
      const unhandled: ErrorGroup = {};

      for (const [filePath, errors] of Object.entries(errorGroup)) {
        const fileLines = fs.readFileSync(filePath, 'utf8').split('\n');

        for (const error of errors
          // error TS2578 Unused @ts-expect-error directive
          .filter((v) => v.type === 'TS2578')
          // Sort in descending order so that changes made earlier do not affect the later
          .toSorted((a, b) => b.line - a.line)) {
          const lineIndex = error.line - 1;
          if (commentLineReg.some((v) => v.test(fileLines[lineIndex]))) {
            fileLines.splice(lineIndex, 1);
            console.log(
              `${chalk.blue('Removed line')}: ${filePath}:${error.line}`,
            );
          } else {
            unhandled[filePath] = [...(unhandled[filePath] ?? []), error];
          }
        }
        fs.writeFileSync(filePath, fileLines.join('\n'));
      }

      const arr: string[] = [];

      for (const [filePath, errors] of Object.entries(unhandled)) {
        arr.push(
          ...errors.map(
            (v) => `${filePath}:${v.line} ${chalk.red(v.type)} ${v.message} `,
          ),
        );
      }

      if (arr.length) {
        console.log(
          '\n',
          arr.join('\n'),
          chalk.blue.bold(
            '\n\nThese lines are not a pure comment line, please manually remove it.',
          ),
        );
      }
    } catch (e: any) {
      console.log(e.message);
    }
  });

program.parse();
