/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
import { AuthConfig } from './Config';
import { Express } from 'express';
import { AuthDelegate } from './AuthDelegate';
export declare class GoogleAuth {
    app: Express;
    config: AuthConfig;
    delegate: AuthDelegate;
    constructor(app: Express, config: AuthConfig, delegate: AuthDelegate);
    isAuthenticated(req: Express.Request & {
        isAuthenticated: () => boolean;
    }, res: Express.Response): boolean;
    ensureAuthenticated(req: Express.Request & {
        isAuthenticated: () => boolean;
    }, res: Express.Response & {
        sendStatus: (code: number) => any;
    }, next: () => any): any;
}
