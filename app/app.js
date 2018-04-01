define([
    'angular',
    'angular_router',
    'ngInfiniteScroll',
    'angularMoment',
    'angularAnalytics',
    'angularAnalyticsGA'
], function(angular){
    'use strict';
    return angular.module('app', ['ui.router', 'infinite-scroll', 'angularMoment', 'angulartics', 'angulartics.google.analytics']);
});