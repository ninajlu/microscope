Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});
Meteor.publish('singleUser', function(id) {
  return id && Meteor.users.find({_id:id}, {fields: {'last_keepalive':1,'idle':1, 'profile':1, 'services':1,'friends': 1, 'picture': 1}});
});

Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});
Meteor.publish('tags', function () {
  return Meteor.tags.find({});
});
Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};
  return user;
});
Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, {fields: {'last_keepalive':1,'idle':1, 'profile':1, 'services':1,'friends':1,'picture': 1}});
});
