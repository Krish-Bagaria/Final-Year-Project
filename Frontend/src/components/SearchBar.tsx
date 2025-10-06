import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
}

const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-card rounded-xl shadow-medium border border-border p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Input
              placeholder="Search location in Jaipur..."
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </div>

        {/* Property Type */}
        <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-25">Under ₹25L</SelectItem>
            <SelectItem value="25-50">₹25L - ₹50L</SelectItem>
            <SelectItem value="50-100">₹50L - ₹1Cr</SelectItem>
            <SelectItem value="100+">Above ₹1Cr</SelectItem>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1 BHK</SelectItem>
            <SelectItem value="2">2 BHK</SelectItem>
            <SelectItem value="3">3 BHK</SelectItem>
            <SelectItem value="4+">4+ BHK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleSearch}
          className="btn-hero px-8 py-3 text-base"
        >
          <Search size={20} className="mr-2" />
          Search Properties
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {['Plots under ₹50L', 'Near Metro', 'Ready to Move', 'Verified Only'].map((filter) => (
          <button
            key={filter}
            className="filter-button text-sm"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;