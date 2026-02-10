import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Welcome page loaded - showing app introduction');
  }, []);
  
  return (
    <div className="mobile-safe h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient with nostalgic feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50" />
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=375&h=812&fit=crop')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6">
        {/* App Logo and Name */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-primary rounded-3xl shadow-custom flex items-center justify-center mb-4 animate-glow">
              <Heart className="w-12 h-12 text-white animate-heart" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-4xl font-bold text-gradient mb-3">
            忆光年
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            重温光阴，慰藉心灵
          </p>
        </div>
        
        {/* App Description */}
        <div className="text-center max-w-sm mb-12">
          <p className="text-foreground leading-relaxed">
            上传珍贵照片，选择温馨场景<br/>
            AI为您生成专属回忆视频<br/>
            让美好时光重新绽放
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button 
            className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
            onClick={() => {
              console.log('User clicked register button');
              navigate('/register');
            }}
          >
            立即体验
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl border-2 border-primary/30"
            onClick={() => {
              console.log('User clicked login button');
              navigate('/login');
            }}
          >
            已有账户，直接登录
          </Button>
        </div>
        
        {/* Bottom decorative elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-60">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
};

export default Welcome;