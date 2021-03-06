// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordovaBeacon', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
//Mention the states and controllers
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl'
      }
    }
  })

  .state('app.afterNotif', {
    url: '/afterNotif',
    views: {
      'menuContent': {
        templateUrl: 'templates/afterNotif.html',
          controller: 'afterNotifCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      params: {
           param1: null
       },
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'profileCtrl'
        }
      }
    })

    .state('app.recentorders', {
      url: '/recentorders',
      views: {
        'menuContent': {
          templateUrl: 'templates/recentOrders.html',
          controller: 'recentordersCtrl'
        }
      }
    })

    .state('app.pouchDB', {
      url: '/pouchDB',
      views: {
        'menuContent': {
          templateUrl: 'templates/pouchDB.html',
          controller: 'pouchdbCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro');
});
