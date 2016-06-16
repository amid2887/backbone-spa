define(['backbone', 'underscore', 'text!./templates/layout.tpl'], function (Backbone, _, layoutTemplate) {

    'use strict';

    var template = _.template(layoutTemplate);

    function getRenderData() {
        return {
            year: (new Date()).getFullYear()
        };
    }

    function Layout() {
        this.initialize.apply(this, arguments);
    }

    /**
     * @param {HTMLElement} element
     */
    Layout.prototype.initialize = function (element) {
        this.$el = $(element);
        this.$el.html(template(getRenderData()));

        this.$header = this.$el.find('#header');
        this.$sidebar = this.$el.find('#sidebar');
        this.$content = this.$el.find('#content');
        this.$footer = this.$el.find('#footer');
    };

    Layout.prototype.destroy = function () {
        this.$el.off().empty();
    };
    
    /**
     * @param {String} content
     * @returns {Layout}
     */
    Layout.prototype.setContent = function (content) {
        this.$content.html(content);
    };

    return Layout;

});
