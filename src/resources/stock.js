/**
 * Stock managing functionality
 */
export class Stock {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get the full list of articles published
     * **Attention:** Only 1.000 articles will be returned if there are more than that you must
     * use the {@link start}.
     * @param  {Number}  [start=null] Paginate results starting from this element. If set only 100
     * elements will be returned by request
     * @return {Promise} List of Articles in stock.
     */
    async get(start = null) {
        return this.api.makeCall(`stock/${start == null ? '' : start}`);
    }

    /**
     * Add one or more articles to your stock
     * @param  {Object[]}  articles Articles to be listed
     * @return {Promise} Operation result
     */
    async add(articles) {
        return this.api.makeCall('stock', 'POST', articles);
    }

    /**
     * Modify one or several articles in your stock, it can not be used to change the quantity.
     * @param  {Object[]}  articles Changed articles
     * @return {Promise}  Operation result
     */
    async change(articles) {
        return this.api.makeCall('stock', 'PUT', articles);
    }

    /**
     * Remove articles from your stock
     * @param  {Object[]}  articles Articles to be removed
     * @return {Promise} Operation result
     */
    async delete(articles) {
        return this.api.makeCall('stock', 'DELETE', articles);
    }

    /**
     * Get all articles that are currently in the shopping cart of other users.
     * @return {Promise} List of articles
     */
    async getInShoppingCart() {
        return this.api.makeCall('stock/shoppingcart-articles');
    }

    /**
     * Get all the information of a single article
     * @param  {Number}  idArticle Id of the article
     * @return {Promise} Article information
     */
    async getArticle(idArticle) {
        return this.api.makeCall(`stock/article/${idArticle}`);
    }

    /**
     * Find all articles in your stock from a specified game that matches a name.
     * @param  {String}  name Name to be searched
     * @param  {Number}  [idGame=1] Id of game (by default Magic)
     * @return {Promise} List of articles that matches the query
     */
    async findArticles(name, idGame = 1) {
        return this.api.makeCall(`stock/articles/${name}/${idGame}`);
    }

    /**
     * Increase the ammount of one or several articles
     * *Attention:* Increasing the stock for an article may fail, because we have limitations
     * on how many copies of an article different seller types (private, professional) can have
     * in their stock. In this case, the response body will have the failed key collecting all
     * articles that failed in increasing the copies - in addition to the article key collecting
     * all successful increases.
     * @param  {Object[]}  articles List of articles to increase and the amount for each one
     * @return {Promise} Operation result
     */
    async increaseAmmount(articles) {
        return this.api.makeCall('stock/increase', 'PUT', articles);
    }

    /**
    * Decrease the ammount of one or several articles
    * *Attention:* Increasing the stock for an article may fail, because we have limitations
    * on how many copies of an article different seller types (private, professional) can have
    * in their stock. In this case, the response body will have the failed key collecting all
    * articles that failed in increasing the copies - in addition to the article key collecting
    * all successful increases.
    * @param  {Object[]}  articles List of articles to decrease and the amount for each one
    * @return {Promise} Operation result
     */
    async dereaseAmmount(articles) {
        return this.api.makeCall('stock/decrease', 'PUT', articles);
    }
}

export default Stock;
