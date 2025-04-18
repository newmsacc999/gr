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
  const [quantity, setQuantity] = useState(1);
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
  
  // This would come from your match data
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

  // First, let's define a single source of truth for ticket types
  // Upper grid ticket types
  const ticketTypes = [
    { id: 'general', name: 'General Stand', price: 999, available: 85 },
    { id: 'premium', name: 'Premium Stand', price: 999, available: 100 },
    { id: 'pavilion', name: 'Pavilion Stand', price: 999, available: 50 },
    { id: 'vip', name: 'VIP Stand', price: 999, available: 100 },
    { id: 'corporate', name: 'Corporate Box', price: 999, available: 45 },
    { id: 'hospitality', name: 'Hospitality Box', price: 1500, available: 25 },
    { id: 'skybox', name: 'Skybox/Lounge', price: 1700, available: 30 },
    { id: 'premium-plus', name: 'Premium Plus', price: 1500, available: 60 },
    { id: 'executive', name: 'Executive Lounge', price: 999, available: 40 },
    { id: 'executiveplus', name: 'Executive Plus', price: 1500, available: 40 },
  ];
  
  // Bottom ticket types with different prices
  const bottomTicketTypes = [
    { id: 'general', name: 'General Stand', price: 100, description: 'Affordable seating, usually in the upper stands.' },
    { id: 'premium', name: 'Premium Stand', price: 200, description: 'Better view with comfortable seating.' },
    { id: 'pavilion', name: 'Pavilion Stand', price: 250, description: 'Premium seating with excellent view of the pitch.' },
    { id: 'vip', name: 'VIP Stand', price: 400, description: 'Exclusive seating with premium amenities.' },
    { id: 'corporate', name: 'Corporate Box', price: 500, description: 'Private box for corporate groups with catering.' },
    { id: 'hospitality', name: 'Hospitality Box', price: 750, description: 'Luxury experience with food and beverages included.' },
    { id: 'skybox', name: 'Skybox/Lounge', price: 999, description: 'Ultimate luxury experience with panoramic views.' },
  ];

  const handleTicketTypeSelect = (id: string) => {
    if (selectionSource === 'buttons' && id !== selectedTicketType) {
      // If previously selected from buttons and now selecting a different type from grid
      setSelectionSource('grid');
      setSelectedTicketType(id);
    } else if (selectionSource !== 'buttons') {
      // If not previously selected from buttons or selecting same type
      setSelectionSource('grid');
      setSelectedTicketType(id);
    }
  };

  const handleBottomTicketSelect = (id: string) => {
    if (selectionSource === 'grid' && id !== selectedTicketType) {
      // If previously selected from grid and now selecting a different type from buttons
      setSelectionSource('buttons');
      setSelectedTicketType(id);
    } else if (selectionSource !== 'grid') {
      // If not previously selected from grid or selecting same type
      setSelectionSource('buttons');
      setSelectedTicketType(id === selectedTicketType ? null : id);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Find the selected ticket based on ID and selection source
  const selectedTicket = selectionSource === 'grid' 
    ? ticketTypes.find(ticket => ticket.id === selectedTicketType)
    : bottomTicketTypes.find(ticket => ticket.id === selectedTicketType);
    
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  
  // Find the description for the selected bottom ticket
  const selectedBottomTicket = bottomTicketTypes.find(ticket => ticket.id === selectedTicketType);

  // Move the handleProceedToBooking function here, outside of the JSX
  const handleProceedToBooking = () => {
    if (selectedTicket) {
      // Prepare booking data to pass to the confirmation page
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
      
      // Navigate to booking confirmation page with the booking data
      navigate('/booking-confirmation', { state: { bookingData } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </Link>
          <h1 className="text-lg font-semibold">Select Your Seats</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-24">
        {/* Match Info Card */}
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

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="text-[#eb4e62] w-4 h-4" />
            <span>{matchData.date}, {matchData.time}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="text-[#eb4e62] w-4 h-4" />
            <span>{matchData.venue}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white mb-4">
          <div className="flex border-b">
            <button 
              className={`flex-1 py-3 text-center ${activeTab === 'map' ? 'border-b-2 border-[#eb4e62] text-[#eb4e62] font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('map')}
            >
              Stadium Map
            </button>
            <button 
              className={`flex-1 py-3 text-center ${activeTab === 'tickets' ? 'border-b-2 border-[#eb4e62] text-[#eb4e62] font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('tickets')}
            >
              Ticket Types
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'map' ? (
          <div className="bg-white p-4 mb-4">
            <h2 className="text-base font-semibold mb-1">Select a section from the stadium map</h2>
            <p className="text-xs text-gray-600 mb-4">Click on a section to select your preferred seating area</p>
            
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium mb-2">{matchData.team1.name} vs {matchData.team2.name}</h3>
              <p className="text-xs text-gray-600">Venue: {matchData.venue}</p>
            </div>
            

            {/* Stadium Map */}
            <div className="relative w-full aspect-square mb-6">
              <img 
                src={stadiumMaps[matchData.venue as keyof typeof stadiumMaps] || "/src/img/stadium-map.png"}
                alt={`${matchData.venue} Map`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/src/img/stadium-map.png"; // Fallback to default stadium map
                }}
              />
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00BCD4]"></div>
                <span className="text-xs">JIO Pavilion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#9C27B0]"></div>
                <span className="text-xs">Premium Blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF9800]"></div>
                <span className="text-xs">Club House</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 mb-4">
            <h2 className="text-base font-semibold mb-1">Select a ticket type</h2>
            <p className="text-xs text-gray-600 mb-4">Choose from our available ticket categories</p>
            
            {/* Ticket Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ticketTypes.slice(0, 9).map(ticket => (
                <div 
                  key={ticket.id}
                  className={`border rounded p-2 ${selectedTicketType === ticket.id && selectionSource === 'grid' ? 'border-[#eb4e62] bg-red-50' : 'border-gray-200'}`}
                  onClick={() => handleTicketTypeSelect(ticket.id)}
                >
                  <div className="text-[#eb4e62] font-medium text-sm mb-1">Price: ₹{ticket.price}</div>
                  <div className="text-xs text-gray-600 mb-1">{ticket.available} seats available</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-base font-semibold mb-4">Booking Summary</h2>
          
          <div className="mb-4">
            <p className="text-sm mb-2">Ticket Type:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {bottomTicketTypes.map(ticket => (
                <button 
                  key={ticket.id}
                  className={`py-2 text-center text-sm rounded border ${selectedTicketType === ticket.id && selectionSource === 'buttons' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                  onClick={() => handleBottomTicketSelect(ticket.id)}
                >
                  {ticket.name}
                </button>
              ))}
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
              
              <div className="mb-6">
                <p className="text-sm mb-2">Quantity:</p>
                <div className="flex items-center">
                  <button 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                    onClick={decrementQuantity}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                    onClick={incrementQuantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <p className="font-bold">Total:</p>
                <p className="font-bold text-[#eb4e62] text-lg">₹{totalPrice}</p>
              </div>
              
              {/* Add the button with the onClick handler */}
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
      </main>
    </div>
  );
}

export default SeatSelection;
