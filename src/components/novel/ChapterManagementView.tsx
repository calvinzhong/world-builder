import React, { useState } from 'react';
import { PageHeader, Card, Badge, useWorld } from '../../App';
import { Plus, Edit3, Save, X, ChevronDown, ChevronUp, Book, Clock, Users, Target, Tag, Calendar, Activity, Menu, MoreVertical, Play, Pause, Trash2, Move } from 'lucide-react';

const ChapterManagementView = () => {
  const { world, setWorld } = useWorld();
  const [expandedVolumes, setExpandedVolumes] = useState<Record<string, boolean>>({
    'volume1': true,
    'volume2': false
  });
  const [selectedChapter, setSelectedChapter] = useState<string | null>('chapter1');
  const [isEditing, setIsEditing] = useState(false);
  const [chapterContent, setChapterContent] = useState('在浩瀚的 @浮空岛 的边缘，冷冽的风穿过破碎的动力舱。\n\n@苍空之影 缓缓睁开双眼，视界中充满了跳动的红色警告。深度冷冻舱的液氮雾气正逐渐散去，带走了他最后的梦境。梦里那颗蔚蓝的星球，如今只剩下冰冷的数字残响。\n\n"同步率 12%... 正在校准神经元..."\n\n一个冰冷的电子合成音在耳畔响起。他尝试活动手指，感受着纳米外骨骼传来的微弱阻力。这里的每一寸钢铁都在呻吟，那是整艘星舰在崩溃边缘的最后挣扎。\n\n他必须离开。在深渊吞噬一切之前。');

  // 模拟章节数据
  const chapters = [
    {
      id: 'volume1',
      title: '第一卷：星海初升',
      type: 'volume',
      children: [
        {
          id: 'chapter1',
          title: '第一章：深渊之影',
          type: 'chapter',
          children: [
            {
              id: 'section1',
              title: '01 唤醒',
              type: 'section',
              wordCount: 1200,
              status: 'completed'
            },
            {
              id: 'section2',
              title: '02 逃离',
              type: 'section',
              wordCount: 800,
              status: 'draft'
            }
          ],
          wordCount: 2000,
          status: 'in-progress'
        },
        {
          id: 'chapter2',
          title: '第二章：星舰核心',
          type: 'chapter',
          children: [],
          wordCount: 0,
          status: 'draft'
        }
      ]
    },
    {
      id: 'volume2',
      title: '第二卷：维度裂缝',
      type: 'volume',
      children: []
    }
  ];

  // 模拟节拍建议
  const beatSuggestions = [
    {
      id: 'beat1',
      title: '觉醒与感召',
      description: '主角从原本的静态环境中被唤醒。展示角色最核心的内在矛盾或当前的生存困境。',
      completed: true
    },
    {
      id: 'beat2',
      title: '冲突与挑战',
      description: '主角遭遇第一个重大挑战，被迫面对自己的弱点或外部威胁。',
      completed: false
    },
    {
      id: 'beat3',
      title: '探索与发现',
      description: '主角开始探索新环境，发现关键线索或新的能力。',
      completed: false
    }
  ];

  // 模拟关联人物
  const relatedCharacters = [
    {
      id: 'character1',
      name: '苍空之影',
      role: '主角·幸存者',
      avatar: 'https://picsum.photos/seed/character1/100/100'
    },
    {
      id: 'character2',
      name: '艾琳·星影',
      role: '配角·工程师',
      avatar: 'https://picsum.photos/seed/character2/100/100'
    }
  ];

  // 模拟场景关联
  const sceneConnections = [
    {
      id: 'scene1',
      name: '浮空岛-3号动力舱',
      image: 'https://picsum.photos/seed/scene1/400/200'
    }
  ];

  // 模拟时间轴
  const timeline = [
    {
      id: 'time1',
      time: 'ST.42.08',
      event: '星核聚变反应异常波动',
      completed: true
    },
    {
      id: 'time2',
      time: 'ST.42.12',
      event: '自动冷冻舱强制开启流程',
      completed: false
    }
  ];

  const toggleVolume = (volumeId: string) => {
    setExpandedVolumes(prev => ({
      ...prev,
      [volumeId]: !prev[volumeId]
    }));
  };

  const handleSaveChapter = () => {
    setIsEditing(false);
    // 这里可以添加保存章节内容的逻辑
  };

  return (
    <div className="space-y-12">
      <PageHeader 
        title="章节管理" 
        actions={
          <div className="flex gap-4">
            <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              新增章节
            </button>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
              <Save className="w-4 h-4" />
              保存所有
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 大纲结构 */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Menu className="w-5 h-5" />
              大纲结构
            </h3>
            
            <div className="space-y-4">
              {chapters.map(volume => (
                <div key={volume.id} className="space-y-2">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleVolume(volume.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Menu className="w-4 h-4 text-on-surface-variant/60" />
                      <span className="font-medium">{volume.title}</span>
                    </div>
                    {expandedVolumes[volume.id] ? 
                      <ChevronUp className="w-4 h-4 text-on-surface-variant/40" /> : 
                      <ChevronDown className="w-4 h-4 text-on-surface-variant/40" />
                    }
                  </div>
                  
                  {expandedVolumes[volume.id] && (
                    <div className="ml-6 space-y-2">
                      {volume.children?.map(chapter => (
                        <div key={chapter.id} className="space-y-2">
                          <div 
                            className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-colors ${selectedChapter === chapter.id ? 'bg-primary/10' : 'hover:bg-surface-container-low/50'}`}
                            onClick={() => setSelectedChapter(chapter.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Book className="w-4 h-4 text-on-surface-variant/60" />
                              <span className="font-medium">{chapter.title}</span>
                            </div>
                            <Badge color={chapter.status === 'completed' ? 'bg-success/10 text-success' : chapter.status === 'in-progress' ? 'bg-warning/10 text-warning' : 'bg-surface-container-high text-on-surface-variant'}>
                              {chapter.status === 'completed' ? '已完成' : chapter.status === 'in-progress' ? '进行中' : '草稿'}
                            </Badge>
                          </div>
                          
                          {chapter.children && chapter.children.length > 0 && (
                            <div className="ml-6 space-y-1">
                              {chapter.children.map(section => (
                                <div 
                                  key={section.id} 
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low/50 transition-colors"
                                >
                                  <span className="text-sm">{section.title}</span>
                                  <Badge color={section.status === 'completed' ? 'bg-success/10 text-success' : 'bg-surface-container-high text-on-surface-variant'}>
                                    {section.wordCount}字
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 章节内容 */}
        <div className="lg:col-span-6">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">第一节：唤醒</h3>
              <div className="flex items-center gap-3">
                <Badge color="bg-primary/10 text-primary">DRAFT</Badge>
                <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <MoreVertical className="w-4 h-4 text-on-surface-variant/60" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-6 bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[500px] text-lg leading-relaxed"
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                  />
                  <div className="flex gap-3 justify-end">
                    <button 
                      className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-md text-sm font-medium"
                      onClick={() => setIsEditing(false)}
                    >
                      取消
                    </button>
                    <button 
                      className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
                      onClick={handleSaveChapter}
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {chapterContent.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button 
                      className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4" />
                      编辑内容
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 节拍建议 */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" />
              节拍建议
              <span className="text-sm text-on-surface-variant/60 ml-2">2/12</span>
            </h3>
            
            <div className="space-y-6">
              {beatSuggestions.map((beat, index) => (
                <div key={beat.id} className={`p-4 rounded-xl ${beat.completed ? 'bg-success/5 border border-success/20' : 'bg-surface-container-low'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${beat.completed ? 'bg-success text-on-success' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {beat.completed ? '✓' : index + 1}
                    </div>
                    <h4 className="font-medium">"{beat.title}"</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed">
                    {beat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* 关联人物 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                关联人物
              </h3>
              <div className="space-y-4">
                {relatedCharacters.map(character => (
                  <div key={character.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={character.avatar} 
                        alt={character.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{character.name}</p>
                      <p className="text-xs text-on-surface-variant/60">{character.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 场景关联 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                场景关联
              </h3>
              <div className="space-y-4">
                {sceneConnections.map(scene => (
                  <div key={scene.id} className="rounded-xl overflow-hidden">
                    <img 
                      src={scene.image} 
                      alt={scene.name} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3 bg-surface-container-low">
                      <p className="font-medium">当前位置</p>
                      <p className="text-sm text-on-surface-variant/80">{scene.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 时间轴同步 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                时间轴同步
              </h3>
              <div className="space-y-3">
                {timeline.map(time => (
                  <div key={time.id} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${time.completed ? 'bg-primary' : 'bg-surface-container-high border border-outline-variant'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{time.time}</p>
                      <p className="text-xs text-on-surface-variant/60">{time.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChapterManagementView;