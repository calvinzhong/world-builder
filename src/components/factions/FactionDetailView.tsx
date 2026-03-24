import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Users, Shield, Link as LinkIcon } from 'lucide-react';
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
    strengths: '',
    weaknesses: '',
    level: 1
  });
  const [enemyFactionId, setEnemyFactionId] = useState('');
  
  const factions = world.factions.filter(f => f.id !== id);
  
  const faction = world.factions.find(f => f.id === id);
  
  if (!faction) return <div>势力不存在</div>;
  
  const relatedCharacters = world.characters.filter(char => char.factionIds?.includes(faction.id));
  
  const handleEdit = () => {
    setEditedFaction({
      name: faction.name,
      description: faction.description,
      leader: faction.leader || '',
      strengths: faction.strengths ? faction.strengths.join(', ') : '',
      weaknesses: faction.weaknesses ? faction.weaknesses.join(', ') : '',
      level: faction.level || 1
    });
    setEnemyFactionId(faction.relationships.find(rel => rel.type === 'hostile')?.factionId || '');
    setIsEditing(true);
  };
  
  const handleSaveEdit = () => {
    if (editedFaction.name && editedFaction.description) {
      const relationships = [];
      if (enemyFactionId) {
        relationships.push({ factionId: enemyFactionId, type: 'hostile' as const });
        // 同时更新敌对势力的关系
        setWorld(prevWorld => ({
          ...prevWorld,
          factions: prevWorld.factions.map(f => {
            if (f.id === faction.id) {
              return {
                ...f,
                name: editedFaction.name,
                description: editedFaction.description,
                leader: editedFaction.leader,
                strengths: editedFaction.strengths ? editedFaction.strengths.split(',').map(s => s.trim()).filter(Boolean) : [],
                weaknesses: editedFaction.weaknesses ? editedFaction.weaknesses.split(',').map(w => w.trim()).filter(Boolean) : [],
                level: editedFaction.level,
                relationships
              };
            } else if (f.id === enemyFactionId) {
              // 确保敌对势力也将当前势力标记为敌对
              const hasHostileRelationship = f.relationships.some(rel => rel.factionId === faction.id && rel.type === 'hostile');
              if (!hasHostileRelationship) {
                return {
                  ...f,
                  relationships: [...f.relationships, { factionId: faction.id, type: 'hostile' as const }]
                };
              }
            }
            return f;
          })
        }));
      } else {
        // 没有敌对势力，清空关系
        setWorld(prevWorld => ({
          ...prevWorld,
          factions: prevWorld.factions.map(f => 
            f.id === faction.id 
              ? {
                  ...f,
                  name: editedFaction.name,
                  description: editedFaction.description,
                  leader: editedFaction.leader,
                  strengths: editedFaction.strengths ? editedFaction.strengths.split(',').map(s => s.trim()).filter(Boolean) : [],
                  weaknesses: editedFaction.weaknesses ? editedFaction.weaknesses.split(',').map(w => w.trim()).filter(Boolean) : [],
                  level: editedFaction.level,
                  relationships: []
                }
              : f
          )
        }));
      }
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleShare = () => {
    // 实现分享功能
    alert('分享功能已触发');
  };
  
  const handleDelete = () => {
    if (window.confirm('确定要删除这个势力吗？')) {
      setWorld(prevWorld => ({
        ...prevWorld,
        factions: prevWorld.factions.filter(f => f.id !== faction.id),
        // 同时更新角色的势力ID
        characters: prevWorld.characters.map(char => {
          if (char.factionIds && char.factionIds.includes(faction.id)) {
            return {
              ...char,
              factionIds: char.factionIds.filter(id => id !== faction.id)
            };
          }
          return char;
        })
      }));
      // 跳转到势力列表页
      window.location.href = '/factions';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedFaction.name}
                  onChange={(e) => setEditedFaction({ ...editedFaction, name: e.target.value })}
                  className="text-4xl font-bold border-b-2 border-primary outline-none"
                />
              ) : (
                <h1 className="text-4xl font-bold">{faction.name}</h1>
              )}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button onClick={handleCancelEdit} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                      <Edit3 className="w-5 h-5 text-on-surface-variant" />
                    </button>
                    <button onClick={handleShare} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                      <Share2 className="w-5 h-5 text-on-surface-variant" />
                    </button>
                    <button onClick={handleDelete} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                      <Trash2 className="w-5 h-5 text-on-surface-variant" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={editedFaction.description}
                onChange={(e) => setEditedFaction({ ...editedFaction, description: e.target.value })}
                className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                placeholder="描述这个势力的背景和特点"
              />
            ) : (
              <p className="text-on-surface-variant/80 leading-relaxed">
                {faction.description}
              </p>
            )}
            
            {isEditing ? (
              <div className="mt-4">
                <select
                  value={editedFaction.leader}
                  onChange={(e) => setEditedFaction({ ...editedFaction, leader: e.target.value })}
                  className="p-2 border border-outline-variant rounded-md focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择首领</option>
                  {relatedCharacters.map(char => (
                    <option key={char.id} value={char.name}>{char.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              faction.leader && (
                <div className="mt-4">
                  <Badge color="bg-surface-container-high text-on-surface-variant">首领: {faction.leader}</Badge>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Faction Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="势力信息">
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">成员数量</h4>
                <p className="text-on-surface-variant/80">{relatedCharacters.length}人</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">势力等级</h4>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedFaction.level}
                    onChange={(e) => setEditedFaction({ ...editedFaction, level: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="10"
                    className="w-full p-2 border border-outline-variant rounded-md focus:ring-1 focus:ring-primary outline-none"
                  />
                ) : (
                  <p className="text-on-surface-variant/80">{faction.level || 1}</p>
                )}
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">敌对势力</h4>
                {isEditing ? (
                  <select
                    value={enemyFactionId}
                    onChange={(e) => setEnemyFactionId(e.target.value)}
                    className="w-full p-2 border border-outline-variant rounded-md focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">选择敌对势力</option>
                    {factions.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-2">
                    {faction.relationships.map(rel => {
                      const target = world.factions.find(f => f.id === rel.factionId);
                      return target ? (
                        <Link key={rel.factionId} to={`/factions/${target.id}`} className="flex items-center justify-between hover:bg-surface-container-high p-2 rounded-lg transition-colors">
                          <span>{target.name}</span>
                          <Badge 
                            color={
                              rel.type === 'ally' ? 'bg-success/10 text-success' :
                              rel.type === 'hostile' ? 'bg-error/10 text-error' :
                              'bg-surface-container-high text-on-surface-variant'
                            }
                          >
                            {rel.type === 'ally' ? '盟友' :
                             rel.type === 'hostile' ? '敌对' :
                             '中立'}
                          </Badge>
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">优点</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFaction.strengths}
                    onChange={(e) => setEditedFaction({ ...editedFaction, strengths: e.target.value })}
                    className="w-full p-2 border border-outline-variant rounded-md focus:ring-1 focus:ring-primary outline-none"
                    placeholder="输入优点，多个优点用逗号分隔"
                  />
                ) : (
                  faction.strengths && faction.strengths.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {faction.strengths.map((strength, idx) => (
                        <Badge key={idx} color="bg-success/10 text-success">{strength}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-on-surface-variant/40">暂无优点</p>
                  )
                )}
              </div>
              
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">缺点</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFaction.weaknesses}
                    onChange={(e) => setEditedFaction({ ...editedFaction, weaknesses: e.target.value })}
                    className="w-full p-2 border border-outline-variant rounded-md focus:ring-1 focus:ring-primary outline-none"
                    placeholder="输入缺点，多个缺点用逗号分隔"
                  />
                ) : (
                  faction.weaknesses && faction.weaknesses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {faction.weaknesses.map((weakness, idx) => (
                        <Badge key={idx} color="bg-error/10 text-error">{weakness}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-on-surface-variant/40">暂无缺点</p>
                  )
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Related Characters */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="成员列表">
            {relatedCharacters.length > 0 ? (
              <div className="space-y-4">
                {relatedCharacters.map(char => (
                  <Link key={char.id} to={`/characters/${char.id}`} className="block hover:bg-surface-container-high transition-colors">
                    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={`https://picsum.photos/seed/${char.id}/100/100`} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{char.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {char.traits.map(trait => (
                            <Badge key={trait} color="bg-surface-container-high text-on-surface-variant text-xs">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant/40">该势力暂无成员</p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default FactionDetailView;