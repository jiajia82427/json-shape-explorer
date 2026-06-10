# 项目设计

JSON Shape Explorer 的设计目标是保持核心简单、输出清晰，并让后续扩展自然发生。

## 核心流程

```text
Input Reader
  读取 JSON 文件，并把顶层数组展开为样本列表

Shape Analyzer
  遍历样本，统计字段、类型、出现次数和示例值

Renderer
  将分析结果输出为 Markdown 报告
```

## 主要模块

当前代码主要分为：

- `src/cli.js`：命令行入口，负责解析参数
- `src/reader.js`：读取和解析 JSON 文件
- `src/analyzer.js`：分析 JSON 样本结构
- `src/renderers/markdown.js`：生成 Markdown 报告
- `src/renderers/typescript.js`：生成 TypeScript interface
- `src/renderers/json-schema.js`：生成 JSON Schema
- `src/renderers/diff.js`：生成结构变化对比报告
- `tests/analyzer.test.js`：基础测试

## Shape Node

分析器内部会为每个位置维护一个 shape node，记录：

- 出现次数
- 出现过的类型
- 字段集合
- 数组元素结构
- 示例值

多个样本会被合并到同一棵结构树中。

## 示例

输入：

```json
{ "id": 1, "email": "ada@example.com" }
```

和：

```json
{ "id": 2, "email": null }
```

会被合并为：

```text
id: number, 2/2
email: null | string, 2/2
```

如果第三条样本没有 `email`：

```json
{ "id": 3 }
```

则会变成：

```text
email: null | string, 2/3
```

这说明 `email` 是可选字段。

## 扩展方向

项目可以在不大改核心分析器的情况下维护多个 renderer。当前已经有：

- TypeScript renderer
- JSON Schema renderer
- Markdown renderer
- Diff renderer

未来还可以继续加入：

- HTML renderer

这样项目可以保持小而清楚，同时逐步变得更有用。
