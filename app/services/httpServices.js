define(['app'], function(app){
    app.factory('httpServices', ['$http','$q', function($http, $q){
        return {
            get: function(url, data){
                var deferred = $q.defer();
                $http.get(url, data).then(function(res){
                    deferred.resolve(res.data);
                }, function(err){
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            post: function(url, data){
                var deferred = $q.defer();
                $http.post(url, data).then(function(res){
                    deferred.resolve(res.data);
                }, function(err){
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }
    }]);
});