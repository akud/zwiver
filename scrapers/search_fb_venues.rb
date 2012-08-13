#!/usr/bin/ruby -I.
require 'facebook' 
require 'pointlike'


class VenueList < FBList
  def initialize query, center='37.7750,-122.4183', distance=50000
    super Venue, :q => query,
      :type => 'place',
      :center => center,
      :distance => distance
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


Zwiver.register do
  if ARGV.length < 1
    puts "Usage: #{$0} search_term" 
    exit
  end

  terms = ['music','comedy','event','perform','open mic','calendar']
  venues = VenueList.new ARGV.shift
  begin 
    venues.list.find_all {|v| v.matches? terms}.each do |venue|
      puts venue['site']
    end
    venues.load_next!
  end while venues.has_next?
end
