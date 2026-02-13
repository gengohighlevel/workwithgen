import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Check, ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  options: string[]; 
  placeholder: string; 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1.5 relative group">
      <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#FAFAFA] dark:bg-zinc-800 border rounded-lg px-4 py-3 text-sm flex justify-between items-center cursor-pointer transition-all ${
          isOpen 
            ? 'bg-white dark:bg-zinc-800 border-[#8b5cf6] ring-1 ring-[#8b5cf6]' 
            : 'border-[#E5E5E5] dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
        }`}
      >
        <span className={value ? "text-[#1d1d1f] dark:text-white" : "text-gray-400 dark:text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Backdrop to close */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* Options */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 bg-white dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[280px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === option 
                  ? 'bg-[#f5f3ff] dark:bg-purple-900/30 text-[#7c5cf6] dark:text-purple-300 font-medium' 
                  : 'text-[#1d1d1f] dark:text-gray-200 hover:bg-[#f5f3ff] dark:hover:bg-purple-900/20 hover:text-[#7c5cf6] dark:hover:text-purple-300'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InquiryForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    leadSource: '',
    services: [] as string[],
    ghlStatus: '',
    projectType: '',
    timeline: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, ghlStatus: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/booking', { state: formData });
  };

  const servicesList = [
    "Full Agency Setup", "Full Subaccount Setup",
    "Funnel/Website Building", "Process Mapping",
    "Workflow Automation", "Pipeline and CRM Design",
    "Domain Setup", "Calendar Configuration",
    "A2P Verification", "API or Webhook Integrations",
    "AI Agents", "Email and SMS Marketing"
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-zinc-800 p-8 md:p-12 w-full transition-colors duration-300">
       {/* Header */}
       <div className="text-center mb-10">
         <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/692ae4452b865e8154ad422d.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
         </div>
         <h2 className="text-[28px] font-bold text-[#1d1d1f] dark:text-white mb-3">Work with Gen</h2>
         <p className="text-[#86868b] dark:text-gray-400 text-[15px]">Tell us about your project and we'll get back to you shortly.</p>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
         {/* Row 1 */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1.5">
             <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
             <input 
               type="text" 
               name="fullName" 
               placeholder="Full Name" 
               className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
               onChange={handleInputChange} 
             />
           </div>
           <div className="space-y-1.5">
             <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Email <span className="text-red-500">*</span></label>
             <input 
               type="email" 
               name="email" 
               required 
               placeholder="Email" 
               className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
               onChange={handleInputChange} 
             />
           </div>
         </div>

         {/* Row 2 */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1.5">
             <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Phone <span className="text-red-500">*</span></label>
             <input 
               type="tel" 
               name="phone" 
               required 
               placeholder="Phone" 
               className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
               onChange={handleInputChange} 
             />
           </div>
           <div className="space-y-1.5">
             <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Business Name</label>
             <input 
               type="text" 
               name="businessName" 
               placeholder="Business Name" 
               className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
               onChange={handleInputChange} 
             />
           </div>
         </div>

         {/* Lead Source */}
         <CustomSelect 
           label="Lead Source" 
           placeholder="Select a source"
           value={formData.leadSource}
           onChange={(val) => handleSelectChange('leadSource', val)}
           options={[
             "Facebook", 
             "Instagram", 
             "LinkedIn", 
             "Upwork", 
             "OnlineJobsPH", 
             "Referral"
           ]}
         />

         {/* Services Needed */}
         <div className="space-y-3">
           <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Services Needed</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
             {servicesList.map((service) => (
               <label key={service} className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-all duration-200 ${formData.services.includes(service) ? 'bg-[#8b5cf6] border-[#8b5cf6]' : 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-[#8b5cf6]'}`}>
                   {formData.services.includes(service) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                 </div>
                 <input type="checkbox" className="hidden" onChange={() => handleCheckboxChange(service)} />
                 <span className="text-[14px] text-gray-700 dark:text-gray-300">{service}</span>
               </label>
             ))}
           </div>
         </div>

         {/* GHL Status */}
         <div className="space-y-3">
           <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Do you currently use GoHighLevel?</label>
           <div className="space-y-2.5">
             {['Yes, actively', 'Yes, but not fully set up', 'No, not yet'].map((status) => (
               <label key={status} className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-200 ${formData.ghlStatus === status ? 'border-[#8b5cf6]' : 'border-gray-300 dark:border-zinc-600 group-hover:border-[#8b5cf6]'}`}>
                   {formData.ghlStatus === status && <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />}
                 </div>
                 <input type="radio" name="ghlStatus" className="hidden" value={status} onChange={() => handleRadioChange(status)} />
                 <span className="text-[14px] text-gray-700 dark:text-gray-300">{status}</span>
               </label>
             ))}
           </div>
         </div>

         {/* Project Type */}
         <CustomSelect 
           label="What type of project are you looking for?" 
           placeholder="Select project type"
           value={formData.projectType}
           onChange={(val) => handleSelectChange('projectType', val)}
           options={[
             "Hourly",
             "Project Based / Fixed",
             "One Time Setup + Monthly Retainer"
           ]}
         />

         {/* Timeline */}
         <CustomSelect 
           label="How soon do you need this service?" 
           placeholder="Select timeline"
           value={formData.timeline}
           onChange={(val) => handleSelectChange('timeline', val)}
           options={[
             "ASAP",
             "1-2 Weeks",
             "Within a Month",
             "Flexible"
           ]}
         />

         {/* Description */}
         <div className="space-y-1.5">
           <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">Briefly describe your main goal or problem</label>
           <textarea 
             name="description" 
             rows={4} 
             placeholder="Tell us more about what you need..." 
             className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500" 
             onChange={handleInputChange}
           ></textarea>
         </div>

         {/* Submit Button */}
         <button 
           type="submit" 
           disabled={isSubmitting} 
           className="w-full bg-[#7c5cf6] hover:bg-[#6d4ce0] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
         >
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
            {!isSubmitting && <Send className="w-4 h-4 ml-1" />}
         </button>

       </form>
    </div>
  );
};

export default InquiryForm;