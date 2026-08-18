export function printJson(value:unknown){process.stdout.write(JSON.stringify(value,null,2)+'\n');}
export function printError(code:string,message:string){process.stderr.write(`${code}: ${message}\n`);}
