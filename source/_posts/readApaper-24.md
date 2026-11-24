---
title: "readApaper#24 Goal directed closed-loop training of network bursts in cortical cultures produces improved performance and error correction over days"
title_zh: "readApaper#24 Goal directed closed-loop training of network bursts in cortical cultures produces improved performance and error correction over days"
date: 2026-11-10 22:00:00
tags:
  - readApaper
  - neuroscience
  - biological-computing
  - closed-loop
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 10 November 2026 · bioRxiv, 2026</i>

A dish of cortical neurons has no body, no senses, and no evolutionary history in that form. This paper asks whether such a network can still be trained toward a spatial goal, and whether that change is still there the next day.

## Background

If you take neurons from the cortex of a developing brain, separate them from one another, and let them grow as a thin sheet on a culture dish, the result is a <b>dissociated cortical culture</b>. The cells can still connect and become electrically active, but they are no longer part of an intact brain, and they have no inherited “job” in this new configuration. That makes them a useful testbed: whatever goal-directed behavior they can learn has to come from the tissue itself, rather than from a body, a sensory organ, or a motor pathway that evolution already shaped (Clawson et al., 2026).

Even in this simplified setting, the network is not quiet. A common pattern is a <b>network burst</b>: many neurons fire together for a short time, then the dish quiets down again. These events are not only a matter of timing. They also have a spatial structure. A burst often starts in a particular region of the dish—an initiation zone—and then spreads as a wave. Over time, a culture typically settles into a limited repertoire of such patterns, so that where activity begins can become a stable signature of that network.

Because the tissue sits on a <b>microelectrode array</b>—a grid of tiny electrodes that can both record activity and deliver electrical pulses—an experimenter can watch these bursts and respond to them in real time. That is a <b>closed-loop</b> setup: the next input depends on what the network just did. A classic example of training in culture used a similar idea in the time domain. Shahaf and Marom (2001) stimulated a network until a desired response appeared on a chosen electrode, then withdrew the stimulus; over repeated cycles the network needed fewer stimuli to produce that response. Later work embodied cultures in simulated environments, including a well-known demonstration that in vitro networks could play a simple game within a session (Kagan et al., 2022). What had remained less clear is whether training can also move the <b>spatial</b> origin of a burst, and whether any such change can be held from one day to the next, rather than only acquired in the moment.

That question matters for a practical reason. If a living network can reorganize itself around a goal when the feedback is simple, then one can try to train the tissue rather than put all of the intelligence into an external decoder. The paper discussed here is a test of that idea, using burst initiation and recovery from errors as the things the culture is asked to control.

## Problem

Two gaps motivated the study. First, learning in culture has mostly been read out as a change in when a response happens, or how often it happens. Bursts, however, also have a starting place. If that starting place has generally been treated as a fixed feature of a culture’s wiring, can closed-loop feedback move it toward a chosen side of the dish?

Second, even when a culture does improve, it is worth asking <b>how</b>. A network could learn to slip into the wrong state less often, or it could learn to leave that state more reliably once it arrives. Those are different skills. And in previous closed-loop demonstrations, acquisition has typically been measured within a single session. Whether a cultured network can hold and build on a learned objective over days was still open.

In a 2026 bioRxiv preprint, Clawson, Levin, and colleagues set out to test both questions with a deliberately simple rule, implemented on an open-source platform they call the <b>Holistic Agential Learning platform</b> (HAL).

## Method

The authors plated primary cortical neurons from embryonic day 18 Sprague Dawley rats on a MaxWell MaxTwo high-density CMOS array: 26,400 electrodes in each well, of which 1,024 can be recorded at once. About 100,000 cells were placed on each array. HAL reads incoming spikes, keeps a short sliding window of about 20 ms, and declares a burst when more than 15% of the recorded electrodes are active. For each burst it stores two locations: the <b>origin</b>, the average x position of the active electrodes when the burst first crosses threshold, and the <b>peak</b>, the average x position when activity is at its maximum. The burst is then labeled Left or Right by comparing those two positions, so the label is relative to that burst’s own peak, not to a fixed physical midline.

Feedback follows a minimal rule. In the data presented here, the goal side was the left for every trained culture. A burst that originated on the left produced no stimulation, which the authors treat as reward. A burst that originated on the right triggered an aversive, spatially distributed stimulation that continued until the next burst: biphasic pulses of 250 mV and 200 µs per phase, delivered at random intervals with a mean rate of five pulses per second, simultaneously to four electrodes in the corner quadrants of the array. The point of using the corners was to make the signal global, rather than to instruct particular neurons. When a later burst started on the goal side, the stimulation stopped.

![Figure 1. How the closed-loop training rule works. (A) Embryonic rat cortical neurons are dissociated and plated on a high-density electrode array connected to the HAL software, which decides in real time whether to stimulate. (B) Example neurons on the array (scale bar 300 µm). Stimulation is delivered as square pulses from electrodes in the four corners, as a global signal rather than a command to particular cells. (C) Example electrical traces, array-wide spiking, and the fraction of electrodes that are active during a burst. (D) A burst is detected from the array-wide spike rate; its origin (teal) is compared with its peak (grey) to classify it as Left or Right. (E) Training rule, with left as the goal: a right-origin burst starts random stimulation at about 5 pulses per second until the next burst; a left-origin burst yields no stimulation. From Clawson et al., 2026, Figure 1.](/img/readApaper-24/p24_fig1.jpg)

<i>Figure 1. How the closed-loop training rule works. (A) Embryonic rat cortical neurons are dissociated and plated on a high-density electrode array connected to the HAL software, which decides in real time whether to stimulate. (B) Example neurons on the array (scale bar 300 µm). Stimulation is delivered as square pulses from electrodes in the four corners, as a global signal rather than a command to particular cells. (C) Example electrical traces, array-wide spiking, and the fraction of electrodes that are active during a burst. (D) A burst is detected from the array-wide spike rate; its origin (teal) is compared with its peak (grey) to classify it as Left or Right. (E) Training rule, with left as the goal: a right-origin burst starts random stimulation at about 5 pulses per second until the next burst; a left-origin burst yields no stimulation. From Clawson et al., 2026, Figure 1.</i>

Each experimental day had three 20-minute phases: a pre-training baseline, a training period, and a post-training recording. Because of the software available at the time, the authors analyzed the unstimulated pre- and post-training phases, not the training period itself. The main learning scores use the pre-training phase, which asks how the culture behaves at the start of a new day, after it has been left unstimulated.

## Experiments

Ten healthy cultures were trained, from two preparations, once they had settled into a baseline, typically after 21 days in vitro. Not every culture started at the same age, so results are aligned by <b>adjusted training day</b>, counted from each culture’s first training day. Each culture was trained on upwards of seven days, depending on its development and viability. Six unstimulated sister cultures from the first preparation served as controls. Those controls were recorded earlier (days 12 to 26 in vitro) than the trained cultures (days 30 to 42), and they already differed at baseline in several burst properties. A third, separate preparation provided six <b>damaged</b> cultures, analyzed only in the final comparison and never pooled with the main cohort. The damage was accidental: a manufacturing fluke caused neurons to die along the edge of the array. These cultures still produced bursts.

Because controls never had a true goal, the authors could not score them the same way as trained cultures without making a choice. They therefore assigned left or right as a “coin-flip” goal in all 64 possible ways and, for the learning curves, also averaged over random assignments. That range is used as a chance-level baseline, not as a perfectly age-matched comparison.

The central score is the <b>fraction correct</b>: the share of bursts that started on the goal side. A paired test (Wilcoxon signed-rank) asks whether the same cultures changed from their first training day to their last. A two-group test (Mann-Whitney) asks whether trained and control cultures differ. To ask when a change accrued, the authors separated the shift <b>within a session</b> (pre-training to post-training on the same day) from the shift <b>across days</b> (the end of one day to the unstimulated start of the next). They also treated each burst as a state—correct or incorrect—and estimated two transition probabilities: <b>recovery</b>, the chance of a correct burst after an incorrect one, and the complementary <b>error</b> transition, the chance of slipping from a correct burst into an incorrect one. Finally, they asked whether the origin, the peak, or both moved toward the goal, and whether the mix of propagation directions changed. The unit of analysis throughout is the culture, not the individual burst.

## Results

### Goal-side bursting over days

In the unstimulated pre-training period, trained cultures increased their fraction correct within roughly two days and then stabilized near 70–80% (Figure 2A). Comparing each culture’s first training day with its last, performance increased (Wilcoxon W = 5.0, p = 0.019, n = 10). The typical first-to-last gain was about 20 percentage points. Unstimulated controls did not improve over a comparable window (W = 9.0, p = 0.844).

A direct trained-versus-control comparison of that first-to-last change was nominally significant (Mann-Whitney U = 51, p = 0.022). Across all 64 ways of assigning a goal side to the controls, however, the difference reached significance in only 23% of assignments, with a median p of 0.18. The authors therefore treat this between-group contrast as a supporting comparison, and rest the learning claim on the tests that do not depend on how a goal is assigned to controls.

When the same trained cultures were split into within-day and across-day change, the across-day term was larger and statistically significant (W = 0.0, p = 0.002, n = 10). The corresponding trained-versus-control comparison of across-day change went in the same direction but did not reach significance (U = 48.0, p = 0.056).

![Figure 2. Performance improved across days more than within a session. (A) Fraction of bursts originating on the goal side during the unstimulated pre-training period, aligned by adjusted training day. Trained cultures (blue) rise within about two days and then level off; the grey band shows the range of control scores across all 64 ways of assigning a goal side to the six unstimulated cultures. (B) Each trained culture on its first versus last day: performance increased (the paper reports Wilcoxon W = 5.0, p = 0.019, n = 10). (C) Change from first to last day, trained versus control. The nominal contrast is p = 0.022, but this comparison is sensitive to how a goal is assigned to controls. (D) For trained cultures, the change between days is larger than the change within a session (W = 0.0, p = 0.002). From Clawson et al., 2026, Figure 2.](/img/readApaper-24/p24_fig2.jpg)

<i>Figure 2. Performance improved across days more than within a session. (A) Fraction of bursts originating on the goal side during the unstimulated pre-training period, aligned by adjusted training day. Trained cultures (blue) rise within about two days and then level off; the grey band shows the range of control scores across all 64 ways of assigning a goal side to the six unstimulated cultures. (B) Each trained culture on its first versus last day: performance increased (the paper reports Wilcoxon W = 5.0, p = 0.019, n = 10). (C) Change from first to last day, trained versus control. The nominal contrast is p = 0.022, but this comparison is sensitive to how a goal is assigned to controls. (D) For trained cultures, the change between days is larger than the change within a session (W = 0.0, p = 0.002). From Clawson et al., 2026, Figure 2.</i>

### Recovery from errors

