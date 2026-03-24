import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Users, Calendar, Link as LinkIcon, Zap, Save } from 'lucide-react';
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-8">
          <div className="w-48 h-48 rounded-2xl bg-surface-container-high overflow-hidden shadow-lg">
            <img src={`https://picsum.photos/seed/${char.id}/400/400`} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
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
                    className="text-4xl font-bold border-b-2 border-primary outline-none"
                  />
                ) : (
                  <h1 className="text-4xl font-bold">{char.name}</h1>
                )}
              </motion.div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button onClick={handleSave} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <Save className="w-5 h-5 text-primary" />
                  </button>
                ) : (
                  <button onClick={handleEdit} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <Edit3 className="w-5 h-5 text-on-surface-variant" />
                  </button>
                )}
                <button onClick={handleShare} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                  <Share2 className="w-5 h-5 text-on-surface-variant" />
                </button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                  <Trash2 className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            </div>
            <motion.div 
              key={isEditing ? 'edit-age' : 'view-age'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-4"
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editedCharacter.age}
                  onChange={(e) => setEditedCharacter({ ...editedCharacter, age: e.target.value })}
                  className="px-3 py-1 bg-surface-container-high rounded-md text-sm"
                />
              ) : (
                <p className="text-on-surface-variant/60">{char.age}岁 · 前空岛守卫军副团长</p>
              )}
            </motion.div>
            <motion.div 
              key={isEditing ? 'edit-traits' : 'view-traits'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editedCharacter.traits.join(', ')}
                  onChange={(e) => setEditedCharacter({ 
                    ...editedCharacter, 
                    traits: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  placeholder="输入特质，用逗号分隔"
                  className="w-full px-3 py-2 bg-surface-container-high rounded-md text-sm"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {char.traits.map(trait => (
                    <Badge key={trait} color="bg-surface-container-high text-on-surface-variant">{trait}</Badge>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div 
              key={isEditing ? 'edit-factions' : 'view-factions'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-6"
            >
              {isEditing ? (
                <select
                  multiple
                  value={editedCharacter.factionIds || []}
                  onChange={(e) => {
                    const selectElement = e.target as HTMLSelectElement;
                    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
                    setEditedCharacter({ ...editedCharacter, factionIds: selectedOptions });
                  }}
                  className="w-full px-3 py-2 bg-surface-container-high rounded-md text-sm h-32"
                >
                  {world.factions.map(faction => (
                    <option key={faction.id} value={faction.id}>{faction.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {factions.map(faction => (
                    <Badge key={faction.id} color="bg-primary-container text-on-primary-container">{faction.name}</Badge>
                  ))}
                </div>
              )}
            </motion.div>
            <p className="text-on-surface-variant/80 leading-relaxed">
              诞生于浮空群岛最深处的阴影之中，她是唯一一个在"大觉醒"仪式中幸存的守卫。
              背负着被诅咒的力量，她在云海与虚空之间徘徊，寻找着破碎星剑的真相。她的存在本身就是对秩序的挑战。
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Social Bonds */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="羁绊关系 SOCIAL BONDS">
            <div className="space-y-6">
              <motion.div
                key={isEditing ? 'edit-bonds' : 'view-bonds'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isEditing ? (
                  editedCharacter.bonds.map((bond, index) => {
                    const target = world.characters.find(c => c.id === bond.characterId);
                    return (
                      <div key={bond.characterId} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={`https://picsum.photos/seed/${bond.characterId}/100/100`} alt={target?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <select
                            value={bond.characterId}
                            onChange={(e) => {
                              const newBonds = [...editedCharacter.bonds];
                              newBonds[index] = { ...newBonds[index], characterId: e.target.value };
                              setEditedCharacter({ ...editedCharacter, bonds: newBonds });
                            }}
                            className="w-full px-2 py-1 bg-surface-container-high rounded-md text-xs mb-1"
                          >
                            {world.characters.filter(c => c.id !== id).map(character => (
                              <option key={character.id} value={character.id}>{character.name}</option>
                            ))}
                          </select>
                          <div className="flex justify-between items-center mb-1">
                            <input
                              type="text"
                              value={bond.type}
                              onChange={(e) => {
                                const newBonds = [...editedCharacter.bonds];
                                newBonds[index] = { ...newBonds[index], type: e.target.value };
                                setEditedCharacter({ ...editedCharacter, bonds: newBonds });
                              }}
                              className="px-2 py-1 bg-surface-container-high rounded-md text-xs"
                              placeholder="关系类型"
                            />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={bond.value}
                              onChange={(e) => {
                                const newBonds = [...editedCharacter.bonds];
                                newBonds[index] = { ...newBonds[index], value: parseInt(e.target.value) };
                                setEditedCharacter({ ...editedCharacter, bonds: newBonds });
                              }}
                              className="w-24 mx-2"
                            />
                            <span className="text-sm font-bold text-primary min-w-[30px]">{bond.value}</span>
                          </div>
                          <button
                            onClick={() => {
                              const newBonds = editedCharacter.bonds.filter((_, i) => i !== index);
                              setEditedCharacter({ ...editedCharacter, bonds: newBonds });
                            }}
                            className="text-xs text-error hover:text-error-dim transition-colors"
                          >
                            删除羁绊
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  char.bonds.map(bond => {
                    const target = world.characters.find(c => c.id === bond.characterId);
                    return (
                      <div key={bond.characterId} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={`https://picsum.photos/seed/${bond.characterId}/100/100`} alt={target?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm">{target?.name}</span>
                            <span className="text-sm font-bold text-primary">{bond.value}</span>
                          </div>
                          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${bond.value}%` }} />
                          </div>
                          <p className="text-xs text-on-surface-variant/60 mt-1">{bond.type}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
              {char.bonds.length === 0 && <p className="text-sm text-on-surface-variant/40 italic">暂无羁绊关系</p>}
              {isEditing && (
                <motion.button 
                  onClick={() => {
                    const newBond = {
                      characterId: world.characters[0]?.id || '',
                      type: '朋友',
                      value: 50
                    };
                    setEditedCharacter({ 
                      ...editedCharacter, 
                      bonds: [...editedCharacter.bonds, newBond] 
                    });
                  }}
                  className="w-full px-4 py-2 bg-surface-container-low rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Plus className="w-4 h-4" /> 添加新羁绊
                </motion.button>
              )}
            </div>
          </Card>

          <Card title="关联模组 CROSS-MODULE">
            <div className="space-y-4">
              {factions.map(faction => (
                <Link key={faction.id} to={`/factions/${faction.id}`} className="block hover:bg-surface-container-high/50 transition-colors">
                  <div className="p-4 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <h4 className="font-bold">{faction.name}</h4>
                    </div>
                    <p className="text-xs text-on-surface-variant/60">所属势力</p>
                  </div>
                </Link>
              ))}
              {items.map(item => (
                <Link key={item.id} to={`/items/${item.id}`} className="block hover:bg-surface-container-high/50 transition-colors">
                  <div className="p-4 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <h4 className="font-bold">{item.name}</h4>
                    </div>
                    <p className="text-xs text-on-surface-variant/60">{item.type}</p>
                  </div>
                </Link>
              ))}
              {(factions.length === 0 && items.length === 0) && <p className="text-xs text-on-surface-variant/40">无关联模组</p>}
            </div>
          </Card>
        </div>

        {/* Right Column - Chronicle Milestones */}
        <div className="lg:col-span-2">
          <Card title="大事记里程碑 CHRONICLE MILESTONES">
            <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
              {char.milestones.map((m, index) => (
                <div key={m.id} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-surface border-4 border-primary shadow-sm" />
                  <div className="bg-surface-container-low rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold">{m.title}</h4>
                      <Badge color="bg-surface-container-high text-on-surface-variant">Age {index + 1}</Badge>
                    </div>
                    <p className="text-on-surface-variant/80 leading-relaxed mb-4">{m.description}</p>
                    <div className="h-40 bg-surface-container-high rounded-lg flex items-center justify-center">
                      <span className="text-on-surface-variant/40 text-sm">事件图像</span>
                    </div>
                  </div>
                </div>
              ))}
              {char.milestones.length === 0 && <p className="text-sm text-on-surface-variant/40 italic">暂无里程碑事件</p>}
            </div>
          </Card>
        </div>
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
    </motion.div>
  );
};

export default CharacterDetailView;