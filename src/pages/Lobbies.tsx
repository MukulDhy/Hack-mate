import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect } from '@/components/ui/filter-select';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Trophy, 
  Zap,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchHackathons, setFilters } from '@/store/slices/hackathonSlice';
import { Hackathon, HackathonStatus } from '@/types/hackathon';

// Categories based on tags
const lobbyCategories = [
  { name: 'All', count: 0, active: true },
  { name: 'AI/ML', count: 0, active: false },
  { name: 'Web3', count: 0, active: false },
  { name: 'Mobile', count: 0, active: false },
  { name: 'Game Dev', count: 0, active: false },
  { name: 'IoT', count: 0, active: false },
];

const difficultyOptions = [
  { value: 'Beginner', label: 'Beginner', count: 0 },
  { value: 'Intermediate', label: 'Intermediate', count: 0 },
  { value: 'Advanced', label: 'Advanced', count: 0 },
  { value: 'Expert', label: 'Expert', count: 0 }
];

const typeOptions = [
  { value: 'online', label: 'Virtual', count: 0 },
  { value: 'offline', label: 'In-Person', count: 0 },
  { value: 'hybrid', label: 'Hybrid', count: 0 }
];

export default function Lobbies() {
  const dispatch = useDispatch<AppDispatch>();
  const { hackathons, loading, error, filters, pagination } = useSelector(
    (state: RootState) => state.hackathons
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch hackathons on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      const filterParams: any = {
        ...filters,
        search: searchTerm || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        mode: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
      };
      
      await dispatch(fetchHackathons(filterParams));
    };

    fetchData();
  }, [dispatch, filters, searchTerm, selectedTags, selectedTypes]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags([category]);
    }
  };

  const getDifficultyColor = (status: HackathonStatus) => {
    switch (status) {
      case 'upcoming': return 'text-success border-success/30';
      case 'registration_open': return 'text-warning border-warning/30';
      case 'ongoing': return 'text-neon-cyan border-neon-cyan/30';
      case 'completed': return 'text-destructive border-destructive/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeLeft = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const calculateProgress = (hackathon: Hackathon) => {
    return (hackathon.totalMembersJoined / hackathon.maxRegistrations) * 100;
  };

  const getStatusText = (status: HackathonStatus) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'registration_open': return 'Registration Open';
      case 'registration_closed': return 'Registration Closed';
      case 'ongoing': return 'Ongoing';
      case 'winner_to_announced': return 'Winner to be Announced';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const loadMore = () => {
    dispatch(setFilters({ page: pagination.currentPage + 1 }));
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground mb-4">
              Active Hackathons
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join skill-based hackathon lobbies and connect with talented developers worldwide
            </p>
          </div>

          {/* Search and Filters */}
          <GlassCard className="p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full md:w-auto">
                  <SearchInput
                    placeholder="Search hackathons, technologies, or hosts..."
                    onSearch={setSearchTerm}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterSelect
                    title="Type"
                    options={typeOptions}
                    selectedValues={selectedTypes}
                    onSelectionChange={setSelectedTypes}
                  />
                </div>
              </div>
              {(selectedTypes.length > 0 || selectedTags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {[...selectedTypes, ...selectedTags].map((filter) => (
                    <Badge key={filter} variant="secondary" className="text-xs">
                      {filter}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {lobbyCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "hero" : "glass"}
                size="sm"
                onClick={() => handleCategoryChange(category.name)}
                className="gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading hackathons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <GlassCard className="p-6 text-center my-8">
            <p className="text-destructive">Error: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => dispatch(fetchHackathons(filters))}
            >
              Try Again
            </Button>
          </GlassCard>
        )}

        {/* Hackathons Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {hackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard 
                    variant="interactive" 
                    className="p-6 h-full relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                          {hackathon.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {hackathon.description}
                        </p>
                      </div>

                      {/* Status and Basic Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline" className={`${getDifficultyColor(hackathon.status)} text-xs`}>
                          {getStatusText(hackathon.status)}
                        </Badge>
                        {hackathon.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hackathon.venue}
                          </span>
                        )}
                        <span>{getTypeIcon(hackathon.mode)} {hackathon.mode}</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-neon-cyan" />
                          <span className="text-foreground font-medium">
                            {hackathon.totalMembersJoined}/{hackathon.maxRegistrations}
                          </span>
                          <span className="text-muted-foreground">participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-neon-magenta" />
                          <span className="text-foreground font-medium">
                            {formatTimeLeft(hackathon.startDate)}
                          </span>
                          <span className="text-muted-foreground">to start</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-neon-lime" />
                          <span className="text-foreground font-medium">
                            {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-warning" />
                          <span className="text-foreground font-medium font-orbitron">
                            ${hackathon.prizes[0]?.amount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(hackathon)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {Math.round(calculateProgress(hackathon))}% filled
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {hackathon.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{hackathon.tags.length - 5}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">
                          Registration until {formatDate(hackathon.registrationDeadline)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="glass" size="sm">
                            View Details
                          </Button>
                          <Button 
                            variant="neon" 
                            size="sm" 
                            className="gap-2"
                            disabled={hackathon.status !== 'registration_open'}
                          >
                            <Zap className="w-4 h-4" />
                            {hackathon.status === 'registration_open' ? 'Join Now' : 'Registration Closed'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {pagination.currentPage < pagination.totalPages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12"
              >
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Hackathons'}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && hackathons.length === 0 && (
          <GlassCard className="p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-orbitron text-xl text-foreground mb-2">No hackathons found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new hackathons.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedTypes([]);
                setSelectedTags([]);
              }}
            >
              Clear Filters
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
}