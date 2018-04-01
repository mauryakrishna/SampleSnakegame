define(['app', 'JWT'], function (app, JWT) {
   app.factory('tokenServices', ['$window', function ($window) {

       JWT.defaults = {
           // The key used to store the token 
           key: 'JWT_TOKEN',
           // This is the official token to use for JWT but feel free to use another one if you want 
           tokenPrefix: 'Bearer ',
           // Where to store the token, by default localStorage 
           storage: $window.localStorage,
           // In Base64 url-safe mode, padding isn't mandatory, so we will disable it by default 
           // but you can force it by setting this param to true if you want 
           padding: false
       };

       return {
           isValidToken: function(){
               return JWT.validate(JWT.get());
           },
           getCurrentUser: function(){
               var token = JWT.remember();
               return token?token.claim:null;
           },
           getToken: function () {
               return JWT.get();
           },
           setToken: function (token) {
               if(token){
                   JWT.keep(token);
               }
           },
           removeToken: function () {
               JWT.forget();
           }
       }
   }]); 
});