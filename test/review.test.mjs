import test from "node:test"; import assert from "node:assert/strict";
import { reviewDiff, compareReviews, renderReviewMarkdown } from "../dist/index.js";
const diff=`diff --git a/src/app.ts b/src/app.ts\n--- a/src/app.ts\n+++ b/src/app.ts\n@@ -1 +1,2 @@\n old\n+new\ndiff --git a/test/app.test.ts b/test/app.test.ts\n--- a/test/app.test.ts\n+++ b/test/app.test.ts\n@@ -0,0 +1 @@\n+test('x',()=>{});\n`;
test("reviewDiff is deterministic and test-aware",()=>{const a=reviewDiff(diff,{}),b=reviewDiff(diff,{});assert.equal(a.reviewHash,b.reviewHash);assert.ok(!a.findings.some(x=>x.code==="PL202_CODE_WITHOUT_TEST"));assert.match(renderReviewMarkdown(a),/PatchLens Review/);});
test("compareReviews reports new findings",()=>{const a=reviewDiff(diff,{}),b=reviewDiff(diff+`diff --git a/package.json b/package.json\n--- a/package.json\n+++ b/package.json\n@@ -1 +1,2 @@\n {}\n+\"x\":\"1\"\n`,{});const c=compareReviews(a,b);assert.equal(c.changed,true);assert.ok(c.addedFindings.length>0);});
