/**
 * @module MkmApi
 * @description Description of your library
 * @example
 * import MkmApi from 'mkm-api2';
 *
 * const api = new MkmApi();
 * api.account.getAccount().then(data => console.log(data.username));
 */
import { OAuthHelper } from './utils/oauth';
import RequestHandler from './utils/requestHandler';
import { Account } from './resources/account';

/**
 * Main api class
 */
export class MkmApi {
    /**
     * Constructor of the class
     * @param {Object} options Configuration of the library
     */
    constructor({ credentials = null, sandbox = false, useJson = false } = {}) {
        if (!credentials) {
            throw new Error('Credentials must be passed in the constructor');
        }
        this.oauth = new OAuthHelper(credentials);
        this.requestHandler = new RequestHandler(useJson, sandbox);
        this.account = new Account(this);
    }

    /**
     * Makes a request to the MKM API
     * @function
     * @param  {String}  method   HTTP verb used for the request (GET, POST, PUT, DELETE)
     * @param  {String}  url      Url of the endpoint (with the needed url parameters)
     * @param  {Boolean} isPublic If the request is public so a full authorization is not needed
     * @param  {Object}  params   Parameters that must be sent inside the body of
     * the request (only for POST, PUT, DELETE)
     * @return {Promise}          Promise with the result of the request
     */
    makeCall(method, url, params = null, isPublic = false) {
        const finalUrl = this.requestHandler.getBaseUrl() + url;
        const headers = {
            Authorization: this.oauth.buildAuthorizationHeader(method, finalUrl, isPublic)
        };
        return this.requestHandler.call(method, finalUrl, headers, params);
    }

    /**
     * @member {Account} account Account methods
     */
}

export default MkmApi;
