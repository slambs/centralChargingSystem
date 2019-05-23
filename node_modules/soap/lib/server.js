"use strict";
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var url = require("url");
var utils_1 = require("./utils");
var zlib;
try {
    zlib = require('zlib');
}
catch (error) {
}
function isExpress(server) {
    return (typeof server.route === 'function' && typeof server.use === 'function');
}
function isPromiseLike(obj) {
    return (!!obj && typeof obj.then === 'function');
}
function getDateString(d) {
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }
    return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + 'T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z';
}
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(server, path, services, wsdl, options) {
        var _this_1 = _super.call(this) || this;
        options = options || {
            path: path,
            services: services
        };
        _this_1.path = path;
        _this_1.services = services;
        _this_1.wsdl = wsdl;
        _this_1.suppressStack = options && options.suppressStack;
        _this_1.returnFault = options && options.returnFault;
        _this_1.onewayOptions = options && options.oneWay || {};
        _this_1.enableChunkedEncoding =
            options.enableChunkedEncoding === undefined ? true : !!options.enableChunkedEncoding;
        _this_1.callback = options.callback ? options.callback : function () { };
        if (path[path.length - 1] !== '/') {
            path += '/';
        }
        wsdl.onReady(function (err) {
            if (isExpress(server)) {
                // handle only the required URL path for express server
                server.route(path).all(function (req, res) {
                    if (typeof _this_1.authorizeConnection === 'function') {
                        if (!_this_1.authorizeConnection(req, res)) {
                            res.end();
                            return;
                        }
                    }
                    _this_1._requestListener(req, res);
                });
                _this_1.callback(err, _this_1);
            }
            else {
                var listeners_1 = server.listeners('request').slice();
                server.removeAllListeners('request');
                server.addListener('request', function (req, res) {
                    if (typeof _this_1.authorizeConnection === 'function') {
                        if (!_this_1.authorizeConnection(req, res)) {
                            res.end();
                            return;
                        }
                    }
                    var reqPath = url.parse(req.url).pathname;
                    if (reqPath[reqPath.length - 1] !== '/') {
                        reqPath += '/';
                    }
                    if (path === reqPath) {
                        _this_1._requestListener(req, res);
                    }
                    else {
                        for (var i = 0, len = listeners_1.length; i < len; i++) {
                            listeners_1[i].call(_this_1, req, res);
                        }
                    }
                });
                _this_1.callback(err, _this_1);
            }
        });
        _this_1._initializeOptions(options);
        return _this_1;
    }
    Server.prototype.addSoapHeader = function (soapHeader, name, namespace, xmlns) {
        if (!this.soapHeaders) {
            this.soapHeaders = [];
        }
        soapHeader = this._processSoapHeader(soapHeader, name, namespace, xmlns);
        return this.soapHeaders.push(soapHeader) - 1;
    };
    Server.prototype.changeSoapHeader = function (index, soapHeader, name, namespace, xmlns) {
        if (!this.soapHeaders) {
            this.soapHeaders = [];
        }
        soapHeader = this._processSoapHeader(soapHeader, name, namespace, xmlns);
        this.soapHeaders[index] = soapHeader;
    };
    Server.prototype.getSoapHeaders = function () {
        return this.soapHeaders;
    };
    Server.prototype.clearSoapHeaders = function () {
        this.soapHeaders = null;
    };
    Server.prototype._processSoapHeader = function (soapHeader, name, namespace, xmlns) {
        switch (typeof soapHeader) {
            case 'object':
                return this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
            case 'function':
                var _this_2 = this;
                // arrow function does not support arguments variable
                // tslint:disable-next-line
                return function () {
                    var result = soapHeader.apply(null, arguments);
                    if (typeof result === 'object') {
                        return _this_2.wsdl.objectToXML(result, name, namespace, xmlns, true);
                    }
                    else {
                        return result;
                    }
                };
            default:
                return soapHeader;
        }
    };
    Server.prototype._initializeOptions = function (options) {
        this.wsdl.options.attributesKey = options.attributesKey || 'attributes';
        this.onewayOptions.statusCode = this.onewayOptions.responseCode || 200;
        this.onewayOptions.emptyBody = !!this.onewayOptions.emptyBody;
    };
    Server.prototype._processRequestXml = function (req, res, xml) {
        var _this_1 = this;
        var error;
        try {
            if (typeof this.log === 'function') {
                this.log('received', xml);
            }
            this._process(xml, req, function (result, statusCode) {
                _this_1._sendHttpResponse(res, statusCode, result);
                if (typeof _this_1.log === 'function') {
                    _this_1.log('replied', result);
                }
            });
        }
        catch (err) {
            if (err.Fault !== undefined) {
                return this._sendError(err.Fault, function (result, statusCode) {
                    _this_1._sendHttpResponse(res, statusCode || 500, result);
                    if (typeof _this_1.log === 'function') {
                        _this_1.log('error', err);
                    }
                }, new Date().toISOString());
            }
            else {
                error = err.stack ? (this.suppressStack === true ? err.message : err.stack) : err;
                this._sendHttpResponse(res, /* statusCode */ 500, error);
                if (typeof this.log === 'function') {
                    this.log('error', error);
                }
            }
        }
    };
    Server.prototype._requestListener = function (req, res) {
        var _this_1 = this;
        var reqParse = url.parse(req.url);
        var reqPath = reqParse.pathname;
        var reqQuery = reqParse.search;
        if (typeof this.log === 'function') {
            this.log('info', 'Handling ' + req.method + ' on ' + req.url);
        }
        if (req.method === 'GET') {
            if (reqQuery && reqQuery.toLowerCase() === '?wsdl') {
                if (typeof this.log === 'function') {
                    this.log('info', 'Wants the WSDL');
                }
                res.setHeader('Content-Type', 'application/xml');
                res.write(this.wsdl.toXML());
            }
            res.end();
        }
        else if (req.method === 'POST') {
            if (typeof req.headers['content-type'] !== 'undefined') {
                res.setHeader('Content-Type', req.headers['content-type']);
            }
            else {
                res.setHeader('Content-Type', 'application/xml');
            }
            // request body is already provided by an express middleware
            // in this case unzipping should also be done by the express middleware itself
            if (req.body && Object.keys(req.body).length > 0) {
                return this._processRequestXml(req, res, req.body.toString());
            }
            var chunks_1 = [];
            var gunzip = void 0;
            var source = req;
            if (req.headers['content-encoding'] === 'gzip') {
                gunzip = zlib.createGunzip();
                req.pipe(gunzip);
                source = gunzip;
            }
            source.on('data', function (chunk) {
                chunks_1.push(chunk);
            });
            source.on('end', function () {
                var xml = Buffer.concat(chunks_1).toString();
                _this_1._processRequestXml(req, res, xml);
            });
        }
        else {
            res.end();
        }
    };
    Server.prototype._process = function (input, req, callback) {
        var _this_1 = this;
        var pathname = url.parse(req.url).pathname.replace(/\/$/, '');
        var obj = this.wsdl.xmlToObject(input);
        var body = obj.Body;
        var headers = obj.Header;
        var binding;
        var methodName;
        var serviceName;
        var portName;
        var includeTimestamp = obj.Header && obj.Header.Security && obj.Header.Security.Timestamp;
        var authenticate = this.authenticate || function defaultAuthenticate() { return true; };
        var process = function () {
            if (typeof _this_1.log === 'function') {
                _this_1.log('info', 'Attempting to bind to ' + pathname);
            }
            // Avoid Cannot convert undefined or null to object due to Object.keys(body)
            // and throw more meaningful error
            if (!body) {
                throw new Error('Failed to parse the SOAP Message body');
            }
            // use port.location and current url to find the right binding
            binding = (function () {
                var services = _this_1.wsdl.definitions.services;
                var firstPort;
                var name;
                for (name in services) {
                    serviceName = name;
                    var service = services[serviceName];
                    var ports = service.ports;
                    for (name in ports) {
                        portName = name;
                        var port = ports[portName];
                        var portPathname = url.parse(port.location).pathname.replace(/\/$/, '');
                        if (typeof _this_1.log === 'function') {
                            _this_1.log('info', 'Trying ' + portName + ' from path ' + portPathname);
                        }
                        if (portPathname === pathname) {
                            return port.binding;
                        }
                        // The port path is almost always wrong for generated WSDLs
                        if (!firstPort) {
                            firstPort = port;
                        }
                    }
                }
                return !firstPort ? void 0 : firstPort.binding;
            })();
            if (!binding) {
                throw new Error('Failed to bind to WSDL');
            }
            try {
                if (binding.style === 'rpc') {
                    methodName = Object.keys(body)[0];
                    _this_1.emit('request', obj, methodName);
                    if (headers) {
                        _this_1.emit('headers', headers, methodName);
                    }
                    _this_1._executeMethod({
                        serviceName: serviceName,
                        portName: portName,
                        methodName: methodName,
                        outputName: methodName + 'Response',
                        args: body[methodName],
                        headers: headers,
                        style: 'rpc'
                    }, req, callback);
                }
                else {
                    var messageElemName = (Object.keys(body)[0] === 'attributes' ? Object.keys(body)[1] : Object.keys(body)[0]);
                    var pair = binding.topElements[messageElemName];
                    _this_1.emit('request', obj, pair.methodName);
                    if (headers) {
                        _this_1.emit('headers', headers, pair.methodName);
                    }
                    _this_1._executeMethod({
                        serviceName: serviceName,
                        portName: portName,
                        methodName: pair.methodName,
                        outputName: pair.outputName,
                        args: body[messageElemName],
                        headers: headers,
                        style: 'document'
                    }, req, callback, includeTimestamp);
                }
            }
            catch (error) {
                if (error.Fault !== undefined) {
                    return _this_1._sendError(error.Fault, callback, includeTimestamp);
                }
                throw error;
            }
        };
        // Authentication
        if (typeof authenticate === 'function') {
            var authResultProcessed_1 = false;
            var processAuthResult = function (authResult) {
                if (!authResultProcessed_1 && (authResult || authResult === false)) {
                    authResultProcessed_1 = true;
                    if (authResult) {
                        try {
                            process();
                        }
                        catch (error) {
                            if (error.Fault !== undefined) {
                                return _this_1._sendError(error.Fault, callback, includeTimestamp);
                            }
                            return _this_1._sendError({
                                Code: {
                                    Value: 'SOAP-ENV:Server',
                                    Subcode: { value: 'InternalServerError' }
                                },
                                Reason: { Text: error.toString() },
                                statusCode: 500
                            }, callback, includeTimestamp);
                        }
                    }
                    else {
                        return _this_1._sendError({
                            Code: {
                                Value: 'SOAP-ENV:Client',
                                Subcode: { value: 'AuthenticationFailure' }
                            },
                            Reason: { Text: 'Invalid username or password' },
                            statusCode: 401
                        }, callback, includeTimestamp);
                    }
                }
            };
            processAuthResult(authenticate(obj.Header && obj.Header.Security, processAuthResult));
        }
        else {
            throw new Error('Invalid authenticate function (not a function)');
        }
    };
    Server.prototype._executeMethod = function (options, req, callback, includeTimestamp) {
        var _this_1 = this;
        options = options || {};
        var method;
        var body;
        var headers;
        var serviceName = options.serviceName;
        var portName = options.portName;
        var methodName = options.methodName;
        var outputName = options.outputName;
        var args = options.args;
        var style = options.style;
        if (this.soapHeaders) {
            headers = this.soapHeaders.map(function (header) {
                if (typeof header === 'function') {
                    return header(methodName, args, options.headers, req);
                }
                else {
                    return header;
                }
            }).join('\n');
        }
        try {
            method = this.services[serviceName][portName][methodName];
        }
        catch (error) {
            return callback(this._envelope('', headers, includeTimestamp));
        }
        var handled = false;
        var handleResult = function (error, result) {
            if (handled) {
                return;
            }
            handled = true;
            if (error) {
                if (error.Fault !== undefined) {
                    return _this_1._sendError(error.Fault, callback, includeTimestamp);
                }
                else {
                    return _this_1._sendError({
                        Code: {
                            Value: 'SOAP-ENV:Server',
                            Subcode: { value: 'InternalServerError' }
                        },
                        Reason: { Text: error.toString() },
                        statusCode: 500
                    }, callback, includeTimestamp);
                }
            }
            if (style === 'rpc') {
                body = _this_1.wsdl.objectToRpcXML(outputName, result, '', _this_1.wsdl.definitions.$targetNamespace);
            }
            else {
                var element = _this_1.wsdl.definitions.services[serviceName].ports[portName].binding.methods[methodName].output;
                body = _this_1.wsdl.objectToDocumentXML(outputName, result, element.targetNSAlias, element.targetNamespace);
            }
            callback(_this_1._envelope(body, headers, includeTimestamp));
        };
        if (!this.wsdl.definitions.services[serviceName].ports[portName].binding.methods[methodName].output) {
            // no output defined = one-way operation so return empty response
            handled = true;
            body = '';
            if (this.onewayOptions.emptyBody) {
                body = this._envelope('', headers, includeTimestamp);
            }
            callback(body, this.onewayOptions.responseCode);
        }
        var methodCallback = function (error, result) {
            if (error && error.Fault !== undefined) {
                // do nothing
            }
            else if (result === undefined) {
                // Backward compatibility to support one argument callback style
                result = error;
                error = null;
            }
            handleResult(error, result);
        };
        var result = method(args, methodCallback, options.headers, req);
        if (typeof result !== 'undefined') {
            if (isPromiseLike(result)) {
                result.then(function (value) {
                    handleResult(null, value);
                }, function (err) {
                    handleResult(err);
                });
            }
            else {
                handleResult(null, result);
            }
        }
    };
    Server.prototype._envelope = function (body, headers, includeTimestamp) {
        var defs = this.wsdl.definitions;
        var ns = defs.$targetNamespace;
        var encoding = '';
        var alias = utils_1.findPrefix(defs.xmlns, ns);
        var envelopeDefinition = this.wsdl.options.forceSoap12Headers
            ? 'http://www.w3.org/2003/05/soap-envelope'
            : 'http://schemas.xmlsoap.org/soap/envelope/';
        var xml = '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap:Envelope xmlns:soap="' + envelopeDefinition + '" ' +
            encoding +
            this.wsdl.xmlnsInEnvelope + '>';
        headers = headers || '';
        if (includeTimestamp) {
            var now = new Date();
            var created = getDateString(now);
            var expires = getDateString(new Date(now.getTime() + (1000 * 600)));
            headers += '<o:Security soap:mustUnderstand="1" ' +
                'xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" ' +
                'xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '    <u:Timestamp u:Id="_0">' +
                '      <u:Created>' + created + '</u:Created>' +
                '      <u:Expires>' + expires + '</u:Expires>' +
                '    </u:Timestamp>' +
                '  </o:Security>\n';
        }
        if (headers !== '') {
            xml += '<soap:Header>' + headers + '</soap:Header>';
        }
        xml += body ? '<soap:Body>' + body + '</soap:Body>' : '<soap:Body/>';
        xml += '</soap:Envelope>';
        return xml;
    };
    Server.prototype._sendError = function (soapFault, callback, includeTimestamp) {
        var fault;
        var statusCode;
        if (soapFault.statusCode) {
            statusCode = soapFault.statusCode;
            soapFault.statusCode = undefined;
        }
        if ('faultcode' in soapFault) {
            // Soap 1.1 error style
            // Root element will be prependend with the soap NS
            // It must match the NS defined in the Envelope (set by the _envelope method)
            fault = this.wsdl.objectToDocumentXML('soap:Fault', soapFault, undefined);
        }
        else {
            // Soap 1.2 error style.
            // 3rd param is the NS prepended to all elements
            // It must match the NS defined in the Envelope (set by the _envelope method)
            fault = this.wsdl.objectToDocumentXML('Fault', soapFault, 'soap');
        }
        return callback(this._envelope(fault, '', includeTimestamp), statusCode);
    };
    Server.prototype._sendHttpResponse = function (res, statusCode, result) {
        if (statusCode) {
            res.statusCode = statusCode;
        }
        /*
        * Calling res.write(result) follow by res.end() will cause Node.js to use
        * chunked encoding, while calling res.end(result) directly will cause
        * Node.js to calculate and send Content-Length header. See
        * nodejs/node#26005.
        */
        if (this.enableChunkedEncoding) {
            res.write(result);
            res.end();
        }
        else {
            res.end(result);
        }
    };
    return Server;
}(events_1.EventEmitter));
exports.Server = Server;
//# sourceMappingURL=server.js.map