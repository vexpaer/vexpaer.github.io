---
title: "readApaper#43 Test-Time Adaptation of Spiking Neural Networks for Intracortical Neural Decoding using Membrane Potential Alignment"
title_zh: "readApaper#43 Test-Time Adaptation of Spiking Neural Networks for Intracortical Neural Decoding using Membrane Potential Alignment"
date: 2026-11-29 22:00:00
tags:
  - readApaper
  - spiking-neural-networks
  - brain-computer-interface
  - machine-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 29 November 2026 · arXiv, 2026</i>

This paper shows how a pretrained spiking decoder can be realigned to a later day’s cortical recordings by matching only its membrane-potential statistics, without new movement labels.

## Background

An <b>intracortical brain–computer interface</b> (iBCI) records spikes from electrodes in cortex and turns them into a command, such as decoded hand velocity. After a decoder is trained, the same implant is meant to last. In practice the recordings drift: electrode micromotion, changes in which units are visible, and shifts in firing statistics can all change the spike-to-movement map. A model that worked on day 0 can lose accuracy on day k, even on the same kind of task.

<b>Test-time adaptation</b> (TTA) keeps a model trained with labels on a source session and adjusts it on a new target session using only the new neural recordings. A strong recent method, NoMAD, aligns latent dynamical states of a deep recurrent model and has supported stable primate decoding over months. It works, but the architecture is heavy, typically a variational autoencoder with gated recurrent layers, and it usually runs on coarser time bins.

A <b>spiking neural network</b> (SNN) communicates with discrete spikes. Each unit holds an internal voltage, the <b>membrane potential</b>: input current charges it, a spike is emitted when a threshold is crossed, and the voltage is then reset. Because spikes are sparse, SNNs are attractive for low-power decoding. The question is whether an SNN can be adapted across days as effectively as a much larger deep model, using only a short unlabeled snippet of the new session.

## Problem

The practical problem is long-term decoding without a fresh labeled mapping session every day. Methods that work well on primate reaching have been computationally expensive, and a poor match for implantable or edge hardware.

Inside an SNN, a session shift changes the spike input and, with it, the hidden membrane-potential trajectories. If those voltages on day k can be brought back in line with the voltages the pretrained model produced on day 0, later layers that already know how to read movement from that internal state may work again—without new velocity labels. The update must also be small, and some target sessions may have drifted too far for any unlabeled alignment from a single source day. The method therefore needs a recording-based check of source–target compatibility.

## Method

<b>Membrane Potential Alignment</b> (MPA) has two stages. First, an SNN is trained with supervision on day 0, mapping binned cortical spikes to hand velocity. Second, on day k, the movement readout stays frozen and only a small set of adaptation parameters is updated so that the hidden membrane-potential distribution on day k matches the distribution of the frozen day-0 model on day-0 data.

![Figure 1. Membrane Potential Alignment (Tang, 2026, Fig. 1). Top: a source-day SNN is trained with a supervised mean-squared-error loss on hand velocity. Bottom: on a later day the movement readout and most weights stay fixed, and only a small adapter is updated by matching hidden membrane-potential distributions with a KL penalty; no new velocity labels are used.](/img/readApaper-43/readapaper43-fig1-method.png)

<i>Figure 1. Membrane Potential Alignment (Tang, 2026, Fig. 1). Top: a source-day SNN is trained with a supervised mean-squared-error loss on hand velocity. Bottom: on a later day the movement readout and most weights stay fixed, and only a small adapter is updated by matching hidden membrane-potential distributions with a KL penalty; no new velocity labels are used.</i>

The neuron is a leaky integrate-and-fire (LIF) cell:

ui(t) = β ui(t − 1) + Ii(t) − Si(t − 1) Vth,

where β is a leak, Ii(t) is input current, Vth is the threshold, and Si(t − 1) is the previous spike. After a spike the authors use a <b>soft reset</b>: the threshold is subtracted, but residual voltage is kept. A hard reset would send every suprathreshold state back to zero and make the voltage distribution less useful for matching.

MPA treats one hidden layer’s voltages as a continuous internal code. Over a batch of B windows of length T, the voltages form N = B × T vectors, whose mean and covariance define a Gaussian p(u) = N(μ, Σ). Let p0 be that Gaussian for the frozen model on day-0 data, and pk for the adapted model on day-k data. The loss is the Kullback–Leibler divergence DKL(p0 ∥ pk).

To avoid overfitting a short unlabeled recording, only a first-layer <b>LoRA</b> update is trained—the layer that sees the shifted spikes. A frozen weight W becomes W′ = W + AB, with thin rank-r matrices A and B, and A starts at zero so the model begins identical to the pretrained decoder. Later layers stay frozen. With r = 8, fewer than 9% of parameters are updated.

Two metrics, computed from recordings alone, flag hard targets. <b>Representational similarity</b> turns each session into the off-diagonal of its channel-by-channel Pearson correlation matrix and correlates those two vectors. <b>Grassmann distance</b> fits a 10-dimensional PCA subspace to each session and measures how far the subspaces have rotated. In this dataset, unsupervised alignment fails when the mismatch is large on both metrics at once.

## Experiments

The data are the public reaching recordings of Makin, O’Doherty, Cardoso and Sabes (2018). The study uses 23 sessions from Monkey 1 (Indy), each with 96 channels, collected from 15 September 2016 to 24 January 2017. Spikes and velocity are both handled in 4 ms bins, following NeuroBench. Only movement-active segments are kept, and each session is split 50% / 25% / 25% into train, validation and test.

The SNN has three fully connected hidden layers of 64 LIF neurons (β = 0.96, Vth = 1.0, fast-sigmoid surrogate gradient of slope 20, dropout 0.2). Training uses 50-timestep windows. Day-0 pretraining minimizes a temporally weighted mean-squared error that emphasizes later steps, with AdamW, learning rate 0.001, batch size 256 and 10 epochs. At test time the network is run in a streaming fashion over the full test set. For TTA, rank-8 LoRA weights on the first layer are trained for 10 epochs (learning rate 0.0005, batch size 1024, cosine annealing), and the checkpoint with the lowest validation KL is kept. Pretraining is repeated with five random seeds.

The main baseline is NoMAD, reimplemented in PyTorch, checked on the original paper’s data, then transferred with the same hyperparameters. It bins spikes at 20 ms and aligns a latent dynamical model with gated recurrent layers. Frozen LFADS and a frozen SNN are also reported. The task is self-paced grid reaching to random targets, less constrained than the center-out task in the original NoMAD study.

## Results

Table 1 takes the first October 2016 session (indy\_20161005\_06) as day 0 and adapts to ten later sessions through day 22. On day 0, the supervised SNN reaches a mean R² of 0.59 ± 0.01, and LFADS reaches 0.53 ± 0.05. Without adaptation both models fall on later days: the frozen SNN has a mean R² of 0.09 across the ten targets. MPA raises that mean to 0.33 and improves 9 of the 10 sessions. It outperforms NoMAD on three positively decoded days (1, 6 and 22) and stays close on most of the others. Both methods fail on day 8 (MPA: −0.04 ± 0.02).

![Figure 2. Single-session decoding on 17 October (day 12, seed 1) (Tang, 2026, Fig. 2). Without test-time adaptation, predicted x- and y-velocity stay near zero (R² = 0.072 and 0.098). With MPA, both axes track the true velocity more closely (R² = 0.474 and 0.449).](/img/readApaper-43/readapaper43-fig2-decoding.png)

<i>Figure 2. Single-session decoding on 17 October (day 12, seed 1) (Tang, 2026, Fig. 2). Without test-time adaptation, predicted x- and y-velocity stay near zero (R² = 0.072 and 0.098). With MPA, both axes track the true velocity more closely (R² = 0.474 and 0.449).</i>

