define(['app', './../services/token-services'], function(app){
    app.factory('authenticationInterceptor', ['$location', 'tokenServices', function($location, tokenServices){
        return {
            request: function(config){
                config.headers = config.headers || {};
                if (tokenServices.isValidToken()) {
                    config.headers.Authorization = 'Bearer ' + tokenServices.getToken();
                }
                return config;
            },
            response: function(response) {

                if (response.status == 403) {
                    $location.url('/home');
                }
                if(response.data.success === true) {
                    tokenServices.setToken(response.data.token);
                }
                return response;
            },
            responseError: function(res){
                return res;
            }
        }
    }]);
});