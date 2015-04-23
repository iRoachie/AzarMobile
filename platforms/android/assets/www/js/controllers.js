angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $state, $window) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.request = "";

  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      ref = new Firebase('https://azarmobiledev.firebaseio.com/users/' + authData.uid);
      ref.on("value", function(snapshot) {
        $scope.firstName = snapshot.val().firstName;
        $scope.lastName = snapshot.val().lastName;
        $scope.major = snapshot.val().major;
        $scope.minor = snapshot.val().minor;
        $scope.id = snapshot.val().id;
      })

    } else {
      console.log("User is logged out");
      $scope.firstName = "Guest";
      $scope.lastName = "";
    }
  }

  // Register the callback to be fired every time auth state changes
  var ref = new Firebase("https://azarmobiledev.firebaseio.com");
  var authData = ref.getAuth();
  ref.onAuth(authDataCallback);

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showProfile = function() {
    if (ref.getAuth()) {
      $state.go('app.profile')
    } else {
      $scope.modal.show();
      $scope.request = "Profile";
    }
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.logOut = function() {
    ref.unauth();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
    $scope.loginData.email = "";
    $scope.loginData.password = "";
  };

  //Log in failed
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'Email address or password is incorrect.'
    });
    alertPopup.then(function(res) {
      $scope.loginData.email = "";
      $scope.loginData.password = "";
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");

    ref.authWithPassword({
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }, function(error, authData) {
      if (error) {
        $scope.showAlert();
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $scope.closeLogin();

        switch ($scope.request) {
          case "Grades":
            $scope.showGrades();
            break;
          case "Schedule":
            $scope.showSchedule();
            break;
          case "Profile":
            $scope.showProfile();
            break;
        }
      }
    });
  };

  $scope.showGrades = function() {
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");
    var authData = ref.getAuth();

    if (authData) {
      $state.go('app.grades')

    } else {
      $scope.request = "Grades";
      $scope.login();
    }
  };

  $scope.showSchedule = function() {
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");
    var authData = ref.getAuth();

    if (authData) {
      $state.go('app.schedule')

    } else {
      $scope.request = "Schedule";
      $scope.login();
    }
  };
})

.service('saveNews', function() {
  var savedItem;
  this.setClickedItem = function(item) {
    this.savedItem = item;
  }

  this.getClickItem = function() {
    return this.savedItem;
  }
})

.factory("newsItems", ['$firebaseArray',
  function($firebaseArray) {
    var ref = new Firebase('https://azarmobiledev.firebaseio.com/news');
    return $firebaseArray(ref);
  }
])

.factory("grades", ['$firebaseArray',
  function($firebaseArray) {
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");
    var authData = ref.getAuth();

    ref = new Firebase('https://azarmobiledev.firebaseio.com/users/' + authData.uid + "/grades");
    return $firebaseArray(ref);
  }
])

.factory("events", ['$firebaseArray',
  function($firebaseArray) {
    ref = new Firebase('https://azarmobiledev.firebaseio.com/events');
    return $firebaseArray(ref);
  }
])

.factory("courses", ['$firebaseArray',
  function($firebaseArray) {
    (function() {
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      Date.prototype.getMonthName = function() {
        return months[this.getMonth()];
      };
      Date.prototype.getDayName = function() {
        return days[this.getDay()];
      };
    })();

    var now = new Date();

    var day = now.getDayName();

    var ref = new Firebase("https://azarmobiledev.firebaseio.com");
    var authData = ref.getAuth();

    if (authData) {
      var userCoursesRef = new Firebase('https://azarmobiledev.firebaseio.com/users/' + authData.uid + "/courses");
      console.log($firebaseArray(userCoursesRef));

      userCoursesRef.child("0").child('times').orderByChild("day").equalTo(day).on("child_added", function(snapshot) {});
      return $firebaseArray(userCoursesRef);
    }

    return "";
  }
])

.controller('NewsCtrl', ['$scope', 'newsItems', 'saveNews', function($scope, newsItems, saveNews) {
  $scope.items = newsItems;

  $scope.detail = function(item) {
    saveNews.setClickedItem(item);
  }

  $scope.iconClass = function(category) {
    switch (category) {
      case "Cafeteria":
        return "icon ion-fork"
        break;
      case "Graduate":
        return "icon ion-university"
        break;
      default:
        return "icon ion-clipboard"
        break;
    }
  }
}])

.controller('NewsDetailCtrl', ['$scope', 'saveNews', function($scope, saveNews) {
  var item = saveNews.getClickItem();

  $scope.category = item.category;
  $scope.title = item.title;
  $scope.sender = item.sender;
  $scope.date = item.date;
  $scope.message = item.message;
}])

.controller('GradesCtrl', function($scope, grades) {
  $scope.semesters = grades;
})

.controller('CourseCtrl', function($scope, $ionicModal, courses) {
  $scope.courses = courses;

  (function() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    Date.prototype.getMonthName = function() {
      return months[this.getMonth()];
    };
    Date.prototype.getDayName = function() {
      return days[this.getDay()];
    };
  })();

  var now = new Date();

  var day = now.getDayName();
  var month = now.getMonthName();

  $scope.course = ""

  $scope.date = new Date().getDate();
  $scope.day = day;
  $scope.month = month;
  $scope.year = new Date().getFullYear();

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/course.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeInfo = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.courseInfo = function(course) {
    $scope.course = course;
    $scope.modal.show();
  };
})

.controller('EventsCtrl', function($scope, events) {
  $scope.events = events;

})
