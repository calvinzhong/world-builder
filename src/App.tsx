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
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import CharactersView from './components/characters/CharactersView';
import CharacterDetailView from './components/characters/CharacterDetailView';
import CharacterConfigView from './components/characters/CharacterConfigView';
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
  friendlyValue: number;
  hostileValue: number;
}

interface Character {
  id: string;
  name: string;
  age: string;
  gender?: 'male' | 'female';
  avatarConfigId?: string;
  traits: string[];
  milestones: Milestone[];
  bonds: Bond[];
  factionId?: string;
  factionIds?: string[];
  itemIds: string[];
  bio?: string;
  powerStats?: { [key: string]: number };
}

interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  powerSystemId?: string;
  rarity?: string;
  origin?: string;
  attributes?: { name: string; value: string }[];
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

interface AvatarConfig {
  id: string;
  name: string;
  baseUrl: string;
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
  characterTags: string[];
  bondTypes: string[];
  avatarConfigs: AvatarConfig[];
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
    { id: 't2', year: '1550 AE', title: '迷雾战争', description: '各大浮空岛屿为了争夺高空以太资源爆发了长达五十年的战争。' }
  ],
  maps: [],

  factions: [
    { id: 'f1', name: '以太议会', description: '管理所有浮空岛屿以太分配的最高机构。', relationships: [{ factionId: 'f2', type: 'hostile' }], level: 5 },
    { id: 'f2', name: '深渊教团', description: '崇拜迷雾深处古神的秘密组织。', relationships: [{ factionId: 'f1', type: 'hostile' }], level: 4 }
  ],
  characters: [
    { id: 'c1', name: '艾琳·星影', age: '24', gender: 'female', avatarConfigId: 'avatar2', traits: ['勇敢', '敏锐', '孤独'], milestones: [{ id: 'm1', title: '发现秘钥', description: '在海渊深处发现了重燃神火的秘钥。' }], bonds: [{ characterId: 'c2', type: '导师', friendlyValue: 85, hostileValue: 0 }, { characterId: 'c3', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: ['i1'] },
    { id: 'c2', name: '索恩大师', age: '78', gender: 'male', avatarConfigId: 'avatar19', traits: ['睿智', '严厉', '深沉'], milestones: [{ id: 'm2', title: '觉醒神火', description: '成为以太议会最年长的觉醒者。' }], bonds: [{ characterId: 'c1', type: '学徒', friendlyValue: 85, hostileValue: 0 }, { characterId: 'c4', type: '对手', friendlyValue: 30, hostileValue: 40 }], factionId: 'f1', itemIds: ['i2'] },
    { id: 'c3', name: '凯尔·风行者', age: '26', gender: 'male', avatarConfigId: 'avatar9', traits: ['热情', '冲动', '正义'], milestones: [{ id: 'm3', title: '首次远征', description: '带领队伍穿越迷雾边界。' }], bonds: [{ characterId: 'c1', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c5', type: '恋人', friendlyValue: 95, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c4', name: '维克多·暗影', age: '45', gender: 'male', avatarConfigId: 'avatar13', traits: ['狡猾', '野心', '冷酷'], milestones: [{ id: 'm4', title: '篡位成功', description: '通过阴谋夺取了深渊教团的领导权。' }], bonds: [{ characterId: 'c2', type: '对手', friendlyValue: 30, hostileValue: 40 }, { characterId: 'c6', type: '导师', friendlyValue: 60, hostileValue: 0 }], factionId: 'f2', itemIds: ['i3'] },
    { id: 'c5', name: '莉娜·月光', age: '23', gender: 'female', avatarConfigId: 'avatar32', traits: ['温柔', '聪慧', '坚韧'], milestones: [{ id: 'm5', title: '治愈瘟疫', description: '用月光之力治愈了浮空岛的瘟疫。' }], bonds: [{ characterId: 'c3', type: '恋人', friendlyValue: 95, hostileValue: 0 }, { characterId: 'c7', type: '朋友', friendlyValue: 75, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c6', name: '摩根·黑袍', age: '120', gender: 'male', avatarConfigId: 'avatar15', traits: ['神秘', '博学', '阴沉'], milestones: [{ id: 'm6', title: '永生仪式', description: '完成了禁忌的永生仪式。' }], bonds: [{ characterId: 'c4', type: '学徒', friendlyValue: 60, hostileValue: 0 }, { characterId: 'c8', type: '敌人', friendlyValue: 0, hostileValue: 80 }], factionId: 'f2', itemIds: ['i4'] },
    { id: 'c7', name: '艾伦·铁心', age: '32', gender: 'male', avatarConfigId: 'avatar11', traits: ['忠诚', '勇敢', '固执'], milestones: [{ id: 'm7', title: '守卫要塞', description: '独自守卫边境要塞三天三夜。' }], bonds: [{ characterId: 'c5', type: '朋友', friendlyValue: 75, hostileValue: 0 }, { characterId: 'c9', type: '战友', friendlyValue: 80, hostileValue: 0 }], factionId: 'f1', itemIds: ['i5'] },
    { id: 'c8', name: '塞拉斯·光明', age: '50', gender: 'male', avatarConfigId: 'avatar15', traits: ['正义', '仁慈', '坚定'], milestones: [{ id: 'm8', title: '净化圣地', description: '清除了深渊教团污染的圣地。' }], bonds: [{ characterId: 'c6', type: '敌人', friendlyValue: 0, hostileValue: 80 }, { characterId: 'c10', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c9', name: '瑞文·夜刃', age: '28', gender: 'female', avatarConfigId: 'avatar14', traits: ['敏捷', '沉默', '可靠'], milestones: [{ id: 'm9', title: '刺杀成功', description: '成功刺杀了敌方的指挥官。' }], bonds: [{ characterId: 'c7', type: '战友', friendlyValue: 80, hostileValue: 0 }, { characterId: 'c11', type: '朋友', friendlyValue: 65, hostileValue: 0 }], factionId: 'f1', itemIds: ['i6'] },
    { id: 'c10', name: '伊莎贝拉·晨曦', age: '35', gender: 'female', avatarConfigId: 'avatar40', traits: ['优雅', '智慧', '神秘'], milestones: [{ id: 'm10', title: '预言实现', description: '预言了浮空岛的危机并成功化解。' }], bonds: [{ characterId: 'c8', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c12', type: '导师', friendlyValue: 75, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c11', name: '马库斯·雷霆', age: '40', gender: 'male', avatarConfigId: 'avatar3', traits: ['强壮', '直率', '暴躁'], milestones: [{ id: 'm11', title: '击败巨兽', description: '单枪匹马击败了迷雾中的巨兽。' }], bonds: [{ characterId: 'c9', type: '朋友', friendlyValue: 65, hostileValue: 0 }, { characterId: 'c13', type: '对手', friendlyValue: 40, hostileValue: 20 }], factionId: 'f1', itemIds: ['i7'] },
    { id: 'c12', name: '奥菲利亚·星语', age: '200', gender: 'female', avatarConfigId: 'avatar6', traits: ['古老', '睿智', '超然'], milestones: [{ id: 'm12', title: '见证纪元', description: '见证了浮空岛三个纪元的变迁。' }], bonds: [{ characterId: 'c10', type: '学徒', friendlyValue: 75, hostileValue: 0 }, { characterId: 'c14', type: '朋友', friendlyValue: 60, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c13', name: '德雷克·烈焰', age: '38', gender: 'male', avatarConfigId: 'avatar3', traits: ['狂野', '自信', '好战'], milestones: [{ id: 'm13', title: '征服竞技场', description: '连续三年称霸浮空岛竞技场。' }], bonds: [{ characterId: 'c11', type: '对手', friendlyValue: 40, hostileValue: 20 }, { characterId: 'c15', type: '朋友', friendlyValue: 55, hostileValue: 0 }], factionId: 'f1', itemIds: ['i8'] },
    { id: 'c14', name: '希尔瓦娜·自然', age: '150', gender: 'female', avatarConfigId: 'avatar34', traits: ['平和', '慈爱', '古老'], milestones: [{ id: 'm14', title: '种植神树', description: '培育出了能净化迷雾的神树。' }], bonds: [{ characterId: 'c12', type: '朋友', friendlyValue: 60, hostileValue: 0 }, { characterId: 'c16', type: '导师', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c15', name: '罗根·钢铁', age: '45', gender: 'male', avatarConfigId: 'avatar89', traits: ['坚毅', '务实', '忠诚'], milestones: [{ id: 'm15', title: '锻造神器', description: '锻造出了能对抗深渊的神器。' }], bonds: [{ characterId: 'c13', type: '朋友', friendlyValue: 55, hostileValue: 0 }, { characterId: 'c17', type: '朋友', friendlyValue: 65, hostileValue: 0 }], factionId: 'f1', itemIds: ['i9'] },
    { id: 'c16', name: '艾莉亚·春风', age: '22', gender: 'female', avatarConfigId: 'avatar38', traits: ['活泼', '善良', '天真'], milestones: [{ id: 'm16', title: '治愈森林', description: '用歌声治愈了枯萎的森林。' }], bonds: [{ characterId: 'c14', type: '学徒', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c18', type: '朋友', friendlyValue: 80, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c17', name: '托马斯·学者', age: '55', gender: 'male', avatarConfigId: 'avatar19', traits: ['博学', '好奇', '严谨'], milestones: [{ id: 'm17', title: '破解古文', description: '破解了远古文明的神秘文字。' }], bonds: [{ characterId: 'c15', type: '朋友', friendlyValue: 65, hostileValue: 0 }, { characterId: 'c19', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c18', name: '妮娜·星辰', age: '25', gender: 'female', avatarConfigId: 'avatar36', traits: ['梦幻', '敏感', '艺术'], milestones: [{ id: 'm18', title: '创作神曲', description: '创作出了能唤醒沉睡者的神曲。' }], bonds: [{ characterId: 'c16', type: '朋友', friendlyValue: 80, hostileValue: 0 }, { characterId: 'c20', type: '朋友', friendlyValue: 75, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c19', name: '格雷戈里·智者', age: '65', gender: 'male', avatarConfigId: 'avatar15', traits: ['深沉', '睿智', '神秘'], milestones: [{ id: 'm19', title: '建立学院', description: '建立了浮空岛最著名的魔法学院。' }], bonds: [{ characterId: 'c17', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c21', type: '导师', friendlyValue: 80, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c20', name: '露西·彩虹', age: '20', gender: 'female', avatarConfigId: 'avatar42', traits: ['乐观', '开朗', '善良'], milestones: [{ id: 'm20', title: '带来希望', description: '在最黑暗的时期为人们带来了希望。' }], bonds: [{ characterId: 'c18', type: '朋友', friendlyValue: 75, hostileValue: 0 }, { characterId: 'c22', type: '朋友', friendlyValue: 85, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c21', name: '亚历山大·王者', age: '48', gender: 'male', avatarConfigId: 'avatar11', traits: ['威严', '公正', '果断'], milestones: [{ id: 'm21', title: '统一群岛', description: '统一了分裂的浮空群岛。' }], bonds: [{ characterId: 'c19', type: '学徒', friendlyValue: 80, hostileValue: 0 }, { characterId: 'c23', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: ['i10'] },
    { id: 'c22', name: '米娅·花语', age: '19', gender: 'female', avatarConfigId: 'avatar2', traits: ['温柔', '敏感', '纯真'], milestones: [{ id: 'm22', title: '培育新品种', description: '培育出了能治愈心灵的花朵。' }], bonds: [{ characterId: 'c20', type: '朋友', friendlyValue: 85, hostileValue: 0 }, { characterId: 'c24', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c23', name: '雷纳德·骑士', age: '36', gender: 'male', avatarConfigId: 'avatar11', traits: ['勇敢', '忠诚', '正义'], milestones: [{ id: 'm23', title: '拯救公主', description: '从深渊教团手中救出了公主。' }], bonds: [{ characterId: 'c21', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c25', type: '战友', friendlyValue: 85, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c24', name: '索菲亚·织梦', age: '30', gender: 'female', avatarConfigId: 'avatar6', traits: ['神秘', '优雅', '深邃'], milestones: [{ id: 'm24', title: '编织梦境', description: '创造出了能预知未来的梦境。' }], bonds: [{ characterId: 'c22', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c26', type: '朋友', friendlyValue: 65, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c25', name: '卡尔·守护者', age: '42', gender: 'male', avatarConfigId: 'avatar95', traits: ['坚毅', '沉默', '可靠'], milestones: [{ id: 'm25', title: '守护圣物', description: '守护以太圣物长达二十年。' }], bonds: [{ characterId: 'c23', type: '战友', friendlyValue: 85, hostileValue: 0 }, { characterId: 'c27', type: '朋友', friendlyValue: 60, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c26', name: '艾玛·时光', age: '180', gender: 'female', avatarConfigId: 'avatar6', traits: ['超然', '睿智', '神秘'], milestones: [{ id: 'm26', title: '穿越时空', description: '成功穿越时空看到了未来。' }], bonds: [{ characterId: 'c24', type: '朋友', friendlyValue: 65, hostileValue: 0 }, { characterId: 'c28', type: '导师', friendlyValue: 75, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c27', name: '杰克·航海家', age: '34', gender: 'male', avatarConfigId: 'avatar29', traits: ['冒险', '自由', '乐观'], milestones: [{ id: 'm27', title: '发现新大陆', description: '在迷雾中发现了新的浮空大陆。' }], bonds: [{ characterId: 'c25', type: '朋友', friendlyValue: 60, hostileValue: 0 }, { characterId: 'c29', type: '朋友', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c28', name: '莉莉·晨露', age: '21', gender: 'female', avatarConfigId: 'avatar4', traits: ['清新', '活力', '希望'], milestones: [{ id: 'm28', title: '净化水源', description: '净化了被污染的浮空岛水源。' }], bonds: [{ characterId: 'c26', type: '学徒', friendlyValue: 75, hostileValue: 0 }, { characterId: 'c30', type: '朋友', friendlyValue: 80, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c29', name: '奥斯卡·发明家', age: '52', gender: 'male', avatarConfigId: 'avatar69', traits: ['创新', '执着', '天才'], milestones: [{ id: 'm29', title: '发明飞艇', description: '发明了能穿越迷雾的飞艇。' }], bonds: [{ characterId: 'c27', type: '朋友', friendlyValue: 70, hostileValue: 0 }, { characterId: 'c1', type: '朋友', friendlyValue: 60, hostileValue: 0 }], factionId: 'f1', itemIds: [] },
    { id: 'c30', name: '艾娃·守护天使', age: '28', gender: 'female', avatarConfigId: 'avatar16', traits: ['圣洁', '慈悲', '强大'], milestones: [{ id: 'm30', title: '觉醒神格', description: '觉醒了沉睡的神格，成为守护天使。' }], bonds: [{ characterId: 'c28', type: '朋友', friendlyValue: 80, hostileValue: 0 }, { characterId: 'c2', type: '学徒', friendlyValue: 70, hostileValue: 0 }], factionId: 'f1', itemIds: [] }
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
  },
  characterTags: ['勇敢', '聪明', '善良', '狡猾', '忠诚', '残忍', '正直', '神秘'],
  bondTypes: ['朋友', '敌人', '导师', '学徒', '亲人', '合作伙伴', '对手', '同盟'],
  avatarConfigs: [
    { id: 'avatar1', name: '青年女战士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，战士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，红黑铠甲，火焰风格，红金主色调，火焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar2', name: '少女法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，蓝白长裙，寒冰风格，蓝白主色调，冰晶漂浮，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar3', name: '青年剑客-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，剑客，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，紫色长袍，雷电风格，紫黑主色调，雷电缠绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar4', name: '青年占星师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，占星师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar5', name: '青年术士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，术士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，黑袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar6', name: '青年守护者-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，守护者，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，绿金服装，自然风格，青绿主色调，植物环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar7', name: '青年战士-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，战士，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色铠甲，火焰风格，红金主色调，火焰能量，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar8', name: '青年祭司-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，祭司，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，白金长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar9', name: '青年魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，红色轻纱，火焰风格，红金主色调，火焰与幻影，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar10', name: '少女战士-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，战士，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，银白铠甲，雷电风格，蓝白主色调，雷电缠绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar11', name: '中年法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，深紫长袍，星辰风格，紫黑主色调，星光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar12', name: '少女刺客-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，刺客，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，黑色紧身衣，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar13', name: '青年剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，白色剑服，光明风格，金白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar14', name: '中年女术士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，术士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，暗红长袍，黑暗风格，红金主色调，黑红能量，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar15', name: '老年贤者-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，贤者，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，灰白长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar16', name: '青年女刺客-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，刺客，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，紫色轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar17', name: '少年法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，青色长袍，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar18', name: '中年战士-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，战士，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗金铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar19', name: '少女祭司-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，祭司，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，纯白长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar20', name: '青年召唤师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，召唤师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar21', name: '中年女法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，冰蓝长袍，寒冰风格，蓝白主色调，冰晶环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar22', name: '少年战士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，战士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，暗红铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar23', name: '老年女祭司-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，祭司，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，银白长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar24', name: '青年女剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，银白剑服，雷电风格，蓝白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar25', name: '少女魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，粉色轻纱，自然风格，青绿主色调，花瓣环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar26', name: '中年术士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，术士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深紫长袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar27', name: '青年守护者-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，守护者，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色铠甲，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar28', name: '少女占星师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，占星师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar29', name: '中年剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，深蓝剑服，雷电风格，蓝白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar30', name: '青年女召唤师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，召唤师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，紫色长袍，星辰风格，紫黑主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar31', name: '老年战士-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，战士，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗金铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar32', name: '少女刺客-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，刺客，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，黑色轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar33', name: '青年法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，青色长袍，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar34', name: '中年女守护者-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，守护者，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，翠绿长袍，自然风格，青绿主色调，植物环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar35', name: '少年术士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，术士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，暗紫长袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar36', name: '青年女战士-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，战士，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，红金铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar37', name: '中年祭司-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，祭司，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，白金长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar38', name: '少女法师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，法师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，紫色长袍，雷电风格，紫黑主色调，雷电缠绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar39', name: '老年魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，暗红轻纱，火焰风格，红金主色调，幻影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar40', name: '青年剑客-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，剑客，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗红剑服，火焰风格，红金主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar41', name: '中年女刺客-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，刺客，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，翠绿轻甲，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar42', name: '老年女法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，银白长袍，星辰风格，蓝白主色调，星光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar43', name: '少年剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，白色剑服，光明风格，金白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar44', name: '少女召唤师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，召唤师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深紫长袍，星辰风格，紫黑主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar45', name: '青年女占星师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，占星师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar46', name: '中年战士-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，战士，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，暗红铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar47', name: '老年女祭司-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，祭司，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，银白长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar48', name: '少年魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，粉色轻纱，自然风格，青绿主色调，花瓣环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar49', name: '青年守护者-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，守护者，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色铠甲，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar50', name: '少女刺客-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，刺客，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，暗紫轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar51', name: '中年女剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，银白剑服，雷电风格，蓝白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar52', name: '老年战士-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，战士，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗金铠甲，火焰风格，红金主色调，烈焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar53', name: '少女法师-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，法师，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，金色长袍，火焰风格，红金主色调，火焰能量，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar54', name: '青年术士-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，术士，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深紫长袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar55', name: '中年祭司-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，祭司，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，翠绿长袍，自然风格，青绿主色调，植物环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar56', name: '老年女刺客-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，刺客，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，黑色轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar57', name: '少年守护者-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，守护者，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色铠甲，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar58', name: '青年女魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，红色轻纱，火焰风格，红金主色调，火焰与幻影，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar59', name: '中年召唤师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，召唤师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar60', name: '少女占星师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，占星师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar61', name: '老年女剑圣-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，剑圣，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，银白剑服，雷电风格，蓝白主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar62', name: '少年战士-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，战士，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，翠绿铠甲，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar63', name: '青年女祭司-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，祭司，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，金色长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar64', name: '中年刺客-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，刺客，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，暗紫轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar65', name: '少女守护者-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，守护者，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，翠绿长袍，自然风格，青绿主色调，植物环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar66', name: '老年魅者-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，魅者，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，暗红轻纱，火焰风格，红金主色调，幻影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar67', name: '青年法师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，法师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深紫长袍，星辰风格，紫黑主色调，星光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar68', name: '中年女占星师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，占星师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar69', name: '少年剑客-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，剑客，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色剑服，火焰风格，红金主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar70', name: '老年召唤师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，召唤师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，银白长袍，星辰风格，蓝白主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar71', name: '少女魅者-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，魅者，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，金色轻纱，火焰风格，红金主色调，火焰与幻影，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar72', name: '中年女战士-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，战士，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，银白铠甲，雷电风格，蓝白主色调，雷电缠绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar73', name: '老年法师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，法师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，银白长袍，星辰风格，蓝白主色调，星光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar74', name: '青年祭司-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，祭司，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，暗红长袍，黑暗风格，紫黑主色调，黑红能量，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar75', name: '少年刺客-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，刺客，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，黑色紧身衣，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar76', name: '中年女剑客-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，剑客，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色剑服，火焰风格，红金主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar77', name: '老年守护者-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，守护者，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗金铠甲，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar78', name: '少女术士-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，术士，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，暗紫轻纱，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar79', name: '青年女召唤师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，召唤师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，翠绿长袍，自然风格，青绿主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar80', name: '中年占星师-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，占星师，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深紫长袍，黑暗风格，紫黑主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar81', name: '老年女剑圣-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，剑圣，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，翠绿剑服，自然风格，青绿主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar82', name: '少年祭司-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，祭司，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，白金长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar83', name: '青年战士-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，战士，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，翠绿铠甲，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar84', name: '中年女魅者-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，魅者，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，红色轻纱，火焰风格，红金主色调，火焰与幻影，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar85', name: '老年刺客-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，刺客，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，暗紫轻甲，黑暗风格，紫黑主色调，暗影环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar86', name: '少女法师-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，法师，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，暗紫长袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar87', name: '青年守护者-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，守护者，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，翠绿铠甲，自然风格，青绿主色调，植物环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar88', name: '中年女占星师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，占星师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar89', name: '老年剑客-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，剑客，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗金剑服，火焰风格，红金主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar90', name: '少年召唤师-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，召唤师，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，符文环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar91', name: '青年女战士-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，战士，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，红色轻甲，火焰风格，红金主色调，火焰环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar92', name: '中年祭司-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，祭司，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，金色长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar93', name: '老年女术士-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年女性，术士，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，银白长袍，黑暗风格，紫黑主色调，黑雾环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar94', name: '少年剑圣-魔族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少年男性，剑圣，魔族，黑色角，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，暗红剑服，火焰风格，红金主色调，剑气环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar95', name: '青年占星师-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年男性，占星师，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：神秘，深蓝长袍，星辰风格，蓝白主色调，星光粒子，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar96', name: '中年女守护者-龙族', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年女性，守护者，龙族，龙角与鳞片，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：威严，金色铠甲，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar97', name: '老年魅者-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，老年男性，魅者，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：邪魅，翠绿轻纱，自然风格，青绿主色调，花瓣环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar98', name: '少女刺客-精灵', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，少女女性，刺客，精灵，长耳，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：冷艳，翠绿轻甲，自然风格，青绿主色调，藤蔓环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar99', name: '青年女祭司-狐妖', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，青年女性，祭司，狐妖，狐耳与尾巴，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：温柔，白色长袍，光明风格，金白主色调，圣光环绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' },
    { id: 'avatar100', name: '中年战士-人类', baseUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=中国玄幻人物，中年男性，战士，人类，正面视角，直视观众，居中构图，半身像，精致五官，对称脸型，大眼睛，细腻皮肤，表情：狂气，银白铠甲，雷电风格，蓝白主色调，雷电缠绕，油画厚涂风格，笔触明显，强光影对比，梦幻氛围，高饱和色彩，超精细，1k，(front view:1.4), (facing viewer:1.5), (symmetrical face:1.3)&image_size=square_hd' }
  ]
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
  
  const stats = {
    erasCount: world.eras.length,
    factionsCount: world.factions.length,
    charactersCount: world.characters.length,
    itemsCount: world.items.length,
    powersCount: world.powerSystems.length,
    eventsCount: world.timeline.length
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <PageHeader title="世界概览" />
      
      {/* 世界信息卡片 */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
              <Globe className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-on-surface mb-2">{world.name}</h1>
              <p className="text-on-surface-variant/80 text-lg leading-relaxed">{world.description}</p>
            </div>
          </div>
          
          {/* 统计数据网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 border-t border-outline-variant/10">
            <StatCard icon={History} label="时代" value={stats.erasCount} color="bg-amber-500" delay={0} />
            <StatCard icon={Users} label="势力" value={stats.factionsCount} color="bg-blue-500" delay={1} />
            <StatCard icon={UserIcon} label="人物" value={stats.charactersCount} color="bg-emerald-500" delay={2} />
            <StatCard icon={Layers} label="物品" value={stats.itemsCount} color="bg-purple-500" delay={3} />
            <StatCard icon={Zap} label="力量" value={stats.powersCount} color="bg-rose-500" delay={4} />
            <StatCard icon={Clock} label="事件" value={stats.eventsCount} color="bg-cyan-500" delay={5} />
          </div>
        </div>
      </Card>

      {/* 快速访问卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近时代 */}
        <Card title="最近时代">
          <div className="space-y-3">
            {world.eras.slice(0, 3).map(era => (
              <Link key={era.id} to={`/eras/${era.id}`} className="block">
                <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
                  <div>
                    <h4 className="font-bold text-on-surface">{era.name}</h4>
                    <p className="text-xs text-on-surface-variant/60">{era.years}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* 关键势力 */}
        <Card title="关键势力">
          <div className="space-y-3">
            {world.factions.slice(0, 3).map(faction => (
              <Link key={faction.id} to={`/factions/${faction.id}`} className="block">
                <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{faction.name}</h4>
                      <p className="text-xs text-on-surface-variant/60">
                        {world.characters.filter(c => c.factionId === faction.id).length} 成员
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* 写作统计 */}
      <Card title="写作进度">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
              <h4 className="text-sm text-on-surface-variant/70 mb-1">总字数</h4>
              <p className="text-xl font-medium text-on-surface">{world.writingStats.totalWords} <span className="text-sm text-on-surface-variant/60">字</span></p>
            </div>
            <div className="p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
              <h4 className="text-sm text-on-surface-variant/70 mb-1">连续写作</h4>
              <p className="text-xl font-medium text-on-surface">{world.writingStats.consecutiveDays} <span className="text-sm text-on-surface-variant/60">天</span></p>
            </div>
            <div className="p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
              <h4 className="text-sm text-on-surface-variant/70 mb-1">今日完成</h4>
              <p className="text-xl font-medium text-emerald-600">{world.writingStats.todayWords} <span className="text-sm text-emerald-500/70">字</span></p>
            </div>
          </div>
        </div>
      </Card>

      {/* 时间线预览 */}
      <Card title="最近事件">
        <div className="space-y-4">
          {world.timeline.slice(0, 4).map(event => (
            <Link key={event.id} to={`/timeline`} className="block group">
              <div className="flex gap-4 p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-primary">{event.year}</span>
                    <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{event.title}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant/80">{event.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }: { icon: LucideIcon; label: string; value: number; color: string; delay?: number }) => {
  // 定义更柔和的配色方案
  const colorMap: Record<string, { bg: string; text: string; light: string }> = {
    'bg-amber-500': { bg: 'bg-amber-100', text: 'text-amber-600', light: 'bg-amber-50' },
    'bg-blue-500': { bg: 'bg-blue-100', text: 'text-blue-600', light: 'bg-blue-50' },
    'bg-emerald-500': { bg: 'bg-emerald-100', text: 'text-emerald-600', light: 'bg-emerald-50' },
    'bg-purple-500': { bg: 'bg-purple-100', text: 'text-purple-600', light: 'bg-purple-50' },
    'bg-rose-500': { bg: 'bg-rose-100', text: 'text-rose-600', light: 'bg-rose-50' },
    'bg-cyan-500': { bg: 'bg-cyan-100', text: 'text-cyan-600', light: 'bg-cyan-50' },
  };
  
  const colors = colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600', light: 'bg-gray-50' };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="group bg-surface-container-low rounded-xl p-4 hover:bg-surface-container-high transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* 图标容器 - 使用柔和的背景色 */}
        <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-semibold text-on-surface group-hover:text-primary transition-colors duration-300">
            {value}
          </div>
          <div className="text-xs text-on-surface-variant/60">
            {label}
          </div>
        </div>
        
        {/* 箭头指示 */}
        <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
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
          const memberCount = world.characters.filter(char => char.factionId === faction.id).length;
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsImportModalOpen(false);
            }
          }}
        >
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
          
          <div className="flex items-center gap-6 2xl:gap-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                type="text" 
                placeholder={t('nav.search')} 
                className="bg-surface-container-low border-none rounded-full py-1.5 2xl:py-2.5 pl-10 pr-4 text-sm 2xl:text-base w-64 2xl:w-96 focus:ring-1 focus:ring-primary transition-all outline-none"
              />
            </div>
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
              <Route path="/characters/config" element={<CharacterConfigView />} />
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
              <Route path="*" element={<OverviewView />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export { useWorld, PageHeader, Card, Badge };
