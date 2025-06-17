import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BetaNoticeModalProps {
  initiallyOpen?: boolean;
}

const MODAL_EXPIRY_HOURS = 12;

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

  // const featuresInProgress = [
  //   "More recipe search filters",
  //   "Advanced Recipe Search Capabilities from across the web"
  // ];

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
            Our backend is currently down while we migrate from Oracle Virtual Machines to a new VM—or possibly AWS. In the meantime, enjoy the frontend experience!
          </p>

          <div>
            <h3 className="font-semibold mb-2">Want to peek under the hood?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <a
                  href="https://github.com/Jeffawe/Recipe-Social-Backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Node.js & Express Backend
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Jeffawe/Recipe-Search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Python NLP Recipe-Search Service
                </a>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            We apologize for the inconvenience and appreciate your patience as we work to bring the backend back online.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetaNoticeModal;