/**
 * Various buttons
 *
 * @requires app.js
 * @requires controller/events_controller.js
 */
EV.nextButton = Ember.View.create({
  templateName: 'next-button',
  clickable: function() {
    return EV.eventsController.get('nextUrl') != null;
  }.property('EV.eventsController.nextUrl'),
  click: function() {
    EV.eventsController.loadNext();
  }
});

EV.prevButton = Ember.View.create({
  templateName: 'prev-button',

  clickable: function() {
    return EV.eventsController.get('previousUrl') != null;
  }.property('EV.eventsController.previousUrl'),

  click: function() {
    if(this.get('clickable')) {
      EV.eventsController.loadPrevious();
    }
  }
});
