---
title: "readApaper#20 A Unified, Scalable Framework for Neural Population Decoding"
title_zh: "readApaper#20 A Unified, Scalable Framework for Neural Population Decoding"
date: 2026-11-06 22:00:00
tags:
  - readApaper
  - neuroscience
  - brain-computer-interface
  - machine-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 6 November 2026 · NeurIPS 2023</i>

<b>Every day a brain-computer interface is switched on, it listens to a slightly different set of neurons — and the decoder usually has to be rebuilt from scratch.</b> Azabou and colleagues turn that problem upside down: they treat <b>every single spike as a token</b>, the way a language model treats a word, and train one transformer called <b>POYO</b> (Pre-training On manY neurOns) across hundreds of recording sessions, so that a new session or even a new animal can be adapted in about a minute of training.

## 1. What is "neural population decoding"?

Neurons talk in brief electrical pulses called <b>spikes</b>. An electrode array placed in the motor cortex of a monkey picks up the voltage traces of dozens to hundreds of neurons while the animal moves a cursor or its hand. <b>Decoding</b> means running this in reverse: given the spike trains, predict what the animal was doing, for example the horizontal and vertical velocity of its hand (vx, vy). Doing this from a whole population of neurons at once is <b>neural population decoding</b>, and it is the core computation inside many brain-computer interfaces.

How good is a decoder? The paper reports <b>R²</b> (the coefficient of determination): 1.0 means the prediction matches the true velocity perfectly, and lower values mean more of the movement is missed.

## 2. Why is it so hard to reuse a decoder?

Raw electrode voltage is first turned into spikes by <b>spike sorting</b>: an algorithm clusters spike waveforms by shape and assigns each cluster to a "unit" (roughly one neuron). Some datasets also use simpler threshold crossings instead of sorted units. Either way, the result is a list of units, numbered 1, 2, 3, …

Here is the catch. Each recording day is a <b>session</b>, and the electrodes drift a little, so the units you see on Tuesday are not the units you saw on Monday. A different monkey has completely different neurons. "Unit 17" in one session has no relation to "unit 17" in another, and even the number of units changes. A classical decoder has one input slot per unit, so it only works for the exact session it was trained on. As the authors note, the neuron sets differ across sessions, subjects and labs, which makes it hard to merge many recordings into one model.

## 3. The key idea: one spike, one token

Language models turn text into a sequence of tokens. POYO does the same with spikes. <b>Each spike becomes one token</b>, built from two things: (1) a learned <b>unit embedding</b>, a vector that stands for "the neuron that fired" and is learned during training, and (2) the <b>timestamp</b> of the spike. A one-second window with 300 spikes is therefore 300 tokens; with 3,000 spikes, 3,000 tokens. Nothing requires a fixed number of units, so recordings with different units can all be fed into the same model.

