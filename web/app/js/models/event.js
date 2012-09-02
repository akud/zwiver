/**
 * Event model
 *
 * @requires app.js
 * @exports EV.Event
 */
(function(EV, Ember) {
  var timezoneOffset = new Date().getTimezoneOffset()*60*1000;
  var maxDescriptionLength = 140;
  var monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  EV.Event = Ember.Object.extend({
    shortDescription: function() {
      var desc = this.get('description') || '';
      return desc.substring(0, maxDescriptionLength); 
    }.property('description'), 

    hasMore: function() {
      return this.get('description') && 
        this.get('description').length > maxDescriptionLength; 
    }.property('description'),

   
    /**
     * Return the event date formatted as "month_name, day_of_month hh:mm am|pm"
     * in the local timezone
     */
    formattedDate: function() { 
      if(this.get('date')) {
        var arr = this.get('date')
          .replace('T',' ')
          .replace('Z','')
          .split(/[-: ]/);
        var date = Date.UTC(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);  
        date = new Date(date);
        //date.setTime(date.getTime() + this.get('timezoneOffset'));
        return monthNames[date.getMonth()] + 
          ' ' + date.getDate() + ' ' + 
          (date.getHours() <= 12 ? date.getHours() : date.getHours() - 12) + 
          ':' + date.getMinutes() + 
          (date.getMinutes() < 10 ? '0' : '') + 
          (date.getHours() >= 12 ? 'pm' : 'am');
      } else {
        return new Date();
      }
    }.property('date')
  });
})(EV, Ember);

