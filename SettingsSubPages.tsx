import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Image, Activity, Bell, Check, 
  Volume2, VolumeX, Moon, Sun, Monitor, Globe,
  MousePointer2, ShieldCheck, Zap, AlertCircle, Clock,
  User, Mail, Phone, Calendar, MapPin, Upload, Lock, Key, Smartphone, Grid, Eye, EyeOff, Copy, Gift, UserCheck, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from './Toast';

import { useTranslation, languages, Language } from '../lib/i18n';

interface SubPageProps {
  onBack: () => void;
}

// --- New Profile & Security Settings Components ---

export const PersonalInformationSettings: React.FC<SubPageProps & {
  timezoneOffset: number;
  setTimezoneOffset: (v: number) => void;
}> = ({ onBack, timezoneOffset, setTimezoneOffset }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [name, setName] = useState(() => localStorage.getItem('user-name') || 'John Doe');
  const [dob, setDob] = useState(() => localStorage.getItem('user-dob') || '1990-01-01');
  const [gender, setGender] = useState(() => localStorage.getItem('user-gender') || 'Male');
  const [country, setCountry] = useState(() => localStorage.getItem('user-country') || 'United States');
  const [address, setAddress] = useState(() => localStorage.getItem('user-address') || '');
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  const handleSave = () => {
    localStorage.setItem('user-name', name);
    localStorage.setItem('user-dob', dob);
    localStorage.setItem('user-gender', gender);
    localStorage.setItem('user-country', country);
    localStorage.setItem('user-address', address);
    showToast('Personal information updated successfully', 'success');
  };

  const timezones = [
    { label: 'UTC (GMT)', offset: 0 },
    { label: 'London (UTC+0)', offset: 0 },
    { label: 'Berlin (UTC+1)', offset: 1 },
    { label: 'Cairo (UTC+2)', offset: 2 },
    { label: 'Moscow (UTC+3)', offset: 3 },
    { label: 'Dubai (UTC+4)', offset: 4 },
    { label: 'Karachi (UTC+5)', offset: 5 },
    { label: 'India (UTC+5:30)', offset: 5.5 },
    { label: 'Dhaka/Bangladesh (UTC+6)', offset: 6 },
    { label: 'Bangladesh (Custom UTC+6:30)', offset: 6.5 },
    { label: 'Myanmar (UTC+6:30)', offset: 6.5 },
    { label: 'Bangkok (UTC+7)', offset: 7 },
    { label: 'Hong Kong (UTC+8)', offset: 8 },
    { label: 'Tokyo (UTC+9)', offset: 9 },
    { label: 'Sydney (UTC+10)', offset: 10 },
    { label: 'New York (UTC-5)', offset: -5 },
    { label: 'Chicago (UTC-6)', offset: -6 },
    { label: 'Los Angeles (UTC-8)', offset: -8 },
    { label: 'Sao Paulo (UTC-3)', offset: -3 },
  ];

  const selectedTimezone = timezones.find(tz => tz.offset === timezoneOffset) || timezones[0];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Personal Information</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Gender</label>
            <div className="flex gap-3">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    "flex-1 py-3 rounded-xl border font-medium transition",
                    gender === g 
                      ? "bg-blue-500/20 border-blue-500 text-blue-500" 
                      : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Country</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition appearance-none"
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
                <option>Bangladesh</option>
                <option>India</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Timezone</label>
            <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
              <button 
                onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                className="w-full p-3 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition"
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500" />
                  <span className="font-medium text-[var(--text-primary)]">{selectedTimezone.label}</span>
                </div>
                <ChevronLeft size={20} className={cn("text-gray-500 transition-transform", isTimezoneOpen ? "-rotate-90" : "rotate-180")} />
              </button>
              
              {isTimezoneOpen && (
                <div className="border-t border-[var(--border-color)] max-h-60 overflow-y-auto">
                  {timezones.map((tz) => (
                    <button
                      key={tz.label}
                      onClick={() => {
                        setTimezoneOffset(tz.offset);
                        setIsTimezoneOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 px-4 transition border-b border-[var(--border-color)] last:border-0",
                        timezoneOffset === tz.offset 
                          ? "bg-blue-500/10" 
                          : "hover:bg-[var(--bg-tertiary)]"
                      )}
                    >
                      <span className="text-sm text-[var(--text-primary)]">{tz.label}</span>
                      {timezoneOffset === tz.offset && (
                        <Check size={16} className="text-blue-500" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition resize-none"
                placeholder="Enter your full address"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export const ContactSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState(() => localStorage.getItem('user-phone') || '');

  const handleSave = () => {
    localStorage.setItem('user-phone', phone);
    showToast('Contact information updated successfully', 'success');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Contacts</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                value={email}
                readOnly
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] pl-10 pr-12 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none cursor-not-allowed opacity-70"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Verified</span>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">To change your email, please contact support.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <button className="text-sm text-blue-500 font-bold hover:underline">
              Verify Phone Number
            </button>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          Save Contacts
        </button>
      </div>
    </motion.div>
  );
};

export const VerificationSettings: React.FC<SubPageProps & { socket: any, userEmail: string }> = ({ onBack, socket, userEmail }) => {
  const { showToast } = useToast();
  const [status, setStatus] = useState<'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('NOT_SUBMITTED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [step, setStep] = useState<'status' | 'form'>('status');
  const [documentType, setDocumentType] = useState('NID');
  const [formData, setFormData] = useState({
    fullName: '',
    documentNumber: '',
    dateOfBirth: '',
    frontImage: '',
    backImage: ''
  });

  useEffect(() => {
    if (!socket || !userEmail) return;

    socket.emit('get-kyc-status', userEmail);

    const handleStatus = (data: any) => {
      if (data) {
        setStatus(data.status);
        setRejectionReason(data.rejectionReason || '');
      }
    };

    const handleUpdate = (data: any) => {
      setStatus(data.status);
      setRejectionReason(data.reason || '');
    };

    const handleSubmitSuccess = () => {
      showToast('KYC submitted successfully!', 'success');
      setStatus('PENDING');
      setStep('status');
    };

    const handleError = (msg: string) => {
      showToast(msg, 'error');
    };

    socket.on('kyc-status', handleStatus);
    socket.on('kyc-status-updated', handleUpdate);
    socket.on('kyc-submitted', handleSubmitSuccess);
    socket.on('kyc-error', handleError);

    return () => {
      socket.off('kyc-status', handleStatus);
      socket.off('kyc-status-updated', handleUpdate);
      socket.off('kyc-submitted', handleSubmitSuccess);
      socket.off('kyc-error', handleError);
    };
  }, [socket, userEmail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [side === 'front' ? 'frontImage' : 'backImage']: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.documentNumber || !formData.dateOfBirth || !formData.frontImage) {
      showToast('Please fill all required fields and upload front image', 'error');
      return;
    }

    socket.emit('submit-kyc', {
      email: userEmail,
      documentType,
      ...formData
    });
  };

  const docTypes = [
    { id: 'NID', label: 'National ID', icon: <User size={20} /> },
    { id: 'Passport', label: 'Passport', icon: <Globe size={20} /> },
    { id: 'Driving License', label: 'Driving License', icon: <Activity size={20} /> },
    { id: 'Utility Bill', label: 'Utility Bill', icon: <MapPin size={20} /> }
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Identity Verification</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {step === 'status' ? (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={cn(
              "p-8 rounded-2xl border flex flex-col items-center text-center gap-4 shadow-xl",
              status === 'VERIFIED' ? "bg-green-500/10 border-green-500/20" : 
              status === 'PENDING' ? "bg-yellow-500/10 border-yellow-500/20" : 
              status === 'REJECTED' ? "bg-red-500/10 border-red-500/20" :
              "bg-blue-500/5 border-[var(--border-color)]"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center shadow-lg",
                status === 'VERIFIED' ? "bg-green-500 text-white" : 
                status === 'PENDING' ? "bg-yellow-500 text-black" : 
                status === 'REJECTED' ? "bg-red-500 text-white" :
                "bg-blue-500 text-white"
              )}>
                {status === 'VERIFIED' ? <ShieldCheck size={40} /> : 
                 status === 'PENDING' ? <Clock size={40} /> : 
                 status === 'REJECTED' ? <AlertCircle size={40} /> :
                 <UserCheck size={40} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest">
                  {status === 'NOT_SUBMITTED' ? 'Unverified' : status}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xs mx-auto">
                  {status === 'VERIFIED' ? "Congratulations! Your identity is verified. You have full access to all platform features." :
                   status === 'PENDING' ? "Your documents are currently being reviewed by our compliance team. This usually takes 12-24 hours." :
                   status === 'REJECTED' ? `Verification failed: ${rejectionReason}. Please try again with correct documents.` :
                   "Complete your KYC verification to unlock withdrawals, higher limits, and professional trading tools."}
                </p>
              </div>

              {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
                <button 
                  onClick={() => setStep('form')}
                  className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs"
                >
                  Start Verification
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Secure & Encrypted</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Your documents are stored with bank-grade encryption and only used for verification.</p>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Fast Processing</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Our team reviews most submissions within 24 hours on business days.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Select Document Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {docTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setDocumentType(type.id)}
                    className={cn(
                      "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                      documentType === type.id 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5"
                    )}
                  >
                    {type.icon}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Personal Details</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase ml-1">Full Name (As on Document)</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase ml-1">Document Number</label>
                  <input 
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                    placeholder="Enter ID/Passport number"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase ml-1">Date of Birth</label>
                  <input 
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Document Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase ml-1">Front Side</label>
                  <div className="relative aspect-[3/2] rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden group">
                    {formData.frontImage ? (
                      <img src={formData.frontImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                        <Upload size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold">Click to Upload</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'front')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase ml-1">Back Side (Optional)</label>
                  <div className="relative aspect-[3/2] rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden group">
                    {formData.backImage ? (
                      <img src={formData.backImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                        <Upload size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold">Click to Upload</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'back')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setStep('status')}
                className="flex-1 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black rounded-xl transition uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs"
              >
                Submit for Review
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const NotificationSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(() => localStorage.getItem('notif-email') !== 'false');
  const [pushNotifs, setPushNotifs] = useState(() => localStorage.getItem('notif-push') !== 'false');
  const [promoNotifs, setPromoNotifs] = useState(() => localStorage.getItem('notif-promo') !== 'false');
  const [tradeNotifs, setTradeNotifs] = useState(() => localStorage.getItem('notif-trade') !== 'false');

  const handleToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    showToast('Notification settings updated', 'success');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Notifications</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] divide-y divide-[var(--border-color)]">
          <ToggleItem 
            icon={<Mail size={20} className="text-blue-500" />}
            label="Email Notifications"
            description="Receive updates and alerts via email"
            enabled={emailNotifs}
            onToggle={() => handleToggle('notif-email', !emailNotifs, setEmailNotifs)}
          />
          <ToggleItem 
            icon={<Bell size={20} className="text-purple-500" />}
            label="Push Notifications"
            description="Receive real-time alerts on your device"
            enabled={pushNotifs}
            onToggle={() => handleToggle('notif-push', !pushNotifs, setPushNotifs)}
          />
          <ToggleItem 
            icon={<Gift size={20} className="text-pink-500" />}
            label="Promotions & Offers"
            description="Get notified about bonuses and special events"
            enabled={promoNotifs}
            onToggle={() => handleToggle('notif-promo', !promoNotifs, setPromoNotifs)}
          />
          <ToggleItem 
            icon={<Activity size={20} className="text-green-500" />}
            label="Trade Alerts"
            description="Notifications for trade results and signals"
            enabled={tradeNotifs}
            onToggle={() => handleToggle('notif-trade', !tradeNotifs, setTradeNotifs)}
            isLast
          />
        </div>
      </div>
    </motion.div>
  );
};

export const PasswordSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      showToast('Password updated successfully', 'success');
      onBack();
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Change Password</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-12 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter current password"
              />
              <button 
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">New Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-12 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter new password"
              />
              <button 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Confirm New Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-12 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
                placeholder="Confirm new password"
              />
              <button 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <h4 className="text-yellow-500 font-bold text-sm mb-1">Password Requirements</h4>
          <ul className="text-xs text-yellow-200/70 list-disc pl-4 space-y-1">
            <li>Minimum 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          Update Password
        </button>
      </div>
    </motion.div>
  );
};

export const TwoFactorSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [enabled, setEnabled] = useState(() => localStorage.getItem('2fa-enabled') === 'true');
  const [code, setCode] = useState('');

  const handleToggle = () => {
    if (enabled) {
      setEnabled(false);
      localStorage.setItem('2fa-enabled', 'false');
      showToast('Two-factor authentication disabled', 'info');
    } else {
      setEnabled(true);
    }
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      showToast('Please enter a valid 6-digit code', 'error');
      return;
    }
    localStorage.setItem('2fa-enabled', 'true');
    showToast('Two-factor authentication enabled successfully', 'success');
    onBack();
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Two-Factor Authentication</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Protect Your Account</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xs">
            Two-factor authentication adds an extra layer of security to your account.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Smartphone size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Authenticator App</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Use Google Authenticator or Authy</p>
              </div>
            </div>
            <button 
              onClick={handleToggle}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition",
                enabled 
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              {enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {enabled && localStorage.getItem('2fa-enabled') !== 'true' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white p-2 rounded-lg">
                {/* Placeholder QR Code */}
                <div className="w-full h-full bg-black pattern-grid-lg opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Scan this QR code with your authenticator app</p>
                <div className="bg-black/30 px-4 py-2 rounded-lg font-mono text-sm tracking-wider flex items-center gap-2">
                  <span>ABCD 1234 EFGH 5678</span>
                  <Copy size={14} className="text-gray-500 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Enter Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000 000"
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-xl tracking-widest py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-blue-500 transition"
                maxLength={6}
              />
            </div>

            <button 
              onClick={handleVerify}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition active:scale-[0.98]"
            >
              Verify & Activate
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const AppPinSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [enabled, setEnabled] = useState(() => localStorage.getItem('pin-enabled') === 'true');
  const [pin, setPin] = useState('');

  const handleToggle = () => {
    if (enabled) {
      setEnabled(false);
      localStorage.setItem('pin-enabled', 'false');
      localStorage.removeItem('app-pin');
      showToast('App PIN disabled', 'info');
    } else {
      setEnabled(true);
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4) {
      localStorage.setItem('pin-enabled', 'true');
      localStorage.setItem('app-pin', pin);
      showToast('App PIN set successfully', 'success');
      onBack();
    }
  };

  useEffect(() => {
    if (enabled && pin.length === 4) {
      handleSetPin();
    }
  }, [pin, enabled]);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">App PIN</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
          <ToggleItem 
            icon={<Grid size={20} className="text-purple-500" />}
            label="Enable App PIN"
            description="Require a PIN to open the app"
            enabled={enabled}
            onToggle={handleToggle}
            isLast
          />
        </div>

        {enabled && localStorage.getItem('pin-enabled') !== 'true' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Set Your PIN</h3>
              <p className="text-xs text-[var(--text-secondary)]">Enter a 4-digit PIN code</p>
            </div>

            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition",
                    pin.length > i 
                      ? "border-blue-500 bg-blue-500/10 text-blue-500" 
                      : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  )}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (pin.length < 4) setPin(prev => prev + num);
                  }}
                  className="h-16 rounded-xl bg-[var(--bg-secondary)] hover:bg-white/5 border border-[var(--border-color)] text-2xl font-bold text-[var(--text-primary)] transition active:scale-95"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => {
                  if (pin.length < 4) setPin(prev => prev + "0");
                }}
                className="h-16 rounded-xl bg-[var(--bg-secondary)] hover:bg-white/5 border border-[var(--border-color)] text-2xl font-bold text-[var(--text-primary)] transition active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => setPin(prev => prev.slice(0, -1))}
                className="h-16 rounded-xl bg-[var(--bg-secondary)] hover:bg-white/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] transition active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const TradingPlatformSettings: React.FC<SubPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [oneClick, setOneClick] = useState(() => localStorage.getItem('trade-oneclick') === 'true');
  const [confirmTrade, setConfirmTrade] = useState(() => localStorage.getItem('trade-confirm') === 'true');
  const [highPerformance, setHighPerformance] = useState(() => localStorage.getItem('trade-highperf') !== 'false');

  const handleToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    showToast('Settings updated', 'success');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('nav.terminal')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Trading Mode</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <ToggleItem 
              icon={<Zap size={20} className="text-yellow-500" />} 
              label="One-Click Trading" 
              description="Open trades instantly without confirmation"
              enabled={oneClick}
              onToggle={() => handleToggle('trade-oneclick', !oneClick, setOneClick)}
            />
            <ToggleItem 
              icon={<ShieldCheck size={20} className="text-blue-500" />} 
              label="Confirm Trades" 
              description="Ask for confirmation before opening a trade"
              enabled={confirmTrade}
              onToggle={() => handleToggle('trade-confirm', !confirmTrade, setConfirmTrade)}
              isLast
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Performance</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <ToggleItem 
              icon={<Activity size={20} className="text-green-500" />} 
              label="High Performance Mode" 
              description="Smoother chart rendering (uses more battery)"
              enabled={highPerformance}
              onToggle={() => handleToggle('trade-highperf', !highPerformance, setHighPerformance)}
              isLast
            />
          </div>
        </section>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
          <AlertCircle className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-200/80 leading-relaxed">
            Trading platform settings are synchronized across all your devices. 
            Changes made here will take effect immediately.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳' },
];

export const AppearanceSettings: React.FC<SubPageProps & { 
  timezoneOffset?: number, 
  setTimezoneOffset?: (v: number) => void,
  currency: typeof CURRENCIES[0],
  setCurrency: (c: typeof CURRENCIES[0]) => void
}> = ({ onBack, timezoneOffset = 0, setTimezoneOffset, currency, setCurrency }) => {
  const { t, language, setLanguage } = useTranslation();
  const { showToast } = useToast();
  const [theme, setTheme] = useState<string>(localStorage.getItem('app-theme') || 'dark');
  const [sound, setSound] = useState(() => localStorage.getItem('app-sound') !== 'false');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
    showToast('Theme updated', 'success');
  };

  const handleSoundToggle = () => {
    const newSound = !sound;
    setSound(newSound);
    localStorage.setItem('app-sound', String(newSound));
    showToast(`Sound ${newSound ? 'enabled' : 'disabled'}`, 'info');
  };

  const timezones = [
    { label: 'UTC (GMT)', offset: 0 },
    { label: 'London (UTC+0)', offset: 0 },
    { label: 'Berlin (UTC+1)', offset: 1 },
    { label: 'Cairo (UTC+2)', offset: 2 },
    { label: 'Moscow (UTC+3)', offset: 3 },
    { label: 'Dubai (UTC+4)', offset: 4 },
    { label: 'Karachi (UTC+5)', offset: 5 },
    { label: 'India (UTC+5:30)', offset: 5.5 },
    { label: 'Dhaka/Bangladesh (UTC+6)', offset: 6 },
    { label: 'Bangladesh (Custom UTC+6:30)', offset: 6.5 },
    { label: 'Myanmar (UTC+6:30)', offset: 6.5 },
    { label: 'Bangkok (UTC+7)', offset: 7 },
    { label: 'Hong Kong (UTC+8)', offset: 8 },
    { label: 'Tokyo (UTC+9)', offset: 9 },
    { label: 'Sydney (UTC+10)', offset: 10 },
    { label: 'New York (UTC-5)', offset: -5 },
    { label: 'Chicago (UTC-6)', offset: -6 },
    { label: 'Los Angeles (UTC-8)', offset: -8 },
    { label: 'Sao Paulo (UTC-3)', offset: -3 },
  ];

  const selectedTimezone = timezones.find(tz => tz.offset === timezoneOffset) || timezones[0];
  const selectedLanguage = languages.find(l => l.code === language) || languages[0];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col"
    >
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:bg-white/10 p-1 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('settings.appearance')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('settings.appearance')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ThemeButton 
              active={theme === 'dark'} 
              onClick={() => handleThemeChange('dark')}
              icon={<Moon size={20} />}
              label="Dark"
              color="#101114"
            />
            <ThemeButton 
              active={theme === 'light'} 
              onClick={() => handleThemeChange('light')}
              icon={<Sun size={20} />}
              label="Light"
              color="#f3f4f6"
            />
            <ThemeButton 
              active={theme === 'onyx'} 
              onClick={() => handleThemeChange('onyx')}
              icon={<ShieldCheck size={20} />}
              label="Onyx"
              color="#000000"
            />
            <ThemeButton 
              active={theme === 'midnight'} 
              onClick={() => handleThemeChange('midnight')}
              icon={<Monitor size={20} />}
              label="Midnight"
              color="#020617"
            />
            <ThemeButton 
              active={theme === 'emerald'} 
              onClick={() => handleThemeChange('emerald')}
              icon={<Activity size={20} />}
              label="Emerald"
              color="#022c22"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Currency</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currency.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{currency.code}</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">{currency.name}</span>
                </div>
              </div>
              <ChevronLeft size={20} className={cn("text-gray-500 transition-transform", isCurrencyOpen ? "-rotate-90" : "rotate-180")} />
            </button>
            
            {isCurrencyOpen && (
              <div className="border-t border-[var(--border-color)] max-h-60 overflow-y-auto">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c);
                      setIsCurrencyOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 px-4 transition border-b border-[var(--border-color)] last:border-0",
                      currency.code === c.code 
                        ? "bg-blue-500/10" 
                        : "hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-sm text-[var(--text-primary)]">{c.code}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">{c.name}</span>
                      </div>
                    </div>
                    {currency.code === c.code && (
                      <Check size={16} className="text-blue-500" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Timezone (Chart Time)</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <button 
              onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition"
            >
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-500" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{selectedTimezone.label}</span>
              </div>
              <ChevronLeft size={20} className={cn("text-gray-500 transition-transform", isTimezoneOpen ? "-rotate-90" : "rotate-180")} />
            </button>

            {isTimezoneOpen && (
              <div className="border-t border-[var(--border-color)] max-h-60 overflow-y-auto">
                {timezones.map((tz) => (
                  <button
                    key={tz.label}
                    onClick={() => {
                      setTimezoneOffset?.(tz.offset);
                      setIsTimezoneOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 px-4 transition border-b border-[var(--border-color)] last:border-0",
                      timezoneOffset === tz.offset
                        ? "bg-blue-500/10" 
                        : "hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <span className="text-sm font-medium text-[var(--text-primary)]">{tz.label}</span>
                    {timezoneOffset === tz.offset && (
                      <Check size={16} className="text-blue-500" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-500 px-1">This will adjust the time displayed on the trading chart axis.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sound Effects</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <ToggleItem 
              icon={sound ? <Volume2 size={20} className="text-blue-500" /> : <VolumeX size={20} className="text-gray-500" />} 
              label="Enable Sounds" 
              description="Play sounds for trade results and interactions"
              enabled={sound}
              onToggle={handleSoundToggle}
              isLast
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('settings.language')}</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)]">
            <button 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-400" />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedLanguage.flag}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{selectedLanguage.name}</span>
                </div>
              </div>
              <ChevronLeft size={20} className={cn("text-gray-500 transition-transform", isLanguageOpen ? "-rotate-90" : "rotate-180")} />
            </button>

            {isLanguageOpen && (
              <div className="border-t border-[var(--border-color)] max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 px-4 transition border-b border-[var(--border-color)] last:border-0",
                      language === lang.code
                        ? "bg-blue-500/10" 
                        : "hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{lang.name}</span>
                    </div>
                    {language === lang.code && (
                      <Check size={16} className="text-blue-500" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};


// --- Helper Components ---

const ToggleItem = ({ 
  icon, label, description, enabled, onToggle, isLast 
}: { 
  icon: React.ReactNode, label: string, description: string, enabled: boolean, onToggle: () => void, isLast?: boolean 
}) => (
  <div className={cn(
    "p-4 flex items-center justify-between",
    !isLast && "border-b border-[var(--border-color)]"
  )}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{label}</h3>
        <p className="text-[10px] text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={cn(
        "w-10 h-5 rounded-full relative transition-colors duration-200",
        enabled ? "bg-blue-500" : "bg-gray-700"
      )}
    >
      <div className={cn(
        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
        enabled ? "left-6" : "left-1"
      )} />
    </button>
  </div>
);

const ThemeButton = ({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition active:scale-95 relative overflow-hidden",
      active ? "border-blue-500 ring-1 ring-blue-500" : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
    )}
  >
    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
    <div className={cn(
      "p-2 rounded-full",
      active ? "bg-blue-500/20 text-blue-500" : "bg-white/5 text-[var(--text-secondary)]"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider",
      active ? "text-blue-500" : "text-[var(--text-secondary)]"
    )}>{label}</span>
    {active && (
      <div className="absolute top-2 right-2">
        <div className="bg-blue-500 rounded-full p-0.5">
          <Check size={10} className="text-white" />
        </div>
      </div>
    )}
  </button>
);
