import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, resolve } from 'node:path';
import { PatchLensError } from './errors.js';

const execFileAsync = promisify(execFile);

export async function collectGitDiff(repo: string, range: string): Promise<{ diff: string; repository: string }> {
  const root = resolve(repo);
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['-C', root, 'diff', '--no-ext-diff', '--find-renames', '--unified=3', range, '--'],
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    );
    return { diff: stdout, repository: basename(root) };
  } catch (error) {
    throw new PatchLensError('GIT_DIFF_FAILED', `Unable to collect git diff for ${range}.`, {
      cause: error instanceof Error ? error.message : String(error)
    });
  }
}
