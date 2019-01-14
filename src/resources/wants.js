/**
 * Want list endpoints
 */
export class Wants {
    /**
     * Main constructor
     * @private
     * @param {MkmApi} api Parent api to make the calls
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Get all want lists
     * @return {Promise} Lists with all the want lists of the user
     */
    async getLists() {
        return this.api.makeCall('wantslist');
    }

    /**
     * Creates a new want list
     * @param  {String}  name   Name of the new want list
     * @param  {Number}  [idGame=1] Id of the game associated to the want list (default Magic)
     * @return {Promise} Operation result
     */
    async createList(name, idGame = 1) {
        return this.api.makeCall('wantslist', 'POST', { name, idGame });
    }

    /**
     * Get all products and metaproducts of the want list
     * @param  {Number}  idList Id of the list
     * @return {Promise} List of wants in the want list
     */
    async getProducts(idList) {
        return this.api.makeCall(`wantslist/${idList}`);
    }

    /**
     * Private function to handle all modifications of a want list.
     * @private
     * @param  {Number}  idList Id of the want list
     * @param  {('editWantslist'|'addItem'|'editItem'|'deleteItem')}  action
     * Operation to be executed
     * @param  {Object[]}  params Params of the request, view public functions for details
     * @return {Promise}  Operation result
     */
    async modifyWantList(idList, action, params) {
        const finalParams = Object.assign({}, params, { action });
        return this.api.makeCall(`wantslist/${idList}`, 'PUT', finalParams);
    }

    /**
     * Change the name of a want list
     * @param  {Number}  idList Id of the want list
     * @param  {String}  name   New name for the want list
     * @return {Promise}  Operation result
     */
    async changeName(idList, name) {
        return this.modifyWantList(idList, 'editWantslist', { name });
    }

    /**
     * Add items to the want list
     * @param  {Number}  idList Id of the want list
     * @param  {Object[]}  items Products or metaproducts to add
     * @return {Promise}  Operation result
     */
    async addItems(idList, items) {
        return this.modifyWantList(idList, 'addItem', items);
    }

    /**
     * Modify already stored wants
     * @param  {Number}  idList Id of the want list
     * @param  {Object[]}  wants Changed wants
     * @return {Promise} Operation result
     */
    async editWants(idList, wants) {
        return this.modifyWantList(idList, 'editItem', wants);
    }

    /**
     * Delete wants from a want list
     * @param  {Number}  idList Id of the want list
     * @param  {Object[]}  wants  List of wants to delete
     * @return {Promise}  Operation result
     */
    async deleteWants(idList, wants) {
        return this.modifyWantList(idList, 'deleteItem', wants);
    }

    /**
     * Delete a whole want list
     * @param  {Number}  idList If of the want list
     * @return {Promise} Operation result
     */
    async deleteList(idList) {
        return this.api.makeCall(`wantslist/${idList}`, 'DELETE');
    }
}

export default Wants;
