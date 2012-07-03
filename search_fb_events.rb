#!/usr/bin/ruby -I.

require 'facebook'
('a'..'z').each do |letter|
  events = EventList.new letter
  begin
    events.list.find_all {|e| e.has_location? && e.distance_from(37.7750,-122.4183) < 20}.each do |e|
      puts e.to_json
    end
    events.next!
  end while events.has_next?
end
