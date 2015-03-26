// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.UIStatusBarStyleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
        }
      }
    })

  .state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "templates/news.html",
        controller: "NewsCtrl"
      }
    }
  })

  .state('app.news-item', {
    url: "/news/news-item",
    views: {
      'menuContent': {
        templateUrl: "templates/news-item.html",
        // controller: "NewsDetailCtrl"
      }
    }
  })

  .state('app.events', {
    url: "/events",
    views: {
      'menuContent': {
        templateUrl: "templates/events.html"
      }
    }
  })

  .state('app.grades', {
    url: "/grades",
    views: {
      'menuContent': {
        templateUrl: "templates/grades.html"
      }
    }
  })

  .state('app.schedule', {
      url: "/schedule",
      views: {
        'menuContent': {
          templateUrl: "templates/schedule.html",
          controller: "CourseCtrl"
        }
      }
    })
    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
        }
      }
    })

  .state('app.profile', {
    url: "/settings/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
