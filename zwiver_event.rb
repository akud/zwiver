require 'json'
require 'uri'
require 'net/http'

# Main model class for storing events to the zwiver api
module Zwiver

  
#Mixin for other classes that can be converted to Zwiver Events
  module Saveable
    def to_zw
      Zwiver::Event.new :title => @title,
        :date => @date,
        :url => @url,
        :description => @description,
        :venue => @venue_name,
        :address => @address,
        :lat => @lat,
        :lon => @lon
    end
  end

  class Event
    
    @@url = URI.parse('http://localhost/api/events/')
    
##
# Constructor. Takes a hash with the following keys:
# :title - the title of the event
# :description (optional)- a description of the event
# :url - a url pointing to a page of the event
# :price (optional)- the price of the event
# :date - the date/time when the event occurs
# :venue (optional)- the name of the venue hosting the event
# :address - the street address of the event venue
# :lat / :lon (optional)- latitude and longitude of the event venue
    def initialize args
      @body = args
    end


    def post
      request = Net::HTTP::Post.new(@@url.path)  

      request.body = {:event => @body}.to_json
      request.add_field 'Content-Type', 'application/json'
      request.add_field 'Accept', 'application/json'

      response = Net::HTTP.new(@@url.host, @@url.port).start do |http|
        http.request(request)
      end
      
      if response.is_a? Net::HTTPSuccess
        puts "Created event for #{@body[:url]}" 
      else
        puts "Failed to save event for #{@body[:url]}: #{response.code} #{response.message}"
      end
      response
    end
  end
end
