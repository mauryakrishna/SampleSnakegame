define(['app', 'jquery'], function (app, $) {
    app.directive('homeDirective', [function () {
        return {
            restrict: 'EA',
            templateUrl: './../home/home.html',
            controller: 'homeController',
            link: function (scope, element, attrs) {
                var popoverOptionsFixed = {
                    placement: 'right',
                    container: '.carousel',
                    trigger: 'focus'
                };

                var popoverOptsContents = popoverOptionsFixed;
                //set display name popover
                popoverOptsContents.content = 'This name will be visible in score board. ' +
                    'Should be combination of characters and number(optional), no special characters are allowed.';
                $('.register-form input[name="displayname"]', element[0]).popover(popoverOptsContents);

                //set email popover
                popoverOptsContents.content = 'Please provide active email id as it will be used for password recovery.';
                $('.register-form input[name="emailid"]', element[0]).popover(popoverOptsContents);

                //set password popover
                popoverOptsContents.content = 'Please select the strong password.';
                $('.register-form input[name="password"]', element[0]).popover(popoverOptsContents);

                //reset password form
                popoverOptsContents.content = 'Please enter the registered email id to receive the default password.';
                $('.reset-password-form input[name="emailid"]', element[0]).popover(popoverOptsContents);

                //play as guest button
                popoverOptsContents.content = 'Selecting this option, you will not be able to save score. And can not see scores of other players.';
                popoverOptsContents.trigger = 'hover';
                $('.signin-form [name="playasguest"]', element[0]).popover(popoverOptsContents);
                //units are in pixel
                scope.playBoardDimension = {
                    "height":'400px',
                    "width": '720px'
                };

            }
        }
    }
    ]);
});