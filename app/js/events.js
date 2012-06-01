EV = Events = Ember.Application.create();

EV.eventsController = Ember.ArrayController.create({
	content: [],

	/**
	  * Load upcoming events
		*/
	loadUpcoming: function() {
		$.get('/api/events', function(data) {
			EV.eventsController.set('content',data);
		});
	} 
});

EV.listView = Ember.CollectionView.create({
	contentBinding: Ember.Binding.oneWay('EV.eventsController.content'),
	tagName: 'ul',
	itemViewClass: Ember.View.extend({templateName: 'list-item'})
});
/*
EV.mapView = Ember.View.create({
	locationsBinding: 'EV.eventsController.content',
});
*/
