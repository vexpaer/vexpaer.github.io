---
title: "readApaper#31 A solution to the learning dilemma for recurrent networks of spiking neurons"
title_zh: "readApaper#31 A solution to the learning dilemma for recurrent networks of spiking neurons"
date: 2026-11-17 22:00:00
tags:
  - readApaper
  - spiking-neural-networks
  - machine-learning
  - learning-rules
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 17 November 2026 · Nature Communications, 17 July 2020</i>

### Background

A spike is a brief, all-or-none pulse that a neuron uses to send information. A leaky integrate-and-fire (LIF) neuron is a simple model of that process: it adds up incoming spikes, lets its voltage leak toward rest, fires when a threshold is crossed, and then resets.

A recurrent network of such neurons—an RSNN—has loops, so activity can influence itself later and the network can use earlier events, not only the present input.

Training needs a loss that measures how far the outputs are from the desired ones, and a rule that changes each synaptic weight to reduce that loss. In a recurrent network, a past weight change can affect a later output only after traveling through many intermediate spikes. The standard way to compute those effects is backpropagation through time (BPTT): unroll the network across time, store the intermediate states, and walk backward from the end. For a brain, or for a neuromorphic chip such as SpiNNaker or Loihi meant to run online at low power, that is not a rule computed while the network itself is running.

This paper also uses spike-frequency adaptation. ALIF neurons raise their threshold after they spike and let it decay slowly. A mix of LIF and ALIF neurons is called an LSNN; earlier work showed that, trained with BPTT, it can approach the power of an LSTM, a standard non-spiking recurrent model.

Biology already offers two related ingredients: short-lived molecular traces at synapses, often called eligibility traces, and neuron-specific top-down signals such as dopamine or acetylcholine. The question is whether those two kinds of signal can stand in for BPTT.

### Problem

The learning dilemma is this: recurrent spiking networks can in principle compute over time, but BPTT, the method that trains them well, is not a local, online algorithm. Without a substitute, it is hard to see how such networks could be trained in a brain, or on hardware that cannot store the whole history and run a backward pass.

The paper asks whether the gradient of the loss can be split into a local, forward-computed eligibility trace and a learning signal, and whether an online approximation to that learning signal is accurate enough to train LSNNs on demanding tasks.

### Method

The starting point is an identity, not an approximation. The gradient of the loss <i>E</i> with respect to the synaptic weight <i>W<sub>ji</sub></i> from neuron <i>i</i> to neuron <i>j</i> is a sum over time of two factors:

<i>dE/dW<sub>ji</sub> = Σ<sub>t</sub> L<sub>j</sub><sup>t</sup> e<sub>ji</sub><sup>t</sup></i>

The second factor, <i>e<sub>ji</sub><sup>t</sup></i>, is the eligibility trace of that synapse. It is the local contribution of the weight to neuron <i>j</i> at time <i>t</i>, updated as the network runs from recent pre- and postsynaptic activity, without looking at later neurons or later losses. For a LIF neuron this trace resembles the classic eligibility traces of computational neuroscience. For an ALIF neuron it also tracks the slow adaptation variable, so it can stay informative over long delays. This local term is the most gradient information that can be computed locally going forward; it is not itself the approximation.

The first factor, <i>L<sub>j</sub><sup>t</sup></i>, is the learning signal. Ideally it would include effects that appear only later, after the spike has traveled through other neurons—the path the authors call route (ii). That full signal is not available online. Eligibility propagation, or e-prop, replaces it with an approximation that uses only the current mismatch between outputs <i>y</i> and targets <i>y\*</i>, sent back with weights <i>B</i>:

<i>L<sub>j</sub><sup>t</sup> = Σ<sub>k</sub> B<sub>jk</sub> (y<sub>k</sub><sup>t</sup> − y\*<sub>k</sub><sup>t</sup>)</i>

This keeps open route (i): earlier hidden states, including slow ALIF adaptation, can still affect the loss through the eligibility trace. The synaptic update is proportional to <i>−L<sub>j</sub><sup>t</sup> e<sub>ji</sub><sup>t</sup></i>.

