class RootController < ApplicationController
  def root
    render :json => {
      :upcoming => {
        :url => url_for(:only_path => false, :controller => 'events', :action => 'index'),
        :limitParam => EventsController.index_limit_param,
        :startParam => EventsController.index_limit_param,
        :description => 'List upcoming events'
      },
      :search => {
        :url => url_for(:only_path => false, :controller => 'events', :action => 'search'),
        :description => "Search events"
      }
    }
  end
end
