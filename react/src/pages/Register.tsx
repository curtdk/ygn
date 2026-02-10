import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Shield, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerType, setRegisterType] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    code: ''
  });
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  console.log('Register page loaded with enhanced agreement system');
  
  const handleSendCode = () => {
    if (registerType === 'phone' && !formData.phone) {
      console.log('Phone number required for verification');
      return;
    }
    if (registerType === 'email' && !formData.email) {
      console.log('Email required for verification');
      return;
    }
    
    console.log('Sending verification code to:', registerType === 'phone' ? formData.phone : formData.email);
    setCodeSent(true);
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
  
  const handleRegister = () => {
    if (!formData.code) {
      alert('请输入验证码');
      return;
    }
    
    if (!agreedToTerms) {
      alert('请先同意用户协议和隐私政策');
      return;
    }
    
    console.log('User registration successful with agreement, navigating to home');
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
          <h1 className="text-lg font-semibold">注册账户</h1>
          <div className="w-9" />
        </div>
        
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=375&h=812&fit=crop')`
          }}
        />
        
        {/* Form */}
        <div className="flex-1 px-6 py-4">
          {/* Register Type Switcher */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${
                registerType === 'phone' ? 'bg-white shadow-custom' : ''
              }`}
              onClick={() => setRegisterType('phone')}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className={registerType === 'phone' ? 'text-foreground' : 'text-muted-foreground'}>
                手机注册
              </span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${
                registerType === 'email' ? 'bg-white shadow-custom' : ''
              }`}
              onClick={() => setRegisterType('email')}
            >
              <Mail className="w-4 h-4 mr-2" />
              <span className={registerType === 'email' ? 'text-foreground' : 'text-muted-foreground'}>
                邮箱注册
              </span>
            </button>
          </div>
          
          {/* Input Fields */}
          <div className="space-y-6">
            {registerType === 'phone' ? (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  手机号码
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 text-base rounded-xl"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  邮箱地址
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 text-base rounded-xl"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-foreground">
                验证码
              </Label>
              <div className="flex space-x-3">
                <Input
                  id="code"
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="h-12 text-base rounded-xl flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="h-12 px-4 rounded-xl border-primary/30"
                >
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* User Agreement Section */}
          <div className="mt-8 p-4 bg-accent/20 rounded-xl border border-accent/30">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1 text-sm leading-relaxed">
                <label htmlFor="terms" className="text-foreground">
                  我已阅读并同意 
                  <Dialog open={showUserAgreement} onOpenChange={setShowUserAgreement}>
                    <DialogTrigger asChild>
                      <button className="text-primary font-medium mx-1 underline hover:text-primary/80">
                        《用户服务协议》
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-80 max-h-96">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          用户服务协议
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-60 pr-4">
                        <div className="space-y-4 text-sm text-foreground">
                          <h4 className="font-semibold">1. 服务条款</h4>
                          <p>欢迎使用忆光年应用。本协议是您与忆光年之间关于使用忆光年服务的法律协议。</p>
                          
                          <h4 className="font-semibold">2. 账户管理</h4>
                          <p>您需要注册账户才能使用本服务。您应对账户安全负责，包括密码保管和账户信息的准确性。</p>
                          
                          <h4 className="font-semibold">3. 用户内容</h4>
                          <p>您上传的照片和其他内容仍归您所有。我们仅在提供服务的必要范围内使用您的内容。</p>
                          
                          <h4 className="font-semibold">4. 服务使用</h4>
                          <p>您同意合理使用我们的服务，不得进行任何违法或有害的活动。我们保留在必要时终止服务的权利。</p>
                          
                          <h4 className="font-semibold">5. 知识产权</h4>
                          <p>忆光年的所有技术、商标和版权均受法律保护。您不得未经授权复制或使用这些内容。</p>
                          
                          <h4 className="font-semibold">6. 免责声明</h4>
                          <p>我们会尽力提供稳定的服务，但不保证服务的绝对可用性。对于因服务中断造成的损失，我们不承担责任。</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  和
                  <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
                    <DialogTrigger asChild>
                      <button className="text-primary font-medium mx-1 underline hover:text-primary/80">
                        《隐私政策》
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-80 max-h-96">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          隐私政策
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-60 pr-4">
                        <div className="space-y-4 text-sm text-foreground">
                          <h4 className="font-semibold">1. 信息收集</h4>
                          <p>我们收集您提供的注册信息、上传的照片以及使用服务时产生的数据，以便为您提供个性化服务。</p>
                          
                          <h4 className="font-semibold">2. 信息使用</h4>
                          <p>您的信息仅用于提供和改进我们的服务。我们不会将您的个人信息出售给第三方。</p>
                          
                          <h4 className="font-semibold">3. 信息保护</h4>
                          <p>我们采用行业标准的安全措施保护您的数据，包括加密传输和安全存储。</p>
                          
                          <h4 className="font-semibold">4. 信息分享</h4>
                          <p>除非法律要求或您明确同意，我们不会与第三方分享您的个人信息。</p>
                          
                          <h4 className="font-semibold">5. Cookie使用</h4>
                          <p>我们使用Cookie来改善用户体验和分析服务使用情况。您可以在设备设置中管理Cookie。</p>
                          
                          <h4 className="font-semibold">6. 权利行使</h4>
                          <p>您有权查看、更正、删除您的个人信息。如有需要，请联系我们的客服团队。</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>
            </div>
            
            {agreedToTerms && (
              <div className="mt-3 flex items-center space-x-2 text-green-600 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">感谢您的同意，我们承诺保护您的隐私</span>
              </div>
            )}
          </div>
          
          {/* Register Button */}
          <div className="mt-8">
            <Button
              className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
              onClick={handleRegister}
              disabled={!agreedToTerms}
            >
              注册并开始使用
            </Button>
          </div>
          
          {/* Privacy Statement */}
          <div className="flex items-center justify-center mt-6 px-4">
            <Shield className="w-4 h-4 text-muted-foreground mr-2" />
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              我们承诺按照隐私政策保护您的个人信息安全<br/>
              您的数据将被妥善加密和存储
            </p>
          </div>
          
          {/* Login Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-medium text-sm"
            >
              已有账户？立即登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;