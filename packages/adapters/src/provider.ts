export interface ProviderConnection { id: string; name: string; baseUrl?: string; credentialRef?: string; capabilities: string[]; enabled: boolean; }
export interface ProviderAdapter { readonly providerId: string; validate(connection: ProviderConnection): Promise<boolean>; listModels?(connection: ProviderConnection): Promise<string[]>; }
