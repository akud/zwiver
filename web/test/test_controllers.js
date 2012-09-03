/***************Events Controller****************/  
$(document).ready(function() {
  module('Controllers');
  test('Events Controller', function() {
    expect(11);
    var ev = ZWVR.Event.create({
      title: 'test title',
      description: 'foo',
      lat: 32.534,
      lon: -123.324
    });
    ZWVR.eventsController.select(ev);
    equal(ZWVR.eventsController.get('selectedEvent'), ev, 
      'selects correct event');
    QUnit.delay(50, function() {
      var length = ZWVR.eventsController.get('length');
      ok(!!length, 'Controller loads content on init')
      ok(ZWVR.eventsController.everyProperty('title'), 'Every event has a title');
      ok(ZWVR.eventsController.everyProperty('date'), 'Every event has a date');
      ok(ZWVR.eventsController.everyProperty('id'), 'Every event has an id');

      var initialIds = ZWVR.eventsController.getEach('id');

      //check sorts
      ZWVR.eventsController.sortBy(ZWVR.sorts.DATE);
      QUnit.delay(function() {
        ok(ZWVR.eventsController.filter(function(e,index) {
            return index > 0;
          }).every(function(event, index) {
            return Date.parse(event.get('date')) >= Date.parse(ZWVR.eventsController.toArray()[index].get('date'));
        }), 'sort by date');
      });


      //check loadNext/loadPrevious
      ZWVR.eventsController.loadNext();
      QUnit.delay(300, function() {
        equal(ZWVR.eventsController.get('length'), length, 
          'loadNext() returns the same number of events as initial load')
        //qunit doesn't have a notDeepEqual(), so we have to go through 
        //some contortions to check that loadNext() actually returned a separate 
        //set of ids
        //for every event loaded by loadNext()...
        ok(ZWVR.eventsController.every(function(evt) {
          //it should be true that for every event in the initial load...
          return initialIds.every(function(id) {
            //that event is not equal to the current one
            return id != evt.get('id');
          });
        }), 'loadNext returns a different set of ids');
        ok(ZWVR.eventsController.get('previousUrl'), 'loadNext() sets the prev url');

        ZWVR.eventsController.loadPrevious();
        QUnit.delay(300, function() {
          equal(ZWVR.eventsController.get('length'), length, 
            'loadPrevious() returns same number of events as initial load')
          var ids = ZWVR.eventsController.map(function(evt){return evt.get('id');})
          deepEqual(ids, initialIds, 'loadPrevious returns the previous list of events');
        });
      });
    });
  });
});
