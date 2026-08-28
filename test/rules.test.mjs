import test from "node:test"; import assert from "node:assert/strict";
import { reviewDiff } from "../dist/index.js";
const mk=(path,line)=>`diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n@@ -0,0 +1 @@\n+${line}\n`;
test("reviewDiff redacts added secrets",()=>{const r=reviewDiff(mk("src/config.ts","const token = 'sk-abcdefghijklmnopqrstuvwxyz123456';"),{});const f=r.findings.find(x=>x.code==="PL201_SECRET_ADDITION");assert.ok(f);assert.ok(!JSON.stringify(f).includes("abcdefghijklmnopqrstuvwxyz"));});
test("reviewDiff flags code changes without tests",()=>{const r=reviewDiff(mk("src/app.ts","export const x=1;"),{});assert.ok(r.findings.some(x=>x.code==="PL202_CODE_WITHOUT_TEST"));});
test("reviewDiff respects allowed scope",()=>{const r=reviewDiff(mk("infra/prod.tf","resource x {}"),{allowedPaths:["src/**"]});assert.ok(r.findings.some(x=>x.code==="PL203_SCOPE_ESCAPE"));});
test("reviewDiff flags schema changes without migration",()=>{const r=reviewDiff(mk("schema/user.sql","ALTER TABLE users ADD COLUMN plan text;"),{});assert.ok(r.findings.some(x=>x.code==="PL204_SCHEMA_WITHOUT_MIGRATION"));});
test("reviewDiff flags dependency drift",()=>{const r=reviewDiff(mk("package.json",'"left-pad": "1.3.0"'),{});assert.ok(r.findings.some(x=>x.code==="PL205_DEPENDENCY_CHANGE"));});
test("reviewDiff flags generated-file edits",()=>{const r=reviewDiff(mk("src/generated/client.ts","export const x=1"),{});assert.ok(r.findings.some(x=>x.code==="PL206_GENERATED_EDIT"));});
