import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import axios from 'axios';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
}

const DeleteRecipeModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  recipeId,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (username !== user?.username) {
      setError('Username does not match');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onClose();
      navigate('/');
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