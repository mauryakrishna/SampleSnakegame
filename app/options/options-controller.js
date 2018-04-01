define(['app'], function(app){
    app.controller('optionsController', ["$scope", "$state", function($scope, $state){
        //direct user to play as guest
        $scope.proceedToGame = function(){
            $state.go('play');
        }
    }]);
});