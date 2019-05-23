/// <reference types="node" />
import { EventEmitter } from 'events';
import * as http from 'http';
import { ISecurity, IServerOptions, IServices } from './types';
import { WSDL } from './wsdl';
interface IExpressApp {
    route: any;
    use: any;
}
export declare type ServerType = http.Server | IExpressApp;
declare type Request = http.IncomingMessage & {
    body?: any;
};
declare type Response = http.ServerResponse;
export interface Server {
    emit(event: 'request', request: any, methodName: string): boolean;
    emit(event: 'headers', headers: any, methodName: string): boolean;
    /** Emitted for every received messages. */
    on(event: 'request', listener: (request: any, methodName: string) => void): this;
    /** Emitted when the SOAP Headers are not empty. */
    on(event: 'headers', listener: (headers: any, methodName: string) => void): this;
}
export declare class Server extends EventEmitter {
    path: string;
    services: IServices;
    log: (type: string, data: any) => any;
    authorizeConnection: (req: Request, res?: Response) => boolean;
    authenticate: (security: ISecurity, processAuthResult?: any) => boolean;
    private wsdl;
    private suppressStack;
    private returnFault;
    private onewayOptions;
    private enableChunkedEncoding;
    private soapHeaders;
    private callback?;
    constructor(server: ServerType, path: string, services: IServices, wsdl: WSDL, options?: IServerOptions);
    addSoapHeader(soapHeader: any, name?: string, namespace?: any, xmlns?: string): number;
    changeSoapHeader(index: any, soapHeader: any, name?: any, namespace?: any, xmlns?: any): void;
    getSoapHeaders(): string[];
    clearSoapHeaders(): void;
    private _processSoapHeader;
    private _initializeOptions;
    private _processRequestXml;
    private _requestListener;
    private _process;
    private _executeMethod;
    private _envelope;
    private _sendError;
    private _sendHttpResponse;
}
export {};
