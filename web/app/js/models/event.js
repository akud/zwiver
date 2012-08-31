/**
 * Event model
 *
 * @requires app.js
 */
EV.Event = Ember.Object.extend({
  maxDescriptionLength: 140,
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  timezoneOffset: new Date().getTimezoneOffset()*60*1000,
  position: function() {
    if(google) {
      return new google.maps.LatLng(this.get('lat'),this.get('lon'));
    } 
  }.property('lat','lon'),

  shortDescription: function() {
    var desc = this.get('description') || '';
    var maxLength = this.get('maxDescriptionLength');
    return desc.substring(0,maxLength); 
  }.property('description'), 

  hasMore: function() {
    return this.get('description') && 
      this.get('description').length > this.get('maxDescriptionLength');
  }.property('description'),

  mapMarker: function() {
    if(google) {
      return new google.maps.Marker({
        position: this.get('position'),
        title: this.get('title'), 
        icon: '/images/map_marker.png'
      });
    } 
  }.property('title','position'),

  infoWindowContent: function() {
    return '<div class="info-window-title">' +
      this.get('title') + '</div>' +
      '<div class="info-window-content">' + 
        '<div class="info-window-date">' +
          this.get('formattedDate') +
        '</div>' +
        '<div class="info-window-venue">' +
          this.get('venue') +
        '</div>' +
        '<div class="info-window-address">' +
          this.get('address') +
        '</div>' +
      '</div>';
  }.property('title','shortDescription'),

  infoWindow: function() {
    if(google) {
      return new google.maps.InfoWindow({
        content: this.get('infoWindowContent'),
        position: this.get('position')
      });
    }
  }.property('infoWindowContent','position'),

  formattedDate: function() { 
    if(this.get('date')) {
      var arr = this.get('date')
        .replace('T',' ')
        .replace('Z','')
        .split(/[-: ]/);
      var date = Date.UTC(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);  
      date = new Date(date);
      //date.setTime(date.getTime() + this.get('timezoneOffset'));
      return this.get('monthNames')[date.getMonth()] + 
        ' ' + date.getDate() + ' ' + 
        (date.getHours() <= 12 ? date.getHours() : date.getHours() - 12) + 
        ':' + date.getMinutes() + 
        (date.getMinutes() < 10 ? '0' : '') + 
        (date.getHours() >= 12 ? 'pm' : 'am');
    } else {
      return new Date();
    }
  }.property('date'),

  remove: function() {
    this.get('infoWindow').close();
    this.get('mapMarker').setMap(null);
  }
});


