import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Camera, Mic, Upload, Trash2, Play, Pause, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RELATIONSHIP_LABELS } from '@/types/memory';

interface CustomRole {
  id: string;
  name: string;
  isCustom: boolean;
}

interface Photo {
  id: string;
  url: string;
  name: string;
  file?: File;
}

interface Voice {
  id: string;
  name: string;
  duration: number;
  url: string;
}

const PersonManager: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>('myself');
  const [editData, setEditData] = useState({
    name: '我自己',
    age: 25,
    note: ''
  });
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', name: '照片1' },
    { id: '2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', name: '照片2' }
  ]);
  const [voices, setVoices] = useState<Voice[]>([
    { id: '1', name: '自我介绍.mp3', duration: 15, url: '' },
    { id: '2', name: '生日祝福.mp3', duration: 8, url: '' }
  ]);
  const [playingVoice, setPlayingVoice] = useState<string>('');
  
  console.log('Enhanced PersonManager page loaded with real image upload functionality');
  
  const defaultRoles = Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => ({
    id: key,
    name: label,
    isCustom: false
  }));
  
  const allRoles = [...defaultRoles, ...customRoles];
  
  const handleAddCustomRole = () => {
    if (newRoleName.trim()) {
      const newRole: CustomRole = {
        id: `custom_${Date.now()}`,
        name: newRoleName.trim(),
        isCustom: true
      };
      setCustomRoles([...customRoles, newRole]);
      setNewRoleName('');
      setIsAddingRole(false);
      console.log('Added custom role:', newRole.name);
    }
  };
  
  const handleRemoveCustomRole = (roleId: string) => {
    setCustomRoles(customRoles.filter(role => role.id !== roleId));
    if (selectedPerson === roleId) {
      setSelectedPerson('myself');
    }
    console.log('Removed custom role:', roleId);
  };
  
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto: Photo = {
              id: `photo_${Date.now()}_${Math.random()}`,
              url: e.target?.result as string,
              name: file.name,
              file: file
            };
            setPhotos(prev => [...prev, newPhoto]);
            console.log('Added real photo:', file.name);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };
  
  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
    console.log('Removed photo:', photoId);
  };
  
  const handleAddVoice = () => {
    const newVoice: Voice = {
      id: `voice_${Date.now()}`,
      name: `录音${voices.length + 1}.mp3`,
      duration: Math.floor(Math.random() * 30) + 5,
      url: ''
    };
    setVoices([...voices, newVoice]);
    console.log('Added new voice recording');
  };
  
  const handleRemoveVoice = (voiceId: string) => {
    setVoices(voices.filter(voice => voice.id !== voiceId));
    if (playingVoice === voiceId) {
      setPlayingVoice('');
    }
    console.log('Removed voice:', voiceId);
  };
  
  const handlePlayVoice = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice('');
      console.log('Paused voice:', voiceId);
    } else {
      setPlayingVoice(voiceId);
      console.log('Playing voice:', voiceId);
      // Auto pause after demo
      setTimeout(() => setPlayingVoice(''), 2000);
    }
  };
  
  const selectedRole = allRoles.find(role => role.id === selectedPerson);
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">亲人管理</h1>
          <div className="w-9" />
        </div>
        
        {/* Horizontal Role Tabs */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">选择角色</h3>
            <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-lg">
                  <Plus className="w-4 h-4 mr-1" />
                  添加角色
                </Button>
              </DialogTrigger>
              <DialogContent className="w-80">
                <DialogHeader>
                  <DialogTitle>添加自定义角色</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">角色名称</Label>
                    <Input
                      id="roleName"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="请输入角色名称"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddCustomRole} className="flex-1 rounded-xl">
                      确定添加
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingRole(false)} className="flex-1 rounded-xl">
                      取消
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="role-tabs">
            {allRoles.map((role) => (
              <div key={role.id} className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    console.log('Role selected:', role.name);
                    setSelectedPerson(role.id);
                    setEditData({ name: role.name, age: 25, note: '' });
                  }}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedPerson === role.id
                      ? 'bg-primary text-primary-foreground shadow-custom'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {role.name}
                </button>
                {role.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCustomRole(role.id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Edit Area */}
        <div className="flex-1 p-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              基本信息
            </h3>
            <div className="space-y-4">
              {/* 姓名和年龄放在同一行 */}
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-medium">姓名</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="w-24 space-y-2">
                  <Label className="text-sm font-medium">年龄</Label>
                  <Input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Photo Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                照片管理 ({photos.length}张)
              </h3>
              <Button size="sm" onClick={handleImageSelect} className="rounded-lg">
                <Camera className="w-4 h-4 mr-1" />
                添加照片
              </Button>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              {/* Add photo placeholder */}
              <button 
                onClick={handleImageSelect}
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">选择照片</span>
              </button>
            </div>
          </div>
          
          {/* Voice Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                声音管理 ({voices.length}段)
              </h3>
              <Button size="sm" onClick={handleAddVoice} className="rounded-lg">
                <Mic className="w-4 h-4 mr-1" />
                录音
              </Button>
            </div>
            
            <div className="space-y-2">
              {voices.map((voice) => (
                <div key={voice.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => handlePlayVoice(voice.id)}
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    >
                      {playingVoice === voice.id ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm">{voice.name}</h4>
                      <p className="text-muted-foreground text-xs">{voice.duration}秒</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveVoice(voice.id)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {voices.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
                  <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">暂无录音文件</p>
                  <Button size="sm" onClick={handleAddVoice} variant="outline" className="rounded-lg">
                    <Mic className="w-4 h-4 mr-1" />
                    开始录音
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* 备注信息区域 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              备注信息
            </h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium">备注</Label>
              <Textarea
                value={editData.note}
                onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                placeholder="添加关于这个人的备注信息，如喜好、特点、重要日期等..."
                className="rounded-xl min-h-20"
              />
            </div>
          </div>
          
          {/* 保存按钮 */}
          <div className="pt-4">
            <Button
              onClick={() => {
                console.log('Saving person data:', editData);
                alert('信息保存成功！');
              }}
              className="w-full h-12 text-base font-medium rounded-xl shadow-custom"
            >
              保存信息
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonManager;