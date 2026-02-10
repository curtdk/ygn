import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GenerateVideo: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('GenerateVideo page loaded');
  
  return (
    <div className="mobile-safe h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-heart" />
          <h2 className="text-xl font-bold text-gradient mb-2">视频生成中</h2>
          <p className="text-muted-foreground mb-6">AI正在为您制作专属回忆</p>
          <Button onClick={() => navigate('/share')} className="rounded-xl">
            查看视频 (演示)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateVideo;