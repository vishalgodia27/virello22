import React, { useState, useEffect } from "react";
import { selectBudgetOptions, SelectTravelList } from "../options/options.jsx";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseconfig"; 
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
const GOMAPS_API_KEY = "AlzaSyDxAcoOm13Tf-2dSSc5MvpelbZ2Rp3GsfO";

function Createtrip() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState("");
  const [formData, setFormData] = useState({});


  const handleinputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    const summary = {};
    Object.entries(formData).forEach(([key, val]) => {
      summary[key] = val?.label && val?.value ? { label: val.label, value: val.value } : val;
    });
    console.log(summary);

    console.log("Trip Form Data:", summary);
  }, [formData]);



  const fetchSuggestions = async (value) => {
    setInput(value);
    setPlace(null);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      value
    )}&types=(cities)&language=en&key=${GOMAPS_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleSelect = (item) => {
    setInput(item.description);
    setSuggestions([]);
    setPlace(item);
    handleinputChange("location", {
      label: item.description,
      value: item.place_id,
    });

    toast({
      title: "Destination Selected",
      description: `You selected ${item.description}`,
      type: "success",
      duration: 2000,
    });
  };
  const Genratetrip = async () => {
    const user = localStorage.getItem('user');
    if (!formData.location || !formData.days || !formData.budget || !formData.travelType) {
      toast({
        title: "Missing Information",
        description: "Please complete all fields before generating the trip.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Trip Generated!",
      description: `Your ${formData.days.value}-day trip to ${formData.location.label} is being prepared`,
      type: "success",
      duration: 5000,
    });

    const selectedTravelType = SelectTravelList.find(
      (t) => t.title === formData.travelType.label
    );
    const people = selectedTravelType?.people || 1;

    // ✅ Structured prompt
    const prompt = `
    Generate a travel plan for the location: ${formData.location.label} for ${people} people with a ${formData.budget.label} budget. 
      Include a list of  hotels with prices, addresses, restaurants, hotel image URLs, geo coordinates, ratings, and descriptions,with working hotel images url . 
    Also suggest an itinerary with place names, place details, ticket pricing, and travel time between locations for ${formData.days.value} days. 
    Plan each day with the best times to visit. 
    Return all data in clean JSON format suitable for use in a travel app. 
    This is a trip for a ${formData.travelType.label}.
    `;
    console.log(prompt);


    try {
      const API_KEY = "AIzaSyDmr_mITQ2lLAgEhVf_vFdtUFC_io8gdjk";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          })
        }
      );
      const result = await response.json();
      const tripData = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (tripData) {
        console.log(" Gemini Trip Plan:\n", tripData);
        // Optional: JSON.parse(tripData) if it's valid JSON
        SaveAiTrip(tripData)
      } else {
        console.error(" Gemini did not return valid content:\n", result);
      }
    } catch (error) {
      console.error("Error calling Gemini AI:", error);
      toast({
        title: "AI Error",
        description: "Failed to generate trip plan. Please try again.",
        type: "error",
        duration: 4000,
      });
    }

  };



//   const SaveAiTrip = async (tripDataJson, formData) => {
//   try {
//     const docId = Date.now().toString();
//     await setDoc(doc(db, "Aitrips", docId), {
//       userSelection: formData,
//       tripData: tripDataJson,
//       createdAt: new Date().toISOString(),
//     });
//     console.log("✅ Trip saved successfully!");
//   } catch (error) {
//     console.error("❌ Error saving trip to Firestore:", error);
//   }
// };


const SaveAiTrip = async (tripDataJson, formData) => {
  try {
    const docId = Date.now().toString();

    // ✅ Safe default if formData is null/undefined
    const cleanFormData = Object.fromEntries(
      Object.entries(formData || {}).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    await setDoc(doc(db, "Aitrips", docId), {
      userSelection: cleanFormData,
      tripData: tripDataJson,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Trip saved successfully!");
  } catch (error) {
    console.error("❌ Error saving trip to Firestore:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-32 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <h2 className="font-bold text-3xl text-center">Tell us your travel preference</h2>
        <p className="mt-3 text-gray-500 text-xl text-center">
          Just provide some basic information and our trip planner will generate a personalized itinerary based on your preference
        </p>

        {/* Destination Input */}
        <div className="mt-20 w-full">
          <h2 className="text-xl my-3 font-medium">What is your destination?</h2>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => fetchSuggestions(e.target.value)}
              placeholder="Enter city name"
              className={`border-2 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${formData.location ? 'border-blue-500 bg-blue-50' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
          </div>
          {loading && (
            <div className="mt-2 text-blue-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading destinations...
            </div>
          )}
          {suggestions.length > 0 && (
            <ul className="bg-white border-2 border-gray-200 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((item) => (
                <li
                  key={item.place_id}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(item)}
                >
                  {item.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Days Input */}
        <div className="w-full mt-10">
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <input
            type="number"
            placeholder="Enter number of days"
            value={days}
            min={1}
            onChange={(e) => {
              const val = e.target.value;
              if (Number(val) > 20) {
                toast({
                  title: "Invalid Input",
                  description: "Number of days must be less than or equal to 20",
                  type: "error",
                  duration: 3000
                });
                return;
              }
              setDays(val);
              handleinputChange("days", { label: "Number of days", value: val });
            }}
            className={`border-2 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${formData.days ? 'border-blue-500 bg-blue-50' : 'border-gray-300 focus:border-blue-500'
              }`}
          />
        </div>

        {/* Budget Options */}
        <h2 className="text-xl my-5 font-medium w-full">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-6 w-full">
          {selectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`p-6 border-2 rounded-2xl flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-blue-500 hover:scale-105 ${formData.budget?.value === (item.value ?? item.title)
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200"
                : "border-gray-200 bg-white"
                }`}
              onClick={() => handleinputChange("budget", { label: item.title, value: item.value ?? item.title })}
            >
              <h2 className="text-4xl mb-3">{item.icon}</h2>
              <h2 className="font-bold text-lg mb-2 text-center">{item.title}</h2>
              <h2 className="text-sm text-gray-500 text-center">{item.desc}</h2>
            </div>
          ))}
        </div>

        {/* Travel Type Options */}
        <h2 className="text-xl my-5 font-medium w-full">Who will accompany you on your next journey?</h2>
        <div className="grid grid-cols-3 gap-6 w-full">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              className={`p-6 border-2 rounded-2xl flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-blue-500 hover:scale-105 ${formData.travelType?.value === (item.value ?? item.title)
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200"
                : "border-gray-200 bg-white"
                }`}
              onClick={() => handleinputChange("travelType", { label: item.title, value: item.value ?? item.title })}
            >
              <h2 className="text-4xl mb-3">{item.icon}</h2>
              <h2 className="font-bold text-lg mb-2 text-center">{item.title}</h2>
              <h2 className="text-sm text-gray-500 text-center">{item.desc}</h2>
            </div>
          ))}
        </div>

        {/* Generate Trip Button */}
        <div className="mt-10 flex justify-center w-full">
          <Button
            className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={Genratetrip}
          >
            Generate Trip
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Createtrip;
