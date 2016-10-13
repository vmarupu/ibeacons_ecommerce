angular.module('starter.services', [])
/*This service is used to send the locsl notifications to mobiles*/
  .service('localNotificationService', function($rootScope, $http, $cordovaLocalNotification, $window, $location) {
    this.scheduleSingleNotification = function(ltitle) {
      /*Mention the details of local notification*/
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Miracle ' + ltitle,
        text: 'beacon test msg' + $rootScope.responseData.CatalogEntryView[0].shortDescription,
        icon: 'http://192.168.1.209/wcsstore/null/images/catalog/blue1.jpg'
      }).then(function(result) {});
/*The local notification will be displayed in particular page*/
      $rootScope.$on('$cordovaLocalNotification:click',
        function(event, notification, state) {
          $location.path('app/afterNotif');
        });
    }
  })
