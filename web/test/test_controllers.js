/***************Events Controller****************/  
$(document).ready(function() {
  module('Controllers');
  test('Location Controller', function() {
    expect(1);
    var distance = ZWVR.locationController.distance(
      {latitude: 37.7750, longitude: -122.4183},
      {latitude: 38.5817, longitude: -121.4933}
    );
    var expected = 120.8;
    ok(Math.abs(distance - expected) / expected < 0.01, 
      'Distance; returned ' + distance + ' for expected value ' + expected);
  });
  test('Events Controller', function() {
    expect(12);
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

          //check sorts
          ZWVR.eventsController.sortBy(ZWVR.sorts.DATE);
          QUnit.delay(function() {
            ok(ZWVR.eventsController.filter(function(e,index) {
                return index > 0;
              }).every(function(event, index) {
                return Date.parse(event.get('date')) >= Date.parse(ZWVR.eventsController.toArray()[index].get('date'));
            }), 'sort by date');
       
            //distance sort
            var center = {latitude: 37.7750, longitude: -122.4183};
            QUnit.stub(ZWVR.locationController, 'withLocation', function(callback) {
              callback(center);
            });
            ZWVR.eventsController.sortBy(ZWVR.sorts.DISTANCE);
            QUnit.delay(function() {
              var sorted = ZWVR.eventsController.get('content').filter(function(e, index) {
                return index > 0;
              }).every(function(event, index) {
                var thisDistance = ZWVR.locationController.distance(center, {
                  latitude: parseFloat(event.get('lat')),
                  longitude: parseFloat(event.get('lon'))
                }); 
                var previousDistance = ZWVR.locationController.distance(center, {
                  latitude: parseFloat(ZWVR.eventsController.toArray()[index].get('lat')),
                  longitude: parseFloat(ZWVR.eventsController.toArray()[index].get('lon'))
                }); 
                return thisDistance >= previousDistance;
              });
              ok(sorted, 'sort by distance');
            }, function() {
              QUnit.release(ZWVR.locationController, 'withLocation');
            });
          });
        });
      });
    });
  });
});
