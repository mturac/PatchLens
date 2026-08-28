declare module "node:crypto" { export function createHash(name:string): { update(value:string): any; digest(encoding:"hex"): string }; }
declare module "node:fs/promises" { export function readFile(path:any,encoding?:string):Promise<any>; export function writeFile(path:any,data:any):Promise<void>; export function mkdir(path:any,options?:any):Promise<void>; export function rename(a:any,b:any):Promise<void>; export function mkdtemp(prefix:string):Promise<string>; export function rm(path:any,options?:any):Promise<void>; }
declare module "node:path" { export function resolve(...parts:string[]):string; export function dirname(path:string):string; export function join(...parts:string[]):string; }
declare module "node:child_process" { export function spawnSync(command:string,args?:string[],options?:any): {status:number|null;stdout:string;stderr:string;error?:Error}; }
declare const process:any;
