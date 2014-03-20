Template.postsList.helpers({
  hasMorePosts: function(){
    this.posts.rewind();
    return Router.current().limit() == this.posts.fetch().length;
  }
});
Template.postsList.rendered= function(){
	if(Router.current().limit()>5){
		window.scrollTo(0,document.body.scrollHeight);
	}
$('.typeahead').typeahead({
    name: 'Some name',
    local: ['test', 'abc', 'def']
});

};