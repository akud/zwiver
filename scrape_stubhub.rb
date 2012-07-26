#!/usr/local/bin/ruby -I.

require 'restclient'
require 'json'
require 'zwiver_event'
require 'csv'
require 'time'

module Stubhub
  
  def self.query q, other_opts={}
    JSON.parse(RestClient.get 'http://www.stubhub.com/listingCatalog/select/',
      :params => {
        :q => q,
        :wt => 'json',
        :version => '2.2',
        :start => 0,
        :rows => 999999
       }.merge(other_opts)
     )['response']['docs']
  end


  class Venue 
    attr_reader :id, :name, :url, :address 
    
    @@addresses = {}
    @@name_regexes = {
      /[ ]?tickets/i => ''
      #/ - [ a-zA-Z]+$/ => ''
    }
    def initialize args
      @id = args['id'].to_i
      @url = "http://stubhub.com/#{args['urlpath']}"
      @name = args['name_primary']
      @@name_regexes.each do |regex,replacement|
        @name = @name.gsub regex, replacement
      end
      @address = load_address @id
    end
    
    def self.find_by_region region="SF Bay Area, California"
      Stubhub.query("stubhubDocumentType:geo" + 
        " AND localeDescription:\"#{region}\"" + 
        " AND active:1 AND leaf:true AND hidden:0",
        :fl => 'id,name_primary,urlpath'
      ).map {|v| Venue.new v }
    end

    def self.get id
      Venue.new Stubhub.query(
        "stubhubDocumentid:geo-#{id}",
        :fl => 'id,name_primary,urlpath',
        :rows => 1
      ).first
    end

    def events
      Stubhub.query("stubhubDocumentType:event" + 
        " AND geography_parent:#{@id}" + 
        " AND active:1",
        :fl => 'id,title,urlpath,event_date'
      ).map {|e| Event.new self, e}
    end

    private 
    def load_address id
#TODO: put these in a db
      if @@addresses.empty?
        file = File.expand_path File.dirname __FILE__
        file += '/data/stubhub_venue_addresses.csv'
        CSV.foreach file, :col_sep => ';' do |row|
          @@addresses[row[0].to_i] = row[2] ? row[2].strip : ''
        end
      end
      @@addresses[id]
    end
  end

  class Event
    attr_reader :id, :title, :date, :url,
      :address, :venue_name

    include Zwiver::Saveable
    def initialize venue, args
      @id = args['id']
      @title = args['title'] 
      @url = "http://stubhub.com/#{args['urlpath']}"
      @date = Time.parse args['event_date']
      @address = venue.address
      @venue_name = venue.name
    end

    def self.get id
      Event.new Stubhub.query("stubhubDocumentType:event" + 
        " AND id:#{id}",
        :fl => 'id,title,urlpath,event_date_time_local'
      ).first
    end
  end
end

if $0 == __FILE__
  Stubhub::Venue.find_by_region.each do |venue|
    puts "scraping events for #{venue.name}"
    venue.events.each do |event|
      begin 
        event.save
      rescue ArgumentError => e
        puts e.to_s
      end
    end
  end
end
