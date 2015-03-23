angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup) {
  // Form data for the login modal
  $scope.loginData = {
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  //Log in failed
  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Error',
     template: 'Please enter both fields.'
   });
   alertPopup.then(function(res) {
     $scope.loginData.username = "";
     $scope.loginData.password = "";
   });
 };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    if(!$scope.loginData.username || !$scope.loginData.password) {
      $scope.showAlert();
    }
  };
})


.controller('CourseCtrl', function($scope, $ionicModal) {
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
  $scope.courseInfo = function() {
    $scope.modal.show();
  };
})
