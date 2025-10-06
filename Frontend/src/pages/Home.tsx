import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import Testimonials from '@/components/Testimonials';
import { dummyProperties } from '@/data/dummyProperties';

const Home = () => {
  const featuredProperties = dummyProperties.filter(property => property.featured);
  const trendingProperties = dummyProperties.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <img
          src="/assets/jaipur-hero.jpg"
          alt="Jaipur Skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <TrendingUp size={14} className="mr-2" />
              #1 Real Estate Platform in Jaipur
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find your next property
              <br />
              <span className="text-primary-light">in Jaipur</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Verified listings with AI-powered insights for smart property investments
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/search">
                <Button size="lg" className="btn-hero text-lg px-8 py-4">
                  Buy Property
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="btn-secondary-hero text-lg px-8 py-4">
                  Sell Property
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Properties Listed' },
              { number: '2500+', label: 'Happy Customers' },
              { number: '500+', label: 'Properties Sold' },
              { number: '98%', label: 'Customer Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h3 className="text-3xl font-bold text-primary">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Award size={14} className="mr-2" />
              Featured Properties
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Premium Listings</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium properties with verified details and competitive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Properties</h2>
              <p className="text-muted-foreground">Most viewed properties this week</p>
            </div>
            <Link to="/search">
              <Button variant="outline">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose JaipurEstate?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the most reliable and comprehensive real estate experience in Jaipur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                description: 'All properties are verified for authenticity and legal compliance'
              },
              {
                icon: TrendingUp,
                title: 'AI-Powered Insights',
                description: 'Get market trends and price predictions powered by AI technology'
              },
              {
                icon: Award,
                title: 'Expert Support',
                description: '24/7 customer support from real estate experts in Jaipur'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-card rounded-lg border border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;