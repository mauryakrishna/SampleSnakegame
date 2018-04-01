define(['app'], function (app) {
    app.directive('scoresDirective', ['playServices', '$window', '$timeout', function (playServices, $window, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: './../scores/scores.html',
            scope: false,
            controller: 'scoresController',
            link: {
                post: function (scope, element, attrs) {
                    if(scope.userLoggedIn){
                        var youTopScoresElem = element.find('a.your-top-scores');
                        youTopScoresElem.on('click', function(){
                            scope.userTop10Scores();
                        });
                    }

                    //the below code for finding the top ten element was happening before the element renders
                    $timeout(function(){
                        var topTenAllPlayer = element.find('a.top-ten-all-player');
                        if(topTenAllPlayer.length==1) {
                            topTenAllPlayer.on('click', function(){
                                scope.allPlayerTopScores();
                            });
                        }
                    }, 0);
                }
            }
        };
    }]);
});