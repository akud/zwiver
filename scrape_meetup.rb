#!/usr/local/bin/ruby -I.
require 'json'
require 'restclient'
#require 'zwiver_event'
module Meetup
  API_KEY = "4718405634e5b49496d651e18462e6f"
  
  def self.get path, params={}
    params = {:key => API_KEY}.merge params
    url = 'http://api.meetup.com' 
    url += '/' unless path.starts_with? '/' 
    url += path 
    url += '.json' unless path.ends_with? '.json'
    JSON.parse(RestClient.get url, :params => params)
  end


  class EventList
  
    def initialize
      

    end

  end

end
