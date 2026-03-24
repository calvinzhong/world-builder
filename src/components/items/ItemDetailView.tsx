import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Sword, Zap, X } from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge, PageHeader } from '../../App';

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
    powerSystemId: ''
  });
  
  if (!item) return <div>Item not found</div>;
  
  const powerSystem = world.powerSystems.find(p => p.id === item.powerSystemId);
  
  const handleEdit = () => {
    setEditedItem({ ...item });
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      items: prevWorld.items.map(i => i.id === id ? editedItem : i)
    }));
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-8">
          <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
            <Sword className="w-16 h-16 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="text-4xl font-bold border-b-2 border-primary outline-none"
                />
              ) : (
                <h1 className="text-4xl font-bold">{item.name}</h1>
              )}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button onClick={handleSave} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <Share2 className="w-5 h-5 text-primary" />
                  </button>
                ) : (
                  <button onClick={handleEdit} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <Edit3 className="w-5 h-5 text-on-surface-variant" />
                  </button>
                )}
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                  <Share2 className="w-5 h-5 text-on-surface-variant" />
                </button>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                  <Trash2 className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedItem.type}
                    onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
                    className="px-3 py-1 bg-surface-container-high rounded-md text-sm font-bold"
                  />
                ) : (
                  <Badge color="bg-primary-container text-on-primary-container">{item.type}</Badge>
                )}
                {powerSystem && !isEditing && (
                  <div className="flex items-center gap-2 text-on-surface-variant/60">
                    <Zap className="w-4 h-4" />
                    <span>{powerSystem.name}</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium mb-2">关联力量体系</label>
                  <select
                    value={editedItem.powerSystemId}
                    onChange={(e) => setEditedItem({ ...editedItem, powerSystemId: e.target.value })}
                    className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">选择力量体系</option>
                    {world.powerSystems.map(power => (
                      <option key={power.id} value={power.id}>{power.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editedItem.description}
                onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[120px] text-on-surface"
              />
            ) : (
              <p className="text-on-surface-variant/80 leading-relaxed mb-8">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Item Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="物品信息">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant/60">物品类型</span>
                <span className="font-bold">{item.type}</span>
              </div>
              {powerSystem && (
                <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                  <span className="text-on-surface-variant/60">关联力量体系</span>
                  <span className="font-bold">{powerSystem.name}</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="关联人物">
            <div className="space-y-4">
              {world.characters.filter(c => c.itemIds.includes(item.id)).length > 0 ? (
                world.characters.filter(c => c.itemIds.includes(item.id)).map(character => (
                  <Link key={character.id} to={`/characters/${character.id}`} className="block hover:bg-surface-container-high transition-colors">
                    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={`https://picsum.photos/seed/${character.id}/100/100`} alt={character.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold">{character.name}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant/40 italic">暂无关联人物</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Item Description */}
        <div className="lg:col-span-2">
          <Card title="物品描述">
            <div className="bg-surface-container-low rounded-2xl p-6">
              {isEditing ? (
                <textarea
                  value={editedItem.description}
                  onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                  className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[200px] text-on-surface"
                />
              ) : (
                <p className="text-on-surface-variant/80 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemDetailView;