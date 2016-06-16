define(['../../base/controller'], function (Controller) {

    'use strict';

    return Controller.extend({
        
        indexAction: function () {
            return JSON.stringify([].slice.call(arguments));
        }

    });

});
