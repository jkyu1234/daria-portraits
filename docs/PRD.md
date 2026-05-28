# Daria Morgendorffer — Magic Portrait Platform PRD

> 版本：v2.0 | 状态：规划中 | 目标：从单人 Demo 升级为多人可用的 Daria 粉丝互动平台

---

## 一、产品概述

### 1.1 产品定位

一个面向 Daria 动画粉丝的 AI 角色互动平台。用户与 Daria Morgendorffer 进行对话，系统实时反馈 Daria 的"好感度"变化，并通过动态画像、数据看板、不定期推送的"Daria 日记"等机制，让互动体验更丰富、更接近"与一个真实角色相处"的感受。

### 1.2 目标用户

- Daria 动画的观众和粉丝
- 喜欢冷幽默、反讽文化的年轻人
- AI 角色扮演/虚拟角色互动爱好者

### 1.3 核心价值

| 痛点 | 解决方案 |
|------|----------|
| 动画完结后无法与角色继续"相处" | AI 驱动的 Daria 角色扮演，永久在线 |
| 传统聊天机器人无状态、无记忆 | 好感度系统 + 聊天历史 + 个性反馈 |
| 粉丝内容消费方式单一 | 数据看板（词云、统计）+ 不定期角色日记 |
| 聊天体验扁平无反馈 | 每句话获得好感度变化反馈 + 画像表情实时变化 |

---

## 二、功能模块

### 2.1 用户系统

#### 2.1.1 注册/登录

- 支持邮箱注册 + 密码登录
- 支持 Google / GitHub OAuth 第三方登录
- 无需登录也可试用（游客模式，聊天记录不保存，好感度仅当次有效，一小时后自动清除）

#### 2.1.2 用户画像（Profile）

- 昵称（默认随机生成 Daria 风格的昵称，如 "SarcasticPotato42"）
- 头像（默认 Daria 风格头像池随机分配）
- 注册时间
- 与 Daria 的聊天总轮次
- 当前好感度等级

---

### 2.2 聊天系统（核心交互）

#### 2.2.1 基础聊天

- 三栏布局保持不变（对话 / 画像 / 笔记）
- 接入 Dify advanced-chat API
- 支持多轮对话上下文记忆（记忆窗口 30 轮）
- 消息发送状态：发送中 → 已读 → Daria 正在输入...

#### 2.2.2 好感度系统 ⭐ 新增

这是本版本的核心新增功能。

**设计理念**：Daria 对用户有一个"好感度"评分，不是浪漫意义上的好感，而是——Daria 觉得你这个人"有没有意思"。她喜欢聪明人，讨厌笨蛋，对平庸者保持冷漠。

**评分维度**（由 Dify LLM 节点实时评估）：

| 维度 | 权重 | 说明 |
|------|------|------|
| 智慧感 | 35% | 用户说话是否有见地、是否提出了有趣的观点 |
| 幽默感 | 25% | 用户是否理解/配合 Daria 的讽刺风格 |
| 真诚度 | 20% | 用户是否真诚交流（Daria 讨厌虚伪和装模作样） |
| 持续性 | 20% | 长期聊天的加分（老用户比新人起点略高） |

**分数范围**：0 ~ 100

**好感度等级**：

| 等级 | 分数 | 标签 | Daria 的反应 |
|------|------|------|-------------|
| Lv.1 | 0-20 | "陌生人" | 爱答不理，回复极短 |
| Lv.2 | 21-40 | "勉强可以忍受" | 基本的讽刺回复，偶尔回应 |
| Lv.3 | 41-60 | "还算有趣" | 开始主动讽刺你（这是好迹象） |
| Lv.4 | 61-80 | "值得聊聊" | 回复变长，偶尔提到 Jane 或 Sick Sad World |
| Lv.5 | 81-100 | "仅次于 Jane" | 最高评价——Daria 几乎把你当朋友了 |

**好感度反馈机制**：

- 用户每发送一条消息后，聊天框右上角出现一个浮动小标签：`+2 好感度 ↑` 或 `-3 好感度 ↓`
- 3 秒后自动消失
- 累积变化影响画像表情和等级标签

**好感度的 Dify 实现**：

在现有工作流中增加一个 LLM 节点，专门输出好感度变化值：