Three supervised variants differ only in how <i>B</i> is chosen, and should not be mixed:

- Symmetric e-prop: <i>B</i> is set equal to the corresponding output weights (weight sharing).
- Random e-prop: every entry of <i>B</i> is drawn at random and then held fixed, even for neurons that are not connected to that output.
- Adaptive e-prop: <i>B</i> starts random, and a local rule then adjusts those entries that correspond to real output synapses, so they move with the outgoing weights.

When the goal is a delayed scalar reward rather than a target at every time, a reward-based form includes a global reward-prediction error in the learning signal. The Atari experiments use reward-based symmetric e-prop.

Figure 1 shows the contrast: BPTT sends errors backward after the sequence ends; e-prop stays forward, combining a local trace with an online learning signal.

![From Bellec et al., 2020, Figure 1. Panel a: a recurrent spiking network (RSNN) maps a stream of inputs x to outputs y; the loss E can depend on every time step. Panels b–c: backpropagation through time unrolls the same network across time and, after the loss is fully evaluated, sends error derivatives (green) backward. Panel d: in e-prop the computation stays forward (open arrow to the right). Each synapse keeps a local eligibility trace e (blue). An online error module compares the current output with the target and sends a learning signal L (green dashed) to each neuron. The weight update uses the product of L and e at the same time, so no backward pass is required.](/img/readApaper-31/bellec2020_fig1.png)

<i>From Bellec et al., 2020, Figure 1. Panel a: a recurrent spiking network (RSNN) maps a stream of inputs x to outputs y; the loss E can depend on every time step. Panels b–c: backpropagation through time unrolls the same network across time and, after the loss is fully evaluated, sends error derivatives (green) backward. Panel d: in e-prop the computation stays forward (open arrow to the right). Each synapse keeps a local eligibility trace e (blue). An online error module compares the current output with the target and sends a learning signal L (green dashed) to each neuron. The weight update uses the product of L and e at the same time, so no backward pass is required.</i>

### Experiments

The paper compares e-prop with BPTT and with a weak baseline that uses only a global learning signal. Each variant and architecture should stay attached to the task that used them.

Speech, framewise phoneme recognition (TIMIT). Each short time frame is labeled with one of 61 phonemes. The architecture is bidirectional: one LSNN sees the input forward, another in reverse, with 300 LIF and 100 ALIF neurons in each direction. Figure 2c (left) reports symmetric e-prop; random and adaptive e-prop are similar in the supplement.

Speech, unaligned phoneme sequences (TIMIT). The target is the phoneme sequence without frame alignment, trained with connectionist temporal classification (CTC). This network is not bidirectional. It has three stacked recurrent layers (2400 neurons in total), all also connected to the outputs so earlier layers still receive learning signals. The authors use it as a demanding comparison of BPTT and e-prop, not as a straightforwardly online setting.

Temporal credit assignment (Figure 3). Seven left or right cues appear early, followed by a 500–1500 ms delay and a short decision window. Learning signals are nonzero only in that last window, so credit must travel from a late error back to early cues. The LSNN has 50 LIF and 50 ALIF neurons, trained with a curriculum in the number of cues and stopped below 8% decision error. Figure 3c compares BPTT for the LSNN, BPTT for a LIF-only network, random e-prop, adaptive e-prop, and random e-prop with sparse connectivity and Dale’s law. A reward-based version of the same task is in the supplement, not in Figure 3.

Atari. Pong and Fishing Derby are trained with reward-based symmetric e-prop. The protocol is not the same as the well-known LSTM baseline, which reported the best runs from a much larger set. Fishing Derby is a game where that baseline found an LSTM better than a feedforward agent.

### Results

On framewise TIMIT (Figure 2c, left), a global learning signal yields 52% error. Symmetric e-prop reaches 34.6%, close to BPTT at 32.9%. On the CTC sequence task (Figure 2c, right), the global baseline is 60%; e-prop reaches 26.4% and BPTT 24.7%.

