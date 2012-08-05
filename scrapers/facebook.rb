#Base Classes for Facebook graph lists and items
require 'restclient'
require 'json'

module FB
  DEFAULT_ACCESS_TOKEN = '400109626693462|D0Xr_U9eHnr6VWJR7yZECL9lQx8'
  BASE_URL = 'https://graph.facebook.com'
  SEARCH_URL = 'https://graph.facebook.com/search'

  def self.search params
    params[:access_token] ||= DEFAULT_ACCESS_TOKEN
    params[:fields] ||= 'id'
    puts "searching: #{BASE_URL}?#{params.map{|k,v| k.to_s + '=' + v.to_s}.join '&'}"
    JSON.parse(RestClient.get SEARCH_URL, :params => params)
  end

  def self.get id, access_token=nil
    url = "#{BASE_URL}/#{id}"
    access_token ||= DEFAULT_ACCESS_TOKEN
    puts "Loading #{url}?access_token=#{access_token}"
    JSON.parse(RestClient.get url, 
      :params => { :access_token => access_token})
  end

#Wrapper for a list of items from Facebook's graph api
  class List 
    attr_reader :list

    def initialize item_class, params
      @item_class = item_class
      data = FB.search params
      make_list! data, params[:access_token]
      make_next_params! data
    end

    def load_next!
      if @next_params
        response = FB.search @next_params
        make_list! response, @next_params[:access_token]
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
          @next_params[arr[0].to_sym] = arr[1]
        end
      end
    end

    def make_list! fb_response, access_token
      @list = fb_response['data'].map {|place| @item_class.new place['id'], access_token }
    end

  end


#Hash-like wrapper around the information for a single fb item
  class Item 
    attr_reader :data

    def initialize id, access_token
      @data = FB.get id, access_token
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
end
