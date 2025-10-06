// Dummy property data for JaipurEstate
export const dummyProperties = [
  {
    id: 1,
    title: "3 BHK Luxury Flat in Vaishali Nagar",
    price: "₹75L",
    priceValue: 7500000,
    location: "Vaishali Nagar, Jaipur",
    type: "Flat",
    area: "1450 sq ft",
    bedrooms: 3,
    bathrooms: 2,
    furnishing: "Semi-Furnished",
    image: "/assets/property1.jpg",
    featured: true,
    verified: true,
    description: "Spacious 3 BHK flat with modern amenities in prime Vaishali Nagar location. Well-connected to metro and major IT hubs.",
    amenities: ["Parking", "Lift", "Security", "Power Backup", "Garden"],
    seller: {
      name: "Rajesh Sharma",
      phone: "+91 98765 43210",
      verified: true
    },
    priceHistory: [
      { month: "Jan", price: 70 },
      { month: "Feb", price: 71 },
      { month: "Mar", price: 73 },
      { month: "Apr", price: 75 },
      { month: "May", price: 75 },
    ],
    areaPrice: {
      min: 5200,
      max: 5800,
      avg: 5517
    },
    rating: 4.5,
    views: 245
  },
  {
    id: 2,
    title: "Residential Plot near Metro Station",
    price: "₹45L",
    priceValue: 4500000,
    location: "Mansarovar, Jaipur",
    type: "Plot",
    area: "180 sq yd",
    bedrooms: null,
    bathrooms: null,
    furnishing: null,
    image: "/assets/property2.jpg",
    featured: false,
    verified: true,
    description: "Prime residential plot near metro station with clear title. Perfect for investment or building your dream home.",
    amenities: ["Road Access", "Electricity", "Water Connection", "Clear Title"],
    seller: {
      name: "Priya Gupta",
      phone: "+91 87654 32109",
      verified: true
    },
    priceHistory: [
      { month: "Jan", price: 42 },
      { month: "Feb", price: 43 },
      { month: "Mar", price: 44 },
      { month: "Apr", price: 45 },
      { month: "May", price: 45 },
    ],
    areaPrice: {
      min: 2200,
      max: 2800,
      avg: 2500
    },
    rating: 4.2,
    views: 189
  },
  {
    id: 3,
    title: "4 BHK Villa in Malviya Nagar",
    price: "₹1.2Cr",
    priceValue: 12000000,
    location: "Malviya Nagar, Jaipur",
    type: "Villa",
    area: "2500 sq ft",
    bedrooms: 4,
    bathrooms: 4,
    furnishing: "Fully Furnished",
    image: "/assets/property3.jpg",
    featured: true,
    verified: true,
    description: "Luxury 4 BHK villa with garden, swimming pool, and modern interiors. Premium location with excellent connectivity.",
    amenities: ["Swimming Pool", "Garden", "Parking", "Security", "Gym", "Club House"],
    seller: {
      name: "Amit Jain",
      phone: "+91 76543 21098",
      verified: true
    },
    priceHistory: [
      { month: "Jan", price: 115 },
      { month: "Feb", price: 117 },
      { month: "Mar", price: 119 },
      { month: "Apr", price: 120 },
      { month: "May", price: 120 },
    ],
    areaPrice: {
      min: 4500,
      max: 5200,
      avg: 4800
    },
    rating: 4.8,
    views: 356
  },
  {
    id: 4,
    title: "2 BHK Flat in Shyam Nagar",
    price: "₹35L",
    priceValue: 3500000,
    location: "Shyam Nagar, Jaipur",
    type: "Flat",
    area: "850 sq ft",
    bedrooms: 2,
    bathrooms: 2,
    furnishing: "Unfurnished",
    image: "/assets/property4.jpg",
    featured: false,
    verified: false,
    description: "Affordable 2 BHK flat in developing area. Good investment opportunity with growth potential.",
    amenities: ["Parking", "Lift", "Power Backup"],
    seller: {
      name: "Sunita Verma",
      phone: "+91 65432 10987",
      verified: false
    },
    priceHistory: [
      { month: "Jan", price: 33 },
      { month: "Feb", price: 34 },
      { month: "Mar", price: 34 },
      { month: "Apr", price: 35 },
      { month: "May", price: 35 },
    ],
    areaPrice: {
      min: 3800,
      max: 4400,
      avg: 4118
    },
    rating: 3.9,
    views: 123
  },
  {
    id: 5,
    title: "Commercial Space in C-Scheme",
    price: "₹2.5Cr",
    priceValue: 25000000,
    location: "C-Scheme, Jaipur",
    type: "Commercial",
    area: "1200 sq ft",
    bedrooms: null,
    bathrooms: 2,
    furnishing: "Semi-Furnished",
    image: "/assets/property5.jpg",
    featured: true,
    verified: true,
    description: "Prime commercial space in heart of Jaipur. Perfect for offices, showrooms, or retail business.",
    amenities: ["Parking", "Lift", "Security", "Power Backup", "AC"],
    seller: {
      name: "Ravi Agarwal",
      phone: "+91 54321 09876",
      verified: true
    },
    priceHistory: [
      { month: "Jan", price: 240 },
      { month: "Feb", price: 245 },
      { month: "Mar", price: 248 },
      { month: "Apr", price: 250 },
      { month: "May", price: 250 },
    ],
    areaPrice: {
      min: 18000,
      max: 22000,
      avg: 20833
    },
    rating: 4.6,
    views: 412
  },
  {
    id: 6,
    title: "1 BHK Studio Apartment",
    price: "₹25L",
    priceValue: 2500000,
    location: "Jagatpura, Jaipur",
    type: "Flat",
    area: "500 sq ft",
    bedrooms: 1,
    bathrooms: 1,
    furnishing: "Fully Furnished",
    image: "/assets/property6.jpg",
    featured: false,
    verified: true,
    description: "Compact studio apartment perfect for young professionals. All modern amenities included.",
    amenities: ["Parking", "Gym", "WiFi", "Security"],
    seller: {
      name: "Neha Joshi",
      phone: "+91 43210 98765",
      verified: true
    },
    priceHistory: [
      { month: "Jan", price: 23 },
      { month: "Feb", price: 24 },
      { month: "Mar", price: 24 },
      { month: "Apr", price: 25 },
      { month: "May", price: 25 },
    ],
    areaPrice: {
      min: 4800,
      max: 5400,
      avg: 5000
    },
    rating: 4.1,
    views: 167
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    rating: 5,
    comment: "Found my dream home through JaipurEstate. Excellent service and verified listings!",
    location: "Vaishali Nagar",
    image: "/assets/user1.jpg"
  },
  {
    id: 2,
    name: "Priya Mehta", 
    rating: 5,
    comment: "The AI-powered price insights helped me make the right investment decision.",
    location: "Malviya Nagar",
    image: "/assets/user2.jpg"
  },
  {
    id: 3,
    name: "Karan Singh",
    rating: 4,
    comment: "Great platform with genuine listings. The support team was very helpful.",
    location: "C-Scheme",
    image: "/assets/user3.jpg"
  }
];

export const dashboardData = {
  inquiries: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 25 },
    { month: 'May', count: 22 },
  ],
  propertyViews: [
    { property: 'Vaishali Flat', views: 245 },
    { property: 'Malviya Villa', views: 356 },
    { property: 'C-Scheme Office', views: 412 },
    { property: 'Mansarovar Plot', views: 189 },
  ],
  propertyTypes: [
    { name: 'Flats', value: 40, color: '#e91e63' },
    { name: 'Plots', value: 25, color: '#2196f3' },
    { name: 'Villas', value: 20, color: '#4caf50' },
    { name: 'Commercial', value: 15, color: '#ff9800' },
  ]
};