import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Wallet, X, Plus } from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge, PageHeader } from '../../App';

const CurrencyDetailView = () => {
  const { id } = useParams();
  const { world, setWorld } = useWorld();
  const currency = world.currencies.find(c => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCurrency, setEditedCurrency] = useState({
    id: '',
    name: '',
    description: '',
    baseValue: 1,
    unit: '',
    exchangeRates: []
  });
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);
  const [newExchangeRate, setNewExchangeRate] = useState({
    currencyId: '',
    rate: 1
  });

  if (!currency) return <div>Currency not found</div>;

  const handleEdit = () => {
    setEditedCurrency({ ...currency });
    setIsEditing(true);
  };

  const handleSave = () => {
    setWorld(prevWorld => ({
      ...prevWorld,
      currencies: prevWorld.currencies.map(c => c.id === id ? editedCurrency : c)
    }));
    setIsEditing(false);
  };

  const handleAddExchangeRate = () => {
    setIsExchangeRateModalOpen(true);
  };

  const handleSaveExchangeRate = () => {
    if (newExchangeRate.currencyId && newExchangeRate.rate > 0) {
      const updatedCurrency = {
        ...currency,
        exchangeRates: [...currency.exchangeRates, newExchangeRate]
      };
      setWorld(prevWorld => ({
        ...prevWorld,
        currencies: prevWorld.currencies.map(c => c.id === id ? updatedCurrency : c)
      }));
      setIsExchangeRateModalOpen(false);
      setNewExchangeRate({ currencyId: '', rate: 1 });
    }
  };

  const handleRemoveExchangeRate = (index: number) => {
    const updatedCurrency = {
      ...currency,
      exchangeRates: currency.exchangeRates.filter((_, i) => i !== index)
    };
    setWorld(prevWorld => ({
      ...prevWorld,
      currencies: prevWorld.currencies.map(c => c.id === id ? updatedCurrency : c)
    }));
  };

  const otherCurrencies = world.currencies.filter(c => c.id !== id);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-8">
          <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
            <Wallet className="w-16 h-16 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedCurrency.name}
                  onChange={(e) => setEditedCurrency({ ...editedCurrency, name: e.target.value })}
                  className="text-4xl font-bold border-b-2 border-primary outline-none"
                />
              ) : (
                <h1 className="text-4xl font-bold">{currency.name}</h1>
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
                    value={editedCurrency.unit}
                    onChange={(e) => setEditedCurrency({ ...editedCurrency, unit: e.target.value })}
                    className="px-3 py-1 bg-surface-container-high rounded-md text-sm font-bold"
                  />
                ) : (
                  <Badge color="bg-primary-container text-on-primary-container">{currency.unit}</Badge>
                )}
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={editedCurrency.description}
                onChange={(e) => setEditedCurrency({ ...editedCurrency, description: e.target.value })}
                className="w-full p-4 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[120px] text-on-surface"
              />
            ) : (
              <p className="text-on-surface-variant/80 leading-relaxed mb-8">
                {currency.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Currency Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="货币信息">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant/60">货币单位</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCurrency.unit}
                    onChange={(e) => setEditedCurrency({ ...editedCurrency, unit: e.target.value })}
                    className="w-32 p-2 border border-outline-variant rounded-md text-right"
                  />
                ) : (
                  <span className="font-bold">{currency.unit}</span>
                )}
              </div>
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant/60">基准价值</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedCurrency.baseValue}
                    onChange={(e) => setEditedCurrency({ ...editedCurrency, baseValue: parseFloat(e.target.value) || 1 })}
                    min="0.01"
                    step="0.01"
                    className="w-32 p-2 border border-outline-variant rounded-md text-right"
                  />
                ) : (
                  <span className="font-bold">{currency.baseValue}</span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Exchange Rates */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="兑换比例">
            <div className="space-y-6">
              {currency.exchangeRates.length > 0 ? (
                currency.exchangeRates.map((rate, index) => {
                  const targetCurrency = world.currencies.find(c => c.id === rate.currencyId);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                      <div>
                        <span className="font-bold">{targetCurrency?.name || 'Unknown'}</span>
                        <span className="text-on-surface-variant/60 ml-2">({targetCurrency?.unit || ''})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">1 {currency.unit} = {rate.rate} {targetCurrency?.unit || ''}</span>
                        <button
                          onClick={() => handleRemoveExchangeRate(index)}
                          className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                        >
                          <X className="w-4 h-4 text-on-surface-variant" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-on-surface-variant/40 italic">暂无兑换比例</p>
              )}
              <button
                onClick={handleAddExchangeRate}
                className="w-full py-3 border border-dashed border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">添加兑换比例</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Exchange Rate Modal */}
      {isExchangeRateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">添加兑换比例</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">目标货币</label>
                <select
                  value={newExchangeRate.currencyId}
                  onChange={(e) => setNewExchangeRate({ ...newExchangeRate, currencyId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择货币</option>
                  {otherCurrencies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">兑换比例</label>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface-variant/60">1 {currency.unit} =</span>
                  <input
                    type="number"
                    value={newExchangeRate.rate}
                    onChange={(e) => setNewExchangeRate({ ...newExchangeRate, rate: parseFloat(e.target.value) || 1 })}
                    min="0.01"
                    step="0.01"
                    className="flex-1 p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    placeholder="输入兑换比例"
                  />
                  <span className="text-on-surface-variant/60">目标货币单位</span>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  onClick={() => setIsExchangeRateModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveExchangeRate}
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

export default CurrencyDetailView;