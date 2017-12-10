/// <reference types="express" />
/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
declare module "AuthDelegate" {
    export abstract class AuthDelegate {
        serialize: (user: any) => Promise<any>;
        deserialize: (user: any) => Promise<any>;
        accessFailed: Promise<void>;
    }
}
declare module "Config" {
    export class AuthConfig {
        authRoute: string;
        authCallback: string;
        logoutRoute: string;
        logoutRedirect: string;
        callbackURL: string;
        scope: string[];
        successRedirect: string;
        failureRedirect: string;
        clientID: string;
        clientSecret: string;
        callbackUrl: string;
        whitelist?: Array<String>;
        blacklist?: Array<String>;
    }
}
declare module "GoogleAuth" {
    import { AuthConfig } from "Config";
    import { Express } from 'express';
    import { AuthDelegate } from "AuthDelegate";
    export class OAuth {
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
}
