import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SceneCard from '@/components/SceneCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Scene } from '@/types/memory';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userCredits] = useState(85); // Current user credits
  
  console.log('Home page loaded with simplified credit display');
  
  // Updated scenes data with new categories and scenarios
  const scenes: Scene[] = [
    {
      id: '1',
      name: '温馨家庭聚餐',
      description: '围桌品味，共享天伦之乐',
      previewImage: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
      creditsRequired: 10,
      category: 'dining',
      isPopular: true
    },
    {
      id: '2',
      name: '海边漫步',
      description: '踏浪而行，感受海风的轻抚',
      previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
      creditsRequired: 15,
      category: 'ocean',
      isPopular: false
    },
    {
      id: '3',
      name: '山间旅行',
      description: '探索自然，收获美好回忆',
      previewImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      creditsRequired: 18,
      category: 'travel',
      isPopular: true
    },
    {
      id: '4',
      name: '客厅聊天',
      description: '温暖的家，永远的港湾',
      previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      creditsRequired: 8,
      category: 'home',
      isPopular: false
    },
    {
      id: '5',
      name: '海边烧烤',
      description: '篝火海风，难忘夜晚',
      previewImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
      creditsRequired: 20,
      category: 'ocean',
      isPopular: true
    },
    {
      id: '6',
      name: '家中生日会',
      description: '温馨庆祝，家人围绕',
      previewImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop',
      creditsRequired: 12,
      category: 'home',
      isPopular: false
    },
    {
      id: '7',
      name: '餐厅约会',
      description: '美食相伴，情意绵绵',
      previewImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
      creditsRequired: 14,
      category: 'dining',
      isPopular: true
    },
    {
      id: '8',
      name: '古镇游览',
      description: '穿越时光，品味历史',
      previewImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop',
      creditsRequired: 16,
      category: 'travel',
      isPopular: false
    }
  ];
  
  // Updated categories with new names
  const categories = [
    { id: 'all', name: '全部', icon: '🔥' },
    { id: 'dining', name: '吃饭', icon: '🍽️' },
    { id: 'travel', name: '旅游', icon: '🎒' },
    { id: 'ocean', name: '海上', icon: '🌊' },
    { id: 'home', name: '家里', icon: '🏠' }
  ];
  
  const filteredScenes = selectedCategory === 'all' 
    ? scenes 
    : scenes.filter(scene => scene.category === selectedCategory);
  
  const handleSceneSelect = (sceneId: string) => {
    console.log('Scene selected for generation:', sceneId);
    navigate(`/configure?scene=${sceneId}`);
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe content-with-bottom-nav">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gradient">忆光年</h1>
              <p className="text-sm text-muted-foreground">选择场景，开启回忆之旅</p>
            </div>
            {/* Simplified credits display */}
            <div className="flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-xl">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">{userCredits}</span>
            </div>
          </div>
        </div>
        
        {/* Person Management Button - Enhanced */}
        <div className="px-4 mb-6">
          <Button
            className="w-full h-14 bg-gradient-to-r from-primary via-orange-400 to-primary text-white rounded-xl shadow-custom font-medium text-base animate-glow"
            onClick={() => {
              console.log('Navigate to enhanced person manager');
              navigate('/person-manager');
            }}
          >
            <Users className="w-5 h-5 mr-3" />
            亲人照片设置
            <Plus className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* Category Filter - Horizontal scrollable tabs */}
        <div className="px-4 mb-6">
          <div className="role-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  console.log('Category selected:', category.name);
                  setSelectedCategory(category.id);
                }}
                className={`flex-shrink-0 flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-custom transform scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Popular Banner */}
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-r from-accent via-accent/50 to-accent rounded-xl p-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-accent-foreground mb-1">
              ✨ 热门推荐场景
            </h3>
            <p className="text-xs text-accent-foreground/80">
              最受用户喜爱的温馨场景，快来体验吧
            </p>
          </div>
        </div>
        
        {/* Scene Grid - Optimized for 375px */}
        <div className="px-4">
          <div className="scene-grid">
            {filteredScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onSelect={handleSceneSelect}
              />
            ))}
          </div>
          
          {filteredScenes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">暂无相关场景</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-primary text-sm font-medium"
              >
                查看全部场景
              </button>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;