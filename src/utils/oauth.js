import createHmac from 'create-hmac';
import randomBytes from 'randombytes';
import escape from './escape';

/**
 * Helper class that handles the creation of the OAuth Authentication header
 * @private
 */
export class OAuthHelper {
    /**
     * Default constructur
     * @param {Object} credentials  Credentials needed for authoriation
     * @param {String} credentials.appToken Token for the application
     * @param {String} credentials.appSecret Secret token for the application
     * @param {String} [credentials.accessToken=''] User access token, it is not neeeded for
     * public functions ({@link Market} functions only currently)
     * @param {String} [credentials.accessTokenSecret=''}] User secret token, it is
     * not neeeded for public functions ({@link Market} functions only currently)
     */
    constructor({
        appToken, appSecret, accessToken = '', accessTokenSecret = ''
    }) {
        if (!appToken || !appSecret) {
            throw new Error('appToken and appSecret must be defined');
        }
        this.appToken = appToken;
        this.appSecret = appSecret;
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
    }

    /**
    * Sets the accessToken and accessTokenSecret values
    * so we can act in behalf of other user
    * @param  {String} accessToken       - New user access token
    * @param  {String} accessTokenSecret - New user access token secret
    */
    changeUser(accessToken, accessTokenSecret) {
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
    }

    /**
     * Creates the OAuth authentication header for a specific request
     * @param  {String}  method  HTTP method of the request
     * @param  {String}  url     Url of the request
     * @param  {Boolean} isPublic Endpoint is public or not
     * @param  {Object}  [queryParams={}] Query params of the request
     * @return {String}  String with the Authentication header value that must be set
     */
    buildAuthorizationHeader(method, url, isPublic, queryParams = {}) {
        const headers = this.buildOauthHeaders(method, url, isPublic, queryParams);
        const params = Object.keys(headers).map(key => `${key}="${headers[key]}"`).join(',');
        return `OAuth ${params}`;
    }

    /**
     * Creates the authentication headers needed for
     * a particular url and method
     * @param  {String} method Http method of this request
     * @param  {String} url    Api endpoint
     * @param  {String} isPublic Public or private endpoint
     * @param  {Object} [queryParams] Query params of the request
     * @return {Object} Object with all the OAuth headers
     */
    buildOauthHeaders(method, url, isPublic = false, queryParams = {}) {
        const headers = this.buildBaseOauthHeaders(url);
        headers.oauth_token = isPublic ? '' : this.accessToken;
        headers.oauth_signature = this.buildSignature(method, headers, isPublic, queryParams);
        return headers;
    }

    /**
     * Creates a basic set of requests headers for authentication
     * @param  {String} url Url of the request
     * @return {Object}     Object with all the headers
     */
    buildBaseOauthHeaders(url) {
        return {
            realm: url,
            oauth_consumer_key: this.appToken,
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_nonce: OAuthHelper.generateNonce(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0'
        };
    }

    /**
     * Basic function to get a random nonce, this is the only way I found to be able
     * to mock this the randomBytes function.
     * @static
     * @return {String} Random string
     */
    static generateNonce() {
        return randomBytes(7).toString('hex');
    }

    /**
     * Creates the signature needed for the authentication
     * @param  {String}  method   HTTP verb used in the request (GET, POST, PUT...)
     * @param  {Object}  headers  Headers that will go with the request
     * @param  {Boolean} isPublic Endpoint is public or not
     * @return {String}           Signature generated with all the previous info
     */
    buildSignature(method, headers, isPublic = false, queryParams = {}) {
        const baseString = `${method.toUpperCase()}&${escape(headers.realm)}&`;
        const secretKey = `${this.appSecret}&${isPublic ? '' : this.accessTokenSecret}`;
        const signatureHeaders = queryParams ? Object.assign({}, queryParams, headers) : headers;
        const paramsString = Object.keys(signatureHeaders)
            .filter(key => key !== 'realm')
            .sort()
            .map(key => `${key}=${signatureHeaders[key]}`)
            .join('&');
        const signatureString = baseString + escape(paramsString);
        return createHmac('sha1', secretKey).update(signatureString).digest('base64');
    }
}

export default OAuthHelper;
