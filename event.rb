require 'json'
require 'net/http'

class Event
	
	EVENT_URL = URI.parse('http://localhost/api/events/')

	def initialize args
		@body = args
	end


	def post
		response = Net::HTTP.post_form EVENT_URL, { 
			:event => @body.to_json
		}
		unless response.is_a? Net::HTTPSuccess
			puts "Failed to save event for #{@body[:url]}"
			puts response.code, response.message
		end
	end
end
