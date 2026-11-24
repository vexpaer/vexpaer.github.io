---
title: "readApaper#17 Neural Mechanisms Underlying Robust Target Selection in Response to Microstimulation of the Oculomotor System"
title_zh: "readApaper#17 Neural Mechanisms Underlying Robust Target Selection in Response to Microstimulation of the Oculomotor System"
date: 2026-11-03 22:00:00
tags:
  - readApaper
  - neuroscience
  - oculomotor-system
  - microstimulation
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 3 November 2026 · Journal of Neuroscience, 2025</i>

<b>Why can a brief pulse of electricity push an eye movement one way, yet leave overall choice strategy almost unchanged?</b> Rakhshan, Schafer, Moore and Soltani show that the oculomotor system does not treat stimulation as a fixed shove. After the pulse, choices rebound in the opposite direction, and that rebound depends on recent reward.

## 1. A gentle nudge in a circuit that aims the eyes

When you look from one point to another, your eyes make a rapid jump called a <b>saccade</b>. A cortical area called the <b>frontal eye field (FEF)</b> helps select where that jump should go. Each FEF site is especially concerned with a particular region of visual space, its <b>response field (RF)</b>. A strong enough current at that site can even force a saccade toward the RF.

<b>Microstimulation</b> is a brief electrical current delivered through a fine electrode, used to activate nearby neurons. Here the current was <b>subthreshold</b>: the same amplitude that can evoke a saccade at 200 Hz, but delivered at 60 Hz for 200 ms, starting when the targets appeared. It was not strong enough to drag the eyes by itself. The question was whether this extra activity would bias a later, voluntary choice — and what the circuit would do next.

Two male rhesus macaques chose between two visual targets by making a saccade. In stimulation sessions, one target, <b>Tin</b>, sat at the center of the FEF site’s RF (in the left hemifield for both monkeys). The other target, <b>Tout</b>, was opposite. Stimulation was delivered on a randomly chosen half of the trials (<b>MS+</b>); the remaining trials had no pulse (<b>MS−</b>). Control sessions used the same task with no stimulation. Together the monkeys completed 32 stimulation sessions (7,693 trials) and 160 control sessions.

## 2. A task that keeps changing

The juice reward was not fixed. After each correct saccade, reward followed a <b>dynamic schedule</b>: the probability of juice on Tin versus Tout depended on how often the monkey had recently chosen Tin (estimated over the previous 20 trials), on a session-wide parameter <i>r</i> that said which option was globally more rewarding, and on a penalty that could lower both probabilities. If the monkey kept choosing the currently better target, that target became less rewarding. The animal therefore had to keep tracking recent choices and outcomes, rather than repeating one memorized answer.

![Figure 1. Dynamic value-based choice task and subthreshold FEF microstimulation. Start with panel A: fixation, two grating targets (Tin inside the stimulated site’s response field, Tout opposite), a saccade, and a 200 ms pulse aligned to target onset. Panels B–D show how reward probabilities change with the recent Tin choice rate. When that rate equals the session parameter r, the two targets are equally rewarding (matching); in this schedule, matching is slightly less profitable than the true optimum.](/img/readApaper-17/p17_fig1.jpg)

<i>Figure 1. Dynamic value-based choice task and subthreshold FEF microstimulation. Start with panel A: fixation, two grating targets (Tin inside the stimulated site’s response field, Tout opposite), a saccade, and a 200 ms pulse aligned to target onset. Panels B–D show how reward probabilities change with the recent Tin choice rate. When that rate equals the session parameter r, the two targets are equally rewarding (matching); in this schedule, matching is slightly less profitable than the true optimum.</i>

## 3. A push, then a rebound

On MS+ trials, both monkeys chose Tin more often than on MS− trials in the same sessions (median difference 0.066; <i>p</i> = 2.5×10⁻⁷). MS+ trials also produced more Tin choices than control sessions (median difference 0.038). On MS− trials, Tin choices were lower than in the control condition.

The more surprising pattern appeared after a stimulated trial. On the following MS− trials, the bias reversed: the monkeys became less likely to choose Tin. That opposite bias faded over the next trials and was largely gone by about the third trial (Figure 3A). Consecutive MS+ pulses did not make the immediate Tin bias any larger, but they did make the later rebound away from Tin stronger.

Despite these trial-by-trial swings, overall Tin selection in stimulation sessions was not significantly different from control (<i>p</i> = 0.06). Harvested reward as a function of the global reward parameter also looked similar, as did the way choices tracked the reward schedule. A reinforcement-learning fit found no significant change in the discount factor that reflects how long reward history is carried forward. A pulse can change the next decision without clearly rewriting the long-run policy.

