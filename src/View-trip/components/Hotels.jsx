import React from 'react';

function Hotels({ trip }) {
  // Parse the tripData JSON string if it exists
  const parsedTripData = React.useMemo(() => {
    if (trip?.tripData) {
      try {
        let cleanedData = trip.tripData;
        
        // Remove markdown code blocks if present
        if (cleanedData.includes('```json')) {
          cleanedData = cleanedData.replace(/```json\s*/, '').replace(/\s*```/, '');
        } else if (cleanedData.includes('```')) {
          cleanedData = cleanedData.replace(/```\s*/, '').replace(/\s*```/, '');
        }
        
        // Trim whitespace
        cleanedData = cleanedData.trim();
        
        // Try to parse the cleaned JSON
        const parsed = JSON.parse(cleanedData);
        console.log('Parsed trip data:', parsed);
        console.log('All keys in parsed data:', Object.keys(parsed));
        return parsed;
      } catch (error) {
        console.error('Error parsing trip data:', error);
        return null;
      }
    }
    return null;
  }, [trip?.tripData]);

  // Extract hotels from the parsed data - try multiple possible structures
  let hotels = [];
  if (parsedTripData) {
    hotels = parsedTripData.hotels || parsedTripData.Hotels || parsedTripData.hotel || parsedTripData.accommodations || [];
    console.log('Found hotels:', hotels);
    console.log('Hotels array length:', hotels.length);
  }

  // Helper function to get price from various possible property names
  const getHotelPrice = (hotel) => {
    console.log('Checking hotel for price:', hotel);
    const price = hotel.price || hotel.pricePerNight || hotel.cost || hotel.rate || hotel.nightlyRate || hotel.avgPrice || hotel.price_per_night || hotel.nightly_price || hotel.price_range;
    console.log('Found price:', price);
    return price;
  };

  // Helper function to get rating from various possible property names
  const getHotelRating = (hotel) => {
    return hotel.rating || hotel.stars || hotel.score || hotel.reviewScore;
  };

  return (
    <div className="space-y-6">
      <h2 className='font-bold text-2xl text-gray-800'>Hotel Recommendations</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {hotels.map((hotel, index) => {
          const price = getHotelPrice(hotel);
          const rating = getHotelRating(hotel);
          
          return (
          <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address || hotel.name || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-32 h-auto flex flex-col items-center overflow-hidden rounded-lg transition-transform duration-200 cursor-pointer hover:shadow-lg hover:scale-105 text-black no-underline"
          >
            <div key={index} className="w-32 h-auto flex flex-col items-center overflow-hidden rounded-lg transition-transform duration-200 cursor-pointer hover:shadow-lg hover:scale-105">
              <img 
                src={hotel.image || hotel.imageUrl || hotel.image_url || "/src/assets/placeholder.jpg"} 
                alt={hotel.name || hotel.hotelName || `Hotel ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/src/assets/placeholder.jpg";
                }}
              />
              <h2 className="mt-2 text-center text-sm font-semibold text-gray-700 truncate w-full" title={hotel.hotelName || hotel.name}>
                {hotel.hotelName || hotel.name}
              </h2>
              {hotel.address && (
                <p className="mt-1 text-center text-xs text-gray-500 truncate w-full" title={hotel.address}>
                  📍 {hotel.address}
                </p>
              )}
              <div className="mt-1 flex items-center justify-center gap-2">
                {price && (
                  <span className="text-xs font-semibold text-red-600">
                    ${price}
                  </span>
                )}
                {rating && (
                  <span className="text-xs text-yellow-600 font-semibold">
                    ⭐ {rating}
                  </span>
                )}
              </div>
            </div>
          </a>
          );
        })}
      </div>
      {(!hotels || hotels.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No hotel recommendations available for this trip.</p>
          {parsedTripData && (
            <p className="text-sm mt-2">Available keys: {Object.keys(parsedTripData).join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Hotels;