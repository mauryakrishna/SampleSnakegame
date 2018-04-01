define(['app', 'angular'], function(app, ng){
    app.factory('localStorageServices', ['$window', function($window){
        var localStorage = $window.localStorage;
        return {
            saveScore: function(key, scoresArray) {
                localStorage.setItem(key, ng.toJson(scoresArray));
            },
            getScore: function(key) {
                var value = localStorage.getItem(key);
                return value?ng.fromJson(value):[];
            },
            removeScore: function(key){
                localStorage.removeItem(key);
            }
        }
    }]);
});
