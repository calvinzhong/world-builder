import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Badge } from '../../App';
import { useWorld } from '../../App';
import { Upload, MapPin, Route, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';

const MapView: React.FC = () => {
  const { world, setWorld } = useWorld();
  const [activeMap, setActiveMap] = useState<typeof world.maps[0] | null>(null);
  const [scale, setScale] = useState(1);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<typeof world.maps[0]['markers'][0] | null>(null);
  const [newMarker, setNewMarker] = useState({
    name: '',
    type: 'city' as 'city' | 'ruin' | 'battlefield',
    x: 0,
    y: 0,
    eventId: '',
    characterId: '',
    description: ''
  });
  const [newRoute, setNewRoute] = useState({
    name: '',
    points: [] as { x: number; y: number }[],
    characterId: '',
    eventId: '',
    description: ''
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMap = {
          id: `map-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: event.target?.result as string,
          scale: 1,
          markers: [],
          routes: []
        };
        setWorld(prev => ({
          ...prev,
          maps: [...prev.maps, newMap]
        }));
        setActiveMap(newMap);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!activeMap || !mapRef.current || isDrawing) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - mapPosition.x) / scale);
    const y = ((e.clientY - rect.top - mapPosition.y) / scale);
    
    setNewMarker(prev => ({
      ...prev,
      x,
      y
    }));
    setShowMarkerModal(true);
  };

  const handleMarkerSave = () => {
    if (!activeMap) return;
    
    const marker = {
      id: `marker-${Date.now()}`,
      ...newMarker
    };
    
    const updatedMaps = world.maps.map(map => {
      if (map.id === activeMap.id) {
        return {
          ...map,
          markers: [...map.markers, marker]
        };
      }
      return map;
    });
    
    setWorld(prev => ({
      ...prev,
      maps: updatedMaps
    }));
    
    setShowMarkerModal(false);
    setNewMarker({
      name: '',
      type: 'city',
      x: 0,
      y: 0,
      eventId: '',
      characterId: '',
      description: ''
    });
  };

  const handleRouteSave = () => {
    if (!activeMap || newRoute.points.length < 2) return;
    
    const route = {
      id: `route-${Date.now()}`,
      ...newRoute
    };
    
    const updatedMaps = world.maps.map(map => {
      if (map.id === activeMap.id) {
        return {
          ...map,
          routes: [...map.routes, route]
        };
      }
      return map;
    });
    
    setWorld(prev => ({
      ...prev,
      maps: updatedMaps
    }));
    
    setShowRouteModal(false);
    setNewRoute({
      name: '',
      points: [],
      characterId: '',
      eventId: '',
      description: ''
    });
    setIsDrawing(false);
  };

  const handleRouteClick = (e: React.MouseEvent) => {
    if (!activeMap || !mapRef.current || !isDrawing) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - mapPosition.x) / scale);
    const y = ((e.clientY - rect.top - mapPosition.y) / scale);
    
    setNewRoute(prev => ({
      ...prev,
      points: [...prev.points, { x, y }]
    }));
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMarkerClick = (marker: typeof world.maps[0]['markers'][0]) => {
    setSelectedMarker(marker);
  };

  const handleDeleteMarker = (markerId: string) => {
    if (!activeMap) return;
    
    const updatedMaps = world.maps.map(map => {
      if (map.id === activeMap.id) {
        return {
          ...map,
          markers: map.markers.filter(m => m.id !== markerId)
        };
      }
      return map;
    });
    
    setWorld(prev => ({
      ...prev,
      maps: updatedMaps
    }));
    setSelectedMarker(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader 
        title="世界地图" 
        actions={
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                onChange={handleMapUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
                <Upload className="w-4 h-4" /> 上传地图
              </button>
            </div>
            {activeMap && (
              <button 
                onClick={() => setShowRouteModal(true)}
                className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"
              >
                <Route className="w-4 h-4" /> 绘制路线
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card title="地图列表">
            <div className="space-y-4">
              {world.maps.length === 0 ? (
                <p className="text-on-surface-variant/60 text-center py-8">暂无地图，请上传地图</p>
              ) : (
                world.maps.map(map => (
                  <div 
                    key={map.id}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${activeMap?.id === map.id ? 'bg-primary/10' : 'hover:bg-surface-container-low'}`}
                    onClick={() => setActiveMap(map)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{map.name}</h3>
                      <Badge color="bg-primary-container text-on-primary-container">{map.markers.length} 标记</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant/60">
                      <span>标记: {map.markers.length}</span>
                      <span>路线: {map.routes.length}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title={activeMap ? activeMap.name : "选择地图"}>
            {activeMap ? (
              <div className="relative">
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button onClick={handleZoomIn} className="bg-surface-container-lowest p-2 rounded-full shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={handleZoomOut} className="bg-surface-container-lowest p-2 rounded-full shadow-lg">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>

                <div 
                  ref={mapRef}
                  className="relative overflow-hidden border border-outline-variant/20 rounded-xl"
                  style={{ height: '600px' }}
                  onClick={isDrawing ? handleRouteClick : handleMapClick}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                >
                  <div 
                    className="absolute transition-transform"
                    style={{
                      transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${scale})`,
                      transformOrigin: '0 0'
                    }}
                  >
                    <img 
                      src={activeMap.imageUrl} 
                      alt={activeMap.name} 
                      className="max-w-full max-h-full"
                    />

                    {isDrawing && newRoute.points.length > 1 && (
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <path 
                          d={newRoute.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                          stroke="#4c616c"
                          strokeWidth={2}
                          fill="none"
                        />
                      </svg>
                    )}

                    {activeMap.routes.map(route => (
                      <svg key={route.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <path 
                          d={route.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                          stroke="#4c616c"
                          strokeWidth={2}
                          fill="none"
                        />
                      </svg>
                    ))}

                    {activeMap.markers.map(marker => (
                      <div
                        key={marker.id}
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${marker.type === 'city' ? 'text-primary' : marker.type === 'ruin' ? 'text-amber-500' : 'text-red-500'}`}
                        style={{ left: marker.x, top: marker.y }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(marker);
                        }}
                      >
                        <MapPin className="w-6 h-6" />
                      </div>
                    ))}
                  </div>
                </div>

                {selectedMarker && (
                  <div className="absolute top-16 left-4 w-80 bg-surface-container-lowest p-4 rounded-xl shadow-lg z-20 border border-outline-variant/20">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{selectedMarker.name}</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMarker(selectedMarker.id);
                          }}
                          className="text-on-surface-variant/60 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <Badge color={selectedMarker.type === 'city' ? 'bg-primary-container text-on-primary-container' : selectedMarker.type === 'ruin' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                      {selectedMarker.type === 'city' ? '城市' : selectedMarker.type === 'ruin' ? '遗迹' : '战场'}
                    </Badge>
                    {selectedMarker.description && (
                      <p className="mt-4 text-sm text-on-surface-variant/80">{selectedMarker.description}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/9] bg-surface-container-low rounded-xl flex items-center justify-center">
                <p className="text-on-surface-variant/60">请选择或上传地图</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showMarkerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">添加标记点</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">地点名称</label>
                <input
                  type="text"
                  value={newMarker.name}
                  onChange={(e) => setNewMarker({ ...newMarker, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入地点名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">类型</label>
                <select
                  value={newMarker.type}
                  onChange={(e) => setNewMarker({ ...newMarker, type: e.target.value as 'city' | 'ruin' | 'battlefield' })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="city">城市</option>
                  <option value="ruin">遗迹</option>
                  <option value="battlefield">战场</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">关联事件</label>
                <select
                  value={newMarker.eventId}
                  onChange={(e) => setNewMarker({ ...newMarker, eventId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择事件</option>
                  {world.timeline.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">关联人物</label>
                <select
                  value={newMarker.characterId}
                  onChange={(e) => setNewMarker({ ...newMarker, characterId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择人物</option>
                  {world.characters.map(character => (
                    <option key={character.id} value={character.id}>{character.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  value={newMarker.description}
                  onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入地点描述"
                />
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setShowMarkerModal(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleMarkerSave}
                  className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary-dim transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRouteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">绘制路线</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">路线名称</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入路线名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">关联人物</label>
                <select
                  value={newRoute.characterId}
                  onChange={(e) => setNewRoute({ ...newRoute, characterId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择人物</option>
                  {world.characters.map(character => (
                    <option key={character.id} value={character.id}>{character.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">关联事件</label>
                <select
                  value={newRoute.eventId}
                  onChange={(e) => setNewRoute({ ...newRoute, eventId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择事件</option>
                  {world.timeline.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  value={newRoute.description}
                  onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入路线描述"
                />
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <p className="text-sm text-on-surface-variant/80">
                  点击地图上的点来绘制路线，至少需要2个点
                </p>
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => {
                    setShowRouteModal(false);
                    setIsDrawing(false);
                    setNewRoute({ ...newRoute, points: [] });
                  }}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => setIsDrawing(true)}
                  className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold hover:bg-surface-container-low transition-colors"
                >
                  开始绘制
                </button>
                <button
                  onClick={handleRouteSave}
                  disabled={newRoute.points.length < 2}
                  className={`px-6 py-3 rounded-md font-bold transition-colors ${newRoute.points.length < 2 ? 'bg-surface-container-low text-on-surface-variant/40' : 'bg-primary text-on-primary hover:bg-primary-dim'}`}
                >
                  保存路线
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapView;