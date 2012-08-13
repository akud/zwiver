require 'mechanize'
require 'csv'

module Google
  
  #Mechanize agent to fetch pages
  AGENT = Mechanize.new do |agent| 
    agent.user_agent_alias = 'Linux Firefox'
  end
  
  #List of sites to exclude from google search results
  BLACKLIST = [
    'yelp.com', 'bissapbaobab.com', 'ebar.com', 'sfbar.org', 'ticketmaster.com', 'cbslocal.com',
    'about.com', 'facebook.com', 'twitter.com', 'sfstandup.com', 'sfgate.com', 'laughstub.com',
    'sfstation.com', 'sanfrancisco.com', 'citysearch.com', 'eater.com', 'gaycities.com',
    'sfweekly.com', 'sanfrancisco.travel', 'crawlsf.com', 'sfbarexperiment.com', 'askmen.com',
    'foursquare.com', 'prnewswire.com', 'wikipedia.org', 'opentable.com', 'gayot.com',
    'venturebeat.com', 'linkedin.com', 'meetup.com', 'schmap.com', 'menupages.com',
    'travelchannel.com', 'youtube.com', 'noaa.gov', 'yahoo.com', 'quora.com',
    'friendssfpl.org', 'sff.net', 'gop.gov', 'biblio.com', 'interleaves.org',
    'ferrybuildingmarketplace.com', 'coffeeratings.com', 'urbanspoon.com', 'localeats.com',
    'allgoodseats.com'
  ]

  def self.search term
    Google::AGENT.get('http://www.google.com').form_with(:name => 'f') do |search|
      search.q = "#{term}"
    end.submit
  end
 
  # Scrape a list of San Francisco venues from Google
  # This is achieved by performing a search like:
  # "cafe San Francisco -site:yelp.com"
  # 
  # Params:
  # +term+:: the term to search on, e.g. cafe, bar
  # +num_results+:: the number of results to get
  def self.find_venues term, num_results=100
    q = "#{term} San Francisco"
    BLACKLIST.each do |site|
      q += " -site:#{site}"
    end
    page = search q
    count = 0
    until count >= num_results do
      page.links_with(:href => /\/url/).each do |link|
        begin
          name = link.text
          url = link.click.uri.to_s
          CSV { |csv_out| csv_out << [name.gsub(',',''), url] }
          count += 1
        rescue => e
          $stderr.puts "Error fetching #{link.href}:"
          $stderr.puts e.message
        end
      end
      page = page.link_with(:text => 'Next').click
    end
  end

  def self.find_ca_address venue
#look for an address on the page with some basic searches
    ['','address','directions', 'map', 'san francisco', 'san jose', 'sacramento'].each do |suffix|
      page = search(venue + ' ' + suffix)
      
      node = page.search('div#ires td').find_all {|td| td.text =~ /, CA [0-9]{5}/}.first
      return node.text.gsub /(.*, CA [0-9]{5}).*/, '\1' if node
    end
#return nil to indicate failure
    return nil
  end
end

Zwiver.register do
  if ARGV.empty?
    puts "Usage #{$0} term [number of results]"
    exit(1)
  end
  if ARGV.length == 2
    Google.find_venues ARGV[0], ARGV[1].to_i
  else 
    Google.find_venues ARGV[0] 
  end
end
