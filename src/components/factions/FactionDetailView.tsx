import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit3, Share2, Trash2, Users, Shield, Link as LinkIcon, Save, X, ArrowLeft,
  Crown, Star, Target, Swords, Heart, BookOpen, Plus, PenTool, Search,
  Frown, Sparkles, Handshake, UserX
} from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge } from '../../App';

const FactionDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { world, setWorld } = useWorld();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFaction, setEditedFaction] = useState({
    name: '',
    description: '',
    leader: '',
    strengths: [] as string[],
    weaknesses: [] as string[],
    level: 1,
    relationships: [] as any[]
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLeaderSelectorOpen, setIsLeaderSelectorOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRelationship, setSelectedRelationship] = useState({
    factionId: '',
    type: 'neutral'
  });
  
  const faction = world.factions.find(f => f.id === id);
  
  if (!faction) return <div>势力不存在</div>;
  
  const relatedCharacters = world.characters.filter(char => char.factionIds?.includes(faction.id));
  const otherFactions = world.factions.filter(f => f.id !== id);

  const handleEdit = () => {
    setEditedFaction({
      name: faction.name,
      description: faction.description,
      leader: faction.leader || '',
      strengths: faction.strengths || [],
      weaknesses: faction.weaknesses || [],
      level: faction.level || 1,
      relationships: faction.relationships || []
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      factions: prevWorld.factions.map(f => 
        f.id === id ? { ...f, ...editedFaction } : f
      )
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      factions: prevWorld.factions.filter(f => f.id !== id),
      characters: prevWorld.characters.map(char => {
        if (char.factionIds && char.factionIds.includes(faction.id)) {
          return {
            ...char,
            factionIds: char.factionIds.filter(fid => fid !== faction.id)
          };
        }
        return char;
      })
    }));
    setIsDeleteModalOpen(false);
    window.history.back();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/factions/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsShareModalOpen(true);
    });
  };

  const handleAddRelationship = () => {
    if (!selectedRelationship.factionId) return;
    
    const exists = editedFaction.relationships.some(r => r.factionId === selectedRelationship.factionId);
    if (!exists) {
      setEditedFaction(prev => ({
        ...prev,
        relationships: [...prev.relationships, selectedRelationship]
      }));
    }
    setIsRelationshipModalOpen(false);
    setSelectedRelationship({ factionId: '', type: 'neutral' });
  };

  const handleRemoveRelationship = (factionId: string) => {
    setEditedFaction(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r.factionId !== factionId)
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
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

      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-stretch gap-6">
          <div className="w-28 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 aspect-square ring-4 ring-primary/10">
            <span className="text-5xl font-bold text-primary">{faction.name.charAt(0)}</span>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="mb-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editedFaction.name}
                  onChange={(e) => setEditedFaction({ ...editedFaction, name: e.target.value })}
                  className="text-3xl font-bold border-b-2 border-primary outline-none bg-transparent w-full"
                  placeholder="势力名称"
                />
              ) : (
                <h1 className="text-3xl font-bold">{faction.name}</h1>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                <Users className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="text-sm text-on-surface-variant">{relatedCharacters.length} 成员</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                <Star className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm text-primary font-medium">
                  {isEditing ? (
                    <select
                      value={editedFaction.level}
                      onChange={(e) => setEditedFaction({ ...editedFaction, level: parseInt(e.target.value) })}
                      className="bg-transparent outline-none cursor-pointer"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(l => (
                        <option key={l} value={l}>等级 {l}</option>
                      ))}
                    </select>
                  ) : (
                    `等级 ${faction.level || 1}`
                  )}
                </span>
              </div>

              {faction.leader && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-sm text-amber-600 font-medium">{faction.leader}</span>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                <Swords className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="text-sm text-on-surface-variant">{faction.relationships?.length || 0} 外交关系</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsLeaderSelectorOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 text-sm rounded-lg hover:bg-amber-500/20 transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    {editedFaction.leader || '选择首领'}
                  </button>
                  <button
                    onClick={() => setIsRelationshipModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加关系
                  </button>
                  {editedFaction.relationships.map(rel => {
                    const target = world.factions.find(f => f.id === rel.factionId);
                    if (!target) return null;
                    return (
                      <div key={rel.factionId} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high text-sm rounded-lg">
                        <span>{target.name}</span>
                        <Badge 
                          color={
                            rel.type === 'ally' ? 'bg-success/10 text-success' :
                            rel.type === 'hostile' ? 'bg-error/10 text-error' :
                            'bg-surface-container-high text-on-surface-variant'
                          }
                          className="text-xs"
                        >
                          {rel.type === 'ally' ? '盟友' : rel.type === 'hostile' ? '敌对' : '中立'}
                        </Badge>
                        <button onClick={() => handleRemoveRelationship(rel.factionId)} className="ml-1 hover:text-error">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {faction.strengths?.map((strength, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-success/10 text-success text-sm rounded-lg">
                      {strength}
                    </span>
                  ))}
                  {faction.weaknesses?.map((weakness, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-error/10 text-error text-sm rounded-lg">
                      {weakness}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-outline-variant/30">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: '简介', icon: BookOpen },
            { id: 'members', label: '成员列表', icon: Users },
            { id: 'relationships', label: '外交关系', icon: Handshake },
            { id: 'strengths', label: '优缺点', icon: Target }
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

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">势力简介</h2>
              </div>
              {isEditing ? (
                <textarea
                  value={editedFaction.description}
                  onChange={(e) => setEditedFaction({ ...editedFaction, description: e.target.value })}
                  className="w-full h-48 px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  placeholder="势力简介"
                />
              ) : (
                <p className="text-on-surface-variant/80 leading-relaxed">
                  {faction.description || '暂无简介。点击编辑按钮添加势力背景、宗旨、历史等信息。'}
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">成员列表</h2>
                </div>
                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors">
                  <Plus className="w-4 h-4" />
                  添加成员
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedCharacters.map((char) => (
                  <Link
                    key={char.id}
                    to={`/characters/${char.id}`}
                    className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${char.id}`} 
                        alt={char.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-on-surface truncate">{char.name}</p>
                        {faction.leader === char.name && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant">{char.age}岁 · {char.gender || '未知'}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <PenTool className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  </Link>
                ))}
                {relatedCharacters.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无成员</p>
                  </div>
                )}
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
                  <Handshake className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">外交关系</h2>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => setIsRelationshipModalOpen(true)}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加关系
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faction.relationships?.map((rel) => {
                  const target = world.factions.find(f => f.id === rel.factionId);
                  if (!target) return null;
                  return (
                    <Link
                      key={rel.factionId}
                      to={`/factions/${target.id}`}
                      className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{target.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-on-surface truncate">{target.name}</p>
                        <Badge 
                          color={
                            rel.type === 'ally' ? 'bg-success/10 text-success' :
                            rel.type === 'hostile' ? 'bg-error/10 text-error' :
                            'bg-surface-container-high text-on-surface-variant'
                          }
                        >
                          {rel.type === 'ally' ? '盟友' : rel.type === 'hostile' ? '敌对' : '中立'}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
                {(!faction.relationships || faction.relationships.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <Handshake className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无外交关系</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'strengths' && (
          <motion.div
            key="strengths"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-success" />
                  <h2 className="text-xl font-bold">优点</h2>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    {[0, 1, 2, 3, 4].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={editedFaction.strengths[i] || ''}
                        onChange={(e) => {
                          const newStrengths = [...editedFaction.strengths];
                          newStrengths[i] = e.target.value;
                          setEditedFaction({ ...editedFaction, strengths: newStrengths.filter(Boolean) });
                        }}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={`优点${i+1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {faction.strengths?.map((strength, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <Sparkles className="w-4 h-4 text-success" />
                        <span className="text-success">{strength}</span>
                      </div>
                    ))}
                    {(!faction.strengths || faction.strengths.length === 0) && (
                      <div className="text-center py-8">
                        <Sparkles className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-2" />
                        <p className="text-on-surface-variant/60 text-sm">暂无优点</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Frown className="w-5 h-5 text-error" />
                  <h2 className="text-xl font-bold">缺点</h2>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    {[0, 1, 2, 3, 4].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={editedFaction.weaknesses[i] || ''}
                        onChange={(e) => {
                          const newWeaknesses = [...editedFaction.weaknesses];
                          newWeaknesses[i] = e.target.value;
                          setEditedFaction({ ...editedFaction, weaknesses: newWeaknesses.filter(Boolean) });
                        }}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={`缺点${i+1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {faction.weaknesses?.map((weakness, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-error/10 rounded-lg">
                        <Frown className="w-4 h-4 text-error" />
                        <span className="text-error">{weakness}</span>
                      </div>
                    ))}
                    {(!faction.weaknesses || faction.weaknesses.length === 0) && (
                      <div className="text-center py-8">
                        <Frown className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-2" />
                        <p className="text-on-surface-variant/60 text-sm">暂无缺点</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <p className="text-on-surface-variant/80 mb-6">你确定要删除这个势力吗？此操作不可撤销。</p>
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

      {isLeaderSelectorOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLeaderSelectorOpen(false);
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">选择首领</h2>
              <button 
                onClick={() => setIsLeaderSelectorOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索成员..."
                className="w-full px-4 py-2 pl-10 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
              {relatedCharacters
                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(char => (
                  <div
                    key={char.id}
                    className={`p-3 bg-surface-container-low rounded-lg cursor-pointer transition-all border-2 ${
                      editedFaction.leader === char.name 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent hover:border-outline-variant'
                    }`}
                    onClick={() => {
                      setEditedFaction({ ...editedFaction, leader: char.name });
                      setIsLeaderSelectorOpen(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-2">
                      <img 
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${char.id}`} 
                        alt={char.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-on-surface truncate">{char.name}</p>
                  </div>
                ))
              }
              {relatedCharacters.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <Users className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-2" />
                  <p className="text-on-surface-variant/60 text-sm">未找到成员</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

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
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">添加外交关系</h2>
              <button 
                onClick={() => setIsRelationshipModalOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">目标势力</label>
                <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
                  {otherFactions.map(f => (
                    <div
                      key={f.id}
                      className={`p-3 bg-surface-container-low rounded-lg cursor-pointer transition-all border-2 ${
                        selectedRelationship.factionId === f.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent hover:border-outline-variant'
                      }`}
                      onClick={() => setSelectedRelationship({ ...selectedRelationship, factionId: f.id })}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-sm font-bold text-primary">{f.name.charAt(0)}</span>
                      </div>
                      <p className="text-center text-xs font-medium text-on-surface truncate">{f.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">关系类型</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ally', label: '盟友', icon: Handshake, color: 'bg-success/10 text-success border-success' },
                    { id: 'neutral', label: '中立', icon: Shield, color: 'bg-surface-container-high text-on-surface-variant border-outline-variant' },
                    { id: 'hostile', label: '敌对', icon: Swords, color: 'bg-error/10 text-error border-error' }
                  ].map(type => (
                    <div
                      key={type.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedRelationship.type === type.id 
                          ? type.color 
                          : 'border-transparent bg-surface-container-low hover:border-outline-variant'
                      }`}
                      onClick={() => setSelectedRelationship({ ...selectedRelationship, type: type.id })}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-center text-sm font-medium">{type.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsRelationshipModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-outline-variant/50 font-medium hover:bg-surface-container-low transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddRelationship}
                disabled={!selectedRelationship.factionId}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认添加
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FactionDetailView;
