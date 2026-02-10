import React from 'react';
import { GeneratedVideo } from '@/types/memory';
import { Play, Calendar } from 'lucide-react';

interface MemoryCardProps {
  video?: GeneratedVideo;
  onPlay?: (videoId: string) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  video = {
    id: '1',
    userId: 'user1',
    sceneId: 'scene1',
    sceneName: '温馨聚餐',
    videoUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
    participants: [],
    creditsUsed: 10,
    status: 'completed',
    createdAt: new Date(),
    duration: 30
  },
  onPlay = () => console.log('Play video:', video?.id)
}) => {
  return (
    <div data-cmp="MemoryCard" className="bg-card rounded-xl overflow-hidden shadow-custom border border-border">
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={video.sceneName}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onPlay(video.id)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          <Play className="w-8 h-8 text-white fill-current" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground mb-1">{video.sceneName}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {video.createdAt.toLocaleDateString()}
          </div>
          <span>{video.duration}s</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;