![Figure 3. Compensatory aftereffects and their interaction with reward. Panel A is the key plot: red points show the Tin bias on an MS+ trial; blue points show the bias on MS− trials one, two, or three trials later. The opposite bias shrinks toward zero. Panel B shows that more consecutive pulses enlarge the later rebound. Panels C and D compare win–stay and lose–switch after stimulated versus unstimulated trials, separately after Tin and Tout choices.](/img/readApaper-17/p17_fig3.jpg)

<i>Figure 3. Compensatory aftereffects and their interaction with reward. Panel A is the key plot: red points show the Tin bias on an MS+ trial; blue points show the bias on MS− trials one, two, or three trials later. The opposite bias shrinks toward zero. Panel B shows that more consecutive pulses enlarge the later rebound. Panels C and D compare win–stay and lose–switch after stimulated versus unstimulated trials, separately after Tin and Tout choices.</i>

## 4. What kind of circuit could produce this?

The authors built network models with three parts, shown in simplified form in the teaching schematic below (the paper’s original Figures 6 and 7 contain the full diagrams and model simulations):

- A <b>valuation circuit</b> that learns the worth of Tin and Tout from juice outcomes, using reward-dependent plastic synapses.
- An <b>FEF target-selection circuit</b>, with excitatory populations for Tin and Tout plus a shared inhibitory population. On MS+ trials this circuit receives an extra Tin input — the model of microstimulation.
- A <b>second target-selection circuit</b>, standing in for another oculomotor area such as LIP or SEF, which can partly compensate for the FEF perturbation. The two selection circuits together determine the saccade.

They compared three ideas:

- <b>No adaptation.</b> Stimulation is a fixed extra input, and the second circuit can compensate, but the model does not correctly produce a rebound that fades over a few trials.
- <b>Desensitization.</b> Stimulated Tin neurons become less sensitive after a pulse. The fade-out looks better, but the model also predicts that the immediate MS+ effect should shrink across consecutive stimulated trials, which the data did not show.
- <b>Reward-dependent adaptation.</b> The efficacy of stimulation and the endogenous value input to the FEF Tin pool adjust in opposite directions as a function of reward. This model reproduced the immediate Tin bias, the fading rebound, and the interaction with reward history.

The last account is a computational inference: it is the mechanism that best matched the behavior, not a direct recording of every synaptic change.

![Teaching schematic (self-drawn). Panel A summarizes the reported behavioral pattern: an MS+ trial biases the choice toward Tin, then the next unstimulated trials rebound away from Tin, fading by about the third trial. Panel B is a simplified view of the network, not a copy of the paper’s figures: a valuation circuit feeds two selection circuits, microstimulation adds extra Tin input in FEF, and the best-fitting model lets stimulation efficacy and value input adjust in opposite directions after reward.](/img/readApaper-17/p17_schematic.png)

<i>Teaching schematic (self-drawn). Panel A summarizes the reported behavioral pattern: an MS+ trial biases the choice toward Tin, then the next unstimulated trials rebound away from Tin, fading by about the third trial. Panel B is a simplified view of the network, not a copy of the paper’s figures: a valuation circuit feeds two selection circuits, microstimulation adds extra Tin input in FEF, and the best-fitting model lets stimulation efficacy and value input adjust in opposite directions after reward.</i>

## Why this matters

Microstimulation is often treated as a clean causal probe: add a little activity and read out a bias. These results say the probe is landing in a circuit that is still learning. The same pulse can have a different aftermath depending on recent reward, which matters whenever we try to intervene in a living decision circuit.

## Takeaway

- A subthreshold FEF pulse biases the current saccade toward Tin, but the next unstimulated choices rebound away from Tin, fading in about three trials.
- Session-wide choice, reward harvest, and learning look largely preserved.
- A network in which stimulation and reward-value signals compete through reward-dependent plasticity best accounts for this pattern.

---

## References and resources

