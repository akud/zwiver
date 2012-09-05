(function(ZWVR, $, Ember, geolocation) {
  var radians = function(degrees) {
    return degrees*(Math.PI/180);
  }
  ZWVR.locationController = Ember.Object.create({
    location: null,
    /**
     * Determine the user's location and provide it to a callback function. 
     */
    withLocation: function(callback) {
      if(this.get('location')) {
        callback(this.get('location'));
      } else if(geolocation) {
        geolocation.getCurrentPosition(function(location) {
          ZWVR.locationController.set('location', location.coords);
          callback(location.coords);
        });
      }
    },
    /**
     * Compute the location between two points.
     * 
     * Arguments must have properties <code>latitude</code> and <code>longitude</code>,
     * as does navigator.geolocation.coords
     */
    distance: function(pointA, pointB) {
      var lat1 = radians(pointA.latitude), 
          lat2 = radians(pointB.latitude),
          lon1 = radians(pointA.longitude), 
          lon2 = radians(pointB.longitude);

      //Equirectangular approximation of distance
      var R = 6371; // km
      var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
      var y = (lat2-lat1);
      return Math.sqrt(x*x + y*y) * R;
    }
  });
})(ZWVR, jQuery, Ember, navigator.geolocation);