![From Bellec et al., 2020, Figure 2. Panel a: the online scheme, with the learning signal written as a weighted sum of current output errors, L_j^t = Σ_k B_jk (y_k^t − y*_k^t). Gray circles are LIF neurons; black circles are adapting (ALIF) neurons. Panel b: two ways of labeling the spoken word “can.” Framewise targets assign a phoneme to every short time window; sequence targets keep only the phoneme sequence, without alignment. Panel c: phoneme error rates on TIMIT. Left, framewise task (bidirectional LSNN; the e-prop bar is symmetric e-prop): a global learning signal 52%, e-prop 34.6%, BPTT 32.9%. Right, unaligned sequence task (three stacked recurrent layers, CTC): global 60%, e-prop 26.4%, BPTT 24.7%.](/img/readApaper-31/bellec2020_fig2.png)

<i>From Bellec et al., 2020, Figure 2. Panel a: the online scheme, with the learning signal written as a weighted sum of current output errors, L<sub>j</sub><sup>t</sup> = Σ<sub>k</sub> B<sub>jk</sub> (y<sub>k</sub><sup>t</sup> − y\*<sub>k</sub><sup>t</sup>). Gray circles are LIF neurons; black circles are adapting (ALIF) neurons. Panel b: two ways of labeling the spoken word “can.” Framewise targets assign a phoneme to every short time window; sequence targets keep only the phoneme sequence, without alignment. Panel c: phoneme error rates on TIMIT. Left, framewise task (bidirectional LSNN; the e-prop bar is symmetric e-prop): a global learning signal 52%, e-prop 34.6%, BPTT 32.9%. Right, unaligned sequence task (three stacked recurrent layers, CTC): global 60%, e-prop 26.4%, BPTT 24.7%.</i>

On the credit-assignment task, BPTT for the LSNN (black in Figure 3c) reaches the 8% stop criterion first. A LIF-only network trained with BPTT (red) stays near chance. Random e-prop (green), adaptive e-prop (blue), and the sparse Dale’s-law variant (orange) all solve the task when adapting neurons are present: they reach the same level as BPTT, more slowly. In one trial (panel b), ALIF eligibility traces persist through the delay, while the learning signal appears only in the decision window. After learning, a neuron’s left-versus-right preference lines up with its random broadcast weights (panel d).

![From Bellec et al., 2020, Figure 3. A delayed cue-counting task. Panel a: seven left (blue) or right (red) cues are shown early, then a 500–1500 ms delay, then a short decision window. Panel b: one trained trial. From top to bottom: cue and noise inputs; LIF and ALIF spikes and voltages; eligibility traces of three ALIF synapses, which rise with the cues and decay slowly through the delay; the learning signal L, silent until the decision window; and the softmax output, which tracks the running cue count. Panel c: decision error versus training, 20 runs, with a shaded 95% confidence interval and an 8% stop criterion (dashed red). Black: BPTT for the LSNN. Red: BPTT for a LIF-only network, which stays near chance. Green: random e-prop. Blue: adaptive e-prop. Orange: random e-prop with 10% connectivity and Dale’s law. All three e-prop variants solve the task when adapting neurons are present, more slowly than BPTT. Panel d: after learning, a neuron’s preference for left versus right cues (vertical) lines up with the difference of its two random broadcast weights (horizontal).](/img/readApaper-31/bellec2020_fig3.png)

<i>From Bellec et al., 2020, Figure 3. A delayed cue-counting task. Panel a: seven left (blue) or right (red) cues are shown early, then a 500–1500 ms delay, then a short decision window. Panel b: one trained trial. From top to bottom: cue and noise inputs; LIF and ALIF spikes and voltages; eligibility traces of three ALIF synapses, which rise with the cues and decay slowly through the delay; the learning signal L, silent until the decision window; and the softmax output, which tracks the running cue count. Panel c: decision error versus training, 20 runs, with a shaded 95% confidence interval and an 8% stop criterion (dashed red). Black: BPTT for the LSNN. Red: BPTT for a LIF-only network, which stays near chance. Green: random e-prop. Blue: adaptive e-prop. Orange: random e-prop with 10% connectivity and Dale’s law. All three e-prop variants solve the task when adapting neurons are present, more slowly than BPTT. Panel d: after learning, a neuron’s preference for left versus right cues (vertical) lines up with the difference of its two random broadcast weights (horizontal).</i>