- Rakhshan, M., Schafer, R. J., Moore, T., & Soltani, A. (2025). <i>Neural Mechanisms Underlying Robust Target Selection in Response to Microstimulation of the Oculomotor System.</i> Journal of Neuroscience, 45(3), e2356232024. [Journal article](https://doi.org/10.1523/JNEUROSCI.2356-23.2024) · [Full text and figures at PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11735662/)
- Figures 1 and 3 are from the published article. The network diagram is a self-drawn teaching schematic.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-11-03 · Journal of Neuroscience, 2025</i>

<b>为什么一次短暂的电刺激能把下一次眼动推向某个目标，却几乎不改变动物长期的选择策略？</b> Rakhshan、Schafer、Moore 与 Soltani 发现，眼动系统并不会把刺激当成一次固定的“外力推搡”。刺激结束后，选择会向相反方向回弹，而且这种回弹还取决于近期有没有得到奖励。

## 1. 在负责瞄准的回路里，轻轻推一下

当你把视线从一点移到另一点时，眼睛会做一个快速跳跃，叫做<b>眼跳（saccade）</b>。大脑皮层中的<b>额叶眼区（frontal eye field, FEF）</b>参与决定这次跳跃该朝哪里去。FEF 的每个位点都特别关心视野中的某一块区域，也就是它的<b>反应野（response field, RF）</b>。如果在该位点通入足够强的电流，甚至可以直接诱发出朝向反应野的眼跳。

<b>微电刺激（microstimulation）</b>是通过一根细电极送入的短暂电流，用来激活电极附近的神经元。这项研究使用的是<b>阈下（subthreshold）</b>刺激：电流强度与能够诱发眼跳时相同，但频率从 200 Hz 降到 60 Hz，持续 200 毫秒，并在目标出现的同时开始。这样的刺激本身还不足以把眼睛“拽”走。研究者想知道的是：这一点额外活动会不会偏转随后的主动选择，以及神经回路接下来会怎样调整。

两只雄性恒河猴通过眼跳在两个视觉目标之间做选择。在刺激会话中，一个目标 <b>Tin</b> 放在被刺激 FEF 位点反应野的中心（两只猴子都在左半视野），另一个目标 <b>Tout</b> 在对侧。随机一半试次施加刺激（<b>MS+</b>），另一半不施加（<b>MS−</b>）。对照会话使用相同任务，但完全不刺激。两只猴子一共完成了 32 个刺激会话（7,693 个试次）和 160 个对照会话。

## 2. 奖励规则一直在变

果汁奖励并不是固定的。每次正确眼跳之后，奖励按照一套<b>动态日程</b>发放：Tin 和 Tout 得到果汁的概率，取决于猴子最近选择 Tin 的频率（用此前 20 个试次估计）、会话中固定的全局参数 <i>r</i>（它决定哪一侧总体上更常得到奖励），以及一个可以同时降低两侧概率的惩罚参数。如果猴子一直选当前更好的目标，这个目标就会变得不那么值得选。因此，动物必须持续追踪近期的选择和结果，而不能只记住一个固定答案。

![Figure 1. 动态价值选择任务与阈下 FEF 微电刺激。先看 A 图：先注视，再出现两个光栅目标（Tin 在刺激位点反应野内，Tout 在对侧），猴子做一次眼跳；200 毫秒的电刺激与目标出现对齐。B–D 图说明奖励概率如何随最近的 Tin 选择率变化。当这一选择率等于会话参数 r 时，两个目标一样值得选（matching，匹配）；在这套日程里，匹配比真正的最优策略稍差一点。](/img/readApaper-17/p17_fig1.jpg)

<i>Figure 1. 动态价值选择任务与阈下 FEF 微电刺激。先看 A 图：先注视，再出现两个光栅目标（Tin 在刺激位点反应野内，Tout 在对侧），猴子做一次眼跳；200 毫秒的电刺激与目标出现对齐。B–D 图说明奖励概率如何随最近的 Tin 选择率变化。当这一选择率等于会话参数 r 时，两个目标一样值得选（matching，匹配）；在这套日程里，匹配比真正的最优策略稍差一点。</i>

## 3. 先被推过去，随后再弹回来

在 MS+ 试次中，两只猴子选择 Tin 的比例都高于同一会话里的 MS− 试次（中位差 0.066；<i>p</i> = 2.5×10⁻⁷）。与对照会话相比，MS+ 试次的 Tin 选择也更高（中位差 0.038）。而在 MS− 试次中，Tin 选择反而低于对照条件。

更出人意料的是刺激之后的变化。在紧随 MS+ 的那些 MS− 试次里，偏好反过来了：猴子更少选择 Tin。这种反向偏差会随后续试次逐渐减弱，大约到第三个试次时已基本消失（Figure 3A）。连续多个 MS+ 并不会让当下的 Tin 偏向变得更大，但会让随后远离 Tin 的回弹更强。

尽管单个试次上有明显的来回摆动，刺激会话中总体的 Tin 选择比例与对照并没有显著差异（<i>p</i> = 0.06）。总奖励随全局奖励参数变化的曲线也相近，动物追随奖励日程的方式同样如此。用强化学习模型拟合时，反映奖励历史能保留多久的折扣因子也没有显著变化。也就是说，一次脉冲可以改变下一次决定，却不必改写长期策略。

![Figure 3. 补偿性后效应及其与奖励的相互作用。请先看 A 图：红点是 MS+ 试次上对 Tin 的偏向，蓝点是刺激后第 1、2、3 个 MS− 试次上的偏向，反向偏差逐渐回到零。B 图显示，连续多个脉冲会加大随后的回弹。C、D 图则比较刺激与未刺激试次之后的 win–stay（赢了继续选）和 lose–switch（输了就换边），并按上一试次选的是 Tin 还是 Tout 分开统计。](/img/readApaper-17/p17_fig3.jpg)

<i>Figure 3. 补偿性后效应及其与奖励的相互作用。请先看 A 图：红点是 MS+ 试次上对 Tin 的偏向，蓝点是刺激后第 1、2、3 个 MS− 试次上的偏向，反向偏差逐渐回到零。B 图显示，连续多个脉冲会加大随后的回弹。C、D 图则比较刺激与未刺激试次之后的 win–stay（赢了继续选）和 lose–switch（输了就换边），并按上一试次选的是 Tin 还是 Tout 分开统计。</i>

## 4. 怎样的回路才能产生这种模式？

作者搭建了由三部分组成的网络模型。下面的示意图是为讲解简化的版本，原论文 Figure 6 和 Figure 7 提供了完整图示和模型仿真：

- <b>价值评估回路</b>：根据每次果汁结果，通过奖励依赖的可塑性突触，学习 Tin 和 Tout 各自值多少。
- <b>FEF 目标选择回路</b>：分别偏好 Tin 和 Tout 的兴奋性神经元群，再加上一组共享的抑制性神经元。在 MS+ 试次中，这个回路会多收到一份指向 Tin 的输入，用来模拟微电刺激。
- <b>第二条目标选择回路</b>：代表另一个眼动相关脑区（如 LIP 或 SEF），可以部分补偿 FEF 受到的扰动。两条选择回路共同决定最终眼跳。

他们比较了三种机制：

- <b>没有适应。</b> 刺激只是一份固定的额外输入，第二条回路可以补偿，但模型无法正确产生那种在几个试次里逐渐消退的反向回弹。
- <b>脱敏。</b> 受刺激的 Tin 神经元在脉冲之后对输入变得不那么敏感。衰减过程更接近数据，但模型还预测：连续多个 MS+ 时，当下的刺激效应会越来越弱，而实际数据并没有这一模式。
- <b>奖励依赖的适应。</b> 刺激的有效性和进入 FEF 中 Tin 神经元群的内源价值输入，会随奖励朝相反方向调整。这个模型同时再现了当下的 Tin 偏向、逐渐消退的反向回弹，以及与奖励历史的相互作用。

最后一种解释是计算层面的推断：它是最能拟合行为的机制，而不是对每一个突触变化的直接记录。

![教学示意图（自绘）。A 图概括论文报告的行为模式：MS+ 试次使选择偏向 Tin，随后未刺激的试次向远离 Tin 的方向回弹，大约到第三个试次消退。B 图是网络的简化示意，并非原论文图的复制：价值评估回路为两条选择回路提供输入，微电刺激在 FEF 中增加指向 Tin 的额外输入；拟合最好的模型让刺激有效性与价值输入在奖励之后朝相反方向调整。](/img/readApaper-17/p17_schematic.png)

<i>教学示意图（自绘）。A 图概括论文报告的行为模式：MS+ 试次使选择偏向 Tin，随后未刺激的试次向远离 Tin 的方向回弹，大约到第三个试次消退。B 图是网络的简化示意，并非原论文图的复制：价值评估回路为两条选择回路提供输入，微电刺激在 FEF 中增加指向 Tin 的额外输入；拟合最好的模型让刺激有效性与价值输入在奖励之后朝相反方向调整。</i>

## 这项研究说明了什么？

微电刺激常常被看成一种干净的因果探针：加上一点活动，再读出选择偏差。这些结果表明，探针落在的是一个仍在学习的回路。同样一次脉冲，后果会因近期奖励而不同。这一点对于理解如何干预正在做决定的神经回路很重要。

## 总结

- 阈下 FEF 刺激会让当前眼跳更偏向 Tin，但随后未刺激的选择会向远离 Tin 的方向回弹，大约三个试次后消退。
- 整个会话的选择比例、收获奖励和学习过程大体保持稳定。
- 最能解释这一现象的，是刺激信号与奖励价值信号通过奖励依赖的可塑性相互竞争的网络机制。

---

## References and resources

- Rakhshan, M., Schafer, R. J., Moore, T., & Soltani, A. (2025). <i>Neural Mechanisms Underlying Robust Target Selection in Response to Microstimulation of the Oculomotor System.</i> Journal of Neuroscience, 45(3), e2356232024. [正式发表版本](https://doi.org/10.1523/JNEUROSCI.2356-23.2024) · [PMC 全文与原图](https://pmc.ncbi.nlm.nih.gov/articles/PMC11735662/)
- Figure 1 与 Figure 3 来自发表论文；网络结构图为讲解用自绘示意图。
