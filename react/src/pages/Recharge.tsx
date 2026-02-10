import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Star, Smartphone, CreditCard, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  originalPrice?: number;
  isPopular: boolean;
  description: string;
}

interface PurchaseRecord {
  id: string;
  date: string;
  package: string;
  credits: number;
  amount: number;
  method: string;
}

const Recharge: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [currentCredits] = useState(25); // Current user credits
  
  console.log('Enhanced Recharge page loaded with credit packages');
  
  const creditPackages: CreditPackage[] = [
    {
      id: 'basic',
      name: '入门套餐',
      price: 10,
      credits: 100,
      bonusCredits: 0,
      isPopular: false,
      description: '适合初次体验用户'
    },
    {
      id: 'popular',
      name: '超值套餐',
      price: 30,
      credits: 350,
      bonusCredits: 50,
      originalPrice: 35,
      isPopular: true,
      description: '最受欢迎，额外赠送积分'
    },
    {
      id: 'premium',
      name: '豪华套餐',
      price: 50,
      credits: 600,
      bonusCredits: 100,
      originalPrice: 60,
      isPopular: false,
      description: '高性价比，创作无限可能'
    },
    {
      id: 'ultimate',
      name: '至尊套餐',
      price: 100,
      credits: 1300,
      bonusCredits: 300,
      originalPrice: 130,
      isPopular: false,
      description: '终极体验，海量积分储备'
    }
  ];
  
  const recentPurchases: PurchaseRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      package: '超值套餐',
      credits: 350,
      amount: 30,
      method: '微信支付'
    },
    {
      id: '2',
      date: '2024-01-10',
      package: '入门套餐',
      credits: 100,
      amount: 10,
      method: '支付宝'
    }
  ];
  
  const handlePurchase = () => {
    if (!selectedPackage) {
      console.log('No package selected');
      return;
    }
    
    const pkg = creditPackages.find(p => p.id === selectedPackage);
    if (pkg) {
      console.log(`Processing purchase: ${pkg.name} for ¥${pkg.price}, ${paymentMethod} payment`);
      // Simulate successful purchase
      setTimeout(() => {
        alert(`充值成功！已获得 ${pkg.credits + pkg.bonusCredits} 积分`);
        navigate('/home');
      }, 1500);
    }
  };
  
  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-safe">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">积分充值</h1>
          <div className="w-9" />
        </div>
        
        {/* Current Credits */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">当前余额</h3>
                  <p className="text-muted-foreground text-sm">可用积分</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{currentCredits}</div>
                <div className="text-xs text-muted-foreground">积分</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Credit Packages */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">充值套餐</h2>
          <div className="space-y-3">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => {
                  console.log('Package selected:', pkg.name);
                  setSelectedPackage(pkg.id);
                }}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPackage === pkg.id
                    ? 'border-primary bg-primary/5 shadow-custom'
                    : 'border-border bg-card hover:border-primary/50'
                } ${pkg.isPopular ? 'ring-2 ring-primary/20' : ''}`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-2 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    最受欢迎
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                      {pkg.bonusCredits > 0 && (
                        <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          送{pkg.bonusCredits}积分
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{pkg.description}</p>
                    <div className="flex items-center space-x-2">
                      <div className="text-primary font-semibold">
                        {pkg.credits + pkg.bonusCredits}积分
                      </div>
                      <div className="text-xs text-muted-foreground">
                        = {pkg.credits}基础 + {pkg.bonusCredits}赠送
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    {pkg.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        ¥{pkg.originalPrice}
                      </div>
                    )}
                    <div className="text-xl font-bold text-foreground">¥{pkg.price}</div>
                    {pkg.originalPrice && (
                      <div className="text-xs text-green-600 font-medium">
                        立省¥{pkg.originalPrice - pkg.price}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }`}>
                  {selectedPackage === pkg.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Payment Methods */}
        {selectedPackage && (
          <div className="px-4 pb-6">
            <h3 className="font-semibold text-foreground mb-3">支付方式</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('wechat')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'wechat'
                    ? 'border-green-500 bg-green-50'
                    : 'border-border bg-card'
                }`}
              >
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="font-medium">微信支付</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('alipay')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'alipay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border bg-card'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">支付宝</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Purchase Button */}
        {selectedPackage && (
          <div className="px-4 pb-6">
            <Button
              onClick={handlePurchase}
              className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
            >
              立即充值 ¥{creditPackages.find(p => p.id === selectedPackage)?.price}
            </Button>
          </div>
        )}
        
        {/* Purchase History */}
        <div className="px-4 pb-6">
          <h3 className="font-semibold text-foreground mb-3">充值记录</h3>
          <div className="space-y-2">
            {recentPurchases.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div>
                  <h4 className="font-medium text-foreground text-sm">{record.package}</h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{record.date}</span>
                    <span>•</span>
                    <span>{record.method}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">¥{record.amount}</div>
                  <div className="text-xs text-primary">{record.credits}积分</div>
                </div>
              </div>
            ))}
            
            {recentPurchases.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                暂无充值记录
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;