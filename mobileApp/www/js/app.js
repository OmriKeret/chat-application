// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','btford.socket-io', 'chart.js', 'LocalStorageModule', 'starter.services', 'starter.controllers'])
  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
  })
.run(function($ionicPlatform, $rootScope, localStorageService) {
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

  if (localStorageService.get('loginInfo')) {
    $rootScope.user = localStorageService.get('loginInfo').user;
  }



})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.chats', {
    url: '/chats',
    views: {
      'menuContent': {
        templateUrl: 'templates/chats.html',
        controller: 'ChatCtrl'
      }
    }
  })

    .state('app.children', {
      url: '/children',
      views: {
        'menuContent': {
          templateUrl: 'templates/children.html',
          controller: 'childrenCtrl'
        }
      }
    })

  .state('app.child', {
    url: '/children/:childCode',
    views: {
      'menuContent': {
        templateUrl: 'templates/child.html',
        controller: 'childCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/children');
});

