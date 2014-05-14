Accounts.ui.config({
  requestPermissions: {
    facebook:['user_likes','email', 'user_friends', 'user_education_history', 'user_groups', 'user_work_history']
  }
});
Meteor.subscribe('tags');