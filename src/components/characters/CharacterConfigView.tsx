import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, Heart, User, Trash2, Edit2, Check, X, Plus } from 'lucide-react';
import { useWorld } from '../../App';
import { PageHeader } from '../../App';
import { AvatarPreview } from '../AvatarPreview';

const CharacterConfigView = () => {
  const { world, setWorld } = useWorld();
  const [configTab, setConfigTab] = useState<'tags' | 'bonds' | 'avatars'>('tags');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newItem, setNewItem] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<{ isOpen: boolean; imageUrl: string; alt?: string }>({ isOpen: false, imageUrl: '' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* 返回按钮 */}
      <div className="flex items-center gap-2">
        <Link 
          to="/characters" 
          className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">返回</span>
        </Link>
      </div>

      {/* 页面标题 */}
      <PageHeader title="基础配置" />

      {/* Tab导航 */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex border-b border-outline-variant/30 mb-6">
          <button
            onClick={() => setConfigTab('tags')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              configTab === 'tags'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Tag className="w-4 h-4" />
            人物标签
          </button>
          <button
            onClick={() => setConfigTab('bonds')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              configTab === 'bonds'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Heart className="w-4 h-4" />
            羁绊关系类型
          </button>
          <button
            onClick={() => setConfigTab('avatars')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              configTab === 'avatars'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <User className="w-4 h-4" />
            头像配置
          </button>
        </div>

        {/* Tab内容 */}
        <div className="space-y-4">
          {configTab === 'tags' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="输入新标签"
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  onClick={() => {
                    if (newItem.trim()) {
                      setWorld(prev => ({
                        ...prev,
                        characterTags: [...prev.characterTags, newItem.trim()]
                      }));
                      setNewItem('');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dim transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {world.characterTags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg group">
                    {editingItem === `tag-${index}` ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-0.5 bg-transparent outline-none text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            const newTags = [...world.characterTags];
                            newTags[index] = editValue;
                            setWorld(prev => ({ ...prev, characterTags: newTags }));
                            setEditingItem(null);
                          }}
                          className="p-0.5 hover:bg-surface-container rounded"
                        >
                          <Check className="w-3 h-3 text-primary" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-0.5 hover:bg-surface-container rounded"
                        >
                          <X className="w-3 h-3 text-on-surface-variant" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">{tag}</span>
                        <button
                          onClick={() => {
                            setEditingItem(`tag-${index}`);
                            setEditValue(tag);
                          }}
                          className="p-0.5 hover:bg-surface-container rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-3 h-3 text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => {
                            setWorld(prev => ({
                              ...prev,
                              characterTags: prev.characterTags.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-0.5 hover:bg-surface-container rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-error" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {configTab === 'bonds' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="输入新关系类型"
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  onClick={() => {
                    if (newItem.trim()) {
                      setWorld(prev => ({
                        ...prev,
                        bondTypes: [...prev.bondTypes, newItem.trim()]
                      }));
                      setNewItem('');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dim transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {world.bondTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg group">
                    {editingItem === `bond-${index}` ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-0.5 bg-transparent outline-none text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            const newTypes = [...world.bondTypes];
                            newTypes[index] = editValue;
                            setWorld(prev => ({ ...prev, bondTypes: newTypes }));
                            setEditingItem(null);
                          }}
                          className="p-0.5 hover:bg-surface-container rounded"
                        >
                          <Check className="w-3 h-3 text-primary" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-0.5 hover:bg-surface-container rounded"
                        >
                          <X className="w-3 h-3 text-on-surface-variant" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">{type}</span>
                        <button
                          onClick={() => {
                            setEditingItem(`bond-${index}`);
                            setEditValue(type);
                          }}
                          className="p-0.5 hover:bg-surface-container rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-3 h-3 text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => {
                            setWorld(prev => ({
                              ...prev,
                              bondTypes: prev.bondTypes.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-0.5 hover:bg-surface-container rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-error" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {configTab === 'avatars' && (
            <>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="输入头像名称"
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="输入头像API地址"
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  onClick={() => {
                    if (newItem.trim() && editValue.trim()) {
                      setWorld(prev => ({
                        ...prev,
                        avatarConfigs: [...prev.avatarConfigs, {
                          id: `avatar${prev.avatarConfigs.length + 1}`,
                          name: newItem.trim(),
                          baseUrl: editValue.trim()
                        }]
                      }));
                      setNewItem('');
                      setEditValue('');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dim transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  新增头像
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {world.avatarConfigs.map((config) => (
                  <div key={config.id} className="p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors group">
                    <div className="flex items-center">
                      <div 
                        className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/5 cursor-pointer"
                        onClick={() => {
                          setAvatarPreview({ isOpen: true, imageUrl: config.baseUrl, alt: config.name });
                        }}
                      >
                        <img 
                          src={`${config.baseUrl}`} 
                          alt={config.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 ml-3">
                        <p className="font-medium text-on-surface truncate">{config.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(`avatar-${config.id}`);
                            setEditValue(config.name);
                          }}
                          className="p-1 rounded hover:bg-surface-container-lowest transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => {
                            setWorld(prev => ({
                              ...prev,
                              avatarConfigs: prev.avatarConfigs.filter(c => c.id !== config.id)
                            }));
                          }}
                          className="p-1 rounded hover:bg-surface-container-lowest transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-on-surface-variant" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <AvatarPreview
        isOpen={avatarPreview.isOpen}
        onClose={() => setAvatarPreview({ isOpen: false, imageUrl: '' })}
        imageUrl={avatarPreview.imageUrl}
        alt={avatarPreview.alt}
      />
    </motion.div>
  );
};

export default CharacterConfigView;
