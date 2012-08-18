require 'zwiver'
require 'mechanize'
require 'json'
require 'time'

module SweetwaterMusicHall
  AGENT = Mechanize.new do |agent|
    agent.user_agent_alias = 'Linux Firefox'
  end

  URL = 'http://www.sweetwatermusichall.com/calendar'
  ADDRESS = '19 Corte Madera Ave Mill Valley, CA 94941'
  NAME = 'Sweetwater Music Hall'

  class Calendar
    attr_reader :days, :month, :year
    def initialize
      page = SweetwaterMusicHall::AGENT.get SweetwaterMusicHall::URL
      date_str = page.search("div.date-heading").text.strip
      @month = date_str.split[0]
      @year = date_str.split[1]
      cells = page.search('td.single-day.future:not(.no-entry)')
        .reject {|t| t['class'].include? 'empty'}
      @days = cells.map {|c| SweetwaterMusicHall::Day.new @month, @year, c}
    end

    def to_s
      "Sweetwater Music Hall #{@month}, #{@year}"
    end
  end

  class Day
    attr_reader :events, :date
    def initialize month, year, cell
      day = cell['id'].split('-')[3]
      @date = month + ' ' + day + ', ' + year
      @events = cell.search('div.item').map {|div| SweetwaterMusicHall::Event.new div}
    end

  end

  class Event
    include Zwiver::Saveable

    def initialize div
      @url = div.search('a').find {|a| a.text ==  "More Info & Tickets"}['href']
      @url = SweetwaterMusicHall::URL unless @url && !@url.empty?
      @title = div.search('.views-field-title').text.strip
      @date = Time.parse div.search('.date-display-single').first['content']
      @venue_name = SweetwaterMusicHall::NAME
      @address = SweetwaterMusicHall::ADDRESS
    end
  end
end

Zwiver.register __FILE__, '0 0 1 * *' do
  SweetwaterMusicHall::Calendar.new.days.each do |day|
    puts 'saving events for ' + day.date
    day.events.each do |e|
      e.save
    end
  end
end
