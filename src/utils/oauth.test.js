import OauthHelper from './oauth';

const mockCredentials = {
    appToken: 'foo',
    appSecret: 'bar',
    accessToken: 'foo2',
    accessTokenSecret: 'bar2'
}

const testCredentials = {
    appToken: 'bfaD9xOU0SXBhtBP',
    appSecret: 'pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y',
    accessToken: 'lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q',
    accessTokenSecret: 'hc1wJAOX02pGGJK2uAv1ZOiwS7I9Tpoe'
}

const now = Date.now;
const generateNonce = OauthHelper.generateNonce;

function mockDate(timestamp) {
    Date.now = jest.fn();
    Date.now.mockReturnValue(timestamp * 1000);
}

function restoreDate() {
    Date.now = now;
}

describe('constructor', () => {
    it('works with all params', () => {
        expect(() => new OauthHelper(mockCredentials)).not.toThrow();
    });

    it('works with app params', () => {
        const credentials = {
            appToken: 'foo',
            appSecret: 'bar',
        }
        expect(() => new OauthHelper(credentials)).not.toThrow();
    });

    it('fails without params', () => {
        expect(() => new OauthHelper()).toThrow();
    });

    it('fails without app params', () => {
        const credentials = {
            accessToken: 'foo',
            accessTokenSecret: 'bar'
        }
        expect(() => new OauthHelper(credentials)).toThrow();
    });
});


test('change user works', () => {
    const helper = new OauthHelper(mockCredentials);
    helper.changeUser('token', 'secret');
    expect(helper.accessToken).toBe('token');
    expect(helper.accessTokenSecret).toBe('secret');
});

test('generateNonce must be random', () => {
    let results = [];
    for (let i = 0; i < 1000; i++) {
        results.push(OauthHelper.generateNonce());
    }
    //If there are duplicates searching the second element will return the first index
    results.forEach((value, index) => {
        expect(results.indexOf(value)).toBe(index);
    });
});

describe('test header construction', () => {
    /**
     * Examples from https://www.mkmapi.eu/ws/documentation/API:Auth_OAuthHeader
     * The examples in the page are wrong, the have edited the urls but not the results.
     */
    const testCases = [{
        name: 'Original Example',
        url: 'https://www.mkmapi.eu/ws/v1.1/account',
        method: 'GET',
        timestamp: 1407917892,
        nonce: '53eb1f44909d6',
        signature: 'DLGHHYV9OsbB/ARf73psEYaNWkI=',
        queryParams: null,
        isPublic: false,
        header: 'OAuth realm="https://www.mkmapi.eu/ws/v1.1/account",oauth_consumer_key="bfaD9xOU0SXBhtBP",oauth_timestamp="1407917892",oauth_nonce="53eb1f44909d6",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_token="lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q",oauth_signature="DLGHHYV9OsbB/ARf73psEYaNWkI="',
    }, {
        name: 'Modified original Example',
        url: 'https://api.cardmarket.com/ws/v1.1/account',
        method: 'GET',
        timestamp: 1407917892,
        nonce: '53eb1f44909d6',
        signature: '163qUUcPtGFLxUzqeCIChErTbKU=',
        queryParams: null,
        isPublic: false,
        header: 'OAuth realm="https://api.cardmarket.com/ws/v1.1/account",oauth_consumer_key="bfaD9xOU0SXBhtBP",oauth_timestamp="1407917892",oauth_nonce="53eb1f44909d6",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_token="lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q",oauth_signature="163qUUcPtGFLxUzqeCIChErTbKU="',
    }, {
        name: 'Api 2.0 with undefined params',
        url: 'https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles',
        method: 'GET',
        timestamp: 1500028572,
        nonce: '59689e9cf4091',
        signature: '1ZG/+LbStcuyOlio5vO/p+CkcBo=',
        queryParams: undefined,
        isPublic: undefined,
        header: 'OAuth realm="https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles",oauth_consumer_key="bfaD9xOU0SXBhtBP",oauth_timestamp="1500028572",oauth_nonce="59689e9cf4091",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_token="lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q",oauth_signature="1ZG/+LbStcuyOlio5vO/p+CkcBo="',
    }, {
        name: 'Public request',
        url: 'https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles',
        method: 'GET',
        timestamp: 1500028572,
        nonce: '59689e9cf4091',
        signature: 'u8kAbiHsm85O295NdWWLU9Ev0Bw=',
        queryParams: null,
        isPublic: true,
        header: 'OAuth realm="https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles",oauth_consumer_key="bfaD9xOU0SXBhtBP",oauth_timestamp="1500028572",oauth_nonce="59689e9cf4091",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_token="",oauth_signature="u8kAbiHsm85O295NdWWLU9Ev0Bw="',
    }, {
        name: 'Api 2.0 with query params',
        url: 'https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles',
        method: 'GET',
        timestamp: 1500028572,
        nonce: '59689e9cf4091',
        signature: '88WlTXTVkHIBeWEWAqPFOkb0Jbg=',
        queryParams: { maxResults : 2, start : 0},
        isPublic: false,
        header: 'OAuth realm="https://api.cardmarket.com/ws/v2.0/users/karmacrow/articles",oauth_consumer_key="bfaD9xOU0SXBhtBP",oauth_timestamp="1500028572",oauth_nonce="59689e9cf4091",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_token="lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q",oauth_signature="88WlTXTVkHIBeWEWAqPFOkb0Jbg="',
    }];
    const helper = new OauthHelper(testCredentials);
    beforeAll(() => {
        OauthHelper.generateNonce = jest.fn();
    });

    test.each(testCases)('buildOauthHeaders works %#', (test) => {
        mockDate(test.timestamp);
        OauthHelper.generateNonce.mockReturnValue(test.nonce);
        const headers = helper.buildOauthHeaders(test.method, test.url, test.isPublic, test.queryParams);
        expect(headers.realm).toBe(test.url);
        expect(headers.oauth_consumer_key).toBe('bfaD9xOU0SXBhtBP');
        expect(headers.oauth_token).toBe(test.isPublic ? '' : 'lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q');
        expect(headers.oauth_nonce).toBe(test.nonce);
        expect(headers.oauth_timestamp).toBe(test.timestamp);
        expect(headers.oauth_signature_method).toBe('HMAC-SHA1');
        expect(headers.oauth_version).toBe('1.0');
        expect(headers.oauth_signature).toBe(test.signature);
        restoreDate();
    });

    test.each(testCases)('buildAuthorizationHeader works %#', (test) => {
        mockDate(test.timestamp);
        OauthHelper.generateNonce.mockReturnValue(test.nonce);
        const value = helper.buildAuthorizationHeader(test.method, test.url, test.isPublic, test.queryParams);
        expect(value).toBe(test.header);
        restoreDate();
    });

    afterAll(() => {
        OauthHelper.generateNonce = generateNonce;
    });
});
