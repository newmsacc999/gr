import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface PaymentData {
  bookingData: {
    match: {
      team1: string;
      team2: string;
    };
    ticketType: string;
    quantity: number;
  };
  totalAmount: number;
}

// Add these logo URLs at the top of your component
const paymentLogos = {
  phonePe: "https://eu-images.contentstack.com/v3/assets/blt7dacf616844cf077/blt85b08b4917701bc0/67997d68d8a86f00203713cc/phonepe-logo-icon.jpg?width=1280&auto=webp&quality=95&format=jpg&disable=upscale",
  paytm: "https://yt3.googleusercontent.com/nfovxGynnTWHMBFQfUjZzbFrViXNa9MYLZXuRFXhWGAfwWwIBsqV_4B5A_LGu0sZlMenuimmsQ=s900-c-k-c0x00ffffff-no-rj",
  googlePay: "https://miro.medium.com/v2/resize:fit:1400/1*NNI7aPLtSaLo6jb4KGEFDA.jpeg"
};

// Add UPI IDs configuration
const upiConfig = {
  phonePe: "mswipe.1400111324038715@kotak",
  paytm: "mswipe.1400111324038715@kotak",
  googlePay: "mswipe.1400111324038715@kotak"
};

// Add app-specific URL schemes
// Update app schemes with proper UPI parameters
const appSchemes = {
  phonePe: "phonepe://pay",
  paytm: "paytmmp://pay",
  googlePay: "gpay://upi/pay",
};

function PaymentOptions() {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string>('upi');
  
  // Get payment data from location state or use default values
  const paymentData: PaymentData = location.state?.paymentData || {
    bookingData: {
      match: {
        team1: "Gujarat Titans",
        team2: "Rajasthan Royals"
      },
      ticketType: "Premium Stand",
      quantity: 1
    },
    totalAmount: 311
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  // Add handler for UPI app clicks (move outside JSX)
  const handleUpiClick = (app: 'phonePe' | 'paytm' | 'googlePay') => {
    if (app === 'googlePay') {
      alert('Google Pay servers are currently down. Please try another payment method.');
      return;
    }
    
    const amount = paymentData.totalAmount;
    const upiId = upiConfig[app];
    const description = `Tickets for ${paymentData.bookingData.match.team1} vs ${paymentData.bookingData.match.team2}`;
    
    // Create app-specific deep links with proper parameters
    let appLink = '';
    
    if (app === 'phonePe') {
      // PhonePe specific format
      appLink = `phonepe://pay?pa=${upiId}&pn=BookMyShow&am=${amount}&tn=${encodeURIComponent(description)}&cu=INR`;
    } else if (app === 'paytm') {
      // Paytm specific format
      appLink = `paytmmp://pay?pa=${upiId}&pn=BookMyShow&am=${amount}&tn=${encodeURIComponent(description)}&cu=INR`;
    }
    
    window.location.href = appLink;
  };

  const handleOtherUpiClick = () => {
    const amount = paymentData.totalAmount;
    const upiId = upiConfig.phonePe; // Using default UPI ID for other apps
    const description = `Tickets for ${paymentData.bookingData.match.team1} vs ${paymentData.bookingData.match.team2}`;
    
    // Create UPI payment link for other UPI apps
    const upiLink = `upi://pay?pa=${upiId}&pn=BookMyShow&tn=${encodeURIComponent(description)}&am=${amount}&cu=INR`;
    window.location.href = upiLink;
  };

  // Update the Other UPI APP button in JSX
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3 flex items-center border-b">
          <Link to="/booking-confirmation" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </Link>
          <div className="flex-1">
            <img 
              src="https://getlogo.net/wp-content/uploads/2020/04/bookmyshow-logo-vector.png"
              alt="BookMyShow"
              className="h-6"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-6 px-4">
        <h1 className="text-lg font-bold my-4">Payment Options</h1>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600">All Payment Options</div>
        </div>
        
        {/* UPI/QR Section */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('upi')}
          >
            <h2 className="font-medium">UPI/QR</h2>
            <svg 
              className={`w-5 h-5 transition-transform ${expandedSection === 'upi' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {expandedSection === 'upi' && (
            <div className="p-4 pt-0 border-t">
              <div className="bg-blue-50 text-blue-600 text-sm p-2 rounded mb-4">
                Upto ₹200 cashback
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className="border rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-blue-500"
                  onClick={() => handleUpiClick('phonePe')}
                >
                  <img 
                    src={paymentLogos.phonePe}
                    alt="PhonePe"
                    className="w-8 h-8 mb-1 object-contain"
                  />
                  <span className="text-xs">PhonePe</span>
                </div>
                <div 
                  className="border rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-blue-500"
                  onClick={() => handleUpiClick('paytm')}
                >
                  <img 
                    src={paymentLogos.paytm}
                    alt="Paytm"
                    className="w-8 h-8 mb-1 object-contain"
                  />
                  <span className="text-xs">Paytm</span>
                </div>
                <div 
                  className="border rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-blue-500"
                  onClick={() => handleUpiClick('googlePay')}
                >
                  <img 
                    src={paymentLogos.googlePay}
                    alt="Google Pay"
                    className="w-8 h-8 mb-1 object-contain"
                  />
                  <span className="text-xs">Google Pay</span>
                </div>
              </div>
              
              <div className="mt-3">
                <button 
                  className="border rounded-md p-3 w-full flex items-center"
                  onClick={handleOtherUpiClick}
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white mr-2">
                    <span className="text-xs">U</span>
                  </div>
                  <span className="text-sm">Other UPI APP</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Cards Section */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('cards')}
          >
            <h2 className="font-medium">Cards</h2>
            <svg 
              className={`w-5 h-5 transition-transform ${expandedSection === 'cards' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {expandedSection === 'cards' && (
            <div className="p-4 pt-0 border-t">
              <div className="flex items-center text-yellow-600">
                <input type="checkbox" disabled className="mr-2" />
                <span className="text-sm font-medium">CARD PAYMENT NOT READY NOW!!</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Wallet Section */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('wallet')}
          >
            <h2 className="font-medium">Wallet</h2>
            <svg 
              className={`w-5 h-5 transition-transform ${expandedSection === 'wallet' ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {expandedSection === 'wallet' && (
            <div className="p-4 pt-0 border-t">
              <div className="flex items-center text-gray-600">
                <input type="checkbox" disabled className="mr-2" />
                <span className="text-sm">Wallet payment not available</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Important Information */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
          <h2 className="text-red-500 font-medium mb-3">Important Information About Your Tickets</h2>
          
          <ul className="text-sm space-y-3">
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>Your e-ticket will be sent to your registered email immediately after successful payment.</span>
            </li>
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>For IPL matches, you can use the e-ticket on your phone for direct stadium entry - no need to print!</span>
            </li>
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>Alternatively, you can print the ticket or show a screenshot at the venue.</span>
            </li>
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>Tickets are <strong>non-refundable</strong> once purchased.</span>
            </li>
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>Please arrive at least 60 minutes before the match starts to avoid last-minute rush.</span>
            </li>
            <li className="flex">
              <span className="text-red-500 mr-2">•</span>
              <span>Carry a <strong>valid photo ID</strong> matching the ticket details for verification.</span>
            </li>
          </ul>
          
          <p className="text-xs text-blue-600 mt-3">
            For any issues, contact our 24/7 support at help@bookmyshow.com
          </p>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            Account & Terms
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentOptions;
