import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, renderSarif } from '../dist/index.js';

const report = {
  schemaVersion: '1',
  generator: { name: 'PatchLens', version: '0.1.0' },
  repository: 'fixture',
  range: 'x',
  stats: { files: 1, additions: 1, deletions: 0, binaryFiles: 0 },
  findings: [{
    id: 'PL001', severity: 'high', title: 'Secret-like value added', message: 'Sensitive value',
    files: ['src/a.ts'], evidence: ['+token=abc'], remediation: 'Remove it.'
  }],
  verdict: 'fail',
  reportHash: 'a'.repeat(64)
};

test('renders markdown and SARIF contracts', () => {
  assert.match(renderMarkdown(report), /PatchLens Review/);
  const sarif = renderSarif(report);
  assert.equal(sarif.version, '2.1.0');
  assert.equal(sarif.runs[0].results[0].ruleId, 'PL001');
});
