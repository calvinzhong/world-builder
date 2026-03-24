import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Badge } from '../App';
import { useTheme } from '../context/ThemeContext';
import useTranslation from '../i18n/useTranslation';
import {
  User as UserIcon,
  Edit,
  Save,
  Calendar,
  BookOpen,
  Award,
  Settings,
  LogOut
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  statistics: {
    worldsCreated: number;
    totalWords: number;
    novelsPublished: number;
    achievements: string[];
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'zh-CN' | 'en-US';
  };
}

const mockUser: User = {
  id: 'u1',
  name: '星辰作家',
  email: 'writer@example.com',
  avatar: 'https://picsum.photos/seed/author/200/200',
  bio: '热爱创造奇幻世界的作家，专注于构建复杂的世界观和引人入胜的故事情节。',
  joinedDate: '2023-01-15',
  statistics: {
    worldsCreated: 5,
    totalWords: 120000,
    novelsPublished: 2,
    achievements: ['初心者作家', '世界构建大师', '码字达人']
  },
  preferences: {
    theme: 'light',
    language: 'zh-CN'
  }
};

const UserDetailView: React.FC = () => {
  const [user, setUser] = React.useState<User>(mockUser);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: user.name,
    bio: user.bio
  });
  const { theme, setTheme, language, setLanguage } = useTheme();
  const { t } = useTranslation();

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio
    }));
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader 
        title={t('user.title')} 
        actions={
          isEditing ? (
            <button 
              onClick={handleSave} 
              className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> {t('user.save')}
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg border border-outline-variant"
            >
              <Edit className="w-4 h-4" /> {t('user.editProfile')}
            </button>
          )
        }
      />

      {/* User Profile Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="relative flex flex-col items-center text-center pt-16 pb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-lg mb-6">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {isEditing ? (
            <div className="w-full max-w-md space-y-4">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="w-full p-3 bg-surface-container-low border border-outline-variant/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-bold"
              />
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                className="w-full p-3 bg-surface-container-low border border-outline-variant/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center"
                rows={3}
              />
            </div>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <h2 className="text-3xl font-bold text-on-surface">{user.name}</h2>
              <p className="text-on-surface-variant/80">{user.email}</p>
              <p className="text-on-surface-variant/60 mt-4">{user.bio}</p>
              <div className="flex items-center gap-2 justify-center mt-2">
                <Calendar className="w-4 h-4 text-on-surface-variant/40" />
                <span className="text-sm text-on-surface-variant/40">{t('user.joinedOn')} {user.joinedDate}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card title={t('user.stats')}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-on-surface-variant/60 text-sm">{t('user.worldsCreated')}</p>
                <p className="text-2xl font-bold">{user.statistics.worldsCreated}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-on-surface-variant/60 text-sm">{t('user.totalWords')}</p>
                <p className="text-2xl font-bold">{user.statistics.totalWords.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-on-surface-variant/60 text-sm">{t('user.novelsPublished')}</p>
                <p className="text-2xl font-bold">{user.statistics.novelsPublished}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title={t('user.achievements')}>
          <div className="flex flex-wrap gap-2">
            {user.statistics.achievements.map((achievement, index) => (
              <Badge key={index} color="bg-primary/10 text-primary">
                {achievement}
              </Badge>
            ))}
          </div>
        </Card>

        <Card title={t('user.settings')}>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
              <span className="text-on-surface">{t('user.theme')}</span>
              <select 
                className="bg-surface border border-outline-variant/5 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              >
                <option value="light">{t('user.theme.light')}</option>
                <option value="dark">{t('user.theme.dark')}</option>
                <option value="system">{t('user.theme.system')}</option>
              </select>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
              <span className="text-on-surface">{t('user.language')}</span>
              <select 
                className="bg-surface border border-outline-variant/5 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'zh-CN' | 'en-US')}
              >
                <option value="zh-CN">{t('user.language.zhCN')}</option>
                <option value="en-US">{t('user.language.enUS')}</option>
              </select>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-error/10 text-error rounded-md font-medium hover:bg-error/20 transition-colors">
              <LogOut className="w-4 h-4" />
              {t('user.logout')}
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default UserDetailView;