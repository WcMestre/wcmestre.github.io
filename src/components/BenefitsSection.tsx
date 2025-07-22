
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Zap, 
  Target 
} from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Cost Reduction",
      percentage: "40%",
      description: "Average cost savings on IT operations",
      details: "Reduce overhead costs by outsourcing IT infrastructure management and support to our expert team."
    },
    {
      icon: TrendingUp,
      title: "Increased Efficiency",
      percentage: "60%",
      description: "Improvement in system performance",
      details: "Streamlined processes and optimized systems lead to significant productivity gains across your organization."
    },
    {
      icon: Clock,
      title: "Faster Response Time",
      percentage: "24/7",
      description: "Round-the-clock monitoring and support",
      details: "Immediate response to critical issues with our dedicated support team available at all times."
    },
    {
      icon: Users,
      title: "Expert Team Access",
      percentage: "100+",
      description: "Certified IT professionals",
      details: "Access to a diverse team of specialists without the overhead of full-time hiring and training."
    },
    {
      icon: Zap,
      title: "Scalability",
      percentage: "∞",
      description: "Unlimited growth potential",
      details: "Scale your IT infrastructure up or down based on business needs without capital investment."
    },
    {
      icon: Target,
      title: "Focus on Core Business",
      percentage: "100%",
      description: "Concentrate on growth",
      details: "Let us handle IT complexities while you focus on strategic business initiatives and growth."
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose 
            <span className="text-transparent bg-gradient-to-r from-magenta-400 to-magenta-600 bg-clip-text">
              {" "}Outsourcing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the strategic advantages of partnering with TechPro Enterprise 
            for your IT infrastructure and operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-magenta-600/50 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-magenta-600/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-magenta-600/30 transition-colors">
                      <Icon className="h-8 w-8 text-magenta-400" />
                    </div>
                    
                    <div className="text-4xl font-bold text-magenta-500 group-hover:text-magenta-400 transition-colors">
                      {benefit.percentage}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white group-hover:text-magenta-300 transition-colors">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-magenta-400 font-medium">
                      {benefit.description}
                    </p>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {benefit.details}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-magenta-900/20 to-magenta-800/20 rounded-2xl p-8 border border-magenta-700/30">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-magenta-400">Companies Trust Us</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-magenta-400">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-magenta-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-magenta-400">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
