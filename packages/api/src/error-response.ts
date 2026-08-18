export interface ApiError{code:string;message:string;requestId?:string;details?:Record<string,unknown>}
export function apiError(code:string,message:string,requestId?:string,details?:Record<string,unknown>):{error:ApiError}{return {error:{code,message,requestId,details}};}
