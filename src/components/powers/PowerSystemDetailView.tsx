import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Trash2, ChevronLeft, Zap } from 'lucide-react';
import { useWorld, Card, Badge, PageHeader } from '../../App';

const PowerSystemDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { world, setWorld } = useWorld();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const powerSystem = world.powerSystems.find(ps => ps.id === id);
  
  if (!powerSystem) return <div>Power system not found</div>;
  
  const [editPowerSystem, setEditPowerSystem] = useState({
    ...powerSystem
  });
  
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };
  
  const handleAddLevel = () => {
    setEditPowerSystem(prev => ({
      ...prev,
      levels: [...prev.levels, '']
    }));
  };
  
  const handleLevelChange = (index: number, value: string) => {
    setEditPowerSystem(prev => {
      const newLevels = [...prev.levels];
      newLevels[index] = value;
      return {
        ...prev,
        levels: newLevels
      };
    });
  };
  
  const handleRemoveLevel = (index: number) => {
    if (editPowerSystem.levels.length > 1) {
      setEditPowerSystem(prev => ({
        ...prev,
        levels: prev.levels.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleSaveEdit = () => {
    if (editPowerSystem.name && editPowerSystem.description && editPowerSystem.levels.some(level => level)) {
      setWorld(prevWorld => ({
        ...prevWorld,
        powerSystems: prevWorld.powerSystems.map(ps => 
          ps.id === id ? editPowerSystem : ps
        )
      }));
      setIsEditModalOpen(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('确定要删除这个力量体系吗？')) {
      setWorld(prevWorld => ({
        ...prevWorld,
        powerSystems: prevWorld.powerSystems.filter(ps => ps.id !== id),
        items: prevWorld.items.map(item => ({
          ...item,
          powerSystemId: item.powerSystemId === id ? undefined : item.powerSystemId
        }))
      }));
      // 导航回力量体系列表页
      window.location.href = '/powers';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader 
        title="力量体系详情" 
        breadcrumb={powerSystem.name}
        actions={
          <div className="flex gap-4">
            <button onClick={handleEdit} className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg border border-outline-variant">
              <Edit3 className="w-4 h-4" /> 编辑
            </button>
            <button onClick={handleDelete} className="bg-error text-on-error px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
              <Trash2 className="w-4 h-4" /> 删除
            </button>
          </div>
        }
      />
      
      <div className="flex items-center gap-4 mb-8">
        <Link to="/powers" className="flex items-center gap-2 text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          返回力量体系列表
        </Link>
      </div>

      <Card>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{powerSystem.name}</h2>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/40 mb-4">体系描述</h3>
            <p className="text-on-surface-variant/80 leading-relaxed">
              {powerSystem.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/40 mb-4">等级划分</h3>
            <div className="flex flex-wrap gap-4">
              {powerSystem.levels.map((level, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary w-6">{idx + 1}.</span>
                  <Badge color="bg-surface-container-high text-on-surface-variant text-base py-2 px-4">{level}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">编辑力量体系</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">体系名称</label>
                <input
                  type="text"
                  value={editPowerSystem.name}
                  onChange={(e) => setEditPowerSystem({ ...editPowerSystem, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入力量体系名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">体系描述</label>
                <textarea
                  value={editPowerSystem.description}
                  onChange={(e) => setEditPowerSystem({ ...editPowerSystem, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入力量体系描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">等级划分</label>
                {editPowerSystem.levels.map((level, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => handleLevelChange(index, e.target.value)}
                      className="flex-1 p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                      placeholder={`等级 ${index + 1}`}
                    />
                    {editPowerSystem.levels.length > 1 && (
                      <button
                        onClick={() => handleRemoveLevel(index)}
                        className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddLevel}
                  className="mt-2 px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-sm"
                >
                  添加等级
                </button>
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary-dim transition-colors"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PowerSystemDetailView;