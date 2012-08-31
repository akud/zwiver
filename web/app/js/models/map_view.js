/**
 * Ember wrapper around google map
 *
 * @requires app.js
 * @requires controllers/events_controller.js
 * @requires models/event.js
 */
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
        google.maps.event.addListener(evt.get('mapMarker'), 'click', function() {
          EV.eventsController.select(evt);
        });
      });
      if(EV.eventsController.toArray().length) {
        map.panTo(EV.eventsController.toArray()[0].get('position'));
      }
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
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }));
  }
});


