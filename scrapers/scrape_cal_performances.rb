#!/usr/local/bin/ruby -I.
require 'zwiver'
require 'mechanize'
require 'json'
require 'time'

module CalPerformances

  ADDRESS = '101 Zellerbach Hall # 4800, Berkeley, CA' 
  VENUE = 'Zellerbach Hall'
  URL = 'http://calperformances.org/learn/discover-engage/'

  def self.scrape
    agent = Mechanize.new do |agent|
      agent.user_agent_alias = 'Mac Safari'
    end

    page = agent.get URL

    page.links_with(:href => /^\/performances\/\d+/).each do |link|
      event_page = link.click
      title = event_page.title.split('::').first
      url = event_page.uri.to_s
      description = event_page.search('div.TabbedPanelsContent').first.search('p').text
      event_page.search('div#eventPagePurchaseTixBoxDateDiv').each do |date_div|
        date = Time.parse(date_div.text.gsub(/\(.*\)/, '') + ' PDT') 
        Zwiver::Event.new( :title => title,
          :url => url,
          :description => description,
          :date => date,
          :venue => CalPerformances::VENUE,
          :address => CalPerformances::ADDRESS).post
      end
    end
  end
end

Zwiver.register 'Cal Performances Calendar' do
  CalPerformances.scrape
end
