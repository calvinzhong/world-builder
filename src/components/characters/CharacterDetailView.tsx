import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit3, Share2, Trash2, Calendar, Link as LinkIcon, 
  Zap, Save, Plus, PenTool, Sword, Search, X, ArrowLeft, 
  User, Star, Shield, Crown, Heart, Sparkles, BookOpen,
  Home, Users, Handshake, GraduationCap, Swords, Target,
  Frown, Skull, Trophy, UserX, Briefcase, UserCog,
  Home as HomeIcon, Users as Users2, Heart as HeartFill, Sword as SwordIcon,
  Handshake as HandshakeIcon, Frown as FrownIcon, Skull as SkullIcon,
  Target as TargetIcon, UserX as UserMinus, User as UserIcon,
  Briefcase as BriefcaseIcon, UserCog as UserSettings,
  Crown as CrownIcon, Sparkles as SparklesIcon
} from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge } from '../../App';
import { AvatarPreview } from '../AvatarPreview';

const CharacterDetailView = () => {
  const { id } = useParams();
  const { world, setWorld } = useWorld();
  const char = world.characters.find(c => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState({
    id: '',
    name: '',
    age: '',
    traits: [] as string[],
    milestones: [] as any[],
    bonds: [] as any[],
    factionIds: [] as string[],
    itemIds: [] as string[]
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState({
    characterId: '',
    type: '',
    friendlyValue: 50,
    hostileValue: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('power');
  const [avatarPreview, setAvatarPreview] = useState<{ isOpen: boolean; imageUrl: string; alt?: string }>({ isOpen: false, imageUrl: '' });
  
  if (!char) return <div>Character not found</div>;
  
  const factions = world.factions.filter(f => char.factionIds?.includes(f.id) || char.factionId === f.id);
  const items = world.items.filter(i => char.itemIds?.includes(i.id));

  const handleEdit = () => {
    const characterWithFactionIds = {
      ...char,
      factionIds: char.factionIds || (char.factionid ? [char.factionid] : [])
    };
    setEditedCharacter(characterWithFactionIds);
    setIsEditing(true);
  };

  const handleSave = () => {
    const characterToSave = {
      ...editedCharacter
    };
    delete characterToSave.factionid;
    
    setWorld(prevWorld => ({
      ...prevWorld,
      characters: prevWorld.characters.map(c => c.id === id ? characterToSave : c)
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      characters: prevWorld.characters.filter(c => c.id !== id)
    }));
    setIsDeleteModalOpen(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/characters/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsShareModalOpen(true);
    });
  };

  const handleEditRelationship = (bond) => {
    setSelectedBond({
      characterId: bond.characterId,
      type: bond.type,
      friendlyValue: bond.friendlyValue || 50,
      hostileValue: bond.hostileValue || 0
    });
    setIsRelationshipModalOpen(true);
  };

  const handleSaveRelationship = () => {
    if (!selectedBond.characterId) return;
    
    setWorld(prevWorld => {
      const newCharacters = prevWorld.characters.map(c => {
        if (c.id === id) {
          const bondExists = c.bonds.some(bond => bond.characterId === selectedBond.characterId);
          let newBonds;
          
          if (bondExists) {
            newBonds = c.bonds.map(bond => 
              bond.characterId === selectedBond.characterId 
                ? selectedBond 
                : bond
            );
          } else {
            newBonds = [...c.bonds, selectedBond];
          }
          
          return { ...c, bonds: newBonds };
        }
        return c;
      });
      return { ...prevWorld, characters: newCharacters };
    });
    setIsRelationshipModalOpen(false);
  };

  const handleSliderDrag = (e, type) => {
    e.preventDefault();
    const slider = e.currentTarget.parentElement.parentElement.parentElement;
    const rect = slider.getBoundingClientRect();
    
    const handleMouseMove = (moveEvent) => {
      const x = moveEvent.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      if (type === 'hostile') {
        // 仇恨值：中间0，左边100，右边0
        const hostileValue = percentage <= 50 ? Math.round((50 - percentage) * 2) : 0;
        setSelectedBond(prev => ({ ...prev, hostileValue }));
      } else {
        // 友好值：中间0，右边100
        const friendlyValue = percentage >= 50 ? Math.round((percentage - 50) * 2) : 0;
        setSelectedBond(prev => ({ ...prev, friendlyValue }));
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSliderClick = (e) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    if (percentage < 50) {
      // 点击左半边：设置仇恨值
      setSelectedBond(prev => ({ ...prev, hostileValue: Math.round((50 - percentage) * 2), friendlyValue: 0 }));
    } else {
      // 点击右半边：设置友好值
      setSelectedBond(prev => ({ ...prev, friendlyValue: Math.round((percentage - 50) * 2), hostileValue: 0 }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Header - 与势力详情页保持一致 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
        </button>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <Save className="w-5 h-5 text-primary" />
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleEdit}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <Edit3 className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <Share2 className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <Trash2 className="w-5 h-5 text-on-surface-variant" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-8">
            <div 
              className="w-32 h-32 rounded-2xl bg-surface-container-high overflow-hidden ring-4 ring-primary/10 flex-shrink-0 cursor-pointer"
              onClick={() => {
                const avatarUrl = world.avatarConfigs.find(config => config.id === char.avatarConfigId)?.baseUrl || 'https://api.dicebear.com/7.x/lorelei/svg';
                setAvatarPreview({ isOpen: true, imageUrl: avatarUrl, alt: char.name });
              }}
            >
              <img 
                src={`${world.avatarConfigs.find(config => config.id === char.avatarConfigId)?.baseUrl || 'https://api.dicebear.com/7.x/lorelei/svg'}`} 
                alt={char.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedCharacter.name}
                  onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                  className="text-4xl font-bold border-b-2 border-primary outline-none bg-transparent"
                  placeholder="人物名称"
                />
              ) : (
                <h1 className="text-4xl font-bold">{char.name}</h1>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3 h-3 text-on-surface-variant" />
                </div>
                <span className="text-sm text-on-surface-variant/70">年龄</span>
                <span className="font-medium">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCharacter.age}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter, age: e.target.value })}
                      className="w-16 bg-transparent outline-none"
                      placeholder="年龄"
                    />
                  ) : char.age}
                </span>
              </div>
              {factions.map(faction => (
                <div key={faction.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-on-surface-variant" />
                  </div>
                  <span className="text-sm text-on-surface-variant/70">所属势力</span>
                  <span className="font-medium">{faction.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                  <Sword className="w-3 h-3 text-on-surface-variant" />
                </div>
                <span className="text-sm text-on-surface-variant/70">持有物品</span>
                <span className="font-medium">{items.length} 件物品</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input
                      key={i}
                      type="text"
                      value={editedCharacter.traits[i] || ''}
                      onChange={(e) => {
                        const newTraits = [...editedCharacter.traits];
                        newTraits[i] = e.target.value;
                        setEditedCharacter({ ...editedCharacter, traits: newTraits.filter(Boolean) });
                      }}
                      className="px-2 py-0.5 bg-surface-container-low text-xs font-medium rounded border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder={`标签${i+1}`}
                    />
                  ))}
                </div>
              ) : (
                char.traits?.map((trait, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 bg-surface-container-low text-xs font-medium rounded text-on-surface-variant"
                  >
                    #{trait}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 人物简介 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">人物简介</h2>
        </div>
        {isEditing ? (
          <textarea
            value={editedCharacter.bio}
            onChange={(e) => setEditedCharacter({ ...editedCharacter, bio: e.target.value })}
            className="w-full h-48 px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
            placeholder="人物简介"
          />
        ) : (
          <p className="text-on-surface-variant/80 leading-relaxed">
            {char.bio || '暂无简介。点击编辑按钮添加人物背景故事、性格特点、经历等信息。'}
          </p>
        )}
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-outline-variant/30">
        <div className="flex gap-6">
          {[
            { id: 'power', label: '力量体系', icon: Zap },
            { id: 'relationships', label: '羁绊关系', icon: Heart },
            { id: 'factions', label: '所属势力', icon: Shield },
            { id: 'items', label: '持有物品', icon: Sword },
            { id: 'timeline', label: '大事记', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">

        {activeTab === 'power' && (
          <motion.div
            key="power"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">力量体系</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {['修为境界', '灵力质量', '神魂强度', '肉身强度', '功法神通', '法宝外物', '心性机缘'].map((item) => (
                    <div key={item} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-on-surface">{item}</span>
                        <span className="text-sm font-bold text-primary">{char.powerStats?.[item] || 50}</span>
                      </div>
                      {isEditing && (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editedCharacter.powerStats?.[item] || 50}
                          onChange={(e) => {
                            const newPowerStats = { ...editedCharacter.powerStats };
                            newPowerStats[item] = parseInt(e.target.value);
                            setEditedCharacter({ ...editedCharacter, powerStats: newPowerStats });
                          }}
                          className="w-full h-2 bg-surface-container-low rounded-full appearance-none cursor-pointer"
                        />
                      )}
                      {!isEditing && (
                        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${char.powerStats?.[item] || 50}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-surface-container-low rounded-lg p-6 flex flex-col items-center justify-center">
                  <h3 className="text-sm font-medium text-on-surface-variant mb-4">综合战力评估</h3>
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 border-2 border-primary/20 rounded-full"></div>
                      <div className="absolute inset-4 border-2 border-primary/30 rounded-full"></div>
                      <div className="absolute inset-8 border-2 border-primary/40 rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(((Object.values(char.powerStats || {}) as number[]).reduce((a: number, b: number) => a + b, 0) / 7) || 50)}
                        </div>
                        <div className="text-xs text-on-surface-variant mt-1">综合评分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'relationships' && (
          <motion.div
            key="relationships"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">羁绊关系</h2>
                </div>
                <button 
                  onClick={() => {
                    setSelectedBond({ characterId: '', type: '', friendlyValue: 50, hostileValue: 0 });
                    setIsRelationshipModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加关系
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {char.bonds && char.bonds.length > 0 ? (
                  char.bonds.map((bond) => {
                    const target = world.characters.find(c => c.id === bond.characterId);
                    return (
                      <div
                        key={bond.characterId}
                        className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-primary/5">
                          <img 
                            src={`${world.avatarConfigs.find(config => config.id === target?.avatarConfigId)?.baseUrl || 'https://api.dicebear.com/7.x/lorelei/svg'}`} 
                            alt={target?.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-on-surface truncate">{target?.name}</p>
                          <p className="text-sm text-on-surface-variant">{bond.type}</p>
                          <div className="flex gap-3 mt-1 text-xs text-on-surface-variant/60">
                            <span>💫 {bond.friendlyValue}</span>
                            <span>⚔️ {bond.hostileValue}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditRelationship(bond)}
                            className="p-1.5 rounded hover:bg-surface-container-lowest transition-colors"
                          >
                            <PenTool className="w-3.5 h-3.5 text-on-surface-variant" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-container-lowest transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-on-surface-variant" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Heart className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无羁绊关系</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'factions' && (
          <motion.div
            key="factions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">所属势力</h2>
                </div>
                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors">
                  <Plus className="w-4 h-4" />
                  添加势力
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factions.map((faction) => (
                  <div
                    key={faction.id}
                    className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/5">
                      <span className="text-xl font-bold text-primary">{faction.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-on-surface truncate">{faction.name}</p>
                      <p className="text-sm text-on-surface-variant">势力成员</p>
                      <div className="flex gap-3 mt-1 text-xs text-on-surface-variant/60">
                        <span>成员: {world.characters.filter(c => c.factionId === faction.id || c.factionIds?.includes(faction.id)).length}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded hover:bg-surface-container-lowest transition-colors">
                        <PenTool className="w-3.5 h-3.5 text-on-surface-variant" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-surface-container-lowest transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-on-surface-variant" />
                      </button>
                    </div>
                  </div>
                ))}
                {factions.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Shield className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无所属势力</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'items' && (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sword className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">持有物品</h2>
                </div>
                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors">
                  <Plus className="w-4 h-4" />
                  添加物品
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⚔️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-on-surface truncate">{item.name}</p>
                      <p className="text-sm text-on-surface-variant">{item.type}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded hover:bg-surface-container-lowest transition-colors">
                        <PenTool className="w-3.5 h-3.5 text-on-surface-variant" />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Sword className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无持有物品</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">大事记</h2>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newMilestone = {
                        year: '',
                        event: ''
                      };
                      setEditedCharacter({ 
                        ...editedCharacter, 
                        milestones: [...editedCharacter.milestones, newMilestone] 
                      });
                    }}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加事件
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {isEditing ? (
                  editedCharacter.milestones.map((milestone, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-surface-container-low rounded-lg"
                    >
                      <div className="w-24 flex-shrink-0">
                        <input
                          type="text"
                          value={milestone.year}
                          onChange={(e) => {
                            const newMilestones = [...editedCharacter.milestones];
                            newMilestones[index] = { ...newMilestones[index], year: e.target.value };
                            setEditedCharacter({ ...editedCharacter, milestones: newMilestones });
                          }}
                          className="w-full px-3 py-2 bg-surface rounded-md border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          placeholder="年份"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={milestone.event}
                          onChange={(e) => {
                            const newMilestones = [...editedCharacter.milestones];
                            newMilestones[index] = { ...newMilestones[index], event: e.target.value };
                            setEditedCharacter({ ...editedCharacter, milestones: newMilestones });
                          }}
                          className="w-full px-3 py-2 bg-surface rounded-md border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          placeholder="事件"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newMilestones = editedCharacter.milestones.filter((_, i) => i !== index);
                          setEditedCharacter({ ...editedCharacter, milestones: newMilestones });
                        }}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  char.milestones.map((milestone, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors"
                    >
                      <div className="w-24 flex-shrink-0">
                        <Badge>{milestone.year}</Badge>
                      </div>
                      <div className="flex-1">
                        <p className="text-on-surface">{milestone.event}</p>
                      </div>
                    </div>
                  ))
                )}
                {char.milestones.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无大事记</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDeleteModalOpen(false);
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h2 className="text-2xl font-bold mb-4">确认删除</h2>
            <p className="text-on-surface-variant/80 mb-6">你确定要删除这个人物吗？此操作不可撤销。</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-outline-variant/50 font-medium hover:bg-surface-container-low transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-lg bg-error text-white font-medium hover:opacity-90 transition-colors"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Share Success Modal */}
      {isShareModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsShareModalOpen(false);
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">分享成功</h2>
            <p className="text-on-surface-variant/80 mb-6 text-center">分享链接已复制到剪贴板</p>
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="w-full px-8 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors"
            >
              确定
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Relationship Edit Modal */}
      {isRelationshipModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsRelationshipModalOpen(false);
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">编辑羁绊关系</h2>
              <button 
                onClick={() => setIsRelationshipModalOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 摘要预览 - 移到顶部 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface-variant mb-3">摘要预览</label>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
                <p className="text-sm text-on-surface">
                  <span className="font-bold text-blue-600">{char.name}</span> 与 
                  <span className="font-bold text-blue-600">{world.characters.find(c => c.id === selectedBond.characterId)?.name || '目标人物'}</span> 
                  是<span className="font-bold text-amber-600">{selectedBond.type || '未知'}</span>关系，
                  友好值为<span className="font-bold text-green-600">{selectedBond.friendlyValue}</span>，
                  仇恨值为<span className="font-bold text-error">{selectedBond.hostileValue}</span>。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：目标人物选择 */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-on-surface-variant">目标人物</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索..."
                      className="w-40 px-2 py-1.5 pl-7 text-xs bg-surface-container-low rounded border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-on-surface-variant/40 w-3 h-3" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
                  {world.characters
                    .filter(c => c.id !== id && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(character => (
                      <div
                        key={character.id}
                        className={`p-2 bg-surface-container-low rounded-lg cursor-pointer transition-all border-2 ${
                          selectedBond.characterId === character.id 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-outline-variant'
                        }`}
                        onClick={() => setSelectedBond({ ...selectedBond, characterId: character.id })}
                      >
                        <div 
                          className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 ring-4 ring-primary/5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            const avatarUrl = world.avatarConfigs.find(config => config.id === character.avatarConfigId)?.baseUrl || 'https://api.dicebear.com/7.x/lorelei/svg';
                            setAvatarPreview({ isOpen: true, imageUrl: avatarUrl, alt: character.name });
                          }}
                        >
                          <img 
                            src={`${world.avatarConfigs.find(config => config.id === character.avatarConfigId)?.baseUrl || 'https://api.dicebear.com/7.x/lorelei/svg'}`} 
                            alt={character.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <p className="text-center text-xs font-medium text-on-surface truncate">{character.name}</p>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* 右侧：关系类型选择 */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-on-surface-variant">关系类型</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索..."
                      className="w-40 px-2 py-1.5 pl-7 text-xs bg-surface-container-low rounded border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-on-surface-variant/40 w-3 h-3" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
                  {[
                    { id: '家人', Icon: HomeIcon, color: 'text-primary' },
                    { id: '朋友', Icon: Users2, color: 'text-primary' },
                    { id: '恋人', Icon: HeartFill, color: 'text-primary' },
                    { id: '师徒', Icon: GraduationCap, color: 'text-primary' },
                    { id: '战友', Icon: Swords, color: 'text-primary' },
                    { id: '盟友', Icon: HandshakeIcon, color: 'text-primary' },
                    { id: '敌人', Icon: FrownIcon, color: 'text-primary' },
                    { id: '仇人', Icon: SkullIcon, color: 'text-primary' },
                    { id: '竞争对手', Icon: TargetIcon, color: 'text-primary' },
                    { id: '陌生人', Icon: UserMinus, color: 'text-primary' },
                    { id: '熟人', Icon: UserIcon, color: 'text-primary' },
                    { id: '上下级', Icon: BriefcaseIcon, color: 'text-primary' },
                    { id: '同事', Icon: UserSettings, color: 'text-primary' },
                    { id: '主仆', Icon: CrownIcon, color: 'text-primary' },
                    { id: '其他', Icon: SparklesIcon, color: 'text-primary' }
                  ].filter(type => type.id.toLowerCase().includes(searchQuery.toLowerCase())).map(type => (
                    <div
                      key={type.id}
                      className={`p-2 bg-surface-container-low rounded-lg cursor-pointer transition-all border-2 text-center ${
                        selectedBond.type === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent hover:border-outline-variant'
                      }`}
                      onClick={() => setSelectedBond({ ...selectedBond, type: type.id })}
                    >
                      <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <type.Icon className="w-8 h-8" />
                      </div>
                      <p className="text-center text-xs font-medium text-on-surface truncate">{type.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 关系值 - 放在底部 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-on-surface-variant mb-3">关系值</label>
              <div className="bg-surface-container-low rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Skull className="w-5 h-5 text-error" />
                    <span className="font-medium text-error">仇恨值</span>
                    <span className="text-lg font-bold text-error">{selectedBond.hostileValue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">{selectedBond.friendlyValue}</span>
                    <span className="font-medium text-green-600">友好值</span>
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="relative h-12 mb-4 cursor-pointer" onClick={handleSliderClick}>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-3 bg-gradient-to-r from-error via-gray-300 to-green-500 rounded-full" />
                  
                  <div className="absolute inset-0 flex items-center justify-center px-2">
                    <div className="relative w-full h-8">
                      <div 
                        className="absolute top-0 w-8 h-8 bg-error rounded-full shadow-lg cursor-pointer flex items-center justify-center transform hover:scale-110 transition-transform z-10"
                        style={{ left: `calc(50% - ${selectedBond.hostileValue / 2}% - 16px)` }}
                        onMouseDown={(e) => handleSliderDrag(e, 'hostile')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-white text-xs font-bold">{selectedBond.hostileValue}</span>
                      </div>
                      <div 
                        className="absolute top-0 w-8 h-8 bg-green-500 rounded-full shadow-lg cursor-pointer flex items-center justify-center transform hover:scale-110 transition-transform z-10"
                        style={{ left: `calc(50% + ${selectedBond.friendlyValue / 2}% - 16px)` }}
                        onMouseDown={(e) => handleSliderDrag(e, 'friendly')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-white text-xs font-bold">{selectedBond.friendlyValue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-on-surface-variant/60">
                  <span>不死不休</span>
                  <span>中立</span>
                  <span>生死相依</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 justify-end mt-6 pt-4 border-t border-outline-variant/30">
              <button 
                onClick={() => setIsRelationshipModalOpen(false)}
                className="px-6 py-3 rounded-lg border border-outline-variant/50 font-medium hover:bg-surface-container-low transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveRelationship}
                className="px-6 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors"
              >
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AvatarPreview
        isOpen={avatarPreview.isOpen}
        onClose={() => setAvatarPreview({ isOpen: false, imageUrl: '' })}
        imageUrl={avatarPreview.imageUrl}
        alt={avatarPreview.alt}
      />
    </motion.div>
  );
};

export default CharacterDetailView;