On the two Atari games, reward-based symmetric e-prop is reported to reach the same performance as the reference offline LSTM algorithms, under the protocol differences noted above.

### Analysis

The identity <i>dE/dW = Σ L e</i> separates two jobs. The eligibility trace is local and online; for ALIF neurons, its slow component can carry an early cue until a late learning signal arrives. The approximation sits entirely in <i>L</i>. Symmetric e-prop still shares weights, so it is the least plausible of the three routing schemes as a biological mechanism; random and adaptive e-prop avoid that sharing. “Biologically plausible” here means: no unrolling, no storing the past in order to walk backward, local traces analogous to molecular eligibility, and neuron-specific top-down signals analogous to known neuromodulatory and error-related activity. That is a statement about the form of the rule, supported by the tasks above.

If extra feedforward layers block route (i)—the current-time contribution of a hidden neuron to the loss—BPTT can still learn via route (ii), while symmetric e-prop cannot. That is expected: e-prop does not compute the future-through-other-neurons part of the gradient. The main tasks are ones where route (i), kept open by the eligibility trace, is enough.

The CTC and bidirectional TIMIT setups are comparison settings, not claims that those architectures are themselves online biological algorithms.

### Summary

Bellec and colleagues split recurrent learning into a local eligibility trace, updated as the network runs, and a learning signal that e-prop approximates online from current output errors or a reward-prediction error. On phoneme recognition, a delayed cue-counting task, and two Atari games, that approximation stays close to BPTT when the network has slow adapting neurons to carry credit across time.

### References

