define(['app', './play-services'], function (app) {
    app.controller('playController', ['playServices', 'localStorageServices', '$scope', '$state', 'tokenServices', function (playServices, localStorageServices, $scope, $state, tokenServices) {
        $scope.score = 0;
        //this will work when loading the page for the first time
        //get scores from local storage
        $scope.allscores = localStorageServices.getScore('allscores');

        /* $scope.allPlayerScore = []; */

        $scope.bCollision = false;

        $scope.bSavingInProgress = false;
        $scope.resetScoreFlag = function () {
            $scope.bScoreSaved = false;
            $scope.bErrorSavingScore = false;
        };

        //done to update score message displaying flags
        $scope.resetScoreFlag();

        $scope.userLoggedIn = tokenServices.isValidToken();
        var userDisplayName = tokenServices.getCurrentUser();
        $scope.welcomeMsg = 'Welcome ' + (userDisplayName ? userDisplayName.displayname : 'Guest');

        function triggerApply() {
            //below is not good idea,
            // number of variables are small so not much effect on performance,
            //did not found other solution
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.resetScore = function () {
            $scope.score = 0;
            triggerApply();
        };

        $scope.updateScore = function () {
            $scope.score++;
            triggerApply();
        };

        $scope.updateCollision = function (bFlag) {
            $scope.bCollision = bFlag;
            triggerApply();
        };

        $scope.saveScore = function () {
            //disable playing button while saving is in progress
            $scope.bSavingInProgress = true;
            playServices.saveScore($scope.score)
                .then(function (data) {
                    //$scope.bCollision = false;
                    //show msg that score has been saved
                    $scope.bScoreSaved = true;
                    $scope.bSavingInProgress = false;
                    //score has been saved reset the scre to zero
                    $scope.resetScore();
                    //enable playing button after save
                    console.log('score saved');
                }, function (err) {
                    //show msg error saving the score
                    $scope.bErrorSavingScore = true;

                    //enable playing button after save
                    console.log('score saved error');
                });
        };

        $scope.logout = function () {
            playServices.logout()
                .then(function (data) {
                    if (data.success) {
                        tokenServices.removeToken();
                        $state.go('play');
                        $state.reload();
                    }
                }, function (err) {
                    console.log('Error logging out');
                });
        };

        //store the new array of scores in local storage upon game over
        $scope.pushNewScoreToArray = function(score){
            $scope.allscores.push({date: new Date(), score: score});

            $scope.allscores.sort(function(a, b){return b.score - a.score});

            if($scope.allscores.length>10){
                $scope.allscores.pop();
            }

            localStorageServices.saveScore('allscores', $scope.allscores);
            triggerApply();
        };

        //load scores by default
        $state.go('play.scores');//, {}, { location: false }

    }]);
});