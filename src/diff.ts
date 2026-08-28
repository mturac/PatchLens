import type { DiffFile, DiffLine, ParsedDiff } from './types.js';

function cleanPath(value: string): string {
  return value.replace(/^(?:a|b)\//, '').trim();
}

export function parseUnifiedDiff(diff: string): ParsedDiff {
  const files: DiffFile[] = [];
  let current: DiffFile | undefined;
  let oldLine = 0;
  let newLine = 0;

  for (const raw of diff.replace(/\r\n/g, '\n').split('\n')) {
    const header = raw.match(/^diff --git a\/(.+) b\/(.+)$/);
    if (header) {
      current = {
        oldPath: header[1]!,
        path: header[2]!,
        additions: 0,
        deletions: 0,
        binary: false,
        lines: []
      };
      files.push(current);
      continue;
    }

    if (!current) continue;
    if (/^Binary files /.test(raw) || /^GIT binary patch$/.test(raw)) {
      current.binary = true;
      continue;
    }
    if (raw.startsWith('+++ ')) {
      const path = cleanPath(raw.slice(4));
      if (path !== '/dev/null') current.path = path;
      continue;
    }
    if (raw.startsWith('--- ')) {
      const path = cleanPath(raw.slice(4));
      if (path !== '/dev/null') current.oldPath = path;
      continue;
    }

    const hunk = raw.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      continue;
    }

    let line: DiffLine | undefined;
    if (raw.startsWith('+') && !raw.startsWith('+++')) {
      line = { kind: 'add', content: raw.slice(1), newLine };
      current.additions += 1;
      newLine += 1;
    } else if (raw.startsWith('-') && !raw.startsWith('---')) {
      line = { kind: 'delete', content: raw.slice(1), oldLine };
      current.deletions += 1;
      oldLine += 1;
    } else if (raw.startsWith(' ')) {
      line = { kind: 'context', content: raw.slice(1), oldLine, newLine };
      oldLine += 1;
      newLine += 1;
    }

    if (line) current.lines.push(line);
  }

  return {
    files,
    stats: {
      files: files.length,
      additions: files.reduce((sum, file) => sum + file.additions, 0),
      deletions: files.reduce((sum, file) => sum + file.deletions, 0),
      binaryFiles: files.filter(file => file.binary).length
    }
  };
}
