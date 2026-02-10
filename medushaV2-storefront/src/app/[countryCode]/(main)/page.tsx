import { Metadata } from "next"

import YgnWelcomeTemplate from "@modules/ygn/templates/welcome"
import FeaturedProducts from "@modules/home/components/featured-products"
import CategoryGrid from "@modules/home/components/category-grid"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "忆光年 - 重温光阴，慰藉心灵",
  description:
    "上传珍贵照片，选择温馨场景，AI为您生成专属回忆视频。让美好时光重新绽放。",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  return (
    <>
      {/* YGN Welcome - Primary Content */}
      <YgnWelcomeTemplate />

      {/* E-commerce Section - Secondary */}
      {collections && region && (
        <div className="border-t border-gray-200 bg-neutral-50">
          <div className="content-container py-12">
            <h2 className="text-2xl font-bold text-center mb-2">
              精选商品
            </h2>
            <p className="text-gray-500 text-center mb-8">
              浏览我们的精选商品系列
            </p>
          </div>
          <CategoryGrid collections={collections} />
          <div className="bg-neutral-50">
            <ul className="flex flex-col">
              <FeaturedProducts
                collections={collections}
                region={region}
              />
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
