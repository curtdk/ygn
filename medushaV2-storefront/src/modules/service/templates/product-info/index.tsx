"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPrice from "@modules/products/components/product-price"
import { useEffect } from "react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ServiceProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  useEffect(() => {
    if (product.metadata?.title_color) {
      document.documentElement.style.setProperty(
        "--product-title-color",
        product.metadata.title_color as string
      )
    }
  }, [product.metadata?.title_color])

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h1
          className="text-2xl text-ui-fg-base mb-4"
          style={{
            color: (product.metadata?.title_color as string) || undefined,
          }}
        >
          {product.title}
        </h1>
        {product.description && (
          <p className="text-sm text-ui-fg-subtle">{product.description}</p>
        )}
      </div>
      <ProductPrice product={product} />
    </div>
  )
}

export default ServiceProductInfo