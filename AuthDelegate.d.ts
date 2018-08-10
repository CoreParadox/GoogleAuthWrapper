export declare abstract class AuthDelegate {
    serialize: (user: any) => Promise<any>;
    deserialize: (user: any) => Promise<any>;
    accessFailed: Promise<void>;
}
