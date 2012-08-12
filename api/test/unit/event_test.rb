require 'test_helper'

class EventTest < ActiveSupport::TestCase
  test "basic save" do
    event = Event.new :date => Time.now,
      :description => 'foo',
      :venue => 'foo',
      :title => 'foo',
      :url => 'foo',
      :address => '982 Market St  San Francisco, CA 94102'
    assert event.save, 'failed to save event'
    assert_not_nil event.id, 'event had no id'
    assert_not_nil event.lat, 'event had no latitude'
    assert_equal 37.783, event.lat.to_f.round(3), 'event had incorrect latitude'
    assert_not_nil event.lon, 'event had no longitude'
    assert_equal -122.41, event.lon.to_f.round(3), 'event had incorrect longitude'
  end

  test 'save with lat and lon' do 
    lat = 35.123
    lon = -120.00
    event = Event.new :date => Time.now,
      :description => 'foo',
      :venue => 'foo',
      :title => 'foo',
      :url => 'foo',
      :lat => lat,
      :lon => lon,
      :address => '982 Market St  San Francisco, CA 94102'
    assert event.save, 'failed to save event'
    assert_equal lat, Event.find(event.id).lat, 'overwrote latitude'
    assert_equal lon, Event.find(event.id).lon, 'overwrote latitude'
  end

  test "doesn't allow save without date" do
    event = Event.new :date => nil, 
      :venue => 'foo',
      :title => 'foo',
      :url => 'foo',
      :address => '982 Market St  San Francisco, CA 94102'
    assert !event.save, 'event saved without date'
    assert_nil event.id, 'event had id generated'
  end
=begin
  test "doesn't allow save without url" do
    event = Event.new :date => Time.now, 
      :venue => 'foo',
      :title => 'foo',
      :url => nil,
      :address => '982 Market St  San Francisco, CA 94102'
    assert !event.save, 'event saved without url'
    assert_nil event.id, 'event had id generated'
  end
=end

  test "doesn't allow save without venue" do
    event = Event.new :date => Time.now, 
      :venue => nil,
      :title => 'foo',
      :url => 'foo',
      :address => '982 Market St  San Francisco, CA 94102'
    assert !event.save, 'event saved without venue'
    assert_nil event.id, 'event had id generated'
  end

  test "doesn't allow save without address" do
    event = Event.new :date => Time.now, 
      :venue => 'foo',
      :title => 'foo',
      :url => 'foo'
    assert !event.save, 'event saved without venue'
    assert_nil event.id, 'event had id generated'
  end

  test "unique title and date" do
    date = Chronic.parse 'next sunday at midnight'
    e1 = Event.new :date => date, 
      :venue => 'venue',
      :title => 'non_unique_title',
      :url => 'some url',
      :address => '982 Market St  San Francisco, CA 94102'
    assert e1.save, "didn't save first event"

     e2 = Event.new :date => Time.now, 
      :venue => 'venue',
      :title => 'non_unique_title',
      :url => 'some other url',
      :address => '982 Market St  San Francisco, CA 94102'
    assert e2.save, "didn't allow save with different date"

   e3 = Event.new :date => date, 
      :venue => 'venue',
      :title => 'Brand new title',
      :url => 'some other url',
      :address => '982 Market St  San Francisco, CA 94102'
   assert e3.save, "didn't allow save with different title"

   e4 = Event.new :date => date, 
      :venue => 'venue',
      :title => 'Brand new title',
      :url => 'some other url',
      :address => '982 Market St  San Francisco, CA 94102'
   assert !e4.save, "allowed non-unique title and date to be saved"
  end

  test "find upcoming" do
    upcoming = Event.find_upcoming 2, 0
    assert_not_nil upcoming, 'returned nil list'
    assert_equal upcoming.length, 2, "didn't find all upcoming events"
    upcoming.each do |u|
      assert u.date > Time.now, "returned an event that wasn't in the future"
    end
  end
  test "search" do 
    results = Event.search ['comedy']
    assert_not_nil results, 'returned nil results list'
    assert !results.empty?, 'returned empty results list'
  end
end
