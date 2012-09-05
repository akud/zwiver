class Event < ActiveRecord::Base
  attr_accessible :date, :description, :venue, :address, :title, :url, :lat, :lon
  
  validates_presence_of :date, :title, :venue, :address

  validates_uniqueness_of :date, :scope => :title

  geocoded_by :address, :latitude => :lat, :longitude => :lon

  after_validation :geocode_if_missing

  def geocode_if_missing
    if !(self.lat && self.lon)
      self.geocode()
    end
  end

  #thinking_sphinx index
  define_index do 
    #fields (things you can search on)
    indexes description
    indexes venue
    indexes address
    indexes title 
    indexes url

    #attributes (things you can filter/group/sort on)
    has date
  end

 

  # Find upcoming events
  # TODO: make this a `find_upcoming_near` and take in IP or location
  # Params:
  # +limit+:: the number of events to return
  # +offset+:: the number of events to offest by
  def self.find_upcoming limit, offset
    where("date > '#{Time.now}'").order("date ASC").limit(limit).offset(offset)
  end
end
