import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Share: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('Share page loaded');
  
  return (
    <div className="mobile-safe h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">分享视频</h1>
        <div className="w-9" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <Share2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gradient mb-2">分享回忆</h2>
          <p className="text-muted-foreground mb-6">页面开发中，敬请期待</p>
          <Button onClick={() => navigate('/home')} className="rounded-xl">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Share;