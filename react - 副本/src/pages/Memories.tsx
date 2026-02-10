import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Search, Plus, Play, Download, Trash2, Calendar, Clock, Share2, MessageCircle, Link, QrCode, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import BottomNavigation from '@/components/BottomNavigation';

interface VideoMemory {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdDate: string;
  duration: number;
  sceneType: string;
  participants: string[];
}

const Memories: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoMemory | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shareVideoData, setShareVideoData] = useState<VideoMemory | null>(null);
  
  console.log('Enhanced Memories page loaded with sharing functionality');
  
  // Mock video memories data
  const videoMemories: VideoMemory[] = [
    {
      id: '1',
      title: '温馨家庭聚餐',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
      videoUrl: 'https://example.com/video1.mp4',
      createdDate: '2024-01-20',
      duration: 45,
      sceneType: '聚餐',
      participants: ['我自己', '父亲', '母亲']
    },
    {
      id: '2',
      title: '海边漫步回忆',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
      videoUrl: 'https://example.com/video2.mp4',
      createdDate: '2024-01-18',
      duration: 32,
      sceneType: '海边',
      participants: ['我自己', '朋友1']
    },
    {
      id: '3',
      title: '客厅温馨时光',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      videoUrl: 'https://example.com/video3.mp4',
      createdDate: '2024-01-15',
      duration: 28,
      sceneType: '家庭',
      participants: ['我自己', '母亲']
    }
  ];
  
  const filteredMemories = videoMemories.filter(memory => 
    memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.sceneType.includes(searchQuery) ||
    memory.participants.some(participant => participant.includes(searchQuery))
  );
  
  const handleCreateNew = () => {
    console.log('Create new memory clicked, navigating to home page');
    navigate('/home');
  };
  
  const handlePlayVideo = (video: VideoMemory) => {
    console.log('Playing video:', video.title);
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };
  
  const handleShareVideo = (video: VideoMemory) => {
    console.log('Sharing video:', video.title);
    setShareVideoData(video);
    setShowShareSheet(true);
  };
  
  const handleShareToWeChat = () => {
    console.log('Sharing to WeChat:', shareVideoData?.title);
    alert('正在调用微信分享...');
    setShowShareSheet(false);
  };
  
  const handleCopyLink = () => {
    const shareLink = `https://yiguangnian.com/share/${shareVideoData?.id}`;
    navigator.clipboard.writeText(shareLink);
    console.log('Link copied:', shareLink);
    alert('链接已复制到剪贴板');
    setShowShareSheet(false);
  };
  
  const handleSaveToAlbum = () => {
    console.log('Saving to album:', shareVideoData?.title);
    alert('正在保存视频到相册...');
    setShowShareSheet(false);
  };
  
  const handleDownloadVideo = (video: VideoMemory) => {
    console.log('Downloading video:', video.title);
    alert(`开始下载视频：${video.title}`);
  };
  
  const handleDeleteVideo = (video: VideoMemory) => {
    console.log('Deleting video:', video.title);
    if (confirm(`确定要删除视频"${video.title}"吗？`)) {
      alert(`视频"${video.title}"已删除`);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe content-with-bottom-nav">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">我的回忆</h1>
            <Button 
              onClick={handleCreateNew}
              className="rounded-xl px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="搜索标题、场景或参与人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>
        </div>
        
        {/* Video List */}
        {filteredMemories.length > 0 ? (
          <div className="p-4 space-y-4">
            {filteredMemories.map((video) => (
              <div key={video.id} className="bg-card rounded-xl shadow-custom overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayVideo(video)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </div>
                  </button>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}s
                  </div>
                  
                  {/* Scene Type Badge */}
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {video.sceneType}
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1">{video.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(video.createdDate)}
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        <span className="text-sm text-muted-foreground">参与者：</span>
                        {video.participants.map((participant, index) => (
                          <span key={index} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayVideo(video)}
                      className="flex-1 rounded-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      播放
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareVideo(video)}
                      className="rounded-xl"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadVideo(video)}
                      className="rounded-xl"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video)}
                      className="rounded-xl text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gradient mb-2">
                {searchQuery ? '未找到相关回忆' : '暂无回忆视频'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? '尝试使用不同的关键词搜索' : '创建您的第一个回忆视频吧'}
              </p>
              <Button 
                onClick={searchQuery ? () => setSearchQuery('') : handleCreateNew} 
                className="rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                {searchQuery ? '清除搜索' : '开始创建'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Video Player Modal */}
        <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
          <DialogContent className="w-80 max-w-none p-0">
            <DialogHeader className="p-4">
              <DialogTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2 text-primary" />
                {selectedVideo?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedVideo && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden mx-4 mb-4">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-70">视频播放功能开发中...</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Share Sheet */}
        <Sheet open={showShareSheet} onOpenChange={setShowShareSheet}>
          <SheetContent side="bottom" className="h-80">
            <SheetHeader>
              <SheetTitle>分享视频</SheetTitle>
            </SheetHeader>
            
            {shareVideoData && (
              <div className="py-4">
                {/* Video Preview */}
                <div className="flex items-center space-x-3 mb-6 p-3 bg-muted rounded-xl">
                  <img
                    src={shareVideoData.thumbnailUrl}
                    alt={shareVideoData.title}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{shareVideoData.title}</h4>
                    <p className="text-sm text-muted-foreground">用忆光年重温与TA的时光</p>
                  </div>
                </div>
                
                {/* Share Options */}
                <div className="space-y-3">
                  <button
                    onClick={handleShareToWeChat}
                    className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">微信分享</h4>
                      <p className="text-sm text-muted-foreground">分享给微信好友</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Link className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">复制链接</h4>
                      <p className="text-sm text-muted-foreground">获取分享链接</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleSaveToAlbum}
                    className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Save className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">保存到相册</h4>
                      <p className="text-sm text-muted-foreground">下载到本地相册</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Memories;