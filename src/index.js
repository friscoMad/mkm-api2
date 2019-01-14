/**
 * @module MkmApi
 * @description Isomorphic library for accessing MKM apis, if does not only provide
 * authentication methods it does provide simple JS methods for all possible requests
 * and handle the parsing of responses back to plain objects.
 * @example
 * import MkmApi from 'mkm-api2';
 *
 * const api = new MkmApi();
 * api.account.get().then(data => console.log(data));
 */

import { OAuthHelper } from './utils/oauth';
import { RequestHandler } from './utils/requestHandler';
import { Account } from './resources/account';
import { Cart } from './resources/cart';
import { Market } from './resources/market';
import { Orders } from './resources/orders';
import { Stock } from './resources/stock';
import { Wants } from './resources/wants';
import { Messages } from './resources/messages';

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
        /**
         * Helper class that handles oauth authorization headers
         * @private
         * @type {OAuthHelper}
         */
        this.oauth = new OAuthHelper(credentials);
        /**
         * Helper class that handles all network and XML related tasks
         * @private
         * @type {RequestHandler}
         */
        this.requestHandler = new RequestHandler(useJson, sandbox);
        /**
         * Accessor for all account related functions
         * @type {Account}
         */
        this.account = new Account(this);
        /**
         * Accessor for all cart related functions
         * @type {Cart}
         */
        this.cart = new Cart(this);
        /**
         * Accessor for all market related functions
         * @type {Market}
         */
        this.market = new Market(this);
        /**
         * Accessor for all order related functions
         * @type {Orders}
         */
        this.orders = new Orders(this);
        /**
         * Accessor for all stock related functions
         * @type {Stock}
         */
        this.stock = new Stock(this);
        /**
         * Accessor for all want list related functions
         * @type {Wants}
         */
        this.wants = new Wants(this);
        /**
         * Accessor for all message related functions
         * @type {Messages}
         */
        this.messages = new Messages(this);
    }

    /**
     * Makes a request to the MKM API
     * @private
     * @param  {String}  url      Url of the endpoint (with the needed url parameters)
     * @param  {('GET'|'POST'|'PUT'|'DELETE')}  [method='GET']   HTTP verb used for the
     * request (GET, POST, PUT, DELETE)
     * @param  {Object}  [params=null]   Parameters that must be sent inside the body of
     * the request (only for POST, PUT, DELETE)
     * @param  {Boolean} [isPublic=false] If the request is public so a full authorization
     * is not needed
     * @return {Promise}          Promise with the result of the request
     */
    async makeCall(url, method = 'GET', params = null, isPublic = false, queryParams = null) {
        const finalUrl = this.requestHandler.getBaseUrl() + url;
        const headers = {
            Authorization: this.oauth.buildAuthorizationHeader(method, finalUrl,
                isPublic, queryParams)
        };
        return this.requestHandler.call(method, finalUrl, headers, params, queryParams);
    }

    /**
     * Changes the credentials to use another user. <br>
     * In case of handling requests of several users frequently it is best to create a new api
     * instance for each one of them.
     * @param  {String} accessToken       accessToken of the new user
     * @param  {String} accessTokenSecret accessToken secret of the new user
     */
    changeUser(accessToken, accessTokenSecret) {
        this.oauth.changeUser(accessToken, accessTokenSecret);
    }
}

export default MkmApi;
