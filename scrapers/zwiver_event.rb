require 'json'
require 'uri'
require 'net/http'

# Main model class for storing events to the zwiver api
module Zwiver

  
#Mixin for other classes that can be saved as Zwiver Events
  module Saveable

    attr_reader :title, :date, :url, :venue, :venue_name, :address, :lat, :lon
    def save
      Zwiver::Event.new(:title => @title,
        :date => @date,
        :url => @url,
        :description => @description,
        :venue => @venue_name || @venue,
        :address => @address,
        :lat => @lat,
        :lon => @lon
      ).post
    end
  end

  class Event
    @@url = URI.parse('http://localhost:3000/events/')
    
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
      raise ArgumentError, "title is required" unless @body[:title].is_a? String
      raise ArgumentError, "address is required" unless @body[:address].is_a? String
      raise ArgumentError, "date is required and must be a time object" unless @body[:date].is_a? Time
      @body[:title] = clean_input @body[:title]
      @body[:description] = clean_input @body[:description] if @body[:description]
    end

    def to_json
      @body.to_json
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
        puts "Created event: #{@body[:title]}" 
      else
        puts "Failed to save event #{@body[:title]}: #{response.code} #{response.message}; #{response.body}"
      end
      response
    end

    private 
    def clean_input input
      input.gsub(/<.*?>/m, '').gsub(/\s+/, ' ')\
        .gsub(/^[:punct:]*\s*(.*)\s*[:punct:]*/, '\1')
    end
  end
end
