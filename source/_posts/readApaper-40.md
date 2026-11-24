---
title: "readApaper#40 A foundation model for brain organoid network dynamics uncovers intrinsic computation and convergent disease phenotypes"
title_zh: "readApaper#40 A foundation model for brain organoid network dynamics uncovers intrinsic computation and convergent disease phenotypes"
date: 2026-11-26 22:00:00
tags:
  - readApaper
  - organoid-intelligence
  - machine-learning
  - neural-dynamics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 26 November 2026 · bioRxiv, posted 13 October 2026</i>

This paper introduces PULSE, a foundation model trained to forecast the next 20 milliseconds of population spiking from high-density recordings of organoids and related neural tissue. With that single, label-free representation, the authors compare disease-associated human organoids across protocols and ask whether activity during a closed-loop task stays inside the patterns the tissue already generates on its own.

## Background

A <b>brain organoid</b> is a three-dimensional piece of neural tissue grown from stem cells. Over weeks to months in a dish, the cells can produce excitatory and inhibitory neurons and begin to fire together in bursts, even though the tissue never receives sensory input. Organoids therefore let researchers compare human genotypes under matched culture conditions, including mutations associated with <b>neurodevelopmental and psychiatric disorders</b> (NPDs), and ask what structure is already present before any sensory representation has been learned.

The events being compared are <b>spikes</b>, the brief electrical pulses by which neurons signal. A <b>high-density microelectrode array</b> (HD-MEA) records many of those pulses at once. The authors used Maxwell Biosystems MaxOne arrays and sorted the traces into <b>units</b>—putative single neurons—and their spike times.

Recordings are often reduced to a few hand-chosen numbers such as firing rate or synchrony, whose definitions vary across laboratories. A <b>foundation model</b> offers another route: it is trained on a large unlabeled dataset, then reused, often with its weights held fixed, as a shared measuring stick. Here the pretraining task is short-term forecasting, and the model’s internal state becomes a common set of coordinates for different dishes, genotypes, and conditions.

A network is said to <b>compute</b>, in this literature, when different inputs produce responses that a downstream readout can tell apart. <b>Selection</b> versus <b>instruction</b> asks how those responses arise: selection means an input or a task recruits patterns the network already generates spontaneously; instruction means it writes new ones. In a living animal, sensory experience shapes circuits from the start. Organoids provide a naive baseline.

## Problem

The first question is about disease: NPDs arise from many risk genes yet can lead to overlapping behavioral phenotypes, and testing whether that convergence extends to network dynamics across laboratories requires a measure that is not redesigned for each cohort. The second is about encoding. When an organoid is electrically stimulated, or placed in a closed-loop task in which its firing is decoded into an action and written back as stimulation, does the resulting activity stay within the dimensions of spontaneous activity, or does it occupy new ones?

## Method

<b>PULSE</b> (Population Unified Latent Space Embedding) is a Mamba-2 state-space network trained to predict the next 20 ms of population firing. The corpus comprised 3,200 HD-MEA recordings totaling 914.3 hours (2,027 recordings for training and 1,173 held out). It covers mouse embryonic stem-cell organoids, grown in three or two dimensions; ex vivo mouse cortical slices; and human induced pluripotent stem cell (iPSC) organoids held out from pretraining.

At each 10 ms bin the input is the units’ spike counts plus stimulation features. Six Mamba-2 layers compress this history into a fixed-size <b>512-dimensional latent state</b>. A Poisson head predicts the next 20 ms of firing rates. Training uses only this forecasting objective, with no disease, age, or task labels. For later analyses the backbone is typically frozen, so every recording is projected into the same coordinates.

Forecast quality is scored in complementary ways. <b>Pearson r</b> asks whether predicted and observed counts rise and fall together, regardless of scale. <b>Bits/spike</b> asks whether the model also gets the magnitude right, relative to a constant-rate baseline. <b>Skill</b> is the fraction of a baseline’s error the model removes. Each metric is computed both per neuron and for the summed population. The baseline is a causal <b>exponentially weighted moving average</b> (EWMA) of each neuron’s own recent firing.

![Figure 1. How PULSE is trained. Panel (A) lists the HD-MEA corpus by tissue type, species, and hours, and marks which experiments included longitudinal recording, drug perturbations, electrical stimulation, or a goal-directed task. Human organoids were held out from pretraining. Panel (B) shows how spike counts in 10 ms bins are packed with an active-unit count and an eight-dimensional stimulation vector into one input. Panel (C) is the architecture: a linear projection, a temporal convolution, six Mamba-2 layers, and a Poisson head that predicts the next 20 ms of population rates. From Schweiger et al., 2026, Figure 1.](/img/readApaper-40/schweiger2026_fig1.png)

