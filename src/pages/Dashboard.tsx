import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { 
  Users, 
  Zap, 
  Target, 
  Trophy, 
  Calendar, 
  Clock, 
  Star,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';

const userStats = {
  name: 'Alex Rodriguez',
  avatar: '/placeholder-avatar.jpg',
  level: 42,
  xp: 12450,
  nextLevelXp: 15000,
  hackathonsJoined: 28,
  teamsFormed: 15,
  projectsCompleted: 23,
  rank: 'Elite Hacker'
};

const skills = [
  { name: 'React', level: 95, color: 'neon-cyan' },
  { name: 'Node.js', level: 88, color: 'neon-lime' },
  { name: 'Python', level: 92, color: 'neon-purple' },
  { name: 'TypeScript', level: 85, color: 'neon-magenta' },
  { name: 'AWS', level: 78, color: 'neon-cyan' },
];

const activeLobbies = [
  {
    id: 1,
    title: 'AI Innovation Challenge',
    participants: 47,
    maxParticipants: 60,
    timeLeft: '2h 30m',
    difficulty: 'Advanced',
    prize: '$50,000',
    tags: ['AI', 'Machine Learning', 'Python']
  },
  {
    id: 2,
    title: 'Web3 DeFi Builder',
    participants: 32,
    maxParticipants: 40,
    timeLeft: '5h 15m',
    difficulty: 'Expert',
    prize: '$25,000',
    tags: ['Blockchain', 'Solidity', 'React']
  },
  {
    id: 3,
    title: 'Mobile Game Jam',
    participants: 28,
    maxParticipants: 50,
    timeLeft: '1d 3h',
    difficulty: 'Intermediate',
    prize: '$15,000',
    tags: ['Unity', 'C#', 'Game Design']
  }
];

const recentAchievements = [
  { title: 'Team Player', description: 'Formed 10 successful teams', icon: Users },
  { title: 'Speed Demon', description: 'Completed challenge in under 2 hours', icon: Zap },
  { title: 'Innovation Master', description: 'Won 3 hackathons this month', icon: Trophy },
];

const upcomingEvents = [
  { title: 'Global AI Summit Hackathon', date: '2024-02-15', participants: 500 },
  { title: 'Crypto & Blockchain Challenge', date: '2024-02-22', participants: 300 },
  { title: 'Green Tech Innovation', date: '2024-03-01', participants: 200 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard variant="glow" className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-orbitron font-bold">
                    AR
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-xs font-bold text-background">
                    {userStats.level}
                  </div>
                </div>
                <div>
                  <h1 className="font-orbitron font-bold text-3xl text-foreground mb-2">
                    Welcome back, {userStats.name}!
                  </h1>
                  <p className="text-muted-foreground mb-3">
                    {userStats.rank} • Level {userStats.level}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      <Star className="w-3 h-3 mr-1" />
                      {userStats.xp.toLocaleString()} XP
                    </Badge>
                    <Badge variant="outline" className="border-neon-lime/30 text-neon-lime">
                      <Trophy className="w-3 h-3 mr-1" />
                      Rank #127
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="hero" size="lg" className="group">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Join New Hackathon
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="p-6 text-center">
                  <Users className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                  <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                    {userStats.hackathonsJoined}
                  </div>
                  <div className="text-sm text-muted-foreground">Hackathons Joined</div>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <Target className="w-8 h-8 text-neon-lime mx-auto mb-3" />
                  <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                    {userStats.teamsFormed}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams Formed</div>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-neon-magenta mx-auto mb-3" />
                  <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                    {userStats.projectsCompleted}
                  </div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </GlassCard>
              </div>
            </motion.div>

            {/* Active Lobbies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-foreground">Active Lobbies</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {activeLobbies.map((lobby, index) => (
                  <motion.div
                    key={lobby.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <GlassCard variant="interactive" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-orbitron font-semibold text-lg text-foreground mb-2">
                            {lobby.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {lobby.participants}/{lobby.maxParticipants}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {lobby.timeLeft}
                            </span>
                            <Badge variant="outline" className="border-success/30 text-success">
                              {lobby.difficulty}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {lobby.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-orbitron font-bold text-neon-cyan mb-2">
                            {lobby.prize}
                          </div>
                          <Button variant="neon" size="sm">
                            Join Lobby
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(lobby.participants / lobby.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Skill Levels
                </h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className={`bg-neon-cyan h-2 rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </GlassCard>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20"
                    >
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <achievement.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-3 rounded-lg border border-glass-border"
                    >
                      <div className="font-semibold text-foreground text-sm mb-1">
                        {event.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.participants}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Events
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}