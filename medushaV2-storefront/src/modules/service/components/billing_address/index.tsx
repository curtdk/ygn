"use client"

import { HttpTypes } from "@medusajs/types"
import { Input } from "@medusajs/ui"

type BillingAddressProps = {
  cart: HttpTypes.StoreCart | null
}

export default function BillingAddress({ cart }: BillingAddressProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            名
          </label>
          <Input
            name="billing_first_name"
            defaultValue={cart?.billing_address?.first_name || ""}
            placeholder="名"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            姓
          </label>
          <Input
            name="billing_last_name"
            defaultValue={cart?.billing_address?.last_name || ""}
            placeholder="姓"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          地址
        </label>
        <Input
          name="billing_address_1"
          defaultValue={cart?.billing_address?.address_1 || ""}
          placeholder="街道地址"
          autoComplete="address-line1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-1">
          地址 2 (可选)
        </label>
        <Input
          name="billing_address_2"
          defaultValue={cart?.billing_address?.address_2 || ""}
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
            name="billing_city"
            defaultValue={cart?.billing_address?.city || ""}
            placeholder="城市"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-1">
            邮编
          </label>
          <Input
            name="billing_postal_code"
            defaultValue={cart?.billing_address?.postal_code || ""}
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
          name="billing_country_code"
          defaultValue={cart?.billing_address?.country_code || ""}
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
    </div>
  )
}