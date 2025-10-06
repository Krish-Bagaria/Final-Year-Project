import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterBarProps {
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

const FilterBar = ({ onFiltersChange, className = "" }: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const amenities = [
    'Parking', 'Lift', 'Security', 'Power Backup', 'Garden', 
    'Swimming Pool', 'Gym', 'Club House', 'WiFi', 'AC'
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedAmenities([]);
    setSelectedFilters([]);
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter size={20} />
          <span className="font-semibold">Filters</span>
          {selectedFilters.length > 0 && (
            <Badge variant="secondary">{selectedFilters.length}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-2">
                {filter}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="p-4 space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: ₹{priceRange[0]}L - ₹{priceRange[1]}L
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="text-sm font-medium mb-3 block">Property Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-sm font-medium mb-3 block">Bedrooms</label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4+'].map((room) => (
                  <button
                    key={room}
                    className="filter-button text-center"
                  >
                    {room} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="text-sm font-medium mb-3 block">Furnishing</label>
              <div className="grid grid-cols-3 gap-2">
                {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((type) => (
                  <button
                    key={type}
                    className="filter-button text-center text-xs"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">Area (sq ft)</label>
              <div className="grid grid-cols-2 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Min</SelectItem>
                    <SelectItem value="500">500 sq ft</SelectItem>
                    <SelectItem value="1000">1000 sq ft</SelectItem>
                    <SelectItem value="1500">1500 sq ft</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">No Max</SelectItem>
                    <SelectItem value="1000">1000 sq ft</SelectItem>
                    <SelectItem value="2000">2000 sq ft</SelectItem>
                    <SelectItem value="3000">3000 sq ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-medium mb-3 block">Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button className="w-full btn-hero">
              Apply Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterBar;