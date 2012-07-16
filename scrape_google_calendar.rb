#!/usr/bin/ruby -I.
require 'rubygems'
require 'gcal4ruby'
require 'zwiver_event'

calendar_id = 'zwiver.com_gniohjo4b9130ajkrrpc34jbd0@group.calendar.google.com'
gcal = GCal4Ruby::Service.new
gcal.authenticate 'alexk@zwiver.com', 'fl1NNtpH'

events = GCal4Ruby::Event.find gcal, :calendar => calendar_id, :futureevents => true

events.find_all {|e| e.attendees.map {|a| a[:name]}.include? 'Annalysa_cal'}.each do |event|
  begin
    Zwiver::Event.new(:title => event.title,
      :description => event.content,
      :date => event.start_time,
      :venue => event.where.split('|')[0],
      :address => event.where.split('|')[1]
    ).post
  rescue ArgumentError => e
    puts e.to_s
  end
end
