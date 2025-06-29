import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Tractor } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Tractor className="w-4 h-4 mr-2" />
                Payment Tracking Made Simple
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Take Control of Your
                <span className="text-green-600 block">Credit Payments</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Credit Tractor helps you track credit card payments, manage
                payment plans, and visualize your financial progress with
                powerful analytics and multi-currency support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Try Live Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Free to use locally
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                35+ currencies supported
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                PWA enabled
              </div>
            </div>
          </div>

          {/* Right side - App preview */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tractor className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      Credit Tractor
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      $2,450
                    </div>
                    <div className="text-sm text-gray-600">Total Remaining</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      $780
                    </div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Visa ****1234</div>
                      <div className="text-sm text-gray-600">Next: Dec 15</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$245</div>
                      <div className="text-xs text-green-600">On track</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Master ****5678</div>
                      <div className="text-sm text-gray-600">Next: Dec 20</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$180</div>
                      <div className="text-xs text-green-600">On track</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
              <Tractor className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
