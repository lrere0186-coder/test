'use client';
import React, { useState, useEffect } from 'react';
import { Slot } from '../types';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import FileUpload from '../components/FileUpload';

interface SlotReservationPageProps {
  slot: Slot;
  onBack: () => void;
}

// ========================================
// STEP INDICATOR
// ========================================
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Selection', 'Biography', 'Payment', 'Confirmation'];
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0A0A0A]'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1A1A1A] text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`hidden md:inline font-medium ${
                  isActive
                    ? 'text-[#D4AF37]'
                    : isCompleted
                    ? 'text-gray-300'
                    : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-grow h-px bg-gray-700 w-8 md:w-16"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ========================================
// STEP 1: SELECTION
// ========================================
const Step1: React.FC<{ slot: Slot; onNext: () => void }> = ({ slot, onNext }) => (
  <div className="text-center">
    <h2 className="text-3xl font-playfair mb-4">You have selected your Legacy Slot.</h2>
    <p className="text-gray-300 mb-8">This unique identifier will forever be associated with your story.</p>
    <div className="bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-lg p-8 max-w-sm mx-auto">
      <p className="text-sm text-gray-400">SLOT NUMBER</p>
      <p className="text-6xl font-mono font-bold text-[#D4AF37] my-2">
        {String(slot.id).padStart(5, '0')}
      </p>
      <p className="text-sm text-gray-400">PRICE</p>
      <p className="text-3xl font-semibold text-[#F5F5F0]">€{slot.price.toLocaleString()}</p>
    </div>
    <button
      onClick={onNext}
      className="mt-8 bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-12 rounded-md hover:bg-yellow-300 transition-colors"
    >
      Proceed to Biography
    </button>
  </div>
);

// ========================================
// STEP 2: BIOGRAPHY
// ========================================
interface Step2Props {
  bio: string;
  setBio: (bio: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  status: string;
  setStatus: (status: string) => void;
  quote: string;
  setQuote: (quote: string) => void;
  photos: string[];
  setPhotos: (photos: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const Step2: React.FC<Step2Props> = ({
  bio,
  setBio,
  fullName,
  setFullName,
  status,
  setStatus,
  quote,
  setQuote,
  photos,
  setPhotos,
  onBack,
  onNext,
}) => {
  const wordCount = bio.split(/\s+/).filter((word) => word.length > 0).length;
  const isOverLimit = wordCount > 500;

  return (
    <div>
      <h2 className="text-3xl font-playfair mb-2 text-center">Craft Your Legacy</h2>
      <p className="text-gray-300 mb-8 text-center">
        This information will be permanently stored. Take your time.
      </p>
      <form className="space-y-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
            >
              <option value="Living">Living</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Personal Quote</label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="A phrase to be remembered by..."
            className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Biography (max. 500 words)
          </label>
          <textarea
            rows={10}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
          ></textarea>
          <p className={`text-right text-sm ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
            {wordCount} / 500 words {isOverLimit && '(Too many words!)'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Photos (optional, max 10)
          </label>
          <FileUpload 
            onUploadComplete={setPhotos}
            maxFiles={10}
            existingFiles={photos}
          />
        </div>
        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white">
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isOverLimit}
            className="bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-12 rounded-md hover:bg-yellow-300 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

// ========================================
// STEP 3: PAYMENT (STRIPE)
// ========================================
interface Step3Props {
  slot: Slot;
  fullName: string;
  biography: string;
  quote: string;
  status: string;
  photos: string[];
  onBack: () => void;
  onNext: () => void;
}

const Step3: React.FC<Step3Props> = ({
  slot,
  fullName,
  biography,
  quote,
  status,
  photos,
  onBack,
  onNext,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
  setIsProcessing(true);
  setError('');

  try {
    // Récupérer l'utilisateur connecté
    const supabase = (await import('@/lib/supabase-browser')).createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to complete payment');
      setIsProcessing(false);
      return;
    }

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: slot.id,
        userId: user.id,
        fullName,
        biography,
        quote,
        status,
        photos,
      }),
    });

      const data = await response.json();

      if (data.success && data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="bg-[#1A1A1A] rounded-lg p-8 border border-gray-800">
        <h3 className="text-2xl font-playfair mb-6">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">
              Legacy Slot #{String(slot.id).padStart(5, '0')}
            </span>
            <span className="font-semibold">€{slot.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blockchain Fee</span>
            <span className="font-semibold">€25.00</span>
          </div>
          <div className="border-t border-gray-700 my-4"></div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-[#D4AF37]">€{(slot.price + 25).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Payment is processed securely by Stripe. Your legacy data is encrypted and prepared
            for permanent storage upon successful transaction.
          </p>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-playfair mb-6">Secure Payment</h3>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure payment powered by Stripe</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>SSL encrypted transaction</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Full refund within 14 days</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-12 rounded-md hover:bg-yellow-300 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// STEP 4: CONFIRMATION
// ========================================
const Step4: React.FC<{ slot: Slot; onBack: () => void }> = ({ slot, onBack }) => (
  <div className="text-center max-w-lg mx-auto">
    <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
    <h2 className="text-4xl font-playfair mb-4">Your Legacy is Secured.</h2>
    <p className="text-gray-300 mb-8">
      Congratulations. Slot #{String(slot.id).padStart(5, '0')} is now yours, permanently. A
      confirmation has been sent to your email.
    </p>
    <button
      onClick={onBack}
      className="bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-12 rounded-md hover:bg-yellow-300 transition-colors"
    >
      Go to Dashboard
    </button>
  </div>
);

// ========================================
// MAIN COMPONENT
// ========================================
const SlotReservationPage: React.FC<SlotReservationPageProps> = ({ slot, onBack }) => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState('Living');
  const [quote, setQuote] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Release slot function
  const releaseSlot = async () => {
    try {
      await fetch('/api/slots/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id }),
      });
      console.log(`✅ Slot #${slot.id} released`);
    } catch (error) {
      console.error('Error releasing slot:', error);
    }
  };

  // Detect page close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const blob = new Blob([JSON.stringify({ slotId: slot.id })], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/slots/release', blob);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slot.id]);

  // Back button handler
  const handleBack = async () => {
    if (step === 1) {
      await releaseSlot();
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 slot={slot} onNext={() => setStep(2)} />;
      case 2:
        return (
          <Step2
            bio={bio}
            setBio={setBio}
            fullName={fullName}
            setFullName={setFullName}
            status={status}
            setStatus={setStatus}
            quote={quote}
            setQuote={setQuote}
            photos={photos}
            setPhotos={setPhotos} 
            onBack={handleBack}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <Step3
            slot={slot}
            fullName={fullName}
            biography={bio}
            quote={quote}
            status={status}
            photos={photos}
            onBack={handleBack}
            onNext={() => setStep(4)}
          />
        );
      case 4:
        return <Step4 slot={slot} onBack={onBack} />;
      default:
        return <Step1 slot={slot} onNext={() => setStep(2)} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={async () => {
            await releaseSlot();
            onBack();
          }}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
        >
          Cancel Reservation
        </button>
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
        >
          Back
        </button>
      </div>
      <StepIndicator currentStep={step} />
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
};

export default SlotReservationPage;