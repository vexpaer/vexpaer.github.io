---
title: "readApaper#22 LEGO-Puzzles: How Good Are MLLMs at Multi-Step Spatial Reasoning?"
title_zh: "readApaper#22 LEGO-Puzzles: How Good Are MLLMs at Multi-Step Spatial Reasoning?"
date: 2026-11-08 22:00:00
tags:
  - readApaper
  - machine-learning
  - multimodal-llm
  - spatial-reasoning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 6 minutes · 8 November 2026 · arXiv, 2026</i>

<i>Understand the Science. Question the Ideas. Connect the Dots.</i>

<b>Paper:</b> [LEGO-Puzzles: How Good Are MLLMs at Multi-Step Spatial Reasoning?](https://arxiv.org/html/2503.19990v4)<br /><b>Authors:</b> Kexian Tang, Junyao Gao, Yanhong Zeng, Haodong Duan, Yanan Sun, Zhening Xing, Wenran Liu, Kai Chen, and Kaifeng Lyu<br /><b>Affiliations:</b> Tsinghua University · Tongji University · Shanghai AI Laboratory<br /><b>Version:</b> arXiv:2503.19990v4 · 9 August 2026<br /><b>Reading time:</b> \~6 minutes

## Understand the Science

### Can a model do more than recognize a LEGO brick?

A multimodal large language model (MLLM) may recognize a LEGO brick, describe its color, and identify what is next to it. But assembling a LEGO structure requires a much longer chain of abilities: understanding a 3D scene, deciding where a new piece belongs, predicting how the structure changes, and keeping every intermediate step consistent.

This is the problem behind <b>LEGO-Puzzles</b>. The authors use LEGO assembly as a controlled, visual way to test spatial reasoning, from simple perception to multi-step planning.

### Two task sets, increasing difficulty

The benchmark has two parts.

<b>1. Elementary Set: 11 tasks, 1,100 questions</b>

The authors collected 407 open-source LEGO building instructions and turned them into 1,100 visual question-answering (VQA) samples. The 11 tasks are organized into three levels:

- <b>Spatial understanding:</b> compare object heights, judge whether pieces are adjacent, recognize rotations, and infer an assembly from a different viewpoint.
- <b>Single-step sequential reasoning:</b> decide whether a piece must be rotated, identify its correct position, predict the next assembly state, and determine which pieces are needed to move from one state to another.
- <b>Multi-step sequential reasoning:</b> work backwards from a target state, order several assembly stages, or identify an image that does not belong in the sequence.

The progression matters. A model may understand a static arrangement but still fail to predict what happens after one piece is added. It may solve one step but lose track of the structure across several steps.

![Figure 1. Examples of the Elementary and Planning tasks, from static spatial understanding to multi-step assembly planning.](/img/readApaper-22/overview.png)

<i>Figure 1. Examples of the Elementary and Planning tasks, from static spatial understanding to multi-step assembly planning.</i>

<b>2. Planning Set: can the model construct a complete route?</b>

The Planning Set raises the difficulty from answering individual questions to connecting an initial structure with a target structure.

In <b>Plan-k-Step-VQA</b>, the model receives the current and target LEGO states, together with candidate intermediate states. Among the candidates, exactly <i>k</i> are valid steps and <i>k</i> are distractors. The model must select the correct steps and put them in assembly order. The planning horizon ranges from <i>k</i> = 1 to 8.

This is still a question-answering task: the model receives the full set of options and returns a sequence. It tests multi-step reasoning, but it does not require the model to interact with a physical LEGO environment.

In <b>Plan-k-Step-Generation</b>, the model must generate the intermediate states itself. This is a genuinely multi-turn process:

1. It receives the initial and target structures and generates the first intermediate state.
2. On the next turn, it receives the conversation history and its previous generated state, then generates the next one.
3. The process repeats until the model has produced the complete assembly trajectory.

The authors test generation horizons from <i>k</i> = 2 to 5. This setting asks whether a model can maintain a coherent 3D structure while repeatedly updating it.

### How was the benchmark built?

The authors started with open-source LEGO projects containing digital models and assembly instructions. They rendered the projects with BrickLink Studio, keeping the camera viewpoint fixed across assembly stages so that visual changes corresponded to changes in the structure. They also modified piece attributes and viewpoints to create targeted tasks.

The rendered assets were processed to extract structured information. The team then used task-specific templates to generate questions, options, and ground-truth answers. Three trained annotators checked each question-answer pair, while additional checks removed duplicates and incorrect renderings.

![Figure 2. The data curation pipeline, from LEGO project collection and rendering to question generation and quality control.](/img/readApaper-22/data.png)

<i>Figure 2. The data curation pipeline, from LEGO project collection and rendering to question generation and quality control.</i>

### What did the experiments reveal?

The paper evaluates <b>29 MLLMs in a zero-shot setting</b>.

On the Elementary Set, GPT-5 achieves the highest overall accuracy at <b>72.0%</b>, followed by GPT-o3 at 69.1% and Gemini 2.5 Pro at 68.8%. The strongest open-source model in the reported comparison, Qwen3-VL-32B-Instruct, reaches 57.0%.

The authors also create LEGO-Puzzles-Lite, a 220-question subset, and ask 30 human experts to solve it. Human accuracy reaches <b>93.6%</b>, compared with 71.8% for GPT-5 and 70.9% for GPT-o3. The gap appears even in relatively elementary tasks.

Some errors are revealing. Many models judge height from the apparent 2D projection instead of the actual 3D arrangement. Rotation is also difficult: 16 of the 29 models score below the paper's statistical threshold for beating random guessing on that task.

The gap grows as planning gets longer. In Plan-k-Step-VQA, GPT-5's exact-match accuracy falls from <b>90% at k = 1 to 0% at k = 8</b>. All evaluated models fall below 50% once <i>k</i> exceeds 2. Comparing exact-match accuracy with set-match accuracy suggests that the problem begins before ordering: models already struggle to identify the correct intermediate pieces.

Five human experts, by contrast, solve every Plan-k task correctly. Their accuracy stays at 100% across all tested horizons.

Image generation is harder still. The model must output a spatially valid intermediate LEGO configuration at each turn, not merely select a candidate. None of the evaluated models produces a fully correct trajectory in the full-stage generation experiment. Even when an image looks plausible, a misplaced or misoriented piece can invalidate the assembly state.

![Figure 4. Examples and quantitative evaluation of multi-turn image-generation planning.](/img/readApaper-22/generation_fullstage.png)

<i>Figure 4. Examples and quantitative evaluation of multi-turn image-generation planning.</i>

The authors also compare two elementary tasks with 3DSRBench, which uses natural images. Model performance is strongly correlated across the benchmarks: <b>Pearson r = 0.93 for height and r = 0.98 for adjacency</b>. This suggests that the synthetic LEGO scenes capture spatial skills that also matter in ordinary images.

## Question the Ideas

### Is the main failure remembering the order, or understanding the pieces?

The Plan-k results help separate these possibilities. Exact-match accuracy requires both the correct intermediate pieces and the correct order. Set-match accuracy checks whether the selected pieces are right while ignoring their order. Because GPT-5's exact-match and set-match curves are nearly identical, the authors argue that the failure often begins when the model chooses which intermediate states belong in the solution.

In other words, the model is not simply finding the right pieces and then mixing up their order. It often fails to construct the correct set in the first place.

### Why does image generation fail when multiple-choice reasoning is already difficult?

Selecting an existing candidate lets the model compare a finite set of possibilities. Generating an image requires it to produce the geometry itself: piece identity, position, orientation, connectivity, and consistency with earlier states must all be correct at once.

The paper also separates <b>appearance similarity</b> from <b>instruction following</b> in its human evaluation of single-turn image-generation tasks. A picture can look like the right kind of LEGO object while failing to implement the requested spatial change. Visual plausibility and structural correctness are different criteria.

### Do synthetic LEGO scenes tell us anything about the real world?

Synthetic scenes offer precise control: the authors know the exact pieces, positions, and valid assembly transitions. The strong correlations with 3DSRBench on height and adjacency provide evidence that at least some of these spatial skills transfer to natural images. The result is encouraging because it links a controllable benchmark to a real-image benchmark.

## Connect the Dots

Spatial reasoning can be viewed as maintaining and updating an internal model of the world. At each step, a system needs to represent the current state, understand the constraints on possible actions, predict the next state, and preserve consistency as the sequence grows.

That connects LEGO assembly to robotic manipulation, automated assembly, and other embodied tasks. A robot cannot succeed by merely recognizing an object or describing a scene; it must predict the physical consequences of an action and execute a valid sequence.

<b>My perspective:</b> the most useful contribution of LEGO-Puzzles is its diagnostic structure. It separates static 3D understanding, single-step state changes, multi-step reasoning, and visual generation instead of compressing them into one general “spatial intelligence” score. The results show why this separation matters: performance on a simple visual question does not guarantee that a model can maintain a correct 3D state over a sequence of actions.

### Takeaway

Recognizing a 3D scene, predicting one change, planning a valid sequence, and generating every intermediate state are distinct capabilities. LEGO-Puzzles shows that current MLLMs remain far from human-level performance once spatial reasoning becomes sequential and state-dependent.

<b>Explore the work:</b> [Paper (arXiv v4)](https://arxiv.org/html/2503.19990v4) · [Project page](https://tangkexian.github.io/LEGO-Puzzles/) · [Code](https://github.com/Tangkexian/LEGO-Puzzles) · [Dataset](https://huggingface.co/datasets/KexianTang/LEGO-Puzzles)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 6 分钟 · 2026-11-08 · arXiv, 2026</i>

<i>Understand the Science. Question the Ideas. Connect the Dots.</i>

<b>Paper:</b> [LEGO-Puzzles: How Good Are MLLMs at Multi-Step Spatial Reasoning?](https://arxiv.org/html/2503.19990v4)<br /><b>Authors:</b> Kexian Tang, Junyao Gao, Yanhong Zeng, Haodong Duan, Yanan Sun, Zhening Xing, Wenran Liu, Kai Chen, and Kaifeng Lyu<br /><b>Affiliations:</b> Tsinghua University · Tongji University · Shanghai AI Laboratory<br /><b>Version:</b> arXiv:2503.19990v4 · 9 August 2026<br /><b>Reading time:</b> \~6 minutes

## Understand the Science｜理解研究

### 模型能识别乐高积木，就能完成搭建吗？

多模态大语言模型（MLLM）可以识别一块乐高积木，描述它的颜色，也能判断它旁边有什么。但真正完成乐高搭建，需要一连串能力：理解当前三维结构、判断新积木应该放在哪里、预测添加积木后的结构变化，并在连续操作中始终保持空间状态一致。

这正是 <b>LEGO-Puzzles</b> 想研究的问题。作者利用乐高搭建这一具体任务，逐步测试模型从基础空间感知到多步规划的能力。

### 两组任务，逐级增加难度

整个 benchmark 分为两部分。

<b>1. Elementary Set：11 类任务，1,100 道问题</b>

作者从 407 份开源乐高搭建说明中整理出 1,100 组视觉问答（VQA）样本，并将 11 类任务划分为三个层级：

- <b>空间理解（Spatial Understanding）：</b> 比较物体高度、判断积木是否相邻、识别旋转角度，以及根据不同视角推断当前结构。
- <b>单步序列推理（Single-Step Sequential Reasoning）：</b> 判断一块积木是否需要旋转、确定正确安装位置、预测下一步搭建状态，以及判断从当前状态转变到下一状态需要哪些积木。
- <b>多步序列推理（Multi-Step Sequential Reasoning）：</b> 根据目标状态反推中间步骤、排列多个搭建阶段，或者找出不属于某条搭建序列的异常图片。

这种分层很重要。模型可能看得懂一个静态结构，却无法预测添加一块积木后会发生什么；也可能能够完成一步操作，却无法在连续多步中保持对整体结构的追踪。

![Figure 1. Elementary 和 Planning 两组任务的示例，涵盖静态空间理解、单步推理和多步搭建规划。](/img/readApaper-22/overview.png)

<i>Figure 1. Elementary 和 Planning 两组任务的示例，涵盖静态空间理解、单步推理和多步搭建规划。</i>

<b>2. Planning Set：模型能否规划完整的搭建路径？</b>

Planning Set 将任务从回答单个问题提升为连接初始结构和目标结构。

在 <b>Plan-k-Step-VQA</b> 中，模型会同时看到当前乐高结构、目标结构，以及若干候选中间状态。其中恰好有 <i>k</i> 个正确步骤和 <i>k</i> 个干扰项。模型需要挑出正确的中间状态，并按照实际搭建顺序排列。规划长度从 <i>k</i> = 1 一直增加到 8。

这仍然属于问答任务：模型一次性收到所有候选项，然后返回一组有序答案。它考察的是多步推理，但模型不需要真正操作乐高，也不需要与物理环境交互。

在 <b>Plan-k-Step-Generation</b> 中，模型必须自己生成中间状态。这是一个真正的多轮生成过程：

1. 模型接收初始结构和目标结构，生成第一个中间状态。
2. 下一轮中，模型会接收此前的对话历史和自己生成的上一个状态，再生成下一步。
3. 重复这一过程，直到生成完整的搭建轨迹。

作者测试的生成长度为 <i>k</i> = 2–5。这个任务要求模型在反复修改结构的过程中，持续维护一个连贯的三维空间状态。

### Benchmark 是如何构建的？

作者首先收集互联网上公开的乐高数字模型及其搭建说明，使用 BrickLink Studio 将其渲染成图像。在同一搭建序列中，作者固定摄像机视角，使相邻图片之间的变化主要来自结构本身。随后，他们还会修改积木属性和观察角度，构造针对不同空间能力的测试任务。

渲染后的素材经过结构化信息提取，再由研究团队针对不同任务设计模板，自动组织问题、选项和标准答案。每道问答样本都经过三名受训标注者检查，同时通过重复度检测和人工检查清理重复样本及错误渲染。

![Figure 2. 数据集构建流程：乐高项目收集、渲染与变换、问答生成和质量控制。](/img/readApaper-22/data.png)

<i>Figure 2. 数据集构建流程：乐高项目收集、渲染与变换、问答生成和质量控制。</i>

### 实验结果说明了什么？

论文在 <b>29 个 MLLM 上进行了 zero-shot 评测</b>。

在 Elementary Set 中，GPT-5 的总体准确率最高，为 <b>72.0%</b>；GPT-o3 为 69.1%，Gemini 2.5 Pro 为 68.8%。表现最好的开源模型 Qwen3-VL-32B-Instruct 达到 57.0%。

作者还从完整数据中抽取 220 道题，构成 LEGO-Puzzles-Lite，并邀请 30 名人类专家参与测试。人类总体准确率达到 <b>93.6%</b>，GPT-5 为 71.8%，GPT-o3 为 70.9%。即使在相对基础的空间任务上，模型与人类之间仍有明显差距。

一些错误尤其能说明问题。例如，许多模型判断高度时，会依据图像二维投影中物体看起来有多高，而不是实际三维空间中的高度关系。在旋转任务中，也有 29 个模型中的 16 个低于论文设定的统计显著性随机猜测阈值。

当任务进入多步规划，性能下降更加明显。在 Plan-k-Step-VQA 中，GPT-5 的 exact-match 准确率从 <b>k = 1 时的 90% 降至 k = 8 时的 0%</b>。当 <i>k</i> 大于 2 时，所有被测模型的准确率都低于 50%。

论文还比较了 exact-match 和 set-match 两种指标。前者要求选对所有中间状态并且顺序正确，后者只检查选出的状态集合是否正确，不考虑顺序。GPT-5 的两条准确率曲线几乎重合，说明问题往往在排序之前就已经出现：模型连哪些中间状态应该被选入答案都难以判断。

相比之下，五名人类专家在所有 Plan-k 任务中都取得了 100% 的准确率。

图像生成任务更难。模型必须在每一轮中直接生成空间上正确的乐高中间状态，而不是从候选项中挑选答案。完整多轮生成实验中，没有一个模型成功生成完全正确的搭建轨迹。即使生成图像看起来合理，只要有积木位置或方向错误，整个搭建状态就可能不成立。

![Figure 4. 多轮图像生成规划的示例及定量评估结果。](/img/readApaper-22/generation_fullstage.png)

<i>Figure 4. 多轮图像生成规划的示例及定量评估结果。</i>

作者还将 benchmark 中的两个基础任务与使用自然图像的 3DSRBench 进行比较。两个数据集上的模型表现具有很强的相关性：高度任务的 <b>Pearson r = 0.93</b>，邻接任务的 <b>r = 0.98</b>。这说明合成的乐高场景所测试的部分空间能力，也会影响模型在真实图像中的表现。

## Question the Ideas｜思考研究

### 模型究竟是记不住顺序，还是根本没选对积木？

Plan-k 的指标设计帮助区分了这两种错误。

Exact-match 同时要求中间状态集合正确、顺序正确；set-match 只要求选出的中间状态正确，不考虑排列顺序。

如果模型已经找对了所有积木，只是把顺序排错，那么 set-match 应该明显高于 exact-match。但 GPT-5 的两条曲线几乎重合，因此作者认为，模型经常在选择正确中间状态这一步就已经失败。

换句话说，模型并非总是找到了正确的积木、却排错了顺序；它往往连正确的中间状态集合都无法确定。

### 为什么多选题能做一部分，图像生成却失败？

从有限候选项中选择答案，模型只需要比较已经给定的几种可能性。直接生成图像则要求模型自己构造几何结构：积木种类、位置、方向、连接关系，以及与此前状态的一致性，都必须同时正确。

论文还将单轮图像生成的人工评估拆成两个维度：<b>外观相似度（Appearance Similarity）和指令遵循（Instruction Following）</b>。一张图片可能看起来像目标乐高模型，却没有真正执行指令要求的空间变化。视觉上合理和结构上正确是两种不同的标准。

### 合成乐高场景能代表真实世界吗？

合成场景最大的优势是可控：研究者知道每块积木的身份、位置和合法搭建关系。与 3DSRBench 的高度和邻接任务之间存在很强的相关性，为合成 benchmark 与自然图像空间理解之间的联系提供了证据。

这一结果很有价值，因为它将一个能够精确控制变量的测试环境，与自然图像中的空间理解表现联系了起来。

## Connect the Dots｜联系与延伸

空间推理可以理解为持续维护并更新一个内部世界模型。每一步操作中，系统都需要表示当前状态、理解可执行动作的约束、预测下一状态，并在序列变长时保持前后一致。

这与机器人操作、自动化装配等具身任务直接相关。机器人不能只识别物体或描述场景，还必须预测动作带来的物理变化，并执行一条有效的操作序列。

<b>My Perspective：</b> LEGO-Puzzles 最有价值的地方，是它的诊断式任务结构。它把静态三维理解、单步状态变化、多步推理和视觉生成拆开评估，而不是将它们压缩成一个笼统的“空间智能”分数。实验结果也说明了这种区分的必要性：能回答一道简单的空间问题，并不意味着模型能够在连续动作中维持正确的三维状态。

### Takeaway｜核心结论

识别三维场景、预测一次变化、规划一组有效步骤，以及生成每个中间状态，是彼此不同的能力。LEGO-Puzzles 表明，当空间推理变成连续的、依赖状态变化的任务时，当前 MLLM 与人类水平仍有明显差距。

<b>延伸阅读：</b> [论文（arXiv v4）](https://arxiv.org/html/2503.19990v4) · [项目主页](https://tangkexian.github.io/LEGO-Puzzles/) · [代码](https://github.com/Tangkexian/LEGO-Puzzles) · [数据集](https://huggingface.co/datasets/KexianTang/LEGO-Puzzles)
