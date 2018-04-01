define(['app', 'jquery'], function(app, $){
    app.directive('validateemailidDirective', [function() {
        return {
            restrict: 'EA',
            templateUrl: './../validateemailid/validateemailid.html',
            scope: false,
            controller: 'validateemailidController'
        }
    }])
});
