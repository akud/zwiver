/**
 * Tests for basic definitions, and properties of EV
 */
$(document).ready(function(){  
  module('Core');  
  test('Required Objects', function(){  
    expect(8);    
    ok(EV, 'EV');
    ok(EV.sorts, 'EV.sorts');
    ok(EV.sorts.DATE, 'EV.sorts.DATE');
    ok(EV.sorts.DISTANCE, 'EV.sorts.DISTANCE');
    ok(EV.Event, 'Event Class');
    ok(EV.eventsController, 'eventsController');
    ok(EV.listView, 'listView');
    ok(EV.mapView, 'mapView');
  });  

  test('EV.toApiUrl', function() {
    expect(10);
    ok(!EV.toApiUrl(), 'toApiUrl with no argument');
    ok(!EV.toApiUrl(null), 'toApiUrl with null');
    equal(EV.toApiUrl('/events'), '/api/events', 'relative path');
    equal(EV.toApiUrl('events'), '/api/events', 'relative path no slash');
    equal(EV.toApiUrl('/api/events'), '/api/events', 'already correct path');
    equal(EV.toApiUrl('http://localhost:8080/api/events'), '/api/events', 'http with port');
    equal(EV.toApiUrl('http://localhost/api/events'), '/api/events', 'http no port');
    equal(EV.toApiUrl('http://www.zwiver.com/api/events'), '/api/events', 'http www');
    equal(EV.toApiUrl('www.zwiver.com/api/events'), '/api/events', 'start with www');
    equal(EV.toApiUrl('zwiver.com/api/events'), '/api/events', 'url no http');
  });
});
