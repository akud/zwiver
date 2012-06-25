#!/usr/bin/ruby -I.
if ARGV.length < 1
  puts "Usage: #{$0} search_term" 
  exit
end

require 'facebook' 

terms = ['music','comedy','event','perform','open mic','calendar']
venues = VenueList.new ARGV.shift
begin 
  venues.list.find_all {|v| v.matches? terms}.each do |venue|
    puts "#{venue['name']},#{venue['site']}"
  end
  venues.next!
end while venues.has_next?
