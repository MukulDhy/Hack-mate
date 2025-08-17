import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect } from '@/components/ui/filter-select';
import { Input } from '@/components/ui/input';
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
import { useState } from 'react';

const lobbyCategories = [
  { name: 'All', count: 156, active: true },
  { name: 'AI/ML', count: 42, active: false },
  { name: 'Web3', count: 28, active: false },
  { name: 'Mobile', count: 35, active: false },
  { name: 'Game Dev', count: 23, active: false },
  { name: 'IoT', count: 18, active: false },
];

const lobbies = [
  {
    id: 1,
    title: 'AI-Powered Healthcare Solutions',
    description: 'Build innovative AI solutions to revolutionize healthcare delivery and patient outcomes.',
    host: 'TechCorp Innovations',
    participants: 45,
    maxParticipants: 60,
    timeLeft: '2h 30m',
    startDate: '2024-02-15',
    duration: '48 hours',
    difficulty: 'Advanced',
    prize: '$50,000',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    tags: ['AI', 'Healthcare', 'Python', 'TensorFlow'],
    featured: true,
    skills: ['Machine Learning', 'Data Science', 'Backend Development']
  },
  {
    id: 2,
    title: 'DeFi Protocol Innovation',
    description: 'Create the next generation of decentralized finance protocols and tools.',
    host: 'Blockchain Alliance',
    participants: 32,
    maxParticipants: 40,
    timeLeft: '5h 15m',
    startDate: '2024-02-16',
    duration: '72 hours',
    difficulty: 'Expert',
    prize: '$25,000',
    location: 'Remote',
    type: 'Virtual',
    tags: ['Blockchain', 'Solidity', 'React', 'Web3'],
    featured: false,
    skills: ['Smart Contracts', 'Frontend Development', 'Financial Systems']
  },
  {
    id: 3,
    title: 'Mobile Game Development Jam',
    description: 'Design and build engaging mobile games that push the boundaries of creativity.',
    host: 'GameDev Studios',
    participants: 28,
    maxParticipants: 50,
    timeLeft: '1d 3h',
    startDate: '2024-02-18',
    duration: '36 hours',
    difficulty: 'Intermediate',
    prize: '$15,000',
    location: 'Austin, TX',
    type: 'In-Person',
    tags: ['Unity', 'C#', 'Game Design', 'Mobile'],
    featured: false,
    skills: ['Game Development', 'UI/UX Design', '3D Modeling']
  },
  {
    id: 4,
    title: 'Sustainable Tech Challenge',
    description: 'Develop technology solutions to address climate change and environmental issues.',
    host: 'GreenTech Initiative',
    participants: 38,
    maxParticipants: 55,
    timeLeft: '6h 45m',
    startDate: '2024-02-17',
    duration: '60 hours',
    difficulty: 'Intermediate',
    prize: '$30,000',
    location: 'Seattle, WA',
    type: 'Hybrid',
    tags: ['Sustainability', 'IoT', 'Data Analytics', 'React'],
    featured: true,
    skills: ['Environmental Science', 'IoT Development', 'Data Visualization']
  },
  {
    id: 5,
    title: 'Cybersecurity Innovation Lab',
    description: 'Build cutting-edge security solutions to protect digital infrastructure.',
    host: 'CyberSec Alliance',
    participants: 22,
    maxParticipants: 35,
    timeLeft: '12h 20m',
    startDate: '2024-02-19',
    duration: '48 hours',
    difficulty: 'Expert',
    prize: '$40,000',
    location: 'New York, NY',
    type: 'In-Person',
    tags: ['Security', 'Penetration Testing', 'Network Security', 'Python'],
    featured: false,
    skills: ['Cybersecurity', 'Network Engineering', 'Ethical Hacking']
  },
  {
    id: 6,
    title: 'EdTech Learning Revolution',
    description: 'Transform education through innovative technology and learning platforms.',
    host: 'Education Future',
    participants: 41,
    maxParticipants: 48,
    timeLeft: '8h 10m',
    startDate: '2024-02-20',
    duration: '54 hours',
    difficulty: 'Beginner',
    prize: '$20,000',
    location: 'Remote',
    type: 'Virtual',
    tags: ['Education', 'React', 'Node.js', 'UX Design'],
    featured: false,
    skills: ['Educational Technology', 'Full Stack Development', 'User Research']
  }
];

