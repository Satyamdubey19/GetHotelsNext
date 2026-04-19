'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import SectionCard from '@/components/ui/SectionCard'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Heart,
  MessageSquare,
  Camera,
  Edit2,
  Save,
  X,
  Clock,
  Briefcase,
  Settings,
  LogOut,
  Copy,
  CheckCircle,
  Shield,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  CreditCard,
  Download,
  Trash2,
  Link2,
  ChevronRight,
  Plane,
  Languages,
  Moon,
  Sun,
  Wallet,
  AlertTriangle,
  Star,
  Menu,
} from 'lucide-react'

type SettingsTab = 'profile' | 'account' | 'preferences' | 'notifications' | 'privacy' | 'danger'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar: string
  joinDate: string
  verified: boolean
  bookings: number
  reviews: number
  posts: number
  likes: number
  rating: number
  dateOfBirth: string
  gender: string
  nationality: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  website: string
  instagram: string
  twitter: string
  travelStyle: string
  preferredCurrency: string
  preferredLanguage: string
  dietaryPreferences: string
  passportNumber: string
  frequentFlyerNumber: string
}

interface NotificationSettings {
  emailBooking: boolean
  emailPromotions: boolean
  emailNewsletter: boolean
  emailReviews: boolean
  pushBooking: boolean
  pushMessages: boolean
  pushDeals: boolean
  smsBooking: boolean
  smsAlerts: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  showActivity: boolean
  twoFactorEnabled: boolean
  loginAlerts: boolean
}

const sidebarTabs: { key: SettingsTab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'profile', label: 'Profile', icon: <User size={20} />, color: 'text-blue-600' },
  { key: 'account', label: 'Account', icon: <Settings size={20} />, color: 'text-indigo-600' },
  { key: 'preferences', label: 'Preferences', icon: <Globe size={20} />, color: 'text-purple-600' },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={20} />, color: 'text-green-600' },
  { key: 'privacy', label: 'Privacy & Security', icon: <Shield size={20} />, color: 'text-amber-600' },
  { key: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={20} />, color: 'text-red-600' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'USR-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Travel enthusiast and photography lover. Always exploring new destinations! 🌍',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    joinDate: '2021-06-15',
    verified: true,
    bookings: 24,
    reviews: 18,
    posts: 12,
    likes: 456,
    rating: 4.8,
    dateOfBirth: '1992-03-15',
    gender: 'Male',
    nationality: 'American',
    address: '123 Broadway, Apt 4B, New York, NY 10001',
    emergencyContactName: 'Sarah Johnson',
    emergencyContactPhone: '+1 (555) 987-6543',
    website: 'https://alexjohnson.travel',
    instagram: '@alexjtravels',
    twitter: '@alexj_travels',
    travelStyle: 'Adventure',
    preferredCurrency: 'USD',
    preferredLanguage: 'English',
    dietaryPreferences: 'No restrictions',
    passportNumber: '•••••••7891',
    frequentFlyerNumber: 'AA-9876543',
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailBooking: true,
    emailPromotions: false,
    emailNewsletter: true,
    emailReviews: true,
    pushBooking: true,
    pushMessages: true,
    pushDeals: false,
    smsBooking: true,
    smsAlerts: false,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showActivity: true,
    twoFactorEnabled: false,
    loginAlerts: true,
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [savedToast, setSavedToast] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setUserProfile(parsed)
      setEditedProfile(parsed)
    }
    const savedNotifications = localStorage.getItem('notificationSettings')
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
    const savedPrivacy = localStorage.getItem('privacySettings')
    if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy))
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setUserProfile(editedProfile)
    localStorage.setItem('userProfile', JSON.stringify(editedProfile))
    setIsEditMode(false)
    setIsSaving(false)
    showSavedToast()
  }

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications))
    showSavedToast()
  }

  const handleSavePrivacy = () => {
    localStorage.setItem('privacySettings', JSON.stringify(privacy))
    showSavedToast()
  }

  const showSavedToast = () => {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(userProfile.id)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const profile = isMounted ? userProfile : null

  if (!profile) return null

  const renderProfileTab = () => (
    <div>
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -right-32 w-96 h-96 bg-white rounded-full mix-blend-screen" />
            <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-white rounded-full mix-blend-screen" />
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-1 right-1 p-1.5 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
                <Camera size={14} />
              </button>
              {profile.verified && (
                <CheckCircle size={22} className="absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span>
                <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" />{profile.rating}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditMode(!isEditMode)
                if (isEditMode) setEditedProfile(profile)
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              {isEditMode ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-xl font-bold text-blue-600">{profile.bookings}</div>
              <div className="text-xs text-slate-500">Bookings</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-xl font-bold text-green-600">{profile.reviews}</div>
              <div className="text-xs text-slate-500">Reviews</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <div className="text-xl font-bold text-purple-600">{profile.posts}</div>
              <div className="text-xs text-slate-500">Posts</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <div className="text-xl font-bold text-red-600">{profile.likes}</div>
              <div className="text-xs text-slate-500">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <SectionCard title="Personal Information" description="Your basic personal details">
        {!isEditMode ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: profile.name, icon: <User size={16} className="text-blue-600" /> },
              { label: 'Email', value: profile.email, icon: <Mail size={16} className="text-blue-600" /> },
              { label: 'Phone', value: profile.phone, icon: <Phone size={16} className="text-green-600" /> },
              { label: 'Date of Birth', value: new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: <Calendar size={16} className="text-purple-600" /> },
              { label: 'Gender', value: profile.gender, icon: <User size={16} className="text-indigo-600" /> },
              { label: 'Nationality', value: profile.nationality, icon: <Globe size={16} className="text-amber-600" /> },
              { label: 'Location', value: profile.location, icon: <MapPin size={16} className="text-red-600" /> },
              { label: 'Address', value: profile.address, icon: <MapPin size={16} className="text-slate-600" /> },
            ].map((field) => (
              <div key={field.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  {field.icon}
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{field.label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{field.value}</p>
              </div>
            ))}
            <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bio</span>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name' as const, type: 'text' },
                { label: 'Email', key: 'email' as const, type: 'email' },
                { label: 'Phone', key: 'phone' as const, type: 'tel' },
                { label: 'Date of Birth', key: 'dateOfBirth' as const, type: 'date' },
                { label: 'Location', key: 'location' as const, type: 'text' },
                { label: 'Nationality', key: 'nationality' as const, type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={editedProfile[field.key]}
                    onChange={e => setEditedProfile({ ...editedProfile, [field.key]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
                <select
                  value={editedProfile.gender}
                  onChange={e => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
                <input
                  type="text"
                  value={editedProfile.address}
                  onChange={e => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
              <textarea
                value={editedProfile.bio}
                onChange={e => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{editedProfile.bio.length}/200</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setIsEditMode(false); setEditedProfile(profile) }}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Emergency Contact */}
      <SectionCard title="Emergency Contact" description="Contact person in case of emergencies during travel">
        {!isEditMode ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact Name</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{profile.emergencyContactName}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact Phone</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{profile.emergencyContactPhone}</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Name</label>
              <input
                type="text"
                value={editedProfile.emergencyContactName}
                onChange={e => setEditedProfile({ ...editedProfile, emergencyContactName: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={editedProfile.emergencyContactPhone}
                onChange={e => setEditedProfile({ ...editedProfile, emergencyContactPhone: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        )}
      </SectionCard>

      {/* Social Links */}
      <SectionCard title="Social & Web" description="Your online presence">
        {!isEditMode ? (
          <div className="space-y-3">
            {[
              { label: 'Website', value: profile.website, icon: <Globe size={16} className="text-blue-600" /> },
              { label: 'Instagram', value: profile.instagram, icon: <Camera size={16} className="text-pink-600" /> },
              { label: 'Twitter', value: profile.twitter, icon: <MessageSquare size={16} className="text-sky-500" /> },
            ].map(link => (
              <div key={link.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {link.icon}
                <div>
                  <span className="text-xs text-slate-500">{link.label}</span>
                  <p className="text-sm font-medium text-slate-900">{link.value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Website', key: 'website' as const },
              { label: 'Instagram', key: 'instagram' as const },
              { label: 'Twitter', key: 'twitter' as const },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={editedProfile[field.key]}
                  onChange={e => setEditedProfile({ ...editedProfile, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Activity */}
      <SectionCard title="Your Activity" description="Quick overview of your engagement">
        <div className="space-y-3">
          {[
            { label: 'Active Bookings', sub: 'Current reservations', count: profile.bookings, icon: <Briefcase size={18} />, color: 'blue', href: '#' },
            { label: 'Reviews Written', sub: 'Share your experience', count: profile.reviews, icon: <MessageSquare size={18} />, color: 'green', href: '#' },
            { label: 'Contest Posts', sub: 'Your travel stories', count: profile.posts, icon: <Clock size={18} />, color: 'purple', href: '/posts' },
            { label: 'Likes Received', sub: 'Community engagement', count: profile.likes, icon: <Heart size={18} />, color: 'red', href: '#' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between p-4 bg-${item.color}-50 rounded-xl border border-${item.color}-100 hover:shadow-sm transition group`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${item.color}-100 rounded-lg text-${item.color}-600`}>{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-${item.color}-600 font-bold`}>{item.count}</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderAccountTab = () => (
    <div>
      {/* User ID */}
      <SectionCard title="User ID" description="Your unique account identifier">
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Account ID</p>
            <code className="font-mono text-sm font-bold text-slate-900">{profile.id}</code>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            {showCopied ? <><CheckCircle size={14} className="text-green-600" /> Copied!</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" description="Update your account password">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
          <button
            onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); showSavedToast() }}
            disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </SectionCard>

      {/* Connected Accounts */}
      <SectionCard title="Connected Accounts" description="Linked social and third-party services">
        <div className="space-y-3">
          {[
            { name: 'Google', email: 'alex.johnson@gmail.com', connected: true, color: 'bg-red-50 border-red-100' },
            { name: 'Facebook', email: 'Not connected', connected: false, color: 'bg-blue-50 border-blue-100' },
            { name: 'Apple', email: 'Not connected', connected: false, color: 'bg-slate-50 border-slate-200' },
          ].map(account => (
            <div key={account.name} className={`flex items-center justify-between p-4 rounded-xl border ${account.color}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                  <Link2 size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{account.name}</p>
                  <p className="text-xs text-slate-500">{account.email}</p>
                </div>
              </div>
              <button className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${account.connected ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}>
                {account.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Travel Documents */}
      <SectionCard title="Travel Documents" description="Passport and frequent flyer details">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={16} className="text-amber-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Passport</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{profile.passportNumber}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
            <div className="flex items-center gap-2 mb-1">
              <Plane size={16} className="text-sky-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Frequent Flyer</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{profile.frequentFlyerNumber}</p>
          </div>
        </div>
      </SectionCard>

      {/* Sessions */}
      <SectionCard title="Active Sessions" description="Devices currently logged into your account">
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', location: 'New York, USA', current: true, lastActive: 'Now' },
            { device: 'Safari on iPhone', location: 'New York, USA', current: false, lastActive: '2 hours ago' },
            { device: 'Firefox on MacBook', location: 'Boston, USA', current: false, lastActive: '3 days ago' },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {session.device}
                    {session.current && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">THIS DEVICE</span>}
                  </p>
                  <p className="text-xs text-slate-500">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition">Revoke</button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 transition">
          Log out of all other sessions
        </button>
      </SectionCard>
    </div>
  )

  const renderPreferencesTab = () => (
    <div>
      {/* Travel Preferences */}
      <SectionCard title="Travel Preferences" description="Help us personalize your experience">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Travel Style</label>
            <select
              value={userProfile.travelStyle}
              onChange={e => { const u = { ...userProfile, travelStyle: e.target.value }; setUserProfile(u); localStorage.setItem('userProfile', JSON.stringify(u)) }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition bg-white"
            >
              {['Adventure', 'Luxury', 'Budget', 'Family', 'Solo', 'Romantic', 'Cultural', 'Eco-friendly'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dietary Preferences</label>
            <select
              value={userProfile.dietaryPreferences}
              onChange={e => { const u = { ...userProfile, dietaryPreferences: e.target.value }; setUserProfile(u); localStorage.setItem('userProfile', JSON.stringify(u)) }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition bg-white"
            >
              {['No restrictions', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'Nut allergy'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Language & Region */}
      <SectionCard title="Language & Region" description="Set your preferred language and currency">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Language</label>
            <select
              value={userProfile.preferredLanguage}
              onChange={e => { const u = { ...userProfile, preferredLanguage: e.target.value }; setUserProfile(u); localStorage.setItem('userProfile', JSON.stringify(u)) }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition bg-white"
            >
              {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Currency</label>
            <select
              value={userProfile.preferredCurrency}
              onChange={e => { const u = { ...userProfile, preferredCurrency: e.target.value }; setUserProfile(u); localStorage.setItem('userProfile', JSON.stringify(u)) }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition bg-white"
            >
              {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'AED'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" description="Customize how the app looks">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-indigo-600" /> : <Sun size={20} className="text-amber-500" />}
            <div>
              <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
              <p className="text-xs text-slate-500">Switch between light and dark theme</p>
            </div>
          </div>
          <ToggleSwitch enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
      </SectionCard>

      {/* Payment Methods */}
      <SectionCard title="Payment Methods" description="Saved cards and wallets for quick checkout">
        <div className="space-y-3">
          {[
            { type: 'Visa', last4: '4242', expiry: '12/26', default: true },
            { type: 'Mastercard', last4: '8888', expiry: '03/25', default: false },
          ].map((card, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                  <CreditCard size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {card.type} •••• {card.last4}
                    {card.default && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">DEFAULT</span>}
                  </p>
                  <p className="text-xs text-slate-500">Expires {card.expiry}</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition">Remove</button>
            </div>
          ))}
          <button className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2">
            <Wallet size={16} />
            Add Payment Method
          </button>
        </div>
      </SectionCard>
    </div>
  )

  const renderNotificationsTab = () => (
    <div>
      {/* Email Notifications */}
      <SectionCard title="Email Notifications" description="Choose what emails you receive">
        <div className="space-y-4">
          {[
            { key: 'emailBooking' as const, label: 'Booking Confirmations', desc: 'Receive confirmation emails for bookings' },
            { key: 'emailPromotions' as const, label: 'Promotions & Offers', desc: 'Special deals and limited-time offers' },
            { key: 'emailNewsletter' as const, label: 'Newsletter', desc: 'Travel tips, guides, and inspiration' },
            { key: 'emailReviews' as const, label: 'Review Reminders', desc: 'Reminders to review your stays' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch enabled={notifications[item.key]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Push Notifications */}
      <SectionCard title="Push Notifications" description="Notifications on your device">
        <div className="space-y-4">
          {[
            { key: 'pushBooking' as const, label: 'Booking Updates', desc: 'Real-time booking status changes' },
            { key: 'pushMessages' as const, label: 'Messages', desc: 'New messages from hosts and travelers' },
            { key: 'pushDeals' as const, label: 'Flash Deals', desc: 'Time-sensitive offers and discounts' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch enabled={notifications[item.key]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* SMS Notifications */}
      <SectionCard title="SMS Notifications" description="Text message alerts">
        <div className="space-y-4">
          {[
            { key: 'smsBooking' as const, label: 'Booking Alerts', desc: 'SMS confirmations for bookings' },
            { key: 'smsAlerts' as const, label: 'Security Alerts', desc: 'Login and unusual activity alerts' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch enabled={notifications[item.key]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} />
            </div>
          ))}
        </div>
      </SectionCard>

      <button
        onClick={handleSaveNotifications}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Save Notification Preferences
      </button>
    </div>
  )

  const renderPrivacyTab = () => (
    <div>
      {/* Profile Visibility */}
      <SectionCard title="Profile Visibility" description="Control who can see your profile">
        <div className="space-y-3">
          {(['public', 'friends', 'private'] as const).map(vis => (
            <label
              key={vis}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${privacy.profileVisibility === vis ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <input
                type="radio"
                name="visibility"
                checked={privacy.profileVisibility === vis}
                onChange={() => setPrivacy({ ...privacy, profileVisibility: vis })}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 capitalize">{vis}</p>
                <p className="text-xs text-slate-500">
                  {vis === 'public' && 'Anyone can see your profile and activity'}
                  {vis === 'friends' && 'Only people you connect with can see your profile'}
                  {vis === 'private' && 'Your profile is hidden from everyone'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </SectionCard>

      {/* Information Visibility */}
      <SectionCard title="Information Visibility" description="Choose what information others can see">
        <div className="space-y-4">
          {[
            { key: 'showEmail' as const, label: 'Show Email Address', desc: 'Display your email on your public profile' },
            { key: 'showPhone' as const, label: 'Show Phone Number', desc: 'Display your phone on your public profile' },
            { key: 'showLocation' as const, label: 'Show Location', desc: 'Display your city on your public profile' },
            { key: 'showActivity' as const, label: 'Show Activity', desc: 'Display your bookings, reviews, and posts count' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch enabled={privacy[item.key]} onChange={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Two-Factor Authentication */}
      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <Lock size={20} className={privacy.twoFactorEnabled ? 'text-green-600' : 'text-slate-400'} />
            <div>
              <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">{privacy.twoFactorEnabled ? 'Your account is protected with 2FA' : 'Enable 2FA for enhanced security'}</p>
            </div>
          </div>
          <ToggleSwitch enabled={privacy.twoFactorEnabled} onChange={() => setPrivacy({ ...privacy, twoFactorEnabled: !privacy.twoFactorEnabled })} />
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Bell size={20} className={privacy.loginAlerts ? 'text-blue-600' : 'text-slate-400'} />
            <div>
              <p className="text-sm font-semibold text-slate-900">Login Alerts</p>
              <p className="text-xs text-slate-500">Get notified when someone logs into your account</p>
            </div>
          </div>
          <ToggleSwitch enabled={privacy.loginAlerts} onChange={() => setPrivacy({ ...privacy, loginAlerts: !privacy.loginAlerts })} />
        </div>
      </SectionCard>

      <button
        onClick={handleSavePrivacy}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Save Privacy Settings
      </button>
    </div>
  )

  const renderDangerTab = () => (
    <div>
      {/* Download Data */}
      <SectionCard title="Download Your Data" description="Export a copy of all your personal data">
        <p className="text-sm text-slate-600 mb-4">
          You can request a download of all the data we have on file for your account. This includes your profile information, booking history, reviews, and activity logs. The export will be prepared as a JSON file.
        </p>
        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Download size={16} />
          Request Data Export
        </button>
      </SectionCard>

      {/* Deactivate Account */}
      <SectionCard title="Deactivate Account" description="Temporarily disable your account">
        <p className="text-sm text-slate-600 mb-4">
          Deactivating your account will hide your profile and suspend all active bookings. You can reactivate at any time by logging in again.
        </p>
        <button className="px-5 py-2.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-200 transition flex items-center gap-2">
          <AlertTriangle size={16} />
          Deactivate Account
        </button>
      </SectionCard>

      {/* Delete Account */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <Trash2 size={20} />
            Delete Account Permanently
          </h3>
          <p className="text-sm text-slate-500 mt-1">This action is irreversible. All your data will be permanently deleted.</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
          <p className="text-sm text-red-700 font-medium mb-2">Deleting your account will:</p>
          <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
            <li>Remove all your personal information</li>
            <li>Cancel all active bookings</li>
            <li>Delete all reviews and posts</li>
            <li>Remove your payment methods</li>
            <li>Revoke all connected accounts</li>
          </ul>
        </div>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Type <code className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">DELETE</code> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg text-sm focus:outline-none focus:border-red-500 transition"
            />
            <div className="flex gap-3">
              <button
                disabled={deleteConfirmText !== 'DELETE'}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Deletion
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut size={20} className="text-slate-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Log Out</p>
              <p className="text-xs text-slate-500">Sign out of your account on this device</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab()
      case 'account': return renderAccountTab()
      case 'preferences': return renderPreferencesTab()
      case 'notifications': return renderNotificationsTab()
      case 'privacy': return renderPrivacyTab()
      case 'danger': return renderDangerTab()
    }
  }

  return (
    <>
      <Header />

      {/* Saved Toast */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-[slideIn_0.3s_ease]">
          <CheckCircle size={18} />
          Settings saved successfully!
        </div>
      )}

      <div className="min-h-screen bg-slate-50">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your profile, security, and preferences</p>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Mobile Tab Selector */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 mb-3"
              >
                <div className="flex items-center gap-3">
                  {sidebarTabs.find(t => t.key === activeTab)?.icon}
                  <span className="text-sm font-semibold text-slate-900">{sidebarTabs.find(t => t.key === activeTab)?.label}</span>
                </div>
                <Menu size={20} className="text-slate-400" />
              </button>

              <nav className={`bg-white rounded-xl border border-slate-200 overflow-hidden lg:block ${mobileMenuOpen ? 'block' : 'hidden'} lg:sticky lg:top-24`}>
                {sidebarTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-l-[3px] ${
                      activeTab === tab.key
                        ? `${tab.color} bg-slate-50 border-current font-semibold`
                        : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className={activeTab === tab.key ? tab.color : 'text-slate-400'}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Verified Badge (sidebar) */}
              {profile.verified && (
                <div className="hidden lg:block mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <h4 className="text-sm font-bold text-slate-900">Verified Member</h4>
                  </div>
                  <p className="text-xs text-slate-600">Your identity has been verified. Enjoy premium features.</p>
                </div>
              )}

              {/* User ID (sidebar) */}
              <div className="hidden lg:block mt-4 p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-slate-700">{profile.id}</code>
                  <button onClick={handleCopyId} className="text-slate-400 hover:text-blue-600 transition">
                    {showCopied ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
