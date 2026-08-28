import {mkdir,rename,writeFile} from "node:fs/promises";import {dirname} from "node:path";
export async function writeAtomic(path:string,content:string):Promise<void>{await mkdir(dirname(path),{recursive:true});const temp=`${path}.tmp-${process.pid}`;await writeFile(temp,content);await rename(temp,path);}
