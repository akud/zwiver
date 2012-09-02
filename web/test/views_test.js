/********************List View******************/
(function($, start, stop, EV, Mock) {
  $(document).ready(function() {
    module('Views');
    test('ListView', function() {
      expect(12);
      equal(EV.listView.get('content'), EV.eventsController.get('content'), 
        'Controller Binding');
      
      //append to the dom
      EV.listView.appendTo('#qunit-fixture');

      stop();
      setTimeout(function() {
        equal($('#qunit-fixture li.list-item').length, 
          EV.eventsController.get('length'), 
          'appending creates list elements');  

        var childViews = EV.listView.get('childViews');
        ok(!!childViews.length, 'creates child views');

        //check click behavior
        ok(childViews.everyProperty('selected',false), 
          'views are unselected by default');
        ok(childViews.everyProperty('expanded',false), 
          'views are unexpanded by default');
        var clickedItem = $('#qunit-fixture li.list-item:first-child span.show-more')
          .click();
        stop();
        setTimeout(function() {
          ok(childViews[0].get('selected'),'click selects element');
          ok(!childViews.everyProperty('selected'), 'click selected all elements');
          equal(childViews[0].get('content'), 
            EV.eventsController.get('selectedEvent'), 
            'Click sets selected event on events controller');

          ok(childViews[0].get('expanded'), 
            'clicking on show more expands list item');  
          //toggle expanded state
          clickedItem.click();
          stop();
          setTimeout(function() {
            ok(!childViews[0].get('expanded'), 
              'clicking on show more toggles expanded state');  
            start();
          }, 20);

          //select another item
          $('#qunit-fixture li.list-item')[1].click();
          stop();
          setTimeout(function() {
            ok(childViews[1].get('selected'),'click selects new element');
            ok(!childViews[0].get('selected'),'click deselects old element');

            //click the 'show more' link
            $('#qunit-fixture li.list-item:nth-child(2) span.show-more').click();
            start();
          }, 20);
          start();
        }, 20);
        start();
      }, 20);
    });

    /******************Map View*****************/
    test('MapView', function() {
      expect(3);
      EV.mapView.appendTo('#qunit-fixture');
      stop();
      setTimeout(function() {
        var map = EV.mapView.get('map');
        ok(map,'creates map object');
        //the map should have appended a bunch of div children
        ok($('#qunit-fixture div').length > 10, 'appends map elements');
        
        var ev = EV.Event.create({
          lat: 30.129,
          lon: 129.34,
          title: 'test title',
          description: 'foo'
        });

        EV.eventsController.select(ev);
        stop();
        setTimeout(function() {
          equal(Math.round(EV.mapView.get('map').getCenter().lat()), 
            Math.round(ev.get('position').lat()),
            'selecting an event pans the map');
          /*
          TODO: why aren't info windows opening in the tests?
          ok(!!$('div.info-window-title').length, 
            'selecting an event opens the info window')
          equal($('div.info-window-title').text(), ev.get('title'),
            'open info window has correct title');
          */
          start();
        }, 25);
      start();
      }, 150);
    });
    test('Sort Buttons', function() {
      expect(4);
      EV.sortButtons.appendTo('#qunit-fixture');
      stop();
      setTimeout(function() {
        ok($('#sort-buttons').length, 'appends correctly');
        var sortArgs = [];
        var mock = new Mock(EV.eventsController, 'sortBy', function(sortType) {
          sortArgs.push(sortType);
        });
        $('#date-sort div').click();
        $('#distance-sort div').click();
        stop();
        setTimeout(function() {
          equal(sortArgs.length, 2, 'Called sort incorrect number of times');
          equal(sortArgs[0], EV.sorts.DATE, 'date sort had incorrect arg');
          equal(sortArgs[1], EV.sorts.DISTANCE, 'date sort had incorrect arg');
          start();
        }, 20);
       start();
      }, 20);
    });
  });  
})(jQuery, QUnit.start, QUnit.stop, EV, Mock);
