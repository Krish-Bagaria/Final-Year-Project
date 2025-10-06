import { motion } from 'framer-motion';
import { 
  Home, TrendingUp, Eye, Users, Plus, Edit, Trash2, 
  MoreVertical, Calendar, DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DashboardChart from '@/components/DashboardChart';
import { dummyProperties, dashboardData } from '@/data/dummyProperties';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const userProperties = dummyProperties.slice(0, 4); // Mock user properties

  const stats = [
    {
      title: 'Total Properties',
      value: '12',
      change: '+2 this month',
      icon: Home,
      color: 'text-primary'
    },
    {
      title: 'Total Views',
      value: '1,247',
      change: '+18% from last month',
      icon: Eye,
      color: 'text-success'
    },
    {
      title: 'Inquiries',
      value: '94',
      change: '+12% from last month',
      icon: Users,
      color: 'text-warning'
    },
    {
      title: 'Revenue',
      value: '₹2.1L',
      change: '+25% from last month',
      icon: DollarSign,
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and track performance</p>
          </div>
          <Link to="/sell">
            <Button className="btn-hero">
              <Plus size={16} className="mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DashboardChart
              data={dashboardData.inquiries}
              type="line"
              title="Inquiries Trend"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <DashboardChart
              data={dashboardData.propertyViews}
              type="bar"
              title="Property Views"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Types Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DashboardChart
              data={dashboardData.propertyTypes}
              type="pie"
              title="Property Distribution"
            />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'New inquiry received',
                      property: 'Vaishali Nagar Flat',
                      time: '2 hours ago',
                      type: 'inquiry'
                    },
                    {
                      action: 'Property viewed',
                      property: 'Malviya Nagar Villa',
                      time: '4 hours ago',
                      type: 'view'
                    },
                    {
                      action: 'Property featured',
                      property: 'C-Scheme Office',
                      time: '1 day ago',
                      type: 'featured'
                    },
                    {
                      action: 'Price updated',
                      property: 'Mansarovar Plot',
                      time: '2 days ago',
                      type: 'update'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'inquiry' ? 'bg-primary' :
                          activity.type === 'view' ? 'bg-success' :
                          activity.type === 'featured' ? 'bg-warning' :
                          'bg-muted-foreground'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.property}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Properties Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Listed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-sm text-muted-foreground">{property.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{property.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{property.price}</TableCell>
                      <TableCell>
                        <Badge className={property.featured ? 'bg-success' : 'bg-warning'}>
                          {property.featured ? 'Active' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.views}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          Jan 15, 2024
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye size={14} className="mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;