import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Users, Calendar, Link as LinkIcon, Zap, Save, Plus, PenTool, Sword, Search, X } from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge } from '../../App';

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
  
  if (!char) return <div>Character not found</div>;
  
  const factions = world.factions.filter(f => char.factionIds?.includes(f.id) || char.factionId === f.id);
  const items = world.items.filter(i => char.itemIds.includes(i.id));

  const handleEdit = () => {
    // 确保 factionIds 是数组格式
    const characterWithFactionIds = {
      ...char,
      factionIds: char.factionIds || (char.factionId ? [char.factionId] : [])
    };
    setEditedCharacter(characterWithFactionIds);
    setIsEditing(true);
  };

  const handleSave = () => {
    // 保存时移除可能存在的 factionId 字段，只保留 factionIds 数组
    const characterToSave = {
      ...editedCharacter
    };
    delete characterToSave.factionId;
    
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
    // 这里可以添加导航回人物列表的逻辑
  };

  const handleShare = () => {
    // 实现分享功能，例如复制链接到剪贴板
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
            // 更新现有关系
            newBonds = c.bonds.map(bond => 
              bond.characterId === selectedBond.characterId 
                ? selectedBond 
                : bond
            );
          } else {
            // 添加新关系
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8"
    >
      {/* 顶部保存按钮 */}
      <div className="flex justify-end">
        {isEditing && (
          <motion.button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-on-primary font-medium rounded-lg hover:bg-primary-dim transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            保存
          </motion.button>
        )}
      </div>

      {/* 顶部三列布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：头像、姓名、年龄、等级、标签 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="w-full aspect-square rounded-2xl bg-surface-container-high overflow-hidden shadow-lg">
            <img src={`https://picsum.photos/seed/${char.id}/400/400`} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          
          <div className="space-y-4">
            <motion.div 
              key={isEditing ? 'edit-name' : 'view-name'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editedCharacter.name}
                  onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                  className="w-full text-2xl font-bold border-b-2 border-primary outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-center">{char.name}</h1>
              )}
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">年龄</label>
                    <input
                      type="text"
                      value={editedCharacter.age}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter, age: e.target.value })}
                      className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">等级</label>
                    <input
                      type="text"
                      value={editedCharacter.level || ''}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter, level: e.target.value })}
                      className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-surface-container-low rounded-lg text-center">
                    <p className="text-sm font-medium">年龄</p>
                    <p className="text-lg font-bold">{char.age}</p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-lg text-center">
                    <p className="text-sm font-medium">等级</p>
                    <p className="text-lg font-bold">{char.level || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-3">标签</label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
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
                      className="px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`标签${i+1}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {char.traits?.map((trait, index) => (
                    <div key={index} className="p-3 bg-surface-container-low rounded-lg text-center">
                      <p className="text-sm font-medium">标签{index+1}</p>
                      <p className="font-bold">{trait}</p>
                    </div>
                  )) || Array(6).fill(0).map((_, i) => (
                    <div key={i} className="p-3 bg-surface-container-low rounded-lg text-center">
                      <p className="text-sm font-medium">标签{i+1}</p>
                      <p className="text-on-surface-variant/40">-</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 中间：简介 */}
        <div className="lg:col-span-1">
          <div className="h-full bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">简介</h2>
            {isEditing ? (
              <textarea
                value={editedCharacter.bio}
                onChange={(e) => setEditedCharacter({ ...editedCharacter, bio: e.target.value })}
                className="w-full h-full px-4 py-3 bg-surface rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="人物简介"
              />
            ) : (
              <p className="text-on-surface-variant/80 leading-relaxed">{char.bio || '暂无简介'}</p>
            )}
          </div>
        </div>
        
        {/* 右侧：力量体系、武力值雷达图 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">力量体系</h2>
            <div className="space-y-2">
              {['修为境界', '灵力质量', '神魂强度', '肉身强度', '功法神通', '法宝外物', '心性机缘'].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-surface rounded-lg">
                  <span className="text-sm">{index+1}. {item}</span>
                  {isEditing ? (
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
                      className="w-24"
                    />
                  ) : (
                    <span className="text-sm font-medium">{char.powerStats?.[item] || 50}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">武力值雷达图</h2>
            <div className="aspect-square flex items-center justify-center">
              <div className="text-on-surface-variant/40 text-sm">雷达图占位</div>
            </div>
          </div>
        </div>
      </div>

      {/* 中间三列布局：羁绊关系、所属势力、持有物品 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 羁绊关系 */}
        <div className="bg-surface-container-high rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">羁绊关系</h2>
            </div>
            <button 
              onClick={() => {
                setSelectedBond({ characterId: '', type: '', friendlyValue: 50, hostileValue: 0 });
                setIsRelationshipModalOpen(true);
              }}
              className="p-2 text-primary hover:bg-primary/10 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {char.bonds && char.bonds.length > 0 ? (
              char.bonds.map(bond => {
                const target = world.characters.find(c => c.id === bond.characterId);
                return (
                  <div key={bond.characterId} className="flex items-center gap-4 p-3 bg-surface rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img src={`https://picsum.photos/seed/${bond.characterId}/100/100`} alt={target?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{target?.name}</p>
                      <p className="text-xs text-on-surface-variant/60">{bond.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditRelationship(bond)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full"
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-error hover:bg-error/10 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-on-surface-variant/40 italic">暂无羁绊关系</p>
            )}
          </div>
        </div>
        
        {/* 所属势力 */}
        <div className="bg-surface-container-high rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 3.84L18.16 7 12 9.16 5.84 7 12 5.84zm0 12.32l-6.16-3.43L12 14.32l6.16 3.43-6.16 3.43z"/>
              </svg>
              <h2 className="text-lg font-bold">所属势力</h2>
            </div>
            <button className="p-2 text-primary hover:bg-primary/10 rounded-full">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {factions.map(faction => (
              <div key={faction.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="text-xl font-bold">{faction.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{faction.name}</p>
                  <p className="text-xs text-on-surface-variant/60">势力成员</p>
                </div>
                <button className="p-2 text-primary hover:bg-primary/10 rounded-full">
                  <PenTool className="w-4 h-4" />
                </button>
              </div>
            ))}
            {factions.length === 0 && <p className="text-sm text-on-surface-variant/40 italic">暂无所属势力</p>}
          </div>
        </div>
        
        {/* 持有物品 */}
        <div className="bg-surface-container-high rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">持有物品</h2>
            </div>
            <button className="p-2 text-primary hover:bg-primary/10 rounded-full">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="text-xl">⚔️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-on-surface-variant/60">{item.type}</p>
                </div>
                <button className="p-2 text-primary hover:bg-primary/10 rounded-full">
                  <PenTool className="w-4 h-4" />
                </button>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-on-surface-variant/40 italic">暂无持有物品</p>}
          </div>
        </div>
      </div>

      {/* 底部：大事记 */}
      <div className="bg-surface-container-high rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">大事记</h2>
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
              className="p-2 text-primary hover:bg-primary/10 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            editedCharacter.milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 p-3 bg-surface rounded-lg">
                <div className="w-20 flex-shrink-0">
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => {
                      const newMilestones = [...editedCharacter.milestones];
                      newMilestones[index] = { ...newMilestones[index], year: e.target.value };
                      setEditedCharacter({ ...editedCharacter, milestones: newMilestones });
                    }}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="事件"
                  />
                </div>
                <button
                  onClick={() => {
                    const newMilestones = editedCharacter.milestones.filter((_, i) => i !== index);
                    setEditedCharacter({ ...editedCharacter, milestones: newMilestones });
                  }}
                  className="p-2 text-error hover:bg-error/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            char.milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 p-3 bg-surface rounded-lg">
                <div className="w-20 flex-shrink-0">
                  <p className="text-sm font-medium">{milestone.year}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{milestone.event}</p>
                </div>
              </div>
            ))
          )}
          {char.milestones.length === 0 && <p className="text-sm text-on-surface-variant/40 italic">暂无大事记</p>}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4">
        <button 
          onClick={handleShare}
          className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4 inline mr-2" /> 分享
        </button>
        <button 
          onClick={handleEdit}
          className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4 inline mr-2" /> 编辑
        </button>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 inline mr-2" /> 删除
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
                className="flex-1 px-6 py-3 rounded-lg bg-error text-on-error font-medium hover:bg-error-dim transition-colors"
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
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h2 className="text-2xl font-bold mb-4">分享成功</h2>
            <p className="text-on-surface-variant/80 mb-6">分享链接已复制到剪贴板</p>
            <div className="flex justify-center">
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="px-8 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors"
              >
                确定
              </button>
            </div>
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
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">编辑羁绊关系</h2>
              <button 
                onClick={() => setIsRelationshipModalOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 目标角色 */}
              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">目标角色</label>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索角色..."
                      className="w-full px-4 py-2 pl-10 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {world.characters
                      .filter(c => c.id !== id && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 6)
                      .map(character => (
                        <div
                          key={character.id}
                          className={`p-3 bg-surface-container-low rounded-lg cursor-pointer transition-colors ${selectedBond.characterId === character.id ? 'ring-2 ring-primary' : 'hover:bg-surface-container-high'}`}
                          onClick={() => setSelectedBond({ ...selectedBond, characterId: character.id })}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-2">
                            <img src={`https://picsum.photos/seed/${character.id}/100/100`} alt={character.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-center text-sm font-medium">{character.name}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* 关系类型 */}
              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">关系类型</label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={selectedBond.type}
                    onChange={(e) => setSelectedBond({ ...selectedBond, type: e.target.value })}
                    placeholder="例如：朋友、敌人、家人..."
                    className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 友好值和仇恨值 */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-3">关系值</label>
                <div className="bg-surface-container-low rounded-xl p-4 space-y-6">
                  {/* 友好值 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💫</span>
                        <span className="font-medium text-green-600">友好值</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{selectedBond.friendlyValue}</span>
                        <span className="text-sm text-on-surface-variant/60">/100</span>
                      </div>
                    </div>
                    {/* 滑块 */}
                    <div className="w-full relative">
                      {/* 背景条 */}
                      <div 
                        className="w-full h-2 bg-surface-container rounded-full"
                        style={{
                          background: `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${selectedBond.friendlyValue}%, #4ade80 ${selectedBond.friendlyValue}%, #4ade80 100%)`
                        }}
                      ></div>
                      {/* 滑块 */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedBond.friendlyValue}
                        onChange={(e) => setSelectedBond({ ...selectedBond, friendlyValue: parseInt(e.target.value) })}
                        className="w-full h-8 bg-transparent appearance-none cursor-pointer absolute top-0 left-0"
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      />
                      <style>
                        {`
                          input[type="range"]::-webkit-slider-runnable-track {
                            width: 100%;
                            height: 8px;
                            cursor: pointer;
                            background: #e2e8f0;
                            border-radius: 4px;
                          }
                          input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                            background: #333;
                            border-radius: 50%;
                            margin-top: -4px;
                          }
                          input[type="range"]::-moz-range-track {
                            width: 100%;
                            height: 8px;
                            cursor: pointer;
                            background: #e2e8f0;
                            border-radius: 4px;
                          }
                          input[type="range"]::-moz-range-thumb {
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                            background: #333;
                            border-radius: 50%;
                            border: none;
                          }
                        `}
                      </style>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant/40 mt-2">
                      <span>疏离</span>
                      <span>生死相依</span>
                    </div>
                  </div>
                  
                  {/* 仇恨值 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚔️</span>
                        <span className="font-medium text-red-600">仇恨值</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{selectedBond.hostileValue}</span>
                        <span className="text-sm text-on-surface-variant/60">/100</span>
                      </div>
                    </div>
                    {/* 滑块 */}
                    <div className="w-full relative">
                      {/* 背景条 */}
                      <div 
                        className="w-full h-2 bg-surface-container rounded-full"
                        style={{
                          background: `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${selectedBond.hostileValue}%, #f87171 ${selectedBond.hostileValue}%, #f87171 100%)`
                        }}
                      ></div>
                      {/* 滑块 */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedBond.hostileValue}
                        onChange={(e) => setSelectedBond({ ...selectedBond, hostileValue: parseInt(e.target.value) })}
                        className="w-full h-8 bg-transparent appearance-none cursor-pointer absolute top-0 left-0"
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant/40 mt-2">
                      <span>无仇恨</span>
                      <span>不死不休</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 摘要预览 */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-3">摘要预览</label>
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-sm">
                    {char.name} 与 
                    {world.characters.find(c => c.id === selectedBond.characterId)?.name || '目标角色'} 
                    是{selectedBond.type}关系，
                    友好值为{selectedBond.friendlyValue}，
                    仇恨值为{selectedBond.hostileValue}。
                  </p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant/30">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CharacterDetailView;