EV = Events = Ember.Application.create();

EV.eventsController = Ember.ArrayController.create({
	content: [],
	loadUpcoming: function() {
		$.get('/api/events', function(data) {
			EV.eventsController.set('content',data);
		});
	}
});

EV.listView = Ember.CollectionView.extend({
	contentBinding: 'EV.eventsController.content'
});
