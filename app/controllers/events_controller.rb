class EventsController < ApplicationController
 
  def index
    params[:start] ||= 0
    params[:limit] ||= 10
    @events = Event.find_upcoming params[:limit], params[:start]
    json = {}
    json[:events] = @events
    json[:next] = {
      :start => params[:start].to_i + 10
    }
    json[:prev] = {
      :start => params[:start].to_i - 10
    } if params[:start].to_i > 0

    render :json => json
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
    @event = Event.find_by_title_and_date params[:event][:title], params[:event][:date]
    if @event 
      render :nothing => true, :status => :conflict, :location => @event
    else 
      @event = Event.new params[:event]
      if @event.save
        render :nothing => true, :status => :created, :location => @event
      else
        Rails.logger.error "Failed to create event: #{@event.errors.to_json}"
        render :json => @event.errors.to_json, :status => :error
      end
    end
  end
end
