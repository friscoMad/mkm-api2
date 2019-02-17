/**
 * Account management methods
 */
export class Account {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get account information
     * @return {Promise} Account information
     */
    async get() {
        return this.api.makeCall('account');
    }

    /**
     * Sets/unsets account on vacation
     * @param {Boolean} onVacation Vacation is enabled
     * @param  {Boolean} [cancelOrders=false] Cancel all orders if possible or at least request it.
     * @param  {Boolean} [relistItems=false] Relist all items when cancellation resolves
     * @return {Promise} Operation result
     */
    async setVacationMode(onVacation, cancelOrders = false, relistItems = false) {
        return this.api.makeCall('account/vacation', 'PUT', null, false, { onVacation, cancelOrders, relistItems });
    }

    /**
     * Set prefered language
     * @param {int} idLanguage Language code to be set
     * @return {Promise} Operation result
     */
    async setLanguage(idLanguage) {
        return this.api.makeCall('account/language', 'PUT', null, false, { idDisplayLanguage: idLanguage });
    }

    /**
     * Redeem one or multiple coupons
     * @param  {String|String[]}  coupons One or multiple coupons to be redeemed
     * @return {Promise}         Operation result
     */
    async redeemCoupon(coupons) {
        return this.api.makeCall('account/coupon', 'POST', { couponCode: coupons });
    }

    /**
     * Ask for a password reset. <br>
     * One of the params must be defined if both are it will use only the email
     * @param  {String}  [email=null]    Email of the account
     * @param  {String}  [username=null] Username
     * @return {Promise}  Operation result
     */
    async resetPassword(email = null, username = null) {
        const params = {};
        if (email) {
            params.email = email;
        } else if (username) {
            params.username = username;
        } else {
            throw Error('Must pass username or email');
        }
        return this.api.makeCall('account/logindata', 'POST', params, true, { type: 'password' });
    }

    /**
     * Ask for the recovery of an user by passing it's mail address
     * @param  {String}  email Email address of the user
     * @return {Promise} Username
     */
    async recoverUsername(email) {
        return this.api.makeCall('account/logindata', 'POST', { email }, true, { type: 'username' });
    }
}

export default Account;
