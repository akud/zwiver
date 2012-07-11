class Event < ActiveRecord::Base
  attr_accessible :date, :description, :venue, :address, :title, :url, :lat, :lon
  
  validates_presence_of :date, :url, :venue, :address

  validates_uniqueness_of :date, :scope => :title

  geocoded_by :address, :latitude => :lat, :longitude => :lon
  after_validation :geocode 

  # Find upcoming events
  # TODO: make this a `find_upcoming_near` and take in IP or location
  # Params:
  # +days_in_future+:: number of days in the future to look.
  #                     goes up to midnight that night
  def self.find_upcoming days_in_future=2
    start_time = Time.now 
    end_time = Chronic.parse "#{days_in_future} days from now at midnight"
    where :date => start_time..end_time
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
