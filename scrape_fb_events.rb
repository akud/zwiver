#!/usr/bin/ruby -I.
require 'facebook'
require 'pointlike'
require 'zwiver_event'
require 'time'
require 'chronic'

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
    if @data['venue']
      @lat = @data['venue']['latitude']
      @lon = @data['venue']['longitude']
      @address = "#{@data['venue']['street']} #{@data['venue']['city']} #{@data['venue']['state']}"
    end
    @url = "http://www.facebook.com/events/#{@data['id']}"
    @title = @data['name']
    @description = @data['description']
    @date = Time.parse "#{@data['start_time']} PDT"
    @venue = @data['location']
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