<i>Figure 1. How PULSE is trained. Panel (A) lists the HD-MEA corpus by tissue type, species, and hours, and marks which experiments included longitudinal recording, drug perturbations, electrical stimulation, or a goal-directed task. Human organoids were held out from pretraining. Panel (B) shows how spike counts in 10 ms bins are packed with an active-unit count and an eight-dimensional stimulation vector into one input. Panel (C) is the architecture: a linear projection, a temporal convolution, six Mamba-2 layers, and a Poisson head that predicts the next 20 ms of population rates. From Schweiger et al., 2026, Figure 1.</i>

## Experiments

Model comparisons used mouse data, excluding human and drug-treated organoids: 86 training experiments, 30 of which contributed withheld recordings for validation, and nine held-out mouse cultures. On those cultures, a linear readout head could be fit on two minutes of activity, with the rest of the network frozen.

Disease tests used four human iPSC lines, all held out from pretraining and prepared with two different protocols. One pair was isogenic: a SHANK3+/− line engineered from the parental KOLF2.2J SHANK3+/+ line (n = 6 control and n = 5 mutant). The other was a 16p11.2-deletion line (14765-X2, n = 6) compared with an unaffected-donor control (CW20107, n = 6). Each pair is an independent test within its own protocol.

Each recording was summarized by the covariance of PULSE’s latent trajectory. A <b>developmental clock</b> was obtained by fitting a ridge regression from that summary to chronological age on CW20107 alone, then applying it without refitting. The authors also ran principal component analysis on 327 spontaneous recordings, compared each mutant with its own control after regressing out log unit count, and scored 28 classical spiking features.

For encoding, organoids were recorded for days while spontaneous epochs alternated with stimulation at 0.5 to 8 Hz. A decoder identified the stimulated electrode from the latent state, and stimulated activity was projected into a preceding spontaneous subspace. Thirteen organoids were then compared during spontaneous activity, open-loop stimulation, and closed-loop control of a virtual inverted pendulum, in which stimulation encodes the pole angle and firing is decoded into force on the cart, under reinforcement-learning teaching pulses.

## Results

On validation organoids, the reference model exceeded the EWMA on all six metrics (per-neuron median bits/spike 0.339 versus 0.042). A linear head fit on two minutes of data raised per-neuron median bits/spike on nine held-out mouse cultures from −0.335 to +0.359 and improved all nine (P = 0.0039). After the same head was fit, neither human control line differed from the fine-tuned mouse cultures. Within protocol, 14765-X2 organoids were predicted worse than CW20107 on all three per-neuron metrics (Pearson r medians 0.219 versus 0.302, P = 0.0043), while the three population metrics were unchanged. No metric differed between SHANK3+/− and SHANK3+/+.

![Figure 2. Forecasting accuracy and a two-minute linear head. Panels (A–E) compare design choices on validation organoids (n = 30). The left-hand sketches in (B–E) show what each metric asks: Pearson r is about timing and is unchanged if the prediction is simply rescaled; bits/spike is about magnitude relative to a constant-rate baseline. Panels (F–I) are the held-out mouse cultures (n = 9). Each dot is one culture, joined from the frozen model (zero-shot) to the same model after a two-minute linear head; the orange dashed line is the causal EWMA baseline. From Schweiger et al., 2026, Figure 2.](/img/readApaper-40/schweiger2026_fig2.png)

<i>Figure 2. Forecasting accuracy and a two-minute linear head. Panels (A–E) compare design choices on validation organoids (n = 30). The left-hand sketches in (B–E) show what each metric asks: Pearson r is about timing and is unchanged if the prediction is simply rescaled; bits/spike is about magnitude relative to a constant-rate baseline. Panels (F–I) are the held-out mouse cultures (n = 9). Each dot is one culture, joined from the frozen model (zero-shot) to the same model after a two-minute linear head; the orange dashed line is the causal EWMA baseline. From Schweiger et al., 2026, Figure 2.</i>

