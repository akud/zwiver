require 'mechanize'
require 'time'
require 'zwiver'

module CalAcademy
  
  ADDRESS = '55 Music Concourse Drive  San Francisco, CA 94118'
  URL = 'http://www.calacademy.org/events/nightlife/'
  VENUE = 'California Academy of Sciences'

  def self.scrape
    agent = Mechanize.new do |agent|
      agent.user_agent_alias = 'Linux Firefox'
    end
    page = agent.get URL 
    div_list = page.search('div.tabcontentstyle > div')
    2.times {div_list.pop}
    div_list.each do |div|
      title = div.search('div.tab-content-first table:first-child h2').text

#description is a list of paragraphs
#last 2 are fb and twitter links
      p_list = div.search('div.tab-content-first table:first-child td:last-child > p')
      2.times {p_list.pop}
      description = p_list.text

      day_str = page.search("a[rel='#{div['id']}']").text + ', ' + Time.new.year.to_s
      date = Time.parse(day_str + ' 8pm PDT')
      Zwiver::Event.new(:title => title,
        :date => date,
        :description => description,
        :url => URL,
        :venue => VENUE,
        :address => ADDRESS).post
    end
  end
end


Zwiver.register __FILE__, '0 8 1 * *' do
  CalAcademy.scrape
end
