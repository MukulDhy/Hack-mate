import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import {
    Clock,
    MessageSquare,
    Mic,
    MicOff,
    Monitor,
    PhoneOff,
    Upload,
    Users,
    Video,
    VideoOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { addMessage } from '../slices/teamSlice';

const teamData = {
    name: 'AI Innovation Challenge',
    subtitle: 'Team Room',
    timeLeft: '23:59:51',
    participants: [
        {
            id: 1,
            name: 'You (local)',
            status: 'active',
            video: true,
            audio: true,
        },
        {
            id: 2,
            name: 'Participant 2',
            status: 'active',
            video: false,
            audio: true,
        },
        {
            id: 3,
            name: 'Participant 3',
            status: 'away',
            video: false,
            audio: false,
        },
        {
            id: 4,
            name: 'Participant 4',
            status: 'active',
            video: false,
            audio: false,
        },
    ],
    hackathonDetails: {
        title: 'Hackathon Details',
        description:
            'Build an AI-powered collaboration tool. Use the team room for voice/video, chat, and submit your final code before the timer ends.',
        theme: 'Future of Collaboration',
        maxTeamSize: 4,
        submission: 'GitHub or ZIP',
    },
    teamInfo: {
        members: 1,
        title: 'Team',
    },
};

export default function TeamChat() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { messages, currentUser } = useAppSelector((state) => state.team);
    const [newMessage, setNewMessage] = useState('');
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    // Initialize media devices
    useEffect(() => {
        const initializeMedia = async () => {
            try {
                setIsMediaLoading(true);
                setMediaError(null);

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                setMediaStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Initially mute both audio and video
                stream
                    .getAudioTracks()
                    .forEach((track) => (track.enabled = false));
                stream
                    .getVideoTracks()
                    .forEach((track) => (track.enabled = false));
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setMediaError(
                    'Camera and microphone access denied. Please allow permissions and refresh.',
                );
            } finally {
                setIsMediaLoading(false);
            }
        };

        initializeMedia();

        // Cleanup function
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run only once on mount

    // Handle microphone toggle
    const toggleMicrophone = async () => {
        if (!mediaStream) {
            setMediaError(
                'Media stream not available. Please refresh and allow permissions.',
            );
            return;
        }

        try {
            const audioTracks = mediaStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const newMicState = !isMicOn;
                audioTracks.forEach((track) => (track.enabled = newMicState));
                setIsMicOn(newMicState);
                setMediaError(null);
            }
        } catch (error) {
            console.error('Error toggling microphone:', error);
            setMediaError('Failed to toggle microphone');
        }
    };

    // Handle camera toggle
    const toggleCamera = async () => {
        if (!mediaStream) {
            setMediaError(
                'Media stream not available. Please refresh and allow permissions.',
            );
            return;
        }

        try {
            const videoTracks = mediaStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const newCameraState = !isCameraOn;
                videoTracks.forEach(
                    (track) => (track.enabled = newCameraState),
                );
                setIsCameraOn(newCameraState);
                setMediaError(null);
            }
        } catch (error) {
            console.error('Error toggling camera:', error);
            setMediaError('Failed to toggle camera');
        }
    };

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
            }),
        );
        setNewMessage('');
    };

    const handleBackToDashboard = () => {
        // Clean up media stream before navigation
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
        navigate('/dashboard');
    };
    return (
        <PageLayout showBackground={true} className="bg-background">
            <div className="min-h-screen p-4 xs:p-5 sm:p-6">
                {/* Hackathon Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div>
                        <h1 className="font-orbitron font-bold text-2xl xs:text-3xl text-foreground">
                            {teamData.name}
                        </h1>
                        <p className="text-sm xs:text-base text-muted-foreground">
                            {teamData.subtitle}
                        </p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border flex items-center gap-2">
                        <span className="font-mono text-lg xs:text-xl font-bold text-foreground">
                            {teamData.timeLeft}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/hackathon')}
                            className="text-xs"
                        >
                            Classic View
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
                        {/* Hackathon Details */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <GlassCard className="p-4 xs:p-5 sm:p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Monitor className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-orbitron font-bold text-lg xs:text-xl text-foreground mb-2">
                                            {teamData.hackathonDetails.title}
                                        </h2>
                                        <p className="text-sm xs:text-base text-muted-foreground mb-4">
                                            {
                                                teamData.hackathonDetails
                                                    .description
                                            }
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Theme:
                                                </span>
                                                <span className="text-foreground">
                                                    {
                                                        teamData
                                                            .hackathonDetails
                                                            .theme
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Max team size:
                                                </span>
                                                <span className="text-foreground">
                                                    {
                                                        teamData
                                                            .hackathonDetails
                                                            .maxTeamSize
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Submission:
                                                </span>
                                                <span className="text-foreground">
                                                    {
                                                        teamData
                                                            .hackathonDetails
                                                            .submission
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Video Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="grid grid-cols-2 gap-3 xs:gap-4">
                                {/* Local Video (Your camera) */}
                                <GlassCard className="aspect-video relative overflow-hidden">
                                    {mediaError ? (
                                        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <div className="w-12 h-12 xs:w-16 xs:h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <VideoOff className="w-6 h-6 text-destructive" />
                                                </div>
                                                <p className="text-xs text-destructive">
                                                    {mediaError}
                                                </p>
                                            </div>
                                        </div>
                                    ) : isMediaLoading ? (
                                        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-12 h-12 xs:w-16 xs:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                                                    <Video className="w-6 h-6 text-background" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Loading camera...
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <video
                                                ref={localVideoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className={`w-full h-full object-cover ${
                                                    !isCameraOn ? 'hidden' : ''
                                                }`}
                                            />
                                            {!isCameraOn && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 xs:w-16 xs:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <span className="text-lg xs:text-xl font-orbitron font-bold text-background">
                                                                {currentUser?.charAt(
                                                                    0,
                                                                ) || 'Y'}
                                                                {currentUser
                                                                    ?.split(
                                                                        ' ',
                                                                    )[1]
                                                                    ?.charAt(
                                                                        0,
                                                                    ) || 'U'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm xs:text-base font-medium text-foreground">
                                                            {currentUser ||
                                                                'You'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge
                                            variant="default"
                                            className="text-xs"
                                        >
                                            You
                                        </Badge>
                                    </div>
                                    {/* Mic indicator */}
                                    <div className="absolute bottom-2 right-2">
                                        {isMicOn ? (
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <Mic className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                <MicOff className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>

                                {/* Other participants */}
                                {teamData.participants
                                    .slice(0, 3)
                                    .map((participant, index) => (
                                        <GlassCard
                                            key={participant.id}
                                            className="aspect-video relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 xs:w-16 xs:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <span className="text-lg xs:text-xl font-orbitron font-bold text-background">
                                                            {participant.name
                                                                .split(' ')[0]
                                                                .charAt(0)}
                                                            {participant.name
                                                                .split(' ')[1]
                                                                ?.charAt(0) ||
                                                                ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm xs:text-base font-medium text-foreground">
                                                        {participant.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 left-2">
                                                <Badge
                                                    variant={
                                                        participant.status ===
                                                        'active'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {participant.status}
                                                </Badge>
                                            </div>
                                        </GlassCard>
                                    ))}
                            </div>
                        </motion.div>

                        {/* Video Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-center gap-3 xs:gap-4">
                                <Button
                                    variant={
                                        isMicOn ? 'default' : 'destructive'
                                    }
                                    size="sm"
                                    className="flex items-center gap-1.5 xs:gap-2 h-9 xs:h-10 px-3 xs:px-4"
                                    onClick={toggleMicrophone}
                                    disabled={isMediaLoading || !!mediaError}
                                >
                                    {isMicOn ? (
                                        <Mic className="w-4 h-4" />
                                    ) : (
                                        <MicOff className="w-4 h-4" />
                                    )}
                                    <span className="text-xs xs:text-sm">
                                        {isMicOn ? 'Mute' : 'Unmute'}
                                    </span>
                                </Button>
                                <Button
                                    variant={
                                        isCameraOn ? 'default' : 'destructive'
                                    }
                                    size="sm"
                                    className="flex items-center gap-1.5 xs:gap-2 h-9 xs:h-10 px-3 xs:px-4"
                                    onClick={toggleCamera}
                                    disabled={isMediaLoading || !!mediaError}
                                >
                                    {isCameraOn ? (
                                        <Video className="w-4 h-4" />
                                    ) : (
                                        <VideoOff className="w-4 h-4" />
                                    )}
                                    <span className="text-xs xs:text-sm">
                                        {isCameraOn
                                            ? 'Stop Video'
                                            : 'Start Video'}
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1.5 xs:gap-2 h-9 xs:h-10 px-3 xs:px-4 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                                    onClick={handleBackToDashboard}
                                >
                                    <PhoneOff className="w-4 h-4" />
                                    <span className="text-xs xs:text-sm">
                                        End Call
                                    </span>
                                </Button>
                            </div>
                            {mediaError && (
                                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                                    <p className="text-sm text-destructive">
                                        {mediaError}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                        {/* Team Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <GlassCard className="p-4 xs:p-5 sm:p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-primary" />
                                    <h3 className="font-orbitron font-bold text-lg text-foreground">
                                        {teamData.teamInfo.title}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {teamData.teamInfo.members} members
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-background">
                                                AJ
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                Alex Johnson
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                active
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 bg-success rounded-full"></div>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="text-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time Left
                                    </div>
                                    <div className="text-center">
                                        <span className="font-mono text-2xl font-bold text-foreground">
                                            {teamData.timeLeft}
                                        </span>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Finalize & Submit */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <GlassCard className="p-4 xs:p-5 sm:p-6">
                                <h3 className="font-orbitron font-bold text-lg text-foreground mb-3">
                                    Finalize & Submit
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    When your team is ready, submit the project
                                    (GitHub link or zip). The form opens only on
                                    click.
                                </p>
                                <Button variant="hero" className="w-full">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Submit
                                </Button>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>

                {/* Team Chat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
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
                        <div className="h-40 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No messages yet — start the conversation.
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === currentUser
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`px-3 py-2 rounded-lg max-w-xs ${
                                                msg.sender === currentUser
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-foreground'
                                            }`}
                                        >
                                            <p className="text-sm font-medium mb-1">
                                                {msg.sender}
                                            </p>
                                            <p className="text-sm">
                                                {msg.text}
                                            </p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Write a message — Ctrl/Cmd+Enter to send"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' &&
                                        (e.ctrlKey || e.metaKey)
                                    ) {
                                        handleSendMessage(e);
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button
                                onClick={handleSendMessage}
                                variant="hero"
                                size="sm"
                                className="px-4"
                            >
                                Send
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </PageLayout>
    );
}
