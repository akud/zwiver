class EventsController < ApplicationController

  def self.index_limit_param; :limit; end
  def self.index_start_param; :start; end
 
  def index
    begin
      params[:start] ||= 0
      params[:limit] ||= 20
      @events = Event.find_upcoming params[:limit], params[:start]
      json = {}
      json[:events] = @events
      if params[:start].to_i < Event.where("date > '#{Time.now}'").count
        json[:nextUrl] = url_for :action => 'index', 
          :controller => 'events',
          :start => params[:start].to_i + params[:limit].to_i,
          :limit => params[:limit].to_i
      end
      if params[:start].to_i > 0
        json[:prevUrl] = url_for :action => 'index',
          :controller => 'events',
          :start => params[:start].to_i - params[:limit].to_i, 
          :limit => params[:limit].to_i
      end

      render :json => json, :status => :ok
    rescue => e
      render :status => :internal_server_error, :json => {:error => e.to_s}
    end
  end

  def show 
    @event = Event.find params[:id]
    if @event
      render :json => @event
    else 
      render :status => :not_found, :nothing => true
    end
  end

  def search 
    begin
      @events = Event.search params[:q], 
        :order => :date, 
        :sort_mode => :asc,
        :with => { :date => Time.now..(Time.now + 4.months)}
      render :json => @events
    rescue => e
      render :status => :internal_server_error, :json => {:error => e.to_s} 
    end
  end

  def create 
    begin
      @event = Event.find_by_title_and_date params[:event][:title], Chronic.parse(params[:event][:date])
      if @event 
        render :nothing => true, :status => :conflict, :location => @event
      else 
        @event = Event.new params[:event]
        if @event.save
          render :nothing => true, :status => :created, :location => @event
        else
          Rails.logger.error "Failed to create event: #{@event.errors.to_json}"
          render :json => @event.errors.to_json, :status => :bad_request
        end
      end
    rescue => e
      render :status => :internal_server_error, :json => {:error => e.to_s}
    end
  end
end
