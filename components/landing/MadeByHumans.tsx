
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  Code,
  Coffee,
  Users,
  Github,
  ExternalLink
} from "lucide-react";

const MadeByHumans = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-red-100 text-red-700 mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Made with Love
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built by Developers, for Everyone
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Credit Tractor is an open-source project created with passion for helping people 
            take control of their financial lives. Join our community and contribute to making 
            financial management accessible to everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Project info */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Open Source & Free
                </h3>
                <p className="text-gray-600">
                  Credit Tractor is completely open source and free to use. You can run it locally, 
                  modify it for your needs, or contribute to its development.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  Built with feedback from real users managing their credit card payments. 
                  Every feature is designed to solve actual problems people face.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Coffee className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Continuously Improved
                </h3>
                <p className="text-gray-600">
                  We're constantly adding new features, fixing bugs, and improving the user experience 
                  based on community feedback and real-world usage.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - CTA */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Join Our Mission
              </h3>
              <p className="text-gray-600">
                Help us make financial management accessible to everyone, everywhere.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                <Github className="mr-2 h-4 w-4" />
                Contribute on GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-xs text-gray-600">Contributors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-xs text-gray-600">GitHub Stars</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-xs text-gray-600">Forks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Take Control of Your Credit Payments?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Join thousands of users who have already simplified their credit card payment tracking 
            with Credit Tractor. Start your journey to financial freedom today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="px-8 py-3">
              <ExternalLink className="mr-2 h-5 w-5" />
              Try Live Demo
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-white border-white hover:bg-white hover:text-gray-900">
              <Github className="mr-2 h-5 w-5" />
              View Source Code
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MadeByHumans;
