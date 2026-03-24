import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeTestView: React.FC = () => {
  const { theme, setTheme, clearTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-on-surface mb-8">主题测试</h1>
        
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-on-surface mb-4">当前主题状态</h2>
          <div className="space-y-4">
            <div>
              <span className="text-on-surface-variant/60">设置的主题:</span>
              <span className="ml-2 font-bold">{theme}</span>
            </div>
            <div>
              <span className="text-on-surface-variant/60">解析后的主题:</span>
              <span className="ml-2 font-bold">{resolvedTheme}</span>
            </div>
            <div>
              <span className="text-on-surface-variant/60">根元素类:</span>
              <span className="ml-2 font-bold">{document.documentElement.className}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-on-surface mb-4">主题控制</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-6 py-3 rounded-md font-bold transition-colors ${theme === 'light' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}
            >
              浅色主题
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-6 py-3 rounded-md font-bold transition-colors ${theme === 'dark' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}
            >
              深色主题
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-6 py-3 rounded-md font-bold transition-colors ${theme === 'system' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}
            >
              系统主题
            </button>
            <button
              onClick={clearTheme}
              className="px-6 py-3 rounded-md font-bold bg-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors"
            >
              清除主题设置
            </button>
          </div>
        </div>

        <div className="mt-12 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-on-surface mb-4">测试内容</h2>
          <p className="text-on-surface-variant/80 mb-4">
            这是一段测试文本，用于验证主题是否正确应用。
            在浅色主题下，背景应该是浅色，文本应该是深色。
            在深色主题下，背景应该是深色，文本应该是浅色。
          </p>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-on-surface">这是一个卡片，用于测试不同表面层级的颜色。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestView;