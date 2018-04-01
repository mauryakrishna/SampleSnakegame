define(['app'], function(app){
    app.controller('changePasswordController', ['$scope', 'authServices', 'tokenServices', function($scope, authServices, tokenServices){
        $scope.changepassword = {};

        $scope.bChangePasswordSuccess = false;
        $scope.bErrorChangePassword = false;

        $scope.changePasswordFn = function() {
            authServices.changePassword($scope.changepassword)
                .then(function(data){
                    $scope.bChangePasswordSuccess = data.success;
                    $scope.changepassword = {};
                    $scope.bErrorChangePassword = !data.success;
                }, function (err) {
                    //something unexpected happened
                    $scope.bErrorChangePassword = true;
                    console.log('Change password error: ', err);
                })
        };
    }]);
});
