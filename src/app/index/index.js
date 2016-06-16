define(['../../base/controller', 'underscore', 'text!./templates/index.tpl'], function (Controller, _, indexTemplate) {

    'use strict';

    function getRenderData() {
        return {
            time: (new Date()).toLocaleString()
        };
    }

    return Controller.extend({

        _title: 'INDEX MODULE :: INDEX CONTROLLER',

        indexAction: function () {
            return _.template(indexTemplate)(getRenderData());
        }

    });

});