1. Bellec, G., Scherr, F., Subramoney, A., Hajek, E., Salaj, D., Legenstein, R. & Maass, W. A solution to the learning dilemma for recurrent networks of spiking neurons. <i>Nature Communications</i> 11, 3625 (2020). [https://doi.org/10.1038/s41467-020-17236-y](https://doi.org/10.1038/s41467-020-17236-y)
2. Bellec, G., Salaj, D., Subramoney, A., Legenstein, R. & Maass, W. Long short-term memory and learning-to-learn in networks of spiking neurons. In <i>Advances in Neural Information Processing Systems</i> (2018).
3. Gerstner, W., Lehmann, M., Liakoni, V., Corneil, D. & Brea, J. Eligibility traces and plasticity on behavioral time scales: experimental support of NeoHebbian three-factor learning rules. <i>Frontiers in Neural Circuits</i> 12, 53 (2018).
4. Lillicrap, T. P., Cownden, D., Tweed, D. B. & Akerman, C. J. Random synaptic feedback weights support error backpropagation for deep learning. <i>Nature Communications</i> 7, 13276 (2016).
5. Graves, A., Mohamed, A. & Hinton, G. Speech recognition with deep recurrent neural networks. In <i>IEEE International Conference on Acoustics, Speech and Signal Processing</i> (2013).
6. Mnih, V. et al. Asynchronous methods for deep reinforcement learning. In <i>Proceedings of the 33rd International Conference on Machine Learning</i> (2016).
7. Source code: [https://github.com/IGITUGraz/eligibility\_propagation](https://github.com/IGITUGraz/eligibility_propagation)
8. Figures from Bellec et al., <i>Nature Communications</i> (2020).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-17 · Nature Communications, 17 July 2020</i>

### 背景

脉冲（spike）是神经元用来传递信息的短暂全或无放电。漏积分发放（LIF）神经元是对这一过程的简单模型：它把传入脉冲累加起来，电压同时向静息电位泄漏，越过阈值就发放一次，随后复位。

由这类神经元构成、并且带有回路的网络，称为循环脉冲神经网络（RSNN）。回路使活动可以在稍后时刻再影响自己，于是网络能够利用更早发生的事情，而不只是当前输入。

训练需要一个衡量输出与目标有多远的损失，以及把每个突触权重沿降低损失的方向调整的规则。在循环网络里，过去的一次权重变化往往要穿过许多中间脉冲，才会影响到更晚的输出。计算这些效应的标准方法是沿时间反向传播（BPTT）：把网络在时间上展开，存下中间状态，再从末尾往回走。对大脑而言，或对 SpiNNaker、Loihi 这类希望在线、低功耗运行的神经形态芯片而言，这并不是一条在网络运行的同时算出的规则。

本文还用到发放频率适应。ALIF 神经元在发放后会提高阈值，再让阈值缓慢回落。LIF 与 ALIF 的混合网络称为 LSNN；先前的工作表明，用 BPTT 训练时，其计算能力可以接近 LSTM 这一常用的非脉冲循环模型。

生物学里已经有两类相关信号：突触上短暂的分子痕迹——常被称为资格迹（eligibility trace）——以及多巴胺、乙酰胆碱等针对单个神经元的自上而下信号。问题是：这两类信号能否替代 BPTT。

### 问题

所谓学习困境是：循环脉冲网络原则上能够做跨时间的计算，但真正好用的训练方法 BPTT 并不是局部、在线的算法。若没有替代方案，就很难想象这类网络如何在大脑中被训练，或如何在无法保存全部历史、也无法做反向传播的硬件上被训练。

本文要问的是：损失的梯度能否拆成一个可在前向过程中局部计算的资格迹，再乘上一个学习信号；以及，若把这个学习信号改成纯在线的近似，是否仍足以在有挑战性的任务上训练 LSNN。

### 方法

出发点是一个恒等式，而不是近似。损失 <i>E</i> 对从神经元 <i>i</i> 到神经元 <i>j</i> 的突触权重 <i>W<sub>ji</sub></i> 的梯度，可以写成两项在时间上的求和：

<i>dE/dW<sub>ji</sub> = Σ<sub>t</sub> L<sub>j</sub><sup>t</sup> e<sub>ji</sub><sup>t</sup></i>

第二项 <i>e<sub>ji</sub><sup>t</sup></i> 是该突触的资格迹。它描述这个权重对神经元 <i>j</i> 在时刻 <i>t</i> 的局部贡献，由近期的前、后突触活动在网络运行时向前更新，不必看更靠后的神经元，也不必看更晚的损失。对 LIF 神经元，这条迹类似于计算神经科学里经典的资格迹；对 ALIF 神经元，它还会跟踪缓慢的适应变量，因此能在较长的延迟上保持信息。这一局部项是在前向、局部条件下关于真实梯度所能算出的最大信息量，它本身并不是近似。

第一项 <i>L<sub>j</sub><sup>t</sup></i> 是学习信号。理想情况下，它应包含这条脉冲经其他神经元传播之后、才会在更晚时刻显现的影响——作者称之为路径 (ii)。这个完整信号无法在线获得。资格传播（e-prop）用一种近似来替代它：只用当前输出 <i>y</i> 与目标 <i>y\*</i> 的偏差，再通过一组权重 <i>B</i> 送回：

<i>L<sub>j</sub><sup>t</sup> = Σ<sub>k</sub> B<sub>jk</sub> (y<sub>k</sub><sup>t</sup> − y\*<sub>k</sub><sup>t</sup>)</i>

这样仍然保留了路径 (i)：更早的隐藏状态，尤其是 ALIF 缓慢的适应变量，仍可通过资格迹影响损失。突触权重的更新与 <i>−L<sub>j</sub><sup>t</sup> e<sub>ji</sub><sup>t</sup></i> 成比例。

三种有监督变体只在 <i>B</i> 的取法上不同，不宜混用：

- 对称 e-prop：令 <i>B</i> 等于对应的输出权重（权重共享）。
- 随机 e-prop：<i>B</i> 的每个分量随机抽取后固定，即便该神经元与那个输出并无连接。
- 自适应 e-prop：<i>B</i> 先随机初始化，再用一条局部规则，只调整那些对应于真实输出突触的分量，使它们与输出权重同步变化。

当目标不是每个时刻的输出，而是延迟的标量奖励时，则使用基于奖励的形式，在学习信号中加入全局的奖励预测误差。Atari 实验采用的是基于奖励的对称 e-prop。

图 1 给出对比：BPTT 在序列结束后把误差往回传；e-prop 始终向前，把局部资格迹与在线学习信号相乘。

![取自 Bellec 等人, 2020, Figure 1。图 a：循环脉冲网络（RSNN）把输入流 x 映射为输出 y，损失 E 可以依赖于每一个时间步。图 b–c：沿时间反向传播把同一网络在时间上展开，在损失完全算清之后，把误差导数（绿色）往回传。图 d：e-prop 的计算始终向前（向右的空心箭头）。每个突触保存局部资格迹 e（蓝色）。在线误差模块比较当前输出与目标，向各神经元发送学习信号 L（绿色虚线）。权重更新使用同一时刻 L 与 e 的乘积，因此不需要反向传播。](/img/readApaper-31/bellec2020_fig1.png)

<i>取自 Bellec 等人, 2020, Figure 1。图 a：循环脉冲网络（RSNN）把输入流 x 映射为输出 y，损失 E 可以依赖于每一个时间步。图 b–c：沿时间反向传播把同一网络在时间上展开，在损失完全算清之后，把误差导数（绿色）往回传。图 d：e-prop 的计算始终向前（向右的空心箭头）。每个突触保存局部资格迹 e（蓝色）。在线误差模块比较当前输出与目标，向各神经元发送学习信号 L（绿色虚线）。权重更新使用同一时刻 L 与 e 的乘积，因此不需要反向传播。</i>

### 实验

论文把 e-prop 与 BPTT 比较，并以只使用全局学习信号的弱基线作对照。变体和网络结构应与对应任务放在一起看，不要交叉套用。

语音、逐帧音素识别（TIMIT）。每个短时帧标为 61 个音素之一。网络是双向的：一个 LSNN 按时间正向看输入，另一个按时间反向看，每个方向有 300 个 LIF 和 100 个 ALIF 神经元。正文图 2c 左侧给出的是对称 e-prop；随机与自适应 e-prop 在补充材料中结果相近。

语音、无对齐的音素序列（TIMIT）。目标是没有帧对齐的音素序列，用连接时序分类（CTC）训练。这个网络不是双向的，而是三层堆叠的循环层（共 2400 个神经元），各层也都接到输出，使较早的层仍能收到学习信号。作者把它当作 BPTT 与 e-prop 的高难度对比，而不是直接的在线设定。

时间信用分配（图 3）。早期出现 7 个左或右线索，随后是 500–1500 ms 的延迟和短暂的决策窗。学习信号只在最后这一窗内非零，因此信用必须从晚期误差回到早期线索。LSNN 有 50 个 LIF 和 50 个 ALIF 神经元，按线索数量递增训练，决策误差低于 8% 时停止。图 3c 比较的是：LSNN 上的 BPTT、仅含 LIF 的网络上的 BPTT、随机 e-prop、自适应 e-prop，以及稀疏连接并遵守 Dale 定律的随机 e-prop。同一任务的基于奖励版本见补充材料，不在图 3 中。

Atari。Pong 与 Fishing Derby 用基于奖励的对称 e-prop 训练。实验规程与常见的 LSTM 基线不同，后者报告的是在更大运行次数中最好的几次。Fishing Derby 是该基线发现 LSTM 优于前馈智能体的游戏。

### 结果

在逐帧 TIMIT（图 2c 左）上，全局学习信号的错误率为 52%。对称 e-prop 达到 34.6%，接近 BPTT 的 32.9%。在 CTC 序列任务（图 2c 右）上，全局基线为 60%；e-prop 为 26.4%，BPTT 为 24.7%。

![取自 Bellec 等人, 2020, Figure 2。图 a：同一在线方案，学习信号写为当前输出误差的加权和 L_j^t = Σ_k B_jk (y_k^t − y*_k^t)。灰圈为 LIF 神经元，黑圈为具有适应的 ALIF 神经元。图 b：对口语词 “can” 的两种标注。逐帧目标给每个短时窗一个音素；序列目标只保留音素序列，不对齐。图 c：TIMIT 上的音素错误率。左为逐帧任务（双向 LSNN；其中 e-prop 柱为对称 e-prop）：全局学习信号 52%，e-prop 34.6%，BPTT 32.9%。右为无对齐序列任务（三层堆叠循环网络，CTC）：全局 60%，e-prop 26.4%，BPTT 24.7%。](/img/readApaper-31/bellec2020_fig2.png)

<i>取自 Bellec 等人, 2020, Figure 2。图 a：同一在线方案，学习信号写为当前输出误差的加权和 L<sub>j</sub><sup>t</sup> = Σ<sub>k</sub> B<sub>jk</sub> (y<sub>k</sub><sup>t</sup> − y\*<sub>k</sub><sup>t</sup>)。灰圈为 LIF 神经元，黑圈为具有适应的 ALIF 神经元。图 b：对口语词 “can” 的两种标注。逐帧目标给每个短时窗一个音素；序列目标只保留音素序列，不对齐。图 c：TIMIT 上的音素错误率。左为逐帧任务（双向 LSNN；其中 e-prop 柱为对称 e-prop）：全局学习信号 52%，e-prop 34.6%，BPTT 32.9%。右为无对齐序列任务（三层堆叠循环网络，CTC）：全局 60%，e-prop 26.4%，BPTT 24.7%。</i>

在信用分配任务上，LSNN 的 BPTT（图 3c 黑线）最先达到 8% 的停止标准。只用 LIF、再用 BPTT 训练的网络（红线）停在接近随机的水平。随机 e-prop（绿）、自适应 e-prop（蓝），以及稀疏连接并遵守 Dale 定律的变体（橙），在存在适应神经元时都能解决该任务：达到与 BPTT 相同的水平，只是更慢。图 b 用一次试次说明预想的机制：ALIF 的资格迹能在延迟期间保持，而学习信号只在决策窗内出现。学习之后，神经元对左、右线索的偏好与其随机广播权重之差对齐（图 d）。

![取自 Bellec 等人, 2020, Figure 3。延迟数线索任务。图 a：早期呈现 7 个左（蓝）或右（红）线索，随后是 500–1500 ms 延迟，再进入短暂的决策窗。图 b：一次训练后的试次。自上而下依次为：线索与噪声输入；LIF 与 ALIF 的脉冲和电压；三条 ALIF 突触的资格迹，随线索上升并在延迟中缓慢衰减；学习信号 L，在决策窗之前保持为零；以及跟踪累计线索计数的 softmax 输出。图 c：决策误差随训练变化，20 次运行，阴影为 95% 置信区间，红色虚线为 8% 停止标准。黑：LSNN 上的 BPTT。红：仅含 LIF 的网络上的 BPTT，停在接近随机的水平。绿：随机 e-prop。蓝：自适应 e-prop。橙：带 10% 连接和 Dale 定律的随机 e-prop。在存在适应神经元时，三种 e-prop 变体都能解决该任务，只是比 BPTT 更慢。图 d：学习之后，神经元对左、右线索的偏好（纵轴）与其两个随机广播权重之差（横轴）对齐。](/img/readApaper-31/bellec2020_fig3.png)

<i>取自 Bellec 等人, 2020, Figure 3。延迟数线索任务。图 a：早期呈现 7 个左（蓝）或右（红）线索，随后是 500–1500 ms 延迟，再进入短暂的决策窗。图 b：一次训练后的试次。自上而下依次为：线索与噪声输入；LIF 与 ALIF 的脉冲和电压；三条 ALIF 突触的资格迹，随线索上升并在延迟中缓慢衰减；学习信号 L，在决策窗之前保持为零；以及跟踪累计线索计数的 softmax 输出。图 c：决策误差随训练变化，20 次运行，阴影为 95% 置信区间，红色虚线为 8% 停止标准。黑：LSNN 上的 BPTT。红：仅含 LIF 的网络上的 BPTT，停在接近随机的水平。绿：随机 e-prop。蓝：自适应 e-prop。橙：带 10% 连接和 Dale 定律的随机 e-prop。在存在适应神经元时，三种 e-prop 变体都能解决该任务，只是比 BPTT 更慢。图 d：学习之后，神经元对左、右线索的偏好（纵轴）与其两个随机广播权重之差（横轴）对齐。</i>

在两款 Atari 游戏上，在前述规程差异之下，基于奖励的对称 e-prop 被报告达到了与对照离线 LSTM 算法相同的表现。

### 分析

恒等式 <i>dE/dW = Σ L e</i> 把两项工作分开。资格迹是局部且在线的；对 ALIF 神经元，其缓慢成分可以把早期线索保持到晚期学习信号到来。近似完全落在 <i>L</i> 上。对称 e-prop 仍共享权重，在三种路由方案里作为生物机制的合理性最低；随机与自适应 e-prop 避免了这种共享。本文所说的“生物合理性”指的是：不展开时间、不为了回溯而存储过去、具有类似分子资格迹的局部痕迹，以及类似已知调质和误差相关活动的、针对单个神经元的自上而下信号。这是关于规则形式的陈述，并由上述任务支持。

若额外的前馈层阻断了路径 (i)——即隐藏神经元对损失在当前时刻的直接贡献——BPTT 仍能借助路径 (ii) 学习，而对称 e-prop 则不能。这是预期之中的：e-prop 并不计算“经其他神经元在未来起作用”的那部分梯度。正文中的任务，正是路径 (i) 在资格迹的支撑下已经足够的情形。

CTC 与双向的 TIMIT 设定都是对比安排，并不是在主张这些结构本身就是在线的生物学算法。

### 总结

Bellec 及其同事把循环学习拆成两部分：一条可在网络运行时更新的局部资格迹，以及一个由 e-prop 在线近似的学习信号——近似来自当前输出误差，或来自奖励预测误差。在音素识别、延迟数线索任务和两款 Atari 游戏上，当网络具有能够把信用跨时间携带下去的、缓慢适应的神经元时，这一近似与 BPTT 接近。

### 参考文献

1. Bellec, G., Scherr, F., Subramoney, A., Hajek, E., Salaj, D., Legenstein, R. & Maass, W. A solution to the learning dilemma for recurrent networks of spiking neurons. <i>Nature Communications</i> 11, 3625 (2020). [https://doi.org/10.1038/s41467-020-17236-y](https://doi.org/10.1038/s41467-020-17236-y)
2. Bellec, G., Salaj, D., Subramoney, A., Legenstein, R. & Maass, W. Long short-term memory and learning-to-learn in networks of spiking neurons. In <i>Advances in Neural Information Processing Systems</i> (2018).
3. Gerstner, W., Lehmann, M., Liakoni, V., Corneil, D. & Brea, J. Eligibility traces and plasticity on behavioral time scales: experimental support of NeoHebbian three-factor learning rules. <i>Frontiers in Neural Circuits</i> 12, 53 (2018).
4. Lillicrap, T. P., Cownden, D., Tweed, D. B. & Akerman, C. J. Random synaptic feedback weights support error backpropagation for deep learning. <i>Nature Communications</i> 7, 13276 (2016).
5. Graves, A., Mohamed, A. & Hinton, G. Speech recognition with deep recurrent neural networks. In <i>IEEE International Conference on Acoustics, Speech and Signal Processing</i> (2013).
6. Mnih, V. et al. Asynchronous methods for deep reinforcement learning. In <i>Proceedings of the 33rd International Conference on Machine Learning</i> (2016).
7. 源代码：[https://github.com/IGITUGraz/eligibility\_propagation](https://github.com/IGITUGraz/eligibility_propagation)
8. 图取自 Bellec 等人, <i>Nature Communications</i> (2020)。
