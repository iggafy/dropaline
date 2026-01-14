import React from 'react';
import { Send, Heart } from 'lucide-react';
import { Comment } from '../types';

interface CommentItemProps {
    comment: Comment;
    allComments: Comment[];
    dropId: string;
    onReply: (handle: string, id: string) => void;
    onLike: (dropId: string, commentId: string) => void;
    depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    allComments,
    dropId,
    onReply,
    onLike,
    depth = 0
}) => {
    // Find replies to this specific comment
    const replies = allComments.filter(c => c.parentId === comment.id);

    // Limit depth to prevent crazy nesting issues, though 2-3 is usually fine
    const maxDepth = 4;

    return (
        <div className="flex flex-col gap-2">
            {/* The main comment card */}
            <div className={`bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--border-main)] shadow-sm hover:shadow-md transition-shadow group relative ${depth > 0 ? 'ml-6' : ''}`}>
                {/* Visual thread line for replies */}
                {depth > 0 && (
                    <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-[var(--border-main)] rounded-full"></div>
                )}

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--border-main)]">
                            <img
                                src={comment.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${comment.authorHandle}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs font-bold text-[var(--accent-blue)]">@{comment.authorHandle}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>

                <p className="text-sm text-[var(--text-main)] leading-relaxed mb-3">
                    {comment.text}
                </p>

                <div className="flex items-center gap-4 border-t border-[var(--border-main)] pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onReply(comment.authorHandle, comment.id)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] uppercase tracking-wider"
                    >
                        <Send size={10} />
                        Reply
                    </button>
                    <button
                        onClick={() => onLike(dropId, comment.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${comment.liked ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'}`}
                    >
                        <Heart size={10} className={comment.liked ? 'fill-current' : ''} />
                        {comment.liked ? 'Liked' : 'Like'}
                        {comment.likes > 0 && <span className="ml-1 opacity-60">({comment.likes})</span>}
                    </button>
                </div>
            </div>

            {/* Recursively render replies */}
            {replies.length > 0 && depth < maxDepth && (
                <div className="flex flex-col gap-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            dropId={dropId}
                            onReply={onReply}
                            onLike={onLike}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
