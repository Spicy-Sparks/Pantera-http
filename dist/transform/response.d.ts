import { PanteraConfig } from '../types';
export declare const transformResponse: <T>(config: PanteraConfig, response: Response) => Promise<T | undefined>;