The authors then asked whether training changed how the network moved between correct and incorrect bursts. The fraction of time spent in the correct state trended upward, but the first-to-last change did not separate from controls (U = 43, p = 0.18). Recovery did. Trained cultures became progressively better at leaving the incorrect state, and the first-to-last change in recovery was larger than in controls (U = 46; one-sided p = 0.013 for the planned direction, two-sided p = 0.026; n = 9 trained, 6 control). One trained culture could not be included, because it lacked a valid late-day estimate. This recovery contrast remained significant in 72% of the 64 control goal assignments, with a median two-sided p of 0.034. The authors call it the most robust trained-versus-control result in the study.

The complementary error transition did not change (U = 22, p = 0.43) and was significant in 0% of those assignments. Training was therefore associated with better recovery from errors, not with a lower rate of falling into them.

![Figure 3. Training changed recovery from errors more than the rate of entering them. (A) Each burst is treated as a correct or incorrect state, and the arrows are the probabilities of moving between those states. (B) Time spent in the correct state trends upward in trained cultures, but the first-to-last change does not differ from controls (U = 43, p = 0.18). (C) The probability of moving from an incorrect burst to a correct one rises over days in trained cultures; this first-to-last change is the most robust trained-versus-control difference in the study (one-sided p = 0.013; the panel shows the two-sided p = 0.026). (D) Cultures that became stickier in the correct state were also the ones whose recovery improved; the authors treat this as internal coherence between related measures. (E) The probability of slipping from a correct burst into an incorrect one does not differ between groups (U = 22, p = 0.43). From Clawson et al., 2026, Figure 3.](/img/readApaper-24/p24_fig3.jpg)

<i>Figure 3. Training changed recovery from errors more than the rate of entering them. (A) Each burst is treated as a correct or incorrect state, and the arrows are the probabilities of moving between those states. (B) Time spent in the correct state trends upward in trained cultures, but the first-to-last change does not differ from controls (U = 43, p = 0.18). (C) The probability of moving from an incorrect burst to a correct one rises over days in trained cultures; this first-to-last change is the most robust trained-versus-control difference in the study (one-sided p = 0.013; the panel shows the two-sided p = 0.026). (D) Cultures that became stickier in the correct state were also the ones whose recovery improved; the authors treat this as internal coherence between related measures. (E) The probability of slipping from a correct burst into an incorrect one does not differ between groups (U = 22, p = 0.43). From Clawson et al., 2026, Figure 3.</i>

### Where bursts start, and which patterns remain

In trained cultures, the mean burst origin moved toward the goal side (one-sided Wilcoxon W = 46, p = 0.032, n = 10), while the burst peak did not (W = 18, p = 0.375). The origin shift was also larger than the peak shift (paired W = 3, p = 0.010). Controls showed neither an origin shift (W = 8, p = 0.69) nor a preference for moving the origin over the peak (W = 5, p = 0.31, n = 6). The diversity of origin-to-peak directions did not differ between trained and control cultures. A direct trained-versus-control comparison of the raw origin shift itself did not reach significance (U = 41, p = 0.26), so this spatial conclusion rests on the within-trained dissociation of origin from peak, together with the control.

![Figure 4. Burst origins moved toward the goal side, while burst peaks and the mix of propagation directions did not. (A) Example cultures, with each arrow pointing from a burst’s origin to its peak (peaks aligned at the origin). A trained culture’s later bursts (warmer colors) are redirected toward the goal. (B) Both groups keep a concentrated set of propagation directions (cosine similarity near +1). (C) Origin-electrode density for one trained culture across days: the mass shifts toward the left (goal) side. (D) In trained cultures, the mean origin moves toward the goal (one-sided p = 0.032) while the peak does not (p = 0.375). (E) Control cultures show no such origin-over-peak preference. From Clawson et al., 2026, Figure 4.](/img/readApaper-24/p24_fig4.jpg)

<i>Figure 4. Burst origins moved toward the goal side, while burst peaks and the mix of propagation directions did not. (A) Example cultures, with each arrow pointing from a burst’s origin to its peak (peaks aligned at the origin). A trained culture’s later bursts (warmer colors) are redirected toward the goal. (B) Both groups keep a concentrated set of propagation directions (cosine similarity near +1). (C) Origin-electrode density for one trained culture across days: the mass shifts toward the left (goal) side. (D) In trained cultures, the mean origin moves toward the goal (one-sided p = 0.032) while the peak does not (p = 0.375). (E) Control cultures show no such origin-over-peak preference. From Clawson et al., 2026, Figure 4.</i>

Cultures whose baseline preference already matched the goal (with-bias, n = 6) started near 0.71 correct and ended near 0.79. Cultures trained against their baseline preference (against-bias, n = 4) started near 0.31 and ended near 0.67. The two groups began far apart (U = 24, p = 0.0095) and were no longer distinguishable on the last day (U = 17, p = 0.35). The paper does not claim that training works better against a culture’s bias; the two groups simply converged toward a similar band. Improvement was not significantly associated with how much stimulation a culture received, how many training-phase bursts it produced, or what fraction of bursts were stimulated, though those tests were underpowered.

### Damaged cultures that still burst

Damaged cultures, which continued to burst, did not show a consistent first-to-last increase (W = 8, p = 0.69, n = 6). Their mean fraction correct went from 0.59 to 0.56. They also lacked the across-day consolidation-like pattern (W = 9, p = 0.84). Direct healthy-versus-damaged group tests were not significant (effect size U = 40, p = 0.313; group-by-day interaction p = 0.111). Burst count, inter-burst interval, and burst duration were statistically indistinguishable from those of healthy cultures (burst count U = 21, p = 0.26). The authors therefore rest this contrast on the within-group tests: on average, healthy cultures improved across days, and these damaged cultures did not, even though their burst statistics looked similar.

