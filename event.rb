require 'json'
require 'net/http'

class Event
	
	EVENT_URL = URI.parse('http://localhost/api/events/')

	def initialize args
		@body = args.to_json
	end


	def post
		response = Net::HTTP.post_form EVENT_URL, { 
			:event => @body
		}
		response.value #will raise exception if not success
		rescue => e 
			puts 'Failed to save event'
			puts e.inspect
			puts e.backtrace
	end
end
