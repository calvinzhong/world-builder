import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, LinkIcon, FileText, X } from 'lucide-react';
import { useWorld } from '../../App';
import { PageHeader, Card, Badge } from '../../App';

const CharactersView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    traits: '',
    factionIds: [] as string[]
  });

  const handleAddCharacter = () => {
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'factionIds') {
      // 处理多选
      const selectElement = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        factionIds: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const traitsArray = formData.traits
      .split(',')
      .map(trait => trait.trim())
      .filter(trait => trait);

    const newCharacter = {
      id: `c${world.characters.length + 1}`,
      name: formData.name || '新人物',
      age: formData.age || '0',
      traits: traitsArray,
      milestones: [],
      bonds: [],
      factionIds: formData.factionIds.length > 0 ? formData.factionIds : undefined,
      itemIds: []
    };

    setWorld(prevWorld => ({
      ...prevWorld,
      characters: [...prevWorld.characters, newCharacter]
    }));

    setIsModalOpen(false);
    setFormData({
      name: '',
      age: '',
      traits: '',
      factionIds: []
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="人物设定" actions={<button onClick={handleAddCharacter} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 新增人物</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {world.characters.map(char => {
          const factions = world.factions.filter(f => char.factionIds?.includes(f.id));
          return (
            <Link key={char.id} to={`/characters/${char.id}`}>
              <Card className="hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all">
                    <img src={`https://picsum.photos/seed/${char.id}/200/200`} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{char.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge color="bg-surface-container-high text-on-surface-variant">年龄: {char.age}</Badge>
                      {factions.map(faction => (
                        <Badge key={faction.id}>{faction.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {char.traits.map(trait => (
                    <span key={trait} className="px-2 py-0.5 bg-surface-container-low text-[10px] font-medium rounded text-on-surface-variant">#{trait}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant/60">
                  <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {char.bonds.length} 个羁绊</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {char.milestones.length} 个里程碑</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Add Character Modal */}
      {isModalOpen && (
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">新增人物</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">姓名</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="输入人物姓名"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">年龄</label>
                <input 
                  type="text" 
                  name="age" 
                  value={formData.age}
                  onChange={handleFormChange}
                  placeholder="输入年龄"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">特质 (用逗号分隔)</label>
                <input 
                  type="text" 
                  name="traits" 
                  value={formData.traits}
                  onChange={handleFormChange}
                  placeholder="例如: 勇敢, 聪明, 善良"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">所属势力 (可多选)</label>
                <select 
                  name="factionIds" 
                  multiple
                  value={formData.factionIds}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all h-32"
                >
                  {world.factions.map(faction => (
                    <option key={faction.id} value={faction.id}>{faction.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-lg border border-outline-variant/50 font-medium hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors"
                >
                  确认添加
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CharactersView;