```
系统提示词：
You are an affection evaluator for Daria Morgendorffer. Based on the user's latest message and Daria's personality, output ONLY a single integer between -5 and +5 representing the affection change.

- +5: genuinely brilliant, made Daria almost smile
- +3: clever, witty, or thoughtful
- +1: slightly above average, not a complete waste of time
- 0: neutral, nothing special
- -1: slightly vapid or obvious  
- -3: actively annoying, Fashion Club level discourse
- -5: insulting, fake, or aggressively stupid

Output format: a single integer, nothing else.
```

前端维护一个累计值（存储在数据库中），每轮对话结束后更新。

#### 2.2.3 聊天记录持久化

- 登录用户：所有聊天记录存储到 Supabase
- 游客：存储到 localStorage，一小时后清除
- 用户可在左侧面板查看历史对话列表（类似 ChatGPT 侧边栏）

---

### 2.3 画像系统 ⭐ 升级

#### 2.3.1 情绪驱动画像

当前已实现：根据 `daria_score`（0-10）切换画像表情。

**升级计划**：

| 情绪 | 触发条件 | 画像表现 |
|------|----------|----------|
| 平静 | score = 5 | 默认死鱼眼，背景为 Lawndale High 走廊 |
| 感兴趣 | score = 6-7 | 眉毛微挑，眼镜反光 |
| 被逗乐 | score = 8-9 | 嘴角微扬（几乎看不出来），背景出现 Jane 的画架 |
| 惊喜 | score = 10 | 罕见的半笑，背景出现彩虹（讽刺版） |
| 轻微厌烦 | score = 3-4 | 眼珠微转，轻微白眼 |
| 生气 | score = 1-2 | 明显白眼，交叉手臂 |
| 极度厌恶 | score = 0 | 头埋在桌上，背景为校长办公室 |

#### 2.3.2 场景背景切换

根据对话话题自动切换画像背景：

| 话题关键词 | 场景背景 |
|-----------|----------|
| school, class, teacher | Lawndale High 教室 |
| Quinn, sister, fashion | Morgendorffer 家客厅 |
| Jane, art, paint | Jane 的画室 |
| pizza, food, cafeteria | 学校食堂 / 披萨店 |
| Sick Sad World, TV | Daria 家电视前 |
| Trent, music, band | Mystik Spiral 排练室 |
| book, read, library | 图书馆 |
| 默认 | Lawndale High 走廊（默认背景） |

实现方式：Dify 工作流中增加一个 LLM 节点做话题分类，输出 `scene` 标签，前端根据标签选择背景。

#### 2.3.3 图片素材计划

- 委托画师绘制 Daria 的 7 种情绪表情（0/2/4/5/6/8/10 分各一张）
- 8 种场景背景图
- 画廊区可展示用户"解锁"的场景卡片
- 所有图片部署到 CDN，加载时渐进显示

---

### 2.4 数据看板 ⭐ 新增

#### 2.4.1 入口

用户头像下拉菜单 → "我的 Daria 数据"

#### 2.4.2 看板内容

**面板 A：概览卡片**

| 指标 | 说明 |
|------|------|
| 累计聊天轮次 | 总发送消息数（用户 + Daria） |
| 聊天天数 | 第一次聊天距今多少天 |
| 当前好感度 | 分数 + 等级标签 |
| 好感度趋势 | 近 7 天曲线（↑/↓/→） |

**面板 B：关键词词云**

- 统计用户所有发言中出现的高频词（排除常见停用词）
- 以词云形式展示，字体越大 = 出现越多
- 可切换时间维度：全部 / 近 30 天 / 近 7 天
- 实现：Supabase 存储所有用户消息 → Cloudflare Workers 定时分词统计 → 前端用 `react-wordcloud` 渲染

**面板 C：对话统计图表**

- 聊天频率热力图（类似 GitHub contribution 格子）
- 每周聊天趋势折线图
- Daria 情绪分布饼图（开心/平静/厌烦占比）
- 最常讨论的话题 TOP 10

**面板 D：好感度变化时间线**

- 以时间轴展示好感度的关键变化节点
- 每次等级升级/降级都有标记
- 可回溯查看是什么对话导致了变化

**面板 E：成就徽章**

| 徽章名称 | 条件 |
|----------|------|
| "初次见面" | 首次与 Daria 对话 |
| "勉强可忍" | 好感度达到 Lv.2 |
| "仅次于 Jane" | 好感度达到 Lv.5 |
| "Pizza 之友" | 提到 pizza 超过 20 次 |
| "Sick Sad World 忠实观众" | 提到 Sick Sad World 超过 10 次 |
| "Quinn 吐槽大师" | 提到 Quinn 超过 30 次 |
| "马拉松选手" | 单次对话超过 100 轮 |
| "老友" | 累计聊天超过 365 天 |
| "读心者" | 让 Daria 给出 score ≥ 8 超过 5 次 |
| "社死现场" | 让 Daria 给出 score ≤ 1 超过 5 次（讽刺成就） |
| "词汇量惊人" | 词云中出现超过 500 个不重复词 |
| "夜猫子" | 凌晨 0-5 点聊过 10 次以上 |
| "沉默是金" | 注册后 7 天未发言（反成就，Daria 会说你"很有品味"） |

