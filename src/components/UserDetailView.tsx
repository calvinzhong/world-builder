import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import useTranslation from '../i18n/useTranslation';
import {
  Edit3,
  Globe,
  FileText,
  BookOpen,
  Award,
  Lock,
  LogOut,
  ChevronDown,
  Shield,
  Clock,
  MapPin,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  lastLogin: string;
  location: string;
  statistics: {
    worldsCreated: number;
    totalWords: number;
    novelsPublished: number;
    achievements: string[];
  };
}

const mockUser: User = {
  id: 'u1',
  name: '星辰作家',
  email: 'writer@example.com',
  avatar: 'https://picsum.photos/seed/author/200/200',
  bio: '在字里行间编织宇宙，在无垠的虚空中捕捉灵感的微光。愿文字成为指引，通往那未曾触及的世界深处。',
  joinedDate: '2023-01-15',
  lastLogin: '2025年03月24日 14:30',
  location: '北京, 中国',
  statistics: {
    worldsCreated: 5,
    totalWords: 120000,
    novelsPublished: 2,
    achievements: ['初心作者', '世界构建大师', '码字达人', '创意先锋', '故事编织者']
  }
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number | string;
  label: string;
  delay: number;
}> = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-surface-container-lowest rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <div className="text-3xl font-bold text-on-surface mb-1">{value}</div>
    <div className="text-xs text-on-surface-variant/60 uppercase tracking-wider">{label}</div>
  </motion.div>
);

const UserDetailView: React.FC = () => {
  const [user, setUser] = React.useState<User>(mockUser);
  const [isEditingAvatar, setIsEditingAvatar] = React.useState(false);
  const [showAllAchievements, setShowAllAchievements] = React.useState(false);
  const { language, setLanguage } = useTheme();
  const { t } = useTranslation();

  const displayedAchievements = showAllAchievements 
    ? user.statistics.achievements 
    : user.statistics.achievements.slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto pb-16"
    >
      {/* 头部区域 - 用户资料 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        {/* 头像 */}
        <div className="relative inline-block mb-6">
          <motion.div 
            className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl ring-4 ring-surface-container-lowest"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {/* 编辑头像按钮 */}
          <motion.button 
            onClick={() => setIsEditingAvatar(true)}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface-container-high rounded-xl shadow-lg flex items-center justify-center hover:bg-surface-container-high/80 transition-colors border border-outline-variant/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 className="w-4 h-4 text-on-surface-variant" />
          </motion.button>
        </div>

        {/* 用户名 */}
        <h1 className="text-4xl font-bold text-on-surface mb-3">{user.name}</h1>
        
        {/* 邮箱 */}
        <p className="text-on-surface-variant/60 mb-6 text-lg">{user.email}</p>
        
        {/* 简介 */}
        <div className="max-w-lg mx-auto">
          <p className="text-base text-on-surface-variant/50 leading-relaxed italic">
            "{user.bio}"
          </p>
        </div>
      </motion.div>

      {/* 统计数据区域 */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={<Globe className="w-6 h-6 text-primary" />}
          value={user.statistics.worldsCreated}
          label="世界数量"
          delay={0.1}
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-primary" />}
          value={user.statistics.totalWords.toLocaleString()}
          label="总字数"
          delay={0.2}
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-primary" />}
          value={user.statistics.novelsPublished}
          label="发布小说"
          delay={0.3}
        />
      </div>

      {/* 成就荣誉区域 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">成就荣誉</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {displayedAchievements.map((achievement, index) => (
            <motion.span 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="px-5 py-2.5 bg-surface-container-low rounded-full text-sm text-on-surface-variant border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-high transition-all cursor-default"
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary/60" />
                {achievement}
              </span>
            </motion.span>
          ))}
          {!showAllAchievements && user.statistics.achievements.length > 3 && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setShowAllAchievements(true)}
              className="px-5 py-2.5 bg-surface-container-low rounded-full text-sm text-primary border border-outline-variant/10 hover:bg-surface-container-high transition-colors"
            >
              +{user.statistics.achievements.length - 3} 其他
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 账户设置区域 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-on-surface mb-2">账户设置</h2>
          <p className="text-sm text-on-surface-variant/50">管理您的偏好与安全选项</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 语言设置 */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-3">
              语言 (Language)
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-surface border border-outline-variant/20 rounded-xl text-on-surface appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'zh-CN' | 'en-US')}
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
            <p className="text-xs text-on-surface-variant/40 mt-3 leading-relaxed">
              选择您的主要界面语言，部分由AI翻译的内容可能存在偏差。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-4">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-on-surface font-medium transition-colors border border-outline-variant/10"
            >
              <Lock className="w-5 h-5" />
              修改密码
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-on-surface font-medium transition-colors border border-outline-variant/10"
            >
              <LogOut className="w-5 h-5" />
              退出登录
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 页面底部信息 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant/40 gap-4"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>最后登录: {user.lastLogin}</span>
          <span className="mx-1">·</span>
          <MapPin className="w-4 h-4" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary/60" />
          <span>账号已通过"创造世界"高级认证</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailView;
