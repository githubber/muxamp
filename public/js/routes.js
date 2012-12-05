var PlaylistRouter = Backbone.Router.extend({
	initialize: function() {
		this.lastUrl = false;
		this.on('all', function(router){
			var url = Backbone.history.getFragment();
			if (location != router.lastUrl) {
				router.lastUrl = url;
				if (_gaq) {
	    			_gaq.push(['_trackPageview', '/' + url]);
	    		}
			}
		});
	},

	routes: {
		"": "reset",
		":playlistID": "load" //load
	},

	load: function(playlistID) {
		var router = this;
		playlist.id = parseInt(playlistID) || false;
		return playlist.fetch().always(function(data) {
			if (data && data.id) {
				playlist.id = data.id;
			} else {
				playlist.id = false;
				router.navigate("", {trigger: true, replace: true});
			}
		});
	},

	reset: function() {
		playlist.reset();
		var result = $.Deferred().resolve();
		return result.promise();
	}
});


$(document).ready(function() {
	var router = new PlaylistRouter();
	var mainView = new MainView().render();
	var loadUnblock = function() {
		mainView.toggleBlock();
		playlist.off('sync', loadUnblock);	
	};
	playlist.on('sync', loadUnblock);
	playlist.on('sync', function(data) {
		var fragment = (data.id) ? data.id.toString() : "";
		router.navigate(fragment, {trigger: false});
	});
	Backbone.history.start({pushState: true});
});