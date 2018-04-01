define(['app'], function(app){
   app.directive('compareTo', [function(){
       return {
           require: "ngModel",
           scope: {
               otherModelValue: "=compareTo"
           },
           link: function(scope, element, attributes, ngModel) {

               ngModel.$validators.compareTo = function(modelValue) {
                   ngModel.$setValidity('valueMismatch', modelValue == scope.otherModelValue);
                   return modelValue;
               };

               /*scope.$watch("otherModelValue", function() {
                   ngModel.$validate();
               });*/
               //ngModel.$parsers.push(validateEmailID);
           }
       };
   }]);
});