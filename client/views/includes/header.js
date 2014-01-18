Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var active = _.any(args, function(name) {
      return Router.current().route.name === name
    });
    return active && 'active';
  },
  activeRoute: function(){
  	return Router.current().route.name=="queryPosts";
  }
});
Template.header.rendered = function () {
	//TODO: maybe we should cache this list (?)
	//TODO: limit query to the most popular tags
	var listOfTags = Meteor.tags.find({}, {reactive:false}).map(function (tag) {return tag.name});
	console.log(listOfTags);
$("input[name='search']").typeahead({
    source: listOfTags
  });
  $("input[name='search']").focus();
};
Template.header.events({
	'click .submit': function (event) {
		//TODO: find a way to tell Spark that we are
		//      actually removing the DOM elements
		console.log("hello");
		console.log($("input[name='search']").attr('value'));
		Router.go("/query/"+$("input[name='search']").attr('value')+"/10");
	}
});

