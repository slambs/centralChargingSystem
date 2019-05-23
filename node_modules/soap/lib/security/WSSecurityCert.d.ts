import { ISecurity } from '../types';
export interface IWSSecurityCertOptions {
    hasTimeStamp?: boolean;
    signatureTransformations?: string[];
    signatureAlgorithm?: string;
}
export declare class WSSecurityCert implements ISecurity {
    private publicP12PEM;
    private signer;
    private x509Id;
    private hasTimeStamp;
    private signatureTransformations;
    private created;
    private expires;
    constructor(privatePEM: any, publicP12PEM: any, password: any, options?: IWSSecurityCertOptions);
    postProcess(xml: any, envelopeKey: any): string;
}
