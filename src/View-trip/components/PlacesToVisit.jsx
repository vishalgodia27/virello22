import React from 'react';

function PlacesTovisit({ trip }) {
  // Parse tripData if it's a string (like in Hotels)
  const parsedTripData = React.useMemo(() => {
    if (trip?.tripData) {
      try {
        let cleanedData = trip.tripData;
        // Remove markdown code blocks if present
        cleanedData = cleanedData.replace(/```json\s*|```/gi, '');
        cleanedData = cleanedData.trim();
        return JSON.parse(cleanedData);
      } catch (error) {
        console.error('Error parsing trip data:', error);
        console.log('Raw trip data:', trip.tripData);
        return null;
      }
    }
    return null;
  }, [trip?.tripData]);

  // Try both 'itinerary' and 'iternary' for compatibility
  const itinerary = parsedTripData?.itinerary || parsedTripData?.iternary || [];

  return (
    <div>
      <h2 className='font-bold text-lg mb-4'>Places to Visit</h2>
      <div>
        {Array.isArray(itinerary) && itinerary.length > 0 ? (
          itinerary.map((item, dayIdx) => (
            <div key={dayIdx} className="mb-6">
              <h3 className="font-semibold text-md mb-3 text-blue-900">{item.day ? `Day ${item.day}` : `Day ${dayIdx + 1}`}</h3>
              {Array.isArray(item.activities) && item.activities.length > 0 ? (
                <div className="space-y-2">
                  {item.activities.map((activity, actIdx) => (
                    <div key={actIdx} className="flex flex-col md:flex-row md:items-center md:gap-2 bg-orange-50 rounded-lg p-2">
                      <span className="text-orange-600 font-semibold min-w-[110px] md:text-right md:pr-2">{activity.time}</span>
                      <span className="text-gray-800 font-medium flex-1">{activity.description}</span>
                      {activity.distance && (
                        <span className="text-gray-500 text-xs ml-2">{activity.distance}</span>
                      )}
                      {activity.duration && (
                        <span className="text-gray-400 text-xs ml-2">{activity.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-4 text-gray-500 text-sm">No activities listed for this day.</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">No itinerary available.</div>
        )}
      </div>
    </div>
  );
}

export default PlacesTovisit;