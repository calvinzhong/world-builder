import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit3, Share2, Trash2, Sword, Zap, X, ArrowLeft, 
  Save, Plus, PenTool, Search, BookOpen, Star, 
  Shield, Crown, Sparkles, Calendar, User, Layers
} from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge } from '../../App';

const ItemDetailView = () => {
  const { id } = useParams();
  const { world, setWorld } = useWorld();
  const item = world.items.find(i => i.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({
    id: '',
    name: '',
    description: '',
    type: '',
    powerSystemId: '',
    rarity: '',
    origin: '',
    attributes: [] as { name: string; value: string }[]
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!item) return <div>物品未找到</div>;
  
  const powerSystem = world.powerSystems.find(p => p.id === item.powerSystemId);
  const relatedCharacters = world.characters.filter(c => c.itemIds?.includes(item.id));

  const handleEdit = () => {
    setEditedItem({
      ...item,
      rarity: item.rarity || '',
      origin: item.origin || '',
      attributes: item.attributes || []
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      items: prevWorld.items.map(i => i.id === id ? editedItem : i)
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      items: prevWorld.items.filter(i => i.id !== id)
    }));
    setIsDeleteModalOpen(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/items/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsShareModalOpen(true);
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '普通': return 'bg-gray-100 text-gray-700';
      case '稀有': return 'bg-blue-100 text-blue-700';
      case '史诗': return 'bg-purple-100 text-purple-700';
      case '传说': return 'bg-amber-100 text-amber-700';
      case '神话': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '神器': return '⚡';
      case '仙器': return '🌟';
      case '灵宝': return '💎';
      case '神兵': return '⚔️';
      case '丹药': return '💊';
      case '灵物': return '🔮';
      default: return '📦';
    }
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
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/10">
            <span className="text-5xl">{getTypeIcon(item.type)}</span>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="mb-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="text-3xl font-bold border-b-2 border-primary outline-none bg-transparent w-full"
                  placeholder="物品名称"
                />
              ) : (
                <h1 className="text-3xl font-bold">{item.name}</h1>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {isEditing ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">类型:</span>
                  <select
                    value={editedItem.type}
                    onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
                    className="bg-transparent outline-none text-sm cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="神器">神器</option>
                    <option value="仙器">仙器</option>
                    <option value="灵宝">灵宝</option>
                    <option value="神兵">神兵</option>
                    <option value="丹药">丹药</option>
                    <option value="灵物">灵物</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm text-primary font-medium">{item.type}</span>
                </div>
              )}

              {isEditing ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                  <Star className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">稀有度:</span>
                  <select
                    value={editedItem.rarity}
                    onChange={(e) => setEditedItem({ ...editedItem, rarity: e.target.value })}
                    className="bg-transparent outline-none text-sm cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="普通">普通</option>
                    <option value="稀有">稀有</option>
                    <option value="史诗">史诗</option>
                    <option value="传说">传说</option>
                    <option value="神话">神话</option>
                  </select>
                </div>
              ) : (
                item.rarity && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getRarityColor(item.rarity)}`}>
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{item.rarity}</span>
                  </div>
                )
              )}

              {powerSystem && !isEditing && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">{powerSystem.name}</span>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                <User className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="text-sm text-on-surface-variant">{relatedCharacters.length} 位持有者</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">力量体系:</span>
                  <select
                    value={editedItem.powerSystemId}
                    onChange={(e) => setEditedItem({ ...editedItem, powerSystemId: e.target.value })}
                    className="bg-transparent outline-none text-sm cursor-pointer"
                  >
                    <option value="">请选择</option>
                    {world.powerSystems.map(power => (
                      <option key={power.id} value={power.id}>{power.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                powerSystem && (
                  <span className="px-3 py-1.5 bg-surface-container-high text-sm rounded-lg text-on-surface-variant">
                    #{powerSystem.name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-outline-variant/30">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: '简介', icon: BookOpen },
            { id: 'attributes', label: '属性', icon: Star },
            { id: 'characters', label: '持有者', icon: User },
            { id: 'history', label: '历史', icon: Calendar }
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
                <h2 className="text-xl font-bold">物品简介</h2>
              </div>
              {isEditing ? (
                <textarea
                  value={editedItem.description}
                  onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                  className="w-full h-48 px-4 py-3 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  placeholder="物品简介"
                />
              ) : (
                <p className="text-on-surface-variant/80 leading-relaxed">
                  {item.description || '暂无简介。点击编辑按钮添加物品背景故事、特点、用途等信息。'}
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'attributes' && (
          <motion.div
            key="attributes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">物品属性</h2>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newAttribute = { name: '', value: '' };
                      setEditedItem({ 
                        ...editedItem, 
                        attributes: [...(editedItem.attributes || []), newAttribute] 
                      });
                    }}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加属性
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  editedItem.attributes?.map((attr, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-surface-container-low rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={attr.name}
                          onChange={(e) => {
                            const newAttributes = [...editedItem.attributes];
                            newAttributes[index] = { ...newAttributes[index], name: e.target.value };
                            setEditedItem({ ...editedItem, attributes: newAttributes });
                          }}
                          className="w-full px-3 py-2 bg-surface rounded-md border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm mb-2"
                          placeholder="属性名称"
                        />
                        <input
                          type="text"
                          value={attr.value}
                          onChange={(e) => {
                            const newAttributes = [...editedItem.attributes];
                            newAttributes[index] = { ...newAttributes[index], value: e.target.value };
                            setEditedItem({ ...editedItem, attributes: newAttributes });
                          }}
                          className="w-full px-3 py-2 bg-surface rounded-md border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          placeholder="属性值"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newAttributes = editedItem.attributes.filter((_, i) => i !== index);
                          setEditedItem({ ...editedItem, attributes: newAttributes });
                        }}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  item.attributes?.map((attr, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-surface-container-low rounded-lg">
                      <span className="text-on-surface-variant/60">{attr.name}</span>
                      <span className="font-bold text-primary">{attr.value}</span>
                    </div>
                  ))
                )}
              </div>
              
              {(!item.attributes || item.attributes.length === 0) && !isEditing && (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                  <p className="text-on-surface-variant/60">暂无属性信息</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'characters' && (
          <motion.div
            key="characters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">持有者</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedCharacters.map((character) => (
                  <Link
                    key={character.id}
                    to={`/characters/${character.id}`}
                    className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${character.id}`} 
                        alt={character.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-on-surface truncate">{character.name}</p>
                      <p className="text-sm text-on-surface-variant">持有者</p>
                    </div>
                  </Link>
                ))}
                {relatedCharacters.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <User className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-on-surface-variant/60">暂无持有者</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">历史记录</h2>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => {}}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary-dim transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加记录
                  </button>
                )}
              </div>
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                <p className="text-on-surface-variant/60">暂无历史记录</p>
              </div>
            </Card>
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
            <p className="text-on-surface-variant/80 mb-6">你确定要删除这个物品吗？此操作不可撤销。</p>
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
    </motion.div>
  );
};

export default ItemDetailView;
