export abstract class AuthDelegate{
    public serialize:(user:any)=>Promise<any>
    public deserialize:(user:any)=>Promise<any>
    public accessFailed:(user:any)=>Promise<void>
}