![Figure 6. Healthy cultures showed the across-day training signature; damaged bursting cultures did not. (A) Example microscopy of damaged tissue, in which neurons had died along the edge of the array. (B) Fraction correct over adjusted training days: healthy cultures improve, damaged cultures stay near chance. The direct group comparison in this panel is not statistically significant, so the authors rest the claim on the within-group tests in (C). (C) First versus last day: healthy cultures improve (W = 5, p = 0.019); damaged cultures do not (W = 8, p = 0.69; mean 0.59 to 0.56). (D) Per-culture change, healthy versus damaged, is not a significant between-group contrast. (E) Healthy cultures show a larger change between days than within a day (W = 0, p = 0.002); damaged cultures do not (W = 9, p = 0.84). (F) Burst counts are statistically indistinguishable between the two groups. From Clawson et al., 2026, Figure 6.](/img/readApaper-24/p24_fig6.jpg)

<i>Figure 6. Healthy cultures showed the across-day training signature; damaged bursting cultures did not. (A) Example microscopy of damaged tissue, in which neurons had died along the edge of the array. (B) Fraction correct over adjusted training days: healthy cultures improve, damaged cultures stay near chance. The direct group comparison in this panel is not statistically significant, so the authors rest the claim on the within-group tests in (C). (C) First versus last day: healthy cultures improve (W = 5, p = 0.019); damaged cultures do not (W = 8, p = 0.69; mean 0.59 to 0.56). (D) Per-culture change, healthy versus damaged, is not a significant between-group contrast. (E) Healthy cultures show a larger change between days than within a day (W = 0, p = 0.002); damaged cultures do not (W = 9, p = 0.84). (F) Burst counts are statistically indistinguishable between the two groups. From Clawson et al., 2026, Figure 6.</i>

## Analysis

The strongest evidence that training changed the cultures is internal to the trained group: the same dishes produced a higher fraction of goal-side bursts on the last day than on the first, and that gain showed up mainly between sessions rather than during a single 20-minute recording. The authors describe this as consolidation-like, as a statement about timescale. They did not test a sleep or replay mechanism.

The comparison with unstimulated controls is more uneven, and it has to be read with the design in mind. Controls had no true goal and were recorded at a younger age, with different baseline burst properties. The first-to-last improvement in fraction correct is therefore only a partial between-group contrast. What does separate the groups more reliably is recovery: trained cultures became better at returning to a correct burst after an incorrect one, while the rate of entering the incorrect state stayed flat. That is a change in how the network handles an error, not only in how often it is already correct.

The spatial results point in the same direction. Training was associated with a shift in where bursts begin, over a preserved set of propagation directions, rather than with a new family of patterns or a movement of the burst peak. The authors read this as a simple form of niche construction: the tissue keeps a trace of its history that reweights the patterns it already had. That is an interpretation of the observed reweighting, not a direct measurement of synapses or other substrate variables.

The damaged cultures add a further boundary in the data, if not a definitive between-group proof. They still burst, and their burst counts and timing looked ordinary, but they did not show the across-day gain. Spontaneous bursting, in this experiment, was not enough on its own.

Taken together, the study identifies burst initiation and error recovery as variables that a dissociated cortical network can be trained to reorganize, using a global feedback rule that leaves the tissue to find a solution.

## Summary

- A simple closed-loop rule—stimulate after a burst that starts off the goal side, and withhold stimulation when it starts on the goal side—was enough for rat cortical cultures (n = 10) to increase goal-side burst initiation over days, with the gain appearing between sessions rather than within one session.
- The most robust difference from unstimulated controls (n = 6) was improved recovery from incorrect bursts, not a lower rate of entering those states. Burst origins moved toward the goal, while burst peaks and the repertoire of propagation directions were preserved.
- Damaged cultures that still burst (n = 6) showed neither the across-day gain nor the between-session pattern. The paper’s claim is that the tissue, not an elaborate decoder, can be the thing that is trained.

---

## References and resources