export default function Lobbies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner', count: 12 },
    { value: 'Intermediate', label: 'Intermediate', count: 18 },
    { value: 'Advanced', label: 'Advanced', count: 15 },
    { value: 'Expert', label: 'Expert', count: 8 }
  ];

  const typeOptions = [
    { value: 'Virtual', label: 'Virtual', count: 25 },
    { value: 'In-Person', label: 'In-Person', count: 18 },
    { value: 'Hybrid', label: 'Hybrid', count: 13 }
  ];

  const skillOptions = [
    { value: 'React', label: 'React', count: 24 },
    { value: 'Python', label: 'Python', count: 32 },
    { value: 'AI', label: 'AI/ML', count: 16 },
    { value: 'Blockchain', label: 'Blockchain', count: 12 },
    { value: 'Mobile', label: 'Mobile', count: 14 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success border-success/30';
      case 'Intermediate': return 'text-warning border-warning/30';
      case 'Advanced': return 'text-neon-cyan border-neon-cyan/30';
      case 'Expert': return 'text-destructive border-destructive/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Virtual': return '🌐';
      case 'In-Person': return '📍';
      case 'Hybrid': return '🔄';
      default: return '📍';
    }
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
              Active Lobbies
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
                    placeholder="Search lobbies, technologies, or hosts..."
                    onSearch={setSearchTerm}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterSelect
                    title="Difficulty"
                    options={difficultyOptions}
                    selectedValues={selectedDifficulties}
                    onSelectionChange={setSelectedDifficulties}
                  />
                  <FilterSelect
                    title="Type"
                    options={typeOptions}
                    selectedValues={selectedTypes}
                    onSelectionChange={setSelectedTypes}
                  />
                  <FilterSelect
                    title="Skills"
                    options={skillOptions}
                    selectedValues={selectedSkills}
                    onSelectionChange={setSelectedSkills}
                  />
                </div>
              </div>
              {(selectedDifficulties.length > 0 || selectedTypes.length > 0 || selectedSkills.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {[...selectedDifficulties, ...selectedTypes, ...selectedSkills].map((filter) => (
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
                onClick={() => setSelectedCategory(category.name)}
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

        {/* Lobbies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {lobbies.map((lobby, index) => (
            <motion.div
              key={lobby.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard 
                variant="interactive" 
                className={`p-6 h-full relative overflow-hidden ${
                  lobby.featured ? 'ring-2 ring-primary/30' : ''
                }`}
              >
                {lobby.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="font-orbitron font-bold text-xl text-foreground mb-2 pr-20">
                      {lobby.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {lobby.description}
                    </p>
                  </div>

                  {/* Host and Basic Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{lobby.host}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {lobby.location}
                    </span>
                    <span>{getTypeIcon(lobby.type)} {lobby.type}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-neon-cyan" />
                      <span className="text-foreground font-medium">
                        {lobby.participants}/{lobby.maxParticipants}
                      </span>
                      <span className="text-muted-foreground">participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-neon-magenta" />
                      <span className="text-foreground font-medium">{lobby.timeLeft}</span>
                      <span className="text-muted-foreground">to start</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-neon-lime" />
                      <span className="text-foreground font-medium">{lobby.duration}</span>
                      <span className="text-muted-foreground">duration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-foreground font-medium font-orbitron">
                        {lobby.prize}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(lobby.participants / lobby.maxParticipants) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {Math.round((lobby.participants / lobby.maxParticipants) * 100)}% filled
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {lobby.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Required Skills */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Recommended Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {lobby.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs border-accent/30 text-accent">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty and Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <Badge variant="outline" className={`${getDifficultyColor(lobby.difficulty)} text-xs`}>
                      {lobby.difficulty}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="glass" size="sm">
                        View Details
                      </Button>
                      <Button variant="neon" size="sm" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Join Lobby
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg">
            Load More Lobbies
          </Button>
        </motion.div>
      </div>
    </div>
  );
}