import test from "node:test"; import assert from "node:assert/strict";
import { parseUnifiedDiff } from "../dist/index.js";
const diff=`diff --git a/src/app.ts b/src/app.ts\nindex 111..222 100644\n--- a/src/app.ts\n+++ b/src/app.ts\n@@ -1,2 +1,3 @@\n export const x = 1;\n+export const y = 2;\n`;
test("parseUnifiedDiff returns files and added lines",()=>{const p=parseUnifiedDiff(diff);assert.equal(p.files.length,1);assert.equal(p.files[0].path,"src/app.ts");assert.deepEqual(p.files[0].addedLines,["export const y = 2;"]);});
test("parseUnifiedDiff rejects binary patches",()=>assert.throws(()=>parseUnifiedDiff("Binary files a/x and b/x differ"),/binary/i));
