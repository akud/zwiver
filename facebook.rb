require 'restclient'
require 'json'
require 'pointlike'


class FB
  @@access_token = '400109626693462|D0Xr_U9eHnr6VWJR7yZECL9lQx8'
  @@base_url = 'https://graph.facebook.com'
  @@search_url = 'https://graph.facebook.com/search'
end

#Wrapper for a list of items from Facebook's graph api
class FBList < FB
  attr_reader :list

  def initialize item_class, params
    @item_class = item_class
    params[:access_token] = @@access_token
    params[:fields] = 'id'
    data = JSON.parse(RestClient.get @@search_url, :params => params)
    make_list! data
    make_next_params! data
  end

  def next!
    if @next_params
      response = JSON.parse(RestClient.get @@search_url, :params => @next_params)
      make_list! response
      make_next_params! response
    else
      @list = []
    end
  end

  def has_next?; !!@next_params; end

  private 

  def make_next_params! fb_response
    @next_params = nil 
    if fb_response['paging'] and fb_response['paging']['next']
      @next_params = {}
      fb_response['paging']['next'].split('?')[1].split('&').each do |str|
        arr = str.split '='
        @next_params[arr[0]] = arr[1]
      end
    end
  end

  def make_list! fb_response
    @list = fb_response['data'].map {|place| @item_class.new place['id'] }
  end

end


#Hash-like wrapper around the information for a single fb item
class FBItem < FB
  attr_reader :data

  def initialize id
    @data = JSON.parse(RestClient.get "#{@@base_url}/#{id}", 
      :params => { :access_token => @@access_token })
  end

  def [] key
    @data[key]
  end

  def []= key, value
    @data[key] = value
  end

  def to_json
    JSON.pretty_generate @data
  end
end 


class VenueList < FBList
  def initialize query
    super Venue, :q => query,
      :type => 'place',
      :center => '37.7750,-122.4183',
      :distance => 50000
  end
end

class EventList < FBList
  def initialize query
    require 'chronic'
    super Event, :q => query,
      :type => 'event',
      :until => Chronic.parse('next sunday at midnight').to_i
  end
end

class Venue < FBItem
  include Pointlike

  def initialize id
    super id
    self['site'] = self['website'] || self['link']
    @lat = self['location']['latitude']
    @lon = self['location']['longitude']
  end

  def matches? terms
    terms.any? do |term|
      (self['description'] && self['description'].downcase.include?(term.downcase)) ||
      ( self['about'] && self['about'].downcase.include?(term.downcase))
    end
  end
end

class Event < FBItem
  
  include Pointlike

  def initialize id
    super id
    if self['venue']
      @lat = self['location']['latitude']
      @lon = self['location']['longitude']
    end
  end

  def has_location?
    (!!@lat) && (!!@lon)
  end
end
