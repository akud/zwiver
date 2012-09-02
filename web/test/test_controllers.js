/***************Events Controller****************/  
(function($, QUnit, EV) {
  $(document).ready(function() {
    module('Controllers');
    test('Events Controller', function() {
      expect(11);
      var ev = EV.Event.create({
        title: 'test title',
        description: 'foo',
        lat: 32.534,
        lon: -123.324
      });
      EV.eventsController.select(ev);
      equal(EV.eventsController.get('selectedEvent'), ev, 
        'selects correct event');
      QUnit.stop();
      setTimeout(function(){
        var length = EV.eventsController.get('length');
        ok(!!length, 'Controller loads content on init')
        ok(EV.eventsController.everyProperty('title'), 'Every event has a title');
        ok(EV.eventsController.everyProperty('date'), 'Every event has a date');
        ok(EV.eventsController.everyProperty('id'), 'Every event has an id');

        var initialIds = EV.eventsController.map(function(evt){return evt.get('id');});

        //check sorts
        EV.eventsController.sortBy(EV.sorts.DATE);
        QUnit.stop();
        setTimeout(function() {
          ok(EV.eventsController.filter(function(e,index) {
              return index > 0;
            }).every(function(event, index) {
              return Date.parse(event.get('date')) >= Date.parse(EV.eventsController.toArray()[index].get('date'));
          }), 'sort by date');
          QUnit.start();
        }, 20);


        //check loadNext/loadPrevious
        EV.eventsController.loadNext();
        QUnit.stop();
        setTimeout(function() {
          equal(EV.eventsController.get('length'), length, 
            'loadNext() returns the same number of events as initial load')
          //qunit doesn't have a notDeepEqual(), so we have to go through 
          //some contortions to check that loadNext() actually returned a separate 
          //set of ids
          //for every event loaded by loadNext()...
          ok(EV.eventsController.every(function(evt) {
            //it should be true that for every event in the initial load...
            return initialIds.every(function(id) {
              //that event is not equal to the current one
              return id != evt.get('id');
            });
          }), 'loadNext returns a different set of ids');
          ok(EV.eventsController.get('previousUrl'), 'loadNext() sets the prev url');

          EV.eventsController.loadPrevious();
          QUnit.stop();
          setTimeout(function() {
            equal(EV.eventsController.get('length'), length, 
              'loadPrevious() returns same number of events as initial load')
            var ids = EV.eventsController.map(function(evt){return evt.get('id');})
            deepEqual(ids, initialIds, 'loadPrevious returns the previous list of events');
            QUnit.start();
          }, 250);
          QUnit.start(); 
        }, 250);
        QUnit.start();
      }, 50);
    });
  });
})(jQuery, QUnit, EV);


