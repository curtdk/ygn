"use client"

import { useState } from "react"
import { Container } from "@medusajs/ui"
import ServiceProviderApplication from "../components/service-provider-application"
import ReferralCode from "../components/referral-code"
import CommissionList from "../components/commission-list"
import EarningsList from "../components/earnings-list"

export default function DistributionTemplate() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Distribution Center</h1>
        <p className="text-gray-600">
          Manage your service provider business
        </p>
      </div>
      
      <div className="flex gap-2 mb-8 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "apply"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("apply")}
        >
          Become Provider
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "referral"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("referral")}
        >
          My Referral Code
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
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "earnings"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("earnings")}
        >
          My Earnings
        </button>
      </div>
      
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Become a Service Provider</h3>
              <p className="text-gray-600 mb-4">
                Join our network of professional service providers and earn money by delivering services.
              </p>
              <button
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setActiveTab("apply")}
              >
                Apply Now
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Refer & Earn</h3>
              <p className="text-gray-600 mb-4">
                Share your referral code and earn 10% commission on every purchase made by your referrals.
              </p>
              <button
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setActiveTab("referral")}
              >
                Get My Code
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Commission Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">10%</div>
                <div className="text-sm text-gray-500 mt-1">Level 1 Referral</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-blue-600">5%</div>
                <div className="text-sm text-gray-500 mt-1">Level 2 Referral</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-purple-600">2%</div>
                <div className="text-sm text-gray-500 mt-1">Level 3 Referral</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "apply" && <ServiceProviderApplication />}
      {activeTab === "referral" && <ReferralCode />}
      {activeTab === "commissions" && <CommissionList />}
      {activeTab === "earnings" && <EarningsList />}
    </Container>
  )
}