
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  Github,
  Download,
  Play,
  Globe,
  Code2
} from "lucide-react";

const DetailsSection = () => {
  return (
    <section id="details" className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-700 mb-4">
            Try It Now
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Credit Tractor Today
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ready to take control of your credit card payments? Try our live demo, 
            check out the source code, or deploy your own instance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - CTA Cards */}
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-green-200 bg-green-50/50">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 p-3 rounded-lg text-white">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Live Demo
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Experience the full functionality of Credit Tractor with our live demo. 
                      No installation required.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Try Live Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-blue-200 bg-blue-50/50">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg text-white">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Open Source
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Explore the source code, contribute to the project, or customize it 
                      for your specific needs.
                    </p>
                    <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                      <Github className="mr-2 h-4 w-4" />
                      View Source Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-purple-200 bg-purple-50/50">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 p-3 rounded-lg text-white">
                    <Download className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Self-Host
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Deploy your own instance with Docker, connect to your database, 
                      or use free cloud services.
                    </p>
                    <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
                      <Download className="mr-2 h-4 w-4" />
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right side - App Screenshot/Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="flex-1 text-center">
                    <span className="text-white font-medium">credit-tractor.vercel.app</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold">Payment Dashboard</h4>
                  <Badge className="bg-green-100 text-green-700">Live</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Active Plans</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">$3,240</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">$890</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"></div>
                        <div>
                          <div className="font-medium">Visa ****{1234 + item}</div>
                          <div className="text-sm text-gray-600">Due Dec {15 + item}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${245 + item * 50}</div>
                        <div className="text-xs text-green-600">●  On track</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating action button */}
            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors cursor-pointer">
              <Play className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Perfect for Personal Finance Management
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're managing a few credit cards or tracking complex payment plans, 
              Credit Tractor provides the tools you need to stay organized and debt-free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary">Individual Users</Badge>
              <Badge variant="secondary">Small Businesses</Badge>
              <Badge variant="secondary">Financial Advisors</Badge>
              <Badge variant="secondary">Budget Conscious</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
