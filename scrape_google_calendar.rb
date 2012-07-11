calendar_id = 'zwiver.com_gniohjo4b9130ajkrrpc34jbd0@group.calendar.google.com'
require "rubygems"
require "gcal4ruby"

gcal = GCal4Ruby::Service.new
gcal.authenticate "alexk@zwiver.com", "fl1NNtpH"

events = GCal4Ruby::Event.find gcal, :calendar => calendar_id, :futureevents => true

events.find_all {|e| e.attendees.map {|a| a[:name]}.include? 'Annalysa_cal'}.each do |event|
    puts event.title
    puts event.content
    puts event.start_time
    puts '-----------------------'
end

