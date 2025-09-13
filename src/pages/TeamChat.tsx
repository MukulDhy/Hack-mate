import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import {
  Clock,
  MessageSquare,
  Upload,
  Users,
  Calendar,
  MapPin,
  Target,
  FileText,
  AlertCircle,
  Send,
  Plus,
  DollarSign,
  Check,
  CheckCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { addMessage, updateMessageStatus } from '../slices/teamSlice';
import { changeConnect } from '@/store/slices/websocketSlice';
import { useUser } from '@/store/hooks';
import { webSocketService } from '@/store';

interface HackathonData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  maxTeamSize: number;
  venue: string;
  mode: string;
  registrationFee: number;
  status: string;
  problemStatements: string[];
  submissionFormat: string;
  tags: string[];
  timeLeft: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: string;
  avatar: string;
}

interface TeamData {
  members: TeamMember[];
  currentUser: string;
}

interface Message {
  sender: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
}

export default function TeamChat() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { messages, currentUser } = useAppSelector((state) => state.team);
  const { hackathon } = useAppSelector((state) => state.userHack);
  
  // Safely create hackathonData with fallback values
  const hackathonData: HackathonData = {
    title: hackathon?.title || 'AI Innovation Challenge',
    description: hackathon?.description || 'Build an AI-powered collaboration tool that revolutionizes how teams work together in virtual environments. Focus on creating innovative solutions that enhance productivity and communication.',
    startDate: hackathon?.startDate || '2025-09-10T09:00:00Z',
    endDate: hackathon?.endDate || '2025-09-12T18:00:00Z',
    submissionDeadline: hackathon?.submissionDeadline || '2025-09-12T17:00:00Z',
    maxTeamSize: hackathon?.maxTeamSize || 4,
    venue: hackathon?.venue || 'Tech Hub Convention Center',
    mode: hackathon?.mode || 'hybrid',
    registrationFee: hackathon?.registrationFee || 50,
    status: hackathon?.status || 'ongoing',
    problemStatements: hackathon?.problemStatements || [
      'Design an AI assistant that can predict team conflicts before they occur',
      'Create a smart workspace that adapts to individual working styles',
      'Develop a real-time collaboration tool with advanced analytics'
    ],
    submissionFormat: hackathon?.submissionFormat || 'GitHub repository + Live demo + Presentation slides',
    tags: hackathon?.tags || ['AI', 'Collaboration', 'Innovation', 'SaaS'],
    timeLeft: '23:59:51'
  };
 
  const teamData: TeamData = {
    members: [
      { id: 1, name: 'Alex Johnson', role: 'Team Lead', status: 'active', avatar: 'AJ' },
      { id: 2, name: 'Sarah Chen', role: 'Frontend Dev', status: 'active', avatar: 'SC' },
      { id: 3, name: 'Mike Rodriguez', role: 'Backend Dev', status: 'away', avatar: 'MR' },
      { id: 4, name: 'Emma Davis', role: 'UI/UX Designer', status: 'active', avatar: 'ED' }
    ],
    currentUser: 'Alex Johnson'
  };

  const [newMessage, setNewMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>(hackathonData.timeLeft);
 const {user,isAuthenticated,token} =  useUser();
  const {connectWs,isConnected} = useAppSelector((state) => state.websocket);
  useEffect(() => {
    // Simulate message read status updates
    const timer = setTimeout(() => {
      messages.forEach((msg: Message, index: number) => {
        if (msg.sender !== currentUser && !msg.seen) {
          // Simulate other users reading messages after a delay
          setTimeout(() => {
            dispatch(updateMessageStatus({ index, status: 'seen' }));
          }, 1000 + (index * 500));
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages, currentUser, dispatch]);


useEffect(() => {
  // ✅ When this page loads, request connection
  dispatch(changeConnect({ changeStatus: true }));

  if (!isConnected && isAuthenticated && token) {
    webSocketService.connect(token);
  }

  // ✅ Clean up when leaving page
  return () => {
    dispatch(changeConnect({ changeStatus: false }));
    if (isConnected) {
      webSocketService.disconnect();
    }
  };
}, [dispatch, isAuthenticated, token, isConnected]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Message validation
    if (!newMessage.trim()) {
      return; // Don't send empty messages
    }

    if (newMessage.trim().length > 1000) {
      alert('Message is too long. Please keep it under 1000 characters.');
      return;
    }

    if (newMessage.trim().length < 1) {
      return; // Don't send messages with only whitespace
    }

    // Check for spam (same message sent repeatedly)
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.text === newMessage.trim() &&
      lastMessage.sender === currentUser
    ) {
      alert('Please avoid sending duplicate messages.');
      return;
    }

    dispatch(
      addMessage({
        sender: currentUser,
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent' // Initial status when message is sent
      }),
    );
    setNewMessage('');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get the status icon based on message status
  const getStatusIcon = (status: string, isOwnMessage: boolean): JSX.Element | null => {
    if (!isOwnMessage) return null;
    
    switch(status) {
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout showBackground={true} className="bg-background">
      <div className="min-h-screen p-4 xs:p-5 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="font-orbitron font-bold text-2xl xs:text-3xl lg:text-4xl text-foreground">
              {hackathonData.title}
            </h1>
            <p className="text-sm xs:text-base lg:text-lg text-muted-foreground">
              Team Collaboration Hub
            </p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 xs:px-6 py-3 xs:py-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 xs:w-5 h-4 xs:h-5 text-primary" />
              <span className="text-muted-foreground text-xs xs:text-sm">Time Remaining</span>
            </div>
            <div className="font-mono text-xl xs:text-2xl font-bold text-foreground">
              {timeLeft}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Hackathon Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 xs:w-6 h-5 xs:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-orbitron font-bold text-lg xs:text-xl text-foreground mb-2">
                      Challenge Overview
                    </h2>
                    <p className="text-sm xs:text-base text-muted-foreground mb-4">
                      {hackathonData.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="text-foreground">
                            {(() => {
                              const start = new Date(hackathonData.startDate);
                              const end = new Date(hackathonData.endDate);
                              const diffMs = end.getTime() - start.getTime();
                              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                              return `${diffHours} hours`;
                            })()} - {formatDate(hackathonData.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Mode:</span>
                          <span className="text-foreground capitalize">{hackathonData.mode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Max team size:</span>
                          <span className="text-foreground">{hackathonData.maxTeamSize}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Submission:</span>
                          <span className="text-foreground text-xs">{hackathonData.submissionFormat}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="default" className="text-xs">
                            {hackathonData.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Entry Fee:</span>
                          <span className="text-foreground">${hackathonData.registrationFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hackathonData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Problem Statements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Problem Statements
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground text-sm xs:text-base leading-relaxed">
                    Choose from the following challenge areas: {hackathonData.problemStatements.join('; ')}. 
                    Teams can focus on any one of these areas or create innovative solutions that combine multiple aspects. 
                    Your solution should demonstrate creativity, technical excellence, and practical applicability to real-world scenarios.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Team Chat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-orbitron font-bold text-lg text-foreground">
                    Team Chat
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {messages.length} messages
                  </Badge>
                </div>

                {/* Chat Messages */}
                <div className="h-80 xs:h-96 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-12">
                      No messages yet — start the conversation!
                    </div>
                  ) : (
                    messages.map((msg: Message, index: number) => {
                      const isOwnMessage = msg.sender === currentUser;
                      return (
                        <div
                          key={index}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`px-3 py-2 rounded-lg max-w-xs ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-sm font-medium mb-1">
                                {msg.sender}
                              </p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p className="text-xs opacity-70">{msg.time}</p>
                              {getStatusIcon(msg.status, isOwnMessage)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message... (Enter to send)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    variant="hero"
                    size="sm"
                    className="px-4 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-orbitron font-bold text-lg text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Team Members
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {teamData.members.length}/{hackathonData.maxTeamSize}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {teamData.members.map((member: TeamMember) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-foreground">
                          {member.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium text-sm">
                          {member.name}
                          {member.name === currentUser && (
                            <span className="text-muted-foreground ml-1">(You)</span>
                          )}
                        </p>
                        <p className="text-muted-foreground text-xs">{member.role}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                  ))}
                  
                  {teamData.members.length < hackathonData.maxTeamSize && (
                    <Button 
                      variant="outline" 
                      className="w-full p-3 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Invite Team Member
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Submission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Project Submission
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Submit your final project before the deadline. Make sure to include all required components.
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="text-foreground">{formatDate(hackathonData.submissionDeadline)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <p className="text-foreground text-xs mt-1">{hackathonData.submissionFormat}</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="hero" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Project
                </Button>
              </GlassCard>
            </motion.div> 
          </div>
        </div>
      </div>
    </PageLayout>
  );
}