A single-seed example on 17 October (day 12) makes the same point in traces: without TTA the SNN sits near R² ≈ 0.08; with MPA, both x- and y-velocity rise to R² ≈ 0.46. Pretraining on a different source day (indy\_20160915\_01) shows the same pattern: the frozen model drops, sometimes below zero, and MPA restores both short- and longer-interval targets.

Compatibility metrics help explain the failures. Relative to the 5 October source, the failed 13 October (day 8) session has the second-lowest representational similarity and the highest Grassmann distance among 22 targets. The 24 January 2017 session has the lowest similarity and one of the highest Grassmann distances; both NoMAD and MPA fail to recover positive R² there. By contrast, 6 December and 20 December still support successful TTA despite relatively low similarity.

![Figure 3. Compatibility of later sessions with the 5 October source (Tang, 2026, Fig. 4). (a) Representational similarity of correlation structure; (b) Grassmann distance between neural subspaces. Red bars mark failures. 13 October has the second-lowest similarity and the highest Grassmann distance; 24 January also fails. 6 December and 20 December still succeed despite relatively low similarity.](/img/readApaper-43/readapaper43-fig3-compat.png)

<i>Figure 3. Compatibility of later sessions with the 5 October source (Tang, 2026, Fig. 4). (a) Representational similarity of correlation structure; (b) Grassmann distance between neural subspaces. Red bars mark failures. 13 October has the second-lowest similarity and the highest Grassmann distance; 24 January also fails. 6 December and 20 December still succeed despite relatively low similarity.</i>

MPA also works with very little data. On the 17 October target, a substantial R² gain remains with as little as 1.88 s of source data and 1.28 s of target alignment data. In those tests the batch was smaller and the epoch count was adjusted so that the number of gradient updates stayed constant. Figure 5 reports TTA R² for seven fractions of the target training set, from 0.25% to 5% (1.28 s to 25.72 s), under four source-data budgets.

![Figure 4. MPA with limited data, evaluated on the 17 October target (Tang, 2026, Fig. 5). Panels vary day-0 source data from 0.5% (1.88 s) to 10% (37.66 s); the x-axis is the fraction of day-k training data used for alignment, from 0.25% (1.28 s) to 5% (25.72 s). A substantial R² gain remains with only 1.88 s of source data and 1.28 s of target alignment data (a).](/img/readApaper-43/readapaper43-fig4-small.png)

<i>Figure 4. MPA with limited data, evaluated on the 17 October target (Tang, 2026, Fig. 5). Panels vary day-0 source data from 0.5% (1.88 s) to 10% (37.66 s); the x-axis is the fraction of day-k training data used for alignment, from 0.25% (1.28 s) to 5% (25.72 s). A substantial R² gain remains with only 1.88 s of source data and 1.28 s of target alignment data (a).</i>

## Analysis

The main result is not that the SNN beats NoMAD in every session, but that a much simpler spike-based decoder, updated only in a low-rank first layer by matching voltages, can reach a similar unsupervised recovery—and at 4 ms resolution rather than 20 ms. Moving 9 of 10 October targets, and taking one example from about 0.08 to about 0.46, shows that the KL objective on membrane potentials carries usable information about the session shift.

Decoding does not decay monotonically with calendar time: some later days are easier than earlier ones, which fits session-specific recording instabilities rather than a simple clock. When a target sits far from the source in both correlation structure and subspace orientation, unlabeled alignment does not rescue it. The two metrics therefore offer a practical test of whether a stored day-0 model is a reasonable starting point. A few seconds of unlabeled spikes can recover a large fraction of the TTA gain. The update is small enough to be a candidate for on-device learning, though this paper evaluates the algorithm in software, not on neuromorphic hardware.

## Summary

MPA keeps a supervised SNN trained on one day’s reaching data and, on later days, updates fewer than 9% of its parameters so that hidden membrane-potential distributions line up again. On a month of 96-channel recordings from one monkey, that unlabeled alignment raises mean velocity R² from 0.09 to 0.33, stays competitive with NoMAD, works with seconds of data, and comes with two recording-based checks for when a target session is too far to adapt.

