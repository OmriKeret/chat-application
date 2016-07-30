angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, userService, localStorageService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
    if (!$rootScope.user) {
      $scope.loginModal.show();
    }

  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.logErr = false;
    $scope.signErr = false;
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {

    $scope.userSignup = $scope.userSignup ? $scope.userSignup : {childCode:['']};
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(userToLogin) {
    userService.login(userToLogin)
      .then(function (loginInfo) {
        // success

        localStorageService.set('loginInfo', loginInfo.data);
        $rootScope.user = loginInfo.data.user;
        $scope.closeLogin();
      }, function (error) {
        console.log(error);
        $scope.logErr = true;
      });
  };

  $scope.signup = function(userToSignup) {
    userService.signup(userToSignup)
      .then(function (loginInfo) {
        // success
        localStorageService.set('loginInfo', loginInfo.data);
        $rootScope.user = loginInfo.data.user;
        $scope.closeLogin();
      }, function (error) {

        console.log(error);
        $scope.signErr = true;
      });
  }

})

.controller('childrenCtrl', function($scope, $rootScope, $ionicPopup, userService, childrenService, localStorageService) {
  $scope.childCode = {code: ''};
  $scope.flag = false;
  function init() {
    $scope.children = [];

    if (!$rootScope.user) {
      return;
    }
    $rootScope.user.childCode.forEach(function (code) {
      childrenService.getChild($rootScope.user.username, code).then(handleChild, handleError);
    });
  }

  function handleChild(result) {
    $scope.children.push({name: result.data.name, id: result.data.childCode});
  }

  function handleError(err) {
    console.log(err);
  }

  $rootScope.$watch('user', function () {
    init();
  });

  $scope.clickedAddChild = function() {
    $scope.flag = !$scope.flag;

    function continueAddingChild() {
      var newUser = angular.copy($rootScope.user);
      newUser.childCode.push($scope.childCode.code);
      var token = localStorageService.get('loginInfo').token;

      userService.update(newUser, token)
        .then(function (loginInfo) {
          // success
          localStorageService.set('loginInfo', loginInfo.data);
          $rootScope.user = loginInfo.data.user;

        }, function (error) {
          console.log(error);
          var alertPopup = $ionicPopup.alert({
            title: 'Faild to add child!',
            template: 'Please try again later'
          });
        });
    }
    function nosuchChild(err) {
      console.log(err);

      var alertPopup = $ionicPopup.alert({
        title: 'Faild to add child!',
        template: 'No child was found for the given code'
      });
    }
    if ($scope.childCode.code && !$scope.flag) {
      childrenService.getChildInfo($scope.childCode.code).then(continueAddingChild, nosuchChild);

    }
  }

})

.controller('childCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicPopup, childrenService) {

  debugger;
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.show($ionicLoading);

  function handleChild(result) {
    $scope.child = result.data;

    $scope.hide($ionicLoading);
  }

  function handleError(err) {
    $scope.hide($ionicLoading);

    var alertPopup = $ionicPopup.alert({
      title: 'Faild to fetch child data!',
      template: 'Please try again later'
    });
  }
    childrenService.getChild($rootScope.user.username, $stateParams.childCode).then(handleChild, handleError);
})

  .controller('ChatCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $timeout, Socket, Chat) {

    $scope.data = {};
    $scope.data.message = "";
    $scope.messages = Chat.getMessages();
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 250;

    Socket.on('connect',function(){

      Socket.emit('add user',$rootScope.user.username);
      Chat.setUsername($rootScope.user.username);

    });

    Chat.scrollBottom();

    if($stateParams.username){
      $scope.data.message = "@" + $stateParams.username;
      document.getElementById("msg-input").focus();
    }

    var sendUpdateTyping = function(){
      if (!typing) {
        typing = true;
        Socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();
      $timeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          Socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    };

    $scope.updateTyping = function(){
      sendUpdateTyping();
    };

    $scope.messageIsMine = function(username){
      return $rootScope.user.username === username;
    };

    $scope.getBubbleClass = function(username){
      var classname = 'from-them';
      if($scope.messageIsMine(username)){
        classname = 'from-me';
      }
      return classname;
    };

    $scope.sendMessage = function(msg){
      Chat.sendMessage(msg);
      $scope.data.message = "";
    };

  });
