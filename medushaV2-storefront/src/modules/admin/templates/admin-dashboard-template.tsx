"use client"

import { useState } from "react"
import { Container } from "@medusajs/ui"
import ServiceProviderApplications from "../components/service-provider-applications"
import ServiceProvidersList from "../components/service-providers"
import CommissionsAdmin from "../components/commissions"

export default function AdminDashboardTemplate() {
  const [activeTab, setActiveTab] = useState("applications")

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Service Provider Dashboard</h1>
        <p className="text-gray-600">
          Manage service providers and commissions
        </p>
      </div>
      
      <div className="flex gap-2 mb-8 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "providers"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("providers")}
        >
          Providers
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "commissions"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("commissions")}
        >
          Commissions
        </button>
      </div>
      
      {activeTab === "applications" && <ServiceProviderApplications />}
      {activeTab === "providers" && <ServiceProvidersList />}
      {activeTab === "commissions" && <CommissionsAdmin />}
    </Container>
  )
}