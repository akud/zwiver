EV = Events = Ember.Application.create();

EV.Event = Ember.Object.extend({
	maxDescriptionLength: 140,
	position: function() {
		return new google.maps.LatLng(this.get('lat'),this.get('lon'));
	}.property('lat','lon').cacheable(),

	shortDescription: function() {
		var desc = this.get('description') || '';
		var maxLength = this.get('maxDescriptionLength');
		return desc.length < maxLength ? desc : desc.substring(0,maxLength) + '...';
	}.property('description').cacheable()
});

EV.eventsController = Ember.ArrayController.create({
	content: [],
	/**
	  * Load upcoming events
		*/
	init: function() {
		this._super();
		$.get('/api/events', function(data) {
			EV.eventsController.set('content', data.map(function(item) {
				return EV.Event.create(item);
				})
			);
		});
	} 
});

EV.listView = Ember.CollectionView.create({
	contentBinding: Ember.Binding.oneWay('EV.eventsController.content'),
	tagName: 'ul',
	classNames: ['event-list','unstyled'],
	itemViewClass: Ember.View.extend({
		templateName: 'list-item',
		classNameBindings: ['itemClass','selected'],
		itemClass: 'list-item',
		selected: false,
		click: function(evt) {
			EV.listView.get('childViews').invoke('set','selected',false);
			this.set('selected', true);
			EV.mapView.set('center',this.get('content').get('position'));
		}
	})
});

EV.mapView = Ember.View.create({
	contentBinding: Ember.Binding.oneWay('EV.eventsController.content'),
	map: null,
	mapOpts: { 
		center: new google.maps.LatLng(37.78,-122.442),
		zoom: 12,
		disableDefaultUI: true,
		zoomControl: true,
		panControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	},
	//content may be loaded before the map is ready,
	//so observe both properties
	markers: [],
	center: null,
	pointsObserver: function() {
		var markers = this.get('markers')
		var map = this.get('map');
		//reset markers, if any
		markers.forEach(function(marker){ marker.setMap(null); });
		markers.length = 0;
		//add new markers to map
		if(map) {
			this.get('content').forEach(function(item) {
				markers.push(new google.maps.Marker({
					map: map,
					position: item.get('position'),
					title: item.title
				}));
			});
		}
	}.observes('map','content.@each'),
	//pan the map to the center when it changes
	centerObserver: function() {
		var thisMap = this.get('map');
		if(thisMap) {
			thisMap.panTo(this.get('center'));
		}
	}.observes('center'),

	//initialize the map when we're appending to the dom
	appendTo: function(selector) {
		this._super(selector);
		this.set('map', 
			new google.maps.Map($(selector).get(0),	this.get('mapOpts')));
	}
});
