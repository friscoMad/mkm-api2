import createHmac from 'create-hmac';
import randomBytes from 'randombytes';
import escape from './escape';

/**
 * Helper class that handles the creation of the OAuth Authentication header
 */
export class OAuthHelper {
    /**
     * [constructor description]
     * @param {String} [appToken='']         [description]
     * @param {String} [appSecret='']        [description]
     * @param {String} [accessToken='']      [description]
     * @param {String} [accessTokenSecret=''                 } = {}] [description]
     */
    constructor({
        appToken = '', appSecret = '', accessToken = '', accessTokenSecret = ''
    } = {}) {
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
     * Creates the authentication headers needed for
     * a particular url and method
     * @param  {String} method - Http method of this request
     * @param  {String} url    - Api endpoint
     * @param  {String} isPublic - Public or private endpoint
     * @return {Object}        [description]
     */
    buildOauthHeaders(method, url, isPublic) {
        const headers = this.buildBaseOauthHeaders(url);
        headers.oauth_token = isPublic ? '' : this.accessToken;
        headers.oauth_signature = this.buildSignature(method, headers, isPublic);
        return headers;
    }

    /**
     * Creates the OAuth authentication header
     * @static
     * @param  {Object} headers Headers of the request
     * @return {String}         Header value
     */
    buildAuthorizationHeader(method, url, isPublic) {
        const headers = this.buildOauthHeaders(method, url, isPublic);
        const authString = 'OAuth ';
        const params = Object.keys(headers).map(key => `${key}="${headers[key]}"`);
        return authString + params.join(',');
    }

    /**
     * Creates a basic set of requests headers for authentication
     * @static
     * @param  {String} url Url of the request
     * @return {Object}     Object with all the headers
     */
    buildBaseOauthHeaders(url) {
        return {
            realm: url,
            oauth_consumer_key: this.appToken,
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_nonce: randomBytes(16).toString('hex'),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0'
        };
    }

    /**
     * Creates the signature needed for the authentication
     * @param  {String}  method   HTTP verb used in the request (GET, POST, PUT...)
     * @param  {Object}  headers  Headers that will go with the request
     * @param  {Boolean} isPublic Endpoint is public or not
     * @return {String}           Signature generated with all the previous info
     */
    buildSignature(method, headers, isPublic) {
        const baseString = `${method.toUpperCase()}&${escape(headers.realm)}&`;
        const secretKey = `${this.appSecret}&${isPublic ? '' : this.accessTokenSecret}`;

        const paramsString = Object.keys(headers).sort().reduce((accum, key, index) => {
            if (key === 'realm') return accum;
            if (index === 0) return `${key}=${headers[key]}`;
            return `${accum}&${key}=${headers[key]}`;
        }, '');

        const signatureString = baseString + escape(paramsString);

        return createHmac('sha1', secretKey).update(signatureString).digest('base64');
    }
}

export default OAuthHelper;
