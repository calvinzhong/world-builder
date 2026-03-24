/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { 
  BookOpen, 
  History, 
  Clock, 
  Users, 
  User as UserIcon, 
  Layers, 
  Zap, 
  Wallet, 
  Settings, 
  Archive, 
  ChevronRight, 
  Search, 
  Plus, 
  ArrowRight,
  Globe,
  MoreVertical,
  Swords,
  Handshake,
  Shield,
  Sword,
  FileText,
  Lightbulb,
  Target,
  Share2,
  PieChart,
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import CharactersView from './components/characters/CharactersView';
import CharacterDetailView from './components/characters/CharacterDetailView';
import EraDetailView from './components/eras/EraDetailView';
import NewSettingView from './components/settings/NewSettingView';
import PowerSystemDetailView from './components/powers/PowerSystemDetailView';
import FactionDetailView from './components/factions/FactionDetailView';
import ItemDetailView from './components/items/ItemDetailView';
import CurrenciesView from './components/currency/CurrenciesView';
import CurrencyDetailView from './components/currency/CurrencyDetailView';
import MapView from './components/map/MapView';
import NovelView from './components/novel/NovelView';
import ChapterManagementView from './components/novel/ChapterManagementView';
import UserDetailView from './components/UserDetailView';
import ThemeTestView from './components/ThemeTestView';
import useTranslation from './i18n/useTranslation';

// --- Types ---

interface Era {
  id: string;
  name: string;
  description: string;
  years: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface FactionRelationship {
  factionId: string;
  type: 'ally' | 'hostile' | 'neutral';
}

interface Faction {
  id: string;
  name: string;
  description: string;
  relationships: FactionRelationship[];
  leader?: string;
  strengths?: string[];
  weaknesses?: string[];
  level?: number; // 势力等级
}

interface Milestone {
  id: string;
  title: string;
  description: string;
}

interface Bond {
  characterId: string;
  type: string;
  value: number; // 0-100
}

interface Character {
  id: string;
  name: string;
  age: string;
  traits: string[];
  milestones: Milestone[];
  bonds: Bond[];
  factionIds?: string[];
  itemIds: string[];
}

interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  powerSystemId?: string;
}

interface PowerSystem {
  id: string;
  name: string;
  description: string;
  levels: string[];
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'draft' | 'completed' | 'review';
  parentId?: string;
  order: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  group: string;
}

interface WritingGoal {
  daily: number;
  weekly: number;
  total: number;
}

interface MapMarker {
  id: string;
  name: string;
  type: 'city' | 'ruin' | 'battlefield';
  x: number;
  y: number;
  eventId?: string;
  characterId?: string;
  description?: string;
}

interface MapRoute {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  characterId?: string;
  eventId?: string;
  description?: string;
}

interface Map {
  id: string;
  name: string;
  imageUrl: string;
  scale: number;
  markers: MapMarker[];
  routes: MapRoute[];
}

interface Currency {
  id: string;
  name: string;
  description: string;
  baseValue: number;
  unit: string;
  exchangeRates: {
    currencyId: string;
    rate: number;
  }[];
}

interface World {
  id: string;
  name: string;
  description: string;
  eras: Era[];
  timeline: TimelineEvent[];
  factions: Faction[];
  characters: Character[];
  items: Item[];
  powerSystems: PowerSystem[];
  currencies: Currency[];
  chapters: Chapter[];
  notes: Note[];
  maps: Map[];
  writingGoal: WritingGoal;
  writingStats: {
    totalWords: number;
    todayWords: number;
    consecutiveDays: number;
  };
}

// --- Context ---

interface WorldContextType {
  world: World;
  setWorld: React.Dispatch<React.SetStateAction<World>>;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

const useWorld = () => {
  const context = useContext(WorldContext);
  if (!context) throw new Error('useWorld must be used within a WorldProvider');
  return context;
};

// --- Initial Data ---

const INITIAL_WORLD: World = {
  id: 'w1',
  name: '无尽星海',
  description: '这是一个被永恒迷雾笼罩的世界。在这里，古老的众神已经沉睡，唯有被称为“星影”的余烬在黑暗中闪烁。人类在巨大的浮空岛屿上建立了最后的文明，通过收集大气中的以太维持着生存与繁荣。',
  eras: [
    { id: 'e1', name: '蒙昧纪元', description: '众神沉睡后的最初千年，人类在迷雾中挣扎求生。', years: '0 - 1000 AE' },
    { id: 'e2', name: '浮空时代', description: '第一座浮空岛屿被发现，文明开始向高空迁移。', years: '1001 - 2500 AE' }
  ],
  timeline: [
    { id: 't1', year: '1024 AE', title: '以太引擎发明', description: '阿基米德·索恩发明了第一台以太引擎，开启了浮空时代。' },
    { id: 't2', year: '1550 AE', title: '迷雾战争', description: '各大浮空岛屿为了争夺高空以太资源爆发了长达五十年的战争。' },
    { id: 't3', year: '2000 AE', title: '神秘传承', description: '在青云山脉深处，少年林默意外发现了一座古老的洞府，里面藏有上古修士的传承。他获得了《青云诀》修炼心法和一把锈迹斑斑的铁剑。' },
    { id: 't4', year: '2001 AE', title: '加入宗派', description: '凭借传承的力量，林默通过了青云门的入门测试，成为外门弟子。在这里，他结识了大师兄张远和小师妹柳月，三人成为好友。' },
    { id: 't5', year: '2002 AE', title: '初次挑战', description: '外门弟子考核中，林默遇到了来自敌对势力玄铁门的弟子王虎的挑衅。虽然实力悬殊，但林默凭借传承中的剑术勉强获胜，引起了内门长老的注意。' },
    { id: 't6', year: '2003 AE', title: '法宝认主', description: '在宗门宝库中，那把锈剑突然发光，认林默为主，原来是上古神器"青冥剑"。同时，他获得了第一件防御法宝"玄龟盾"。' },
    { id: 't7', year: '2004 AE', title: '宗派大比', description: '林默在宗门大比中一路过关斩将，最终与大师兄张远对决。虽然惜败，但他的表现获得了掌门的赏识，被破格提升为内门弟子。' },
    { id: 't8', year: '2005 AE', title: '神秘预言', description: '林默在修炼时偶然触发了青冥剑中的记忆碎片，得知一个关于"魔劫将至"的预言，而他可能是预言中的关键人物。' },
    { id: 't9', year: '2006 AE', title: '魔修入侵', description: '玄铁门突然与魔修勾结，袭击青云门。林默与张远、柳月并肩作战，却发现王虎已堕入魔道，成为魔修的爪牙。' },
    { id: 't10', year: '2007 AE', title: '寻找线索', description: '为了对抗魔修，林默前往古老的藏书阁寻找线索，发现魔劫的根源与千年前的一场大战有关，而青冥剑的前主人正是当时的关键人物。' },
    { id: 't11', year: '2008 AE', title: '艰难抉择', description: '林默得知要阻止魔劫，需要牺牲自己的修为甚至生命。同时，他发现柳月竟是魔修首领的女儿，但她选择站在正义一边。' },
    { id: 't12', year: '2009 AE', title: '最终决战', description: '林默与魔修首领展开最终决战。在关键时刻，青冥剑爆发全部力量，柳月牺牲自己为林默挡下致命一击，最终林默成功封印了魔修首领，阻止了魔劫，但自己也陷入了沉睡。' }
  ],
  maps: [],

  factions: [
    { id: 'f1', name: '以太议会', description: '管理所有浮空岛屿以太分配的最高机构。', relationships: [{ factionId: 'f2', type: 'hostile' }, { factionId: 'f4', type: 'neutral' }], level: 5 },
    { id: 'f2', name: '深渊教团', description: '崇拜迷雾深处古神的秘密组织。', relationships: [{ factionId: 'f1', type: 'hostile' }, { factionId: 'f3', type: 'ally' }], level: 4 },
    { id: 'f3', name: '星界商会', description: '掌控星际贸易的商业联盟，游走于各个势力之间。', relationships: [{ factionId: 'f2', type: 'ally' }, { factionId: 'f1', type: 'neutral' }], level: 3 },
    { id: 'f4', name: '浮空骑士团', description: '守护浮空岛屿的军事组织，以荣誉和正义为准则。', relationships: [{ factionId: 'f1', type: 'neutral' }, { factionId: 'f5', type: 'hostile' }], level: 4 },
    { id: 'f5', name: '影刃刺客 guild', description: '以暗杀和情报收集为生的秘密组织。', relationships: [{ factionId: 'f4', type: 'hostile' }, { factionId: 'f2', type: 'neutral' }], level: 3 },
    { id: 'f6', name: '元素学院', description: '研究元素魔法和自然力量的学术组织。', relationships: [{ factionId: 'f1', type: 'ally' }, { factionId: 'f2', type: 'neutral' }], level: 4 },
    { id: 'f7', name: '龙骑士团', description: '与巨龙缔结契约的骑士组织，拥有强大的空中战斗力。', relationships: [{ factionId: 'f1', type: 'ally' }, { factionId: 'f4', type: 'ally' }], level: 5 },
    { id: 'f8', name: '暗夜兄弟会', description: '在阴影中活动的盗贼和情报组织。', relationships: [{ factionId: 'f5', type: 'ally' }, { factionId: 'f3', type: 'neutral' }], level: 3 },
    { id: 'f9', name: '圣光教会', description: '信仰光明神的宗教组织，致力于净化黑暗。', relationships: [{ factionId: 'f2', type: 'hostile' }, { factionId: 'f1', type: 'ally' }], level: 4 },
    { id: 'f10', name: '机械工坊', description: '专注于机械发明和科技研究的组织。', relationships: [{ factionId: 'f1', type: 'ally' }, { factionId: 'f6', type: 'neutral' }], level: 3 }
  ],
  characters: [
    { 
      id: 'c1', 
      name: '艾琳·星影', 
      age: '24', 
      traits: ['勇敢', '敏锐', '孤独'], 
      milestones: [{ id: 'm1', title: '发现秘钥', description: '在海渊深处发现了重燃神火的秘钥。' }],
      bonds: [{ characterId: 'c2', type: '导师', value: 85 }, { characterId: 'c3', type: '朋友', value: 70 }, { characterId: 'c10', type: '敌对', value: 20 }],
      factionIds: ['f1'],
      itemIds: ['i1']
    },
    { 
      id: 'c2', 
      name: '索恩大师', 
      age: '78', 
      traits: ['睿智', '严厉'], 
      milestones: [],
      bonds: [{ characterId: 'c1', type: '学徒', value: 85 }, { characterId: 'c4', type: '旧识', value: 60 }],
      factionIds: ['f1', 'f6'],
      itemIds: []
    },
    { 
      id: 'c3', 
      name: '卡修斯·风暴', 
      age: '28', 
      traits: ['忠诚', '勇敢', '正直'], 
      milestones: [{ id: 'm2', title: '骑士授勋', description: '被授予浮空骑士团的最高荣誉。' }],
      bonds: [{ characterId: 'c1', type: '朋友', value: 70 }, { characterId: 'c5', type: '战友', value: 80 }, { characterId: 'c9', type: '敌对', value: 30 }],
      factionIds: ['f4'],
      itemIds: ['i2']
    },
    { 
      id: 'c4', 
      name: '莱雅·月舞', 
      age: '30', 
      traits: ['优雅', '聪明', '神秘'], 
      milestones: [{ id: 'm3', title: '商会领袖', description: '成为星界商会的首席执行官。' }],
      bonds: [{ characterId: 'c2', type: '旧识', value: 60 }, { characterId: 'c6', type: '合作伙伴', value: 75 }],
      factionIds: ['f3'],
      itemIds: ['i3']
    },
    { 
      id: 'c5', 
      name: '加里·铁手', 
      age: '35', 
      traits: ['强壮', '忠诚', '鲁莽'], 
      milestones: [{ id: 'm4', title: '龙骑士', description: '成功与巨龙缔结契约。' }],
      bonds: [{ characterId: 'c3', type: '战友', value: 80 }, { characterId: 'c7', type: '竞争对手', value: 50 }],
      factionIds: ['f7'],
      itemIds: ['i4']
    },
    { 
      id: 'c6', 
      name: '维娜·元素', 
      age: '26', 
      traits: ['聪明', '好奇', '固执'], 
      milestones: [{ id: 'm5', title: '元素大师', description: '掌握了四种元素的融合魔法。' }],
      bonds: [{ characterId: 'c4', type: '合作伙伴', value: 75 }, { characterId: 'c8', type: '师徒', value: 85 }],
      factionIds: ['f6'],
      itemIds: ['i5']
    },
    { 
      id: 'c7', 
      name: '达克·暗影', 
      age: '32', 
      traits: ['敏捷', '狡猾', '残忍'], 
      milestones: [{ id: 'm6', title: '影刃首领', description: '成为影刃刺客公会的首领。' }],
      bonds: [{ characterId: 'c5', type: '竞争对手', value: 50 }, { characterId: 'c9', type: '盟友', value: 70 }, { characterId: 'c10', type: '朋友', value: 65 }],
      factionIds: ['f5'],
      itemIds: ['i6']
    },
    { 
      id: 'c8', 
      name: '莉莉丝·光语', 
      age: '22', 
      traits: ['善良', '虔诚', '勇敢'], 
      milestones: [{ id: 'm7', title: '圣女', description: '被圣光教会授予圣女称号。' }],
      bonds: [{ characterId: 'c6', type: '师徒', value: 85 }, { characterId: 'c11', type: '姐妹', value: 90 }],
      factionIds: ['f9'],
      itemIds: ['i7']
    },
    { 
      id: 'c9', 
      name: '莫甘·血牙', 
      age: '40', 
      traits: ['残忍', '野心', '强大'], 
      milestones: [{ id: 'm8', title: '深渊祭司', description: '成为深渊教团的高级祭司。' }],
      bonds: [{ characterId: 'c3', type: '敌对', value: 30 }, { characterId: 'c7', type: '盟友', value: 70 }, { characterId: 'c12', type: '部下', value: 80 }],
      factionIds: ['f2'],
      itemIds: ['i8']
    },
    { 
      id: 'c10', 
      name: '艾尔文·机械', 
      age: '27', 
      traits: ['聪明', '创新', '古怪'], 
      milestones: [{ id: 'm9', title: '发明大师', description: '发明了自动飞行装置。' }],
      bonds: [{ characterId: 'c1', type: '敌对', value: 20 }, { characterId: 'c7', type: '朋友', value: 65 }, { characterId: 'c13', type: '助手', value: 75 }],
      factionIds: ['f10'],
      itemIds: ['i9']
    },
    { 
      id: 'c11', 
      name: '艾米莉亚·光羽', 
      age: '20', 
      traits: ['天真', '善良', '勇敢'], 
      milestones: [{ id: 'm10', title: '圣光学徒', description: '成为圣光教会的正式学徒。' }],
      bonds: [{ characterId: 'c8', type: '姐妹', value: 90 }, { characterId: 'c14', type: '朋友', value: 60 }],
      factionIds: ['f9'],
      itemIds: []
    },
    { 
      id: 'c12', 
      name: '巴尔·深渊', 
      age: '35', 
      traits: ['忠诚', '强大', '沉默'], 
      milestones: [{ id: 'm11', title: '深渊骑士', description: '成为深渊教团的骑士队长。' }],
      bonds: [{ characterId: 'c9', type: '部下', value: 80 }, { characterId: 'c15', type: '敌人', value: 25 }],
      factionIds: ['f2'],
      itemIds: ['i10']
    },
    { 
      id: 'c13', 
      name: '托比·齿轮', 
      age: '25', 
      traits: ['勤奋', '忠诚', '技术精湛'], 
      milestones: [{ id: 'm12', title: '首席助手', description: '成为机械工坊的首席助手。' }],
      bonds: [{ characterId: 'c10', type: '助手', value: 75 }, { characterId: 'c16', type: '朋友', value: 65 }],
      factionIds: ['f10'],
      itemIds: []
    },
    { 
      id: 'c14', 
      name: '莎拉·风语', 
      age: '23', 
      traits: ['自由', '活泼', '机智'], 
      milestones: [{ id: 'm13', title: '商队领队', description: '成为星界商会的商队领队。' }],
      bonds: [{ characterId: 'c11', type: '朋友', value: 60 }, { characterId: 'c17', type: '合作伙伴', value: 70 }],
      factionIds: ['f3'],
      itemIds: []
    },
    { 
      id: 'c15', 
      name: '亚瑟·圣光', 
      age: '30', 
      traits: ['正直', '勇敢', '虔诚'], 
      milestones: [{ id: 'm14', title: '圣骑士', description: '成为圣光教会的圣骑士。' }],
      bonds: [{ characterId: 'c12', type: '敌人', value: 25 }, { characterId: 'c18', type: '战友', value: 75 }],
      factionIds: ['f9'],
      itemIds: []
    },
    { 
      id: 'c16', 
      name: '露娜·星尘', 
      age: '22', 
      traits: ['神秘', '聪明', '冷静'], 
      milestones: [{ id: 'm15', title: '星象师', description: '掌握了星象预言的能力。' }],
      bonds: [{ characterId: 'c13', type: '朋友', value: 65 }, { characterId: 'c19', type: '竞争对手', value: 45 }],
      factionIds: ['f6'],
      itemIds: []
    },
    { 
      id: 'c17', 
      name: '杰克·暗夜', 
      age: '28', 
      traits: ['敏捷', '狡猾', '幽默'], 
      milestones: [{ id: 'm16', title: '盗贼大师', description: '成为暗夜兄弟会的盗贼大师。' }],
      bonds: [{ characterId: 'c14', type: '合作伙伴', value: 70 }, { characterId: 'c20', type: '盟友', value: 60 }],
      factionIds: ['f8'],
      itemIds: []
    },
    { 
      id: 'c18', 
      name: '奥黛丽·龙语', 
      age: '26', 
      traits: ['高贵', '强大', '智慧'], 
      milestones: [{ id: 'm17', title: '龙语者', description: '掌握了与巨龙沟通的能力。' }],
      bonds: [{ characterId: 'c15', type: '战友', value: 75 }, { characterId: 'c5', type: '盟友', value: 65 }],
      factionIds: ['f7'],
      itemIds: []
    },
    { 
      id: 'c19', 
      name: '卡尔·火元素', 
      age: '30', 
      traits: ['热情', '冲动', '强大'], 
      milestones: [{ id: 'm18', title: '火元素使', description: '掌握了高级火元素魔法。' }],
      bonds: [{ characterId: 'c16', type: '竞争对手', value: 45 }, { characterId: 'c6', type: '师徒', value: 70 }],
      factionIds: ['f6'],
      itemIds: []
    },
    { 
      id: 'c20', 
      name: '娜塔莎·暗影', 
      age: '25', 
      traits: ['神秘', '敏捷', '危险'], 
      milestones: [{ id: 'm19', title: '暗影刺客', description: '成为影刃刺客公会的顶级刺客。' }],
      bonds: [{ characterId: 'c17', type: '盟友', value: 60 }, { characterId: 'c7', type: '部下', value: 75 }],
      factionIds: ['f5'],
      itemIds: []
    }
  ],
  items: [
    { id: 'i1', name: '星辰秘钥', description: '传说中能唤醒众神的神器。', type: '神器', powerSystemId: 'p1' },
    { id: 'i2', name: '九霄环佩', description: '上古仙器，能引动九霄云雷之力。', type: '仙器', powerSystemId: 'p1' },
    { id: 'i3', name: '玄黄之气', description: '天地初开时诞生的混沌之气，可塑造万物。', type: '灵物', powerSystemId: 'p1' },
    { id: 'i4', name: '凤凰涅槃丹', description: '服用后可获得凤凰涅槃之力，重生并提升修为。', type: '丹药', powerSystemId: 'p1' },
    { id: 'i5', name: '昆仑镜', description: '能映照过去未来，窥探天机的神镜。', type: '神器', powerSystemId: 'p1' },
    { id: 'i6', name: '混沌钟', description: '镇压气运，防御无双的先天灵宝。', type: '灵宝', powerSystemId: 'p1' },
    { id: 'i7', name: '生死簿', description: '掌控生死轮回的神器，可改写命运。', type: '神器', powerSystemId: 'p1' },
    { id: 'i8', name: '如意金箍棒', description: '可大可小，重达一万三千五百斤的神兵。', type: '神兵', powerSystemId: 'p1' },
    { id: 'i9', name: '九品莲台', description: '西方极乐世界的圣物，能净化一切邪祟。', type: '灵物', powerSystemId: 'p1' },
    { id: 'i10', name: '斩仙飞刀', description: '能斩尽世间一切仙人的飞刀，百发百中。', type: '神兵', powerSystemId: 'p1' }
  ],
  powerSystems: [
    { id: 'p1', name: '以太感应', description: '通过共鸣大气中的以太来施展奇迹的能力。', levels: ['学徒', '行者', '大师', '先知'] }
  ],
  currencies: [
    {
      id: 'c1',
      name: '灵石',
      description: '修真界最基础的货币，蕴含天地灵气，可用于修炼和交易。',
      baseValue: 1,
      unit: '块',
      exchangeRates: [
        { currencyId: 'c2', rate: 0.01 },
        { currencyId: 'c3', rate: 0.0001 },
        { currencyId: 'c4', rate: 0.002 },
        { currencyId: 'c5', rate: 0.005 }
      ]
    },
    {
      id: 'c2',
      name: '灵晶',
      description: '高级货币，蕴含更纯净的灵气，价值远高于灵石。',
      baseValue: 100,
      unit: '颗',
      exchangeRates: [
        { currencyId: 'c1', rate: 100 },
        { currencyId: 'c3', rate: 0.01 },
        { currencyId: 'c4', rate: 0.2 },
        { currencyId: 'c5', rate: 0.5 }
      ]
    },
    {
      id: 'c3',
      name: '仙玉',
      description: '仙界专用货币，蕴含仙力，是修仙者的终极追求。',
      baseValue: 10000,
      unit: '枚',
      exchangeRates: [
        { currencyId: 'c1', rate: 10000 },
        { currencyId: 'c2', rate: 100 },
        { currencyId: 'c4', rate: 20 },
        { currencyId: 'c5', rate: 50 }
      ]
    },
    {
      id: 'c4',
      name: '魔晶',
      description: '魔界流通的货币，蕴含魔气，对修真者有一定危害。',
      baseValue: 500,
      unit: '颗',
      exchangeRates: [
        { currencyId: 'c1', rate: 500 },
        { currencyId: 'c2', rate: 5 },
        { currencyId: 'c3', rate: 0.05 },
        { currencyId: 'c5', rate: 2.5 }
      ]
    },
    {
      id: 'c5',
      name: '妖丹',
      description: '妖修使用的货币，由妖力凝聚而成，对人类修真者有辅助作用。',
      baseValue: 200,
      unit: '颗',
      exchangeRates: [
        { currencyId: 'c1', rate: 200 },
        { currencyId: 'c2', rate: 2 },
        { currencyId: 'c3', rate: 0.02 },
        { currencyId: 'c4', rate: 0.4 }
      ]
    }
  ],
  chapters: [],
  notes: [],
  writingGoal: {
    daily: 1000,
    weekly: 7000,
    total: 100000
  },
  writingStats: {
    totalWords: 12482,
    todayWords: 500,
    consecutiveDays: 7
  }
};

// --- Components ---

const SidebarItem: React.FC<{ icon: LucideIcon, label: string, to: string }> = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-8 py-3 transition-all duration-300 font-medium text-[13px] 2xl:text-base group
        ${active 
          ? 'text-on-surface bg-surface-container-lowest/80 rounded-r-full shadow-sm' 
          : 'text-on-surface-variant/60 hover:text-on-surface hover:translate-x-1'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-on-surface-variant/40 group-hover:text-primary'}`} />
      <span>{label}</span>
    </Link>
  );
};

const PageHeader: React.FC<{ title: string, breadcrumb?: string, actions?: React.ReactNode }> = ({ title, breadcrumb, actions }) => (
  <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      {breadcrumb && (
        <nav className="flex items-center gap-2 mb-4 text-on-surface-variant/60 label-font text-[10px] 2xl:text-xs tracking-widest uppercase font-bold">
          <span className="hover:text-primary cursor-pointer transition-colors">所有世界</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary">{breadcrumb}</span>
        </nav>
      )}
      <h1 className="text-4xl 2xl:text-6xl font-extrabold tracking-tight text-on-surface">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      {actions}
    </div>
  </header>
);

const Card: React.FC<{ title?: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={`bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 ${className}`}>
    {title && <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40 label-font mb-8">{title}</h3>}
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-primary-container text-on-primary-container' }) => (
  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider label-font ${color}`}>
    {children}
  </span>
);

// --- Views ---

const OverviewView = () => {
  const { world } = useWorld();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="世界概览" breadcrumb="蒙昧纪元" />
      <Card title="核心描述">
        <div className="space-y-8">
          <p className="text-xl 2xl:text-3xl text-on-surface leading-relaxed font-light first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-tight">
            {world.description}
          </p>
        </div>
        <div className="mt-16 pt-10 border-t border-outline-variant/10 flex flex-wrap gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 label-font font-bold">字数统计</span>
            <span className="text-xl font-black">12,482</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 label-font font-bold">最后更新</span>
            <span className="text-xl font-black">2023年10月24日</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 label-font font-bold">状态</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xl font-black text-primary">草稿</span>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="最近时代">
          <div className="space-y-4">
            {world.eras.slice(0, 2).map(era => (
              <Link key={era.id} to={`/eras/${era.id}`} className="block hover:bg-surface-container-high transition-colors">
                <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <h4 className="font-bold">{era.name}</h4>
                    <p className="text-xs text-on-surface-variant/60">{era.years}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card title="关键势力">
          <div className="flex flex-wrap gap-2">
            {world.factions.map(f => (
              <Badge key={f.id}>{f.name}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

const ErasView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEra, setNewEra] = useState({
    name: '',
    description: '',
    years: ''
  });

  const handleAddEra = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewEra({ name: '', description: '', years: '' });
  };

  const handleSubmit = () => {
    if (newEra.name && newEra.description && newEra.years) {
      const era = {
        id: `e${world.eras.length + 1}`,
        ...newEra
      };
      setWorld(prevWorld => ({
        ...prevWorld,
        eras: [...prevWorld.eras, era]
      }));
      handleModalClose();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="时代背景" actions={<button onClick={handleAddEra} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 添加时代</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {world.eras.map(era => (
          <Link key={era.id} to={`/eras/${era.id}`} className="block hover:bg-surface-container-high transition-colors">
            <Card className="hover:border-primary/20 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{era.name}</h3>
                <Badge color="bg-surface-container-high text-on-surface-variant">{era.years}</Badge>
              </div>
              <p className="text-on-surface-variant/80 leading-relaxed">{era.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">添加新时代</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">时代名称</label>
                <input 
                  type="text" 
                  value={newEra.name} 
                  onChange={(e) => setNewEra({ ...newEra, name: e.target.value })} 
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入时代名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">时代描述</label>
                <textarea 
                  value={newEra.description} 
                  onChange={(e) => setNewEra({ ...newEra, description: e.target.value })} 
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  placeholder="输入时代背景描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">年份范围</label>
                <input 
                  type="text" 
                  value={newEra.years} 
                  onChange={(e) => setNewEra({ ...newEra, years: e.target.value })} 
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="例如：2501 - 3000 AE"
                />
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button onClick={handleModalClose} className="px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-md font-medium">取消</button>
                <button onClick={handleSubmit} className="px-6 py-3 bg-primary text-on-primary rounded-md font-bold">确认添加</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const TimelineView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    year: '',
    title: '',
    description: ''
  });

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (newEvent.year && newEvent.title && newEvent.description) {
      const eventToAdd = {
        id: `t${world.timeline.length + 1}`,
        ...newEvent
      };
      setWorld(prevWorld => ({
        ...prevWorld,
        timeline: [...prevWorld.timeline, eventToAdd]
      }));
      setIsModalOpen(false);
      setNewEvent({
        year: '',
        title: '',
        description: ''
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="历史时间轴" actions={<button onClick={handleAddEvent} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 记录事件</button>} />
      <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
        {world.timeline.map(event => (
          <div key={event.id} className="relative">
            <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-surface border-4 border-primary shadow-sm" />
            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <div className="md:w-32 flex-shrink-0">
                <span className="text-xl font-black text-primary label-font">{event.year}</span>
              </div>
              <Card className="flex-1">
                <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                <p className="text-on-surface-variant/80">{event.description}</p>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding event */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">记录新事件</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">年份</label>
                <input
                  type="text"
                  value={newEvent.year}
                  onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="例如：1000 AE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="事件标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="事件详情描述"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-outline-variant rounded-lg font-medium hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dim transition-colors"
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

const FactionsView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFaction, setNewFaction] = useState({
    name: '',
    description: '',
    leader: '',
    strengths: '',
    weaknesses: '',
    level: 1
  });

  const handleAddFaction = () => {
    setIsModalOpen(true);
  };

  const handleSaveFaction = () => {
    if (newFaction.name && newFaction.description) {
      const factionToAdd = {
        id: `f${world.factions.length + 1}`,
        name: newFaction.name,
        description: newFaction.description,
        leader: newFaction.leader,
        strengths: newFaction.strengths ? newFaction.strengths.split(',').map(s => s.trim()).filter(Boolean) : [],
        weaknesses: newFaction.weaknesses ? newFaction.weaknesses.split(',').map(w => w.trim()).filter(Boolean) : [],
        level: newFaction.level,
        relationships: []
      };
      setWorld(prevWorld => ({
        ...prevWorld,
        factions: [...prevWorld.factions, factionToAdd]
      }));
      setIsModalOpen(false);
      setNewFaction({
        name: '',
        description: '',
        leader: '',
        strengths: '',
        weaknesses: '',
        level: 1
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="势力设定" actions={<button onClick={handleAddFaction} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 创建势力</button>} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {world.factions.map((faction) => {
          const memberCount = world.characters.filter(char => char.factionIds?.includes(faction.id)).length;
          return (
            <Link key={faction.id} to={`/factions/${faction.id}`} className="block hover:shadow-md transition-shadow group">
              <Card className="hover:border-primary/20 transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{faction.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color="bg-surface-container-high text-on-surface-variant">{memberCount}人</Badge>
                    <Badge color="bg-primary/10 text-primary">等级 {faction.level || 1}</Badge>
                  </div>
                </div>
                <p className="text-on-surface-variant/80 mb-8">{faction.description}</p>
                
                {faction.leader && (
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-2">首领</h4>
                    <p className="text-on-surface">{faction.leader}</p>
                  </div>
                )}
                
                {faction.strengths && faction.strengths.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-2">优点</h4>
                    <div className="flex flex-wrap gap-2">
                      {faction.strengths.map((strength, idx) => (
                        <Badge key={idx} color="bg-success/10 text-success">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {faction.weaknesses && faction.weaknesses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-2">缺点</h4>
                    <div className="flex flex-wrap gap-2">
                      {faction.weaknesses.map((weakness, idx) => (
                        <Badge key={idx} color="bg-error/10 text-error">{weakness}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">外交关系</h4>
                  <div className="flex flex-wrap gap-3">
                    {faction.relationships.map((rel) => {
                      const target = world.factions.find(f => f.id === rel.factionId);
                      return (
                        <div key={rel.factionId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${rel.type === 'hostile' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                          {rel.type === 'hostile' ? <Swords className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                          <span>{rel.type === 'hostile' ? '敌对' : '同盟'}: {target?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Modal for adding faction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">创建新势力</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">势力名称</label>
                <input
                  type="text"
                  value={newFaction.name}
                  onChange={(e) => setNewFaction({ ...newFaction, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入势力名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">势力描述</label>
                <textarea
                  value={newFaction.description}
                  onChange={(e) => setNewFaction({ ...newFaction, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="描述这个势力的背景和特点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">首领</label>
                <input
                  type="text"
                  value={newFaction.leader}
                  onChange={(e) => setNewFaction({ ...newFaction, leader: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入势力首领名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">优点</label>
                <input
                  type="text"
                  value={newFaction.strengths}
                  onChange={(e) => setNewFaction({ ...newFaction, strengths: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入优点，多个优点用逗号分隔"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">缺点</label>
                <input
                  type="text"
                  value={newFaction.weaknesses}
                  onChange={(e) => setNewFaction({ ...newFaction, weaknesses: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入缺点，多个缺点用逗号分隔"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">势力等级</label>
                <input
                  type="number"
                  value={newFaction.level}
                  onChange={(e) => setNewFaction({ ...newFaction, level: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="10"
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入势力等级"
                />
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-md font-medium">取消</button>
                <button onClick={handleSaveFaction} className="px-6 py-3 bg-primary text-on-primary rounded-md font-bold">确认添加</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};



const ItemsView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    id: `i${Date.now()}`,
    name: '',
    description: '',
    type: '',
    powerSystemId: ''
  });

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (newItem.name && newItem.description && newItem.type) {
      setWorld(prevWorld => ({
        ...prevWorld,
        items: [...prevWorld.items, newItem]
      }));
      setIsModalOpen(false);
      // 重置表单
      setNewItem({
        id: `i${Date.now()}`,
        name: '',
        description: '',
        type: '',
        powerSystemId: ''
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="物品设定" actions={<button onClick={handleAddItem} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> 新增物品</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {world.items.map(item => (
          <Link key={item.id} to={`/items/${item.id}`} className="block hover:bg-surface-container-high transition-colors">
            <Card className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sword className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <Badge color="bg-surface-container-high text-on-surface-variant">{item.type}</Badge>
                </div>
              </div>
              <p className="text-on-surface-variant/80 text-sm leading-relaxed">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Modal for adding item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">新增物品</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">物品名称</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入物品名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">物品描述</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入物品描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">物品类型</label>
                <input
                  type="text"
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入物品类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">关联力量体系 (可选)</label>
                <select
                  value={newItem.powerSystemId}
                  onChange={(e) => setNewItem({ ...newItem, powerSystemId: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">选择力量体系</option>
                  {world.powerSystems.map(power => (
                    <option key={power.id} value={power.id}>{power.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveItem}
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

const PowersView = () => {
  const { world, setWorld } = useWorld();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPowerSystem, setNewPowerSystem] = useState({
    id: `p${Date.now()}`,
    name: '',
    description: '',
    levels: ['']
  });

  const handleAddPowerSystem = () => {
    setIsModalOpen(true);
  };

  const handleAddLevel = () => {
    setNewPowerSystem(prev => ({
      ...prev,
      levels: [...prev.levels, '']
    }));
  };

  const handleLevelChange = (index: number, value: string) => {
    setNewPowerSystem(prev => {
      const newLevels = [...prev.levels];
      newLevels[index] = value;
      return {
        ...prev,
        levels: newLevels
      };
    });
  };

  const handleRemoveLevel = (index: number) => {
    if (newPowerSystem.levels.length > 1) {
      setNewPowerSystem(prev => ({
        ...prev,
        levels: prev.levels.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSavePowerSystem = () => {
    if (newPowerSystem.name && newPowerSystem.description && newPowerSystem.levels.some(level => level)) {
      setWorld(prevWorld => ({
        ...prevWorld,
        powerSystems: [...prevWorld.powerSystems, newPowerSystem]
      }));
      setIsModalOpen(false);
      setNewPowerSystem({
        id: `p${Date.now()}`,
        name: '',
        description: '',
        levels: ['']
      });
    }
  };

  // 导入功能
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState('');

  const handleImportPowerSystem = () => {
    setIsImportModalOpen(true);
    setImportError('');
  };

  const handleDownloadTemplate = () => {
    const template = {
      powerSystems: [
        {
          name: '示例力量体系',
          description: '这是一个力量体系示例',
          levels: ['初级', '中级', '高级', '大师']
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '力量体系模板.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (Array.isArray(data.powerSystems)) {
          const importedPowerSystems = data.powerSystems.map((ps: any) => ({
            id: `p${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: ps.name || '',
            description: ps.description || '',
            levels: ps.levels || []
          }));
          
          setWorld(prevWorld => ({
            ...prevWorld,
            powerSystems: [...prevWorld.powerSystems, ...importedPowerSystems]
          }));
          
          setIsImportModalOpen(false);
        } else {
          setImportError('无效的文件格式：缺少powerSystems数组');
        }
      } catch (error) {
        setImportError('文件解析失败：请确保上传的是有效的JSON文件');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="力量体系" actions={
        <div className="flex gap-4">
          <button onClick={handleImportPowerSystem} className="bg-surface-container-high text-on-surface px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg border border-outline-variant">
            导入
          </button>
          <button onClick={handleAddPowerSystem} className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> 力量体系
          </button>
        </div>
      } />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {world.powerSystems.map((power) => (
          <Link key={power.id} to={`/powers/${power.id}`} className="block hover:bg-surface-container-high transition-colors">
            <Card className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{power.name}</h3>
              </div>
              <p className="text-on-surface-variant/80 mb-8">{power.description}</p>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">等级划分</h4>
                <div className="flex flex-wrap gap-2">
                  {power.levels.map((level, idx) => (
                    <div key={level} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{idx + 1}.</span>
                      <Badge color="bg-surface-container-high text-on-surface-variant">{level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Modal for adding power system */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">新增力量体系</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">体系名称</label>
                <input
                  type="text"
                  value={newPowerSystem.name}
                  onChange={(e) => setNewPowerSystem({ ...newPowerSystem, name: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  placeholder="输入力量体系名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">体系描述</label>
                <textarea
                  value={newPowerSystem.description}
                  onChange={(e) => setNewPowerSystem({ ...newPowerSystem, description: e.target.value })}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  placeholder="输入力量体系描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">等级划分</label>
                {newPowerSystem.levels.map((level, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => handleLevelChange(index, e.target.value)}
                      className="flex-1 p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                      placeholder={`等级 ${index + 1}`}
                    />
                    {newPowerSystem.levels.length > 1 && (
                      <button
                        onClick={() => handleRemoveLevel(index)}
                        className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddLevel}
                  className="mt-2 px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-sm"
                >
                  添加等级
                </button>
              </div>
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSavePowerSystem}
                  className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary-dim transition-colors"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for importing power system */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">导入力量体系</h3>
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full py-3 bg-surface-container-low text-on-surface rounded-lg font-medium hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  下载导入模板
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">上传文件</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              {importError && (
                <div className="p-3 bg-error/10 text-error rounded-lg text-sm">
                  {importError}
                </div>
              )}
              <div className="flex gap-4 justify-end mt-8">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-6 py-3 rounded-md font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [world, setWorld] = useState<World>(INITIAL_WORLD);

  return (
    <ThemeProvider>
      <WorldContext.Provider value={{ world, setWorld }}>
        <Router>
          <MainContent world={world} setWorld={setWorld} />
        </Router>
      </WorldContext.Provider>
    </ThemeProvider>
  );
}

const MainContent: React.FC<{ world: World; setWorld: React.Dispatch<React.SetStateAction<World>> }> = ({ world, setWorld }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-start items-center h-16 2xl:h-20 border-b border-outline-variant/5">
        <div className="max-w-[2400px] w-full flex justify-between items-center px-8 2xl:px-12">
          <div className="flex items-center gap-12 2xl:gap-16">
            <Link to="/" className="text-xl 2xl:text-2xl font-light tracking-tighter text-on-surface">{t('nav.home')}</Link>
            <div className="hidden md:flex items-center gap-8 2xl:gap-12 text-sm 2xl:text-base tracking-wide">
              <Link className={`${location.pathname === '/' || (location.pathname !== '/map' && !location.pathname.startsWith('/novel')) ? 'text-on-surface font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant/60 hover:text-on-surface transition-colors'}`} to="/">{t('nav.settings')}</Link>
              <Link className={`${location.pathname.startsWith('/map') ? 'text-on-surface font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant/60 hover:text-on-surface transition-colors'}`} to="/map">{t('nav.map')}</Link>
              <Link className={`${location.pathname.startsWith('/novel') ? 'text-on-surface font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant/60 hover:text-on-surface transition-colors'}`} to="/novel">{t('nav.novel')}</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4 2xl:gap-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                type="text" 
                placeholder={t('nav.search')} 
                className="bg-surface-container-low border-none rounded-full py-1.5 2xl:py-2.5 pl-10 pr-4 text-sm 2xl:text-base w-64 2xl:w-96 focus:ring-1 focus:ring-primary transition-all outline-none"
              />
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 2xl:p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all duration-300"
              title={resolvedTheme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {resolvedTheme === 'light' ? (
                <Moon className="w-5 h-5 2xl:w-6 2xl:h-6" />
              ) : (
                <Sun className="w-5 h-5 2xl:w-6 2xl:h-6" />
              )}
            </button>
            <button onClick={() => navigate('/new-setting')} className="bg-primary text-on-primary px-4 2xl:px-8 py-2 2xl:py-3 rounded-md text-sm 2xl:text-base font-medium hover:bg-primary-dim transition-all duration-300 shadow-lg shadow-primary/10">
              {t('nav.create')}
            </button>
            <button onClick={() => navigate('/user')} className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/10 cursor-pointer focus:ring-2 focus:ring-primary transition-all">
              <img 
                src="https://picsum.photos/seed/author/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="h-screen w-64 2xl:w-80 fixed left-0 top-16 2xl:top-20 bg-surface-container-low/30 flex flex-col py-8 pr-4 z-40">
        <div className="px-8 mb-10">
          <p className="text-[10px] 2xl:text-xs uppercase tracking-[0.2em] text-on-surface-variant/40 label-font font-bold mb-2">{t('sidebar.currentWorld')}</p>
          <div className="flex items-center justify-between group cursor-pointer hover:bg-surface-container-high/50 -ml-2 px-2 py-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 2xl:w-8 2xl:h-8 rounded bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 2xl:w-5 2xl:h-5 text-primary" />
              </div>
              <h2 className="text-lg 2xl:text-xl font-extrabold text-on-surface tracking-tight">{world.name}</h2>
            </div>
            <MoreVertical className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {location.pathname.startsWith('/novel') ? (
          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1">
            <SidebarItem icon={FileText} label={t('sidebar.novelOverview')} to="/novel" />
            <SidebarItem icon={FileText} label={t('sidebar.chapterManagement')} to="/novel/chapters" />
            <SidebarItem icon={Lightbulb} label={t('sidebar.inspirationNotes')} to="/novel/notes" />
            <SidebarItem icon={Target} label={t('sidebar.writingGoals')} to="/novel/goals" />
            <SidebarItem icon={Share2} label={t('sidebar.exportPublish')} to="/novel/export" />
            <SidebarItem icon={MessageSquare} label={t('sidebar.collaboration')} to="/novel/collaboration" />
          </nav>
        ) : location.pathname.startsWith('/map') ? (
          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1">
            <SidebarItem icon={Globe} label={t('sidebar.mapSystem')} to="/map" />
          </nav>
        ) : (
          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1">
            <SidebarItem icon={BookOpen} label={t('sidebar.overview')} to="/" />
            <SidebarItem icon={History} label={t('sidebar.eras')} to="/eras" />
            <SidebarItem icon={Clock} label={t('sidebar.timeline')} to="/timeline" />
            <SidebarItem icon={Users} label={t('sidebar.factions')} to="/factions" />
            <SidebarItem icon={UserIcon} label={t('sidebar.characters')} to="/characters" />
            <SidebarItem icon={Layers} label={t('sidebar.items')} to="/items" />
            <SidebarItem icon={Zap} label={t('sidebar.powers')} to="/powers" />
            <SidebarItem icon={Wallet} label={t('sidebar.currency')} to="/currency" />
          </nav>
        )}

        <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
          <SidebarItem icon={Settings} label={t('sidebar.settings')} to="/settings" />
          <SidebarItem icon={Archive} label={t('sidebar.archive')} to="/archive" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 2xl:ml-80 mt-16 2xl:mt-20 p-10 2xl:p-20 min-h-screen flex justify-center">
        <div className="max-w-[1600px] w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<OverviewView />} />
              <Route path="/eras" element={<ErasView />} />
              <Route path="/eras/:id" element={<EraDetailView />} />
              <Route path="/timeline" element={<TimelineView />} />
              <Route path="/factions" element={<FactionsView />} />
              <Route path="/factions/:id" element={<FactionDetailView />} />
              <Route path="/characters" element={<CharactersView />} />
              <Route path="/characters/:id" element={<CharacterDetailView />} />
              <Route path="/items" element={<ItemsView />} />
              <Route path="/items/:id" element={<ItemDetailView />} />
              <Route path="/powers" element={<PowersView />} />
              <Route path="/powers/:id" element={<PowerSystemDetailView />} />
              <Route path="/currency" element={<CurrenciesView />} />
              <Route path="/currency/:id" element={<CurrencyDetailView />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/novel" element={<NovelView />} />
              <Route path="/novel/chapters" element={<ChapterManagementView />} />
              <Route path="/novel/notes" element={<NovelView />} />
              <Route path="/novel/goals" element={<NovelView />} />
              <Route path="/novel/export" element={<NovelView />} />
              <Route path="/novel/collaboration" element={<NovelView />} />
              <Route path="/novel/ai" element={<NovelView />} />
              <Route path="/user" element={<UserDetailView />} />
              <Route path="/new-setting" element={<NewSettingView />} />
              <Route path="/theme-test" element={<ThemeTestView />} />
              <Route path="*" element={<OverviewView />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export { useWorld, PageHeader, Card, Badge };
