function escape(value:string):string{return value.replace(/[.+^${}()|[\]\\]/g,"\\$&");}
function regex(pattern:string):RegExp { const normalized=pattern.replaceAll("\\","/"); let out=""; for(let i=0;i<normalized.length;i++){const c=normalized[i]!;if(c==="*"){if(normalized[i+1]==="*"){out+=".*";i++;}else out+="[^/]*";}else if(c==="?")out+="[^/]";else out+=escape(c);}return new RegExp(`^${out}$`); }
export function matches(path:string,patterns:string[]|undefined):boolean{return Boolean(patterns?.some(p=>regex(p).test(path)));}
