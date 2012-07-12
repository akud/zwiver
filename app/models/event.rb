class Event < ActiveRecord::Base
  attr_accessible :date, :description, :venue, :address, :title, :url, :lat, :lon
  
  validates_presence_of :date, :title, :venue, :address

  validates_uniqueness_of :date, :scope => :title

  geocoded_by :address, :latitude => :lat, :longitude => :lon
  after_validation :geocode 

  # Find upcoming events
  # TODO: make this a `find_upcoming_near` and take in IP or location
  # Params:
  # +limit+:: the number of events to return
  # +offset+:: the number of events to offest by
  def self.find_upcoming limit, offset
    where("date > '#{Time.now}'").order("date ASC").limit(limit).offset(offset)
  end
  
  # Search for events matching terms
  #
  # TODO: use a search engine to do this
  #
  # Params:
  # +terms+:: array or comma-delimited string of terms to search on (e.g. comedy, etc.)
  def self.search terms=[]
    if terms.kind_of?  String
      terms = terms.split ','    
    end
    results = []
    terms.each do |t|
      results << (where 'title ilike ? or description ilike ?', t, t)
    end
    results
  end
end
