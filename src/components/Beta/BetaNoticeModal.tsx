import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BetaNoticeModalProps {
  initiallyOpen?: boolean;
}

const BetaNoticeModal: React.FC<BetaNoticeModalProps> = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Check if modal has been shown before
    useEffect(() => {
      const hasSeenModal = localStorage.getItem('betaModalSeen');
      
      // If modal hasn't been seen, set it to open
      if (!hasSeenModal) {
        setIsOpen(true);
        localStorage.setItem('betaModalSeen', 'true');
      }else{
        
      }
    }, []);

//   const handleClose = () => {
//     setIsOpen(false);
//   };

  const featuresInProgress = [
    "More recipe search filters",
    "Advanced Recipe Search Capabilities from across the web"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Welcome to Recipe Hub Beta</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Thank you for using Recipe Hub! We're currently in beta, and we appreciate your patience.
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