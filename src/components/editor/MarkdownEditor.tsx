import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  Quote,
  Save,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2
} from 'lucide-react';

interface MarkdownEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

interface Document {
  id: string;
  title: string;
  content: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: '示例文档', content: '# 欢迎使用 Markdown 编辑器\n\n这是一个功能强大的 Markdown 编辑器。\n\n## 功能特点\n\n- 实时预览\n- 目录管理\n- 丰富的工具栏\n\n开始你的创作吧！' }
  ]);
  const [currentDocId, setCurrentDocId] = useState('1');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-1']));

  const currentDoc = documents.find(doc => doc.id === currentDocId);

  useEffect(() => {
    if (currentDoc) {
      setContent(currentDoc.content);
    }
  }, [currentDocId, currentDoc]);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
    setDocuments(docs => docs.map(doc => 
      doc.id === currentDocId ? { ...doc, content } : doc
    ));
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const createNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: '新文档',
      content: ''
    };
    setDocuments([...documents, newDoc]);
    setCurrentDocId(newDoc.id);
  };

  const deleteDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (documents.length <= 1) return;
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
    if (currentDocId === docId) {
      setCurrentDocId(documents[0].id);
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-surface-container-low px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-on-surface-variant">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-surface-container-low border-b border-outline-variant/10 flex items-center px-4 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('# ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="一级标题"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('## ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="二级标题"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('### ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="三级标题"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-outline-variant/20"></div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="粗体"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="斜体"
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-outline-variant/20"></div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('- ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="无序列表"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('1. ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="有序列表"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-outline-variant/20"></div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="链接"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('![alt](', ')')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="图片"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('`', '`')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="代码"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('> ', '')}
            className="p-2 hover:bg-surface-container-high rounded transition-colors"
            title="引用"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1"></div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-on-primary rounded hover:bg-primary-dim transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧目录 - 280px */}
        <div className="w-[280px] bg-surface-container-low border-r border-outline-variant/10 flex flex-col">
          <div className="p-4 border-b border-outline-variant/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-on-surface">文档目录</h2>
              <button
                onClick={createNewDocument}
                className="p-1.5 hover:bg-surface-container-high rounded transition-colors"
                title="新建文档"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {/* 文件夹 */}
            <div className="mb-2">
              <div
                onClick={() => toggleFolder('folder-1')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-surface-container-high rounded cursor-pointer transition-colors"
              >
                {expandedFolders.has('folder-1') ? (
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                )}
                <FileText className="w-4 h-4 text-on-surface-variant" />
                <span className="text-sm font-medium">我的文档</span>
              </div>
              
              {expandedFolders.has('folder-1') && (
                <div className="ml-4 mt-1 space-y-1">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setCurrentDocId(doc.id)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                        currentDocId === doc.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 text-sm truncate">{doc.title}</span>
                      <button
                        onClick={(e) => deleteDocument(doc.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-container-low rounded transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧编辑器和预览区 - 1:1 */}
        <div className="flex-1 flex">
          {/* 编辑器 */}
          <div className="flex-1 flex flex-col">
            <textarea
              id="markdown-textarea"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 p-6 bg-surface resize-none outline-none font-mono text-sm leading-relaxed"
              placeholder="开始编写你的 Markdown 内容..."
              spellCheck={false}
            />
          </div>
          
          {/* 预览区 */}
          <div 
            className="flex-1 p-6 bg-surface overflow-y-auto"
            style={{ borderLeft: '1px solid #E2E8F0' }}
          >
            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;