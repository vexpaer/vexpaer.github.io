---
title: "readApaper#14 Goal-directed learning in cortical organoids"
title_zh: "readApaper#14 Goal-directed learning in cortical organoids"
date: 2026-10-31 22:00:00
tags:
  - readApaper
  - neuroscience
  - biological-computing
  - organoid-intelligence
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 12–14 minutes · 31 October 2026 · Cell Reports (2026)</i>

<b>Can a cortical organoid learn to keep a pole balanced—and what exactly is being trained?</b>

Robbins and colleagues connect mouse cortical organoids to a virtual CartPole task through a high-density microelectrode array (HD-MEA). The pole angle is encoded as electrical stimulation, while recorded neural activity is decoded into a force that moves the cart. The experiment combines a fast sensorimotor loop with a slower training loop that selects additional stimulation patterns to influence the biological network.

The distinction between these two loops is the key to understanding the paper.

![Figure 1A. Two nested loops: fast CartPole control and slower adaptive training.](/img/readApaper-14/Organoid_CartPole_dual_loop.svg)

<i>Figure 1A. Two nested loops: fast CartPole control and slower adaptive training.</i>

## 1. Two loops with different jobs

The <b>fast control loop</b> runs continuously:

<b>pole angle → electrical input → organoid activity → decoded force → cart movement → new pole angle.</b>

The <b>slow training loop</b> operates after an episode ends:

<b>task performance → external learning algorithm → selection of a stimulation pattern → stimulation of the organoid → next episode.</b>

The authors organize the experiment into three phases: recording spontaneous activity to characterize the network; targeted stimulation to map stimulus–response relationships; and closed-loop training in CartPole. This sequence helps identify useful input, output, and training electrodes before running the task.

The organoid receives pole-angle information through two input units. Activity from two output units is converted into leftward or rightward force. When the pole falls beyond ±16°, the episode ends.

## 2. Who chooses the training signal?

The paper compares four conditions:

- <b>Null:</b> no additional training stimulation.
- <b>Random:</b> stimulation locations are selected randomly.
- <b>Adaptive:</b> an external reinforcement-learning algorithm selects stimulation patterns based on their estimated association with better task performance.
- <b>Continuous adaptive:</b> the adaptive strategy is applied continuously rather than in separated training/rest cycles.

The adaptive algorithm uses an eligibility trace: recently selected stimulation patterns leave a decaying record, and the algorithm updates their estimated value based on subsequent task performance. This is a digital algorithm running outside the organoid. It chooses which stimulation to deliver; it is not evidence that the organoid itself runs a reinforcement-learning algorithm.

The typical cycled protocol used 15 minutes of training followed by 45 minutes of rest. Improvements were often visible during training but were not reliably retained across the rest period.

## 3. How large was the improvement?

The authors report the proportion of <b>successful training cycles</b> as follows:

| Condition | Successful cycles |
| --- | --- |
| Null | 2.3% |
| Random | 4.5% |
| Adaptive | 23.1% |
| Continuous adaptive | 46.4% |

![Figure 1B. Successful-cycle proportions reported for the four training conditions.](/img/readApaper-14/Organoid_CartPole_training_results.svg)

<i>Figure 1B. Successful-cycle proportions reported for the four training conditions.</i>

These percentages describe cycles, not the percentage of organoids that learned the task. The study included 19 organoids from eight independent batches overall, with 16 organoids from seven batches used for CartPole training. Across the training experiments, the authors report 432 cycles and more than 125 hours of cumulative recording.

The same organoid can contribute multiple cycles. Those cycles are repeated measurements, not independent biological replicates. The authors also report that stimulation-evoked causal connectivity between selected input and output units predicts task performance better than spontaneous functional connectivity measured using STTC. This suggests that directly probing how a stimulus drives downstream activity may be more informative for configuring the interface than relying only on correlations in spontaneous activity.

## 4. What does the pharmacology tell us?

The researchers applied NBQX and APV to block AMPA/kainate and NMDA receptor-mediated glutamatergic transmission. Under receptor blockade, the training-induced performance improvement was abolished; the reported effect supports a requirement for intact glutamatergic transmission in this training paradigm.

This experiment does not isolate one specific synaptic learning rule. Blocking these receptors can affect both the network's basic ability to transmit signals and its capacity to adapt.

The study also reports that improvements generally did not persist through a 45-minute rest period. The result is best described as short-timescale, task-related adaptation rather than stable long-term memory.

## 5. What exactly happens inside one CartPole episode?

CartPole is an unstable control problem. The simulated environment is described by four state variables: cart position, cart velocity, pole angle, and pole angular velocity. At each time step, the controller chooses a horizontal force of either −10 N or +10 N. The episode ends when the pole angle exceeds ±16°, which the authors define as an unrecoverable state.

