define(['app', 'angular_router'], function(app){
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

        $urlRouterProvider.otherwise("play");

        //to disable the hash appending in the url while navigating to other views
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/

        $stateProvider
            .state('play', {
                url:'/play',
                template: '<play-directive></play-directive>'
            })
            .state('play.signin', {
                url: '/signin',
                views: {
                    /*"@": {
                        url:'/play',
                        template: '<play-directive></play-directive>'
                    },*/
                    "signin": {
                        url:'/signin',/*signin*/
                        template: '<home-directive></home-directive>'
                    },
                    //keep the below view when login window popup
                    "": {
                        url:'/scores',
                        template: '<scores-directive></scores-directive>'
                    }
                }
            })
            .state('validate', {
                url: '/validate/:id/:emailid',
                template: '<validateemailid-directive></validateemailid-directive>'
            })
            .state('play.changePassword', {
                url: '/changePassword',
                templateUrl: 'changepassword/changepassword.html',
                controller: 'changePasswordController'
            })
            .state('play.scores', {
                url:'/scores',
                template: '<scores-directive></scores-directive>'
            })
    }]);

    app.config(['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push('authenticationInterceptor');
    }]);

    //below is the application wide exception handling code - https://blogs.msmvps.com/deborahk/exception-handling-in-an-angularjs-application/
    app.config(['$provide', function($provide){
        $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
            return function(exception, cause){
                $delegate(exception, cause);
            }
        }]);
    }]);
    app.run(['$rootScope', '$state', '$location', 'tokenServices', function ($rootScope, $state, $location, tokenServices) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            //if token is not valid, redirect to home
            /*if(tokenServices.isValidToken() && toState.name == 'play'){
                $state.go('play.scores');
                console.log(event, toState, toParams, fromState);
            }*/
        });

    }]);
});