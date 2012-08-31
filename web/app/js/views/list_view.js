/**
 * View for the list of events
 *
 * @requires app.js
 * @requires models/event.js 
 * @requires controllers/events_controller.js 
 */
EV.listView = Ember.CollectionView.create({
  contentBinding: Ember.Binding.oneWay('EV.eventsController.content'),
  tagName: 'ul',
  classNames: ['event-list'],
  selectedEventObserver: function() {
    this.get('childViews').invoke('set', 'selected', false);
    this.get('childViews').invoke('set', 'expanded', false);
    this.get('childViews').filter(function(childView) {
      return childView.getPath('content.id') === EV.eventsController.getPath('selectedEvent.id');
    }).invoke('set', 'selected', true);
  }.observes('EV.eventsController.selectedEvent'),
  itemViewClass: Ember.View.extend({
    templateName: 'list-item',
    classNameBindings: ['itemClass','selected', 'expanded'],
    itemClass: 'list-item',
    selected: false,
    expanded: false, 
    click: function(evt) {
      if(!this.get('selected')) {
        EV.eventsController.select(this.get('content'));
      }
    },
    selectedObserver: function() {
      if(this.get('selected')) {
        this.set('expanded', true);
        var newTop = $('#' + this.get('elementId')).offset().top - 300;
        var curTop = $('html').scrollTop();
        var time = Math.max(800, Math.abs(newTop - curTop));
        $('html, body').animate({
          scrollTop: newTop
        }, time);
      }
    }.observes('selected'),
    showMoreView: Ember.View.extend({
      classNames: ['show-more'],
      tagName: 'span',
      imgUrl: function() {
        if(this.getPath('parentView.expanded')) {
          return '/images/up_arrow.png';
        } else {
          return '/images/down_arrow.png';
        } 
      }.property('parentView.expanded'),
      click: function() {
        this.get('parentView').set('expanded', !this.getPath('parentView.expanded'));
      }
    })
  })
});


