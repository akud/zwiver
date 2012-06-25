module Pointlike
  @@R = 6371 # km
  
  def distance_to lat, lon
    dLat = (@lat-lat)*Math::PI/180
    dLon = (@lon-lon)*Math::PI/180
    lat1 = @lat*Math::PI/180
    lat2 = lat*Math::PI/180

    a = (Math.sin(dLat/2) * Math.sin(dLat/2)) + 
     (Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2) )
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    @@R * c
  end
end
