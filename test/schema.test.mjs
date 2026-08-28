import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('report schema is strict and versioned', async () => {
  const schema = JSON.parse(await readFile(new URL('../schema/patchlens-report.schema.json', import.meta.url), 'utf8'));
  assert.equal(schema.$id, 'https://github.com/mturac/PatchLens/schema/patchlens-report.schema.json');
  assert.equal(schema.additionalProperties, false);
  assert.ok(schema.required.includes('reportHash'));
});