The organoid receives the pole-angle information through rate-coded stimulation of two input units. Neural activity from two output units is converted into a leftward or rightward force. The authors use short read phases of 200 or 300 ms to balance responsiveness against noisy spike counts. This is a real-time sensorimotor loop: the decoded force changes the cart state, and the new angle is encoded and sent back to the organoid.

The training signal is separate from this online control. It is delivered only after an episode ends. In the cycled protocol, a training pattern is sent when the five-episode mean performance falls below the twenty-episode mean. This design reduces the chance that the training pulse itself directly creates an apparent improvement in the same episode.

## 6. What does “successful training” mean statistically?

The authors use episode duration—the time the pole remains balanced—as the performance measure. Their primary cycle-level metric is the 90th percentile of episode duration within a training cycle. An organoid configuration is considered proficient when this value exceeds a threshold set three standard deviations above the best of five simulated random-firing baselines.

This definition is important because the headline percentages refer to <b>training cycles</b>, not independent organoids. The study includes 19 organoids from eight batches overall, with 16 organoids from seven batches used for CartPole training. Across the experiments, the authors report 432 cycles and more than 125 hours of recording. The same organoid can contribute many cycles, so cycle-level points are repeated observations.

The authors also compare connectivity measures. In proficient experiments, stimulus-evoked causal connectivity predicts performance more strongly (R² = 0.59, p \< 0.01, n = 12) than spontaneous functional connectivity measured using STTC (R² = 0.20, p = 0.14, n = 12). In practical terms, a direct perturbation test may reveal which input–output pathways can support control better than passive correlation alone.

## 7. What kind of reinforcement learning is this?

The reinforcement-learning algorithm is external. It maintains value estimates for candidate pairs of training electrodes and uses eligibility traces to remember which patterns were recently selected. The reported learning rate and trace-decay factor are both 0.3. Patterns associated with improved episode duration become more likely to be selected again.

The biological network is changed by the electrical training patterns; the digital algorithm decides which patterns to try. The organoid is not running the reinforcement-learning code, and the experiment does not use a biological dopamine signal as the reward. It is a hybrid training design in which an external optimizer searches for stimulation patterns that alter the organoid's input–output dynamics.

## 8. The limitations are part of the result

Only a minority of adaptive cycles reached the authors' proficiency threshold: 23.1% for cycled adaptive training and 46.4% for continuous adaptive training. Success depends on the chosen input, output, and training units. The authors manually select neural configurations using connectivity analysis, and they acknowledge that better configurations may have been missed.

The HD-MEA records activity from the organoid surface in contact with the array. A single electrode can contain multi-unit activity, which complicates single-neuron interpretation. The improvements also fail to persist through the 45-minute rest period, indicating short-timescale adaptation rather than durable memory.

The pharmacological result is strong evidence that glutamatergic transmission is necessary for the observed training effect, but it does not identify one precise synaptic learning rule. Blocking AMPA and NMDA receptors also disrupts ordinary signal transmission.

## My perspective

The most useful contribution of this paper is its <b>separation of control and training</b>.

A real-time controller needs to react quickly to the current state. A training algorithm can operate more slowly, evaluate the previous episode, and change the stimulation strategy for the next one. Keeping these loops distinct makes the experiment easier to interpret: does the control pathway work, does a training intervention change it, and does that change survive a rest period?

For future closed-loop organoid experiments, I would log each sensory input, decoded action, task outcome, selected stimulation pattern, and subsequent change in neural response. This would help distinguish biological adaptation from changes introduced by the external optimizer.

The limitations are instructive: the reinforcement-learning algorithm is external; the benefit is short-lived; electrode selection depends on network characterization; and the same organoid contributes repeated cycles. A strong next step would test whether a stimulation strategy selected in one session improves a later session under a frozen decoder and a pre-registered evaluation protocol.

## Takeaway

- The system has a fast sensorimotor control loop and a slower training loop.
- An external reinforcement-learning algorithm selects stimulation patterns; the organoid does not run the digital RL algorithm.
- Successful-cycle proportions were 2.3%, 4.5%, 23.1%, and 46.4% across the four conditions.
- NBQX + APV blockade abolishes training-induced improvement, supporting a role for glutamatergic transmission.
- The observed adaptation generally does not persist across a 45-minute rest period.

## References / 参考资料

