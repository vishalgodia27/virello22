// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '@/services/firebaseconfig';
// import { doc, getDoc } from 'firebase/firestore';
// import Infosection from '../components/infosection';
// import { Hotel } from 'lucide-react';
// import Hotels from '../components/Hotels';
// function Viewtrip() {
//   const { tripId } = useParams();
//   // const [trip,setTrip]=useState([]);
// const [trip, setTrip] = useState({});

//   useEffect(() => {
//     const GetTripData = async () => {
//       const docRef = doc(db, 'Aitrips', tripId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         console.log("Trip ID:", tripId);
//         console.log("Document:", docSnap.data());
//         setTrip(docSnap.data())
//       } else {
//         console.log("No such document found");
//       }
//     };
    
//     if (tripId) {
//       GetTripData();
//     }
//   }, [tripId]);

//   return (
//     <div className='p-10 md:px-20 lg:px-44 xl:px-56' >
//       {/* informatation section */}
//       <Infosection trip={trip}/>
//       {/* recommended hotels */}
//       <Hotels trip={trip}/>
//       {/* dailyplans */}
//       {/* fotter */}


//     </div>
//   );
// }

// export default Viewtrip;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/services/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Infosection from '../components/infosection';
import Hotels from '../components/Hotels';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});

  useEffect(() => {
    const GetTripData = async () => {
      const docRef = doc(db, 'Aitrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        try {
          const parsedData = JSON.parse(data.tripData); // Parse the JSON string
          setTrip(parsedData); // Parsed trip info
        } catch (err) {
          console.error("Failed to parse tripData:", err);
        }
      } else {
        console.log("No such document found");
      }
    };

    if (tripId) GetTripData();
  }, [tripId]);

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      <Infosection trip={trip} />
      <Hotels trip={trip} />
    </div>
  );
}

export default Viewtrip;
