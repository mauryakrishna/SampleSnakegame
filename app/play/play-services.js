define(['app', './../services/httpServices'], function(app){
    'use strict';
    app.factory('playServices', ['httpServices', function(httpServices){
        return {
            getRandomDirection: function(){
                //to get started with random direction
                return Math.floor(Math.random()*(4)+37);
            },
            getRandomCoordinates: function(height, squareWidth){
                return (Math.floor(Math.random() * height)%squareWidth)*squareWidth;
            },
            saveScore: function (score) {
                return httpServices.post('/api/saveScore', {score:score});
            },
            getScore: function (bAllPlayer) {
                return httpServices.post('/api/getScore', {allPlayer:bAllPlayer});
            },
            logout: function () {
                return httpServices.post('/api/logOut');
            }
        };
    }])
});