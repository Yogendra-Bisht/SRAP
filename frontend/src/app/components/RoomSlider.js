'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

const dummyRooms = [
    { _id: 'd1', title: "Premium Studio", price: 8500, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"] },
    { _id: 'd2', title: "Single Sharing PG", price: 6000, images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500"] },
    { _id: 'd3', title: "Luxury Apartment", price: 12000, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"] },
    { _id: 'd4', title: "Student Pods", price: 4500, images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500"] },
    { _id: 'd5', title: "Co-living Space", price: 7200, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"] },
];

const RoomSlider = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Fetch top 5 rooms
                const res = await api.get('/rooms?limit=5');
                if (res.data.rooms && res.data.rooms.length > 0) {
                    setRooms(res.data.rooms);
                } else {
                    setRooms(dummyRooms); // Fallback to dummy if empty
                }
            } catch (err) {
                console.error("Failed to fetch rooms for slider", err);
                setRooms(dummyRooms); // Fallback to dummy on error
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // Helper to get image
    const getImageUrl = (room) => {
        if (room.images && room.images.length > 0) {
            // Check if it's a backend relative path, if so, we might need full URL, 
            // but usually next/image or standard img handles it, or it's a full URL already
            // If it starts with http, return as is. Otherwise prepend backend URL if needed
            const url = room.images[0];
            if (url.startsWith('http')) return url;
            return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`; 
        }
        return "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"; // fallback
    };

    if (loading) {
        return (
            <div className="py-20 bg-white overflow-hidden flex flex-col items-center">
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-8 w-64 bg-slate-200 rounded-full mb-4 mx-auto"></div>
                    <div className="h-4 w-48 bg-slate-100 rounded-full mx-auto"></div>
                </div>
                <div className="flex gap-6 px-6 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="min-w-[300px] h-[400px] rounded-3xl bg-slate-200 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    const displayRooms = [...rooms, ...rooms]; // Double for seamless loop

    return (
        <div className="py-20 bg-white overflow-hidden relative">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-slate-800">Popular Destinations</h2>
                <p className="text-slate-500 font-medium">Handpicked rooms trending this week</p>
            </div>

            <div className="flex relative">
                {/* We double the array to create a seamless infinite loop */}
                <motion.div
                    className="flex gap-6 px-6"
                    style={{ willChange: "transform" }}
                    animate={{ x: [0, -1035] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    {displayRooms.map((room, index) => (
                        <div 
                            key={`${room._id}-${index}`} 
                            onClick={() => router.push(`/room/${room._id}`)}
                            className="min-w-[300px] h-[400px] rounded-3xl overflow-hidden relative group shadow-xl cursor-pointer"
                        >
                            <Image 
                                src={getImageUrl(room)} 
                                alt={room.title || "Room"} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 300px" 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                                <span className="inline-block bg-teal-500 text-white font-bold text-xs px-3 py-1 rounded-full w-fit mb-2">₹{room.price}/mo</span>
                                <h3 className="text-white text-xl font-bold line-clamp-1">{room.title}</h3>
                                {room.location?.city && (
                                    <p className="text-slate-300 text-sm mt-1">{room.location.city}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default RoomSlider;