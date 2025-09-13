export const SelectTravelList=[{
    id:1,
    title:'Just me',
    desc:'A solo trveler looking for a personalized trip plan',
    icon:'🚶🏽',
    people:'1'
},
{
    id:2,
    title:'couple',
    desc:'A couple looking for a romantic getaway',
    people :2,
    icon:'👫'

},{
    id:3,
    title:'Family',
    desc:'A memorable trip for your family',
    people:4,
    icon:'👨‍👩‍👧‍👧'
} ,
{
    id:4,
    title:'Friends',
    desc:'An unforgettable trip with friends',
    people:4,
    icon:'🤝'
} ,
{
    id:5,
    title:'Business',
    desc:'A business trip for work',
    people:1,
    icon:'👨'
},

{
    id:6,
    title: 'Parents',
    desc:'A peaceful journey for parents to holy places',
    icon: '🧓🏼👵 ',
    people: 2,
}

]
export const selectBudgetOptions=[
    {
        id:1,
        title:' Smart spending ',
        desc:'stay conscious of cost',
        icon:'🪙'
        

    },
    {
        id:2,
        title:"moderate",
        desc:'keep cost on the average side',
        icon:"💰"
    
    },
    {
        id:3,
        title:'luxury',
        desc:'Dont worry about cost',
        icon:'💸'

    },
   
]
export const AI_PROMPT =
  "Genrate Travel Plan For Location:{locaion} for {people} people with {budget} budget, give me hotels prices with list of hotel address, prices, restaurants, hotel images url, geo coordinates, rating, description, activities, and other things to do. Suggest itinerary with placesName, place details, ticket pricing, travel time between locations for {days} days. Plan each day with best times to visit. Return all data in clean JSON format to be used in a travel app. This is a trip for {travelType}.";