- Robbins, A. et al. (2026). <i>Goal-directed learning in cortical organoids</i>. Cell Reports, 45(2), 116984. Published 24 February 2026. [https://doi.org/10.1016/j.celrep.2026.116984](https://doi.org/10.1016/j.celrep.2026.116984)
- [PubMed — published article](https://pubmed.ncbi.nlm.nih.gov/41720084/)
- [ScienceDirect — full text](https://www.sciencedirect.com/science/article/pii/S2211124726000628)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 12–14 分钟 · 2026-10-31</i>

<b>皮层类器官能不能学会保持倒立摆平衡？实验中究竟是哪一部分在接受训练？</b>

Robbins 等人通过高密度微电极阵列（HD-MEA），将小鼠皮层类器官连接到虚拟 CartPole 倒立摆任务。杆的倾斜角度被编码为电刺激，记录到的神经活动则被解码为小车受到的水平推力。整个实验同时包含一条快速感觉—运动回路，以及一条较慢的训练回路，后者根据任务表现选择额外刺激模式，尝试改变生物网络。

## 1. 两条回路分别负责什么？

<b>快速控制回路</b>持续运行：

<b>杆的角度 → 电刺激输入 → 类器官活动 → 解码推力 → 小车移动 → 新的杆角度。</b>

<b>慢速训练回路</b>在一次 episode 结束后运行：

<b>任务表现 → 外部学习算法 → 选择刺激模式 → 刺激类器官 → 下一次 episode。</b>

作者把实验分成三个阶段：先记录自发活动，了解网络状态；再通过定点刺激建立刺激—响应关系；最后才进行 CartPole 闭环训练。这样可以在正式任务前，筛选合适的输入、输出和训练电极。

类器官通过两个输入单元接收杆角度信息。两个输出单元的活动被转换为向左或向右的推力。当杆倾斜超过 ±16°，本次 episode 结束。

## 2. 谁在选择训练刺激？

论文比较了四种条件：

- <b>Null</b>：不提供额外训练刺激。
- <b>Random</b>：随机选择刺激位置。
- <b>Adaptive</b>：外部强化学习算法根据刺激模式与任务表现之间的关系选择刺激。
- <b>Continuous adaptive</b>：持续应用自适应策略，而不是分成独立的训练和休息周期。

Adaptive 算法使用资格迹（eligibility trace）：近期选中过的刺激模式会留下逐渐衰减的记录，算法再根据后续任务表现更新这些模式的估计价值。

这个强化学习算法运行在类器官外部的电脑上。它负责选择刺激模式，不能据此说类器官内部运行了强化学习算法。

常规分周期方案采用 <b>15 分钟训练、45 分钟休息</b>。性能改善往往出现在训练期间，但休息后不能稳定保留。

## 3. 性能提升有多大？

作者报告的<b>成功训练周期（successful training cycles）比例</b>如下：

| 条件 | 成功 cycle 比例 |
| --- | --- |
| Null | 2.3% |
| Random | 4.5% |
| Adaptive | 23.1% |
| Continuous adaptive | 46.4% |

这些比例描述的是 cycle，而不是学会任务的类器官比例。研究总体包含来自八个独立批次的 19 个类器官；其中 16 个类器官、来自七个批次的样本用于 CartPole 训练。训练实验合计报告 432 个 cycle，累计记录时间超过 125 小时。

同一个类器官可以贡献多个 cycle，因此这些 cycle 属于重复测量，不能当成相互独立的生物学重复。

作者还发现，输入和输出单元之间由刺激诱发的因果连接，对任务表现的预测能力高于基于自发活动和 STTC 计算的功能连接。这提示我们：直接刺激一个位置、观察它如何驱动下游活动，可能比只看自发活动之间的相关性更适合配置神经接口。

## 4. 药理实验说明了什么？

研究者使用 NBQX 和 APV 阻断 AMPA/kainate 与 NMDA 受体介导的谷氨酸能传递。在受体阻断条件下，训练诱导的性能改善消失。这支持完整的谷氨酸能传递是该训练范式产生改善的必要条件。

但这个实验不能单独定位某一种突触学习规则。阻断这些受体既会影响网络的基础信号传递，也会影响网络适应能力。

论文还报告，性能改善通常无法跨越 45 分钟休息期。因此，更准确的描述是短时间尺度、任务相关的适应，而不是稳定的长期记忆。

## 5. 一次 CartPole episode 内究竟发生什么？

CartPole 是一个不稳定控制问题。系统状态由四个变量描述：小车位置、小车速度、杆的倾斜角度和角速度。每个时间步，控制器选择向左或向右的水平推力，大小为 10 N。当杆的角度超过 ±16°，本次 episode 结束，作者将其视为无法恢复的状态。

类器官通过两个输入单元接收杆角度的频率编码刺激；两个输出单元的神经活动被转换为向左或向右的推力。作者采用 200 或 300 ms 的短读取窗口，在响应速度和 spike 计数噪声之间进行权衡。这是一条实时感觉—运动回路：解码推力改变小车状态，新的杆角度再被编码并反馈给类器官。

训练刺激与这条在线控制回路分开。它只在 episode 结束后发送。在分周期训练中，如果最近五个 episode 的平均表现低于最近二十个 episode 的平均表现，系统才会发送训练模式。这样可以降低训练电脉冲直接影响当前 episode、造成表面性能提升的可能性。

## 6. 统计上的“成功训练”是什么意思？

作者使用杆保持平衡的时间作为任务表现指标。每个训练 cycle 的主要指标是该 cycle 内 episode 时长的第 90 百分位数。如果这个值超过五组模拟随机放电基线中最佳表现的三倍标准差阈值，就认为当前神经配置达到 proficiency。

这个定义很重要：论文中的百分比指的是<b>训练 cycle</b>，不是独立类器官的比例。研究总共包含八个批次的 19 个类器官，其中 16 个类器官、来自七个批次的样本用于 CartPole 训练。作者报告了 432 个 cycle 和超过 125 小时的记录。同一个类器官可以贡献很多 cycle，因此 cycle 级别的数据属于重复观测。

作者还比较了不同连接指标。在达到 proficiency 的实验中，刺激诱发的因果连接对任务表现的预测能力更强（R² = 0.59，p \< 0.01，n = 12）；基于自发活动和 STTC 计算的功能连接则较弱（R² = 0.20，p = 0.14，n = 12）。这说明直接刺激并观察下游响应，可能比单纯分析被动相关性更有利于寻找有效的输入—输出通路。

## 7. 这里的强化学习究竟是什么？

强化学习算法运行在类器官外部。它为候选训练电极对维护价值估计，并通过资格迹记录近期选择过的刺激模式。论文报告的学习率和资格迹衰减系数均为 0.3。与 episode 时长改善相关的刺激模式，会在后续选择中获得更高概率。

生物网络通过电脉冲发生变化，数字算法负责决定尝试哪一种电脉冲。类器官并没有运行强化学习代码，实验也没有使用多巴胺等生物神经调质作为奖励信号。这是一种混合训练方案：外部优化器搜索刺激模式，尝试改变类器官的输入—输出动态。

## 8. 局限性本身也是研究结果的一部分

达到作者 proficiency 阈值的 adaptive cycle 仍然是少数：分周期 adaptive 为 23.1%，continuous adaptive 为 46.4%。实验是否成功依赖输入、输出和训练单元的选择。作者根据连接分析手动选择神经配置，也承认可能错过了更好的组合。

HD-MEA 只能记录与阵列接触的类器官表面活动；单个电极可能同时包含多个神经单元的信号，增加了单神经元解释的难度。性能改善也无法跨越 45 分钟休息期保留，因此更接近短时间尺度适应，而不是稳定记忆。

药理实验有力支持谷氨酸能传递是训练效果出现的必要条件，但不能定位某一种精确的突触学习规则。阻断 AMPA 和 NMDA 受体也会影响普通的信号传递。

## My Perspective｜我的思考

这篇论文最有价值的设计是<b>把控制和训练分开</b>。

实时控制器必须快速响应当前状态；训练算法则可以在一次 episode 结束后评价表现，再调整下一次使用的刺激策略。把两条回路分开，实验逻辑就更清楚：控制通路是否有效？训练干预是否改变了它？这种改变能否在休息后保留？

未来的闭环类器官实验可以分别记录每次感觉输入、解码动作、任务结果、被选中的刺激模式，以及之后神经响应的变化。这样才能区分生物适应和外部优化器带来的变化。

这项研究的局限同样值得借鉴：强化学习算法在外部运行，效果保持时间较短，电极选择依赖前期网络表征，而且同一个类器官会贡献多个重复 cycle。下一步可以冻结解码器，预先确定评价方案，再检验一个 session 选出的刺激策略能否改善后续 session 的表现。

## 总结

- 系统包含快速感觉—运动控制回路和较慢的训练回路。
- 外部强化学习算法选择刺激模式，类器官没有运行数字 RL 算法。
- 四种条件下的成功 cycle 比例分别为 2.3%、4.5%、23.1% 和 46.4%。
- NBQX + APV 阻断会消除训练诱导的改善，支持谷氨酸能传递的作用。
- 观察到的适应通常无法跨越 45 分钟休息期稳定保留。

---

## References / 参考资料

- Robbins, A. et al. (2026). <i>Goal-directed learning in cortical organoids</i>. Cell Reports, 45(2), 116984. Published 24 February 2026. [https://doi.org/10.1016/j.celrep.2026.116984](https://doi.org/10.1016/j.celrep.2026.116984)
- [PubMed — published article](https://pubmed.ncbi.nlm.nih.gov/41720084/)
- [ScienceDirect — full text](https://www.sciencedirect.com/science/article/pii/S2211124726000628)
