import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/services/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Infosection from '../components/Infosection';
import { Hotel } from 'lucide-react';
import Hotels from '../components/Hotels';
import PlacesTovisit from '../components/PlacesToVisit';
function Viewtrip() {
  const { tripId } = useParams();
  // const [trip,setTrip]=useState([]);
const [trip, setTrip] = useState({});

  useEffect(() => {
    const GetTripData = async () => {
      const docRef = doc(db, 'Aitrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Trip ID:", tripId);
        console.log("Document:", docSnap.data());
        
        // Debug the tripData structure
        const tripData = docSnap.data().tripData;
        console.log("Raw tripData:", tripData);
        
        if (tripData) {
          try {
            // Try to parse the JSON to see the structure
            let cleanedData = tripData;
            if (cleanedData.includes('```json')) {
              cleanedData = cleanedData.replace(/```json\s*/, '').replace(/\s*```/, '');
            } else if (cleanedData.includes('```')) {
              cleanedData = cleanedData.replace(/```\s*/, '').replace(/\s*```/, '');
            }
            cleanedData = cleanedData.trim();
            
            const parsed = JSON.parse(cleanedData);
            console.log("Parsed tripData:", parsed);
            console.log("Available keys:", Object.keys(parsed));
            
            // Check for itinerary keys
            if (parsed.itinerary) {
              console.log("Found itinerary:", parsed.itinerary);
            }
            if (parsed.iternary) {
              console.log("Found iternary:", parsed.iternary);
            }
            if (parsed.dailyPlan) {
              console.log("Found dailyPlan:", parsed.dailyPlan);
            }
            if (parsed.schedule) {
              console.log("Found schedule:", parsed.schedule);
            }
          } catch (error) {
            console.error("Error parsing tripData:", error);
          }
        }
        
        setTrip(docSnap.data())
      } else {
        console.log("No such document found");
      }
    };
    
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56' >
      {/* informatation section */}
      <Infosection trip={trip}/>
      {/* recommended hotels */}
      <Hotels trip={trip}/>
      {/* dailyplans */}
      <PlacesTovisit trip={trip}/>
      {/* fotter */}


    </div>
  );
}

export default Viewtrip;