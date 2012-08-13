#!/usr/local/bin/ruby -I.
require 'json'
require 'time'
require 'restclient'
require 'zwiver'
module Meetup
  API_KEY = "4718405634e5b49496d651e18462e6f"
  
  def self.get path, params={}
    params = {:key => API_KEY}.merge params
    url = 'http://api.meetup.com'  + ('/' unless path.start_with? '/').to_s
    url += path + ('.json' unless path.end_with? '.json').to_s
    JSON.parse(RestClient.get url, :params => params)
  end


  class EventList
    attr_reader :events 

    def initialize zip
      results = Meetup.get '/2/open_events', :zip => zip, 
        :text_format => 'plain', 
        :status => 'upcoming'
      process_results! results
    end
    
    def has_next?
      @next && !@next.empty?
    end

    def load_next!
      results = JSON.parse(RestClient.get @next)
      process_results! results
    end

    private 
    def process_results! results
      @next = results['meta']['next']
      @events = results['results'].map do |e| 
        Meetup::Event.new e
      end.find_all { |e| e.open? }
    end
  end

  class Event
    include Zwiver::Saveable
    def initialize hash
      @url = hash['event_url']
      @title = hash['name']
      @description = hash['description']
      @price = hash['fee']['amount'] if hash.include? 'fee'
      @open = hash['group']['join_mode'] == 'open'
      @date = (Time.at(hash['time'] / 1000).getutc) - (hash['utc_offset'] / 1000)
      if hash.include? 'venue'
        v = hash['venue'] 
        @lat = v['lat'] unless v['lat'].to_s.empty?
        @lon = v['lon'] unless v['lon'].to_s.empty?
        @venue_name = v['name']
        @address = "#{v['address_1']}, #{v['city']} #{v['state']} #{v['zip']}"
      end
    end

    def open?
      @open
    end
  end
end

Zwiver.register 'Meetup API' do
  list = Meetup::EventList.new 94117
  begin 
    list.events.each do |e|
      begin
        e.save
      rescue ArgumentError => e
        puts e.to_s
      end
    end
    list.load_next!
  end while list.has_next?
end
