require 'csv'
CSV.foreach(ARGV[0]) do |row|
  name = row[0].split.map {|w| w.capitalize}.join ' '
  addr = row[3].split.map {|w| w.capitalize}.join ' '
  city = row[4].split.map {|w| w.capitalize}.join ' '
  state = row[5] 
  zip = row[6].split('-')[0]
  puts ([name , addr, city, state, zip].join ',')
end
