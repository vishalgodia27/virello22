
// import React from 'react';

// function Hotels({ trip }) {
//   return (
//     <div>
//       <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>
//       <div>
//         {trip?.trip?.Hotels.map((item, index) => (
//           <div >

//             <img src="/src/assets/placeholder.jpg" className='rounded-xl' />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hotels;
import React from 'react';

function Hotels({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {trip?.hotels?.map((item, index) => (
          <div key={index} className="border rounded-xl p-4 shadow-md">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="rounded-xl w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/placeholder.jpg'; // Fallback image
              }}
            />
            <h3 className="font-semibold text-lg mt-3">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.address}</p>
            <p className="text-sm mt-2">{item.description}</p>
            <p className="text-sm mt-2">⭐ {item.rating} | ₹{item.pricePerNight}/night</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
