#!/usr/local/bin/ruby -I.
require 'zwiver'
require 'mechanize'
require 'json'
require 'time'

module Amnesia 

  AGENT = Mechanize.new do |agent|
    agent.user_agent_alias = 'Linux Firefox'
  end

  URL = 'http://amnesiathebar.com/newp/calendar/'
  ADDRESS = '853 Valencia St, San Francisco, CA 94110'
  NAME = "Amnesia"

  class Calendar 

    attr_reader :month, :year

    def initialize
      @page = Amnesia::AGENT.get Amnesia::URL
      month_and_year = @page.search('td.calendar-month').text.strip
      @month = month_and_year.gsub /(.*) \d{2,4}/, '\1'
      @year = month_and_year.gsub /.* (\d{2,4})/, '\1' 
      @year = "20#{@year}" if @year.length == 2
    end

    def cells
      cells = @page.search('td.day-with-date').map {|cell| Day.new self, cell}
      cells << (Day.new self, @page.search('td.current-day').first)
      cells
    end

    def to_s
      "Amnesia Calendar (#{@month}, #{@year})"
    end
  end

  class Day

    attr_reader :date

    def initialize parent_calendar, cell
      @cell = cell
      day = cell.search('span').find_all do |span| 
        span.text =~ /^\s*[0-9]+\s*$/
      end.first.text.strip 
      @date = "#{parent_calendar.month} #{day}, #{parent_calendar.year}" 
    end

    def events 
      @cell.search('span.details').map {|span| Event.new self, span}
    end

    def to_s
      "Amnesia Calendar Cell (#{@date})"
    end

  end

  class Event

    attr_reader :date, :title, :description, :url, :address
    include Zwiver::Saveable

    def initialize parent, span
      span = span
      time = span.text.gsub /.*?([:0-9]+)( ?- ?[:0-9]+)?pm.*/m, '\1'
      @date = Time.parse "#{parent.date} #{convert_to_24hr time} PDT"
      h3 = span.search('h3').first
      if h3
        @title = h3.text.strip
        @description = span.text.gsub(title, '').strip
      else
        @title = span.text
        @description = nil
      end
      @url = Amnesia::URL
      @address = Amnesia::ADDRESS
      @venue_name = Amnesia::NAME
    end

    private 
    def convert_to_24hr time
      hour = time.to_i + 12
      minutes = (time.include? ':') ? time.split(':')[1] : '00' 
      "#{hour}:#{minutes}"
    end
  end
end

Zwiver.register 'Amnesia' do
  Amnesia::Calendar.new.cells.each do |cell|
    cell.events.each do |event|
      event.save
    end
  end
end
