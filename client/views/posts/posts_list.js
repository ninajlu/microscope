Template.postsList.helpers({
  hasMorePosts: function(){
    this.posts.rewind();
    return Router.current().limit() == this.posts.fetch().length;
  }
});
Template.postsList.rendered= function(){
$('.typeahead').typeahead({
    name: 'Some name',
    local: ['test', 'abc', 'def']
});

};