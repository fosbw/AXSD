const PATTERNS=[/ignore\s+(all|any|previous)\s+instructions/i,/reveal\s+(the\s+)?system\s+prompt/i,/disable\s+(security|policy|approval)/i,/you\s+are\s+(now\s+)?admin/i];
export function detectInstructionInjection(text:string){const matches=PATTERNS.filter(p=>p.test(text)).map(String);return{suspected:matches.length>0,matches};}
