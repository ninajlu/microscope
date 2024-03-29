Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  limit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    console.log(this.findOptions());
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
      nextPath: this.nextPath()
    };
  }
});

NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
  }
});
QueryPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  data: function() {
    return {
      posts: Posts.find({tags:this.params.search}, this.findOptions()),
      query: this.params.search,
      nextPath: this.nextPath()
    };
  },
  nextPath: function() {
    return Router.routes.queryPosts.path({postsLimit: this.limit() + this.increment})
  }
});
BestPostsListController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.limit() + this.increment})
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewPostsListController
  });
  
  this.route('newPosts', {
    path: '/new/:postsLimit?',
    controller: NewPostsListController
  });
  this.route('queryPosts', {
    path: '/query/:search?/:postsLimit?',
    controller: QueryPostsListController
  });
  this.route('bestPosts', {
    path: '/best/:postsLimit?',
    controller: BestPostsListController
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() { return Posts.findOne(this.params._id); }
  });
  this.route('userCard', {
    path: '/profile/:_id',
    waitOn: function() {
        Meteor.subscribe('singleUser', this.params._id);
    },
    data: function() {
      console.log(this); 
      console.log(Meteor.users.findOne(this.params._id));
      return Meteor.users.findOne(this.params._id); }
  });
  this.route('userCardFromPost', {
    path: '/profile/:userId',
    waitOn: function() {
        Meteor.subscribe('singleUser', this.params._userId);
    },
    data: function() { 
      console.log(Meteor.users.findOne(this.params._userId));
      return Meteor.users.findOne(this.params._userId); }
  });
  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { 
      return Posts.findOne(this.params._id); }
  });
  
  this.route('postSubmit', {
    path: '/submit',
    disableProgress: true
  });
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    
    this.stop();
  }
}

Router.before(requireLogin, {only: 'postSubmit'});

Router.before(requireLogin, {only: 'profile'})
Router.before(function() { clearErrors() });
