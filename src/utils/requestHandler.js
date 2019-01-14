import axios from 'axios';
import xml2js from 'xml2js';

const BASE_URL = 'https://api.cardmarket.com/ws/v2.0/';
const SANDBOX_BASE_URL = 'https://sandbox.cardmarket.com/ws/v2.0/';

/**
 * Request helper class
 * @private
 */
export class RequestHandler {
    /**
     * Main constructor
     * @param {Boolean} [useJson=false] Ask for json responses so no XML parsing will be done
     * @param {Boolean} [sandbox=false] Use sandbox server instead of regular server
     */
    constructor(useJson = false, sandbox = false) {
        this.useJson = useJson;
        this.sandbox = sandbox;
        this.xmlBuilder = new xml2js.Builder({ rootName: 'request' });
        this.xmlParser = new xml2js.Parser({
            explicitArray: false,
            explicitRoot: false,
            valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans]
        });
    }

    /**
     * Makes a request and parses the response
     * @param  {('GET'|'POST'|'PUT'|'DELETE')}  method  Http verb of the request
     * @param  {String}  endpoint  Url of the endpint
     * @param  {Object}  [headers = {}]  Object with all the headers to be sent
     * @param  {Object}  [params = null]   Object that will be sent as the request
     * body (converted to XML)
     * @param  {Object}  [queryParams = null] Object with the query params that will
     * be added to the url
     * @return {Promise} Parsed data of the request.
     */
    async call(method, endpoint, headers = {}, params = null, queryParams = null) {
        const options = {
            method,
            url: endpoint,
            headers,
            responseType: (this.useJson ? 'json' : 'text')
        };
        if (params) {
            options.data = this.xmlBuilder.buildObject(params);
        }
        if (queryParams) {
            options.params = queryParams;
        }
        try {
            const res = await axios(options);
            if (this.useJson) {
                return JSON.parse(res.data);
            }
            return new Promise((resolve, reject) => {
                this.xmlParser.parseString(res.data, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject(err);
                    }
                });
            });
        } catch (error) {
            const res = error.response;
            if (!res) {
                return Promise.reject(error);
            }
            const errorResponse = {
                status: res.status,
                statusText: res.statusText
            };
            if (res.data && typeof res.data === 'string') {
                let errorMessage = '';
                try {
                    const errorBody = JSON.parse(res.data);
                    errorMessage = errorBody.error;
                } catch (e) {
                    errorMessage = res.data;
                }
                errorResponse.errorMessage = errorMessage;
            }
            return Promise.reject(errorResponse);
        }
    }

    /**
     * Return the base url for endpoints
     * @return {String} Base url for endpints
     */
    getBaseUrl() {
        let baseUrl = this.sandbox ? SANDBOX_BASE_URL : BASE_URL;
        if (this.useJson) {
            baseUrl += 'output.json/';
        }
        return baseUrl;
    }
}

export default RequestHandler;