## References

Tang, G. (2026). Test-Time Adaptation of Spiking Neural Networks for Intracortical Neural Decoding using Membrane Potential Alignment. arXiv:2606.14866.

Makin, J. G., O’Doherty, J. E., Cardoso, M. M., & Sabes, P. N. (2018). Superior arm-movement decoding from cortex with a new, unsupervised-learning algorithm. <i>Journal of Neural Engineering, 15</i>(2), 026010.

Karpowicz, B. M., Ali, Y. H., Wimalasena, L. N., Sedler, A. R., Keshtkaran, M. R., Bodkin, K., Ma, X., Rubin, D. B., Williams, Z. M., Cash, S. S., et al. (2025). Stabilizing brain-computer interfaces through alignment of latent dynamics. <i>Nature Communications, 16</i>, 4662.

Hu, E. J., Shen, Y., Wallis, P., Allen-Zhu, Z., Li, Y., Wang, S., Wang, L., & Chen, W. (2022). LoRA: Low-rank adaptation of large language models. <i>ICLR</i>.

Yik, J., et al. (2025). The NeuroBench framework for benchmarking neuromorphic computing algorithms and systems. <i>Nature Communications, 16</i>, 1545.

Hueber, P., Tang, G., Sifalakis, M., Liaw, H. P., Micheli, A., Tomen, N., & Liu, Y. H. (2024). Benchmarking of hardware-efficient real-time neural decoding in brain–computer interfaces. <i>Neuromorphic Computing and Engineering, 4</i>(2), 024008.

Figures are from Tang (2026), arXiv:2606.14866.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-29 · arXiv, 2026</i>

这篇论文表明，只需把脉冲解码器内部的膜电位统计对齐，就能把在某一天监督训练好的模型，适配到更晚一天的皮层记录上，而不需要新的运动标签。

## 背景

<b>皮层内脑机接口</b>（iBCI）把插在皮层里的电极记录到的脉冲，转换成控制指令，例如解码出的手部速度。解码器训练完成后，同一套植入往往要长期使用。实际记录却会漂移：电极微位移、能看到的单元变化，以及发放统计量的改变，都会改写脉冲和运动之间的对应。第 0 天还好用的模型，到了第 k 天，即使任务同类，精度也可能下降。

<b>测试时适应</b>（TTA）的做法是：先在源会话上用标签训练，再到新的目标会话上，只利用新的神经记录来调整模型。近年表现突出的 NoMAD，通过对齐深度循环模型的潜在动力学，曾在灵长类实验中把稳定解码维持数月。它有效，但结构较重——通常是带门控循环层的变分自编码器——时间窗也往往更粗。

<b>脉冲神经网络</b>（SNN）用离散脉冲通信。每个单元都维持一个内部电压，也就是<b>膜电位</b>：输入电流给它充电，超过阈值就发放，然后复位。因为脉冲稀疏，而且原则上可在神经形态硬件上运行，SNN 对低功耗解码很有吸引力。这里要问的是：SNN 能不能像更大的深度模型那样，只用一段很短的、没有标签的新会话数据，就完成跨日适配。

## 问题

实际要解决的，是长期解码而不必每天重新做一次带标签的映射。无监督 TTA 本是为了去掉这一负担，但在灵长类伸手数据上效果好的方法往往计算很重，和植入式或边缘硬件并不匹配。

在 SNN 内部，会话漂移会改变脉冲输入，进而改变隐层膜电位轨迹。如果能把第 k 天的这些电压拉回到预训练模型在第 0 天产生的分布，后面那些已经学会从这种内部状态读出运动的层，就有可能再次工作，而不需要新的速度标签。更新还必须足够小；有些目标会话也可能漂移太远，单靠某一天的源模型无法无监督地恢复。因此还需要一种只根据记录本身、判断源与目标是否匹配的办法。

## 方法

