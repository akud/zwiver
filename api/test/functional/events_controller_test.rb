require 'test_helper'

class EventsControllerTest < ActionController::TestCase
  test "get index" do
    get :index, {:limit => 1, :start => 2}
    assert_response :success
    assert_not_nil assigns(:events), 'should have created events list'
    assert assigns(:events).length > 0, 'should have returned events'
    assigns(:events).each do |e|
      assert e.date > Time.now, 'returned an event that wasn\'t in the future'
    end
    assert_equal 'http://localhost/api/events?limit=1&start=3', JSON.parse(@response.body)['nextUrl']
    assert_equal 'http://localhost/api/events?limit=1&start=1', JSON.parse(@response.body)['prevUrl']
  end

  test "get single event" do
    event = Event.first :order => 'date' 
    get :show , :id => event.id
    assert_response :success
    assert_not_nil assigns(:event), 'should have assigned event object'
    assert_equal event.id, assigns(:event).id, 'returned incorrect event'
  end

  test "post" do 
    assert_difference('Event.count') do 
      post :create, :event => {
        :title => 'Classical Revolution',
        :date => Time.now + (60*60*24),
        :venue => 'Revolution Cafe',
        :address => '3248 22nd St San Francisco, CA 94110',
        :url => 'http://www.revolutioncafesf.com/#!/as_our-events'
      }
    end
    assert_response :success
  end
end
