import type { ResourceAdapter } from './contracts.js';
export interface McpAdapter extends ResourceAdapter { readonly resourceType: 'mcp'; readonly protocol: 'mcp'; }
export interface McpServerDescriptor { name: string; endpoint: string; transport: 'stdio' | 'sse' | 'streamable-http'; }
