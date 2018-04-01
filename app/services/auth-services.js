define(['app', './../services/httpServices'], function (app) {
    app.factory('authServices', ['$q', 'httpServices', '$window', function($q, httpServices, $window){
        return {
            authenticateUser: function(credentials){
                return httpServices.post('/authenticateUser', credentials);
            },
            registerUser: function (credentials) {
                return httpServices.post('/adduser', credentials);
            },
            validateEmailId: function(vid, emailid){
                return httpServices.get('/validate/'+vid+'/'+emailid);
            },
            resetPassword: function(credentials){
                return httpServices.post('/resetPassword', credentials);
            },
            changePassword: function(credentials){
                return httpServices.post('/api/changePassword', credentials);
            },
            logout: function () {
                return httpServices.post('/api/logout');
            }

        }
    }]);
});