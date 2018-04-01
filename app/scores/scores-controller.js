define(['app'], function(app){
    app.controller('scoresController', ['playServices', 'localStorageServices', '$scope', function(playServices, localStorageServices, $scope){
        $scope.userTop10 = true;
        $scope.allPlayerScore = [];

        $scope.userTop10Scores = function () {
            $scope.userTop10 = true;
            playServices.getScore(false)
                .then(function (data) {
                    $scope.allscores = data.scores;
                }, function (err) {
                    console.log('Top10Score error getting score');
                });
        };

        //when user is not logged in, load scores from local storage which is happening in play-controller.js
        if($scope.userLoggedIn){
            //default load the user top 10 scores to show upon page loading if user is logged in
            $scope.userTop10Scores();
        }

        $scope.allPlayerTopScores = function () {
            $scope.userTop10 = false;
            playServices.getScore(true)
                .then(function (data) {
                    $scope.allPlayerScore = data.scores;
                }, function (err) {
                    console.log('allplayer error getting score');
                })
        };

    }]);
});