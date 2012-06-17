require 'csv'
CSV.foreach(ARGV[0]) do |row|
  name = row[0].split.map {|w| w.capitalize}.join ' '
  addr = row[3].split.map {|w| w.capitalize}.join ' '
  city = row[4].split.map {|w| w.capitalize}.join ' '
  zip = row[5]
  puts name + ',' + ([addr, city, zip].join ' ')
end
