define(['backbone'], function (Backbone) {

    'use strict';

    function Controller() {}

    Controller.extend = Backbone.Model.extend;

    Controller.prototype._title = '';

    Controller.prototype.constructor = Controller;

    Controller.prototype.initialize = function () {
        this.setTitle(this.getTitle());
    };
    
    Controller.prototype.destroy = function () {
        this._title = null;
        this._response = null;
    };
    
    Controller.prototype.notFoundAction = function () {
        throw new Error('Action doesn\'t exist');
    };

    Controller.prototype.preDispatch = function () {
        this.setResponse(null);
    };

    /**
     * @param {String} actionName
     * @param {Object} params
     */
    Controller.prototype.dispatch = function (actionName, params) {

        this.preDispatch.apply(this, arguments);

        var action = this[actionName + 'Action'];
        if (typeof action !== 'function') {
            action = this.notFoundAction;
        }
        this.setResponse(action.call(this, params));

        this.postDispatch.apply(this, arguments);

        return this.getResponse();

    };

    Controller.prototype.postDispatch = function () {
        this.updateDocumentTitle();
    };

    Controller.prototype.setResponse = function (response) {
        return (this._response = response);
    };

    Controller.prototype.getResponse = function () {
        return this._response;
    };

    Controller.prototype.updateDocumentTitle = function () {
        document.title = this.getTitle();
    };

    Controller.prototype.setTitle = function (title) {
        return (this._title = title);
    };

    Controller.prototype.getTitle = function () {
        return this._title;
    };

    return Controller;

});
