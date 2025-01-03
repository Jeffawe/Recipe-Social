import React, { useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';
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

interface DeleteModalProps {
  isOpen: boolean;
  deleteAction: () => Promise<void>;
  onClose: () => void;
}

const DeleteRecipeModal: React.FC<DeleteModalProps> = ({
  isOpen,
  deleteAction,
  onClose,
}) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      if (username !== user?.username) {
        setError('Username does not match');
        return;
      }

      await deleteAction();
      onClose();

      onClose();
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recipe</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type your username "{user?.username}" to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeModal