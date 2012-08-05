#!/usr/local/bin/ruby -I.
require 'facebook'
require 'pointlike'
require 'zwiver_event'
require 'time'
require 'chronic'

class EventList < FB::List
  def initialize query, access_token=FB::DEFAULT_ACCESS_TOKEN
    require 'chronic'
    super Event, :q => query,
      :type => 'event',
      :until => Chronic.parse('next sunday at midnight').to_i,
      :access_token => access_token
  end
end

class Event < FB::Item
  
  include Pointlike
  include Zwiver::Saveable

  attr_reader :url, :title, :description, :date, :venue, :address, :lat, :lon

  def initialize id, access_token
    super id, access_token
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
  access_tokens = IO.readlines("#{File.dirname(__FILE__)}/data/fb_access_tokens.txt").map {|t| t.strip}
  access_tokens << FB::DEFAULT_ACCESS_TOKEN

  terms = IO.readlines("#{File.dirname(__FILE__)}/data/fb_search_terms.txt").map {|t| t.strip}
  terms += ('a'..'z').to_a

  access_tokens.each do |token|
    terms.each do |term|
      events = EventList.new term, token
      begin
        events.list.find_all {|e| e.has_location? && e.distance_from(37.7750,-122.4183) < 20}.each do |e|
          e.save
        end
        events.load_next!
      end while events.has_next?
    end
  end
end
