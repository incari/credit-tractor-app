
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Financial Advisor",
      company: "WealthPlan Solutions",
      content: "Credit Tractor has revolutionized how I help my clients track their credit card payments. The multi-currency support and detailed analytics make it perfect for international clients.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Miguel Rodriguez",
      role: "Small Business Owner",
      company: "Rodriguez Consulting",
      content: "As someone who manages multiple business credit cards, Credit Tractor's payment scheduling and tracking features have saved me countless hours and prevented missed payments.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Emma Thompson",
      role: "Personal Finance Blogger",
      company: "Smart Money Moves",
      content: "I've recommended Credit Tractor to thousands of my readers. The fact that it runs locally and doesn't send data to servers makes it perfect for privacy-conscious users.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "David Kim",
      role: "Software Developer",
      company: "Tech Startup",
      content: "The Docker deployment option made it easy to set up for our team. The TypeScript codebase is clean and well-documented - exactly what I'd expect from a professional tool.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Lisa Anderson",
      role: "Budget Coach",
      company: "Financial Freedom Academy",
      content: "The multi-language support has been a game-changer for my diverse client base. Credit Tractor works seamlessly in Spanish and French, making it accessible to all my clients.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Robert Wilson",
      role: "Retired Professional",
      company: "Personal User",
      content: "At 65, I was skeptical about using a web app for my finances. But Credit Tractor's intuitive interface and local storage convinced me. It's exactly what I needed.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-yellow-100 text-yellow-700 mb-4">
            User Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Finance Professionals & Individuals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See what users are saying about Credit Tractor and how it's helping them 
            take control of their credit card payments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-green-500 opacity-50" />
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <div className="flex items-center justify-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm">Based on user reviews and feedback</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
