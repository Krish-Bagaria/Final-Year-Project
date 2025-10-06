import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Share2, Heart, Phone, MessageCircle, MapPin, 
  Bed, Bath, Square, Calendar, Shield, Award, Star,
  TrendingUp, Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Carousel from '@/components/Carousel';
import PropertyCard from '@/components/PropertyCard';
import { dummyProperties } from '@/data/dummyProperties';

const PropertyDetails = () => {
  const { id } = useParams();
  const property = dummyProperties.find(p => p.id === parseInt(id!));
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const similarProperties = dummyProperties
    .filter(p => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  const propertyImages = [
    property.image,
    '/assets/property-interior-1.jpg',
    '/assets/property-interior-2.jpg',
    '/assets/property-exterior.jpg'
  ];

  // Sample area price comparison data
  const areaPriceData = [
    { area: 'Vaishali Nagar', avgPrice: 5517, thisProperty: property.areaPrice?.avg || 5000 },
    { area: 'Malviya Nagar', avgPrice: 4800, thisProperty: property.areaPrice?.avg || 5000 },
    { area: 'Mansarovar', avgPrice: 2500, thisProperty: property.areaPrice?.avg || 5000 },
    { area: 'C-Scheme', avgPrice: 20833, thisProperty: property.areaPrice?.avg || 5000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/search">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  size={16} 
                  className={`mr-2 ${isWishlisted ? 'fill-primary text-primary' : ''}`} 
                />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <Carousel 
                  images={propertyImages} 
                  className="h-96"
                  autoPlay={false}
                />
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {property.featured && (
                        <Badge className="bg-warning text-warning-foreground">
                          Featured
                        </Badge>
                      )}
                      {property.verified && (
                        <Badge className="bg-success text-success-foreground">
                          <Shield size={12} className="mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {property.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{property.areaPrice?.avg}/sq ft
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
                  {property.bedrooms && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{property.bedrooms} BHK</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.area}</div>
                    <div className="text-sm text-muted-foreground">Area</div>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div className="pt-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Price Analysis & Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Price History</TabsTrigger>
                    <TabsTrigger value="comparison">Area Comparison</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history" className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={property.priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                            formatter={(value) => [`₹${value}L`, 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-success">+₹5L</div>
                        <div className="text-sm text-muted-foreground">Price Increase (5 months)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">7.1%</div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">₹{property.areaPrice?.avg}</div>
                        <div className="text-sm text-muted-foreground">Per sq ft</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comparison" className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={areaPriceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="area" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                            formatter={(value) => [`₹${value}/sq ft`, 'Average Price']}
                          />
                          <Bar dataKey="avgPrice" fill="hsl(var(--muted))" name="Area Average" />
                          <Bar dataKey="thisProperty" fill="hsl(var(--primary))" name="This Property" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-primary" />
                        <span className="font-medium">Price Insights</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This property is priced {property.areaPrice?.avg && property.areaPrice.avg > 5000 ? 'above' : 'competitively within'} the area average. 
                        The location offers good investment potential with steady price appreciation.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {property.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{property.seller.name}</div>
                    <div className="flex items-center gap-1">
                      {property.seller.verified && (
                        <>
                          <Shield size={12} className="text-success" />
                          <span className="text-sm text-success">Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full btn-hero">
                    <Phone size={16} className="mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle size={16} className="mr-2" />
                    Chat with Seller
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  By contacting, you agree to our Terms & Privacy Policy
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-semibold">{property.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-semibold">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property ID</span>
                  <span className="font-semibold">JP{property.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Furnishing</span>
                  <span className="font-semibold">{property.furnishing || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* EMI Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>EMI Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹45,678</div>
                  <div className="text-sm text-muted-foreground">Monthly EMI</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span>₹60L (80%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span>8.5% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenure:</span>
                    <span>20 years</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  Get Pre-approved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((prop) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;