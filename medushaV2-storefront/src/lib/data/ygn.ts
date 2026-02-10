import type {
  Scene,
  VideoMemory,
  CreditPackage,
  PurchaseRecord,
} from "@/types/ygn"

export const MOCK_USER_CREDITS = 85

export const MOCK_SCENES: Scene[] = [
  {
    id: "1",
    name: "温馨家庭聚餐",
    description: "围桌品味，共享天伦之乐",
    previewImage:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop",
    creditsRequired: 10,
    category: "dining",
    isPopular: true,
  },
  {
    id: "2",
    name: "海边漫步",
    description: "踏浪而行，感受海风的轻抚",
    previewImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
    creditsRequired: 15,
    category: "ocean",
    isPopular: false,
  },
  {
    id: "3",
    name: "山间旅行",
    description: "探索自然，收获美好回忆",
    previewImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    creditsRequired: 18,
    category: "travel",
    isPopular: true,
  },
  {
    id: "4",
    name: "客厅聊天",
    description: "温暖的家，永远的港湾",
    previewImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    creditsRequired: 8,
    category: "home",
    isPopular: false,
  },
  {
    id: "5",
    name: "海边烧烤",
    description: "阳光沙滩，美食与欢笑相伴",
    previewImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    creditsRequired: 20,
    category: "ocean",
    isPopular: true,
  },
  {
    id: "6",
    name: "家中生日会",
    description: "烛光摇曳，许下美好心愿",
    previewImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop",
    creditsRequired: 12,
    category: "home",
    isPopular: false,
  },
  {
    id: "7",
    name: "餐厅约会",
    description: "烛光晚餐，浪漫时光",
    previewImage:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop",
    creditsRequired: 14,
    category: "dining",
    isPopular: true,
  },
  {
    id: "8",
    name: "古镇游览",
    description: "漫步古巷，品味历史韵味",
    previewImage:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop",
    creditsRequired: 16,
    category: "travel",
    isPopular: false,
  },
]

export const MOCK_CATEGORIES: Array<{ id: string; label: string }> = [
  { id: "all", label: "全部" },
  { id: "dining", label: "吃饭" },
  { id: "travel", label: "旅游" },
  { id: "ocean", label: "海上" },
  { id: "home", label: "家里" },
]

export const MOCK_VIDEO_MEMORIES: VideoMemory[] = [
  {
    id: "v1",
    title: "温馨家庭聚餐",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop",
    videoUrl: "/videos/sample1.mp4",
    createdDate: "2024-01-20",
    duration: 45,
    sceneType: "聚餐",
    participants: ["我自己", "父亲", "母亲"],
  },
  {
    id: "v2",
    title: "海边漫步回忆",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
    videoUrl: "/videos/sample2.mp4",
    createdDate: "2024-01-18",
    duration: 32,
    sceneType: "海边",
    participants: ["我自己", "朋友1"],
  },
  {
    id: "v3",
    title: "客厅温馨时光",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    videoUrl: "/videos/sample3.mp4",
    createdDate: "2024-01-15",
    duration: 28,
    sceneType: "家庭",
    participants: ["我自己", "母亲"],
  },
]

export const MOCK_CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "basic",
    name: "入门套餐",
    credits: 100,
    bonusCredits: 0,
    price: 10,
    isPopular: false,
    description: "适合初次体验的用户",
  },
  {
    id: "popular",
    name: "超值套餐",
    credits: 350,
    bonusCredits: 50,
    price: 30,
    originalPrice: 35,
    isPopular: true,
    description: "最受欢迎的选择",
  },
  {
    id: "premium",
    name: "豪华套餐",
    credits: 600,
    bonusCredits: 100,
    price: 50,
    originalPrice: 60,
    isPopular: false,
    description: "高性价比之选",
  },
  {
    id: "ultimate",
    name: "至尊套餐",
    credits: 1300,
    bonusCredits: 300,
    price: 100,
    originalPrice: 130,
    isPopular: false,
    description: "专业用户的不二之选",
  },
]

export const MOCK_PURCHASE_RECORDS: PurchaseRecord[] = [
  {
    id: "pr1",
    date: "2024-01-15",
    packageName: "超值套餐",
    credits: 400,
    amount: 30,
    method: "微信支付",
  },
  {
    id: "pr2",
    date: "2024-01-02",
    packageName: "入门套餐",
    credits: 100,
    amount: 10,
    method: "支付宝",
  },
]

export const MOCK_SCENE_DATA: Record<
  string,
  {
    name: string
    description: string
    creditsRequired: number
    previewImage: string
  }
> = {
  "1": {
    name: "温馨家庭聚餐",
    description: "围桌品味，共享天伦之乐",
    creditsRequired: 10,
    previewImage:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop",
  },
  "2": {
    name: "海边漫步",
    description: "踏浪而行，感受海风的轻抚",
    creditsRequired: 15,
    previewImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
  },
  "3": {
    name: "山间旅行",
    description: "探索自然，收获美好回忆",
    creditsRequired: 18,
    previewImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
}

export const MOCK_ROLE_STRUCTURE: Record<
  string,
  {
    label: string
    subRoles: Array<{ id: string; label: string }>
  }
> = {
  myself: {
    label: "我自己",
    subRoles: [{ id: "myself_main", label: "本人" }],
  },
  friend: {
    label: "朋友",
    subRoles: [
      { id: "friend1", label: "朋友1" },
      { id: "friend2", label: "朋友2" },
    ],
  },
  family: {
    label: "家人",
    subRoles: [
      { id: "father", label: "父亲" },
      { id: "mother", label: "母亲" },
      { id: "grandfather", label: "爷爷" },
      { id: "grandmother", label: "奶奶" },
      { id: "maternal_grandfather", label: "姥爷" },
      { id: "maternal_grandmother", label: "姥姥" },
    ],
  },
}

export const MOCK_PHOTOS_BY_SUBROLE: Record<
  string,
  Array<{ id: string; url: string; name: string }>
> = {
  myself_main: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      name: "自拍照1",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      name: "自拍照2",
    },
  ],
  friend1: [
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      name: "朋友1照片",
    },
  ],
  friend2: [
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      name: "朋友2照片",
    },
  ],
  father: [
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop",
      name: "父亲照片",
    },
  ],
  mother: [
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      name: "母亲照片",
    },
  ],
  grandfather: [
    {
      id: "p7",
      url: "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?w=100&h=100&fit=crop",
      name: "爷爷照片",
    },
  ],
  grandmother: [],
  maternal_grandfather: [],
  maternal_grandmother: [],
}