The CW20107-trained clock, applied without refitting, placed 16p11.2-deletion recordings ahead of their chronological age (median organoid offset +9.7 versus −0.8 days, P = 0.0022), with all six 14765-X2 organoids ahead of all six CW20107 organoids. SHANK3+/− did not differ from its isogenic control. On a label-free axis—the second principal component of latent covariances, after removing log unit count—both mutant lines shifted in the same direction relative to their own controls. The shift was significant for 14765-X2 (P = 0.037) and for the two comparisons jointly (P = 0.022), but not for SHANK3 alone (P = 0.26). The same two mutations moved bursting, topology, and temporal-structure features in a common direction (15 of 15 features) but not rate and yield (2 of 8).

![Figure 4. Two mutations compared in one latent coordinate system. Panel (A) shows the developmental clock: a ridge regression from latent covariance to chronological age, fit on CW20107 alone; other lines are projected without refitting. In (B) and (C), 14765-X2 recordings sit ahead of their culture age, while SHANK3+/− does not differ from its isogenic control. Panels (D–F) switch to a label-free axis (PC2) and 28 classical spiking features. In (F), read the shaded quadrants: features in bursting, topology, and temporal structure move in the same direction in both mutant-versus-control comparisons, whereas rate and yield mostly do not. From Schweiger et al., 2026, Figure 4.](/img/readApaper-40/schweiger2026_fig4.png)

<i>Figure 4. Two mutations compared in one latent coordinate system. Panel (A) shows the developmental clock: a ridge regression from latent covariance to chronological age, fit on CW20107 alone; other lines are projected without refitting. In (B) and (C), 14765-X2 recordings sit ahead of their culture age, while SHANK3+/− does not differ from its isogenic control. Panels (D–F) switch to a label-free axis (PC2) and 28 classical spiking features. In (F), read the shaded quadrants: features in bursting, topology, and temporal structure move in the same direction in both mutant-versus-control comparisons, whereas rate and yield mostly do not. From Schweiger et al., 2026, Figure 4.</i>

Stimulating one electrode produced a site-specific response. A decoder identified the site from the latent state at a median 4.14× chance, compared with 1.74× for binned firing rate. Over days the average latent state drifted, yet a pseudotime recovered the true recording order, and electrode-specific structure declined more slowly than this global drift.

![Figure 5. Population drift and a slower electrode-specific code. Panel (A) is the recording cycle: spontaneous epochs alternate with fixed-rate stimulation of each electrode in turn. In (B) and (C), one experiment’s spontaneous recordings drift in location and rotate in covariance shape, colored from early to late. Panel (D) shows that a pseudotime built from those summaries recovers the true recording order (n = 10 organoids). Panel (E) splits between-cycle drift into a population-wide component shared by all electrodes and an electrode-specific remainder, before and after subtracting each pulse’s pre-stimulus baseline. Panel (F) is site-decoder accuracy as a function of how many cycles apart the training and test recordings are. From Schweiger et al., 2026, Figure 5.](/img/readApaper-40/schweiger2026_fig5.png)

<i>Figure 5. Population drift and a slower electrode-specific code. Panel (A) is the recording cycle: spontaneous epochs alternate with fixed-rate stimulation of each electrode in turn. In (B) and (C), one experiment’s spontaneous recordings drift in location and rotate in covariance shape, colored from early to late. Panel (D) shows that a pseudotime built from those summaries recovers the true recording order (n = 10 organoids). Panel (E) splits between-cycle drift into a population-wide component shared by all electrodes and an electrode-specific remainder, before and after subtracting each pulse’s pre-stimulus baseline. Panel (F) is site-decoder accuracy as a function of how many cycles apart the training and test recordings are. From Schweiger et al., 2026, Figure 5.</i>

Stimulation did not merely replay the input rhythm. At 8 Hz, power appeared at the subharmonic f/2; at 4 Hz it did not. Memory-free Poisson surrogates abolished the rhythm, so the model did not create it. Even so, stimulated activity reached a median 98.5% of the spontaneous-to-spontaneous ceiling in all eight organoids. Closed-loop pendulum control moved the average state farther from spontaneous activity than open-loop stimulation did, but still along directions spontaneous activity already used (95.0% and 85.7% of the spontaneous ceiling, n = 13). A latent decoder separated sustained balance from quick failure at a median AUC of 0.790, above a firing-rate decoder (0.703). The balance-versus-failure direction lay largely inside the spontaneous subspace (median 62.7% captured, versus 11.2% for a random direction) and was not a dedicated success axis.

