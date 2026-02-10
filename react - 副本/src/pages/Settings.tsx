import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, CreditCard, Shield, MessageCircle, Info, LogOut, Camera, Edit, Key, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BottomNavigation from '@/components/BottomNavigation';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userName, setUserName] = useState<string>('忆光年用户');
  const [tempUserName, setTempUserName] = useState<string>('忆光年用户');
  const [resetData, setResetData] = useState({
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetStep, setResetStep] = useState(1); // 1: 验证身份, 2: 设置新密码
  const [countdown, setCountdown] = useState(0);
  
  console.log('Settings page loaded with profile editing functionality');
  
  const settingItems = [
    { icon: Users, label: '亲人管理', path: '/person-manager', color: 'text-blue-500' },
    { icon: CreditCard, label: '积分充值', path: '/recharge', color: 'text-green-500' },
    { icon: Shield, label: '隐私设置', path: '/privacy', color: 'text-purple-500' },
    { icon: MessageCircle, label: '意见反馈', path: '/feedback', color: 'text-orange-500' },
    { icon: Info, label: '关于应用', path: '/about', color: 'text-blue-500' }
  ];
  
  const handleAvatarChange = () => {
    avatarInputRef.current?.click();
  };
  
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserAvatar(e.target?.result as string);
        console.log('Avatar updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileEdit = () => {
    setTempUserName(userName);
    setShowProfileEdit(true);
  };
  
  const handleSaveProfile = () => {
    setUserName(tempUserName);
    setShowProfileEdit(false);
    console.log('Profile saved:', tempUserName);
    alert('头像和用户名已更新！');
  };
  
  const handleSendResetCode = () => {
    if (!resetData.phone) {
      alert('请输入手机号');
      return;
    }
    
    console.log('Sending password reset code to:', resetData.phone);
    setCountdown(60);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleVerifyCode = () => {
    if (!resetData.code) {
      alert('请输入验证码');
      return;
    }
    
    console.log('Verification code confirmed, proceeding to password reset');
    setResetStep(2);
  };
  
  const handleResetPassword = () => {
    if (!resetData.newPassword) {
      alert('请输入新密码');
      return;
    }
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    console.log('Password reset successful');
    alert('密码重置成功！');
    setShowPasswordReset(false);
    setResetStep(1);
    setResetData({
      phone: '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe content-with-bottom-nav">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-semibold">设置</h1>
        </div>
        
        {/* Profile Section */}
        <div className="p-4 bg-card m-4 rounded-xl shadow-custom">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
              <button 
                onClick={handleAvatarChange}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{userName}</h3>
                <button onClick={handleProfileEdit} className="p-1">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <button 
                onClick={handleProfileEdit}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                点击修改头像和用户名
              </button>
            </div>
          </div>
        </div>
        
        {/* Hidden file input for avatar */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarFileChange}
          className="hidden"
        />
        
        {/* Settings List */}
        <div className="mx-4 space-y-2">
          {settingItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  console.log('Settings item clicked:', item.label);
                  navigate(item.path);
                }}
                className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl shadow-custom hover:bg-accent/50 transition-colors"
              >
                <IconComponent className={`w-5 h-5 ${item.color}`} />
                <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </button>
            );
          })}
          
          {/* Password Reset Button */}
          <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
            <DialogTrigger asChild>
              <button
                className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl shadow-custom hover:bg-accent/50 transition-colors"
              >
                <Key className="w-5 h-5 text-amber-500" />
                <span className="flex-1 text-left font-medium text-foreground">重置密码</span>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-80">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-primary" />
                  重置密码
                </DialogTitle>
              </DialogHeader>
              
              {resetStep === 1 ? (
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetPhone">手机号验证</Label>
                    <Input
                      id="resetPhone"
                      type="tel"
                      placeholder="请输入注册时的手机号"
                      value={resetData.phone}
                      onChange={(e) => setResetData({ ...resetData, phone: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resetCode">短信验证码</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="resetCode"
                        type="text"
                        placeholder="请输入验证码"
                        value={resetData.code}
                        onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                        className="rounded-xl flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleSendResetCode}
                        disabled={countdown > 0}
                        className="rounded-xl"
                      >
                        {countdown > 0 ? `${countdown}s` : '发送'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
                    <Button onClick={handleVerifyCode} className="flex-1 rounded-xl">
                      <Phone className="w-4 h-4 mr-2" />
                      验证身份
                    </Button>
                    <Button variant="outline" onClick={() => setShowPasswordReset(false)} className="flex-1 rounded-xl">
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  <div className="p-3 bg-green-100 text-green-800 rounded-xl text-sm">
                    ✅ 身份验证成功，请设置新密码
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="请输入新密码"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="请再次输入新密码"
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
                    <Button onClick={handleResetPassword} className="flex-1 rounded-xl">
                      <Key className="w-4 h-4 mr-2" />
                      确认重置
                    </Button>
                    <Button variant="outline" onClick={() => setResetStep(1)} className="flex-1 rounded-xl">
                      返回
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Profile Edit Dialog */}
          <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
            <DialogContent className="w-80">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-primary" />
                  编辑个人信息
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 p-4">
                {/* Avatar Section */}
                <div className="text-center">
                  <div className="relative inline-block">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    <button 
                      onClick={handleAvatarChange}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">点击更换头像</p>
                </div>
                
                {/* Username Input */}
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={tempUserName}
                    onChange={(e) => setTempUserName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} className="flex-1 rounded-xl">
                    保存更改
                  </Button>
                  <Button variant="outline" onClick={() => setShowProfileEdit(false)} className="flex-1 rounded-xl">
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Logout Button */}
          <button
            onClick={() => {
              console.log('User logout clicked');
              if (confirm('确定要退出登录吗？')) {
                navigate('/');
              }
            }}
            className="w-full flex items-center space-x-4 p-4 bg-card rounded-xl shadow-custom hover:bg-destructive/10 transition-colors mt-6"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            <span className="flex-1 text-left font-medium text-destructive">退出登录</span>
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;