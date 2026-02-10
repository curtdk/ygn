import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Phone, Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    smsCode: ''
  });
  const [countdown, setCountdown] = useState(0);
  
  console.log('Login page loaded with enhanced forgot password functionality');
  
  const handleSendSMS = () => {
    if (!formData.account) {
      alert('请先输入手机号或邮箱');
      return;
    }
    
    console.log('Sending SMS verification code to:', formData.account);
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
  
  const handleForgotPassword = () => {
    console.log('Forgot password clicked, switching to SMS login');
    setLoginType('sms');
    // Clear password field when switching to SMS
    setFormData({ ...formData, password: '', smsCode: '' });
  };
  
  const handleLogin = () => {
    if (!formData.account) {
      alert('请输入手机号或邮箱');
      return;
    }
    
    if (loginType === 'password' && !formData.password) {
      alert('请输入密码');
      return;
    }
    
    if (loginType === 'sms' && !formData.smsCode) {
      alert('请输入短信验证码');
      return;
    }
    
    console.log('User login successful, navigating to home');
    navigate('/home');
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">登录账户</h1>
          <div className="w-9" />
        </div>
        
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=375&h=812&fit=crop')`
          }}
        />
        
        {/* Form */}
        <div className="flex-1 px-6 py-8">
          {/* Login Type Switcher */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${
                loginType === 'password' ? 'bg-white shadow-custom' : ''
              }`}
              onClick={() => {
                setLoginType('password');
                setFormData({ ...formData, smsCode: '' });
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              <span className={loginType === 'password' ? 'text-foreground' : 'text-muted-foreground'}>
                密码登录
              </span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${
                loginType === 'sms' ? 'bg-white shadow-custom' : ''
              }`}
              onClick={() => {
                setLoginType('sms');
                setFormData({ ...formData, password: '' });
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className={loginType === 'sms' ? 'text-foreground' : 'text-muted-foreground'}>
                短信登录
              </span>
            </button>
          </div>
          
          {/* Input Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="account" className="text-sm font-medium text-foreground">
                手机号/邮箱
              </Label>
              <Input
                id="account"
                type="text"
                placeholder="请输入手机号或邮箱"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="h-12 text-base rounded-xl"
              />
            </div>
            
            {loginType === 'password' ? (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  密码
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 text-base rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="smsCode" className="text-sm font-medium text-foreground">
                  短信验证码
                </Label>
                <div className="flex space-x-3">
                  <Input
                    id="smsCode"
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.smsCode}
                    onChange={(e) => setFormData({ ...formData, smsCode: e.target.value })}
                    className="h-12 text-base rounded-xl flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleSendSMS}
                    disabled={countdown > 0}
                    className="h-12 px-4 rounded-xl border-primary/30"
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Forgot Password */}
          {loginType === 'password' && (
            <div className="text-right mt-4">
              <button 
                onClick={handleForgotPassword}
                className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                忘记密码？
              </button>
            </div>
          )}
          
          {/* SMS Login Tip */}
          {loginType === 'sms' && (
            <div className="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
              <p className="text-sm text-primary">
                💡 使用短信验证码登录更安全便捷，也可用于重置密码
              </p>
            </div>
          )}
          
          {/* Login Button */}
          <div className="mt-12">
            <Button
              className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
              onClick={handleLogin}
            >
              {loginType === 'password' ? '立即登录' : '验证码登录'}
            </Button>
          </div>
          
          {/* Register Link */}
          <div className="text-center mt-8">
            <span className="text-muted-foreground text-sm">还没有账户？</span>
            <button
              onClick={() => navigate('/register')}
              className="text-primary font-medium text-sm ml-2 hover:text-primary/80 transition-colors"
            >
              立即注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;