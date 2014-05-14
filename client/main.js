Meteor.startup(function () {
	Session.set('run',false);
  Deps.autorun(function () {
  	Meteor.subscribe("userData");
    Meteor.subscribe("allUserData");
  if (Meteor.user() && Session.equals('run',false)) {
    if(Meteor.user().services.facebook){
    Meteor.call("updatefriends", Meteor.userId());
  	}
  	Session.set('run',true);
  }
});
    Meteor.setInterval(function() {
    if (Meteor.status().connected)
      Meteor.call('keepalive', Meteor.userId());
  }, 20*1000);
Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 70*1000; // 70 sec
  var remove_threshold = now - 60*60*1000; // 1hr  
  Meteor.users.update({last_keepalive: {$lt: idle_threshold}},
                 {$set: {idle: true}});

  // XXX need to deal with people coming back!
  // Players.remove({$lt: {last_keepalive: remove_threshold}});

}, 30*1000);
});
Meteor.publish('online', function () {
    return Meteor.users.find({_idle:false}, {fields: {'last_keepalive':1,'idle':1, 'profile':1, 'services':1,'friends': 1, 'picture': 1}});
});

