class Event < ActiveRecord::Base
  attr_accessible :date, :description, :location, :title, :url, :lat, :lon
  
  validates_presence_of :date, :url, :location

  validates_uniqueness_of [:url,:title]

  # Find upcoming events
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
