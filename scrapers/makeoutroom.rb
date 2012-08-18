require 'zwiver'
require 'mechanize'
require 'json'
require 'time'

module MakeoutRoom
  AGENT = Mechanize.new do |agent|
    agent.user_agent_alias = 'Linux Firefox'
  end

  URL = 'http://www.makeoutroom.com/events/'
  ADDRESS = '3225 22nd St, San Francisco, CA 94110'
  NAME = 'Make-Out Room'

  class Calendar
    attr_reader :days, :month, :year
    def initialize
      @page = MakeoutRoom::AGENT.get MakeoutRoom::URL
      @month = @page.search("select[name='month'] option[selected='selected']").text
      @year = @page.search("select[name='year'] option[selected='selected']").text
      @days = @page.search('td.day_cell').map {|t| MakeoutRoom::Day.new month, year, t}  
    end
    def to_s
      "Makeout Room Calendar #{@month}, #{@year}"
    end
  end

  class Day
    attr_reader :day, :events 
    def initialize month, year, cell
      day = cell.search('span.day_number').text.strip
      @day = month + ' ' + day + ', ' + year
      #look for diff events in the day by the times listed
      text = cell.search('div.title_txt').text
      events = text.gsub(/([:\d]+\s?pm)/, '\1SPLIT_ME').split 'SPLIT_ME'
      @events = events.find_all {|t| t =~ /([:\d]+\s?pm)/}.map {|t| MakeoutRoom::Event.new @day, t}
    end

    def to_s
      "Makeout Room day (#{@day})"
    end
  end

  class Event
    include Zwiver::Saveable

    def initialize day_str, text
      time = text.gsub /([:\d]+)\s?pm/, '\1' 
      @date = Time.parse "#{day_str} #{convert_to_24hr time} PDT"
      @title = text.gsub(/\s[:\d]+\s?pm/, '')
      @venue_name = MakeoutRoom::NAME
      @url = MakeoutRoom::URL
      @address = MakeoutRoom::ADDRESS
    end

    private 
    def convert_to_24hr time
      hour = time.to_i + 12
      minutes = (time.include? ':') ? time.split(':')[1] : '00' 
      "#{hour}:#{minutes}"
    end
  end
end

Zwiver.register __FILE__, '0 8 1 * *' do
  MakeoutRoom::Calendar.new.days.each do |day|
    puts 'saving events for ' + day.day
    day.events.each do |event|
      puts event
      event.save
    end
  end
end
