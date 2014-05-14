function Facebook(accessToken) {
    this.fb = Meteor.require('fbgraph');
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    }
    this.fb.setOptions(this.options);
}
Facebook.prototype.query = function(query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function(done) {
        self.fb[method](query, function(err, res) {
            done(null, res);
        });
    });
    return data.result;
}

Facebook.prototype.getUserData = function() {
    return this.query('me');
}
Facebook.prototype.getFriendsData = function() {
    return this.query('/me/taggable_friends');
}
Facebook.prototype.getProfileData = function() {
    return this.query('/me/?fields=picture');
}
Meteor.methods({
    keepalive: function (player_id) {
    Meteor.users.update({_id: player_id},
                  {$set: {last_keepalive: (new Date()).getTime(),
                          idle: false}});
  },
    getUserData: function() {
        var fb = new Facebook(Meteor.user().services.facebook.accessToken);
        var data = fb.getUserData();
        return data;
    },
    getFriendsData: function() {   
    var fb = new Facebook(Meteor.user().services.facebook.accessToken);
    var data = fb.getFriendsData();
    return data;
	},
	updatefriends: function(userId){
		check(userId, String);

		var user=Meteor.user();
		var accessToken = user.services.facebook.accessToken,
		result,
		profile;
		result = Meteor.http.get("https://graph.facebook.com/me", {
			params: {access_token: user.services.facebook.accessToken}});
		var friends = Meteor.http.get("https://graph.facebook.com/me/taggable_friends", {
			params: {access_token: user.services.facebook.accessToken}});
		var pic = Meteor.http.get("https://graph.facebook.com/me/?fields=picture", {
			params: {access_token: user.services.facebook.accessToken}});
		//console.log(friends.data);
		console.log(pic.data);
		console.log(pic.data.picture.data);
		if ( !result.error && result.data ) {
			Meteor.users.update({_id: userId}, {
				$set: {
					'profile': result.data
				}
			});     
	    }
        // if successfully obtained facebook profile, save it off
        if(!friends.error && friends.data){  
        	Meteor.users.update({_id: userId}, {
        		$set: {
        			'friends': friends.data
        		}
        	});  
        	console.log("n");
        }
        // if successfully obtained facebook profile, save it off
        if(!pic.error && pic.data){  
        	Meteor.users.update({_id: userId}, {
        		$set: {
        			'picture': pic.data.picture.data
        		}
        	});  
        	        	console.log("n");
        }
	}
});