<b>膜电位对齐</b>（MPA）分两步。先在第 0 天监督训练一个 SNN，把分箱后的皮层脉冲映射为手部速度；再到第 k 天，运动读出保持冻结，只更新一小部分适配参数，使隐层膜电位在第 k 天的分布，重新接近冻结的第 0 天模型在第 0 天数据上给出的分布。

![图 1. 膜电位对齐方法（Tang，2026，Fig. 1）。上：在源日用监督均方误差损失，把脉冲映射到手部速度。下：在之后的一天，运动读出和大部分权重保持固定，只更新一个小的适配器，用 KL 惩罚去对齐隐层膜电位分布；测试时不再使用新的速度标签。](/img/readApaper-43/readapaper43-fig1-method.png)

<i>图 1. 膜电位对齐方法（Tang，2026，Fig. 1）。上：在源日用监督均方误差损失，把脉冲映射到手部速度。下：在之后的一天，运动读出和大部分权重保持固定，只更新一个小的适配器，用 KL 惩罚去对齐隐层膜电位分布；测试时不再使用新的速度标签。</i>

神经元采用漏积分发放（LIF）模型：

ui(t) = β ui(t − 1) + Ii(t) − Si(t − 1) Vth，

其中 β 是衰减，Ii(t) 是输入电流，Vth 是阈值，Si(t − 1) 是上一时刻是否发放。发放后作者使用<b>软复位</b>：减去阈值，但保留残余电压。硬复位会把所有超阈状态打回零，使电压分布在匹配损失里变得不那么有用。

MPA 把某一隐层的电压当作连续的内部编码。在一批 B 个长度为 T 的窗口上，这些电压构成 N = B × T 个向量，用均值和协方差定义高斯 p(u) = N(μ, Σ)。p0 是冻结模型跑在第 0 天数据上的高斯，pk 是适配模型跑在第 k 天数据上的高斯。损失就是 KL 散度 DKL(p0 ∥ pk)。

为避免在短而无标签的记录上过拟合，只训练 <b>LoRA</b> 更新，而且只加在直接看到漂移脉冲的第一隐层。冻结权重 W 变成 W′ = W + AB，A、B 是秩为 r 的薄矩阵，A 从零开始，使模型一开始和预训练解码器完全一样。后面的层保持冻结。在 r = 8 时，更新的参数不到总量的 9%。

另外两个只依赖记录的指标用来标记困难目标。<b>表征相似度</b>把每个会话写成通道相关矩阵的非对角元素，再计算两个向量的相关。<b>Grassmann 距离</b>对每个会话做 10 维 PCA，度量子空间旋转了多少。在这套数据里，只有两个指标同时差得很大时，无监督对齐才会失败。

## 实验

数据来自 Makin、O’Doherty、Cardoso 和 Sabes（2018）公开的伸手记录。研究使用 Monkey 1（Indy）的 23 个会话，每个 96 通道，采集于 2016 年 9 月 15 日至 2017 年 1 月 24 日。脉冲和速度都按 4 ms 处理，流程遵循 NeuroBench。只保留运动活跃片段，每个会话按 50% / 25% / 25% 划分训练、验证和测试。

SNN 有三个全连接隐层，每层 64 个 LIF 神经元（β = 0.96，Vth = 1.0，快 sigmoid 替代梯度斜率 20，dropout 0.2）。训练使用 50 步时间窗。第 0 天预训练最小化一个更强调窗口后期的加权均方误差，优化器为 AdamW，学习率 0.001，批量 256，共 10 个 epoch。测试时网络在整个测试集上按流式运行。做 TTA 时，第一层秩为 8 的 LoRA 权重训练 10 个 epoch（学习率 0.0005，批量 1024，余弦退火），保留验证集 KL 最低的检查点。预训练重复 5 个随机种子。