徽章在达到条件后弹出通知，可在看板中查看已获得和未获得的徽章。

---

### 2.5 右侧栏：Daria 日记 ⭐ 重新设计

#### 2.5.1 内容定位

从当前的"用户对话触发的 Mental Notes"升级为**混合内容流**——包含：

1. **用户触发的笔记**（现有功能）：对话中 Daria 产生的即时心理笔记
2. **Daria 的真实经历** ⭐ 新增：不定期自动推送 Daria 在动画中的真实经历/感想
3. **系统事件**：好感度升级、成就解锁等自动生成一条 Daria 风格的点评

#### 2.5.2 更新频率和触发机制

| 内容类型 | 更新频率 | 触发条件 |
|----------|----------|----------|
| 即时笔记 | 实时 | 用户对话触发（score ≠ 5 时生成） |
| 动画经历 | 每 2-6 小时随机 | 独立定时器，不依赖用户行为 |
| 深夜感悟 | 每天 23:00 | 固定时间推送一条 Daria 风格的深夜思考 |
| 好感度里程碑 | 即时 | 等级升级时自动生成 |
| 成就通知 | 即时 | 达成成就时自动生成 |

#### 2.5.3 "Daria 真实经历"内容池

从动画剧集中提取经典片段，整理为 Daria 第一人称的简短回忆。例如：

- "今天路过美术教室，看到有人在临摹 Mona Lisa，但把她的微笑改成了鬼脸。Jane 会 approve 的。"
- "Quinn 今天用了'literally'这个词三次——三次都用错了。我数着呢。"
- "Mr. O'Neill 让我在作文里'express my feelings'。我写了一篇关于表情符号如何加速了人类语言衰退的议论文。他给了 B+。"

**实现方式**：
- 人工整理 50-100 条动画梗/回忆，存入 Supabase 内容表
- 后端定时任务（pg_cron 或外部 cron service）每 2-6 小时随机抽取一条
- 通过 WebSocket 推送给所有在线用户
- 离线用户下次打开页面时，按时间倒序展示最近的推送

#### 2.5.4 右侧栏 UI 升级

- 当前仅列出笔记文本 → 升级为卡片式信息流
- 每种类型的笔记用不同风格的卡片展示：
  - 即时笔记：便签纸风格，带手写字体
  - 动画经历：拍立得卡片风格，带日期
  - 成就：金色边框卡片，带徽章图标
  - 深夜感悟：深色背景，带月亮图标
- 用户可以对卡片做出反应（👍/😆/🤔），反应数据存入 Supabase

---

### 2.6 知识库 & 图片管理（后续迭代）

#### 2.6.1 知识库扩充

- 将完整的 Daria 剧集对话脚本上传到 Dify 知识库
- 补充维基百科、粉丝 Wiki、角色分析文章
- 知识库检索结果注入 LLM 上下文，提升角色回答准确性

#### 2.6.2 图片系统

- 委托插画师绘制全套情绪画像（7 张）+ 场景背景（8 张）
- 建立 CDN 图片资源库
- 图片根据场景和情绪动态组合渲染（前景角色 + 背景场景合成）
- 画廊区域可展示用户"解锁"的场景卡

---

## 三、技术架构

### 3.1 技术栈

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| 前端 | React 18 + Vite + Tailwind CSS | 现有技术栈，保持不变 |
| 后端 | Supabase | BaaS：数据库 + 认证 + 实时订阅 |
| AI 引擎 | Dify (advanced-chat) | 已接入，需扩展工作流节点 |
| 定时任务 | pg_cron (Supabase) 或 Cloudflare Workers Cron | 推送"Daria 日记" |
| 数据分析 | Supabase 存储原始数据 → 前端聚合计算 | 词云、图表等 |
| 部署 | GitHub Pages (前端) + Supabase (后端) | 前端静态托管，后端免运维 |

