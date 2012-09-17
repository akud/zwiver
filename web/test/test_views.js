/********************List View******************/
$(function() {
  module('Views');
  test('ListView', function() {
    expect(12);
    equal(ZWVR.listView.get('content'), ZWVR.eventsController.get('content'), 
      'Controller Binding');
    
    //append to the dom
    ZWVR.listView.appendTo('#qunit-fixture');
    QUnit.delay(function() {
      equal($('#qunit-fixture li.list-item').length, 
        ZWVR.eventsController.get('length'), 
        'appending creates list elements');  

      var childViews = ZWVR.listView.get('childViews');
      ok(!!childViews.length, 'creates child views');

      //check click behavior
      ok(childViews.everyProperty('selected',false), 
        'views are unselected by default');
      ok(childViews.everyProperty('expanded',false), 
        'views are unexpanded by default');
      var clickedItem = $('#qunit-fixture li.list-item:first-child span.show-more')
        .click();
      QUnit.delay(function() {
        ok(childViews[0].get('selected'),'click selects element');
        ok(!childViews.everyProperty('selected'), 'click selected all elements');
        equal(childViews[0].get('content'), 
          ZWVR.eventsController.get('selectedEvent'), 
          'Click sets selected event on events controller');

        ok(childViews[0].get('expanded'), 
          'clicking on show more expands list item');  
        //toggle expanded state
        clickedItem.click();
        QUnit.delay(function() {
          ok(!childViews[0].get('expanded'), 
            'clicking on show more toggles expanded state');  
        });

        //select another item
        $('#qunit-fixture li.list-item')[1].click();
        QUnit.delay(function() {
          ok(childViews[1].get('selected'),'click selects new element');
          ok(!childViews[0].get('selected'),'click deselects old element');

          //click the 'show more' link
          $('#qunit-fixture li.list-item:nth-child(2) span.show-more').click();
        });
      });
    });
  });

  /******************Map View*****************/
  test('MapView', function() {
    expect(3);
    ZWVR.mapView.appendTo('#map-container1');
    QUnit.delay(300, function() {
      var map = ZWVR.mapView.get('map');
      ok(map,'creates map object');
      //the map should have appended a bunch of div children
      ok($('#map-container1 div').length > 10, 'appends map elements');
      
      var ev = ZWVR.Event.create({
        lat: 30.129,
        lon: 129.34,
        title: 'test title',
        description: 'foo'
      });

      ZWVR.eventsController.select(ev);
      QUnit.delay(50, function() {
        equal(Math.round(ZWVR.mapView.get('map').getCenter().lat()), 
          Math.round(ev.get('position').lat()),
          'selecting an event pans the map');
        /*
        TODO: why aren't info windows opening in the tests?
        ok(!!$('div.info-window-title').length, 
          'selecting an event opens the info window')
        equal($('div.info-window-title').text(), ev.get('title'),
          'open info window has correct title');
        */
      });
    });
  });
  test('Sort Buttons', function() {
    expect(7);
    //setup mock
    var sortArgs = [];
    QUnit.stub(ZWVR.eventsController, 'sortBy', function(sortType) {
      sortArgs.push(sortType);
    });

    //append to DOM
    ZWVR.sortButtons.appendTo('#qunit-fixture');
    QUnit.delay(function() {
      ok($('#sort-buttons').length, 'appends correctly');
      //check clicked state
      deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
        [true, false], 'default clicked state');

      //date sort is already clicked
      $('#date-sort div').click();
      QUnit.delay(function() {
        //state should be the same
        deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
          [true, false], 'clicking selected sorts does not change state');
        ok(!sortArgs.length, 
          'clicking selected sort button does not call sort function');
        
        //click the distance sort button
        $('#distance-sort div').click();
        QUnit.delay(function() {
          deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
            [false, true], 'clicked state changes');

          //click the date sort button again
          $('#date-sort div').click();
          QUnit.delay(function() {
            deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
              [true, false], 'clicked state changes');
            deepEqual(sortArgs, [ZWVR.sorts.DISTANCE, ZWVR.sorts.DATE], 'Sort arguments');
          }, function() {QUnit.release(ZWVR.eventsController, 'sortBy');});
        });
       });
    });
  });
  test('Switch Buttons', function() {
    expect(9);
    //setup mocks
    var viewStates = {
      'mapView' : 'not appended',
      'listView' : 'appended' 
    };
    ['mapView', 'listView'].forEach(function(view) {
      QUnit.stub(ZWVR[view], 'appendTo', function() {
        viewStates[view] = 'appended';
      });
      QUnit.stub(ZWVR[view], 'remove', function() {
        viewStates[view] = 'not appended';
      });
    });
    //append to DOM
    ZWVR.switchButtons.appendTo('#qunit-fixture');
    QUnit.delay(function() {
      ok($('.switch-buttons').length, 'appends correctly');
      equal(ZWVR.switchButtons.get('listImg'), '/images/list-selected.png', 
        'list is selected by default');
      equal(ZWVR.switchButtons.get('mapImg'), '/images/map-unselected.png', 
        'map is unselected by default');
      $('#list-switcher').click();
      QUnit.delay(function() {
        equal(ZWVR.switchButtons.get('listImg'), '/images/list-selected.png', 
          'clicking already selected button does not change state');
        equal(ZWVR.switchButtons.get('mapImg'), '/images/map-unselected.png', 
          'clicking already selected button does not change state');
        deepEqual(viewStates, {'mapView': 'not appended', 'listView': 'appended'}, 
          'clicking already selected button does not change state');
        $('#map-switcher').click();
        QUnit.delay(function() {
          equal(ZWVR.switchButtons.get('listImg'), '/images/list-unselected.png', 
            'clicking map deselects list button');
          equal(ZWVR.switchButtons.get('mapImg'), '/images/map-selected.png', 
            'clicking map selects map button');
          deepEqual(viewStates, {'mapView': 'appended', 'listView': 'not appended'}, 
            'clicking map switches state');
        }, function() {
           //release mocks 
           ['mapView','listView'].forEach(function(view) {
             QUnit.release(ZWVR[view], 'appendTo');
             QUnit.release(ZWVR[view], 'remove');
           });
        });
      });
    });
  });
});
