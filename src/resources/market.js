/**
 * Market endpoints
 */
export class Market {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get all available games in MKKM
     * @return {Promise} List of available games
     */
    async getGames() {
        return this.api.makeCall('games', 'GET', null, true);
    }

    /**
     * Get MetaProduct information (a MetaProduct is a card info with all reprints and versions)
     * @param  {Number}  idMetaproduct MetaProduct id
     * @return {Promise}               MetaProduct information
     */
    async getMetaproduct(idMetaproduct) {
        return this.api.makeCall(`metaproducts/${idMetaproduct}`, 'GET', null, true);
    }

    /**
     * Search for metaproducts by card name
     * @param  {String}  name           String to match
     * @param  {Boolean} [isExact=true] Only return exact matches
     * @param  {Number}  [idLanguage=1] Search string in card names in an specific language
     * (1 is English)
     * @param  {Number}  [idGame=1]     Search cards of a specific game (1 is Magic)
     * @return {Promise}                List of all matched metaproducts
     */
    async findMetaproducts(name, isExact = true, idLanguage = 1, idGame = 1) {
        const queryParams = {
            search: name,
            exact: isExact,
            idGame,
            idLanguage
        };
        return this.api.makeCall('metaproducts/find', 'GET', null, true, queryParams);
    }

    /**
     * Get product information by id
     * @param  {Number}  idProduct id of the product
     * @return {Promise}           product information
     */
    async getProduct(idProduct) {
        return this.api.makeCall(`products/${idProduct}`, 'GET', null, true);
    }

    /**
     * Find products by name
     * @param  {String}  name              Search string to use
     * @param  {Boolean} [isExact=true]    Only return exact matches
     * @param  {Number}  [start=null]      Pagination start parameter
     * (if defined maxResults must be defined)
     * @param  {Number}  [maxResults=null] Page size for pagination
     * @param  {Number}  [idLanguage=1]    Search string in card names in an specific language
     * (1 is English)
     * @param  {Number}  [idGame=1]        Search cards of a specific game (1 is Magic)
     * (if defined start must be defined)
     * @return {Promise}                   List of all products that matches the query
     */
    async findProducts(name, isExact = true, start = null, maxResults = null,
        idLanguage = 1, idGame = 1) {
        if ((start !== null && maxResults === null) || (maxResults != null && start === null)) {
            throw Error('Start and maxResults both must be provided');
        }
        const queryParams = {
            search: name,
            exact: isExact,
            idGame,
            idLanguage
        };
        if (start !== null) {
            queryParams.start = start;
            queryParams.maxResults = maxResults;
        }
        return this.api.makeCall('products/find', 'GET', null, true, queryParams);
    }

    /**
     * Get all expansions of a game
     * @param  {Number}  idGame id of the game
     * @return {Promise}        List of game expansions
     */
    async getGameExpansions(idGame) {
        return this.api.makeCall(`games/${idGame}/expansions`, 'GET', null, true);
    }

    /**
     * Get all card (products) in a single expansion
     * @param  {Number}  idExpansion id of the expansion
     * @return {Promise}             List of products in the expansion.
     */
    async getExpansionSingles(idExpansion) {
        return this.api.makeCall(`expansions/${idExpansion}/singles`, 'GET', null, true);
    }

    /**
     * Get all the offers for a product that matches the search parameters. <br>
     * **Attention:** Only 1.000 articles will be returned if there are more than that you must
     * use the {@link searchParams.start} and {@link searchParams.maxResults} to paginate the query.
     * @param  {Number}  idProduct    id of the Product
     * @param  {Object}  [searchParams] Search parameters
     * @param  {('private'|'commercial'|'powerseller')}  [searchParams.userType] Filter results
     * by the type of seller
     * @param  {(1|2|3|4|5)}  [searchParams.minUserScore] Filter results by the seller score
     * @param  {Number}  [searchParams.idLanguage] Filter results by language
     * @param  {('MT'|'NM'|'EX'|'GD'|'LP'|'PL'|'PO')}  [searchParams.minCondition] Filter results
     * by condition
     * @param  {Boolean}  [searchParams.isFoil] Filter results by foiling
     * @param  {Boolean}  [searchParams.isSigned] Filter results by being signed or not
     * @param  {Boolean}  [searchParams.isAltered] Filter results by being altered or not
     * @param  {Number}  [searchParams.minAvailable] Filter results elements available from the user
     * @param  {Number}  [searchParams.start]       Pagination start parameter
     * (if defined maxResults must be defined)
     * @param  {Number}  [searchParams.maxResults] Page size for pagination
     * (if defined start must be defined)
     * @return {Promise}  List of all articles matching the query
     */
    async getArticles(idProduct, searchParams) {
        return this.api.makeCall(`products/articles${idProduct}`, 'GET', null, true, searchParams);
    }

    /**
     * Get user by id or exact name
     * @param  {Number|String}  idOrName id of the user or exact name
     * @return {Promise}        User information
     */
    async getUser(idOrName) {
        return this.api.makeCall(`users/${idOrName}`, 'GET', null, true);
    }

    /**
     * Search for users by name
     * @param  {String}  search Search string (min length of 3)
     * @return {Promise}        List of users matching the query, max 50 elements are returned
     */
    async findUsers(search) {
        return this.api.makeCall('users/find', 'GET', null, true, { search });
    }

    /**
     * Get all articles for a game that an user is selling <br>
     * **Attention:** Only 1.000 articles will be returned if there are more than that you must
     * use the {@link searchParams.start} and {@link searchParams.maxResults} to paginate the query.
     * @param  {Number}  idUser            User id
     * @param  {Number}  [start=null]      Pagination start parameter
     * (if defined maxResults must be defined)
     * @param  {Number}  [maxResults=null] Page size for pagination
     * (if defined start must be defined)
     * @param  {Number}  [idGame=1]        Filter articles of a specific game (1 is Magic)
     * @return {Promise}                   List all articles of the specified game from that user.
     */
    async getArticlesByUser(idUser, start = null, maxResults = null, idGame = 1) {
        if ((start !== null && maxResults === null) || (maxResults != null && start === null)) {
            throw Error('Start and maxResults both must be provided');
        }
        const queryParams = { idGame };
        if (start !== null) {
            queryParams.start = start;
            queryParams.maxResults = maxResults;
        }
        return this.api.makeCall(`users/${idUser}/articles`, 'GET', null, true, queryParams);
    }
}

export default Market;
