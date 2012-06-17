EV = Events = Ember.Application.create();

EV.Event = Ember.Object.extend({
  maxDescriptionLength: 140,
  position: function() {
    return new google.maps.LatLng(this.get('lat'),this.get('lon'));
  }.property('lat','lon'),

  shortDescription: function() {
    var desc = this.get('description') || '';
    var maxLength = this.get('maxDescriptionLength');
    return desc.length < maxLength ? desc : desc.substring(0,maxLength) + '...';
  }.property('description'), 

  mapMarker: function() {
    return new google.maps.Marker({
      position: this.get('position'),
      title: this.get('title')
    });
  }.property('title','position'),

  infoWindowContent: function() {
    return '<div class="info-window-title">' + 
      this.get('title') + '</div>' +
      '<div class="info-window-content">' + 
      this.get('shortDescription') + '</div>';
  }.property('title','shortDescription'),

  infoWindow: function() {
    return new google.maps.InfoWindow({
      content: this.get('infoWindowContent'),
      position: this.get('position')
    });
  }.property('infoWindowContent','position')
});

EV.eventsController = Ember.ArrayController.create({
  content: [],
  selectedEvent: null,
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
  },
  select: function(evt) {
    if(this.get('selectedEvent')) {
      this.get('selectedEvent').get('infoWindow').close();
    }
    this.set('selectedEvent', evt);
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
      EV.eventsController.select(this.get('content'));
    }
  })
});

EV.mapView = Ember.View.create({
  map: null,
  //observes events list and draws markers
  //content may be loaded before the map is ready,
  //so observe both properties
  pointsObserver: function() {
    var markers = this.get('markers')
    var map = this.get('map');
    //add new markers to map
    if(map) {
      EV.eventsController.get('content').forEach(function(evt) {
        //TODO: click listener on markers for selecting the event
        evt.get('mapMarker').setMap(map);
      });
    }
  }.observes('map','EV.eventsController.content.@each'),
  
  selectedEventObserver: function() {
    var map = this.get('map');
    var selectedEvent = EV.eventsController.getPath('selectedEvent');
    if(map && selectedEvent) {
      map.panTo(selectedEvent.get('position'));
      selectedEvent.get('infoWindow').open(map);
    }
  }.observes('EV.eventsController.selectedEvent'),

  //initialize the map when we're appending to the dom
  appendTo: function(selector) {
    this._super(selector);
    this.set('map', new google.maps.Map($(selector).get(0),  { 
      //TODO: more intelligent center for the map
      center: new google.maps.LatLng(37.78,-122.442),
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      panControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }));
  }
});
