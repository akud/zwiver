#!/usr/local/bin/ruby -I.

require 'rubygems'
require 'mechanize'
require 'time'
require 'zwiver'

module BayAreaScienceCalendar 

  URL = 'http://www.bayareascience.org/calendar/'

# Parse a calendar page and return a list of all 
# the events on the page
  def self.get_events page
    page.links_with(:href => \
      /http:\/\/www.bayareascience.org\/calendar\/index.php\?eID=\d+/).map do |link|
      event_page = link.click
      Zwiver::Event.new :url => event_page.uri.to_s,
        :title => event_page.search('h1').text,
        :description => event_page.search('span[itemprop="description"]').text,
        :date => Time.parse(event_page.search('time').first['content']),
        :address => event_page.search('span[itemprop="streetAddress"]').text + 
          ', ' + event_page.search('span[itemprop="addressLocality"]').text + 
          ' ' + event_page.search('span[iemprop="addressRegion"]').text + 
          ' ' + event_page.search('span[itemprop="postalCode"]').text,
        :venue => event_page.search('h2.location').text.strip
    end
  end

#get the next page from a calendar page 
  def self.next_page page
    page.link_with(:text => 'Browse Forward').click
  end

#parse pages from the Bay Area Science Calendar,
#
#Params:
#
# limit - the number of pages to parse (by clicking on the 'next' button)
  def self.parse_pages limit=5
    agent = Mechanize.new do |agent|
      agent.user_agent_alias = 'Linux Firefox'
    end

    page = agent.get URL
    limit.times do |i|
      puts "parsing page #{i + 1}"
      self.get_events(page).each do |event|
        event.post
      end
      page = self.next_page page
    end
  end
end
Zwiver.register 'Bay Area Science Calendar' do
  BayAreaScienceCalendar.parse_pages
end
