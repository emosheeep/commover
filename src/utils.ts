import 'zx/globals';

export type ErrorGroup = Record<string, Array<TypeError>>;
export interface TypeError {
  type: string;
  message: string;
  line: number;
  col: number;
}

export function groupErrors(logText: string) {
  return logText.split('\n').reduce<ErrorGroup>((res, text) => {
    const [, errorType] = text.match(/(TS\d+)/) || [];
    if (errorType) {
      const [relPath, message] = text.split(
        new RegExp(`:\\s+error ${errorType}:\\s+`),
      );
      const index = relPath.lastIndexOf('(');
      const filePath = relPath.slice(0, index);

      try {
        const [line, col] = relPath
          .slice(index)
          .split(',')
          .map((v) => Number.parseInt(v.match(/\w+/)![0]));

        res[filePath] = [
          ...(res[filePath] ?? []),
          { type: errorType, message, line, col },
        ];
      } catch (e) {
        console.log(e);
      }
    }

    return res;
  }, {});
}
