# JSON Shape Explorer

快速理解陌生 JSON 数据结构的零依赖命令行工具。

JSON Shape Explorer 可以读取一个或多个 JSON 样本，自动总结字段结构、字段类型、嵌套对象、数组内容和可选字段，并生成易读的 Markdown 报告。

如果你拿到一批陌生的 API 响应、日志、导出数据、测试 fixture 或配置文件，它可以帮助你快速回答：“这些数据到底长什么样？”

在线 Demo：https://jiajia82427.github.io/json-shape-explorer/

## 一眼看懂

把杂乱的 JSON 样本转换成清晰的结构报告：

| 输入 JSON | Shape 报告 |
|---|---|
| `{ "id": 1, "email": null, "roles": ["admin"] }` | `id: number`<br>`email: null \| string`<br>`roles: string[]` |

```bash
node src/cli.js examples/users.json
```

如果这个工具帮你更快理解陌生 JSON，欢迎点一个 Star 支持项目继续发展。

## 功能特点

- 分析一个或多个 JSON 文件
- 将顶层数组视为多条样本
- 统计字段出现次数，识别可选字段
- 识别 string、number、boolean、null、object、array 等类型
- 总结嵌套对象字段
- 输出 Markdown 结构报告
- 生成 TypeScript interface
- 生成 JSON Schema
- 对比两个 JSON 文件的结构变化
- 使用原生 Node.js 运行，无需安装依赖

## 为什么需要它

JSON 文件看起来简单，但真实数据经常并不整齐：

- 有些字段只在部分记录中出现
- 有些字段可能是 `string | null`
- 数组里可能藏着嵌套对象
- API 文档和真实响应可能并不完全一致

JSON Shape Explorer 的目标不是格式化 JSON，而是帮助开发者从样本中反推出数据结构，减少理解接口和整理文档的时间。

## 快速开始

```bash
node src/cli.js examples/users.json
```

示例输出：

```md
# JSON Shape Report

Analyzed 3 samples.

## Root

Type: object

## Fields

| Field | Type | Presence | Example |
|---|---|---:|---|
| email | null \| string | 2/3 | "ada@example.com" |
| id | number | 3/3 | 1 |
| name | string | 3/3 | "Ada Lovelace" |
| profile | object | 3/3 |  |
| roles | string[] | 3/3 | ["admin","analyst"] |

## Nested: profile

| Field | Type | Presence | Example |
|---|---|---:|---|
| active | boolean | 3/3 | true |
| timezone | string | 2/3 | "Europe/London" |
```

## 常用命令

```bash
node src/cli.js examples/users.json
node src/cli.js samples/*.json --out report.md
node src/cli.js examples/users.json --format ts
node src/cli.js examples/users.json --format schema
node src/cli.js --diff tests/fixtures/old-users.json tests/fixtures/new-users.json
```

如果未来作为 npm 包安装，命令会是：

```bash
json-shape examples/users.json
json-shape samples/*.json --out report.md
json-shape examples/users.json --format ts
json-shape examples/users.json --format schema
json-shape --diff old.json new.json
```

## 输出格式

### TypeScript

```bash
node src/cli.js examples/users.json --format ts
```

```ts
export interface Root {
  email?: null | string;
  id: number;
  name: string;
  profile: RootProfile;
  roles: string[];
}
```

### JSON Schema

```bash
node src/cli.js examples/users.json --format schema
```

### 结构对比

```bash
node src/cli.js --diff old.json new.json
```

可以用来发现 API 响应中的新增字段、删除字段、类型变化和字段出现频率变化。

## 开发

```bash
node src/cli.js examples/users.json
node --test
```

## 文档

- [使用指南](docs/zh-CN/usage.md)
- [项目设计](docs/zh-CN/design.md)
- [路线图](docs/zh-CN/roadmap.md)
- [贡献指南](docs/zh-CN/contributing.md)

## 当前状态

这个项目还处于早期阶段。当前版本已经支持 Markdown、TypeScript interface、JSON Schema 和结构对比，后续会继续增加 JSONL、字段格式识别和 GitHub Action 等能力。

## 许可证

MIT
