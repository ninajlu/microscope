Template.lobby.waiting = function () {
  var players = Meteor.users.find({_id: {$ne: Meteor.userId()}, idle:{$ne: true}});

  return players;
};

Template.lobby.count = function () {
  var players = Meteor.users.find({_id: {$ne: Meteor.userId()}, idle:{$ne: true}});
  return players.count();
};