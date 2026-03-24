import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Wallet } from 'lucide-react';
import { useWorld, PageHeader, Card, Badge } from '../../App';

const CurrenciesView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    id: `c${Date.now()}`,
    name: '',
    description: '',
    baseValue: 1,
    unit: '',
    exchangeRates: []
  });

  const handleAddCurrency = () => {
    setIsModalOpen(true);
  };

  const handleSaveCurrency = () => {
    if (newCurrency.name && newCurrency.description && newCurrency.unit) {
      setWorld(prevWorld => ({
        ...prevWorld,
        currencies: [...prevWorld.currencies, newCurrency]
      }));
      setIsModalOpen(false);
      setNewCurrency({
        id: `c${Date.now()}`,
        name: '',
        description: '',
        baseValue: 1,
        unit: '',
        exchangeRates: []
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="货币系统" actions={<button onClick={handleAddCurrency} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 新增货币体系</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {world.currencies.map(currency => (
          <Link key={currency.id} to={`/currency/${currency.id}`} className="block hover:bg-surface-container-high transition-colors">
            <Card className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currency.name}</h3>
                  <Badge color="bg-surface-container-high text-on-surface-variant">{currency.unit}</Badge>
                </div>
              </div>
              <p className="text-on-surface-variant/80 text-sm leading-relaxed mb-4">{currency.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant/60">基准价值: {currency.baseValue}</span>
                <span className="text-sm text-on-surface-variant/60">兑换比例: {currency.exchangeRates.length}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Modal for adding currency */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">新增货币体系</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">货币名称</label>
                <input
                  type="text"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入货币名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">货币描述</label>
                <textarea
                  value={newCurrency.description}
                  onChange={(e) => setNewCurrency({ ...newCurrency, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入货币描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">基准价值</label>
                <input
                  type="number"
                  value={newCurrency.baseValue}
                  onChange={(e) => setNewCurrency({ ...newCurrency, baseValue: parseFloat(e.target.value) || 1 })}
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入基准价值"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">货币单位</label>
                <input
                  type="text"
                  value={newCurrency.unit}
                  onChange={(e) => setNewCurrency({ ...newCurrency, unit: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入货币单位"
                />
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCurrency}
                  className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary-dim transition-colors"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CurrenciesView;