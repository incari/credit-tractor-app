
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Bell, 
  Gift, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const benefits = [
    "📧 Updates on new features and improvements",
    "🔧 Deployment guides and best practices", 
    "📊 Financial management tips and insights",
    "🎁 Early access to premium features",
    "💡 Integration tutorials and workflows",
    "🌍 Community showcases and use cases"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-6">
            <Gift className="w-4 h-4 mr-2" />
            Stay Updated
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get the Latest Credit Tractor Updates
          </h2>
          
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of smart money managers. Get notified about new features, 
            deployment guides, and financial management tips delivered to your inbox.
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-gray-900 hover:bg-white/90 font-medium px-8"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-3">
                Free forever. Unsubscribe anytime. No spam, we promise.
              </p>
            </form>
          ) : (
            <div className="mb-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thanks for subscribing!</h3>
              <p className="text-white/80">
                You'll receive updates about Credit Tractor and helpful financial tips.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                <span className="text-white/90 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Bell className="w-8 h-8 text-white/70 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Feature Updates</h4>
                <p className="text-white/70 text-sm">
                  Be the first to know about new features and improvements
                </p>
              </div>
              <div>
                <Gift className="w-8 h-8 text-white/70 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Exclusive Content</h4>
                <p className="text-white/70 text-sm">
                  Access to tutorials, guides, and financial management tips
                </p>
              </div>
              <div>
                <Mail className="w-8 h-8 text-white/70 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Community</h4>
                <p className="text-white/70 text-sm">
                  Connect with other users and share your success stories
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-4">
              Ready to start managing your credit payments like a pro?
            </p>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
              Try Credit Tractor Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
