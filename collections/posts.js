
Posts = new Meteor.Collection('posts');
Tags.TagsMixin(Posts);
Posts.allowTags(function (userId) {
    // only allow if user is logged in
    return !!userId;
});
Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title', 'message').length > 0);
  }
});
if(Meteor.isServer){
Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user(),
      postWithSameLink = Posts.findOne({url: postAttributes.url});
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");
    
    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');
    
    // check that there are no previous posts with the same link
    if (postAttributes.url && postWithSameLink) {
      throw new Meteor.Error(302, 
        'This link has already been posted', 
        postWithSameLink._id);
    }
    /* var result=HTTP.call("GET", "https://readability.com/api/content/v1/parser", {params: {url:postAttributes.url, token:"7985a81b635e503211fa5e3886bef7004588718e"}});
   var hey=JSON.parse(result.content);
    console.log(hey.lead_image_url);
   console.log(hey.title);
   var auth=hey.author;
   var ex=hey.excerpt;
   var cont=hey.content;
   console.log("hi");*/
    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      userId: user._id, 
      author: user.username, 
      submitted: new Date().getTime(),
      commentsCount: 0,
      upvoters: [], votes: 0,
      tags:[]
    });
    Meteor.users.update(user._id, {$inc: {postsCount: 1}});
    var postId = Posts.insert(post);
    console.log(post);
    return postId;
  },
  
  upvote: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");
    
    Posts.update({
      _id: postId, 
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
    Meteor.users.update(Posts.findOne(postId).userId, {$inc: {upvotesCount: 1}});
  }
});
}