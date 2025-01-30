import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Delete, ThumbsUp, Plus } from 'lucide-react';
import { FAQ, Comment, RecipeData } from '@/components/types/auth';

const MAX_COMMENTS = 20;
const MAX_FAQ = 5;

interface CommentAndFAQTabsProps {
    recipeId: string;
    recipe: RecipeData;
}

export interface CommentResponse {
    comments: Comment[];
    hasMore: boolean;
}

export interface FAQValue {
    question: string;
    answer: string;
}

type TabValue = 'comments' | 'faqs';

const CommentAndFAQTabs: React.FC<CommentAndFAQTabsProps> = ({ recipeId, recipe }) => {
    const [activeTab, setActiveTab] = useState<TabValue>("comments");
    const [comments, setComments] = useState<Comment[]>([]);
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [newComment, setNewComment] = useState("");
    const [showFAQForm, setShowFAQForm] = useState(false);
    const [newFAQ, setNewFAQ] = useState<FAQValue>({
        question: '',
        answer: ''
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchComments = async (pageNum: number) => {
        try {
            setIsLoading(true);
            const { data } = await axios.get<CommentResponse>(
                `${API_BASE_URL}/cf/comments/${recipeId}?page=${pageNum}`,
                {
                    headers: {
                        'api-key': import.meta.env.VITE_API_KEY
                    }
                }
            );
            if (pageNum === 1) {
                setComments(data.comments);
            } else {
                setComments(prev => [...prev, ...data.comments]);
            }
            setHasMore(data.hasMore);
        } catch (error) {
            //console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFAQs = async () => {
        try {
            const { data } = await axios.get<FAQ[]>(`${API_BASE_URL}/cf/faqs/${recipeId}`, {
                headers: {
                    'api-key': import.meta.env.VITE_API_KEY
                }
            });
            setFAQs(data);
        } catch (error) {

        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !isAuthenticated) return;

        try {
            const { data } = await axios.post<Comment>(
                `${API_BASE_URL}/cf/comments`,
                {
                    content: newComment,
                    recipeId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': import.meta.env.VITE_API_KEY
                    }
                }
            );
            setComments(prev => [data, ...prev]);
            setNewComment("");
        } catch (error) {

        }
    };

    const handleFAQSubmit = async () => {
        if (!newFAQ.question.trim() || !newFAQ.answer.trim() || !isAuthenticated) return;

        try {
            const { data } = await axios.post<FAQ>(
                `${API_BASE_URL}/cf/faqs`,
                {
                    question: newFAQ.question,
                    answer: newFAQ.answer,
                    recipeId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': import.meta.env.VITE_API_KEY
                    }
                }
            );
            setFAQs(prev => [...prev, data]);
            setNewFAQ({ question: '', answer: '' });
            setShowFAQForm(false);
        } catch (error) {

        }
    };

    const handleLike = async (commentId: string) => {
        if (!isAuthenticated) return;

        try {
            const { data } = await axios.post<Comment>(
                `${API_BASE_URL}/cf/comments/${commentId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': import.meta.env.VITE_API_KEY
                    }
                }
            );
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId ? { ...comment, likes: data.likes } : comment
                )
            );
        } catch (error) {
            //console.error('Error liking comment:', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!isAuthenticated) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/cf/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': import.meta.env.VITE_API_KEY
                    }
                }
            );
            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            //console.error('Error Deleting comment:', error);
        }
    };

    useEffect(() => {
        if (activeTab === "comments") {
            fetchComments(1);
        } else {
            fetchFAQs();
        }
    }, [activeTab, recipeId]);

    return (
        <div>
            {!isAuthenticated && comments.length === 0 && faqs.length === 0 ? (
                <div></div>
            ) : (
                <div className="mt-8 rounded-lg shadow-md p-6">
                    <Tabs defaultValue="comments" onValueChange={(value) => setActiveTab(value as TabValue)}>
                        <TabsList className="w-full mb-6">
                            <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
                            <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="comments">
                            {isAuthenticated && comments.length < MAX_COMMENTS && (
                                <div className="mb-6">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="mb-2"
                                    />
                                    <Button onClick={handleCommentSubmit} className='bg-orange-500'>Post Comment</Button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{comment.author.username}</p>
                                                <p className="text-gray-600 mt-1">{comment.content}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    <button
                                                        onClick={() => handleLike(comment._id)}
                                                        disabled={!isAuthenticated}
                                                        className={`ml-4 flex items-center ${comment.likes.includes(user?._id || '') ? 'text-blue-500' : ''}`}
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                                        {comment.likes.length}
                                                    </button>
                                                    {isAuthenticated && comment.author._id === user?._id && (
                                                        <button
                                                            onClick={() => handleDelete(comment._id)}
                                                            className="ml-4 flex items-center text-red-500"
                                                        >
                                                            <Delete className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {hasMore && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setPage(prev => prev + 1);
                                            fetchComments(page + 1);
                                        }}
                                        disabled={isLoading}
                                        className="w-full mt-4"
                                    >
                                        {isLoading ? "Loading..." : "Load More Comments"}
                                    </Button>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="faqs">
                            <div className="space-y-6">
                                {recipe.author._id === user?._id && faqs.length < MAX_FAQ && !showFAQForm && (
                                    <Button
                                        onClick={() => setShowFAQForm(true)}
                                        className="mb-4 bg-orange-500"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create FAQ
                                    </Button>
                                )}

                                {showFAQForm && (
                                    <div className="mb-6 space-y-4">
                                        <Textarea
                                            value={newFAQ.question}
                                            onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                                            placeholder="Question..."
                                            className="mb-2"
                                        />
                                        <Textarea
                                            value={newFAQ.answer}
                                            onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                                            placeholder="Answer..."
                                            className="mb-2"
                                        />
                                        <div className="flex space-x-2">
                                            <Button onClick={handleFAQSubmit}>Submit FAQ</Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowFAQForm(false);
                                                    setNewFAQ({ question: '', answer: '' });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {faqs.map((faq) => (
                                    <div key={faq._id} className="border-b pb-4">
                                        <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default CommentAndFAQTabs;