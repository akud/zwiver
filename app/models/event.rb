class Event < ActiveRecord::Base
  attr_accessible :date, :description, :location, :title, :url
  
  validates_presence_of :date, :url, :location

  validates_uniqueness_of [:url,:title]

  def self.find_upcoming days_in_future=2
    where :date => (Time.now)..(Time.now + (days_in_future*60*60*24))
  end

end
