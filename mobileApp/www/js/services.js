angular.module('starter.services', ['LocalStorageModule'])

    .service('userService', function ($http) {
        var service = this;
        var SERVER_URL = window.serveUrl || 'http://localhost:3000';

        service.login = function (user) {
            return $http.post(SERVER_URL +'/users/login', user);
        };

        service.update = function (user, token) {
          return $http.put(SERVER_URL +'/users/' + token, user);
        };

      service.signup = function(userToSignUp){
        return $http.post(SERVER_URL +'/users', userToSignUp);
      }
    })
  .service('childrenService', function ($http) {
    var service = this;
    var SERVER_URL = window.serveUrl || 'http://localhost:3000';

    service.getChild = function (username, childId) {
      return $http.get(SERVER_URL +'/users/' + username + '/childrens/' + childId);
    };

    service.getChildInfo = function (childId) {
      return $http.get(SERVER_URL +'/children/'+ childId);
    };

  })

  .factory('Socket', function(socketFactory){
    var myIoSocket = io.connect(window.serveUrl || 'http://localhost:3000');
    mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    return mySocket;
  })
  .factory('Users', function(){
    var usernames = [];
    usernames.numUsers = 0;

    return {
      getUsers: function(){
        return usernames;
      },
      addUsername: function(username){
        usernames.push(username);
      },
      deleteUsername: function(username){
        var index = usernames.indexOf(username);
        if(index != -1){
          usernames.splice(index, 1);
        }
      },
      setNumUsers: function(data){
        usernames.numUsers = data.numUsers;
      }
    };
  })
  .factory('Chat', function($ionicScrollDelegate, Socket, Users){

    var username;
    var users = {};
    users.numUsers = 0;

    var messages = [];
    var TYPING_MSG = '. . .';

    var Notification = function(username,message){
      var notification          = {};
      notification.username     = username;
      notification.message      = message;
      notification.notification = true;
      return notification;
    };

    Socket.on('login', function (data) {
      Users.setNumUsers(data);
    });

    Socket.on('new message', function(msg){
      addMessage(msg);
    });

    Socket.on('typing', function (data) {
      var typingMsg = {
        username: data.username,
        message: TYPING_MSG
      };
      addMessage(typingMsg);
    });

    Socket.on('stop typing', function (data) {
      debugger;
      removeTypingMessage(data.username);
    });

    Socket.on('user joined', function (data) {
      var msg = data.username + ' joined';
      var notification = new Notification(data.username,msg);
      addMessage(notification);
      Users.setNumUsers(data);
      Users.addUsername(data.username);
    });

    Socket.on('user left', function (data) {
      var msg = data.username + ' left';
      var notification = new Notification(data.username,msg);
      addMessage(notification);
      Users.setNumUsers(data);
      Users.deleteUsername(data.username);
    });

    var scrollBottom = function(){
      $ionicScrollDelegate.resize();
      $ionicScrollDelegate.scrollBottom(true);
    };

    var addMessage = function(msg){
      msg.notification = msg.notification || false;
      messages.push(msg);
      scrollBottom();
    };

    var removeTypingMessage = function(usr){
      for (var i = messages.length - 1; i >= 0; i--) {
        if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
          messages.splice(i, 1);
          scrollBottom();
          break;
        }
      }
    };

    return {
      getUsername: function(){
        return username;
      },
      setUsername: function(usr){
        username = usr;
      },
      getMessages: function() {
        return messages;
      },
      sendMessage: function(msg){

        scrollBottom();
        Socket.emit('new message', msg);
      },
      scrollBottom: function(){
        scrollBottom();
      }
    };
  })

  .factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'Y  ou on your way?',
      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

    return {
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });;



