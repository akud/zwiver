#!/usr/bin/ruby -I.
require 'facebook'
require 'pointlike'
require 'zwiver_event'

class EventList < FBList
  def initialize query
    require 'chronic'
    super Event, :q => query,
      :type => 'event',
      :until => Chronic.parse('next sunday at midnight').to_i
  end
end

class Event < FBItem
  
  include Pointlike
  include Zwiver::Saveable

  def initialize id
    super id
    if self['venue']
      @lat = self['venue']['latitude']
      @lon = self['venue']['longitude']
    end
    @url = "http://www.facebook.com/events/#{self['id']}",
    @title = self['name'],
    @description = self['description'],
    @date = self['start_time'],
    @venue = self['location'],
    @address = "#{self['venue']['street']} #{@data['venue']['city']} #{@data['venue']['state']}",
  end

  def has_location?
    !!(@lat && @lon)
  end
end

if $0 == __FILE__
  ('a'..'z').each do |letter|
    events = EventList.new letter
    begin
      events.list.find_all {|e| e.has_location? && e.distance_from(37.7750,-122.4183) < 20}.each do |e|
        e.save
      end
      events.load_next!
    end while events.has_next?
  end
end
