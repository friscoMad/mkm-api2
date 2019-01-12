import axios from 'axios';
import xml2js from 'xml2js';

const BASE_URL = 'https://api.cardmarket.com/ws/v2.0/';
const SANDBOX_BASE_URL = 'https://sandbox.cardmarket.com/ws/v2.0/';

export default class {
    constructor(useJson = false, sandbox = false) {
        this.useJson = useJson;
        this.sandbox = sandbox;
        this.xmlBuilder = new xml2js.Builder({ rootName: 'request' });
        this.xmlParser = new xml2js.Parser({
            explicitArray: false,
            explicitRoot: false
        });
    }

    call(method, endpoint, headers, params) {
        const options = {
            method,
            url: endpoint,
            headers,
            responseType: (this.useJson ? 'json' : 'text')
        };
        if (params) {
            options.data = this.xmlBuilder.buildObject(params);
        }
        return axios(options).then((res) => {
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
        }).catch((error) => {
            const res = error.response;
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
        });
    }

    getBaseUrl() {
        let baseUrl = this.sandbox ? SANDBOX_BASE_URL : BASE_URL;
        if (this.useJson) {
            baseUrl += 'output.json/';
        }
        return baseUrl;
    }

    fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, escape);
    }
}
