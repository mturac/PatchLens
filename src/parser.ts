import { PatchLensError } from "./errors.js"; import { hashCanonical } from "./canonical.js"; import type { ParsedPatch,PatchFile,PatchHunk,PatchLine } from "./types.js";
const header=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;
export function parseUnifiedDiff(input:string):ParsedPatch {
 const text=input.replaceAll("\r\n","\n"); if(/(^|\n)Binary files |GIT binary patch/.test(text))throw new PatchLensError("PL_BINARY","Binary patches are not supported.");
 const lines=text.split("\n"); const files:PatchFile[]=[]; let current:PatchFile|undefined; let hunk:PatchHunk|undefined; let oldLine=0,newLine=0;
 for(let i=0;i<lines.length;i++){const line=lines[i]!;
  if(line.startsWith("diff --git ")){const m=/^diff --git a\/(.+) b\/(.+)$/.exec(line);if(!m)throw new PatchLensError("PL_DIFF","Invalid diff header."); current={path:m[2]!,oldPath:m[1]!,status:"modified",hunks:[],addedLines:[],deletedLines:[],additions:0,deletions:0};files.push(current);hunk=undefined;continue;}
  if(!current)continue;
  if(line.startsWith("new file mode")){current.status="added";continue;} if(line.startsWith("deleted file mode")){current.status="deleted";continue;} if(line.startsWith("rename from ")){current.status="renamed";current.oldPath=line.slice(12);continue;} if(line.startsWith("rename to ")){current.path=line.slice(10);continue;}
  const hm=header.exec(line); if(hm){oldLine=Number(hm[1]);newLine=Number(hm[3]);hunk={header:line,lines:[]};current.hunks.push(hunk);continue;}
  if(!hunk||line.startsWith("+++ ")||line.startsWith("--- ")||line.startsWith("\\ No newline"))continue;
  let patchLine:PatchLine|undefined;
  if(line.startsWith("+")){const content=line.slice(1);patchLine={newLine,content,kind:"add"};newLine++;current.additions++;current.addedLines.push(content);} else if(line.startsWith("-")){const content=line.slice(1);patchLine={oldLine,content,kind:"delete"};oldLine++;current.deletions++;current.deletedLines.push(content);} else if(line.startsWith(" ")){patchLine={oldLine,newLine,content:line.slice(1),kind:"context"};oldLine++;newLine++;}
  if(patchLine)hunk.lines.push(patchLine);
 }
 const additions=files.reduce((n,f)=>n+f.additions,0),deletions=files.reduce((n,f)=>n+f.deletions,0); const core={files,additions,deletions}; return {...core,patchHash:hashCanonical(core)};
}
