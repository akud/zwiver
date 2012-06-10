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
    @event = Event.new params[:event]
    @event.save
    render :json => @event, 
      :status => :created, :location => @event
  end
end
