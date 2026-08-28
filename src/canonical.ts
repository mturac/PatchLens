import { createHash } from "node:crypto";
function normalize(value:unknown):unknown { if(Array.isArray(value))return value.map(normalize); if(value&&typeof value==="object"){const out:Record<string,unknown>={};for(const key of Object.keys(value as Record<string,unknown>).sort())out[key]=normalize((value as Record<string,unknown>)[key]);return out;} return value; }
export function canonicalStringify(value:unknown):string{return JSON.stringify(normalize(value));}
export function sha256(value:string):string{return createHash("sha256").update(value).digest("hex");}
export function hashCanonical(value:unknown):string{return `sha256:${sha256(canonicalStringify(value))}`;}
