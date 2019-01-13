/**
 * Order managing functions
 */
export class Orders {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get all the information fo a single order
     * @param  {Number}  idOrder id of the order
     * @return {Promise}         Order information
     */
    async getOrderById(idOrder) {
        return this.api.makeCall(`order/${idOrder}`);
    }

    /**
     * Modify an order (mark as sent, mark received, request cancel, aceept cancel or cancel)
     * @param  {Number}  idOrder             id of the order to be modified
     * @param  {('send'|'confirmReception'|'cancel'|'requestCancellation'|'acceptCancellation')}
     * action Action to perform on the order, possible values for action:
     * * send: can be performed by the seller, if the current state is paid
     * * confirmReception: can be performed by the buyer, if the current state is sent
     * * cancel: can be performed by the seller, if the current state is bought for more than
     * 7 days; can be performed by the buyer, if the current state is paid for more than 7 days
     * * requestCancellation: can be performed by both, if the state is not yet sent, the
     * additional key reason is required; if the seller requests cancellation, an optional key
     * relistItems can be provided to indicate, if the articles of the order should be relisted
     * after the cancellation request was accepted by the buyer
     * * acceptCancellation: can be performed by both (but must be opposing actor), if the state
     * is cancellationRequested; if the seller accepts the cancellation request, an optional key
     * relistItems can be provided to indicate, if the articles of the order should be relisted
     * thereafter
     * @param  {String}  [reason='']         Reason of the cancellation (only needed if
     * {@link action} is 'requestCancellation')
     * @param  {Boolean} [relistItems=false] Relist items after the cancellation is resolved
     * (only used if {@link action} is 'requestCancellation' or 'acceptCancellation')
     * @return {Promise} Operation result
     */
    async modifyOrder(idOrder, action, reason = '', relistItems = false) {
        const params = { action };
        if (action === 'requestCancellation') {
            params.reason = reason;
            params.relistItems = relistItems;
        }
        return this.api.makeCall(`order/${idOrder}`, 'PUT', params);
    }

    /**
     * Mark as sent an order.<br>
     * It is just a shorthand to ```modifyOrder(idOrder, 'send')```
     * @param  {Number}  idOrder Order to be marked as sent
     * @return {Promise} Operation result
     */
    async markAsSent(idOrder) {
        return this.modifyOrder(idOrder, 'send');
    }

    /**
     * Confirm reception of an order.<br>
     * It is just a shorthand to ```modifyOrder(idOrder, 'confirmReception')```
     * @param  {Number}  idOrder Order to be marked as received
     * @return {Promise} Operation result
     */
    async confirmReception(idOrder) {
        return this.modifyOrder(idOrder, 'confirmReception');
    }

    /**
     * Cancel an order.<br>
     * It is just a shorthand to ```modifyOrder(idOrder, 'cancel')```
     * @param  {Number}  idOrder Order to be cancelled
     * @return {Promise} Operation result
     */
    async cancel(idOrder) {
        return this.modifyOrder(idOrder, 'cancel');
    }

    /**
     * Accept cancellation of a single order.<br>
     * It is just a shorthand to ```modifyOrder(idOrder, 'acceptCancellation', '', relistItems)```
     * @param  {Number}  idOrder Order to be cancelled
     * @param  {Boolean} [relistItems=false] Relist items of the order after the cancellation
     * @return {Promise} Operation result
     */
    async acceptCancellation(idOrder, relistItems = false) {
        return this.modifyOrder(idOrder, 'acceptCancellation', '', relistItems);
    }

    /**
     * Accept cancellation of a single order.<br>
     * It is just a shorthand to
     * ```modifyOrder(idOrder, 'requestCancellation', reason, relistItems)```
     * @param  {Number}  idOrder Order to be cancelled
     * @param  {String}  [reason='']         Reason for the cancellation
     * @param  {Boolean} [relistItems=false] Relist item after the cancellation have been resolved
     * @return {Promise} operation result
     */
    async requestCancellation(idOrder, reason = '', relistItems = false) {
        return this.modifyOrder(idOrder, 'requestCancellation', reason, relistItems);
    }

    /**
     * Sets the tracking number for an order as a seller
     * @param  {Number}  idOrder        Order to modify
     * @param  {String}  trackingNumber Tracking number
     * @return {Promise} Operation result
     */
    async setTrackingNumber(idOrder, trackingNumber) {
        return this.api.makeCall(`order/${idOrder}/tracking`, 'PUT', { trackingNumber });
    }

    /**
     * Evaluate an order.
     * Grading values are:
     * * 1: very good
     * * 2: good
     * * 3: neutral
     * * 4: bad
     * * 10: n/a
     * @param  {Number}  idOrder    Order to evaluate
     * @param  {Object}  evaluation Evaluation information
     * @param  {(1|2|3|4|10)}  [searchParams.evaluationGrade] General grade
     * @param  {(1|2|3|4|10)}  [searchParams.itemDescription] Description grading
     * @param  {(1|2|3|4|10)}  [searchParams.packaging] Packaging grading
     * @param  {(1|2|3|4|10)}  [searchParams.speed] Speed grading
     * @param  {String}  [searchParams.comment] Comment
     * @param  {String[]}  [searchParams.complaint] List of complaints. Posible values are:
     * * badCommunication
     * * incompleteShipment
     * * notFoil
     * * rudeSeller
     * * shipDamage
     * * unorderedShipment
     * * wrongEd
     * * wrongLang
     * @return {Promise} Operation result
     */
    async evaluate(idOrder, evaluation) {
        return this.api.makeCall(`order/${idOrder}/evaluation`, 'POST', evaluation);
    }

    /**
     * Get all orders done as a buyer or seller in a specific state
     * @param  {Boolean} isBuyer      Return order done as buyer, is set to false it
     * will return orders done as seller)
     * @param  {('bought'|'paid'|'sent'|'received'|'lost'|'cancelled'|Number)}  state
     * Return orders in the specified state, if sent as a number possible values are:
     * * 1: bought
     * * 2: paid
     * * 4: sent
     * * 8: received
     * * 32: lost
     * * 128: cancelled
     * @param  {Number}  [start=null] Paginate results starting with this element,
     * only 100 elements will be returned
     * @return {Promise} List of all Orders matching the filters
     */
    async getOrders(isBuyer, state, start = null) {
        const actor = isBuyer ? '2' : '1';
        return this.api.makeCall(`orders/${actor}/${state}/${start == null ? '' : start}`);
    }
}

export default Orders;
