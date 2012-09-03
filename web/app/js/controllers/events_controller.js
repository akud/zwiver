/**
 * Controller for events.
 *
 * @requires app.js
 * @exports ZWVR.eventsController
 */
(function(Ember, $, ZWVR) {
  ZWVR.eventsController = Ember.ArrayController.create({
    content: [],
    selectedEvent: null,
    nextUrl: ZWVR.toApiUrl('/events'),
    previousUrl: null,
    /**
      * Load upcoming events
      */
    init: function() {
      this._super();
      this.loadNext();
    },
    select: function(evt) {
      if(this.get('selectedEvent') && this.get('selectedEvent').get('infoWindow')) {
        this.get('selectedEvent').get('infoWindow').close();
      }
      this.set('selectedEvent', evt);
    },
    /**
      * sort the loaded events by the given sort parameter.
      * @param sort One of <code>ZWVR.sorts</code>. required. 
      */
    sortBy: function(sort) {
      switch(sort) {
        case ZWVR.sorts.DISTANCE:
          console.log('called sort by distance');
          break;
        case ZWVR.sorts.DATE:
          var sortedContent = $.merge([], this.get('content'));
          sortedContent.sort(function(left, right) {
            return Date.parse(left.get('date')) - Date.parse(right.get('date'));
          });
          this.set('content', sortedContent);
          break;
        default: 
          console.warn('called sort with unknown parameter ' + sort);
      }
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
        ZWVR.eventsController.get('content').invoke('remove');
        ZWVR.eventsController.set('content', data.events.map(function(item) {
          return ZWVR.Event.create(item);
          })
        );
        ZWVR.eventsController.set('nextUrl', ZWVR.toApiUrl(data.nextUrl));
        ZWVR.eventsController.set('previousUrl', ZWVR.toApiUrl(data.prevUrl));
      });
    }
  });
})(Ember, jQuery, ZWVR);
