requirejs.config({
    paths: {
        bootstrap: './lib/bootstrap/js/bootstrap.min',
        jquery: './lib/jquery-3.1.1',
        angular:'./lib/angular',
        angular_router:'./lib/angular-ui-router',
        JWT:'./lib/jwt-client',
        ngInfiniteScroll:'./lib/ng-infinite-scroll',
        moment:'./lib/moment.min',
        angularMoment:'./lib/angular-moment.min',
        angularAnalytics: './lib/angulartics.min',
        angularAnalyticsGA: './lib/angulartics-ga.min',
        hammer: './lib/hammer.min',//
        app:'./app',
        routes: './routes'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'ngInfiniteScroll': {
            deps:['angular']
        },
        'angularAnalytics': {
            deps: ['angular']
        },
        'angularAnalyticsGA': {
            deps: ['angular']
        },
        'angularMoment': {
            deps:['angular', 'moment']
        },
        'angular_router': {
            deps: ['angular']
        },
        'bootstrap':{
            deps: ['jquery']
        }
    }
});
require(['jquery', 'bootstrap', './bootstart'], function() {
    console.log('require bootstarted');
});
