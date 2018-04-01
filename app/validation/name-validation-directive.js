define(['app'], function(app){
    app.directive('nameValidation', [function(){
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function(scope, element, attr, ngModel){
                var validatUserName = function(value) {
                    ngModel.$setValidity('length', (value.length >= 2 && value.length <= 200) && /^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/gi.test(value));
                    return value;
                };

                ngModel.$parsers.push(validatUserName);
            }
        };
    }]);
});