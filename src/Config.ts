export class AuthConfig{
        authRoute:string;
        authCallback:string;
        logoutRoute:string;
        logoutRedirect:string;
        callbackURL:string;
        scope:string[];
        successRedirect:string;
        failureRedirect:string;
        clientID:string;
        clientSecret:string;
        callbackUrl:string;
        whitelist?:Array<String>;
        blacklist?:Array<String>;
}