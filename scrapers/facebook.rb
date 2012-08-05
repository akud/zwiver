#Base Classes for Facebook graph lists and items
require 'restclient'
require 'json'


class FB
  @@access_token = '400109626693462|D0Xr_U9eHnr6VWJR7yZECL9lQx8'
  @@base_url = 'https://graph.facebook.com'
  @@search_url = 'https://graph.facebook.com/search'

  def self.search params
    params[:access_token] = @@access_token
    params[:fields] ||= 'id'
    JSON.parse(RestClient.get @@search_url, :params => params)
  end

  def self.get id
    JSON.parse(RestClient.get "#{@@base_url}/#{id}", 
      :params => { :access_token => @@access_token })
  end
end

#Wrapper for a list of items from Facebook's graph api
class FBList < FB
  attr_reader :list

  def initialize item_class, params
    @item_class = item_class
    data = FB.search params
    make_list! data
    make_next_params! data
  end

  def load_next!
    if @next_params
      response = FB.search @next_params
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
    @data = FB.get id
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
