declare module 'node-rest-client' {
    export class Client {
        constructor();
        get(uri: string, args: {}, callback: (data: any, response: any) => void);
    }
}