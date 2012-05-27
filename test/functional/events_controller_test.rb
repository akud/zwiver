require 'test_helper'

class EventsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:events), 'should have created events list'
    assigns(:events).each do |e|
      assert e.date > Time.now, 'returned an event that wasn\'t in the future'
    end
  end

  test "should get show" do
    event = Event.first :order => 'date' 
    get :show , :id => event.id
    assert_response :success
    assert_not_nil assigns(:event), 'should have assigned event object'
    assert_equal event.id, assigns(:event).id, 'returned incorrect event'
  end
end
