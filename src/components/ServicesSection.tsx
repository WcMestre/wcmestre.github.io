
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  Shield, 
  Server, 
  Headphones, 
  Database, 
  Network,
  Monitor,
  Settings
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable cloud solutions with AWS, Azure, and Google Cloud platforms for optimal performance and cost efficiency.",
      features: ["Migration Services", "Multi-Cloud Strategy", "Cost Optimization"]
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions protecting your business from threats with advanced monitoring and response.",
      features: ["Threat Detection", "Compliance Management", "Security Audits"]
    },
    {
      icon: Server,
      title: "Infrastructure Management",
      description: "Complete server and network infrastructure management ensuring reliability and peak performance.",
      features: ["Server Monitoring", "Performance Tuning", "Disaster Recovery"]
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock technical support from certified professionals ensuring minimal downtime.",
      features: ["Instant Response", "Remote Assistance", "On-site Support"]
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Advanced data backup, recovery, and analytics solutions to protect and leverage your business data.",
      features: ["Automated Backups", "Data Analytics", "Compliance Ready"]
    },
    {
      icon: Network,
      title: "Network Solutions",
      description: "Robust networking infrastructure design and management for seamless connectivity and security.",
      features: ["Network Design", "WiFi Solutions", "VPN Setup"]
    },
    {
      icon: Monitor,
      title: "System Monitoring",
      description: "Proactive monitoring and maintenance of all IT systems to prevent issues before they impact business.",
      features: ["Real-time Alerts", "Performance Metrics", "Predictive Analytics"]
    },
    {
      icon: Settings,
      title: "IT Consulting",
      description: "Strategic IT consulting to align technology with business goals and drive digital transformation.",
      features: ["Technology Roadmap", "Digital Strategy", "Process Optimization"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Comprehensive 
            <span className="text-transparent bg-gradient-to-r from-magenta-400 to-magenta-600 bg-clip-text">
              {" "}IT Services
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From cloud infrastructure to cybersecurity, we provide end-to-end IT solutions 
            that scale with your business and keep you ahead of the competition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="bg-gray-800/50 border-gray-700 hover:border-magenta-600/50 transition-all duration-300 group hover:scale-105"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-magenta-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-magenta-600/30 transition-colors">
                    <Icon className="h-6 w-6 text-magenta-400" />
                  </div>
                  <CardTitle className="text-white text-lg group-hover:text-magenta-300 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-magenta-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
