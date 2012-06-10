require 'minitest/autorun'
require 'warfield'

#Reopen event to override post method
class Event
	attr_reader :post_called
	@@events = []
	
	def initialize params
		@body = params
		@@events << self
	end
	
	def post
		@post_called = true
	end

	def self.all
		@@events
	end

end

class TestWarfield < MiniTest::Unit::TestCase
	def setup
		@scraper = WarfieldScraper.new
	end

	def test_scrape_all 
		initial_num = Event.all.length
		@scraper.scrape_all
		all = Event.all
		assert all.length > initial_num, 'created some events'
		all.slice(initial_num..all.length).each do |e|
			assert e.post_called, 'called post on all events that got created'
		end
	end
end
