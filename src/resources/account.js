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
    getAccount() {
        return this.api.makeCall('GET', 'account');
    }

    /**
     * Sets/unsets account on vacation
     * @param {Boolean} isOnVacation Vacation is enabled
     * @return {Promise} Operation result
     */
    setIsOnVacation(isOnVacation) {
        return this.api.makeCall('PUT', `account/vacation/${isOnVacation}`);
    }

    /**
     * Set prefered language
     * @param {int} idLanguage Language code to be set
     * @return {Promise} Operation result
     */
    setLanguage(idLanguage) {
        return this.api.makeCall('PUT', `account/language/${idLanguage}`);
    }

    /**
     * Get all messages
     * @return {Promise} List of messages
     */
    getMessages() {
        return this.api.makeCall('GET', 'account/messages');
    }

    /**
     * Send a message to another user
     * @param  {int} idOtherUser User id of the recipient
     * @param  {String} message  Content of the message
     * @return {Promise} Operation result
     */
    postMessageTo(idOtherUser, message) {
        return this.api.makeCall('POST', `account/messages/${idOtherUser}`, { message });
    }

    /**
     * Delete all messages from an user
     * @param  {int} idOtherUser User id of the thread
     * @return {Promise} Operation result
     */
    deleteMessageThreadWith(idOtherUser) {
        return this.api.makeCall('DELETE', `account/messages/${idOtherUser}`);
    }

    /**
     * Delete a single message from an user
     * @param  {int} idOtherUser User id of the sender
     * @param  {int} idMessage   Message id
     * @return {Promise} Operation result
     */
    deleteMessage(idOtherUser, idMessage) {
        return this.api.makeCall('DELETE', `account/messages/${idOtherUser}/${idMessage}`);
    }
}

export default Account;
