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
     * @param {Boolean} isOnVacation Vacation is enabled
     * @return {Promise} Operation result
     */
    async setIsOnVacation(isOnVacation) {
        return this.api.makeCall(`account/vacation/${isOnVacation}`, 'PUT');
    }

    /**
     * Set prefered language
     * @param {int} idLanguage Language code to be set
     * @return {Promise} Operation result
     */
    async setLanguage(idLanguage) {
        return this.api.makeCall(`account/language/${idLanguage}`, 'PUT');
    }

    /**
     * Get all messages
     * @return {Promise} List of messages
     */
    async getMessages() {
        return this.api.makeCall('account/messages');
    }

    /**
     * Send a message to another user
     * @param  {int} idOtherUser User id of the recipient
     * @param  {String} message  Content of the message
     * @return {Promise} Operation result
     */
    async postMessageTo(idOtherUser, message) {
        return this.api.makeCall(`account/messages/${idOtherUser}`, 'POST', { message });
    }

    /**
     * Delete all messages from an user
     * @param  {int} idOtherUser User id of the thread
     * @return {Promise} Operation result
     */
    async deleteMessageThreadWith(idOtherUser) {
        return this.api.makeCall(`account/messages/${idOtherUser}`, 'DELETE');
    }

    /**
     * Delete a single message from an user
     * @param  {int} idOtherUser User id of the sender
     * @param  {int} idMessage   Message id
     * @return {Promise} Operation result
     */
    async deleteMessage(idOtherUser, idMessage) {
        return this.api.makeCall(`account/messages/${idOtherUser}/${idMessage}`, 'DELETE');
    }
}

export default Account;
