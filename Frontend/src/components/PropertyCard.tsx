import { Heart, Share2, MapPin, Bed, Bath, Square, Star, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    location: string;
    type: string;
    area: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    image: string;
    featured: boolean;
    verified: boolean;
    rating: number;
    views: number;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // Share functionality
    navigator.share?.({
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: `/property/${property.id}`
    });
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="property-card group">
        <div className="relative overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title}
            className="property-card-image"
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
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

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-background/80 hover:bg-background"
              onClick={handleWishlist}
            >
              <Heart 
                size={14} 
                className={isWishlisted ? 'fill-primary text-primary' : ''} 
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-background/80 hover:bg-background"
              onClick={handleShare}
            >
              <Share2 size={14} />
            </Button>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
              {property.price}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin size={14} className="mr-1" />
              {property.location}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed size={14} />
                  <span>{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath size={14} />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Square size={14} />
                <span>{property.area}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-warning fill-warning" />
              <span className="text-sm font-medium">{property.rating}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {property.views} views
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;