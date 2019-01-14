/**
 * Message management methods
 */
export class Messages {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get all messages
     * @return {Promise} List of messages
     */
    async get() {
        return this.api.makeCall('account/messages');
    }

    /**
     * Send a message to another user
     * @param  {int} idOtherUser User id of the recipient
     * @param  {String} message  Content of the message
     * @return {Promise} Operation result
     */
    async send(idOtherUser, message) {
        return this.api.makeCall(`account/messages/${idOtherUser}`, 'POST', { message });
    }

    /**
     * Delete all messages from an user
     * @param  {int} idOtherUser User id of the thread
     * @return {Promise} Operation result
     */
    async deleteThread(idOtherUser) {
        return this.api.makeCall(`account/messages/${idOtherUser}`, 'DELETE');
    }

    /**
     * Delete a single message from an user
     * @param  {int} idOtherUser User id of the sender
     * @param  {int} idMessage   Message id
     * @return {Promise} Operation result
     */
    async delete(idOtherUser, idMessage) {
        return this.api.makeCall(`account/messages/${idOtherUser}/${idMessage}`, 'DELETE');
    }
}

export default Messages;
