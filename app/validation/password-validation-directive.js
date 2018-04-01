define(['app'], function(app){
    app.directive('passwordValidation', [function(){
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function(scope, element, attr, ngModel){
                var validatePassword = function(value) {
                    ngModel.$setValidity('valid', !(value.length < 6 || value.length > 200));
                    return value;
                };

                ngModel.$parsers.push(validatePassword);
            }
        };
    }]);
});