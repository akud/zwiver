/**
 * Controller for events.
 *
 * @requires app.js
 */
EV.eventsController = Ember.ArrayController.create({
  content: [],
  selectedEvent: null,
  nextUrl: EV.toApiUrl('/events'),
  previousUrl: null,
  /**
    * Load upcoming events
    */
  init: function() {
    this._super();
    this.loadNext();
  },
  select: function(evt) {
    if(this.get('selectedEvent')) {
      this.get('selectedEvent').get('infoWindow').close();
    }
    this.set('selectedEvent', evt);
  },
  loadNext: function() {
    this._load(this.get('nextUrl'));
  },
  loadPrevious: function() {
    this._load(this.get('previousUrl'));
  },
  //private
  _load: function(url) {
    $.get(url, function(data) {
      EV.eventsController.get('content').invoke('remove');
      EV.eventsController.set('content', data.events.map(function(item) {
        return EV.Event.create(item);
        })
      );
      EV.eventsController.set('nextUrl', EV.toApiUrl(data.nextUrl));
      EV.eventsController.set('previousUrl', EV.toApiUrl(data.prevUrl));
    });
  }
});


