define(['app'], function(app) {
    app.controller('validateemailidController', ['$state', 'authServices', '$scope',function ($state, authServices, $scope) {
        $scope.bValidating = true;
        authServices.validateEmailId($state.params.id, $state.params.emailid).then(function (data) {
            if(data.success){
                $scope.validationSuccess = true;
            }
            else {
                $scope.validationFailed = true;
            }
        }, function (err) {
            $scope.validationFailed = true;
        }).finally(function () {
            $scope.bValidating = false;
        });

        //redirect user to login page
        $scope.goToHome = function(){
            $state.go('/home');
        }
    }])
});