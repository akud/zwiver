require 'minitest/autorun'
require 'google'
require 'stringio'

#Expand Kernel module to allow capturing stdout 
#Copied from http://thinkingdigitally.com/archive/capturing-output-from-puts-in-ruby/
module Kernel
  def capture_stdout
    out = StringIO.new
    $stdout = out
    yield
    return out
  ensure
    $stdout = STDOUT
  end
 
end

class TestGoogle < MiniTest::Unit::TestCase
  def test_scrape_all 
    out = capture_stdout do 
      Google.scrape 'bar', 20
    end

    assert_equal 20, out.string.lines.count, 'incorrect number of lines'
    out.string.lines.each do |line|
      assert_equal 2, line.split(',').length, "#{line} had incorrect number of csv fields"
    end
  end
end
