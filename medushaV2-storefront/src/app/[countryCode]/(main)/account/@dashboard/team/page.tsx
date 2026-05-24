import { Metadata } from "next"
import TeamHierarchy from "@modules/account/components/team-hierarchy"

export const metadata: Metadata = {
  title: "我的团队",
  description: "查看您的推荐团队成员和下级关系",
}

export default async function TeamPage() {
  return <TeamHierarchy />
}