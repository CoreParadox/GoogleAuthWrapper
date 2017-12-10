declare module 'google-auth-wrapper'{
	
		abstract class AuthDelegate {
			serialize: (user: any) => Promise<any>;
			deserialize: (user: any) => Promise<any>;
			accessFailed: Promise<void>;
		}
		abstract class AuthConfig {
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
	
	
		/// <reference types="express" />
		/// <reference types="express-serve-static-core" />
		/// <reference types="passport" />
	
		import { Express } from 'express';
	
		export class GoogleAuth {
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