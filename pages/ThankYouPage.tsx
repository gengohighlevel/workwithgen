import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Mail, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SlotData {
  date: string;
  slots: string[];
}

interface CalendarSlots {
  [date: string]: string[];
}

const CALENDAR_ID = "6fQ7GJMol3Wcl8o7DSHX";
const GHL_API_KEY = process.env.GHL_API_KEY || ""; 

const ThankYouPage: React.FC = () => {
  const { state } = useLocation();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { theme } = useTheme();

  // Booking details from previous step or manual entry
  const [userDetails, setUserDetails] = useState({
    fullName: state?.fullName || '',
    email: state?.email || '',
    phone: state?.phone || '',
  });

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<CalendarSlots>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Initialize: Fetch slots for current month
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchSlots(currentDate);
  }, [currentDate]);

  const fetchSlots = async (date: Date) => {
    setLoading(true);
    setError(null);
    
    // Calculate start and end of month in ms
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Add a buffer to ensure we cover timezone shifts
    const startDate = startOfMonth.getTime(); 
    const endDate = endOfMonth.getTime();

    try {
      const url = `https://rest.gohighlevel.com/v1/appointments/slots?calendarId=${CALENDAR_ID}&startDate=${startDate}&endDate=${endDate}&timezone=${userTimezone}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
         // Fallback for demo or if API key is missing/invalid in this context
         console.warn("API Call failed, possibly due to CORS or missing key. Showing mock data for demonstration if needed.");
         // In a real scenario, handle error properly. For this specific prompt, if it fails, I'll allow the UI to remain empty or show error.
         // However, to satisfy the user request "My code will get the availability...", I must assume the key works.
         throw new Error('Failed to fetch slots');
      }

      const data = await response.json();
      
      // Transform API response to map: { "YYYY-MM-DD": ["ISOString", ...] }
      const slotMap: CalendarSlots = {};
      
      // Handle response structure variations (sometimes top level dates, sometimes data.dates)
      const datesArray = data.dates || data.data || [];
      
      if (Array.isArray(datesArray)) {
        datesArray.forEach((d: any) => {
          if (d.date && d.slots) {
            slotMap[d.date] = d.slots;
          }
        });
      }

      setAvailableSlots(slotMap);
    } catch (err) {
      console.error("Error fetching slots:", err);
      // Optional: fallback logic or specialized error message
      setError("Unable to load availability. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !userDetails.email) return;
    
    setBookingLoading(true);
    
    try {
      const url = `https://rest.gohighlevel.com/v1/appointments/`;
      const body = {
        calendarId: CALENDAR_ID,
        selectedTimezone: userTimezone,
        selectedSlot: selectedSlot,
        email: userDetails.email,
        phone: userDetails.phone,
        firstName: userDetails.fullName.split(' ')[0] || 'Client',
        lastName: userDetails.fullName.split(' ').slice(1).join(' ') || '',
        title: `Discovery Call with ${userDetails.fullName}`,
        appointmentStatus: 'confirmed'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setBookingConfirmed(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Booking failed');
      }
    } catch (err) {
      console.error(err);
      alert("There was an error booking your appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  // Calendar Grid Generation
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Helper to check availability
  const hasSlots = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]; // simple YYYY-MM-DD
    // GHL API returns dates in the timezone requested. 
    // We need to match the date string format. 
    // To be safe, we check if the key exists in our map.
    // However, JS Date.toISOString() is UTC. We need local YYYY-MM-DD.
    
    // Construct local YYYY-MM-DD
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    const localDateStr = localDate.toISOString().split('T')[0];
    
    return availableSlots[localDateStr] && availableSlots[localDateStr].length > 0;
  };

  const getSlotsForDate = (date: Date) => {
     const offset = date.getTimezoneOffset();
     const localDate = new Date(date.getTime() - (offset * 60 * 1000));
     const localDateStr = localDate.toISOString().split('T')[0];
     return availableSlots[localDateStr] || [];
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --------------------------------------------------------------------------------
  // VIEW: CONFIRMED
  // --------------------------------------------------------------------------------
  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6 animate-reveal-up transition-colors duration-300">
        <div className="max-w-xl w-full text-center py-20">
          <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-purple-100 dark:border-purple-900/30 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#1d1d1f] dark:text-white">Inquiry Received</h1>
          
          <div className="space-y-4 mb-12">
            <p className="text-xl text-[#1d1d1f] dark:text-white font-semibold leading-relaxed">
              Your submission has been successfully logged in our CRM.
            </p>
            <p className="text-lg text-[#86868b] dark:text-gray-400 font-medium leading-relaxed">
              We are reviewing your requirements and will be in touch to discuss your GoHighLevel optimization.
            </p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 mb-12 text-left bg-white/50 dark:bg-zinc-900/50">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-[#1d1d1f] dark:text-white">Check Your Inbox</h3>
                <p className="text-[#86868b] dark:text-gray-400 text-sm leading-relaxed">
                  An automated confirmation receipt has been sent to your email.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-[#1d1d1f] dark:text-white">Discovery Call</h3>
                <p className="text-[#86868b] dark:text-gray-400 text-sm leading-relaxed">
                  You will receive a separate email containing a link to book your comprehensive discovery session.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              to="/" 
              className="bg-black dark:bg-white dark:text-black text-white px-12 py-4 rounded-full font-bold hover:scale-[1.05] transition-transform active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/10"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // VIEW: BOOKING CALENDAR
  // --------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black pt-24 pb-32 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-reveal-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1d1d1f] dark:text-white">
            Schedule Your <span className="text-[#937BF0]">Discovery Call</span>
          </h1>
          <p className="text-xl text-[#86868b] dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Choose a time that works for you. Our calendar is automatically synchronized for your convenience.
          </p>
        </div>

        {/* Missing Info Warning */}
        {!state?.email && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl flex items-center gap-3 border border-yellow-100 dark:border-yellow-900/30 animate-reveal-up">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Please enter your details below to finalize booking.
            </p>
          </div>
        )}

        {/* Input Fields (Only if missing from state) */}
        {(!state?.email) && (
           <div className="max-w-xl mx-auto mb-12 grid gap-4 animate-reveal-up">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#937BF0]"
                value={userDetails.fullName}
                onChange={e => setUserDetails({...userDetails, fullName: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#937BF0]"
                value={userDetails.email}
                onChange={e => setUserDetails({...userDetails, email: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#937BF0]"
                value={userDetails.phone}
                onChange={e => setUserDetails({...userDetails, phone: e.target.value})}
              />
           </div>
        )}

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-reveal-up animation-delay-200">
          
          {/* Calendar Widget */}
          <div className="lg:col-span-7 glass-card bg-white/70 dark:bg-zinc-900/70 p-8 rounded-[2.5rem] border-gray-100 dark:border-zinc-800 shadow-xl">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">
                 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
               </h3>
               <div className="flex gap-2">
                 <button 
                   onClick={() => changeMonth(-1)}
                   className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                   <ChevronLeft className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                 </button>
                 <button 
                   onClick={() => changeMonth(1)}
                   className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                   <ChevronRight className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                 </button>
               </div>
             </div>

             <div className="grid grid-cols-7 gap-4 mb-4">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="text-center text-xs font-bold text-[#86868b] dark:text-gray-500 uppercase tracking-wider">
                   {day}
                 </div>
               ))}
             </div>

             {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#937BF0] animate-spin" />
                </div>
             ) : (
               <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                 {calendarDays.map((date, idx) => {
                   if (!date) return <div key={idx}></div>;
                   
                   const isToday = new Date().toDateString() === date.toDateString();
                   const isSelected = selectedDate?.toDateString() === date.toDateString();
                   const available = hasSlots(date);
                   const isPast = date < new Date(new Date().setHours(0,0,0,0));
                   const disabled = isPast || !available;

                   return (
                     <button
                       key={idx}
                       disabled={disabled}
                       onClick={() => {
                         setSelectedDate(date);
                         setSelectedSlot(null);
                       }}
                       className={`
                         aspect-square rounded-full flex flex-col items-center justify-center relative transition-all duration-300
                         ${isSelected ? 'bg-[#937BF0] text-white shadow-lg scale-105' : ''}
                         ${!isSelected && !disabled ? 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#1d1d1f] dark:text-white cursor-pointer' : ''}
                         ${disabled ? 'text-gray-300 dark:text-zinc-700 cursor-not-allowed' : ''}
                       `}
                     >
                       <span className={`text-sm font-medium ${isToday && !isSelected ? 'text-[#937BF0]' : ''}`}>
                         {date.getDate()}
                       </span>
                       {available && !isSelected && !disabled && (
                         <span className="w-1 h-1 bg-[#937BF0] rounded-full absolute bottom-2"></span>
                       )}
                     </button>
                   );
                 })}
               </div>
             )}
             
             <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2 text-xs text-[#86868b] dark:text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Times displayed in {userTimezone}</span>
             </div>
          </div>

          {/* Time Slots & Confirmation */}
          <div className="lg:col-span-5 flex flex-col h-full">
            {selectedDate ? (
               <div className="glass-card bg-white/70 dark:bg-zinc-900/70 p-8 rounded-[2.5rem] border-gray-100 dark:border-zinc-800 shadow-xl h-full flex flex-col animate-reveal-up">
                 <h3 className="text-xl font-bold mb-6 text-[#1d1d1f] dark:text-white text-center">
                   Available Times <br/>
                   <span className="text-sm font-normal text-[#86868b] dark:text-gray-400">
                     for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                   </span>
                 </h3>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                   <div className="grid grid-cols-2 gap-3">
                     {getSlotsForDate(selectedDate).map((slot, idx) => (
                       <button
                         key={idx}
                         onClick={() => setSelectedSlot(slot)}
                         className={`
                           py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 border
                           ${selectedSlot === slot 
                             ? 'bg-[#937BF0] border-[#937BF0] text-white shadow-md' 
                             : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-[#1d1d1f] dark:text-white hover:border-[#937BF0] hover:text-[#937BF0]'
                           }
                         `}
                       >
                         {formatTime(slot)}
                       </button>
                     ))}
                   </div>
                   {getSlotsForDate(selectedDate).length === 0 && (
                     <p className="text-center text-[#86868b] my-10">No slots available for this date.</p>
                   )}
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                   <button
                     onClick={handleBooking}
                     disabled={!selectedSlot || !userDetails.email || bookingLoading}
                     className={`
                       w-full py-4 rounded-full font-bold text-base transition-all duration-300 flex items-center justify-center gap-2
                       ${selectedSlot && userDetails.email
                         ? 'bg-[#937BF0] hover:bg-[#7D65D6] text-white shadow-lg hover:shadow-xl hover:-translate-y-1' 
                         : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                       }
                     `}
                   >
                     {bookingLoading ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         Processing...
                       </>
                     ) : (
                       "Confirm Booking"
                     )}
                   </button>
                 </div>
               </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-[#86868b] dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[2.5rem]">
                <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a date to view available time slots.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;