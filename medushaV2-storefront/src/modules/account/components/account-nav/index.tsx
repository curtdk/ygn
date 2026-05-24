"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

interface AccountNavProps {
  customer: HttpTypes.StoreCustomer
}

const AccountNav: React.FC<AccountNavProps> = ({ customer }) => {
  const pathname = usePathname()

  const navItems = [
    { href: "/account", label: "概览" },
    { href: "/account/profile", label: "个人信息" },
    { href: "/account/addresses", label: "地址" },
    { href: "/account/orders", label: "订单" },
    { href: "/account/service-provider", label: "服务商中心" },
    { href: "/account/distribution", label: "分销中心" },
    { href: "/account/team", label: "我的团队" },
  ]

  return (
    <div>
      <h3 className="text-small-semi text-ui-fg-muted mb-3 uppercase">account</h3>
      <div className="text-base-regular">
        <ul className="flex gap-x-6 flex-col gap-y-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clx(
                  "text-ui-fg-base hover:text-ui-fg-medium transition-colors",
                  pathname === item.href && "text-ui-fg-highlight font-semibold"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AccountNav