![Figure A (schematic, self-drawn). Panel A: two sessions record different, unlabeled units, so unit numbers cannot be matched across them. Panel B: each spike is turned into a token made of the unit's embedding plus the spike time.](/img/readApaper-20/p20_schematic_en.png)

<i>Figure A (schematic, self-drawn). Panel A: two sessions record different, unlabeled units, so unit numbers cannot be matched across them. Panel B: each spike is turned into a token made of the unit's embedding plus the spike time.</i>

## 4. How POYO processes the tokens

A one-second window can contain thousands of spike tokens, and standard self-attention compares every token with every other token, which becomes very expensive. POYO borrows the <b>PerceiverIO</b> design to avoid that. The intuition:

- <b>Attention</b> lets each item "ask a question" and take a weighted average of the other items that look relevant to it.
- A small set of <b>learned latent tokens</b> (a few hundred) first asks the question to the spike tokens (<b>cross-attention</b>), compressing thousands of spikes into a compact summary.
- Several <b>self-attention</b> layers then let the latent tokens talk to each other. The cost depends on the small number of latents, not on the number of spikes.
- Finally, <b>query tokens</b> ask the latents for the answer at specific moments (a second cross-attention), and a linear layer turns each answer into (vx, vy). Because queries can be placed at any time, POYO can output behavior at any time points. Each query carries a timestamp plus a <b>session embedding</b> that tells the model which session it is in.

Time enters through <b>rotary position encoding</b>, which lets attention depend on how far apart two events are in time rather than on absolute clock values.

![Figure 1. POYO overview. Top left: raw spikes become tokens made of a unit embedding and a timestamp. Top right: behavior queries made of a timestamp and a session embedding. Bottom: cross-attention compresses spike tokens into learned latents, self-attention processes them, a second cross-attention reads out predictions at the query times, and a linear layer outputs (v_x, v_y).](/img/readApaper-20/p20_fig1_en.png)

<i>Figure 1. POYO overview. Top left: raw spikes become tokens made of a unit embedding and a timestamp. Top right: behavior queries made of a timestamp and a session embedding. Bottom: cross-attention compresses spike tokens into learned latents, self-attention processes them, a second cross-attention reads out predictions at the query times, and a linear layer outputs (v<sub>x</sub>, v<sub>y</sub>).</i>

## 5. First result: one model, many sessions, better than single-session models

The authors trained POYO on monkey motor cortex recordings in two tasks: a <b>center-out</b> (CO) reaching task and a <b>random target</b> (RT) task, both with the hand moving a manipulandum. They started with 100 sessions from 3 monkeys. Training one model separately per session gave an average R² of 0.9347 on CO and 0.8402 on RT. A single large model, <b>POYO-mp</b> (24 layers), trained on all 100 sessions together (9,789 units and 4,367 neuron-hours of recording) reached <b>0.9512 on CO and 0.8788 on RT</b>. The same data, pooled, simply works better than each session on its own.

![Figure 2. Multi-session decoding with POYO-mp. Panels A and B: task sketches and examples of ground-truth (black) versus POYO-mp (green) hand velocity, v_x and v_y, in several monkeys and sessions. Panels C and D: average R² × 100 for single-session models (gray, 93.47 for CO and 84.02 for RT) and POYO-mp (green, 95.12 and 87.88). In the scatter plots, each dot is one session; dots above the diagonal are sessions where the multi-session model wins, and circle size shows training set size.](/img/readApaper-20/p20_fig2_en.png)

<i>Figure 2. Multi-session decoding with POYO-mp. Panels A and B: task sketches and examples of ground-truth (black) versus POYO-mp (green) hand velocity, v<sub>x</sub> and v<sub>y</sub>, in several monkeys and sessions. Panels C and D: average R² × 100 for single-session models (gray, 93.47 for CO and 84.02 for RT) and POYO-mp (green, 95.12 and 87.88). In the scatter plots, each dot is one session; dots above the diagonal are sessions where the multi-session model wins, and circle size shows training set size.</i>

Making the model bigger helped as well: with more parameters (3.8M, 7.4M, 13M) and more training tokens, performance kept rising, and by the largest setting, training on more data had lifted the random-target score by about 4% over the single-session baseline (0.8402 to 0.8788).

## 6. Transfer to new days, new animals, new tasks

How do you adapt a pretrained model to a brand-new session whose units it has never seen? POYO offers two options:

- <b>Unit identification</b>: freeze all the weights and learn only the <b>new unit embeddings</b> (plus a new session embedding) by gradient descent. This takes less than a minute on a single GPU.
- <b>Full fine-tuning</b>: first do unit identification, then unfreeze and train the whole model on the new session.

The authors tested on held-out sessions from the same monkey (Monkey C, a new day), where unit identification alone (0.9675) was already comparable to a single-session model trained from scratch (0.9682) and fine-tuning went beyond it (0.9708). They then tested on a monkey that was never seen in pretraining (Monkey T). On the new animal in the center-out task (average R² over 6 sessions), the Wiener filter scored 0.6387, a GRU 0.8041, an MLP 0.8577, and a single-session POYO 0.9194; POYO-mp with unit identification reached 0.9012 and with fine-tuning <b>0.9379</b>. On the random-target task, POYO-mp fine-tuning reached 0.8105, against 0.7467 for the MLP and 0.6967 for the GRU.

Figure 4 shows why this is practical. With only a handful of labeled trials the fine-tuned model is far ahead of a model trained from scratch, and unit identification gets close to its final accuracy within about 460 training steps, while training from scratch needs several thousand.

![Figure 4. Sample and compute efficiency. Panel (a): held-out center-out session from Monkey C; panel (b): random-target session from Monkey T, a new subject. In each pair, the left plot shows R² against the number of sample trials for single-session models (blue), fine-tuned POYO (red) and, in (a), a GRU (black). The right plot shows R² against training steps, where unit identification (red) reaches its plateau within about 460 steps, long before training from scratch (blue).](/img/readApaper-20/p20_fig4_en.png)

<i>Figure 4. Sample and compute efficiency. Panel (a): held-out center-out session from Monkey C; panel (b): random-target session from Monkey T, a new subject. In each pair, the left plot shows R² against the number of sample trials for single-session models (blue), fine-tuned POYO (red) and, in (a), a GRU (black). The right plot shows R² against training steps, where unit identification (red) reaches its plateau within about 460 steps, long before training from scratch (blue).</i>

## 7. Scaling to POYO-1 and a public benchmark

POYO-1 was pretrained on a much larger collection: recordings from seven non-human primates in three labs, spanning 158 sessions, more than 27,373 units and 16,473 neuron-hours. It was trained for 5 days on 8 GPUs. Even with the datasets mixing sorted single units and threshold crossings, it transferred well. On the Neural Latents Benchmark (NLB), which contains new animals and a different recording setup, the <b>Maze</b> task (Monkey L) POYO-1 with unit identification alone scored R² 0.9329, above AutoLFADS+linear (0.9062), GRU (0.8887) and MLP (0.8794); with fine-tuning it reached 0.9482. On the NLB <b>RTT</b> task (Monkey I), fine-tuned POYO-1 scored 0.7378, above the MLP (0.6953) and the single-session POYO (0.6850).

## Why this matters

For decades each decoder had to be trained on one day of one animal's neurons. POYO shows that when spikes are tokens, recordings from different days, animals, and labs can live in one model, and that the model gets better with more data. A new session no longer needs a new model, only a few new embeddings that take about a minute to learn. That is a path toward calibrating brain-computer interfaces faster and building pretrained foundation models for neural data.

## Takeaway

- POYO turns every spike into a token (unit embedding + timestamp), so the model accepts any number of units from any session.
- A PerceiverIO-style encoder compresses the spikes into a small set of latents, and timestamped queries read out behavior.
- One multi-session model beat single-session models (CO 0.9512 vs 0.9347; RT 0.8788 vs 0.8402), and new sessions adapt by learning only new unit embeddings in under a minute.
- POYO-1, pretrained on seven monkeys, transferred to the NLB benchmarks and outperformed several baselines.

---

## References and resources

- Azabou, M., Arora, V., Ganesh, V., Mao, X., Nachimuthu, S., Mendelson, M., Richards, B., Perich, M., Lajoie, G., & Dyer, E. L. (2023). <i>A Unified, Scalable Framework for Neural Population Decoding.</i> NeurIPS 2023. [arXiv:2310.16046](https://arxiv.org/abs/2310.16046) · [Project page](https://poyo-brain.github.io/)
- Figures 1, 2 and 4 are taken from the arXiv version of the paper (arXiv v1, released under arXiv's non-exclusive license to distribute; copyright remains with the authors), and the schematic is self-drawn. Please confirm rights before publishing these figures on the public blog.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-06 · NeurIPS 2023</i>

<b>脑机接口每天开机时，听到的神经元都有点不一样，解码器常常得从头重新训练。</b> Azabou 等人把这个问题反过来想：像语言模型处理单词那样，把<b>每一个脉冲（spike）当作一个 token</b>，用一个叫 <b>POYO</b>（Pre-training On manY neurOns）的 Transformer，在上百个记录 session 上统一训练；遇到新的 session 甚至新的动物，大约一分钟的训练就能适配。

## 1. 什么是“神经群体解码”？

神经元通过短促的电脉冲交流，这种脉冲叫 <b>spike</b>。把电极阵列放进猴子的运动皮层，就能在它移动光标或手臂的时候，记录几十到几百个神经元的电压信号。<b>解码</b>就是反过来：已知 spike 序列，去预测动物当时在做什么，比如手在水平和竖直方向上的速度 (vx, vy)。同时利用整个神经元群体来做这件事，就是<b>神经群体解码（neural population decoding）</b>，它是许多脑机接口的核心计算。

解码器好不好怎么衡量？论文用的是 <b>R²</b>（决定系数）：1.0 表示预测与真实速度完全吻合，数值越低说明漏掉的运动信息越多。

## 2. 为什么解码器很难复用？

原始电极电压要先经过<b>脉冲分类（spike sorting）</b>变成 spike：算法按波形把 spike 聚成几类，每一类叫一个“unit”（大致对应一个神经元）。有些数据集也会使用更简单的阈值穿越（threshold crossing）来代替分类好的 unit。无论哪种方式，结果都是一串编号为 1、2、3 …… 的 unit。

问题就出在这里。每一天的记录叫一个 <b>session</b>，电极会有轻微漂移，所以周二看到的 unit 并不是周一的那些。换一只猴子，神经元就完全不同。一个 session 里的“17 号 unit”和另一个 session 里的“17 号 unit”毫无关系，连 unit 的数量也会变。传统解码器对每个 unit 都有一个固定的输入位置，所以只能用在训练它的那个 session 上。正如作者指出的，不同 session、不同个体、不同实验室的神经元集合各不相同，把很多记录合并成一个模型很困难。

## 3. 核心思想：一个 spike，一个 token

语言模型把文本变成 token 序列，POYO 对 spike 做同样的事。<b>每一个 spike 变成一个 token</b>，由两部分构成：(1) 学出来的 <b>unit 嵌入（unit embedding）</b>，一个代表“是哪个神经元发放的”的向量，在训练中学习；(2) 这个 spike 的<b>时间戳</b>。因此，一秒窗口里有 300 个 spike 就是 300 个 token，有 3000 个就是 3000 个。模型不要求固定的 unit 数量，所以 unit 各不相同的记录都可以送进同一个模型。

![图 A（示意图，自绘）。面板 A：两个 session 记录到不同的、没有标签的 unit，所以不同 session 的 unit 编号无法对应。面板 B：每个 spike 变成一个 token，由该 unit 的嵌入向量加上 spike 时间组成。](/img/readApaper-20/p20_schematic_en.png)

<i>图 A（示意图，自绘）。面板 A：两个 session 记录到不同的、没有标签的 unit，所以不同 session 的 unit 编号无法对应。面板 B：每个 spike 变成一个 token，由该 unit 的嵌入向量加上 spike 时间组成。</i>

## 4. POYO 如何处理这些 token

一秒窗口里可能有几千个 spike token，而标准自注意力要让每个 token 和所有其他 token 两两比较，代价很高。POYO 借用 <b>PerceiverIO</b> 的设计来避开这个问题。直觉如下：

- <b>注意力（attention）</b>让每个元素“提一个问题”，然后对其他看起来相关的元素做加权平均。
- 一小组<b>可学习的潜变量 token（latent tokens）</b>（几百个）先向 spike token 提问（<b>交叉注意力</b>），把几千个 spike 压缩成一个紧凑的摘要。
- 随后若干层<b>自注意力</b>让这些潜变量彼此交流。计算量取决于潜变量的少量个数，而不是 spike 的数量。
- 最后，<b>查询 token（query tokens）</b>在指定时刻向潜变量要答案（第二次交叉注意力），再用线性层把每个答案变成 (vx, vy)。因为查询可以放在任意时刻，POYO 可以在任意时间点输出行为。每个查询带有时间戳，以及一个告诉模型“当前是哪个 session”的 <b>session 嵌入</b>。

时间信息通过<b>旋转位置编码（rotary position encoding）</b>加入，这让注意力取决于两个事件在时间上相隔多远，而不是各自的绝对时钟值。

![Figure 1. POYO 总览。左上：原始 spike 变成由 unit 嵌入和时间戳组成的 token。右上：由时间戳和 session 嵌入组成的行为查询。下方：交叉注意力把 spike token 压缩成可学习的潜变量，自注意力对其处理，第二次交叉注意力在查询时刻读出预测，最后由线性层输出 (v_x, v_y)。](/img/readApaper-20/p20_fig1_en.png)

<i>Figure 1. POYO 总览。左上：原始 spike 变成由 unit 嵌入和时间戳组成的 token。右上：由时间戳和 session 嵌入组成的行为查询。下方：交叉注意力把 spike token 压缩成可学习的潜变量，自注意力对其处理，第二次交叉注意力在查询时刻读出预测，最后由线性层输出 (v<sub>x</sub>, v<sub>y</sub>)。</i>

## 5. 第一个结果：一个模型，多个 session，比单 session 模型更好

作者在猴子运动皮层记录上训练 POYO，涉及两种任务：<b>center-out（CO，中心向外）</b>伸手任务和<b>random target（RT，随机目标）</b>任务，都是手握 manipulandum（操纵杆装置）运动。起初用的是来自 3 只猴子的 100 个 session。为每个 session 单独训练一个模型，平均 R² 在 CO 上为 0.9347，在 RT 上为 0.8402。而一个大模型 <b>POYO-mp</b>（24 层）在全部 100 个 session 上联合训练（9,789 个 unit，4,367 神经元·小时的记录），达到<b>CO 0.9512、RT 0.8788</b>。同样的数据合在一起训练，效果就是比各自单独训练更好。

![Figure 2. POYO-mp 的多 session 解码。面板 A、B：任务示意，以及多只猴子、多个 session 中真实（黑色）与 POYO-mp 预测（绿色）的手部速度 v_x、v_y 示例。面板 C、D：单 session 模型（灰色，CO 93.47，RT 84.02）与 POYO-mp（绿色，95.12 和 87.88）的平均 R² × 100。散点图中每个点是一个 session；位于对角线上方的点表示多 session 模型更好，圆圈大小表示训练集大小。](/img/readApaper-20/p20_fig2_en.png)

<i>Figure 2. POYO-mp 的多 session 解码。面板 A、B：任务示意，以及多只猴子、多个 session 中真实（黑色）与 POYO-mp 预测（绿色）的手部速度 v<sub>x</sub>、v<sub>y</sub> 示例。面板 C、D：单 session 模型（灰色，CO 93.47，RT 84.02）与 POYO-mp（绿色，95.12 和 87.88）的平均 R² × 100。散点图中每个点是一个 session；位于对角线上方的点表示多 session 模型更好，圆圈大小表示训练集大小。</i>

把模型做大同样有帮助：随着参数量（3.8M、7.4M、13M）和训练 token 增加，性能持续上升；在最大的设置下，用更多数据训练使随机目标任务的得分比单 session 基线提升了约 4%（0.8402 到 0.8788）。

## 6. 迁移到新的日期、新的动物、新的任务

怎样把一个预训练模型适配到一个全新的 session，而它从没见过这些 unit？POYO 有两种做法：

- <b>Unit 识别（unit identification）</b>：冻结所有权重，只用梯度下降学习<b>新的 unit 嵌入</b>（以及一个新的 session 嵌入）。在单个 GPU 上不到一分钟。
- <b>完整微调（full fine-tuning）</b>：先做 unit 识别，然后解冻并在新 session 上训练整个模型。

作者先在同一只猴子（Monkey C，新的一天）的留出 session 上测试，仅用 unit 识别（0.9675）就已经与从头训练的单 session 模型（0.9682）相当，微调后（0.9708）则超过了它。然后又在预训练中从没见过的猴子（Monkey T）上测试。在新动物的 center-out 任务上（6 个 session 的平均 R²），Wiener 滤波器为 0.6387，GRU 为 0.8041，MLP 为 0.8577，单 session POYO 为 0.9194；POYO-mp 用 unit 识别达到 0.9012，用微调达到 <b>0.9379</b>。在随机目标任务上，POYO-mp 微调达到 0.8105，MLP 为 0.7467，GRU 为 0.6967。

Figure 4 说明了这为什么很实用。只有少量标注 trial 时，微调模型远远领先于从头训练的模型；unit 识别大约 460 个训练步就接近最终精度，而从头训练则需要几千步。

![Figure 4. 样本效率与计算效率。面板 (a)：Monkey C 的留出 center-out session；面板 (b)：新个体 Monkey T 的随机目标 session。每组中，左图显示 R² 随样本 trial 数的变化，对比单 session 模型（蓝色）、微调后的 POYO（红色），(a) 中还有 GRU（黑色）。右图显示 R² 随训练步数的变化：unit 识别（红色）在约 460 步内就达到平台，远早于从头训练（蓝色）。](/img/readApaper-20/p20_fig4_en.png)

<i>Figure 4. 样本效率与计算效率。面板 (a)：Monkey C 的留出 center-out session；面板 (b)：新个体 Monkey T 的随机目标 session。每组中，左图显示 R² 随样本 trial 数的变化，对比单 session 模型（蓝色）、微调后的 POYO（红色），(a) 中还有 GRU（黑色）。右图显示 R² 随训练步数的变化：unit 识别（红色）在约 460 步内就达到平台，远早于从头训练（蓝色）。</i>

## 7. 扩展到 POYO-1 和公开基准

POYO-1 在更大的数据集合上预训练：来自三个实验室的七只非人灵长类，共 158 个 session，超过 27,373 个 unit，16,473 神经元·小时，在 8 块 GPU 上训练了 5 天。即使这些数据混合了分类好的单神经元和阈值穿越，它依然迁移得很好。在神经潜变量基准（Neural Latents Benchmark，NLB，包含新的动物和不同的记录设备）的 <b>Maze</b> 任务（Monkey L）上，仅用 unit 识别的 POYO-1 的 R² 为 0.9329，高于 AutoLFADS+线性（0.9062）、GRU（0.8887）和 MLP（0.8794）；加上微调后达到 0.9482。在 NLB 的 <b>RTT</b> 任务（Monkey I）上，微调后的 POYO-1 为 0.7378，高于 MLP（0.6953）和单 session POYO（0.6850）。

## 这项研究说明了什么？

几十年来，每个解码器都得在某一只动物、某一天的神经元上单独训练。POYO 表明：当 spike 成为 token，不同日期、不同动物、不同实验室的记录就能住进同一个模型，而且数据越多模型越好。新的 session 不再需要一个新模型，只需要学习几个新的嵌入向量，大约一分钟就能完成。这为更快地校准脑机接口、以及构建神经数据的预训练基础模型指出了一条路。

## 总结

- POYO 把每个 spike 变成 token（unit 嵌入 + 时间戳），因此模型可以接受任何 session 中任意数量的 unit。
- PerceiverIO 风格的编码器把 spike 压缩成一小组潜变量，带时间戳的查询读出行为。
- 一个多 session 模型优于单 session 模型（CO 0.9512 对 0.9347；RT 0.8788 对 0.8402），新 session 只需学习新的 unit 嵌入，不到一分钟即可适配。
- 在七只猴子上预训练的 POYO-1 迁移到了 NLB 基准，并超过了多个基线。

---

## References and resources

- Azabou, M., Arora, V., Ganesh, V., Mao, X., Nachimuthu, S., Mendelson, M., Richards, B., Perich, M., Lajoie, G., & Dyer, E. L. (2023). <i>A Unified, Scalable Framework for Neural Population Decoding.</i> NeurIPS 2023. [arXiv:2310.16046](https://arxiv.org/abs/2310.16046) · [项目主页](https://poyo-brain.github.io/)
- Figure 1、2、4 取自该论文的 arXiv 版本（arXiv v1，采用 arXiv 的非独占分发许可，版权归作者所有），示意图为自绘。正式发布到公开博客前，请先确认这些图的使用授权。
