angular.module('starter.services', [])
  .service('localNotificationService', function($rootScope, $http, $cordovaLocalNotification, $window, $location) {
    this.scheduleSingleNotification = function(ltitle) {
    //  alert("hi service called");
      //var r;
      //var proxy="ProximityNear";
      $cordovaLocalNotification.schedule({
        id: 1,
        title:  'Miracle ' + ltitle,
        text: 'beacon test msg' + $rootScope.responseData.CatalogEntryView[0].shortDescription,
        icon: 'http://192.168.1.209/wcsstore/null/images/catalog/blue1.jpg'
      }).then(function(result) {
        //$location.path('../tab2.html');
      });


      $rootScope.$on('$cordovaLocalNotification:click',
        function(event, notification, state) {
          // alert('hi on');
          // window.location.href = 'templates/browse.html';
          $location.path('app/afterNotif');
        });

      /*  $rootScope.$on('$cordovaLocalNotification:click',
        function (event, notification, state) {

           document.getElementById('description').innerHTML='<div style="margin: 10px; padding: 10px; background-color:#9bb9ff;">'+$rootScope.responseData.description.longDescription+'</div>';
           document.getElementById('description').style.display='block';
           document.getElementById('detailsDiv').style.display='none';
        });*/
    }
  })