主要基线是 NoMAD。作者在 PyTorch 中复现，先在原论文数据上核对，再用同一组超参数迁到本数据。它按 20 ms 分箱，对齐的是由变分自编码器和门控循环层构成的潜在动力学模型。同时报告冻结的 LFADS 和冻结 SNN。任务是自定步速、随机目标的网格伸手，比 NoMAD 原文中的中心伸出更少约束。

## 结果

Table 1 以 2016 年 10 月的第一个会话（indy\_20161005\_06）为第 0 天，再适配到第 22 天之前的十个后续会话。在第 0 天，监督 SNN 的平均 R² 为 0.59 ± 0.01，LFADS 为 0.53 ± 0.05。不做适配时两者在后续天都下降：冻结 SNN 在十个目标上的平均 R² 为 0.09。MPA 把这一平均值提高到 0.33，并在 10 个会话中的 9 个上取得提升。它在三个解码为正的日子（第 1、6、22 天）上超过 NoMAD，其余多数会话也接近。两种方法都在第 8 天失败（MPA：−0.04 ± 0.02）。

![图 2. 10 月 17 日（第 12 天，种子 1）单次会话的速度解码（Tang，2026，Fig. 2）。没有测试时适应时，预测的 x、y 速度接近于零（R² = 0.072 和 0.098）。使用 MPA 后，两个方向都能更接近真实速度（R² = 0.474 和 0.449）。](/img/readApaper-43/readapaper43-fig2-decoding.png)

<i>图 2. 10 月 17 日（第 12 天，种子 1）单次会话的速度解码（Tang，2026，Fig. 2）。没有测试时适应时，预测的 x、y 速度接近于零（R² = 0.072 和 0.098）。使用 MPA 后，两个方向都能更接近真实速度（R² = 0.474 和 0.449）。</i>

以单一种子在 10 月 17 日（第 12 天）上的轨迹为例：不做 TTA 时 SNN 大约在 R² ≈ 0.08，加上 MPA 后 x、y 方向速度都升到 R² ≈ 0.46。改用另一个源会话（indy\_20160915\_01）预训练，在更晚的 9 月和 10 月会话上模式相同：冻结模型下降，有时降到零以下，MPA 则能在短间隔和更长间隔上恢复解码。

匹配指标有助于解释失败。相对于 10 月 5 日的源会话，失败的 10 月 13 日（第 8 天）在 22 个目标里表征相似度第二低，Grassmann 距离最高。2017 年 1 月 24 日的会话相似度最低，Grassmann 距离也很高；NoMAD 和 MPA 在那里同样没能恢复正的 R²。相比之下，12 月 6 日和 12 月 20 日尽管相似度也相对较低，TTA 仍然成功。

![图 3. 后续会话与 10 月 5 日源会话的相容性（Tang，2026，Fig. 4）。（a）相关结构的表征相似度；（b）神经子空间的格拉斯曼距离。红柱表示失败。10 月 13 日的相似度第二低、格拉斯曼距离最高；1 月 24 日也失败。12 月 6 日和 12 月 20 日虽然相似度相对较低，仍然成功。](/img/readApaper-43/readapaper43-fig3-compat.png)

<i>图 3. 后续会话与 10 月 5 日源会话的相容性（Tang，2026，Fig. 4）。（a）相关结构的表征相似度；（b）神经子空间的格拉斯曼距离。红柱表示失败。10 月 13 日的相似度第二低、格拉斯曼距离最高；1 月 24 日也失败。12 月 6 日和 12 月 20 日虽然相似度相对较低，仍然成功。</i>

MPA 在数据很少时仍然有效。在 10 月 17 日这个目标上，即使只用 1.88 秒源数据和 1.28 秒目标对齐数据，R² 仍有明显提升。这些实验减小了批量，并调整 epoch 数以保持梯度更新次数不变。图 5 在四种源数据用量下，报告了目标训练集从 0.25% 到 5%（1.28 秒到 25.72 秒）共七种比例的 TTA 后 R²。

