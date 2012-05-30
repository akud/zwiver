class RootController < ApplicationController
  def root
    render :json => {
      :upcoming => '/events',
      :search => '/events/search'
    }
  end
end
