# 使用指南

这份文档介绍如何运行 JSON Shape Explorer，并理解它生成的报告。

## 运行示例

在项目根目录运行：

```bash
node src/cli.js examples/users.json
```

工具会读取 `examples/users.json`，分析其中的 JSON 样本，并把 Markdown 报告输出到终端。

## 分析多个文件

可以一次传入多个 JSON 文件：

```bash
node src/cli.js samples/user-1.json samples/user-2.json
```

也可以使用通配符：

```bash
node src/cli.js samples/*.json
```

## 输出到文件

使用 `--out` 或 `-o` 可以把报告写入文件：

```bash
node src/cli.js samples/*.json --out report.md
node src/cli.js samples/*.json -o report.md
```

## 顶层数组

如果输入 JSON 的顶层是数组，工具会把数组中的每个元素当作一条样本。

例如：

```json
[
  { "id": 1, "name": "Ada" },
  { "id": 2, "name": "Grace", "email": null }
]
```

会被视为两条样本，而不是一个单独的数组对象。

## 报告字段说明

报告中的字段表包含：

- `Field`：字段名
- `Type`：字段出现过的类型
- `Presence`：字段出现次数 / 父级对象样本数
- `Example`：一个代表性示例值

例如：

```md
| email | null \| string | 2/3 | "ada@example.com" |
```

表示 `email` 字段在 3 条样本中出现了 2 次，类型可能是 `null` 或 `string`。

## 当前限制

当前版本还不支持：

- JSONL 文件
- 自动生成 TypeScript interface
- 自动生成 JSON Schema
- 日期、URL、email、UUID 等格式识别
- 对比两组 JSON 样本的结构变化

这些能力会在后续版本中逐步加入。
