define([
    'angular',
    'app',
    'routes',
    './validateemailid/validateemailid-directive',
    './validateemailid/validateemailid-controller',
    './validation/name-validation-directive',
    './validation/email-validation-directive',
    './validation/password-validation-directive',
    './validation/compare-to-validation-directive',
    './home/home-controller',
    './home/home-directive',
    './options/options-controller',
    './play/play-controller',
    './play/play-directive',
    './play/play-services',
    './changepassword/changepassword-controller',
    './scores/scores-directive',
    './scores/scores-controller',
    './services/token-services',
    './services/auth-interceptors',
    './services/auth-services',
    './services/local-storage-services'
], function(angular){
    console.log('bootstrap', document.title);
    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
});