![图 4. 小数据量下的 MPA，在 10 月 17 日目标会话上评估（Tang，2026，Fig. 5）。各面板的第 0 天源数据从 0.5%（1.88 秒）到 10%（37.66 秒）不等；横轴是用于对齐的第 k 天训练数据比例，从 0.25%（1.28 秒）到 5%（25.72 秒）。仅用 1.88 秒源数据和 1.28 秒目标对齐数据时，R² 仍有明显提升（a）。](/img/readApaper-43/readapaper43-fig4-small.png)

<i>图 4. 小数据量下的 MPA，在 10 月 17 日目标会话上评估（Tang，2026，Fig. 5）。各面板的第 0 天源数据从 0.5%（1.88 秒）到 10%（37.66 秒）不等；横轴是用于对齐的第 k 天训练数据比例，从 0.25%（1.28 秒）到 5%（25.72 秒）。仅用 1.88 秒源数据和 1.28 秒目标对齐数据时，R² 仍有明显提升（a）。</i>

## 分析

本文最核心的结果，并不是 SNN 在每一个会话上都胜过 NoMAD，而是：一个结构简单得多的脉冲解码器，只在第一层做低秩更新、对齐的是电压，就能达到相近的无监督恢复，而且时间分辨率是 4 ms 而不是 20 ms。10 个 10 月目标里有 9 个被推动，一个例子从约 0.08 升到约 0.46，说明膜电位上的 KL 目标确实携带了关于会话漂移的可用信息。

解码并不随日历时间单调变差：有些更晚的天反而比更早的天容易，这更符合会话特异性的记录不稳，而不是简单的时间流逝。当目标在相关结构和子空间方向上都远离源会话时，无标签对齐救不回来。两个指标因此提供了一个实用判断：存下来的第 0 天模型，是否还适合作为新记录的起点。小数据结果对用法很重要：几秒无标签脉冲就足以收回大部分 TTA 收益。这一更新也小到可以成为设备端学习的候选；不过本文是在软件中评估算法，并没有在神经形态硬件上实测。

## 总结

MPA 保留在某一天伸手数据上监督训练好的 SNN，到了更晚的天，只更新不到 9% 的参数，让隐层膜电位分布重新对齐。在一只猴子为期约一个月、96 通道的记录上，这种无标签对齐把速度解码的平均 R² 从 0.09 提高到 0.33，与 NoMAD 相当，只需数秒数据，并且提供了两套基于记录本身的检查，用来判断目标会话是否已经远到无法适配。

## 参考文献

Tang, G. (2026). Test-Time Adaptation of Spiking Neural Networks for Intracortical Neural Decoding using Membrane Potential Alignment. arXiv:2606.14866.

Makin, J. G., O’Doherty, J. E., Cardoso, M. M., & Sabes, P. N. (2018). Superior arm-movement decoding from cortex with a new, unsupervised-learning algorithm. <i>Journal of Neural Engineering, 15</i>(2), 026010.

Karpowicz, B. M., Ali, Y. H., Wimalasena, L. N., Sedler, A. R., Keshtkaran, M. R., Bodkin, K., Ma, X., Rubin, D. B., Williams, Z. M., Cash, S. S., et al. (2025). Stabilizing brain-computer interfaces through alignment of latent dynamics. <i>Nature Communications, 16</i>, 4662.

Hu, E. J., Shen, Y., Wallis, P., Allen-Zhu, Z., Li, Y., Wang, S., Wang, L., & Chen, W. (2022). LoRA: Low-rank adaptation of large language models. <i>ICLR</i>.

Yik, J., et al. (2025). The NeuroBench framework for benchmarking neuromorphic computing algorithms and systems. <i>Nature Communications, 16</i>, 1545.

Hueber, P., Tang, G., Sifalakis, M., Liaw, H. P., Micheli, A., Tomen, N., & Liu, Y. H. (2024). Benchmarking of hardware-efficient real-time neural decoding in brain–computer interfaces. <i>Neuromorphic Computing and Engineering, 4</i>(2), 024008.

图引自 Tang (2026)，arXiv:2606.14866。
