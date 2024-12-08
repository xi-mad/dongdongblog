---
layout: article
title: 博客技术栈总结
date: 2024-12-08 12:00:00
tags:
  - 折腾
---

# 博客技术栈总结

## 技术选型

这个博客是用 [Rspress](https://rspress.dev/) 搭建的，它是一个基于 Rust + React 的静态站点生成器。主要用到了这些技术：

- **框架**: Rspress (基于 Rust + React)
- **语言**: TypeScript + React
- **样式**: TailwindCSS
- **评论**: Giscus
- **部署**: GitHub Pages

## 主要功能

### 1. 文章系统

写了个 ArticlePlugin 插件来处理文章：
- 自动扫描 `article` 目录下的文章
- 解析文章信息（标题、日期、标签等）
- 生成摘要和目录
- 按日期排序展示

### 2. 标签系统

支持给文章打标签：
- 自动收集所有标签
- 点击标签筛选文章
- 标签云样式展示
- 按标签分类浏览

### 3. 归档功能

按年份整理文章：
- 自动按年份分组
- 时间线式展示
- 新文章在前面

### 4. 分页系统

列表分页浏览：
- 每页显示固定数量
- 上一页/下一页导航
- 切换页面时不会丢失标签筛选

### 5. 主题系统

支持切换暗色/亮色：
- 用 TailwindCSS 实现响应式
- 跟随系统主题
- 可以手动切换

### 6. 评论系统

用 Giscus 实现评论：
- 基于 GitHub Discussions
- 支持 Markdown
- 可以用表情回应
- 主题跟随博客

### 7. 阅读信息

通过 ReadingInfoPlugin 显示：
- 文章字数
- 预计阅读时间
- 浏览次数统计（使用不蒜子统计）

### 8. 访问统计

使用不蒜子统计实现：
- 全站访问量统计
- 单页面访问量统计
- 实时更新
- 无需数据库

## 自定义渲染

除了用 Rspress 自带的功能，我还加了不少自定义的东西。为啥要这么做呢？

1. **让博客更好用**
   - 做一个自己喜欢的界面
   - 让内容展示更清晰
   - 操作更流畅

2. **方便加新功能**
   - 想怎么改布局就怎么改
   - 想加啥功能都方便
   - 实现一些特别的需求

3. **代码好维护**
   - 功能模块分得清清楚楚
   - 主题相关的代码都放一起
   - 以后改起来不头疼

下面说说具体是怎么做的：

### 1. 主题定制

通过重写 Rspress 的默认主题组件实现自定义渲染：

```typescript
const Layout = () => {
    const { page } = usePageData();
    const { frontmatter } = page;

    // 根据不同布局渲染不同组件
    if (frontmatter.layout === 'main') {
        return (
            <Theme.Layout
                beforeOutline={<Tags />}
                components={{ wrapper: Main }}
            />
        );
    }

    if (frontmatter.layout === 'archives') {
        return (
            <Theme.Layout components={{ wrapper: Archives }} />
        );
    }

    // 文章页面布局
    return (
        <Theme.Layout
            beforeDocFooter={<GiscusComment />}
            components={{
                wrapper: ({ children }) => <div>{children}</div>
            }}
        />
    );
};
```

### 2. MDX 组件扩展

通过自定义 MDX 组件实现特殊内容的渲染：

```typescript
export const getCustomMDXComponent = () => {
    const CustomMDXComponent = getRspressMDXComponent();

    return {
        ...CustomMDXComponent,
        // 自定义 h1 标题渲染
        h1: (props) => (
            <Fragment>
                <CustomMDXComponent.h1 {...props} />
                {frontmatter?.layout === 'article' && <BottomTitle />}
            </Fragment>
        ),
    };
};
```

### 3. 布局系统

实现了三种主要布局：

1. **主页布局 (main)**
   - 文章列表展示
   - 标签侧边栏
   - 分页功能

2. **归档页布局 (archives)**
   - 按年份分组展示
   - 时间线样式
   - 文章快速导航

3. **文章页布局 (article)**
   - 文章内容展示
   - 阅读信息统计
   - 评论系统
   - 底部版权信息

### 4. 插件系统

开发了两个核心插件：

1. **ArticlePlugin**

2. **ReadingInfoPlugin**

这些自定义渲染机制让博客系统具有：
- 灵活的布局切换
- 统一的主题风格
- 可扩展的组件系统
- 丰富的内容展示形式

## 项目结构
```
.  
├── article/ # 文章目录  
├── plugins/ # 自定义插件  
│ ├── article-plugin/ # 文章处理插件  
│ └── reading-info-plugin/ # 阅读信息插件  
├── theme/ # 主题相关  
│ ├── components/ # 组件  
│ ├── hooks/ # 自定义 hooks  
│ └── index.tsx # 主题入口  
├── styles/ # 全局样式  
└── rspress.config.ts # 配置文件  
```

## 部署流程

使用 GitHub Actions 实现自动化部署：
1. 推送代码到 main 分支
2. 自动触发构建流程
3. 构建静态文件
4. 部署到 GitHub Pages

## 总结

用 Rspress 搭这个博客真是学到不少东西，虽然过程有点折腾，但最后做出来的效果还挺满意的。系统现在很容易扩展和维护，以后想加新功能也方便。

如果你也想搭个类似的博客，可以去 [GitHub](https://github.com/xi-mad/dongdongblog) 看看源码，欢迎 Star 和 Fork！

## 参考

搭建过程中参考了这些很棒的项目：

- [SumyBlog-rspress](https://github.com/sumy7/SumyBlog-rspress) - 给了我很多灵感和参考
- [Rspress](https://rspress.dev/) - 官方文档讲得很清楚

感谢这些开源项目！

