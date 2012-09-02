/********************List View******************/
module('Views');
test('ListView', function() {
  expect(12);
  equal(ZWVR.listView.get('content'), ZWVR.eventsController.get('content'), 
    'Controller Binding');
  
  //append to the dom
  ZWVR.listView.appendTo('#qunit-fixture');

  QUnit.stop();
  setTimeout(function() {
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
    QUnit.stop();
    setTimeout(function() {
      ok(childViews[0].get('selected'),'click selects element');
      ok(!childViews.everyProperty('selected'), 'click selected all elements');
      equal(childViews[0].get('content'), 
        ZWVR.eventsController.get('selectedEvent'), 
        'Click sets selected event on events controller');

      ok(childViews[0].get('expanded'), 
        'clicking on show more expands list item');  
      //toggle expanded state
      clickedItem.click();
      QUnit.stop();
      setTimeout(function() {
        ok(!childViews[0].get('expanded'), 
          'clicking on show more toggles expanded state');  
        QUnit.start();
      }, 20);

      //select another item
      $('#qunit-fixture li.list-item')[1].click();
      QUnit.stop();
      setTimeout(function() {
        ok(childViews[1].get('selected'),'click selects new element');
        ok(!childViews[0].get('selected'),'click deselects old element');

        //click the 'show more' link
        $('#qunit-fixture li.list-item:nth-child(2) span.show-more').click();
        QUnit.start();
      }, 20);
      QUnit.start();
    }, 20);
    QUnit.start();
  }, 20);
});

/******************Map View*****************/
test('MapView', function() {
  expect(3);
  ZWVR.mapView.appendTo('#qunit-fixture');
  QUnit.stop();
  setTimeout(function() {
    var map = ZWVR.mapView.get('map');
    ok(map,'creates map object');
    //the map should have appended a bunch of div children
    ok($('#qunit-fixture div').length > 10, 'appends map elements');
    
    var ev = ZWVR.Event.create({
      lat: 30.129,
      lon: 129.34,
      title: 'test title',
      description: 'foo'
    });

    ZWVR.eventsController.select(ev);
    QUnit.stop();
    setTimeout(function() {
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
      QUnit.start();
    }, 25);
  QUnit.start();
  }, 150);
});
test('Sort Buttons', function() {
  expect(9);
  //setup mock
  var sortArgs = [];
  var mock = new ZWVR.Mock(ZWVR.eventsController, 'sortBy', function(sortType) {
    sortArgs.push(sortType);
  }).apply();

  //append to DOM
  ZWVR.sortButtons.appendTo('#qunit-fixture');
  ZWVR.timeout(function() {
    ok($('#sort-buttons').length, 'appends correctly');
    //check clicked state
    deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
      [true, false], 'default clicked state');

    //date sort is already clicked
    $('#date-sort div').click();
    ZWVR.timeout(function() {
      //state should be the same
      deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
        [true, false], 'clicking selected sorts does not change state');
      ok(!sortArgs.length, 
        'clicking selected sort button does not call sort function');
      
      //click the distance sort button
      $('#distance-sort div').click();
      ZWVR.timeout(function() {
        deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
          [false, true], 'clicked state changes');

        //click the date sort button again
        $('#date-sort div').click();
        ZWVR.timeout(function() {
          deepEqual(ZWVR.sortButtons.get('childViews').getEach('clicked'), 
            [true, false], 'clicked state changes');
          deepEqual(sortArgs, [ZWVR.sorts.DISTANCE, ZWVR.sorts.DATE], 'Sort arguments');
        }, mock.release);
      });
     });
  });
});
