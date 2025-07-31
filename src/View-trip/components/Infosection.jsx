// import React from 'react'

// function infosection({ trip }) {
//     return (
//         <div>
//             <img src="/src/assets/placeholder.jpg" className='h-[340px] w-full object-cover rounded-xl'></img>
//             <div className='my-5 flex flex-col gap-2'>
//                 <h2 className='font-bold text-2xl'>
//                     {
//                         trip?.userSelection?.location?.label
//                     }
//                 </h2>

//             </div>
//             <div className='flex gap-5'>
//                 <h2 className="p-1 px-3 bg-gray-200 border border-gray-400 rounded-full text-gray-500 text-sm">
//                 Number of days: {trip.userSelection?.days?.value}
//             </h2>
//             <h2 className="p-1 px-3 bg-gray-200 border border-gray-400 rounded-full text-gray-500 text-sm">
//                 Type of budget: {trip.userSelection?.budget?.value}
//             </h2>
//             <h2 className="p-1 px-3 bg-gray-200 border border-gray-400 rounded-full text-gray-500 text-sm">
//                 Type of trvel : {trip.userSelection?.travelType?.value}
//             </h2>
//             <h2 className="p-1 px-3 bg-gray-200 border border-gray-400 rounded-full text-gray-500 text-sm">
//                 Number of days: {trip.userSelection?.days?.value}
//             </h2>
//             </div>
//         </div>
//     )


// }

// export default infosection
import React from 'react';

function InfoSection({ trip }) {
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
