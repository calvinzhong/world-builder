import React from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Edit3, Share2, Trash2, Users, Calendar, Link as LinkIcon } from 'lucide-react';
import { useWorld } from '../../App';
import { Card, Badge } from '../../App';

const EraDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { world } = useWorld();
  const era = world.eras.find(e => e.id === id);
  
  if (!era) return <div>时代不存在</div>;
  
  const relatedFactions = world.factions;
  const relatedEvents = world.timeline.filter(event => {
    const eventYear = parseInt(event.year.replace(/[^0-9]/g, ''));
    const eraYears = era.years.match(/\d+/g);
    if (!eraYears || eraYears.length < 2) return false;
    const [start, end] = eraYears.map(Number);
    return eventYear >= start && eventYear <= end;
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{era.name}</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <Edit3 className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <Share2 className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <Trash2 className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
          </div>
          <Badge color="bg-surface-container-high text-on-surface-variant">{era.years}</Badge>
          <p className="text-on-surface-variant/80 leading-relaxed mt-4">
            {era.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Era Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="时代信息">
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">时间跨度</h4>
                <p className="text-on-surface-variant/80">{era.years}</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">关键事件</h4>
                <p className="text-on-surface-variant/80">{relatedEvents.length}个</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl">
                <h4 className="font-bold mb-2">相关势力</h4>
                <p className="text-on-surface-variant/80">{relatedFactions.length}个</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Related Events */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="时代事件">
            {relatedEvents.length > 0 ? (
              <div className="space-y-4">
                {relatedEvents.map(event => (
                  <div key={event.id} className="p-4 bg-surface-container-low rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{event.title}</h4>
                      <Badge color="bg-primary/10 text-primary">{event.year}</Badge>
                    </div>
                    <p className="text-on-surface-variant/80">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant/40">该时代暂无事件记录</p>
            )}
          </Card>

          <Card title="相关势力">
            <div className="space-y-4">
              {relatedFactions.map(faction => (
                <Link key={faction.id} to={`/factions/${faction.id}`} className="block hover:bg-surface-container-high transition-colors">
                  <div className="p-4 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <h4 className="font-bold">{faction.name}</h4>
                    </div>
                    <p className="text-on-surface-variant/60 text-sm">{faction.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default EraDetailView;