![Figure 7. Closed-loop control shifts the average state but stays inside spontaneous directions. Panel (A) compares three regimes recorded from the same organoid: spontaneous activity, open-loop pulse trains, and closed-loop cartpole control. Panel (B) shows an example of the three latent clouds; (C) summarizes how far their centroids sit from one another, relative to movement within a recording (n = 13 organoids). Panel (D) is the selection-versus-instruction schematic. In (E–G), open-loop and closed-loop activity are projected onto spontaneous principal components: most of their variance is captured by directions spontaneous activity already uses, far above a random-subspace chance floor. From Schweiger et al., 2026, Figure 7.](/img/readApaper-40/schweiger2026_fig7.png)

<i>Figure 7. Closed-loop control shifts the average state but stays inside spontaneous directions. Panel (A) compares three regimes recorded from the same organoid: spontaneous activity, open-loop pulse trains, and closed-loop cartpole control. Panel (B) shows an example of the three latent clouds; (C) summarizes how far their centroids sit from one another, relative to movement within a recording (n = 13 organoids). Panel (D) is the selection-versus-instruction schematic. In (E–G), open-loop and closed-loop activity are projected onto spontaneous principal components: most of their variance is captured by directions spontaneous activity already uses, far above a random-subspace chance floor. From Schweiger et al., 2026, Figure 7.</i>

## Analysis

The first is forecasting. PULSE is trained to predict the next 20 ms of spike counts, not to classify genotype or task; the 512-dimensional state is a by-product of that forecast. Two minutes of a linear head can restore calibration on unseen organoids, including human lines that were never in pretraining. The lower per-neuron predictability of 16p11.2-deletion organoids is a statement about forecast error; the population metrics did not show the same difference, and SHANK3 deficiency did not.

The second is the disease comparison. The developmental clock is a regression from latent covariance to chronological age, fit on one control line. The finding that 14765-X2 organoids sit ahead of their culture age is a projection onto that axis, reported by the authors as accelerated network maturation. The shared phenotype with SHANK3 is a shift in how activity is coordinated—bursting, topology, and temporal structure—rather than in how much the network fires. That joint shift is what the statistics support; the SHANK3 comparison by itself was not significant.

The third is what computation refers to here. Site identity could be read out from evoked responses, and that electrode-specific structure changed more slowly than the global drift of the population. Stimulated and task-driven activity remained inside spontaneous dimensions, even when an 8 Hz response implied memory across pulses, and even when closed-loop control shifted the average state. That is evidence for selection in the sense used in the paper: the external loop engages patterns the naive network generates.

## Summary

PULSE turns a next-step spike forecast into a shared coordinate system for organoid networks. In those coordinates, a 16p11.2 deletion advances a developmental clock and is harder to predict per neuron, and the same deletion and SHANK3 deficiency converge on coordination rather than firing rate. When the same naive networks are stimulated or placed in a closed-loop balancing task, their activity stays inside the dimensions they already use when left alone.

## References