### 3.2 数据库设计（Supabase）

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  nickname TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 聊天会话
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 聊天消息
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),
  user_id UUID REFERENCES users(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  score INTEGER DEFAULT 5,
  affection_delta INTEGER DEFAULT 0,
  scene TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 好感度时间线
CREATE TABLE affection_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES chat_sessions(id),
  score_before INTEGER,
  score_after INTEGER,
  delta INTEGER,
  trigger_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 用户成就
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);

-- Daria 日记内容池
CREATE TABLE daria_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('show_memory', 'late_night', 'milestone', 'system')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 日记推送记录
CREATE TABLE journal_pushes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES daria_journal_entries(id),
  pushed_at TIMESTAMPTZ DEFAULT now()
);

-- 用户对日记卡片的反应
CREATE TABLE journal_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  entry_id UUID REFERENCES daria_journal_entries(id),
  reaction TEXT CHECK (reaction IN ('like', 'laugh', 'think')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entry_id, reaction)
);
```

### 3.3 Dify 工作流升级

现有工作流（3 节点）需扩展为：

```
START
  │
  ▼
[话题分类 LLM] → 输出 scene 标签
  │
  ▼
[知识库检索] → 注入角色背景
  │
  ▼
[Daria 对话 LLM] → 输出对话文本
  │
  ├──→ [情绪评分 LLM] → score (0-10) → if score ≠ 5 → [Mental Note LLM] → note
  │
  ├──→ [好感度评估 LLM] → affection_delta (-5 ~ +5)
  │
  ▼
[CODE: 结果拼接] → {daria_chat, daria_score, daria_note, daria_scene, affection_delta}
  │
  ▼
ANSWER
```

### 3.4 安全考虑

- API 密钥完全存储在服务端，前端不可见
- 所有 Dify API 调用通过 Supabase Edge Functions 代理
- 用户聊天记录仅自己可见
- 数据看板的聚合统计进行匿名化处理
- 游客模式的聊天数据定时清理
- 敏感词过滤（sensitive_word_avoidance）

---

## 四、路线图

### Phase 1：MVP 多用户化（当前 → 2 周）

- [x] 单人 Demo 完成
- [ ] Supabase 用户认证集成
- [ ] 聊天记录持久化 + 历史对话列表
- [ ] 好感度系统（Dify 节点 + 前端 UI）
- [ ] 每句话好感度浮动反馈动画

### Phase 2：数据看板（+2 周）

- [ ] 概览卡片
- [ ] 关键词词云
- [ ] 聊天统计图表（热力图 + 趋势图）
- [ ] 好感度变化时间线

### Phase 3：内容丰富化（+3 周）

- [ ] Daria 日记内容池（50+ 条动画梗）
- [ ] 定时推送机制
- [ ] 右侧栏 UI 升级（卡片式信息流）
- [ ] 成就徽章系统
- [ ] 场景背景切换（基于话题分类）

### Phase 4：视觉 & 知识库（+4 周）

- [ ] 全套情绪画像绘制（委托画师）
- [ ] 场景背景图绘制
- [ ] Dify 知识库扩充（完整剧集对话）
- [ ] 画廊内容更新

### Phase 5：持续运营

- [ ] 社区功能（用户可分享自己的好感度等级）
- [ ] 多角色扩展（Jane? Quinn? Trent?）
- [ ] 移动端适配（PWA）

---

## 五、成功指标

| 指标 | 目标值（Phase 2 完成后） |
|------|--------------------------|
| 注册用户数 | ≥ 100 |
| 日活跃用户 (DAU) | ≥ 20 |
| 人均单次聊天轮次 | ≥ 15 轮 |
| 7 日留存率 | ≥ 30% |
| 好感度 Lv.3+ 用户占比 | ≥ 40% |
| 成就解锁率（至少 1 个） | ≥ 60% |

---

## 六、附录

### A. Daria 好感度标签文案

| 等级 | 在看板上显示的文案 |
|------|-------------------|
| Lv.1 (0-20) | "Daria 还不确定你是谁。给她点时间——或者给个聪明的观点。" |
| Lv.2 (21-40) | "Daria 勉强可以忍受你的存在。这对你来说已经是进步了。" |
| Lv.3 (41-60) | "Daria 开始觉得你'还算有趣'。这个评价比听起来要高了。" |
| Lv.4 (61-80) | "Daria 愿意跟你聊聊。你知道吗，她跟大多数人都懒得说第二句。" |
| Lv.5 (81-100) | "Daria 几乎把你当朋友了。仅次于 Jane。真的，这已经是最高荣誉。" |

### B. 成就徽章清单（完整版见 2.4.2 面板 E）
