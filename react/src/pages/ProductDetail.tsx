import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productApi, videoApi, uploadApi } from '@/services/api';

interface Material {
  id: string;
  name: string;
  material_key: string;
  material_type: string;
  default_url: string;
  is_replaceable: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: Array<{ url: string }>;
  variants: Array<{
    prices: Array<{ amount: number }>
  }>;
}

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('scene');

  const [product, setProduct] = useState<Product | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, { url: string; file?: File }>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      
      // 获取产品详情
      const productResponse = await productApi.getProduct(productId!);
      setProduct(productResponse.product);

      // 获取可替换素材
      const materialsResponse = await productApi.getProductMaterials(productId!);
      setMaterials(materialsResponse.materials || []);

      // 初始化选中的素材为默认值
      const initialMaterials: Record<string, { url: string }> = {};
      materialsResponse.materials?.forEach((material: Material) => {
        initialMaterials[material.material_key] = {
          url: material.default_url
        };
      });
      setSelectedMaterials(initialMaterials);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (materialKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(materialKey);
      
      // 上传文件
      const uploadResponse = await uploadApi.uploadFile(file);
      
      // 更新选中的素材
      setSelectedMaterials(prev => ({
        ...prev,
        [materialKey]: {
          url: uploadResponse.url,
          file
        }
      }));
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(null);
    }
  };

  const handleGenerate = async () => {
    if (!product) return;

    try {
      // 准备素材数据
      const materialsUsed: Record<string, any> = {};
      materials.forEach(material => {
        const selected = selectedMaterials[material.material_key];
        materialsUsed[material.material_key] = {
          original_url: material.default_url,
          replaced_url: selected?.url !== material.default_url ? selected?.url : null,
          type: material.material_type
        };
      });

      // 创建视频生成任务
      const response = await videoApi.createVideoGeneration({
        product_id: product.id,
        title: product.title,
        materials_used: materialsUsed
      });

      // 跳转到生成页面
      navigate(`/generate?videoId=${response.video.id}`);
    } catch (error) {
      console.error('Failed to create video generation:', error);
      alert('生成失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="mobile-container bg-background flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mobile-container bg-background flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">产品不存在</p>
          <Button onClick={() => navigate('/home')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const productImages = product.images?.map(img => img.url) || [product.thumbnail];

  return (
    <div className="mobile-container bg-background flex flex-col h-screen">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background z-10 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/home')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">产品详情</h1>
        <div className="w-9" />
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 产品轮播图 */}
        <div className="relative">
          <div className="aspect-video bg-muted overflow-hidden">
            <img
              src={productImages[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 轮播指示器 */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 积分标签 */}
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">
              {product.variants?.[0]?.prices?.[0]?.amount 
                ? Math.floor(product.variants[0].prices[0].amount / 100) 
                : 10}积分
            </span>
          </div>
        </div>

        {/* 产品信息 */}
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>

        {/* 可替换素材 */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-4">可替换素材</h3>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{material.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {material.material_type === 'image' ? '图片' : 
                       material.material_type === 'audio' ? '音频' :
                       material.material_type === 'video' ? '视频' : '背景'}
                    </p>
                  </div>
                  {selectedMaterials[material.material_key]?.url !== material.default_url && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      已替换
                    </div>
                  )}
                </div>

                {/* 素材预览 */}
                {material.material_type === 'image' && (
                  <div className="mb-3">
                    <img
                      src={selectedMaterials[material.material_key]?.url || material.default_url}
                      alt={material.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* 替换按钮 */}
                {material.is_replaceable && (
                  <div>
                    <input
                      type="file"
                      id={`file-${material.material_key}`}
                      accept={material.material_type === 'image' ? 'image/*' : 
                             material.material_type === 'audio' ? 'audio/*' : 
                             material.material_type === 'video' ? 'video/*' : '*'}
                      onChange={(e) => handleFileSelect(material.material_key, e)}
                      className="hidden"
                    />
                    <label htmlFor={`file-${material.material_key}`}>
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={uploading === material.material_key}
                        asChild
                      >
                        <span>
                          {uploading === material.material_key ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                              上传中...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {selectedMaterials[material.material_key]?.url !== material.default_url 
                                ? '重新选择' 
                                : '选择文件'}
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部生成按钮 */}
      <div className="flex-shrink-0 bg-background/95 backdrop-blur-md border-t border-border p-4">
        <Button
          className="w-full h-14 text-lg font-medium rounded-xl shadow-custom"
          onClick={handleGenerate}
        >
          <Play className="w-5 h-5 mr-2" />
          生成视频
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
