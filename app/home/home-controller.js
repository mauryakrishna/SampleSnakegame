define(['app'], function(app){
    app.controller('homeController', ["$scope", "$state", 'authServices', '$location', function($scope, $state, authServices, $location){
        $scope.register = {};
        $scope.login = {};
        $scope.resetpassword = {};
        $scope.register.bUserExists = false;
        $scope.bRegistering = false;
        function redirectToPlayView(){
            $state.go('play.scores');
            //reloading of page done to update the UI of logging effects -- temporary
            $state.reload();
        }

        $scope.registerUser = function(){
            //proceed for user registration only when all the field are provided
            if(!$scope.registerform.$valid){
                return;
            }
            $scope.bRegistering = true;
            authServices.registerUser($scope.register).then(function(data){
                //creation successful
                if(data.success){
                    $scope.register.bSuccessful = true;
                }
                else{
                    //user already exist
                    $scope.register.bUserExists = data.userExist;
                    $scope.register.bFailed = true;
                }
            }, function(){
                //user registration failed, display the reason on UI
                $scope.register.bFailed = true;
            }).finally(function(){
                $scope.bRegistering = false;
            });
        };

        $scope.registerAnotherUser = function(){
            $scope.register = {};
        };

        $scope.signInUser = function(){
            if(!$scope.loginform.$valid){
                return;
            }
            $scope.bLogging = true;
            authServices.authenticateUser($scope.login).then(function(data){
                if(data.success){
                    //redirect to play area
                    redirectToPlayView();
                }
                else {
                    $scope.login.bFailed = true;
                }
            }, function(err) {
                //display error message
                $scope.login.bFailed = true;
            }).finally(function(){
                $scope.bLogging = false;
            });
        };

        $scope.resetPassword = function(){
            if(!$scope.resetpasswordform.$valid){
                return;
            }

            $scope.bReseting = true;
            authServices.resetPassword($scope.resetpassword).then(function(data){
                if(data.success){
                    //reset password and display message to user
                    $scope.resetpassword.bSuccessful = true;
                }
                else {
                    //no account with given account found, or db updation failed
                    $scope.resetpassword.bFailed = true;
                }
            }, function(err){
                $scope.resetpassword.bFailed = true;
            }).finally(function(){
                $scope.bReseting = false;
            });
        };

        /*$scope.playAsGuest = function () {
            //redirect to play area
            redirectToPlayView();
        }*/
        //close the sign in modal box
        $scope.closeSignIn = function(){
            $state.go('play.scores');//, {}, { location: false }
        }
    }]);
});