"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Save, Globe, Bell } from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: "KNEX Store",
        siteEmail: "admin@knex.bd",
        currency: "Tk",
        timezone: "Asia/Dhaka",
        notifications: true,
        orderEmails: true,
        lowStockAlert: true,
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert("Settings saved successfully!");
    };

    return (
        <ProtectedAdmin>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your application settings and preferences</p>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                            <p className="text-sm text-gray-500">Basic store information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Email</label>
                            <input
                                type="email"
                                value={settings.siteEmail}
                                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <input
                                type="text"
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                                <option value="UTC">UTC (GMT+0)</option>
                                <option value="America/New_York">America/New_York (GMT-5)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-500">Configure notification preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900">Enable Notifications</p>
                                <p className="text-sm text-gray-500">Receive system notifications</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900">Order Email Notifications</p>
                                <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.orderEmails}
                                onChange={(e) => setSettings({ ...settings, orderEmails: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900">Low Stock Alerts</p>
                                <p className="text-sm text-gray-500">Alert when products are running low</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.lowStockAlert}
                                onChange={(e) => setSettings({ ...settings, lowStockAlert: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                    <button className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
