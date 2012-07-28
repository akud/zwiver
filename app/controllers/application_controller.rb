class ApplicationController < ActionController::Base
  protect_from_forgery

  def default_url_options
    if Rails.env.production?
      {:host => 'www.zwiver.com/api',
       :port => nil 
      }
    else  
     {
       :host => 'localhost/api',
       :port => nil
     }
    end
  end

end