- Clawson, W., Grasso, C., Palmer, S., Meng, S., Wu, N., Sullivan, T., & Levin, M. (2026). <i>Goal directed closed-loop training of network bursts in cortical cultures produces improved performance and error correction over days.</i> bioRxiv. Preprint, posted 2026-10-27 (version 2). [doi.org/10.64898/2026.10.15.759184](https://doi.org/10.64898/2026.10.15.759184) · [Full text](https://www.biorxiv.org/content/10.64898/2026.10.15.759184v2)
- Shahaf, G., & Marom, S. (2001). <i>Learning in networks of cortical neurons.</i> The Journal of Neuroscience, 21(22), 8782–8788. [doi.org/10.1523/JNEUROSCI.21-22-08782.2001](https://doi.org/10.1523/JNEUROSCI.21-22-08782.2001)
- Kagan, B. J., Kitchen, A. C., Tran, N. T., et al. (2022). <i>In vitro neurons learn and exhibit sentience when embodied in a simulated game-world.</i> Neuron, 110(23), 3952–3969. [doi.org/10.1016/j.neuron.2022.09.001](https://doi.org/10.1016/j.neuron.2022.09.001)
- Figures 1, 2, 3, 4, and 6 are from Clawson et al. (2026).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-10 · bioRxiv, 2026</i>

一盘皮层神经元没有身体、没有感官，也没有以这种形态留下来的进化历史。这篇论文问的是：这样的网络是否仍能被训练去追求一个空间上的目标，以及这种变化到了第二天是否还在。

## 背景

如果把发育中大脑皮层里的神经元取出来，彼此分开，再让它们在培养皿里长成一层薄片，得到的就是<b>解离皮层培养</b>。细胞仍然可以互相连接并产生电活动，但它们不再属于一个完整的大脑，在这种新的配置里也没有现成的“职责”。正因为如此，它们很适合作为一个试验台：如果它们还能学会某种目标导向的行为，这种能力就更可能来自组织本身，而不是来自身体、感觉器官，或进化已经塑造好的运动通路（Clawson 等, 2026）。

即便在这种简化的环境里，网络也并不安静。一种常见的模式是<b>网络爆发</b>（network burst）：许多神经元在短时间内一起发放，随后整盘又安静下来。这些事件不仅有时间结构，也有空间结构。一次爆发往往从培养皿上的某个区域开始——也就是起始区——再像波一样传开。随着时间推移，一个培养通常会稳定出有限的几种这类模式，于是活动从哪里开始，可以成为这个网络相当稳定的特征。

因为组织长在<b>微电极阵列</b>上——一块既能记录活动、又能给出电脉冲的微小电极网格——实验者可以看着这些爆发，并在实时中做出反应。这就是<b>闭环</b>：下一次输入取决于网络刚刚做了什么。培养训练的一个经典例子，是在时间维度上使用类似的想法。Shahaf 和 Marom（2001）会持续刺激网络，直到选定电极上出现想要的反应，然后撤回刺激；经过反复循环，网络只需要更少的刺激就能给出那个反应。后来的工作把培养放进模拟环境里，其中包括一个著名的演示：离体网络可以在单次实验里学会玩一个简单游戏（Kagan 等, 2022）。当时仍不太清楚的是，训练能不能也移动一次爆发的<b>空间</b>起点，以及这种变化能否从一天保持到下一天，而不仅仅是在当时学会。

这个问题有一个很实际的含义。如果反馈足够简单，活的网络就能围绕一个目标自我重组，那么就可以尝试训练组织本身，而不是把全部智能放进外部的解码器。本文讨论的研究，正是在检验这一想法，并把爆发的起始位置，以及从错误中恢复，当作培养被要求去控制的变量。

## 问题

这项研究由两个缺口推动。第一，培养中的学习，大多被读成“反应何时出现”或“出现得有多频繁”。可是爆发还有一个起点。如果这个起点常常被看作培养接线里的固定特征，闭环反馈能不能把它推向培养皿上选定的一侧？

第二，即便培养确实提高了，也还值得问<b>它是怎样提高的</b>。网络可以学会更少掉进错误状态，也可以学会一旦到了那里，再更可靠地离开。这是两种不同的能力。而且在此前的闭环演示里，习得通常是在单次实验内部测量的。培养出的网络能否把学到的目标保持并在多天里继续积累，当时仍是开放的。

在 2026 年的一篇 bioRxiv 预印本里，Clawson、Levin 和同事用一条刻意保持简单的规则来检验这两个问题。他们把它实现在一个开源平台上，称为 <b>Holistic Agential Learning platform</b>（HAL，整体能动学习平台）。

## 方法

作者把胚胎第 18 天 Sprague Dawley 大鼠的原代皮层神经元种在 MaxWell MaxTwo 高密度 CMOS 阵列上：每个孔有 26,400 个电极，其中可以同时记录 1,024 个。每个阵列大约种了 10 万个细胞。HAL 读取到来的锋电位，保留大约 20 毫秒的短滑动窗口，当超过 15% 的记录电极处于活跃状态时，就宣布一次爆发。对每次爆发，它记录两个位置：<b>起点</b>，也就是刚越过阈值时活跃电极的平均 x 坐标；以及<b>峰值</b>，也就是活动最强时的平均 x 坐标。然后用这两个位置的比较来给爆发贴上“左”或“右”的标签，所以这个标签是相对于该次爆发自己的峰值，而不是一条固定的物理中线。

反馈遵循一条很简的规则。在本文给出的数据里，所有训练培养的目标侧都是左侧。从左侧起始的爆发不给刺激，作者把它当作奖励。从右侧起始的爆发则会触发一种厌恶的、空间上分散的刺激，并持续到下一次爆发：双相脉冲，幅度 250 mV，每相 200 µs，以平均每秒 5 次的随机间隔，同时送到阵列四个角落象限中的电极。使用角落的意图，是让这个信号成为全局信号，而不是去指令特定神经元。当后来的爆发从目标侧开始时，刺激停止。

![图 1. 闭环训练规则如何运作。(A) 胚胎大鼠皮层神经元被解离后种在高密度电极阵列上，连接到 HAL 软件，由软件实时决定是否刺激。(B) 阵列上的神经元示例（标尺 300 µm）。刺激是从四个角落的电极给出的方波脉冲，作为覆盖整块组织的全局信号，而不是对特定细胞的指令。(C) 示例电信号、整盘发放，以及一次爆发中活跃电极的比例。(D) 系统根据全阵列发放率检出爆发，并把起点（青色）与峰值位置（灰色）比较，从而判定是左侧还是右侧爆发。(E) 训练规则以左侧为目标：右侧起点的爆发会启动大约每秒 5 次的随机刺激，直到下一次爆发；左侧起点的爆发不给刺激。取自 Clawson 等，2026，Figure 1。](/img/readApaper-24/p24_fig1.jpg)

<i>图 1. 闭环训练规则如何运作。(A) 胚胎大鼠皮层神经元被解离后种在高密度电极阵列上，连接到 HAL 软件，由软件实时决定是否刺激。(B) 阵列上的神经元示例（标尺 300 µm）。刺激是从四个角落的电极给出的方波脉冲，作为覆盖整块组织的全局信号，而不是对特定细胞的指令。(C) 示例电信号、整盘发放，以及一次爆发中活跃电极的比例。(D) 系统根据全阵列发放率检出爆发，并把起点（青色）与峰值位置（灰色）比较，从而判定是左侧还是右侧爆发。(E) 训练规则以左侧为目标：右侧起点的爆发会启动大约每秒 5 次的随机刺激，直到下一次爆发；左侧起点的爆发不给刺激。取自 Clawson 等，2026，Figure 1。</i>

每个实验日分成三个 20 分钟阶段：训前基线、训练期，以及训后记录。受当时软件条件限制，作者分析的是没有刺激的训前和训后阶段，而不是训练期本身。主要的学习分数使用训前阶段，问的是：培养在新的一天开始、并已经离开刺激之后，自己会怎么表现。

## 实验

10 个健康培养接受了训练，来自两个制备批次。它们在活动稳定后开始训练，通常是体外培养 21 天之后。并不是所有培养都在同一天龄起步，所以结果按<b>调整后的训练日</b>对齐，从每个培养自己的第一个训练日算起。根据发育和活力，每个培养训练了七天以上。对照是第一批制备中 6 个未受刺激的姐妹培养。这些对照的记录时间更早（体外第 12 到 26 天），训练组则在第 30 到 42 天，而且它们在基线的若干爆发特征上已经不同。第三批、单独的制备提供了 6 个<b>受损</b>培养，只用于最后的比较，从不和主队列合并。损伤是意外发生的：一次制作上的偶然，使神经元沿阵列边缘死亡。这些培养仍然能产生爆发。

因为对照从来没有真正的目标，作者不能在不做选择的情况下，用和训练组完全一样的方式给它们打分。于是他们用“抛硬币”的方式，把左或右作为目标，穷尽全部 64 种分配，并在学习曲线上对随机分配取平均。这个范围被当作随机水平的基线，而不是年龄完全匹配的对照。

核心分数是<b>正确比例</b>：从目标侧起始的爆发占多少。配对检验（Wilcoxon 符号秩检验）问的是：同一个培养从第一个训练日到最后一日，有没有变化。两组检验（Mann-Whitney）问的是：训练组和对照组是否不同。为了问变化是什么时候积累的，作者把<b>同一场内</b>的变化（同一天的训前到训后）和<b>跨日</b>的变化（一天结束到第二天无刺激的开始）分开。他们还把每一次爆发看成一个状态——正确或错误——并估计两种转移概率：<b>恢复</b>，也就是错误爆发之后出现正确爆发的机会；以及互补的<b>出错</b>转移，也就是从正确爆发滑向错误爆发的机会。最后，他们问起点、峰值，或两者是否移向了目标，以及传播方向的种类有没有改变。全文的分析单位都是培养，而不是单次爆发。

## 结果

### 多日里的目标侧爆发

在无刺激的训前记录中，训练培养的正确比例大约在两天内上升，随后稳定在 70–80% 附近（图 2A）。比较每个培养的第一个训练日和最后一日，成绩提高了（Wilcoxon W = 5.0，p = 0.019，n = 10）。第一天到最后一天的典型增益约为 20 个百分点。未刺激对照在可比窗口内没有提高（W = 9.0，p = 0.844）。

把这一第一天到最后一天的变化直接拿来做训练组对对照组的比较，名义上是显著的（Mann-Whitney U = 51，p = 0.022）。可是，在给对照分配目标侧的全部 64 种方式里，这一差异只在 23% 的分配中达到显著，中位 p 为 0.18。因此作者把这一组间对比当作辅助比较，而把学习主张放在那些不依赖于如何给对照分配目标的检验上。

当把同样这些训练培养拆成同一天内的变化和跨日变化时，跨日项更大，并且统计显著（W = 0.0，p = 0.002，n = 10）。相应的训练组对对照组的跨日比较方向相同，但没有达到显著（U = 48.0，p = 0.056）。

![图 2. 成绩的提高主要出现在不同天之间，而不是同一场实验内部。(A) 在无刺激的训前记录里，爆发从目标侧起始的比例，按调整后的训练日对齐。训练组（蓝色）大约两天内上升，随后趋于平稳；灰色带表示给 6 个未刺激对照分配目标侧的全部 64 种方式下，对照分数的范围。(B) 每个训练培养在第一天与最后一天的比较：成绩显著提高（论文报告 Wilcoxon W = 5.0，p = 0.019，n = 10）。(C) 第一天到最后一天的变化，训练组对对照组。名义上 p = 0.022，但这一比较会随如何给对照分配目标侧而变化。(D) 在训练组中，跨日变化大于同一场内的变化（W = 0.0，p = 0.002）。取自 Clawson 等，2026，Figure 2。](/img/readApaper-24/p24_fig2.jpg)

<i>图 2. 成绩的提高主要出现在不同天之间，而不是同一场实验内部。(A) 在无刺激的训前记录里，爆发从目标侧起始的比例，按调整后的训练日对齐。训练组（蓝色）大约两天内上升，随后趋于平稳；灰色带表示给 6 个未刺激对照分配目标侧的全部 64 种方式下，对照分数的范围。(B) 每个训练培养在第一天与最后一天的比较：成绩显著提高（论文报告 Wilcoxon W = 5.0，p = 0.019，n = 10）。(C) 第一天到最后一天的变化，训练组对对照组。名义上 p = 0.022，但这一比较会随如何给对照分配目标侧而变化。(D) 在训练组中，跨日变化大于同一场内的变化（W = 0.0，p = 0.002）。取自 Clawson 等，2026，Figure 2。</i>

### 从错误中恢复

作者接着问，训练有没有改变网络在正确和错误爆发之间的移动方式。停留在正确状态的时间有上升趋势，但第一天到最后一天的变化与对照分不开（U = 43，p = 0.18）。恢复则分得开。训练培养越来越善于离开错误状态，而且恢复的第一天到最后一天变化大于对照（U = 46；预先设定方向的单侧 p = 0.013，双侧 p = 0.026；训练组 n = 9，对照 n = 6）。有一个训练培养没有被纳入，因为它缺少有效的后期估计。这一恢复对比在 64 种对照目标分配里的 72% 仍然显著，中位双侧 p 为 0.034。作者把它称为全文中训练组与对照组之间最稳健的结果。

互补的出错转移没有变化（U = 22，p = 0.43），在这些分配里显著的比例是 0%。因此，训练相关的是更好地从错误中恢复，而不是更少掉进错误。

![图 3. 训练改变的是从错误中恢复，而不是掉进错误的频率。(A) 每一次爆发被看作正确或错误状态，箭头是在两种状态之间转移的概率。(B) 训练组停留在正确状态的时间有上升趋势，但第一天到最后一天的变化与对照没有差别（U = 43，p = 0.18）。(C) 训练组中，从错误爆发转到正确爆发的概率随天数上升；这一第一天到最后一天的变化，是全文中训练组与对照组之间最稳健的差异（单侧 p = 0.013；图中标注的是双侧 p = 0.026）。(D) 在正确状态上变得更“黏”的培养，也是恢复提高更多的那些；作者把它看作两个相关指标之间的内部一致性。(E) 从正确爆发滑向错误爆发的概率，两组没有差别（U = 22，p = 0.43）。取自 Clawson 等，2026，Figure 3。](/img/readApaper-24/p24_fig3.jpg)

<i>图 3. 训练改变的是从错误中恢复，而不是掉进错误的频率。(A) 每一次爆发被看作正确或错误状态，箭头是在两种状态之间转移的概率。(B) 训练组停留在正确状态的时间有上升趋势，但第一天到最后一天的变化与对照没有差别（U = 43，p = 0.18）。(C) 训练组中，从错误爆发转到正确爆发的概率随天数上升；这一第一天到最后一天的变化，是全文中训练组与对照组之间最稳健的差异（单侧 p = 0.013；图中标注的是双侧 p = 0.026）。(D) 在正确状态上变得更“黏”的培养，也是恢复提高更多的那些；作者把它看作两个相关指标之间的内部一致性。(E) 从正确爆发滑向错误爆发的概率，两组没有差别（U = 22，p = 0.43）。取自 Clawson 等，2026，Figure 3。</i>

### 爆发从哪里开始，哪些模式还在

在训练培养中，爆发的平均起点移向了目标侧（单侧 Wilcoxon W = 46，p = 0.032，n = 10），峰值则没有移动（W = 18，p = 0.375）。起点的移动也大于峰值的移动（配对 W = 3，p = 0.010）。对照既没有起点移动（W = 8，p = 0.69），也没有“起点动、峰值不动”的偏好（W = 5，p = 0.31，n = 6）。从起点到峰值的方向多样性，在训练组和对照组之间没有差别。把原始的起点移动直接做训练组对对照组比较，没有达到显著（U = 41，p = 0.26），所以这一空间结论依据的是训练组内部“起点与峰值分开”的结果，再加上对照。

![图 4. 爆发起点移向了目标侧，但爆发峰值和传播方向的种类没有跟着改变。(A) 示例培养，每支箭头从一次爆发的起点指向峰值（峰值对齐到原点）。训练培养较晚的爆发（偏暖色）被转向目标侧。(B) 两组的传播方向仍然集中（余弦相似度接近 +1）。(C) 一个训练培养在不同天的起点电极密度：质量向左（目标）侧移动。(D) 在训练组中，平均起点移向目标（单侧 p = 0.032），峰值则没有移动（p = 0.375）。(E) 对照组没有这种“起点动、峰值不动”的偏好。取自 Clawson 等，2026，Figure 4。](/img/readApaper-24/p24_fig4.jpg)

<i>图 4. 爆发起点移向了目标侧，但爆发峰值和传播方向的种类没有跟着改变。(A) 示例培养，每支箭头从一次爆发的起点指向峰值（峰值对齐到原点）。训练培养较晚的爆发（偏暖色）被转向目标侧。(B) 两组的传播方向仍然集中（余弦相似度接近 +1）。(C) 一个训练培养在不同天的起点电极密度：质量向左（目标）侧移动。(D) 在训练组中，平均起点移向目标（单侧 p = 0.032），峰值则没有移动（p = 0.375）。(E) 对照组没有这种“起点动、峰值不动”的偏好。取自 Clawson 等，2026，Figure 4。</i>

基线偏好已经与目标一致的培养（顺偏好，n = 6）从大约 0.71 的正确比例开始，结束时约 0.79。逆着基线偏好训练的培养（逆偏好，n = 4）从大约 0.31 开始，结束时约 0.67。两组一开始差得很远（U = 24，p = 0.0095），到最后一天已经无法区分（U = 17，p = 0.35）。论文并不声称“逆着偏好训练效果更好”；只是两组收敛到了相近的区间。培养的提高，与它接受了多少刺激、训练期产生了多少爆发、或有多大比例的爆发被刺激，都没有显著关联，不过这些检验的统计功效不足。

### 仍然能爆发的受损培养

仍然能爆发的受损培养，没有表现出一致的第一天到最后一天提高（W = 8，p = 0.69，n = 6）。它们的平均正确比例从 0.59 降到 0.56，也没有跨日的巩固样模式（W = 9，p = 0.84）。健康对受损的直接组间检验不显著（效应量 U = 40，p = 0.313；组别与训练日的交互 p = 0.111）。爆发次数、爆发间隔和爆发持续时间，与健康培养在统计上无法区分（爆发次数 U = 21，p = 0.26）。因此作者把这一对比放在组内检验上：平均而言，健康培养在多日里提高了，这些受损培养没有，尽管它们的爆发统计看起来相似。

![图 6. 健康培养出现了跨日训练的迹象，仍能爆发的受损培养则没有。(A) 受损组织的显微镜示例：神经元沿阵列边缘死亡。(B) 调整训练日上的正确比例：健康培养提高，受损培养接近随机。这一面板里的组间直接比较未达到统计显著，因此作者把结论放在 (C) 的组内检验上。(C) 第一天对最后一天：健康培养提高（W = 5，p = 0.019）；受损培养没有（W = 8，p = 0.69；均值从 0.59 到 0.56）。(D) 每个培养的变化，健康对受损，不是显著的组间差异。(E) 健康培养的跨日变化大于同一天内的变化（W = 0，p = 0.002）；受损培养没有这一模式（W = 9，p = 0.84）。(F) 两组的爆发次数在统计上无法区分。取自 Clawson 等，2026，Figure 6。](/img/readApaper-24/p24_fig6.jpg)

<i>图 6. 健康培养出现了跨日训练的迹象，仍能爆发的受损培养则没有。(A) 受损组织的显微镜示例：神经元沿阵列边缘死亡。(B) 调整训练日上的正确比例：健康培养提高，受损培养接近随机。这一面板里的组间直接比较未达到统计显著，因此作者把结论放在 (C) 的组内检验上。(C) 第一天对最后一天：健康培养提高（W = 5，p = 0.019）；受损培养没有（W = 8，p = 0.69；均值从 0.59 到 0.56）。(D) 每个培养的变化，健康对受损，不是显著的组间差异。(E) 健康培养的跨日变化大于同一天内的变化（W = 0，p = 0.002）；受损培养没有这一模式（W = 9，p = 0.84）。(F) 两组的爆发次数在统计上无法区分。取自 Clawson 等，2026，Figure 6。</i>

## 分析

说明训练改变了这些培养的最强证据，来自训练组内部：同样这些培养皿，最后一天的目标侧爆发比例高于第一天，而且这一增益主要出现在不同场次之间，而不是在单次 20 分钟记录里。作者把这称为类似巩固的现象，说的是时间尺度。他们并没有检验睡眠或重放机制。

与未刺激对照的比较更不整齐，阅读时需要带着实验设计一起看。对照没有真正的目标，记录年龄也更小，基线爆发特征已经不同。因此，正确比例从第一天到最后一天的提高，只是部分意义上的组间对比。更能把两组分开的，是恢复：训练培养在错误爆发之后，更善于回到正确爆发，而进入错误状态的速率保持平坦。这是网络处理错误方式的变化，而不仅仅是它已经正确的次数变多。

空间结果指向同一方向。训练相关的是爆发从哪里开始发生了移动，而传播方向的集合被保留下来，并没有出现全新的一类模式，峰值也没有跟着移动。作者把这读成一种简单的生态位构建：组织保留了自己历史的痕迹，从而对已有模式重新加权。这是对所观察到的重新加权的一种解释，而不是对突触或其他底层变量的直接测量。

受损培养在数据里又加了一条边界，尽管还不是决定性的组间证明。它们仍然爆发，次数和时间看起来也平常，但没有表现出跨日的提高。在这次实验里，自发爆发本身还不够。

合在一起，这项研究把爆发起始和错误恢复，标识为解离皮层网络可以被训练去重组的变量，而所用的是一条全局反馈规则，把寻找解法的工作留给组织自己。

## 总结

- 一条简单的闭环规则——爆发从目标侧之外开始就刺激，从目标侧开始就停止刺激——足以让大鼠皮层培养（n = 10）在多日里提高目标侧爆发的起始比例，而且这一增益出现在不同场次之间，而不是单场内部。
- 与未刺激对照（n = 6）相比，最稳健的差异是从错误爆发中恢复得更好，而不是更少进入那些状态。爆发起点移向了目标，峰值和传播方向的种类则被保留。
- 仍然能爆发的受损培养（n = 6）既没有跨日提高，也没有场次之间的那种模式。这篇论文主张的是：被训练的可以是组织本身，而不是一个复杂的解码器。

---

## References and resources

- Clawson, W., Grasso, C., Palmer, S., Meng, S., Wu, N., Sullivan, T., & Levin, M. (2026). <i>Goal directed closed-loop training of network bursts in cortical cultures produces improved performance and error correction over days.</i> bioRxiv. 预印本，发布于 2026-10-27（第 2 版）。[doi.org/10.64898/2026.10.15.759184](https://doi.org/10.64898/2026.10.15.759184) · [全文](https://www.biorxiv.org/content/10.64898/2026.10.15.759184v2)
- Shahaf, G., & Marom, S. (2001). <i>Learning in networks of cortical neurons.</i> The Journal of Neuroscience, 21(22), 8782–8788。[doi.org/10.1523/JNEUROSCI.21-22-08782.2001](https://doi.org/10.1523/JNEUROSCI.21-22-08782.2001)
- Kagan, B. J., Kitchen, A. C., Tran, N. T., et al. (2022). <i>In vitro neurons learn and exhibit sentience when embodied in a simulated game-world.</i> Neuron, 110(23), 3952–3969。[doi.org/10.1016/j.neuron.2022.09.001](https://doi.org/10.1016/j.neuron.2022.09.001)
- Figure 1、2、3、4、6 取自 Clawson 等（2026）。
