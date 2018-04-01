define(['app'], function(app){
    app.directive('emailValidation', [function(){
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function(scope, element, attr, ngModel){
                //http://emailregex.com/ - source for email regex
                var emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
                var validateEmailID = function(value) {

                    ngModel.$setValidity('valid', emailValidation.test(value));
                    return value;
                };

                ngModel.$parsers.push(validateEmailID);
            }
        };
    }]);
});