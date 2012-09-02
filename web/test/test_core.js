/**
 * Tests for basic definitions, and properties of ZWVR
 */
$(document).ready(function(){  
  module('Core');  
  test('Required Objects', function(){  
    expect(8);    
    ok(ZWVR, 'ZWVR');
    ok(ZWVR.sorts, 'ZWVR.sorts');
    ok(ZWVR.sorts.DATE, 'ZWVR.sorts.DATE');
    ok(ZWVR.sorts.DISTANCE, 'ZWVR.sorts.DISTANCE');
    ok(ZWVR.Event, 'Event Class');
    ok(ZWVR.eventsController, 'eventsController');
    ok(ZWVR.listView, 'listView');
    ok(ZWVR.mapView, 'mapView');
  });  

  test('ZWVR.toApiUrl', function() {
    expect(10);
    ok(!ZWVR.toApiUrl(), 'toApiUrl with no argument');
    ok(!ZWVR.toApiUrl(null), 'toApiUrl with null');
    equal(ZWVR.toApiUrl('/events'), '/api/events', 'relative path');
    equal(ZWVR.toApiUrl('events'), '/api/events', 'relative path no slash');
    equal(ZWVR.toApiUrl('/api/events'), '/api/events', 'already correct path');
    equal(ZWVR.toApiUrl('http://localhost:8080/api/events'), '/api/events', 'http with port');
    equal(ZWVR.toApiUrl('http://localhost/api/events'), '/api/events', 'http no port');
    equal(ZWVR.toApiUrl('http://www.zwiver.com/api/events'), '/api/events', 'http www');
    equal(ZWVR.toApiUrl('www.zwiver.com/api/events'), '/api/events', 'start with www');
    equal(ZWVR.toApiUrl('zwiver.com/api/events'), '/api/events', 'url no http');
  });
});
