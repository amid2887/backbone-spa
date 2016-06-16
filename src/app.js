define(['jquery', 'backbone', './base/layout'], function ($, Backbone, Layout) {

    'use strict';

    /**
     * Convert query string parameters to an object
     * @param {String} query
     * @returns {{}}
     */
    function parseQuery(query) {
        var res = {};
        ('&' + (query || '')).replace(/&([^\[=&]+)(\[[^\]]*])?(?:=([^&]*))?/g, function (m, $1, $2, $3) {
            if ($2) {
                if (!res[$1]) {
                    res[$1] = [];
                }
                res[$1].push($3);
            } else {
                res[$1] = $3;
            }
        });
        return res;
    }

    /**
     * Returns moduleName, controllerName, actionName, searchParams
     * @param {String} path
     * @param {String} search
     * @returns {Array}
     */
    function extractRouteParameters(path, search) {
        var res = path && path.match(/([^/]+)/g);
        if (!res) {
            res = [];
        }
        res.length = ['moduleName', 'controllerName', 'actionName'].length;
        res.push(search);
        return res;
    }

    /**
     * Undef module and throw error
     * @param {String} modulePath
     * @param {Object} err
     */
    function throwModuleError(modulePath, err) {
        require.undef(modulePath);
        App.throwError(err);
    }

    /**
     * @returns {App|*}
     * @constructor
     */
    function App() {

        if (App.prototype._instance) {
            return App.prototype._instance;
        }

        App.prototype._instance = this;

        var el = document.getElementById('app');

        if (!el) {
            App.throwError('Element with id "app" is not exist');
        }

        this.layout = new Layout(el);

        var router = new (Backbone.Router.extend({

            routes: {
                //'(*module)(/*controller)(/*action((/)(?*params)))': 'defaultRoute'
                '*path': 'defaultRoute'
            },

            defaultRoute: function () {
                this.run.apply(this, extractRouteParameters.apply(null, arguments));
            },

            run: function (moduleName, controllerName, actionName, params) {

                moduleName = moduleName || 'index';
                controllerName = controllerName || 'index';
                actionName = actionName || 'index';
                params = parseQuery(params) || {};

                var appInstance = App.getInstance();

                appInstance.storeRoute(moduleName + '::' + controllerName + '->' + actionName + '(' + JSON.stringify(params) + ')');

                var modulePath = 'app/' + moduleName + '/' + controllerName;

                require([modulePath], function (Controller) {
                    try {
                        if (appInstance.controller) {
                            appInstance.controller.destroy();
                        }
                        appInstance.controller = new Controller();
                        appInstance.layout.setContent(appInstance.controller.dispatch(actionName, params));
                    } catch (e) {
                        throwModuleError(modulePath, e);
                    }
                }, throwModuleError.bind(null, modulePath));

            }

        }))();

        this.layout.$el.on('click', 'a[href^="/"]', function (e) {
            if (!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();

                if (Backbone.history.fragment === Backbone.history.getFragment(e.target.pathname)) {
                    // need to null out Backbone.history.fragment because
                    // navigate method will ignore when it is the same as newFragment
                    Backbone.history.fragment = null;
                }

                router.navigate(e.target.pathname + e.target.search, {trigger: true});

                return false;
            }
        });

        Backbone.history.start({
            root: '/',
            pushState: false,
            hashChange: true
        });

    }

    App.prototype.destroy = function () {
        Backbone.history.stop();
        this.layout.destroy();
        App.prototype._instance = null;
    };

    App.prototype.storeRoute = function (route) {
        return (this._storedRoute = route);
    };

    App.prototype.getStoredRoute = function () {
        return String(this._storedRoute).toUpperCase();
    };

    App.getInstance = function () {
        return new App();
    };

    /**
     * @param {Object|String} err
     * @param {String} [err.message]
     * @param {String} [err.stack]
     */
    App.throwError = function (err) {
        var inst = App.getInstance();
        var html = inst.getStoredRoute() + ': ' + (err.message || err);
        if (err.stack) {
            html += '\n' + err.stack;
        }
        var layout = inst.layout;
        if (layout && typeof layout.setContent === 'function') {
            layout.setContent('<pre>' + html + '</pre>');
        }
        throw new Error(err);
    };

    App.getInstance();
    return App;

});
