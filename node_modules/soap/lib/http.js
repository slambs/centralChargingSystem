"use strict";
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
exports.__esModule = true;
var debugBuilder = require("debug");
var httpNtlm = require("httpntlm");
var _ = require("lodash");
var req = require("request");
var url = require("url");
var uuid = require("uuid/v4");
var debug = debugBuilder('node-soap');
var VERSION = require('../package.json').version;
/**
 * A class representing the http client
 * @param {Object} [options] Options object. It allows the customization of
 * `request` module
 *
 * @constructor
 */
var HttpClient = /** @class */ (function () {
    function HttpClient(options) {
        options = options || {};
        this._request = options.request || req;
    }
    /**
     * Build the HTTP request (method, uri, headers, ...)
     * @param {String} rurl The resource url
     * @param {Object|String} data The payload
     * @param {Object} exheaders Extra http headers
     * @param {Object} exoptions Extra options
     * @returns {Object} The http request object for the `request` module
     */
    HttpClient.prototype.buildRequest = function (rurl, data, exheaders, exoptions) {
        if (exoptions === void 0) { exoptions = {}; }
        var curl = url.parse(rurl);
        var secure = curl.protocol === 'https:';
        var host = curl.hostname;
        var port = parseInt(curl.port, 10);
        var path = [curl.pathname || '/', curl.search || '', curl.hash || ''].join('');
        var method = data ? 'POST' : 'GET';
        var headers = {
            'User-Agent': 'node-soap/' + VERSION,
            'Accept': 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'none',
            'Accept-Charset': 'utf-8',
            'Connection': exoptions.forever ? 'keep-alive' : 'close',
            'Host': host + (isNaN(port) ? '' : ':' + port)
        };
        var mergeOptions = ['headers'];
        var attachments = exoptions.attachments || [];
        if (typeof data === 'string' && attachments.length === 0) {
            headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        exheaders = exheaders || {};
        for (var attr in exheaders) {
            headers[attr] = exheaders[attr];
        }
        var options = {
            uri: curl,
            method: method,
            headers: headers,
            followAllRedirects: true
        };
        if (attachments.length > 0) {
            var start = uuid();
            headers['Content-Type'] =
                'multipart/related; type="application/xop+xml"; start="<' + start + '>"; start-info="text/xml"; boundary=' + uuid();
            var multipart_1 = [{
                    'Content-Type': 'application/xop+xml; charset=UTF-8; type="text/xml"',
                    'Content-ID': '<' + start + '>',
                    'body': data
                }];
            attachments.forEach(function (attachment) {
                multipart_1.push({
                    'Content-Type': attachment.mimetype,
                    'Content-Transfer-Encoding': 'binary',
                    'Content-ID': '<' + attachment.contentId + '>',
                    'Content-Disposition': 'attachment; filename="' + attachment.name + '"',
                    'body': attachment.body
                });
            });
            options.multipart = multipart_1;
        }
        else {
            options.body = data;
        }
        for (var attr in _.omit(exoptions, ['attachments'])) {
            if (mergeOptions.indexOf(attr) !== -1) {
                for (var header in exoptions[attr]) {
                    options[attr][header] = exoptions[attr][header];
                }
            }
            else {
                options[attr] = exoptions[attr];
            }
        }
        debug('Http request: %j', options);
        return options;
    };
    /**
     * Handle the http response
     * @param {Object} The req object
     * @param {Object} res The res object
     * @param {Object} body The http body
     * @param {Object} The parsed body
     */
    HttpClient.prototype.handleResponse = function (req, res, body) {
        debug('Http response body: %j', body);
        if (typeof body === 'string') {
            // Remove any extra characters that appear before or after the SOAP
            // envelope.
            var match = body.replace(/<!--[\s\S]*?-->/, '').match(/(?:<\?[^?]*\?>[\s]*)?<([^:]*):Envelope([\S\s]*)<\/\1:Envelope>/i);
            if (match) {
                body = match[0];
            }
        }
        return body;
    };
    HttpClient.prototype.request = function (rurl, data, callback, exheaders, exoptions, caller) {
        var _this = this;
        var options = this.buildRequest(rurl, data, exheaders, exoptions);
        var req;
        if (exoptions !== undefined && exoptions.hasOwnProperty('ntlm')) {
            // sadly when using ntlm nothing to return
            // Not sure if this can be handled in a cleaner way rather than an if/else,
            // will to tidy up if I get chance later, patches welcome - insanityinside
            // TODO - should the following be uri?
            options.url = rurl;
            httpNtlm[options.method.toLowerCase()](options, function (err, res) {
                if (err) {
                    return callback(err);
                }
                // if result is stream
                if (typeof res.body !== 'string') {
                    res.body = res.body.toString();
                }
                res.body = _this.handleResponse(req, res, res.body);
                callback(null, res, res.body);
            });
        }
        else {
            req = this._request(options, function (err, res, body) {
                if (err) {
                    return callback(err);
                }
                body = _this.handleResponse(req, res, body);
                callback(null, res, body);
            });
        }
        return req;
    };
    HttpClient.prototype.requestStream = function (rurl, data, exheaders, exoptions, caller) {
        var options = this.buildRequest(rurl, data, exheaders, exoptions);
        return this._request(options);
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
//# sourceMappingURL=http.js.map