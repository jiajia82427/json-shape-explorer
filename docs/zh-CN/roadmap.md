# 路线图

这份路线图用于记录 JSON Shape Explorer 接下来的开发方向。

## v0.1：可靠的 Markdown 报告

当前阶段目标：

- 读取一个或多个 JSON 文件
- 展开顶层数组为多条样本
- 统计字段类型和出现次数
- 输出 Markdown 报告
- 提供基础测试和示例数据

## v0.2：更多输出格式

已加入：

- TypeScript interface 输出
- JSON Schema 输出
- 更好的嵌套对象命名
- 对数组元素结构的更细致总结

## v0.3：更贴近真实数据

计划加入：

- JSONL 支持
- 日期、URL、email、UUID 等格式识别
- 混合类型的更友好展示
- 空数组的类型推断提示

## v0.4：结构变化对比

已加入：

- 对比两组 JSON 样本
- 标记新增字段、删除字段和类型变化
- 为 API 变更生成 Markdown diff 报告

## 适合贡献的任务

- 增加更多测试 fixture
- 改进 README 示例
- 增加 JSONL reader
- 改进错误提示

项目目前还很小，适合第一次参与开源的人从测试、文档或小功能开始。
