import { GetPlacesDetails } from '@/services/GloballApi';
import React, { useEffect } from 'react';

function InfoSection({ trip }) {
  useEffect(()=>{
   trip&& GetPlacePhotos();
  },[trip])
  const data={
    textQuery:'trip?.userSelection?.location?.label'
   }
  const GetPlacePhotos=async()=> GetPlacesDetails(data).then(res=>{
    console.log(res.data)

  })
  
  return (
    <div>
      {/* Header image */}
      <img
        src="/src/assets/placeholder.jpg"
        alt="Destination"
        className="h-[340px] w-full object-cover rounded-xl"
      />

      {/* Location title */}
      <div className="my-5">
        <h2 className="font-bold text-2xl">
          {trip?.userSelection?.location?.label}
        </h2>
      </div>

      {/* Trip Info Tags */}
      <div className="flex flex-wrap gap-4">
        <div className="px-4 py-2 bg-gray-100 border border-gray-700 rounded-full text-gray-800 text-sm font-medium shadow-sm">
          Number of days   🗓️   : {trip?.userSelection?.days?.value}
        </div>
        <div className="px-4 py-2 bg-gray-100 border border-gray-700 rounded-full text-gray-800 text-sm font-medium shadow-sm">
          Type of budget   💰 : {trip?.userSelection?.budget?.value}
        </div>
        <div className="px-4 py-2 bg-gray-100 border border-gray-700 rounded-full text-gray-800 text-sm font-medium shadow-sm">
          Type of travel    🍾: {trip?.userSelection?.travelType?.value}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
