
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Phone, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-magenta-900/20 to-magenta-800/20 border-magenta-600/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Ready to Transform
                  <span className="text-transparent bg-gradient-to-r from-magenta-400 to-magenta-600 bg-clip-text">
                    {" "}Your IT?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join hundreds of enterprises who have already transformed their IT operations 
                  with our comprehensive outsourcing solutions.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-12">
                  <div className="flex items-center justify-center space-x-2 text-magenta-300">
                    <CheckCircle className="h-5 w-5" />
                    <span>Free Consultation</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-magenta-300">
                    <CheckCircle className="h-5 w-5" />
                    <span>Custom Solutions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-magenta-300">
                    <CheckCircle className="h-5 w-5" />
                    <span>No Long-term Contracts</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-magenta-600 hover:bg-magenta-700 text-white px-8 py-4 text-lg group animate-pulse-glow"
                  >
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-magenta-600 text-magenta-400 hover:bg-magenta-900/30 px-8 py-4 text-lg"
                  >
                    Download Case Studies
                  </Button>
                </div>

                <div className="pt-8 border-t border-magenta-800/30">
                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Phone className="h-5 w-5 text-magenta-400" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Mail className="h-5 w-5 text-magenta-400" />
                      <span>enterprise@techpro.com</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    Average response time: 15 minutes during business hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
