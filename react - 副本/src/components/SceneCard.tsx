import React from 'react';
import { Coins, Star } from 'lucide-react';
import { Scene } from '@/types/memory';

interface SceneCardProps {
  scene?: Scene;
  onSelect?: (sceneId: string) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene = {
    id: '1',
    name: '温馨家庭聚餐',
    description: '围桌品味，共享天伦',
    previewImage: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
    creditsRequired: 10,
    category: 'dining',
    isPopular: false
  },
  onSelect = () => console.log('Scene selected:', scene?.name)
}) => {
  console.log('Enhanced SceneCard rendered:', scene.name);
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'dining': return '吃饭';
      case 'travel': return '旅游';
      case 'ocean': return '海上';
      case 'home': return '家里';
      default: return '其他';
    }
  };
  
  return (
    <div 
      data-cmp="SceneCard" 
      className="bg-card rounded-xl overflow-hidden shadow-custom border border-border hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
      onClick={() => onSelect(scene.id)}
    >
      {/* Preview Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={scene.previewImage}
          alt={scene.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        
        {/* Popular Badge */}
        {scene.isPopular && (
          <div className="absolute top-2 left-2 flex items-center bg-primary/90 text-primary-foreground px-2 py-1 rounded-full animate-fade-in">
            <Star className="w-3 h-3 mr-1 fill-current" />
            <span className="text-xs font-medium">热门</span>
          </div>
        )}
        
        {/* Credits Badge */}
        <div className="absolute top-2 right-2 flex items-center bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full">
          <Coins className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">{scene.creditsRequired}</span>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
          {scene.name}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed mb-2">
          {scene.description}
        </p>
        
        {/* Bottom Info */}
        <div className="flex items-center justify-between">
          <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-full">
            {getCategoryLabel(scene.category)}
          </span>
          <div className="flex items-center text-muted-foreground">
            <Coins className="w-3 h-3 mr-1" />
            <span className="text-xs">{scene.creditsRequired}积分</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;