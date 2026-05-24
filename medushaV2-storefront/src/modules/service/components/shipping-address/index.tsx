"use client"

import { HttpTypes } from "@medusajs/types"
import { Input } from "@medusajs/ui"
import { useState } from "react"

type ShippingAddressProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  checked: boolean
  onChange: () => void
}

export default function ShippingAddress({
  cart,
  customer,
  checked,
  onChange,
}: ShippingAddressProps) {
  const [differentBillingAddress, setDifferentBillingAddress] = useState(!checked)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            名
          </label>
          <Input
            name="first_name"
            defaultValue={cart?.shipping_address?.first_name || ""}
            placeholder="名"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            姓
          </label>
          <Input
            name="last_name"
            defaultValue={cart?.shipping_address?.last_name || ""}
            placeholder="姓"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          邮箱
        </label>
        <Input
          name="email"
          defaultValue={cart?.email || ""}
          placeholder="your@email.com"
          type="email"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          电话
        </label>
        <Input
          name="phone"
          defaultValue={cart?.shipping_address?.phone || ""}
          placeholder="+1 (555) 000-0000"
          type="tel"
          autoComplete="tel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          地址
        </label>
        <Input
          name="address_1"
          defaultValue={cart?.shipping_address?.address_1 || ""}
          placeholder="街道地址"
          autoComplete="address-line1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          地址 2 (可选)
        </label>
        <Input
          name="address_2"
          defaultValue={cart?.shipping_address?.address_2 || ""}
          placeholder="公寓、套房等 (可选)"
          autoComplete="address-line2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            城市
          </label>
          <Input
            name="city"
            defaultValue={cart?.shipping_address?.city || ""}
            placeholder="城市"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            邮编
          </label>
          <Input
            name="postal_code"
            defaultValue={cart?.shipping_address?.postal_code || ""}
            placeholder="邮编"
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          国家
        </label>
        <select
          name="country_code"
          defaultValue={cart?.shipping_address?.country_code || ""}
          className="w-full h-10 px-4 border border-ui-border-base rounded-rounded bg-white text-ui-fg-base"
          autoComplete="country"
        >
          <option value="">选择国家</option>
          <option value="US">United States</option>
          <option value="DK">Denmark</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="CN">China</option>
        </select>
      </div>

      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="different-billing"
          checked={differentBillingAddress}
          onChange={() => setDifferentBillingAddress(!differentBillingAddress)}
          className="w-4 h-4 rounded border-ui-border-base"
        />
        <label htmlFor="different-billing" className="text-sm text-ui-fg-base">
          账单地址与收货地址不同
        </label>
      </div>
    </div>
  )
}