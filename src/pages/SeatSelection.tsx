import React, { useState } from 'react';
import { Calendar, MapPin, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

interface MatchData {
  id: string;
  date: string;
  time: string;
  team1: {
    name: string;
    logo: string;
  };
  team2: {
    name: string;
    logo: string;
  };
  venue: string;
}

function SeatSelection() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'map' | 'tickets'>('map');
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [selectionSource, setSelectionSource] = useState<'grid' | 'buttons' | null>(null);
  const [quantity, setQuantity] = useState(1); // Starting with a default of 1

  const stadiumMaps = {
    "Narendra Modi Stadium, Ahmedabad": "https://www.xchangetickets.com/seatingplans/venue_1030.jpg",
    "Wankhede Stadium, Mumbai": "https://t20slam.com/wp-content/uploads/2020/03/Wankhede-stadium-map-with-seat-numbers.jpg",
    "M. Chinnaswamy Stadium, Bangalore": "https://cdn.shopify.com/s/files/1/0278/4565/6649/files/WhatsApp_Image_2023-10-02_at_18.06.17.webp",
    "Eden Gardens, Kolkata": "https://ipltickets.in/wp-content/uploads/2024/02/kolkata-eden-gardens-stadium-stands-pavilions-seat-chart.jpg",
    "MA Chidambaram Stadium, Chennai": "https://ultimatecricketguru.com/wp-content/uploads/2023/09/m-chinnaswamy-stadium-bangalore-seating-plan.webp",
    "Arun Jaitley Stadium, Delhi": "https://www.xchangetickets.co.uk/seatingplans/venue_1154.jpg",
    "Rajiv Gandhi International Cricket Stadium, Hyderabad": "https://assets.isu.pub/document-structure/230315054443-5af6010b1e320f4688b2f873e7154667/v1/4e43fccb3dabbcc2559d4ca250350baf.jpeg",
    "Sawai Mansingh Stadium, Jaipur": "https://indiaongo.in/wp-content/uploads/2018/04/sms-stadium-jaipur-seating-layout-arrangements.png",
    "BRSABV Ekana Cricket Stadium, Lucknow": "https://indiaongo.in/wp-content/uploads/2022/09/ekana-stadium-seating-map-lucknow.jpg",
    "Mullanpur Stadium, New Chandigarh, Punjab": "https://indiaongo.in/wp-content/uploads/2024/03/new-pca-stadium-mullanpur-mohali.jpeg"
  };

  const matchData: MatchData = location.state?.match || {
    id: "match1",
    date: "9 April 2025",
    time: "7:30 PM IST",
    team1: {
      name: "Gujarat Titans",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
    },
    team2: {
      name: "Rajasthan Royals",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg",
    },
    venue: "Narendra Modi Stadium, Ahmedabad, Gujarat",
  };

  // Upper grid ticket types
  const ticketTypes = [
    { id: 'general', name: 'General Stand', price: 999, available: 85 },
    { id: 'premium', name: 'Premium Stand', price: 999, available: 100 },
    { id: 'pavilion', name: 'Pavilion Stand', price: 999, available: 50 },
    { id: 'vip', name: 'VIP Stand', price: 999, available: 100 },
    { id: 'corporate', name: 'Corporate Box', price: 999, available: 45 },
    // Blocked Hospitality Box and Skybox/Lounge
    // { id: 'hospitality', name: 'Hospitality Box', price: 1500, available: 25 },
    // { id: 'skybox', name: 'Skybox/Lounge', price: 1700, available: 30 },
   
  ];

  const bottomTicketTypes = [
    { id: 'general', name: 'General Stand', price: 100, description: 'Affordable seating, usually in the upper stands.' },
    { id: 'premium', name: 'Premium Stand', price: 200, description: 'Better view with comfortable seating.' },
    { id: 'pavilion', name: 'Pavilion Stand', price: 250, description: 'Premium seating with excellent view of the pitch.' },
    { id: 'vip', name: 'VIP Stand', price: 400, description: 'Exclusive seating with premium amenities.' },
    { id: 'corporate', name: 'Corporate Box', price: 500, description: 'Private box for corporate groups with catering.' },
    // Blocked Hospitality Box and Skybox/Lounge
    // { id: 'hospitality', name: 'Hospitality Box', price: 750, description: 'Luxury experience with food and beverages included.' },
    // { id: 'skybox', name: 'Skybox/Lounge', price: 999, description: 'Ultimate luxury experience with panoramic views.' },
  ];

  const incrementQuantity = () => {
    if (quantity < 3) {
      setQuantity(quantity + 1); // Increment if less than 3
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Decrement if greater than 1
    }
  };

  const handleTicketTypeSelect = (id: string) => {
    if (selectionSource === 'buttons' && id !== selectedTicketType) {
      setSelectionSource('grid');
      setSelectedTicketType(id);
    } else if (selectionSource !== 'buttons') {
      setSelectionSource('grid');
      setSelectedTicketType(id);
    }
  };

  const handleBottomTicketSelect = (id: string) => {
    if (selectionSource === 'grid' && id !== selectedTicketType) {
      setSelectionSource('buttons');
      setSelectedTicketType(id);
    } else if (selectionSource !== 'grid') {
      setSelectionSource('buttons');
      setSelectedTicketType(id === selectedTicketType ? null : id);
    }
  };

  const selectedTicket = selectionSource === 'grid'
    ? ticketTypes.find(ticket => ticket.id === selectedTicketType)
    : bottomTicketTypes.find(ticket => ticket.id === selectedTicketType);

  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  const selectedBottomTicket = bottomTicketTypes.find(ticket => ticket.id === selectedTicketType);

  const handleProceedToBooking = () => {
    if (selectedTicket) {
      const bookingData = {
        match: {
          team1: matchData.team1.name,
          team2: matchData.team2.name,
          date: matchData.date,
          time: matchData.time,
          venue: matchData.venue
        },
        ticketType: selectedTicket.name,
        price: selectedTicket.price,
        quantity: quantity
      };
      
      navigate('/booking-confirmation', { state: { bookingData } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </Link>
          <h1 className="text-lg font-semibold">Select Your Seats</h1>
        </div>
      </header>

      <main className="pt-14 pb-24">
        <div className="bg-white p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-1">
                <img 
                  src={matchData.team1.logo}
                  alt={matchData.team1.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-center">{matchData.team1.name}</span>
            </div>

            <div className="text-sm font-bold">VS</div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-1">
                <img 
                  src={matchData.team2.logo}
                  alt={matchData.team2.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-center">{matchData.team2.name}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500 flex justify-center items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-1" />
              {matchData.date}, {matchData.time}
            </div>
            <div className="text-sm text-gray-500 flex justify-center items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-1" />
              {matchData.venue}
            </div>
          </div>
        </div>

        {/* Display the Stadium Map */}
        <div className="mb-6">
          <div className="text-base font-semibold mb-4">Stadium Map</div>
          <div className="relative">
            <img
              src={stadiumMaps[matchData.venue] || ''}
              alt="Stadium Map"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-base font-semibold mb-4">Select Your Ticket Type</div>

          <div className="grid grid-cols-2 gap-4">
            {ticketTypes.filter(ticket => ticket.id !== 'hospitality' && ticket.id !== 'skybox').map(ticket => (
              <button
                key={ticket.id}
                className={`py-2 px-4 text-sm rounded border ${selectedTicketType === ticket.id && selectionSource === 'buttons' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                onClick={() => handleBottomTicketSelect(ticket.id)}
              >
                {ticket.name}
              </button>
            ))}
          </div>
        </div>

        {selectedTicketType && (
          <div className="bg-white p-4 mb-4">
            <h2 className="text-base font-semibold mb-4">Booking Summary</h2>
            <div className="mb-4">
              <p className="text-sm mb-2">Ticket Type:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {/* {bottomTicketTypes.map(ticket => (
                  <button 
                    key={ticket.id}
                    className={`py-2 text-center text-sm rounded border ${selectedTicketType === ticket.id && selectionSource === 'buttons' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                    onClick={() => handleBottomTicketSelect(ticket.id)}
                  >
                    {ticket.name}
                  </button>
                ))} */}
              </div>
            </div>
            
            {selectedTicketType && (
              <>
                {selectedBottomTicket && selectionSource === 'buttons' && (
                  <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
                    <p>{selectedBottomTicket.name} – {selectedBottomTicket.description}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm mb-2">Price per Ticket:</p>
                  <p className="font-bold text-lg">₹{selectedTicket?.price}</p>
                </div>

                <div className="flex items-center mb-6">
                  <button 
                    onClick={decrementQuantity} 
                    className="px-3 py-1 text-sm rounded border"
                    disabled={quantity === 1}
                  >
                    <Minus />
                  </button>
                  <span className="mx-2 text-lg">{quantity}</span>
                  <button 
                    onClick={incrementQuantity} 
                    className="px-3 py-1 text-sm rounded border"
                    disabled={quantity === 3}
                  >
                    <Plus />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <p className="font-bold">Total:</p>
                  <p className="font-bold text-[#eb4e62] text-lg">₹{totalPrice}</p>
                </div>

                <button 
                  className={`w-full py-3 rounded text-white font-medium ${selectedTicketType ? 'bg-[#eb4e62]' : 'bg-gray-400'}`}
                  disabled={!selectedTicketType}
                  onClick={handleProceedToBooking}
                >
                  Proceed to Booking
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default SeatSelection;
