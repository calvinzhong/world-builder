// 语言文件

interface Locale {
  [key: string]: string;
}

const locales: Record<string, Locale> = {
  'zh-CN': {
    // 导航
    'nav.home': '创造世界',
    'nav.settings': '设定',
    'nav.map': '地图',
    'nav.novel': '小说',
    'nav.search': '搜索...',
    'nav.create': '创建新设定',
    
    // 侧边栏
    'sidebar.currentWorld': '当前世界',
    'sidebar.overview': '概览',
    'sidebar.eras': '时代',
    'sidebar.timeline': '时间轴',
    'sidebar.factions': '势力',
    'sidebar.characters': '人物',
    'sidebar.items': '物品',
    'sidebar.powers': '力量体系',
    'sidebar.currency': '货币',
    'sidebar.settings': '设置',
    'sidebar.archive': '归档',
    'sidebar.novelOverview': '小说概览',
    'sidebar.chapterManagement': '章节管理',
    'sidebar.inspirationNotes': '灵感笔记',
    'sidebar.writingGoals': '写作目标',
    'sidebar.exportPublish': '导出发布',
    'sidebar.collaboration': '协作交流',
    'sidebar.mapSystem': '地图系统',
    
    // 用户详情页
    'user.title': '用户详情',
    'user.editProfile': '编辑资料',
    'user.save': '保存',
    'user.joinedOn': '加入于',
    'user.stats': '创作统计',
    'user.achievements': '成就',
    'user.settings': '设置',
    'user.worldsCreated': '世界数量',
    'user.totalWords': '总字数',
    'user.novelsPublished': '发布小说',
    'user.theme': '主题',
    'user.language': '语言',
    'user.logout': '退出登录',
    'user.theme.light': '浅色',
    'user.theme.dark': '深色',
    'user.theme.system': '跟随系统',
    'user.language.zhCN': '简体中文',
    'user.language.enUS': 'English',
    
    // 按钮
    'button.add': '添加',
    'button.create': '创建',
    'button.edit': '编辑',
    'button.save': '保存',
    'button.cancel': '取消',
    'button.delete': '删除',
    'button.export': '导出',
    'button.import': '导入',
    'button.startWriting': '开始写作',
    'button.editInfo': '编辑信息',
    
    // 其他
    'common.status': '状态',
    'common.draft': '草稿',
    'common.completed': '已完成',
    'common.review': '审核中',
    'common.wordCount': '字数统计',
    'common.lastUpdated': '最后更新',
    'common.chapters': '章节',
    'common.words': '字',
  },
  'en-US': {
    // 导航
    'nav.home': 'World Builder',
    'nav.settings': 'Settings',
    'nav.map': 'Map',
    'nav.novel': 'Novel',
    'nav.search': 'Search...',
    'nav.create': 'Create New Setting',
    
    // 侧边栏
    'sidebar.currentWorld': 'Current World',
    'sidebar.overview': 'Overview',
    'sidebar.eras': 'Eras',
    'sidebar.timeline': 'Timeline',
    'sidebar.factions': 'Factions',
    'sidebar.characters': 'Characters',
    'sidebar.items': 'Items',
    'sidebar.powers': 'Power Systems',
    'sidebar.currency': 'Currency',
    'sidebar.settings': 'Settings',
    'sidebar.archive': 'Archive',
    'sidebar.novelOverview': 'Novel Overview',
    'sidebar.chapterManagement': 'Chapter Management',
    'sidebar.inspirationNotes': 'Inspiration Notes',
    'sidebar.writingGoals': 'Writing Goals',
    'sidebar.exportPublish': 'Export & Publish',
    'sidebar.collaboration': 'Collaboration',
    'sidebar.mapSystem': 'Map System',
    
    // 用户详情页
    'user.title': 'User Details',
    'user.editProfile': 'Edit Profile',
    'user.save': 'Save',
    'user.joinedOn': 'Joined on',
    'user.stats': 'Writing Stats',
    'user.achievements': 'Achievements',
    'user.settings': 'Settings',
    'user.worldsCreated': 'Worlds Created',
    'user.totalWords': 'Total Words',
    'user.novelsPublished': 'Novels Published',
    'user.theme': 'Theme',
    'user.language': 'Language',
    'user.logout': 'Logout',
    'user.theme.light': 'Light',
    'user.theme.dark': 'Dark',
    'user.theme.system': 'System',
    'user.language.zhCN': 'Chinese (Simplified)',
    'user.language.enUS': 'English',
    
    // 按钮
    'button.add': 'Add',
    'button.create': 'Create',
    'button.edit': 'Edit',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.export': 'Export',
    'button.import': 'Import',
    'button.startWriting': 'Start Writing',
    'button.editInfo': 'Edit Info',
    
    // 其他
    'common.status': 'Status',
    'common.draft': 'Draft',
    'common.completed': 'Completed',
    'common.review': 'Review',
    'common.wordCount': 'Word Count',
    'common.lastUpdated': 'Last Updated',
    'common.chapters': 'Chapters',
    'common.words': 'words',
  }
};

export default locales;