- Schweiger, H. E., Robbins, A., Hernandez, S., Moreno-Ochando, A., Cline, I., Doganyigit, K., Mouzaya, M., Hussain, K., Pang, Z. P., Duan, J., Salama, S. R., Pollen, A. A., Bhaduri, A., Haussler, D., Teodorescu, M., & Mostajo-Radji, M. A. (2026). <i>A foundation model for brain organoid network dynamics uncovers intrinsic computation and convergent disease phenotypes.</i> bioRxiv. [doi.org/10.64898/2026.10.11.758231](https://doi.org/10.64898/2026.10.11.758231)
- Dao, T., & Gu, A. (2024). Transformers are SSMs: Generalized models and efficient algorithms through structured state space duality. <i>Proceedings of the 41st International Conference on Machine Learning</i>, 235, 10041–10071. [proceedings.mlr.press/v235/dao24a.html](https://proceedings.mlr.press/v235/dao24a.html)
- Robbins, A., Schweiger, H. E., Hernandez, S., Spaeth, A., Voitiuk, K., Parks, D. F., van der Molen, T., Geng, J., Cline, I., Kosik, K. S., et al. (2026). Goal-directed learning in cortical organoids. <i>Cell Reports</i>, 45, 116984. [doi.org/10.1016/j.celrep.2026.116984](https://doi.org/10.1016/j.celrep.2026.116984)

Figures 1, 2, 4, 5 and 7 are from Schweiger et al., 2026, bioRxiv preprint, DOI [10.64898/2026.10.11.758231](https://doi.org/10.64898/2026.10.11.758231).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-26 · bioRxiv, posted 13 October 2026</i>

这篇论文介绍了 PULSE：一个用高密度电极记录、训练来预测群体放电接下来 20 毫秒的基础模型。作者用这一套不依赖生物学标签的表征，在不同分化方案下比较带有疾病相关突变的人源类器官，并询问：在闭环任务中，活动是否仍然落在组织自己已经产生的自发模式之内。

## 背景

<b>脑类器官</b>是由干细胞培养得到的三维神经组织。在培养皿里经过数周到数月，细胞可以产生兴奋性和抑制性神经元，并开始以爆发的形式一起放电，尽管这块组织从未接收过感觉输入。因此，类器官既可以在匹配的培养条件下比较人的基因型——包括与<b>神经发育和精神疾病</b>（NPD）相关的突变——也可以用来询问：在任何感觉表征被学习之前，网络里已经有怎样的结构。

这里比较的事件是<b>锋电位</b>，也就是神经元用来传递信号的短暂电脉冲。<b>高密度微电极阵列</b>（HD-MEA）可以一次记录其中的许多脉冲。作者使用 Maxwell Biosystems 的 MaxOne 阵列，并把信号分选成<b>单位</b>（可能对应单个神经元）及其放电时刻。

记录常常被压缩成几个手工选择的数字，例如放电率或同步性，而这些定义在不同实验室并不一致。<b>基础模型</b>提供了另一条路：先在大规模无标签数据上训练，再把它——往往冻结内部权重——当作一把共用的尺子。本文的预训练任务是短期预测，模型的内部状态则成为一套共用坐标，可以把不同培养皿、基因型与实验条件放到一起比较。

在这篇文献里，如果说一个网络在<b>计算</b>，指的是不同输入能产生足以让下游读出器区分开的响应。<b>选择</b>与<b>教导</b>则询问这些响应如何出现：选择是指输入或任务招募网络在自发活动中已经产生的模式；教导是指它写入新的模式。在活体动物里，感觉经验从回路形成之初就在塑造它。类器官提供了一个尚未接受感觉输入的基线。

## 问题

第一个问题关于疾病：NPD 来自许多风险基因，却可以导向彼此重叠的行为表型；要检验这种汇聚是否延伸到网络动力学，并且能跨过使用不同方案的实验室，就需要一种不为每个队列重新设计的度量。第二个问题关于编码。当类器官被电刺激，或被放入一个闭环任务——其放电被解码成动作，结果再写回为刺激——由此产生的活动，是仍然落在自发活动已经占据的维度里，还是占据了新的维度？

## 方法

<b>PULSE</b>（Population Unified Latent Space Embedding，群体统一潜空间嵌入）是一个基于 Mamba-2 的状态空间网络，训练目标是预测群体放电接下来的 20 毫秒。语料包含 3,200 段 HD-MEA 记录，合计 914.3 小时（训练 2,027 段，留出 1,173 段）。它覆盖小鼠胚胎干细胞来源的类器官，既有三维也有二维培养；还包括离体小鼠皮层脑片，以及预训练时被完全留出的人诱导多能干细胞（iPSC）类器官。

每个 10 毫秒时间箱的输入是各单位的锋电位计数，再拼接刺激特征。六层 Mamba-2 把这段历史压缩成固定大小的<b>512 维潜状态</b>。一个泊松输出头再预测接下来 20 毫秒的放电率。训练只用这一预测目标，没有疾病、日龄或任务标签。后续分析通常冻结主干，使每段记录都被投影到同一套坐标里。

预测质量用几项互补指标来打分。<b>皮尔逊相关 r</b> 问的是预测与观测计数是否一起升降，而不论尺度。<b>每锋电位比特</b>问的是模型是否也把幅度做对了，比较对象是恒定放电率基线。<b>技能分数</b>是模型消除了基线误差的比例。每项指标都分别按单个神经元和按整个人群总和来计算。基线是每个神经元对自身近期放电的因果<b>指数加权移动平均</b>（EWMA）。

![图 1. PULSE 如何训练。(A) 按组织类型、物种和小时数列出 HD-MEA 语料，并标出哪些实验包含长期记录、药物干预、电刺激或目标导向任务。人源类器官被留出预训练。(B) 展示 10 毫秒时间箱中的锋电位计数，如何与活跃单位数和八维刺激向量一起打包成一个输入。(C) 是网络结构：线性投影、时间卷积、六层 Mamba-2，以及预测接下来 20 毫秒群体放电率的泊松输出头。取自 Schweiger 等，2026，Figure 1。](/img/readApaper-40/schweiger2026_fig1.png)

<i>图 1. PULSE 如何训练。(A) 按组织类型、物种和小时数列出 HD-MEA 语料，并标出哪些实验包含长期记录、药物干预、电刺激或目标导向任务。人源类器官被留出预训练。(B) 展示 10 毫秒时间箱中的锋电位计数，如何与活跃单位数和八维刺激向量一起打包成一个输入。(C) 是网络结构：线性投影、时间卷积、六层 Mamba-2，以及预测接下来 20 毫秒群体放电率的泊松输出头。取自 Schweiger 等，2026，Figure 1。</i>

## 实验

模型比较使用小鼠数据，并排除人源和药物处理的类器官：86 个训练实验，其中 30 个拿出部分记录做验证，另有 9 个留出的小鼠培养。对这些留出培养，可以用两分钟活动拟合一个线性读出头，其余网络保持冻结。

疾病检验使用四条人 iPSC 细胞系，全部留出预训练，并用两种不同方案制备。一对是同基因的：由亲本 KOLF2.2J 的 SHANK3+/+ 得到的 SHANK3+/−（对照 n = 6，突变 n = 5）。另一对是 16p11.2 缺失系（14765-X2，n = 6）与未受影响供体对照（CW20107，n = 6）。每一对都是在自身方案内部的独立检验。

每段记录用 PULSE 潜轨迹的协方差来概括。<b>发育时钟</b>是只在 CW20107 上把这一概括对实际培养日龄做岭回归，再不加重新拟合地用到其他品系。作者还对 327 段自发记录做主成分分析，在回归掉对数单位数之后把各突变系与自身对照比较，并计算 28 项经典放电特征。

在编码实验里，类器官被连续记录数日，自发时段与 0.5 到 8 Hz 的刺激交替进行。一个解码器要从潜状态中识别被刺激的电极，刺激引起的活动再被投影到前一段自发记录的子空间中。随后，13 个类器官在三种制度下被比较：自发活动、开环刺激，以及对虚拟倒立摆的闭环控制——刺激编码杆的角度，放电被解码成施加在小车上的力，并伴有强化学习的教导脉冲。

## 结果

在验证类器官上，参考模型在全部六项指标上都超过了 EWMA（每神经元每锋电位比特中位数 0.339 对 0.042）。用两分钟数据拟合线性头后，9 个留出小鼠培养的每神经元每锋电位比特从 −0.335 升到 +0.359，全部 9 个都有改善（P = 0.0039）。同样的头拟合之后，两个人源对照系与微调后的小鼠培养都没有差异。在同一方案内部，14765-X2 在全部三项每神经元指标上都差于 CW20107（皮尔逊 r 中位数 0.219 对 0.302，P = 0.0043），而三项人群指标没有变化。SHANK3+/− 与 SHANK3+/+ 之间没有任何指标差异。

![图 2. 预测精度，以及两分钟的线性头。(A–E) 在验证类器官（n = 30）上比较设计选择。(B–E) 左侧示意图说明各项指标在问什么：皮尔逊 r 关注时机，即使把预测整体缩放也不会改变；每锋电位比特关注相对于恒定放电率基线的幅度。(F–I) 是留出的小鼠培养（n = 9）。每个点是一个培养，从冻结模型（零样本）连到加上两分钟线性头之后；橙色虚线是因果 EWMA 基线。取自 Schweiger 等，2026，Figure 2。](/img/readApaper-40/schweiger2026_fig2.png)

<i>图 2. 预测精度，以及两分钟的线性头。(A–E) 在验证类器官（n = 30）上比较设计选择。(B–E) 左侧示意图说明各项指标在问什么：皮尔逊 r 关注时机，即使把预测整体缩放也不会改变；每锋电位比特关注相对于恒定放电率基线的幅度。(F–I) 是留出的小鼠培养（n = 9）。每个点是一个培养，从冻结模型（零样本）连到加上两分钟线性头之后；橙色虚线是因果 EWMA 基线。取自 Schweiger 等，2026，Figure 2。</i>

在 CW20107 上训练、不加重新拟合的时钟，把 16p11.2 缺失记录放在其实际日龄之前（类器官偏移中位数 +9.7 天对 −0.8 天，P = 0.0022），六个 14765-X2 类器官全部排在六个 CW20107 类器官之前。SHANK3+/− 与其同基因对照没有差异。在一条无标签轴——潜协方差的第二主成分，并去掉对数单位数——上，两条突变系都相对自身对照朝同一方向移动。这一移动对 14765-X2 显著（P = 0.037），对两次比较合并也显著（P = 0.022），但单独看 SHANK3 并不显著（P = 0.26）。同样这两个突变，在爆发、拓扑和时间结构特征上朝共同方向移动（15 项中的 15 项），但在放电率与产出上没有（8 项中的 2 项）。

![图 4. 在同一套潜坐标里比较两种突变。(A) 是发育时钟：只在 CW20107 上，把潜协方差对实际培养日龄做岭回归；其他品系不加重新拟合地投影上去。(B) 和 (C) 中，14765-X2 的记录落在其培养日龄之前，而 SHANK3+/− 与同基因对照没有差异。(D–F) 改用一条无标签轴（PC2）和 28 项经典放电特征。读 (F) 的阴影象限：爆发、拓扑和时间结构特征，在两个突变对对照的比较中朝同一方向移动，放电率与产出则大多不是这样。取自 Schweiger 等，2026，Figure 4。](/img/readApaper-40/schweiger2026_fig4.png)

<i>图 4. 在同一套潜坐标里比较两种突变。(A) 是发育时钟：只在 CW20107 上，把潜协方差对实际培养日龄做岭回归；其他品系不加重新拟合地投影上去。(B) 和 (C) 中，14765-X2 的记录落在其培养日龄之前，而 SHANK3+/− 与同基因对照没有差异。(D–F) 改用一条无标签轴（PC2）和 28 项经典放电特征。读 (F) 的阴影象限：爆发、拓扑和时间结构特征，在两个突变对对照的比较中朝同一方向移动，放电率与产出则大多不是这样。取自 Schweiger 等，2026，Figure 4。</i>

刺激单个电极会产生部位特异的响应。解码器从潜状态识别该部位的准确率中位数是随机水平的 4.14 倍，分箱放电率只有 1.74 倍。在数日里，平均潜状态会漂移，但由此构造的伪时间仍能恢复真实记录顺序，而且电极特异的结构比这种全局漂移下降得更慢。

![图 5. 人群漂移，以及变化更慢的电极特异编码。(A) 是记录循环：自发时段与按电极、按固定频率的刺激交替。(B) 和 (C) 是一个实验中自发记录在位置上的漂移和在协方差形状上的旋转，颜色从早到晚。(D) 显示由这些摘要构造的伪时间能够恢复真实记录顺序（n = 10 个类器官）。(E) 把周期之间的漂移拆成所有电极共享的人群成分，以及电极特异的剩余，并比较减去每次脉冲刺激前基线之前与之后。(F) 是部位解码准确率随训练与测试记录相隔周期数的变化。取自 Schweiger 等，2026，Figure 5。](/img/readApaper-40/schweiger2026_fig5.png)

<i>图 5. 人群漂移，以及变化更慢的电极特异编码。(A) 是记录循环：自发时段与按电极、按固定频率的刺激交替。(B) 和 (C) 是一个实验中自发记录在位置上的漂移和在协方差形状上的旋转，颜色从早到晚。(D) 显示由这些摘要构造的伪时间能够恢复真实记录顺序（n = 10 个类器官）。(E) 把周期之间的漂移拆成所有电极共享的人群成分，以及电极特异的剩余，并比较减去每次脉冲刺激前基线之前与之后。(F) 是部位解码准确率随训练与测试记录相隔周期数的变化。取自 Schweiger 等，2026，Figure 5。</i>

刺激并不只是在重放输入节律。在 8 Hz 时出现了亚谐波 f/2 的功率，在 4 Hz 时则没有。没有记忆的泊松替代数据消除了这一节律，因此不是模型把它造出来的。即便如此，刺激引起的活动在全部 8 个类器官中都达到自发对自发上限的中位数 98.5%。闭环倒立摆控制使平均状态离开自发活动的距离大于开环刺激，但仍然沿着自发活动已经使用的方向（分别为自发上限的 95.0% 和 85.7%，n = 13）。一个潜状态解码器把持续平衡与迅速失败分开的 AUC 中位数是 0.790，高于放电率解码器（0.703）。区分平衡与失败的方向大部分落在自发子空间里（捕获中位数 62.7%，随机方向为 11.2%），而且并不是一条专属于成功的轴。

![图 7. 闭环控制移动了平均状态，但仍落在自发方向内。(A) 比较同一类器官上的三种制度：自发活动、开环脉冲串，以及对倒立摆的闭环控制。(B) 是三团潜状态的示例；(C) 汇总它们的质心彼此距离，相对于记录内部的移动（n = 13 个类器官）。(D) 是选择对教导的示意图。(E–G) 把开环和闭环活动投影到自发主成分上：它们的大部分方差被自发活动已经使用的方向捕获，远高于随机子空间的机会水平。取自 Schweiger 等，2026，Figure 7。](/img/readApaper-40/schweiger2026_fig7.png)

<i>图 7. 闭环控制移动了平均状态，但仍落在自发方向内。(A) 比较同一类器官上的三种制度：自发活动、开环脉冲串，以及对倒立摆的闭环控制。(B) 是三团潜状态的示例；(C) 汇总它们的质心彼此距离，相对于记录内部的移动（n = 13 个类器官）。(D) 是选择对教导的示意图。(E–G) 把开环和闭环活动投影到自发主成分上：它们的大部分方差被自发活动已经使用的方向捕获，远高于随机子空间的机会水平。取自 Schweiger 等，2026，Figure 7。</i>

## 分析

第一组是预测。PULSE 的训练目标是预测接下来 20 毫秒的锋电位计数，而不是给基因型或任务分类；512 维状态是这一预测的副产品。两分钟的线性头可以在未见过的类器官上恢复校准，包括从未进入预训练的人源品系。16p11.2 缺失类器官在每神经元可预测性上的下降，说的是预测误差；人群指标没有出现同样的差异，SHANK3 缺陷也没有。

第二组是疾病比较。发育时钟是从潜协方差到实际培养日龄的回归，只在一条对照系上拟合。14765-X2 类器官落在其培养日龄之前，是投影到这条轴上的结果，作者把它表述为网络成熟加快。与 SHANK3 共享的表型，是活动如何被协调——爆发、拓扑和时间结构——而不是网络放了多少电。统计支持的是这一合并后的共同位移；单独看 SHANK3 的比较并不显著。

第三组是这里所说的计算指什么。刺激部位的身份可以从诱发响应中读出，而且这种电极特异的结构，变化比人群的全局漂移更慢。刺激和任务驱动的活动仍然落在自发维度里，即使 8 Hz 响应已经意味着跨脉冲记忆，即使闭环控制移动了平均状态。这就是本文所说的选择：外部回路招募的，是这个尚未接受感觉输入的网络已经在产生的模式。

## 总结

PULSE 把下一步锋电位预测，变成了类器官网络的一套共用坐标系。在这套坐标里，16p11.2 缺失会推动发育时钟并更难按单个神经元预测，而同一缺失与 SHANK3 缺陷汇聚在协调方式上，而不是放电率上。当这些尚未接受感觉输入的网络被刺激、或被放入闭环平衡任务时，它们的活动仍然落在自己安静时已经使用的那些维度里。

## 参考资料

- Schweiger, H. E., Robbins, A., Hernandez, S., Moreno-Ochando, A., Cline, I., Doganyigit, K., Mouzaya, M., Hussain, K., Pang, Z. P., Duan, J., Salama, S. R., Pollen, A. A., Bhaduri, A., Haussler, D., Teodorescu, M., & Mostajo-Radji, M. A. (2026). <i>A foundation model for brain organoid network dynamics uncovers intrinsic computation and convergent disease phenotypes.</i> bioRxiv. [doi.org/10.64898/2026.10.11.758231](https://doi.org/10.64898/2026.10.11.758231)
- Dao, T., & Gu, A. (2024). Transformers are SSMs: Generalized models and efficient algorithms through structured state space duality. <i>Proceedings of the 41st International Conference on Machine Learning</i>, 235, 10041–10071. [proceedings.mlr.press/v235/dao24a.html](https://proceedings.mlr.press/v235/dao24a.html)
- Robbins, A., Schweiger, H. E., Hernandez, S., Spaeth, A., Voitiuk, K., Parks, D. F., van der Molen, T., Geng, J., Cline, I., Kosik, K. S., et al. (2026). Goal-directed learning in cortical organoids. <i>Cell Reports</i>, 45, 116984. [doi.org/10.1016/j.celrep.2026.116984](https://doi.org/10.1016/j.celrep.2026.116984)

图 1、2、4、5、7 取自 Schweiger 等，2026，bioRxiv 预印本，DOI [10.64898/2026.10.11.758231](https://doi.org/10.64898/2026.10.11.758231)。
