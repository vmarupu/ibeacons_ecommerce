var app1 = angular.module('starter.controllers', [])

var db = new PouchDB("beacon");
//Controller for Introduction page the page will be displayed only once after installing app for the first time
app1.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $location, $rootScope) {
  // Lets create a function
  // That will go to state main
  $scope.startApp = function() {

    $location.path('/login').replace();

    window.localStorage.didTutorial = 'true';
  };
  // At the start of this controller
  // Lets check local storage for didTutorial
  if (window.localStorage.didTutorial === 'true') {
    // If it we did do the tutorial, lets call
    // $scope.startApp
    $scope.startApp();
  } else {}

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})
//Controller is for menu.html page
app1.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $ionicPlatform, $cordovaBeacon, $http, $location, $ionicPopup) {
  $scope.check = function() {
    $location.path('app/search');
    $scope.enableBT = function() {
      cordova.plugins.locationManager.isBluetoothEnabled()
        .then(function(isEnabled) {
          //alert("bluetooth>>"+isEnabled);
          console.log("isEnabled: " + isEnabled);
          if (isEnabled) {
            //cordova.plugins.locationManager.disableBluetooth();
            $location.path('app/search');
          } else {
            $location.path('app/search');
            var confirmPopup = $ionicPopup.confirm({
              title: 'Turn on bluetooth first',
              template: 'Are you sure you want to turn on bluetooth?'
            });
            confirmPopup.then(function(res) {
              if (res) {
                cordova.plugins.locationManager.enableBluetooth();
              } else {
                //Write app close functionality
              }
            });
          }
        }).fail(function(e) {
          console.error(e);
        }).done();
    }
  };
})
//Search controller
app1.controller("searchCtrl", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $http, $cordovaLocalNotification, localNotificationService) {
  $scope.beacons = {};
  var mArray = new Array();
  mArray[0] = '';
  var flag = 'ok';
  $ionicPlatform.ready(function() {
//Detect the beacons and send the notification
    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
      var uniqueBeaconKey;
      var proxy = "ProximityNear";
      for (var i = 0; i < pluginResult.beacons.length; i++) {
        uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
        $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];

        if (mArray[0] === '') {
          mArray[0] = pluginResult.beacons[i].major;
        } else if (mArray[0] === pluginResult.beacons[i].major) {
          flag = 'no';
        } else {
          mArray[0] = pluginResult.beacons[i].major;
          flag = 'ok';
        }
        if (flag === 'ok') {
          db.get(pluginResult.beacons[i].major).then(function(data) {
            $scope.section_id = data.sectionid;
            var ltitle = "Beacons";

            $http.get("http://192.168.1.209/wcs/resources/store/10451/productview/byCategory/" + $scope.section_id)
              .then(function(response) {
                //$rootScope.responseData = response.data.associatedPromotions[0];
                $rootScope.responseData = response.data;
                //  alert($rootScope.responseData.CatalogEntryView[0].shortDescription);
                //  alert($rootScope.responseData.CatalogEntryView[0].fullImage);
                //  	$rootScope.responseDescription=response.data.CatalogEntryView[0].shortDescription;
                //alert($rootScope.responseData);
                localNotificationService.scheduleSingleNotification(ltitle);
              })
          })
        }
      }
      $scope.$apply();
    });
    $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "b9407f30-f5f8-466e-aff9-25556b57fe6d"));
  });
})
//logout controller,for logout button we used this controller which is in menu.html
app1.controller('logoutCtrl', function($scope, $location) {
    $scope.logout = function() {
      $location.path('/login');
    }
  })
  //Login controller
app1.controller('loginCtrl', function($scope, $location, $http, $ionicPopup, backcallFactory) {
    backcallFactory.backcallfun();
    //Authenticate the user through the salesforce URL
    $scope.userlogin = function(authorization) {
      $scope.user = authorization.username;
      $scope.pswd = authorization.password;
      $http.post("https://login.salesforce.com/services/oauth2/token?client_id=3MVG9ZL0ppGP5UrBJaFyni5._ZxU7HHY81xwT6bj1d4agZ.JmRIRuBN.pY0g9B10n131eXwLviQufua8qG2Nc&client_secret=7190663636670339387&username=basha37@miraclesoft.com&password=7842543784Ch@nE6fnWoMmQep6XPdMyIlKZzLj&grant_type=password").then(function(response) {

        switch (response.status) {
          case 200:
            access = response.data.access_token;
            break;
          case 400:
            // Tell them they are missing data
            break;
          case 401:
            // Tell them the creds are incorrect
            break;
          case 500:
            // Tell them the server had a problem
            break;
        }
        if (response.status == 200) {
          access = response.data.access_token;

          $location.path('app/profile');
          console.log(JSON.stringify(response.data.access_token));
          console.log(response.data);
        } else {
          // invalid response
          console.log("error:" + response.data);
        }
      }, function(error) {
        $ionicPopup.confirm({
          title: "Miracle ME alerts you",
          content: "Invalid username and password."
        })
        console.log('We have an error' + JSON.stringify(error));
      });
    }
  })
  //Profile controller
app1.controller('profileCtrl', function($scope, $rootScope, $http) {
    $scope.getDetails = function() {
      $rootScope.token = access;
      var config = {
        headers: {
          'Authorization': 'Bearer ' + $rootScope.token
        }
      }
      $http.get("https://ap2.salesforce.com/services/apexrest/details/skbasha467@gmail.com", config)
        .then(function(success) {
          $scope.firstname = "FirstName: " + success.data.customer.firstname;
          $scope.lastname = "LastName: " + success.data.customer.lastname;
        })
    }
  })
  // Recent orders controller
app1.controller('recentordersCtrl', function($scope, $location, $http, $rootScope) {
    $scope.getFullData = function() {
      $http.get("http://192.168.1.209/wcs/resources/store/10451/productview/byCategory/10008")
        .then(function(response) {
          $rootScope.responseData = response.data;
          alert($rootScope.responseData.CatalogEntryView[0].fullImage);
        })
    }
  })
  //PouchDB controller, insert the data in JSON format
app1.controller('pouchdbCtrl', function($scope, $location) {
  $scope.Insert = function(name) {
    var data = {
      "_id": name.major,
      "uuid": name.uuid,
      "major": name.major,
      "minor": name.minor,
      "storeid": name.storeid,
      "sectionid": name.sectionid,
      "url": name.url
    }
    db.post(data);
    $location.path('app/search');
  }
});
//To exit from the home page
app1.factory('backcallFactory', ['$state', '$ionicPlatform', '$ionicHistory', '$timeout', function($state, $ionicPlatform, $ionicHistory, $timeout) {
  var obj = {}
  obj.backcallfun = function() {
      $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "login") {
          navigator.app.exitApp(); //<-- remove this line to disable the exit
        } else {
          navigator.app.backHistory();
        }
      }, 100);
    } //backcallfun
  return obj;
}]);
