import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit3, Save, X } from 'lucide-react';
import { useWorld } from '../../App';
import { Card, PageHeader } from '../../App';

const NewSettingView = () => {
  const navigate = useNavigate();
  const { world, setWorld } = useWorld();
  const [isEditing, setIsEditing] = useState(true);
  const [newSetting, setNewSetting] = useState({
    id: `setting-${Date.now()}`,
    name: '',
    description: '',
    type: ''
  });

  const handleSave = () => {
    // 这里可以根据设定类型添加到不同的数组中
    // 暂时只是演示，实际需要根据具体设定类型处理
    setIsEditing(false);
    // 保存后返回概览页面
    navigate('/');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader 
        title="创建新设定" 
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button 
              onClick={handleSave}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
            >
              <Save className="w-5 h-5 text-primary" />
            </button>
          </div>
        }
      />

      <Card title="设定信息">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">设定名称</label>
            <input
              type="text"
              value={newSetting.name}
              onChange={(e) => setNewSetting({ ...newSetting, name: e.target.value })}
              className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none text-on-surface"
              placeholder="输入设定名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">设定类型</label>
            <select
              value={newSetting.type}
              onChange={(e) => setNewSetting({ ...newSetting, type: e.target.value })}
              className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none text-on-surface"
            >
              <option value="">选择设定类型</option>
              <option value="era">时代</option>
              <option value="faction">势力</option>
              <option value="character">人物</option>
              <option value="item">物品</option>
              <option value="power">力量体系</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">设定描述</label>
            <textarea
              value={newSetting.description}
              onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
              className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[200px] text-on-surface"
              placeholder="输入设定描述"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NewSettingView;