// components/DeleteRecipeModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipeId: string;
}

export const ReportRecipeModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    recipeId,
}) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            if(description){ await sendToDiscord(description) }

        } catch (err) {
            setError('Failed to submit report');
        }
    };

    const sendToDiscord = async (description: string) => {
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
          throw new Error('Discord webhook URL not configured');
        }
    
        const payload = {
          content: "New Recipe Report",
          embeds: [{
            title: "Recipe Report",
            fields: [
              { name: "Description", value: description }
            ],
            color: 3447003 
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-black'>Report Recipe</DialogTitle>
                    <DialogDescription>
                        Please describe the issue with this recipe.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                            className='text-black'
                            value={`Problem with recipe: ${recipeId}`}
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full min-h-[100px] text-black bg-white p-2 border rounded-md"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue..."
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <DialogFooter>
                    <Button variant="outline" className='text-black' onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportRecipeModal;