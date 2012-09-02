/**************Events Model******************/
$(document).ready(function() { 
  module('Models');
  test('Events Model', function(){
    expect(13);
    var desc = 'I don’t feel that it is necessary to know' + 
    ' exactly what I am. The main interest in life and work' + 
    ' is to become someone else that you were not in the beginning.' + 
    ' If you knew when you began a book what you would say at the end,' + 
    ' do you think that you would have the courage to write it?' + 
    ' What is true for writing and for love relationships is true' + 
    ' also for life. The game is worthwhile insofar as we don\'t' + 
    ' know where it will end.';
    var ev = ZWVR.Event.create({
      description: desc,
      lat: 35.32145,
      lon: -124.53435,
      date: '2012-07-15T01:30:00Z'
    });
    equal(ev.get('formattedDate'),'July 14 6:30pm','formatted date');

    ok(ev.get('shortDescription'),'short description');
    ok(ev.get('shortDescription').length < desc.length, 
      'shortDescription.length < description.length');
    strictEqual(ev.get('hasMore'), true, 'hasMore == true for long description');

    ok(ev.get('position'), 'position');
    equal(Math.round(ev.get('position').lat()), 35,
      'correct latitude for position');
    equal(Math.round(ev.get('position').lng()), -125, 
      'correct longitude for position');
    ok(ev.get('mapMarker'), 'map marker');
    equal(ev.get('mapMarker').getPosition(), ev.get('position'), 
      'correct position for map marker');

    ok(ev.get('infoWindowContent'), 'info window content');
    ok(ev.get('infoWindow'), 'info window');  
    equal(ev.get('infoWindow').getPosition(), ev.get('position'), 
      'correct position for info window');
    equal(ev.get('infoWindow').getContent(), ev.get('infoWindowContent'),
      'correct content for info window');
  });
});
