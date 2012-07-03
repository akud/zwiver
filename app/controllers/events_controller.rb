class EventsController < ApplicationController
 
  def index
    @events = Event.find_upcoming
    render :json => @events
  end

  def show 
    @event = Event.find params[:id]
    render :json => @event
  end

  def search 
    @events = Event.search params[:terms]
    render :json => @events
  end

  def create 
    @event = Event.find_by_url_and_title params[:event][:url], params[:event][:title]
    if @event 
      render :nothing => true, :status => :conflict, :location => @event
    else 
      @event = Event.new params[:event]
      if @event.save
        render :nothing => true, :status => :created, :location => @event
      else
        render :json => @event.errors.to_json, :status => :error
      end
    end
  end
end
