import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Delete, ThumbsUp } from 'lucide-react';
import { FAQ, Comment } from '@/components/types/auth';

interface CommentAndFAQTabsProps {
    recipeId: string;
}

export interface CommentResponse {
    comments: Comment[];
    hasMore: boolean;
}

type TabValue = 'comments' | 'faqs';

const CommentAndFAQTabs: React.FC<CommentAndFAQTabsProps> = ({ recipeId }) => {
    const [activeTab, setActiveTab] = useState<TabValue>("comments");
    const [comments, setComments] = useState<Comment[]>([]);
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [newComment, setNewComment] = useState("");
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
            console.error('Error fetching comments:', error);
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
            console.error('Error fetching FAQs:', error);
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
            console.error('Error posting comment:', error);
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
            console.error('Error liking comment:', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!isAuthenticated) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/cf/faqs/delete${commentId}`,
            );

            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error Deleting comment:', error);
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
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <Tabs defaultValue="comments" onValueChange={(value) => setActiveTab(value as TabValue)}>
                <TabsList className="w-full mb-6">
                    <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
                    <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
                </TabsList>

                <TabsContent value="comments">
                    {isAuthenticated && (
                        <div className="mb-6">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="mb-2"
                            />
                            <Button onClick={handleCommentSubmit}>Post Comment</Button>
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
                                                disabled={true}
                                                className={`ml-4 flex items-center ${comment.likes.includes(user?._id || '') ? 'text-blue-500' : ''
                                                    }`}
                                            >
                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                {comment.likes.length}
                                            </button>
                                            {isAuthenticated && comment.author._id == user?._id &&
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className={`ml-4 flex items-center ${comment.likes.includes(user?._id || '') ? 'text-blue-500' : ''
                                                        }`}
                                                >
                                                    <Delete className="h-4 w-4 mr-1" />
                                                    {comment.likes.length}
                                                </button>
                                            }
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
    );
};

export default CommentAndFAQTabs;