import React, { useState } from 'react';
import { PageHeader, Card, Badge, useWorld } from '../../App';
import { Plus, Edit3, Save, X, ChevronDown, ChevronUp, Clock, BarChart2, Users, Book, Tag, Target, Calendar, Activity, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const NovelView = () => {
  const { world } = useWorld();
  const [isEditing, setIsEditing] = useState(false);
  const [isWorldCollapsed, setIsWorldCollapsed] = useState(false);
  const [showSyncBanner, setShowSyncBanner] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [showSyncError, setShowSyncError] = useState(false);
  const [novelDescription, setNovelDescription] = useState(
    '这是一个被永恒迷雾笼罩的世界。在这里，古老的众神已经沉睡，唯有被称为“星影”的余烬在黑暗中闪烁。人类在巨大的浮空岛屿上建立了最后的文明，通过收集大气中的以太维持着生存与繁荣。'
  );

  // 模拟本周写作趋势数据
  const weeklyTrend = [
    { day: '周一', words: 1200 },
    { day: '周二', words: 800 },
    { day: '周三', words: 1500 },
    { day: '周四', words: 0 },
    { day: '周五', words: 2000 },
    { day: '周六', words: 1800 },
    { day: '周日', words: 300 }
  ];

  // 模拟最近活动
  const recentActivities = [
    { id: 1, type: 'chapter', action: '编辑了章节', target: '第三章 以太的秘密', time: '5分钟前' },
    { id: 2, type: 'character', action: '修改了人物', target: '艾琳·星影', time: '2小时前' },
    { id: 3, type: 'goal', action: '完成了每日写作目标', target: '1000字', time: '昨天' },
    { id: 4, type: 'faction', action: '新增了势力', target: '深渊教团', time: '3天前' }
  ];

  // 同步功能处理
  const handleSync = () => {
    setIsSyncing(true);
    setShowSyncError(false);
    // 模拟同步过程，有10%的概率失败
    setTimeout(() => {
      setIsSyncing(false);
      const isSuccess = Math.random() > 0.1; // 90%的成功率
      if (isSuccess) {
        setShowSyncBanner(false);
        setShowSyncSuccess(true);
        // 3秒后隐藏成功提示
        setTimeout(() => {
          setShowSyncSuccess(false);
        }, 3000);
      } else {
        setShowSyncError(true);
        // 5秒后隐藏错误提示
        setTimeout(() => {
          setShowSyncError(false);
        }, 5000);
      }
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* 同步提示横幅 */}
      {(showSyncBanner || showSyncSuccess || showSyncError) && (
        <div className={`rounded-lg p-4 flex items-center justify-between ${showSyncSuccess ? 'bg-success/10 border border-success/20' : showSyncError ? 'bg-error/10 border border-error/20' : 'bg-primary/10 border border-primary/20'}`}>
          <div className="flex items-center gap-3">
            {isSyncing ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : showSyncSuccess ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : showSyncError ? (
              <AlertCircle className="w-5 h-5 text-error" />
            ) : (
              <Activity className="w-5 h-5 text-primary" />
            )}
            <span className="text-sm font-medium">
              {isSyncing ? '正在同步世界设定...' : 
               showSyncSuccess ? '世界设定已成功同步！' : 
               showSyncError ? '同步失败，请稍后重试' : 
               '世界设定有新版本，是否同步？'}
            </span>
          </div>
          {!showSyncSuccess && !showSyncError && (
            <div className="flex gap-2">
              <button 
                className="px-4 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center gap-2"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSyncing ? '同步中...' : '同步'}
              </button>
              <button 
                className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-sm font-medium"
                onClick={() => setShowSyncBanner(false)}
                disabled={isSyncing}
              >
                忽略
              </button>
            </div>
          )}
        </div>
      )}

      <PageHeader 
        title="小说创作" 
        actions={
          <div className="flex gap-4">
            <button 
              className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? '取消' : '编辑信息'}
            </button>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              开始写作
            </button>
          </div>
        }
      />

      {/* 项目基础信息 */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 封面 */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] bg-surface-container-high rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Book className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-on-surface-variant/60 text-center">点击上传封面</p>
            </div>
          </div>

          {/* 基础信息 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">无尽星海</h2>
                <p className="text-lg text-on-surface-variant/80 mt-2">被永恒迷雾笼罩的世界</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-on-surface-variant/60 block mb-1">版权信息</span>
                <span className="font-medium">© 2023 无尽星海 版权所有</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">作者</span>
                <span className="font-medium">当前用户</span>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">状态</span>
                <Badge color="bg-primary/10 text-primary">草稿</Badge>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">小说类型</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge>科幻</Badge>
                  <Badge>奇幻</Badge>
                  <Badge>冒险</Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">目标读者</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge>青少年</Badge>
                  <Badge>成人</Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-2">简介</span>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                    value={novelDescription}
                    onChange={(e) => setNovelDescription(e.target.value)}
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
                      onClick={() => setIsEditing(false)}
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-on-surface-variant/80 leading-relaxed">
                  {novelDescription}
                </p>
              )}
            </div>

            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-2">关键词</span>
              <div className="flex flex-wrap gap-2">
                <Badge color="bg-surface-container-high text-on-surface-variant">科幻</Badge>
                <Badge color="bg-surface-container-high text-on-surface-variant">奇幻</Badge>
                <Badge color="bg-surface-container-high text-on-surface-variant">冒险</Badge>
                <Badge color="bg-surface-container-high text-on-surface-variant">浮空岛</Badge>
                <Badge color="bg-surface-container-high text-on-surface-variant">以太</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">预计字数</span>
                <span className="font-medium">100,000 字</span>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">预计章节</span>
                <span className="font-medium">20 章</span>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">创作开始</span>
                <span className="font-medium">2023-10-01</span>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant/60 block mb-1">最后更新</span>
                <span className="font-medium">2023-10-24</span>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-sm text-on-surface-variant/60 block mb-2">创作目标</span>
              <div className="flex flex-wrap gap-2">
                <Badge color="bg-primary/10 text-primary">完成第一卷</Badge>
                <Badge color="bg-primary/10 text-primary">每日1000字</Badge>
                <Badge color="bg-primary/10 text-primary">月底前完成大纲</Badge>
              </div>
            </div>


          </div>
        </div>
      </Card>

      {/* 进度与统计 */}
      <Card>
        <h3 className="text-xl font-bold mb-8">进度与统计</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-low rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-on-surface-variant/60 block">总字数</span>
                <div className="text-2xl font-bold mt-1">{world.writingStats.totalWords.toLocaleString()}</div>
              </div>
              <button className="text-sm text-primary font-medium">设定目标</button>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: '10%' }}
              />
            </div>
            <span className="text-xs text-on-surface-variant/60">10% 完成</span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6">
            <span className="text-sm text-on-surface-variant/60 block">今日新增</span>
            <div className="text-2xl font-bold mt-1">{world.writingStats.todayWords}</div>
            <span className="text-xs text-on-surface-variant/60 mt-2 block">字</span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6">
            <span className="text-sm text-on-surface-variant/60 block">章节总数</span>
            <div className="text-2xl font-bold mt-1">{world.chapters.length}</div>
            <span className="text-xs text-on-surface-variant/60 mt-2 block">2 已完成</span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6">
            <span className="text-sm text-on-surface-variant/60 block">连续写作</span>
            <div className="text-2xl font-bold mt-1">{world.writingStats.consecutiveDays}</div>
            <span className="text-xs text-on-surface-variant/60 mt-2 block">天</span>
          </div>
        </div>

        {/* 本周写作趋势 */}
        <div>
          <h4 className="text-lg font-medium mb-4">本周写作趋势</h4>
          <div className="bg-surface-container-low rounded-xl p-6">
            <div className="flex items-end justify-between h-64">
              {weeklyTrend.map((item, index) => (
                <div key={index} className="flex flex-col items-center" style={{ width: '12%' }}>
                  <div 
                    className="bg-primary rounded-t-md transition-all" 
                    style={{ 
                      height: `${(item.words / 2000) * 100}%`,
                      width: '80%'
                    }}
                  />
                  <span className="text-xs text-on-surface-variant/60 mt-2">{item.day}</span>
                  <span className="text-xs font-medium mt-1">{item.words}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 关联世界摘要 */}
      <Card>
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => setIsWorldCollapsed(!isWorldCollapsed)}
        >
          <h3 className="text-xl font-bold">关联世界摘要</h3>
          {isWorldCollapsed ? 
            <ChevronDown className="w-5 h-5 text-on-surface-variant/40" /> : 
            <ChevronUp className="w-5 h-5 text-on-surface-variant/40" />
          }
        </div>
        <p className="text-sm text-on-surface-variant/60 mt-2">
          当世界设定发生变化时，点击同步按钮可以更新小说中的相关内容，确保小说与世界设定保持一致。
        </p>

        {!isWorldCollapsed && (
          <div className="mt-6 space-y-4">
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">世界名称</span>
              <span className="font-medium">无尽星海</span>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">时代背景</span>
              <span className="font-medium">浮空时代 (1001 - 2500 AE)</span>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">主要势力</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge>以太议会</Badge>
                <Badge>深渊教团</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">主要人物</span>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-1">
                    艾
                  </div>
                  <span className="text-xs font-medium">艾琳·星影</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-1">
                    索
                  </div>
                  <span className="text-xs font-medium">索恩大师</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">力量体系</span>
              <span className="font-medium">以太感应</span>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant/60 block mb-1">货币</span>
              <span className="font-medium">以太币</span>
            </div>
            <div className="pt-4 border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant/60">世界最后修改时间：2023年10月24日</span>
              <div className="mt-2 flex gap-2">
                <button 
                  className="px-4 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? '同步中...' : '同步'}
                </button>
                <button className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-sm font-medium">忽略</button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 最近活动 */}
      <Card>
        <h3 className="text-xl font-bold mb-6">最近活动</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {activity.type === 'chapter' && <Book className="w-5 h-5" />}
                {activity.type === 'character' && <Users className="w-5 h-5" />}
                {activity.type === 'goal' && <Target className="w-5 h-5" />}
                {activity.type === 'faction' && <Tag className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">
                    {activity.action} <span className="text-primary">{activity.target}</span>
                  </p>
                  <span className="text-xs text-on-surface-variant/60">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NovelView;