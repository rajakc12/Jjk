import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  BookOpen, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Save,
  Trophy,
  Target,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { db, doc, setDoc } from '../firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  medium?: string;
  exam?: string;
  bio?: string;
  targetYear?: string;
}

export const Profile = ({ profile, onUpdate }: { profile: UserProfile | null, onUpdate: (p: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(profile);
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  const handleSave = async () => {
    if (!editedProfile) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', profile.uid), editedProfile, { merge: true });
      onUpdate(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="glass-card overflow-hidden">
        <div className="h-32 bg-stone-900 relative">
          <div className="absolute -bottom-12 left-8">
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt={profile.displayName || 'User'} 
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-stone-100 border-4 border-white shadow-lg flex items-center justify-center">
                <User className="text-stone-400" size={40} />
              </div>
            )}
          </div>
        </div>
        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-serif text-stone-900">{profile.displayName}</h1>
            <p className="text-stone-500 flex items-center gap-2 mt-1">
              <Mail size={14} /> {profile.email}
            </p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isEditing 
                ? 'bg-amber-500 text-stone-900 hover:bg-amber-400' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {saving ? 'Saving...' : isEditing ? <><Save size={18} /> Save Profile</> : <><Edit3 size={18} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Progress */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold font-serif mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" /> Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                <span className="text-sm text-stone-500">Tests Taken</span>
                <span className="font-bold text-stone-900">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                <span className="text-sm text-stone-500">Avg. Score</span>
                <span className="font-bold text-stone-900">78%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                <span className="text-sm text-stone-500">Global Rank</span>
                <span className="font-bold text-amber-600">#42</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold font-serif mb-6 flex items-center gap-2">
              <Target size={20} className="text-amber-500" /> Study Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-stone-500">Daily Goal (4h)</span>
                  <span className="font-bold">75%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-stone-500">Weekly Mock Test</span>
                  <span className="font-bold text-green-600">Done</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold font-serif mb-8 border-b border-stone-100 pb-4">Aspirant Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={14} /> Target Exam
                </label>
                {isEditing ? (
                  <select 
                    value={editedProfile?.exam || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, exam: e.target.value})}
                    className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="UPSC">UPSC (Civil Services)</option>
                    <option value="PSC">PSC (State Services)</option>
                  </select>
                ) : (
                  <p className="text-stone-900 font-medium">{profile.exam || 'Not specified'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe size={14} /> Preferred Medium
                </label>
                {isEditing ? (
                  <select 
                    value={editedProfile?.medium || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, medium: e.target.value})}
                    className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                ) : (
                  <p className="text-stone-900 font-medium">{profile.medium || 'Not specified'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Target Year
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    placeholder="e.g. 2026"
                    value={editedProfile?.targetYear || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, targetYear: e.target.value})}
                    className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-stone-900 font-medium">{profile.targetYear || 'Not specified'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} /> Account Status
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-stone-900 font-medium">Verified Aspirant</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <Edit3 size={14} /> About Me / Bio
              </label>
              {isEditing ? (
                <textarea 
                  rows={4}
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile({...editedProfile!, bio: e.target.value})}
                  placeholder="Tell us about your preparation journey..."
                  className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                ></textarea>
              ) : (
                <p className="text-stone-600 text-sm leading-relaxed italic">
                  {profile.bio || 'No bio added yet. Tell us about your journey!'}
                </p>
              )}
            </div>
          </div>

          <div className="glass-card p-8 bg-stone-900 text-stone-100">
            <h3 className="text-xl font-bold font-serif mb-6">Preparation Timeline</h3>
            <div className="space-y-6">
              {[
                { date: 'March 2026', event: 'Mains Answer Writing Practice', status: 'In Progress' },
                { date: 'Jan 2026', event: 'Optional Subject Completion', status: 'Completed' },
                { date: 'Oct 2025', event: 'Joined AI Prep Hub', status: 'Completed' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    {i !== 2 && <div className="w-px h-full bg-stone-700"></div>}
                  </div>
                  <div className="pb-6">
                    <div className="text-xs text-stone-500 font-bold">{item.date}</div>
                    <div className="text-sm font-medium">{item.event}</div>
                    <div className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mt-1">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
