export type Severity = "low" | "medium" | "high";
export interface PatchLine { oldLine?: number; newLine?: number; content:string; kind:"add"|"delete"|"context"; }
export interface PatchHunk { header:string; lines:PatchLine[]; }
export interface PatchFile { path:string; oldPath:string; status:"added"|"modified"|"deleted"|"renamed"; hunks:PatchHunk[]; addedLines:string[]; deletedLines:string[]; additions:number; deletions:number; }
export interface ParsedPatch { files:PatchFile[]; additions:number; deletions:number; patchHash:string; }
export interface ReviewOptions { allowedPaths?:string[]; maxChangedFiles?:number; maxChangedLines?:number; }
export interface Finding { code:"PL201_SECRET_ADDITION"|"PL202_CODE_WITHOUT_TEST"|"PL203_SCOPE_ESCAPE"|"PL204_SCHEMA_WITHOUT_MIGRATION"|"PL205_DEPENDENCY_CHANGE"|"PL206_GENERATED_EDIT"|"PL207_OVERSIZED_PATCH"; severity:Severity; title:string; path?:string; evidence:string; }
export interface PatchLensReview { schemaVersion:"1"; createdAt:string; patch:{hash:string;files:number;additions:number;deletions:number}; findings:Finding[]; summary:{high:number;medium:number;low:number;verdict:"pass"|"review"|"block"}; reviewHash:string; }
export interface ReviewComparison { changed:boolean; beforeHash:string; afterHash:string; addedFindings:string[]; removedFindings:string[]; severityDelta:{high:number;medium:number;low:number}; }
