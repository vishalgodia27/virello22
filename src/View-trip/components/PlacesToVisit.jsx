import React from 'react';
import { searchPlacesWithPhotos } from "../../services/googlePlaces";

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

  // Try multiple possible keys for itinerary data
  let itineraryData = parsedTripData?.itinerary || 
                      parsedTripData?.iternary || 
                      parsedTripData?.dailyPlan || 
                      parsedTripData?.schedule || 
                      parsedTripData?.daily_plan || 
                      parsedTripData?.daily_schedule || 
                      parsedTripData?.plan || 
                      parsedTripData?.activities || 
                      null;
  
  // If itinerary is a string, try to parse it
  if (typeof itineraryData === 'string') {
    try {
      itineraryData = JSON.parse(itineraryData);
    } catch (error) {
      console.error('Error parsing itinerary string:', error);
      itineraryData = null;
    }
  }
  
  // Convert itinerary object to array format for easier rendering
  let itinerary = [];
  if (Array.isArray(itineraryData)) {
    itinerary = itineraryData;
  } else if (itineraryData && typeof itineraryData === 'object') {
    // Convert object with day keys to array format
    itinerary = Object.keys(itineraryData).map(dayKey => {
      const dayData = itineraryData[dayKey];
      return {
        day: dayKey,
        dayNumber: dayKey.replace('day', ''),
        title: dayData.title || `Day ${dayKey.replace('day', '')}`,
        activities: dayData.schedule || dayData.activities || dayData.plan || []
      };
    });
  }
  
  console.log("PlacesTovisit - parsedTripData:", parsedTripData);
  console.log("PlacesTovisit - found itinerary:", itinerary);
  console.log("PlacesTovisit - itinerary type:", typeof itinerary);
  console.log("PlacesTovisit - itinerary length:", Array.isArray(itinerary) ? itinerary.length : 'not array');

  const [photoMap, setPhotoMap] = React.useState({});

  React.useEffect(() => {
    let isCancelled = false;
    async function loadPhotos() {
      try {
        const destination = trip?.userSelection?.location?.label || "";
        const labels = new Set();
        (Array.isArray(itinerary) ? itinerary : []).forEach((day) => {
          const activities = Array.isArray(day?.activities) ? day.activities : Array.isArray(day) ? day : [];
          activities.forEach((activity) => {
            const label = activity?.activity || activity?.description || activity?.name || activity?.place || '';
            if (label && label.length >= 3) labels.add(label);
          });
        });

        const uniqueLabels = Array.from(labels).slice(0, 30);
        const results = await Promise.all(uniqueLabels.map(async (label) => {
          try {
            // Try multiple query variants to improve hit rate
            const queries = [
              destination ? `${label} near ${destination}` : label,
              destination ? `${label} in ${destination}` : label,
              label
            ];
            let photoUrl = "";
            for (const q of queries) {
              const places = await searchPlacesWithPhotos({ textQuery: q, maxResultCount: 1 });
              photoUrl = places?.[0]?.photoUrl || "";
              if (photoUrl) break;
            }
            return [label, photoUrl];
          } catch (e) {
            console.warn("Photo search failed for", label, e);
            return [label, ""];
          }
        }));

        if (!isCancelled) {
          const map = {};
          results.forEach(([label, url]) => { map[label] = url; });
          setPhotoMap(map);
        }
      } catch (e) {
        console.warn("Failed loading photos", e);
      }
    }
    loadPhotos();
    return () => { isCancelled = true; };
  }, [JSON.stringify(itinerary), trip?.userSelection?.location?.label]);

  return (
    <div>
      <h2 className='font-bold text-2xl mb-6 text-gray-800'>Places to Visit</h2>
      <div className="space-y-8">
        {Array.isArray(itinerary) && itinerary.length > 0 ? (
          itinerary.map((item, dayIdx) => {
            const dayNumber = typeof item?.day === 'string'
              ? item.day.replace('day', '')
              : (item?.dayNumber ?? (dayIdx + 1));
            
            return (
              <div key={dayIdx} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-xl mb-6 text-blue-900 border-b border-gray-200 pb-3">
                  Day {dayNumber}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.isArray(item.activities) && item.activities.length > 0 ? (
                                         item.activities.map((activity, actIdx) => {
                      // Create Google Maps search query
                      const searchQuery = encodeURIComponent(
                        activity.activity || 
                        activity.description || 
                        activity.name || 
                        activity.place || 
                        ''
                      );
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
                      
                      const label = activity.activity || activity.description || activity.name || activity.place || '';
                      const photoUrl = (label && photoMap[label]) ? photoMap[label] : "/src/assets/placeholder.jpg";

                      return (
                        <a 
                          key={actIdx} 
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 cursor-pointer"
                        >
                          <div className="mb-3">
                            <img 
                              src={photoUrl} 
                              alt={activity.activity || activity.description || 'Activity'}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                e.target.src = "/src/assets/placeholder.jpg";
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-orange-600 font-bold text-sm">
                                {activity.time || activity.startTime || activity.schedule || ''}
                              </span>
                              {activity.duration && (
                                <span className="text-gray-500 text-xs bg-orange-200 px-2 py-1 rounded-full">
                                  ⏱️ {activity.duration}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                              {activity.activity || activity.description || activity.name || activity.place || ''}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.distance_from_previous && (
                                <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  📍 {activity.distance_from_previous}
                                </span>
                              )}
                              {activity.cost && (
                                <span className="text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full">
                                  💰 {activity.cost}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-center mt-3 pt-2 border-t border-orange-200">
                              <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
                                🗺️ View on Google Maps
                              </span>
                            </div>
                          </div>
                        </a>
                      );
                    })
                                     ) : Array.isArray(item) ? (
                    item.map((activity, actIdx) => {
                      // Create Google Maps search query
                      const searchQuery = encodeURIComponent(
                        activity.activity || 
                        activity.description || 
                        activity.name || 
                        activity.place || 
                        ''
                      );
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
                      
                      const label = activity.activity || activity.description || activity.name || activity.place || '';
                      const photoUrl = (label && photoMap[label]) ? photoMap[label] : "/src/assets/placeholder.jpg";

                      return (
                        <a 
                          key={actIdx} 
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow hover:scale-105 cursor-pointer"
                        >
                          <div className="mb-3">
                            <img 
                              src={photoUrl} 
                              alt={activity.activity || activity.description || 'Activity'}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                e.target.src = "/src/assets/placeholder.jpg";
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-orange-600 font-bold text-sm">
                                {activity.time || activity.startTime || activity.schedule || ''}
                              </span>
                              {activity.duration && (
                                <span className="text-gray-500 text-xs bg-orange-200 px-2 py-1 rounded-full">
                                  ⏱️ {activity.duration}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                              {activity.activity || activity.description || activity.name || activity.place || ''}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.distance_from_previous && (
                                <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  📍 {activity.distance_from_previous}
                                </span>
                              )}
                              {activity.cost && (
                                <span className="text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full">
                                  💰 {activity.cost}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-center mt-3 pt-2 border-t border-orange-200">
                              <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
                                🗺️ View on Google Maps
                              </span>
                            </div>
                          </div>
                        </a>
                      );
                    })
                 ) : (
                   <div className="text-gray-500 text-sm text-center py-8 col-span-full">
                     No activities listed for this day.
                   </div>
                 )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm">
            <p>No itinerary available.</p>
            {parsedTripData && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold mb-2">Debug Info - Available keys:</p>
                <p className="text-xs">{Object.keys(parsedTripData).join(', ')}</p>
                <p className="font-semibold mt-2 mb-1">Raw data structure:</p>
                <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                  {JSON.stringify(parsedTripData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacesTovisit;