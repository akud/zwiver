#!/usr/bin/ruby -I.
require 'restclient'
require 'zwiver_event'
require 'json'
require 'time'

class EventbriteList

  APP_KEY = 'EP7P7VICTENFXLRKO6'

  attr_reader :events

  def initialize 
    @page = 1
    result = get_page @page
    if result['events']
      #first element is a summary
      @total_num = result['events'][0]['summary']['total_items'].to_i
      @num_loaded = result['events'][0]['summary']['num_showing'].to_i
      @events = get_event_list result
    end
  end

  def to_s 
    "<EventbriteList page #{@page}, #{@events.length} events>"
  end

  #Is there another page to load?
  def has_next?
    @total_num > @num_loaded
  end
  
  #Load up the next page of results
  def load_next!
    @page += 1
    result = get_page @page 
    @events = get_event_list result
    @num_loaded += result['events'][0]['summary']['num_showing'].to_i
  end

  private 
  def get_page page
    JSON.parse(RestClient.get 'https://www.eventbrite.com/json/event_search', 
      :params => {:app_key => APP_KEY,
        :city => 'San Francisco', 
        :within => 10, 
        :category => 'entertainment,performances,sports,music,recreation,fairs,other',
        :date => 'This Month', 
        :max => 100, 
        :page => page
      })
  end 

  def get_event_list json_result
    json_result['events'].slice(1..json_result['events'].length).map do |e|
      EventbriteEvent.new e
    end
  end
end

class EventbriteEvent
  include Zwiver::Saveable

    def initialize e
      @url = e['event']['url']
      @title = e['event']['title'].gsub(/<.*?>/, '')
      #@price = e['event']['tickets'][0]['ticket']['price']
      @description = e['event']['description'].gsub(/<.*?>/, '')
      @date = Time.parse "#{e['event']['start_date']} PDT"
      @venue_name = e['event']['venue']['name']
      @lat = e['event']['venue']['latitude']
      @lon = e['event']['venue']['longitude']
      @address = "#{e['event']['venue']['address']}, " + 
        "#{e['event']['venue']['city']}, " + 
        "#{e['event']['venue']['region']} #{e['event']['venue']['zip']}"
    end
end

if $0 == __FILE__
  list = EventbriteList.new
  begin 
    list.events.each do |e|
      e.save
    end
    list.load_next!
  end while list.has_next?
end
