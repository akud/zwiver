#!/usr/bin/ruby -I.

require 'facebook'
('a'..'z').each do |letter|
  puts letter
  events = EventList.new letter
  puts "Loaded #{events.list.length} events"
  begin
    events.list.find_all {|e| e.has_location? && e.distance_from(37.7750,-122.4183) < 10}.each do |e|
      puts e.to_json
    end
    events.next!
  end while events.has_next?
end
