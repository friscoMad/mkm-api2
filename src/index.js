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
import { Cart } from './resources/cart';
import { Market } from './resources/market';
import { Orders } from './resources/orders';
import { Stock } from './resources/stock';

/**
 * Main api class
 * @property {Account} account Accessor for all account related functions
 * @property {Cart} cart Accessor for all shopping cart related functions
 * @property {Market} market Accessor for all market related functions
 * @property {Orders} orders Accessor for all order related functions
 * @property {Stock} stock Accessor for all stock related functions
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
        this.cart = new Cart(this);
        this.market = new Market(this);
        this.orders = new Orders(this);
        this.stock = new Stock(this);
    }

    /**
     * Makes a request to the MKM API
     * @function
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
            Authorization: this.oauth.buildAuthorizationHeader(method, finalUrl, isPublic)
        };
        return this.requestHandler.call(method, finalUrl, headers, params, queryParams);
    }

    /**
     * @member {Account} account Account methods
     */
}

export default MkmApi;
