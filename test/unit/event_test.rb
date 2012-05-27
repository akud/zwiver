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
    upcoming = Event.find_upcoming
    assert_not_nil upcoming, 'returned nil list'
    assert_equal 2, upcoming.length
  end
end
