import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfigureRole: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('scene');
  
  const [selectedRole, setSelectedRole] = useState<string>('myself');
  const [selectedSubRole, setSelectedSubRole] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [showSubRoles, setShowSubRoles] = useState<boolean>(false);
  
  console.log('ConfigureRole page completely redesigned - NO content blocking issue');
  
  // Mock scene data with images
  const sceneData = {
    '1': {
      name: '温馨家庭聚餐',
      description: '围桌品味，共享天伦之乐',
      creditsRequired: 10,
      previewImage: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=200&fit=crop'
    },
    '2': {
      name: '海边漫步',
      description: '踏浪而行，感受海风的轻抚',
      creditsRequired: 15,
      previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop'
    },
    '3': {
      name: '山间旅行',
      description: '探索自然，收获美好回忆',
      creditsRequired: 18,
      previewImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    }
  };
  
  const scene = sceneData[sceneId as keyof typeof sceneData] || {
    name: '温馨家庭聚餐',
    description: '围桌品味，共享天伦之乐',
    creditsRequired: 10,
    previewImage: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=200&fit=crop'
  };
  
  // Role structure with sub-roles
  const roleStructure = {
    myself: {
      label: '自己',
      subRoles: [
        { id: 'myself_main', label: '我的主要照片' }
      ]
    },
    friend: {
      label: '朋友',
      subRoles: [
        { id: 'friend1', label: '朋友1' },
        { id: 'friend2', label: '朋友2' }
      ]
    },
    family: {
      label: '亲人',
      subRoles: [
        { id: 'father', label: '父亲' },
        { id: 'mother', label: '母亲' },
        { id: 'grandfather', label: '爷爷' },
        { id: 'grandmother', label: '奶奶' },
        { id: 'maternal_grandfather', label: '姥爷' },
        { id: 'maternal_grandmother', label: '姥姥' }
      ]
    }
  };
  
  // Mock photos by sub-role
  const photosBySubRole: Record<string, Array<{ id: string; url: string; name: string }>> = {
    myself_main: [
      { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', name: '我的照片1' },
      { id: '2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', name: '我的照片2' }
    ],
    friend1: [
      { id: '3', url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop', name: '朋友1照片' },
      { id: '4', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', name: '朋友1照片2' }
    ],
    friend2: [
      { id: '5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', name: '朋友2照片' }
    ],
    father: [
      { id: '6', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', name: '父亲照片' },
      { id: '7', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', name: '父亲照片2' }
    ],
    mother: [
      { id: '8', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', name: '母亲照片' }
    ],
    grandfather: [
      { id: '9', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop', name: '爷爷照片' }
    ],
    grandmother: [],
    maternal_grandfather: [],
    maternal_grandmother: []
  };
  
  const currentSubRoles = roleStructure[selectedRole as keyof typeof roleStructure]?.subRoles || [];
  const currentPhotos = selectedSubRole ? photosBySubRole[selectedSubRole] || [] : [];
  
  // Auto-select first sub-role when role changes
  useEffect(() => {
    if (selectedRole !== 'myself') {
      setShowSubRoles(true);
      if (currentSubRoles.length > 0) {
        setSelectedSubRole(currentSubRoles[0].id);
      }
    } else {
      setShowSubRoles(false);
      setSelectedSubRole('myself_main');
    }
  }, [selectedRole]);
  
  // Auto-select first photo when sub-role changes
  useEffect(() => {
    if (currentPhotos.length > 0) {
      setSelectedPhoto(currentPhotos[0].id);
    } else {
      setSelectedPhoto('');
    }
  }, [selectedSubRole, currentPhotos]);
  
  const handleGenerate = () => {
    if (!selectedPhoto) {
      console.log('No photo selected');
      return;
    }
    
    console.log('Starting video generation with:', { sceneId, selectedRole, selectedSubRole, selectedPhoto });
    navigate(`/generate?scene=${sceneId}&role=${selectedRole}&subRole=${selectedSubRole}&photo=${selectedPhoto}`);
  };
  
  return (
    <div className="mobile-container bg-background flex flex-col h-screen max-h-screen overflow-hidden">
      {/* 顶部导航栏 - 固定高度64px */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background z-10 flex-shrink-0 h-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/home')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">配置角色</h1>
        <div className="w-9" />
      </div>
      
      {/* 场景预览区域 - 固定高度约200px */}
      <div className="p-4 bg-accent/30 border-b border-border flex-shrink-0">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
          <img
            src={scene.previewImage}
            alt={scene.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-900 ml-0.5" />
            </div>
          </div>
          
          {/* Credits badge */}
          <div className="absolute top-3 right-3 flex items-center bg-primary text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{scene.creditsRequired}积分</span>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="font-semibold text-foreground mb-1">{scene.name}</h2>
          <p className="text-sm text-muted-foreground">{scene.description}</p>
        </div>
      </div>
      
      {/* 可滚动内容区域 - 占用剩余空间，确保不会超出容器 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 py-4 space-y-6 pb-6">
          {/* Role Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">选择参与角色</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(roleStructure).map(([roleId, roleData]) => (
                <button
                  key={roleId}
                  onClick={() => {
                    console.log('Role selected:', roleData.label);
                    setSelectedRole(roleId);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === roleId
                      ? 'border-primary bg-primary/10 shadow-custom'
                      : 'border-border bg-card hover:bg-accent/50'
                  }`}
                >
                  <span className="text-2xl mb-2">
                    {roleId === 'myself' ? '👤' : roleId === 'friend' ? '👫' : '👨‍👩‍👧‍👦'}
                  </span>
                  <span className={`text-sm font-medium ${
                    selectedRole === roleId ? 'text-primary' : 'text-foreground'
                  }`}>
                    {roleData.label}
                  </span>
                  
                  {/* Expand indicator for family/friend */}
                  {(roleId === 'friend' || roleId === 'family') && (
                    <div className={`mt-1 transition-transform ${
                      selectedRole === roleId && showSubRoles ? 'rotate-180' : ''
                    }`}>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sub-role Selection - Expandable */}
          {showSubRoles && currentSubRoles.length > 0 && (
            <div className="expandable-content expanded animate-expand">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <ChevronDown className="w-4 h-4 mr-1 text-primary" />
                选择具体角色
              </h4>
              <div className="role-tabs">
                {currentSubRoles.map((subRole) => (
                  <button
                    key={subRole.id}
                    onClick={() => {
                      console.log('Sub-role selected:', subRole.label);
                      setSelectedSubRole(subRole.id);
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedSubRole === subRole.id
                        ? 'bg-primary text-primary-foreground shadow-custom'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {subRole.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Photo Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">选择照片</h3>
            {currentPhotos.length > 0 ? (
              <div className="photo-grid">
                {currentPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      console.log('Photo selected:', photo.name);
                      setSelectedPhoto(photo.id);
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhoto === photo.id
                        ? 'border-primary shadow-custom scale-105'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">
                  {selectedSubRole ? '该角色暂无照片' : '请先选择具体角色'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/person-manager')}
                  className="rounded-xl"
                >
                  前往添加照片
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 底部按钮区域 - 固定高度，不占用滚动区域空间 */}
      <div className="flex-shrink-0 bg-background/95 backdrop-blur-md border-t border-border p-4">
        <Button
          className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
          onClick={handleGenerate}
          disabled={!selectedPhoto}
        >
          <Play className="w-5 h-5 mr-2" />
          生成视频
        </Button>
      </div>
    </div>
  );
};

export default ConfigureRole;