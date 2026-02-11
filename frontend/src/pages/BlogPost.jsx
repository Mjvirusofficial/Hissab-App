import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';
import SEO from '../component/SEO';
import { blogPosts } from '../data/blogData';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Post not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title={post.title}
                description={post.excerpt}
                url={`https://dhisaab.netlify.app/blog/${post.id}`}
            />

            <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Hero Image */}
                <div className="h-64 md:h-96 w-full relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold mb-3 uppercase tracking-wider">
                            {post.category}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <User size={16} className="mr-2 text-indigo-500" />
                                {post.author}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={16} className="mr-2 text-indigo-500" />
                                {post.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={16} className="mr-2 text-indigo-500" />
                                {post.readTime}
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 transition">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="prose prose-lg prose-indigo max-w-none text-gray-600">
                        {post.content}
                    </div>
                </div>

                {/* Footer/Navigation */}
                <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back to Blog
                    </button>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
