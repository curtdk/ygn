export interface YgnUser {
  id: string
  username: string
  phone?: string
  email?: string
  avatar?: string
  credits: number
  createdAt: Date
}

export interface Person {
  id: string
  name: string
  age?: number
  relationship: RelationshipType
  photos: PersonPhoto[]
  voices: PersonVoice[]
}

export interface PersonPhoto {
  id: string
  url: string
  filename: string
  isDefault: boolean
  uploadedAt: Date
}

export interface PersonVoice {
  id: string
  filename: string
  duration: number
  url: string
  uploadedAt: Date
}

export interface Scene {
  id: string
  name: string
  description: string
  previewImage: string
  creditsRequired: number
  category: SceneCategory
  isPopular: boolean
}

export type SceneCategory = "dining" | "travel" | "ocean" | "home" | "celebration"

export type RelationshipType =
  | "myself" | "father" | "mother"
  | "grandfather" | "grandmother"
  | "maternal_grandfather" | "maternal_grandmother"
  | "son" | "daughter" | "friend1" | "friend2"

export interface VideoGenerationConfig {
  sceneId: string
  participants: ParticipantConfig[]
  totalCredits: number
}

export interface ParticipantConfig {
  personId: string
  role: "myself" | "friend" | "family"
  selectedPhotoId: string
  selectedVoiceId?: string
}

export interface GeneratedVideo {
  id: string
  userId: string
  sceneId: string
  sceneName: string
  videoUrl: string
  thumbnailUrl: string
  participants: ParticipantConfig[]
  creditsUsed: number
  status: "generating" | "completed" | "failed"
  createdAt: Date
  duration: number
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  bonusCredits: number
  price: number
  originalPrice?: number
  isPopular: boolean
  description: string
}

export interface PurchaseRecord {
  id: string
  date: string
  packageName: string
  credits: number
  amount: number
  method: string
}

export interface VideoMemory {
  id: string
  title: string
  thumbnailUrl: string
  videoUrl: string
  createdDate: string
  duration: number
  sceneType: string
  participants: string[]
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  myself: "自己",
  father: "父亲",
  mother: "母亲",
  grandfather: "爷爷",
  grandmother: "奶奶",
  maternal_grandfather: "姥爷",
  maternal_grandmother: "姥姥",
  son: "儿子",
  daughter: "女儿",
  friend1: "朋友1",
  friend2: "朋友2",
}

export const SCENE_CATEGORIES: Record<SceneCategory, string> = {
  dining: "吃饭",
  travel: "旅游",
  ocean: "海上",
  home: "家里",
  celebration: "庆祝时刻",
}
