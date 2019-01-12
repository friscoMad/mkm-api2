/**
 * Cart management methods
 */
export class Cart {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get the current contents of the shopping cart
     * @return {Promise} Contents of the shopping cart
     */
    get() {
        return this.api.makeCall('GET', 'shoppingcart');
    }

    /**
     * Adds or remove an article from the shopping cart
     * @param {number} idArticle id of the article
     * @param {number} amount    Ammount to add or remove (negative numbers remove items)
     * @return {Promise}       Operation result
     */
    addArticle(idArticle, amount) {
        const params = {
            action: amount < 0 ? 'remove' : 'add',
            article: {
                idArticle,
                amount: amount < 0 ? -amount : amount
            }
        };
        return this.api.makeCall('PUT', 'shoppingcart', params);
    }

    /**
     * Removes an article from the shopping cart
     * @param  {number} idArticle id of the Article to be removed
     * @param  {number} amount    Amount of elements to be removed
     * @return {Promise}       Operation result
     */
    removeArticle(idArticle, amount) {
        return this.addArticles(idArticle, -amount);
    }

    /**
     * Upadte shopping cart, with this method multiple items can be added or removed from the
     * shopping cart but MKM does not support adding and removing at the same time.
     * @param {Array<{idArticle: number, amount: number}>} articles
     *  Array of elements to be added or removed.
     * @return {Promise}       Operation result
     */
    updateArticles(articles) {
        if (!Array.isArray(articles)) {
            return Promise.reject(new Error('Invalid parameters'));
        }
        let sign = 0;
        const checkResult = articles.forEach((article) => {
            if (!('amount' in article) || !('idArticle' in article)) {
                return Promise.reject(new Error('Invalid article list, it must be an array of objects ({idArticle, amount})'));
            }
            if (sign === 0) {
                sign = article.amount;
            }
            if ((article.amount > 0 && sign < 0) || (article.amount < 0 && sign > 0)) {
                return Promise.reject(new Error('Invalid amount you can only add or remove elements in one operation'));
            }
            return null;
        });
        if (checkResult) {
            return checkResult;
        }
        const params = {
            action: sign < 0 ? 'remove' : 'add',
            article: sign > 0 ? articles : articles.map((article) => {
                article.amount = -article.amount;
                return article;
            })
        };
        return this.api.makeCall('PUT', 'shoppingcart', params);
    }

    /**
     * Clears the shopping cart
     * @return {Promise}       Operation result
     */
    empty() {
        return this.api.makeCall('DELETE', 'shoppingcart');
    }

    /**
     * Completes the order and pay as many orders as possible with the current funds.
     * @return {Promise}       Operation result
     */
    checkout() {
        return this.api.makeCall('PUT', 'shoppingcart/checkout');
    }

    /**
     * Updates the shipping address for all the items in the cart.
     * @param {Object} shippingAddress Object with the new address.
     * @return {Promise}       Operation result
     */
    setShippingAddress(shippingAddress) {
        return this.api.makeCall('PUT', 'shoppingcart/checkout', shippingAddress);
    }

    /**
     * Gets the list of all possible shipping methods for a reservation
     * (all the items from a single user)
     * @param  {number} idReservation id of the reservation, it can be retrieved
     * with {@link Cart#get}
     * @return {Promise}       Options for shipping that reservation.
     */
    getAvailableShippingMethods(idReservation) {
        return this.api.makeCall('GET', `shoppingcart/shippingmethod/${idReservation}`);
    }

    /**
     * Sets the shipping method for a single reservation.
     * @param {number} idReservation    id of the reservation, it can be retrieved
     * with {@link Cart#get}
     * @param {number} idShippingMethod id of the shipping method, it can be
     * retrieved with {@link Cart#getAvailableShippingMethods}
     * @return {Promise}       Operation result
     */
    setShippingMethod(idReservation, idShippingMethod) {
        return this.api.makeCall('PUT', `shoppingcart/shippingmethod/${idReservation}`, { idShippingMethod });
    }
}

export default Cart;
