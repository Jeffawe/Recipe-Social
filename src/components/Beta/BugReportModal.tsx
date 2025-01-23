import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RATE_LIMIT_KEY = 'bug_report_timestamp';
const RATE_LIMIT_DURATION = 5 * 60 * 60 * 1000; 

const BugReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    const lastReportTime = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastReportTime) {
      const timeSinceLastReport = Date.now() - parseInt(lastReportTime);
      setIsRateLimited(timeSinceLastReport < RATE_LIMIT_DURATION);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    const lastReportTime = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastReportTime) {
      const timeSinceLastReport = Date.now() - parseInt(lastReportTime);
      if (timeSinceLastReport < RATE_LIMIT_DURATION) {
        alert('You can only submit one bug report every 5 hours.');
        return;
      }
    }

    try {
      sendToDiscord(email, description)

      // Set rate limit timestamp
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

      alert('Thank you for your bug report!');
      onClose();
    } catch (error) {
      console.error('Bug report failed:', error);
      alert('Failed to submit bug report. Please try again.');
    }
  };

  // Discord webhook submission
  const sendToDiscord = async (email: string, description: string) => {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('Discord webhook URL not configured');
    }

    const payload = {
      content: "New Bug Report",
      embeds: [{
        title: "Bug Report",
        fields: [
          { name: "Email", value: email || "Not provided" },
          { name: "Description", value: description }
        ],
        color: 16711680 // Red color
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Discord webhook failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
        </DialogHeader>
        
        {isRateLimited ? (
          <div className="text-red-500">
            You can only submit one bug report every 5 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Report Method</Label>
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="Your email"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Bug Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Please describe the bug in detail"
                rows={4}
              />
            </div>
            
            <Button type="submit" className="w-full bg-orange-500">
              Submit Bug Report
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BugReportModal;