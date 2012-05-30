require 'test_helper'

class EventTest < ActiveSupport::TestCase
  test "basic save" do
    event = Event.new :date => Time.now,
      :description => 'foo',
      :location => 'foo',
      :title => 'foo',
      :url => 'foo'
    assert event.save, 'failed to save event'
    assert_not_nil event.id, 'event didn\'t have an id'
  end

  test "doesn't allow save without date" do
    event = Event.new :date => nil, 
      :location => 'foo',
      :title => 'foo',
      :url => 'foo'
    assert !event.save, 'event saved without date'
    assert_nil event.id, 'event had id generated'
  end

  test "doesn't allow save without url" do
    event = Event.new :date => Time.now, 
      :location => 'foo',
      :title => 'foo',
      :url => nil
    assert !event.save, 'event saved without url'
    assert_nil event.id, 'event had id generated'
  end

  test "doesn't allow save without location" do
    event = Event.new :date => Time.now, 
      :location => nil,
      :title => 'foo',
      :url => 'foo'
    assert !event.save, 'event saved without location'
    assert_nil event.id, 'event had id generated'
  end

  test "unique title and url" do
    e1 = Event.new :date => Time.now, 
      :location => 'location',
      :title => 'non_unique_title',
      :url => 'non_unique_url'
    assert e1.save, 'didn\'t save first event'
     e2 = Event.new :date => Time.now, 
      :location => 'location',
      :title => 'non_unique_title',
      :url => 'non_unique_url'
    assert !e2.save, 'allowed non-unique title and url to be saved'
  end

  test "find upcoming" do
    upcoming = Event.find_upcoming 2
    assert_not_nil upcoming, 'returned nil list'
    assert upcoming.length >= 2, "didn't find all upcoming events"
    upcoming.each do |u|
      assert u.date > Time.now, "returned an event that wasn't in the future"
      #since we go up to the midnight two days in the future, it could be up to 
      #3 24 hour periods from now
      assert u.date < Time.now + (3*60*60*24), 
        "returned an event too far in to the future"
    end
  end
  test "search" do 
    results = Event.search ['comedy']
    assert_not_nil results, 'returned nil results list'
    assert !results.empty?, 'returned empty results list'
  end
end
