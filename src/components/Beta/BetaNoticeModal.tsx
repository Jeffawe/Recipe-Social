import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BetaNoticeModalProps {
  initiallyOpen?: boolean;
}

const MODAL_EXPIRY_HOURS = 24;

const BetaNoticeModal: React.FC<BetaNoticeModalProps> = () => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      const storedTime = localStorage.getItem("betaModalSeenTime");
      const currentTime = Date.now();
  
      if (!storedTime || currentTime > parseInt(storedTime, 10)) {
        // Show modal if no record exists or if expired
        setIsOpen(true);
        const expiryTime = currentTime + MODAL_EXPIRY_HOURS * 60 * 60 * 1000; // Current time + expiry time
        localStorage.setItem("betaModalSeenTime", expiryTime.toString());
      } else {
        setIsOpen(false);
      }
    }, []);

  const featuresInProgress = [
    "More recipe search filters",
    "Advanced Recipe Search Capabilities from across the web"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Welcome to Recipe Social Beta</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Thank you for using Recipe Social! We're currently in beta, and we appreciate your patience.
          </p>
          
          <div>
            <h3 className="font-semibold mb-2">Upcoming Features:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {featuresInProgress.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-gray-500">
            Found a bug? Please use the "Report Bug" button in the footer to help us improve!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetaNoticeModal;