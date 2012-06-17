require 'mechanize'
require 'csv'

module Google
  
  #Mechanize agent to fetch pages
  AGENT = Mechanize.new do |agent| 
    agent.user_agent_alias = 'Linux Firefox'
  end
  
  #List of sites to exclude from google search results
  BLACKLIST = [
    'yelp.com',
    'bissapbaobab.com',
    'ebar.com',
    'sfbar.org'
  ]
 
  # Scrape a list of San Francisco venues from Google
  # This is achieved by performing a search like:
  # "cafe San Francisco -site:yelp.com"
  # 
  # Params:
  # +term+:: the term to search on, e.g. cafe, bar
  # +num_results+:: the number of results to get
  def Google.scrape term, num_results=100
    page = Google::AGENT.get('http://www.google.com').form_with(:name => 'f') do |search|
      search.q = "#{term} San Francisco"
      Google::BLACKLIST.each do |site|
        search.q += " -site:#{site}"
      end
    end.submit
    count = 0
    until count >= num_results do
      page.links_with(:href => /\/url/).each do |link|
        name = link.text
        url = link.click.uri.to_s
        CSV { |csv_out| csv_out << [name.gsub(',',''), url] }
        count += 1
      end
      page = page.link_with(:text => 'Next').click
    end
  end
end

if $0 == __FILE__
  if ARGV.empty?
    puts "Usage #{$0} term [number of results]"
    exit(1)
  end
  if ARGV.length == 2
    Google.scrape ARGV[0], ARGV[1].to_i
  else 
    Google.scrape ARGV[0] 
  end
end
