---
title: "readApaper#49 A neuroprosthesis for restoring hand movement and sensation in a person with complete tetraplegia"
title_zh: "readApaper#49 为完全四肢瘫痪者恢复手部运动与感觉的神经假体"
date: 2026-12-05 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - neuroprosthesis
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 5 December 2026 · Nature Medicine, 2026</i>

This first-in-human study describes a double neural bypass that links an intracortical brain–computer interface to spinal and cortical neuromodulation, so that a person with complete tetraplegia can move his own hand, feel aspects of contact, and keep some of those gains after the system is turned off.

## Background

A severe spinal cord injury can interrupt both outgoing motor commands and incoming sensory signals. In <b>tetraplegia</b>, the arms and legs are affected. A “complete” injury, in the clinical sense used here, means that there is no preserved motor function below a given level and, on the sensory side, no preserved sensation below another level. The person in this study had complete C4 sensory and C5 motor tetraplegia: elbow flexion can be especially relevant at that motor level, while the hand itself may remain without useful movement or touch.

A <b>neural bypass</b> tries to go around the interrupted cord. Motor cortex still generates activity when the person attempts to move, even if the command never reaches the muscles. If that activity can be recorded and used to drive stimulation of the cord or of the muscles, the person’s own hand may move again. Touch is the other half of the problem. If sensors on the hand or on an orthosis can drive stimulation of somatosensory cortex, the person may feel contact that the injured cord no longer carries.

Earlier work has restored pieces of this loop: cortical control of a robotic arm, muscle stimulation from decoded intent, or artificial touch through cortical microstimulation. Combining movement and sensation in the user’s own hand, and asking whether some recovery persists when the device is off, is a more demanding test.

## Problem

The clinical problem is to restore useful hand function after a complete cervical injury, including both grasp and some form of touch, and to do so in a way that can also leave lasting changes in residual movement and sensation. Some muscles may not respond to stimulation if lower motor neurons are damaged, so a purely muscular stimulation strategy may be incomplete. Fine grasp force is also hard to stabilize from noisy neural signals alone. The authors therefore designed a hybrid system, tested over more than three years in one participant, to address immediate function and longer-term recovery together.

## Method

The participant was a 42-year-old man who had sustained a complete C4 sensory / C5 motor tetraplegia in a diving accident 13 months before enrollment. The trial was first-in-human and spanned more than three years. Two microelectrode arrays were placed in primary motor cortex (M1), and up to three arrays were placed in primary somatosensory cortex (S1).

The <b>double neural bypass</b> (DNB) had several layers. First, targeted spinal cord stimulation (tSCS) was delivered to the dorsal cervical roots. Then neuromuscular electrical stimulation (NMES) of the user’s own hand was combined with a custom 3D-printed active orthosis (AO), because some flexors did not respond to stimulation, consistent with possible lower-motor-neuron dysfunction. Sensors on the palm and on the orthosis drove intracortical microstimulation (ICMS) of S1, often through more than one electrode, to supply tactile feedback.

![Figure 1. The DNB system (Chandrasekaran et al., 2026, Fig. 1). Motor-cortex recordings drive targeted spinal stimulation, hand muscle stimulation and an active orthosis, while sensors on the palm and orthosis drive S1 intracortical microstimulation, including activity-informed cortical mirroring.](/img/readApaper-49/dnb_fig1.png)

<i>Figure 1. The DNB system (Chandrasekaran et al., 2026, Fig. 1). Motor-cortex recordings drive targeted spinal stimulation, hand muscle stimulation and an active orthosis, while sensors on the palm and orthosis drive S1 intracortical microstimulation, including activity-informed cortical mirroring.</i>

Movement decoding used a long short-term memory (LSTM) network, with deep reinforcement learning for fine grasp force. Sensory stimulation included a method the authors call <b>cortical mirroring</b>: S1 ICMS was patterned on activity recorded during imagined or physical touch, so that the artificial sensation was informed by the person’s own cortical responses rather than by an arbitrary pulse train. The system was evaluated both while it was on, for tasks such as self-feeding and handling delicate objects, and after it was turned off, for residual elbow flexion and wrist sensation.

## Experiments

Functional tasks included self-feeding and manipulation of delicate objects with the stimulated hand and orthosis. Motor recovery off the system was assessed with isometric elbow flexion. Right and left biceps force was compared across baseline, later intervention time points and a long follow-up, using one-way repeated-measures ANOVA after a Lilliefors test for normality, with Tukey–Kramer correction for multiple comparisons.

Tactile recovery was tested with Semmes–Weinstein monofilaments at sites that included the wrist pad, thumb pad, index pad and index volar pad. Scores based on the thinnest filament perceived were compared with two-sided Wilcoxon rank-sum tests, without multiple-comparison adjustment, among baseline, intervention and post-intervention periods. The authors also noted whether percepts were correctly localized or mislocalized, and whether some pads remained without sensation throughout.

## Results

With the system on, the participant recovered functional abilities that included self-feeding and the manipulation of delicate objects. Fine grasp force could be controlled with the LSTM decoder and reinforcement-learning policy, and S1 stimulation provided tactile feedback from the palm and orthosis sensors.

Off the system, elbow flexion improved and those gains persisted. There was a significant effect of time for both the right biceps (F(2, 14) = 41.34, P = 1.33 × 10⁻⁶) and the left biceps (F(2, 16) = 46.49, P = 2.16 × 10⁻⁷). Tukey–Kramer comparisons showed significant gains at 15 weeks (right biceps P = 0.002; left biceps P = 0.02) and at 35 weeks (right biceps P = 0.0003; left biceps P = 3.8 × 10⁻⁵). These gains persisted bilaterally over several months and translated into a functional improvement in elbow flexion.

![Figure 2. Persistent recovery of upper limb motor function by tSCS (Chandrasekaran et al., 2026, Fig. 2). Right and left biceps force improved over time (right: F(2, 14) = 41.34, P = 1.33 × 10⁻⁶; left: F(2, 16) = 46.49, P = 2.16 × 10⁻⁷), with significant Tukey–Kramer gains at 15 and 35 weeks.](/img/readApaper-49/dnb_fig2.png)

<i>Figure 2. Persistent recovery of upper limb motor function by tSCS (Chandrasekaran et al., 2026, Fig. 2). Right and left biceps force improved over time (right: F(2, 14) = 41.34, P = 1.33 × 10⁻⁶; left: F(2, 16) = 46.49, P = 2.16 × 10⁻⁷), with significant Tukey–Kramer gains at 15 and 35 weeks.</i>

Wrist tactile sensation also improved and remained improved after the intervention. Wilcoxon tests on the thinnest filament perceived gave P = 0.0011 for baseline versus intervention and P = 0.0106 for baseline versus post-intervention, while intervention versus post-intervention was not significant (P = 0.2925). During the intervention the participant could perceive as little as 10 g of effective applied force on the wrist. The index pad, index volar pad and thumb pad, however, remained without sensation in all phases.

![Figure 5. Persistent recovery of somatosensation (Chandrasekaran et al., 2026, Fig. 5). Wrist tactile thresholds improved during the intervention and remained improved afterward (Wilcoxon baseline versus intervention P = 0.0011; baseline versus post P = 0.0106; intervention versus post P = 0.2925), with percepts as low as 10 g on the wrist; the index and thumb pads remained without sensation.](/img/readApaper-49/dnb_fig5.png)

<i>Figure 5. Persistent recovery of somatosensation (Chandrasekaran et al., 2026, Fig. 5). Wrist tactile thresholds improved during the intervention and remained improved afterward (Wilcoxon baseline versus intervention P = 0.0011; baseline versus post P = 0.0106; intervention versus post P = 0.2925), with percepts as low as 10 g on the wrist; the index and thumb pads remained without sensation.</i>

Cortical mirroring and multi-electrode S1 ICMS were used to shape the quality of the artificial touch, and the participant could use combined movement and feedback in tasks that required a stable, relatively gentle grasp rather than a single ballistic close.

![Figure 3. Closed-loop grasping with S1-mediated tactile feedback (Chandrasekaran et al., 2026, Fig. 3). An LSTM decoder and a reinforcement-learning policy controlled fine grasp force while S1 stimulation supplied tactile feedback from palm and orthosis sensors, supporting tasks such as self-feeding and delicate-object manipulation.](/img/readApaper-49/dnb_fig3.png)

<i>Figure 3. Closed-loop grasping with S1-mediated tactile feedback (Chandrasekaran et al., 2026, Fig. 3). An LSTM decoder and a reinforcement-learning policy controlled fine grasp force while S1 stimulation supplied tactile feedback from palm and orthosis sensors, supporting tasks such as self-feeding and delicate-object manipulation.</i>

## Analysis

The study is a single-participant, first-in-human demonstration, and its force lies in the combination of immediate bypass function with off-system changes that lasted for months. The DNB is “double” in more than one sense: it couples a motor path (cortex to spinal stimulation, muscles and orthosis) with a sensory path (sensors back to S1), and it aims at both real-time control and longer-term recovery.

The motor results should be read at the joints that actually changed. Persistent, statistically strong improvements were shown for elbow flexion on both sides, which is a meaningful residual function after a C5 motor injury. The hand itself was assisted during use by NMES and by an active orthosis, precisely because some flexors did not respond. The sensory results are similarly specific: wrist tactile thresholds improved and stayed improved after the system was off, down to a 10 g monofilament during the intervention, but the thumb and index pads remained insensate throughout. A durable wrist percept is not the same as a full restoration of hand touch.

The non-significant Wilcoxon comparison between intervention and post-intervention (P = 0.2925) is consistent with the claim that the wrist-sensation gain did not simply disappear when the device was turned off. Together with the 35-week elbow-flexion statistics, that is the paper’s main evidence for lasting change beyond the moments when the bypass is running.

## Summary

In a 42-year-old man with complete C4 sensory / C5 motor tetraplegia, a double neural bypass combining M1 recording, S1 ICMS, targeted cervical spinal stimulation, hand NMES and an active orthosis enabled self-feeding and delicate-object manipulation while the system was on. Off the system, bilateral elbow flexion improved (right biceps F(2, 14) = 41.34, P = 1.33 × 10⁻⁶; left biceps F(2, 16) = 46.49, P = 2.16 × 10⁻⁷), with significant Tukey–Kramer gains at 15 and 35 weeks, and wrist tactile sensation improved (Wilcoxon baseline versus intervention P = 0.0011; baseline versus post P = 0.0106) to as little as 10 g during the intervention, while the index and thumb pads remained without sensation.

## References

Chandrasekaran, S., Wandelt, S. K., Jangam, A., Elias, Z., Ibroci, E., Maffei, C., Rosenthal, I. A., Ramdeo, R., Kim, J., Xu, J., Glasser, M. F., Neuwirth, A., Goldstein, T. A., Crone, N. E., Fifer, M. S., Tostaeva, G., Bickel, S., Griffin, D., Funaro, M., Carras, N. G., Pruitt, R., Ben-Shalom, N., Stein, A. B., Mehta, A. D., & Bouton, C. E. (2026). A neuroprosthesis for restoring hand movement and sensation in a person with complete tetraplegia. <i>Nature Medicine, 32</i>, 2591–2601. Published 16 July 2026. [https://doi.org/10.1038/s41591-026-04498-0](https://doi.org/10.1038/s41591-026-04498-0)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-12-05 · Nature Medicine, 2026</i>

这项首次人体研究描述了一种双神经旁路：它把皮质内脑机接口与脊髓及皮层神经调控连接起来，使一名完全四肢瘫痪者能够活动自己的手、感知部分接触，并在系统关闭后仍保留其中一些收获。

## 背景

严重的脊髓损伤会同时切断下行的运动指令和上行的感觉信号。在<b>四肢瘫痪</b>中，双臂和双腿都会受影响。这里所说的“完全”损伤，是指在某一水平以下没有保留的运动功能，并且在感觉方面，在另一水平以下没有保留的感觉。本研究中的参与者是完全性 C4 感觉 / C5 运动四肢瘫痪：在这一运动水平上，肘屈曲尤其关键，而手本身可能仍然没有有用的运动或触觉。

<b>神经旁路</b>试图绕过被切断的脊髓。即使指令到不了肌肉，当患者试图运动时，运动皮层仍然会产生活动。如果能够记录这些活动，并用它来驱动对脊髓或肌肉的刺激，患者自己的手就可能重新动起来。触觉是问题的另一半。如果手上或矫形器上的传感器能够驱动对体感皮层的刺激，患者就可能重新感受到受损脊髓已无法传递的接触。

先前的工作已经恢复了这一回路中的若干部分：用皮层控制机械臂、根据解码出的意图刺激肌肉，或通过皮层微刺激提供人工触觉。把运动和感觉结合在患者自己的手上，并询问关闭设备后是否仍有部分恢复，是一项要求更高的检验。

## 问题

临床问题是：在完全性颈髓损伤之后恢复有用的手功能，包括抓握和某种形式的触觉，并且还要能在残余运动和感觉上留下持久变化。如果下运动神经元受损，有些肌肉可能对刺激没有反应，那么单纯刺激肌肉的策略就可能不完整。仅从嘈杂的神经信号出发，精细的抓握力也很难稳定。因此，作者设计了一套混合系统，在一名参与者身上试验了三年以上，同时针对即时功能和更长期的恢复。

## 方法

参与者是一名 42 岁男性，在入组 13 个月前因跳水事故导致完全性 C4 感觉 / C5 运动四肢瘫痪。试验为首次人体试验，历时三年以上。两个微电极阵列被植入初级运动皮层（M1），最多三个阵列被植入初级体感皮层（S1）。

<b>双神经旁路</b>（DNB）有若干层次。首先，对颈段背根进行靶向脊髓刺激（tSCS）。随后，对患者自己的手进行神经肌肉电刺激（NMES），并配合定制的 3D 打印主动矫形器（AO），因为有些屈肌对刺激没有反应，这与可能的下运动神经元功能障碍相一致。手掌和矫形器上的传感器驱动 S1 的皮层内微刺激（ICMS），常常通过多个电极，以提供触觉反馈。

![图 1. 双神经旁路（DNB）系统（Chandrasekaran 等，2026，图 1）。运动皮层记录驱动靶向脊髓刺激、手部肌肉刺激和主动矫形器，手掌和矫形器上的传感器则驱动 S1 皮层内微刺激，包括由活动提供信息的皮层镜像。](/img/readApaper-49/dnb_fig1.png)

<i>图 1. 双神经旁路（DNB）系统（Chandrasekaran 等，2026，图 1）。运动皮层记录驱动靶向脊髓刺激、手部肌肉刺激和主动矫形器，手掌和矫形器上的传感器则驱动 S1 皮层内微刺激，包括由活动提供信息的皮层镜像。</i>

运动解码使用长短期记忆（LSTM）网络，并用深度强化学习来控制精细抓握力。感觉刺激包括作者所称的<b>皮层镜像</b>：S1 的 ICMS 按照在想象触摸或实际触摸时记录到的活动来编排，从而使人工感觉由患者自己的皮层反应提供信息，而不是采用任意的脉冲序列。系统既在开启时评估，用于自主进食和操作精细物体等任务；也在关闭后评估残余的肘屈曲和腕部感觉。

## 实验

功能任务包括在受刺激的手和矫形器帮助下自主进食，以及操作精细物体。系统关闭后的运动恢复，用等长肘屈曲来评估。右侧和左侧肱二头肌的力量在基线、较后的干预时间点和长期随访之间进行比较，在用 Lilliefors 检验确认正态性后，采用单因素重复测量方差分析，并用 Tukey–Kramer 方法校正多重比较。

触觉恢复用 Semmes–Weinstein 单丝在腕垫、拇指垫、食指垫和食指掌侧垫等位置进行测试。根据所能感知的最细单丝评分，用双侧 Wilcoxon 秩和检验比较基线、干预期和干预后，未做多重比较校正。作者还记录了感知定位是否正确或发生错位，以及某些垫区是否在各阶段都始终没有感觉。

## 结果

系统开启时，参与者恢复了包括自主进食和操作精细物体在内的功能。精细抓握力可以由 LSTM 解码器和强化学习策略来控制，S1 刺激则提供来自手掌和矫形器传感器的触觉反馈。

系统关闭后，肘屈曲改善，并且这些收获得以保持。时间因素在右侧肱二头肌（F(2, 14) = 41.34，P = 1.33 × 10⁻⁶）和左侧肱二头肌（F(2, 16) = 46.49，P = 2.16 × 10⁻⁷）上都显著。Tukey–Kramer 比较显示，15 周时有显著提高（右侧 P = 0.002，左侧 P = 0.02），35 周时同样显著（右侧 P = 0.0003，左侧 P = 3.8 × 10⁻⁵）。这些收获在双侧持续数月，并转化成肘屈曲的功能改善。

![图 2. 靶向脊髓刺激带来的上肢运动功能持久恢复（Chandrasekaran 等，2026，图 2）。左右侧肱二头肌力量随时间提高（右侧 F(2, 14) = 41.34，P = 1.33 × 10⁻⁶；左侧 F(2, 16) = 46.49，P = 2.16 × 10⁻⁷），在 15 周和 35 周均有显著的 Tukey–Kramer 提高。](/img/readApaper-49/dnb_fig2.png)

<i>图 2. 靶向脊髓刺激带来的上肢运动功能持久恢复（Chandrasekaran 等，2026，图 2）。左右侧肱二头肌力量随时间提高（右侧 F(2, 14) = 41.34，P = 1.33 × 10⁻⁶；左侧 F(2, 16) = 46.49，P = 2.16 × 10⁻⁷），在 15 周和 35 周均有显著的 Tukey–Kramer 提高。</i>

腕部触觉也得到改善，并在干预后仍然保持。对所能感知的最细单丝进行的 Wilcoxon 检验，基线与干预期相比 P = 0.0011，基线与干预后相比 P = 0.0106，而干预期与干预后之间不显著（P = 0.2925）。干预期间，参与者在腕部可以感知低至 10 g 的有效施加力。然而，食指垫、食指掌侧垫和拇指垫在所有阶段都始终没有感觉。

![图 5. 体感的持久恢复（Chandrasekaran 等，2026，图 5）。腕部触觉阈值在干预期间改善，并在干预后保持（Wilcoxon 基线与干预期 P = 0.0011，基线与干预后 P = 0.0106，干预期与干预后 P = 0.2925），腕部可低至 10 g；食指和拇指垫始终没有感觉。](/img/readApaper-49/dnb_fig5.png)

<i>图 5. 体感的持久恢复（Chandrasekaran 等，2026，图 5）。腕部触觉阈值在干预期间改善，并在干预后保持（Wilcoxon 基线与干预期 P = 0.0011，基线与干预后 P = 0.0106，干预期与干预后 P = 0.2925），腕部可低至 10 g；食指和拇指垫始终没有感觉。</i>

皮层镜像和多电极 S1 ICMS 被用来塑造人工触觉的性质；参与者能够在需要稳定、相对轻柔的抓握、而不是一次快速握紧的任务中，同时使用运动和反馈。

![图 3. 在 S1 介导的触觉反馈下进行闭环抓握（Chandrasekaran 等，2026，图 3）。LSTM 解码器和强化学习策略控制精细抓握力，S1 刺激则提供来自手掌和矫形器传感器的触觉反馈，支持自主进食和精细物体操作等任务。](/img/readApaper-49/dnb_fig3.png)

<i>图 3. 在 S1 介导的触觉反馈下进行闭环抓握（Chandrasekaran 等，2026，图 3）。LSTM 解码器和强化学习策略控制精细抓握力，S1 刺激则提供来自手掌和矫形器传感器的触觉反馈，支持自主进食和精细物体操作等任务。</i>

## 分析

这是一项单病例、首次人体演示，其力量在于把即时的旁路功能与关闭系统后仍能持续数月的变化结合在一起。DNB 的“双”有不止一层含义：它把运动通路（皮层到脊髓刺激、肌肉和矫形器）与感觉通路（传感器回到 S1）耦合起来，并且同时瞄准实时控制和更长期的恢复。

运动结果应当在真正发生变化的关节上来读。双侧肘屈曲出现了持续且统计上很强的改善，这在 C5 运动损伤后是有意义的残余功能。手本身在使用时得到了 NMES 和主动矫形器的辅助，正是因为有些屈肌没有反应。感觉结果同样是具体的：腕部触觉阈值改善，并在系统关闭后仍然保持，干预期间可低至 10 g 单丝；但拇指和食指垫在整个过程中始终没有感觉。持久的腕部感知，并不等于手部触觉的全面恢复。

干预期与干预后之间不显著的 Wilcoxon 比较（P = 0.2925），与“腕部感觉的收获并没有在关闭设备后立即消失”这一说法相一致。连同 35 周时的肘屈曲统计，这是论文关于旁路运行之外仍有持久变化的主要证据。

## 总结

在一名患有完全性 C4 感觉 / C5 运动四肢瘫痪的 42 岁男性中，一套结合 M1 记录、S1 ICMS、靶向颈髓刺激、手部 NMES 和主动矫形器的双神经旁路，在系统开启时实现了自主进食和精细物体操作。系统关闭后，双侧肘屈曲改善（右侧肱二头肌 F(2, 14) = 41.34，P = 1.33 × 10⁻⁶；左侧 F(2, 16) = 46.49，P = 2.16 × 10⁻⁷），在 15 周和 35 周均有显著的 Tukey–Kramer 提高；腕部触觉也改善（Wilcoxon 基线与干预期 P = 0.0011，基线与干预后 P = 0.0106），干预期间可低至 10 g，而食指和拇指垫始终没有感觉。

## 参考文献

Chandrasekaran, S., Wandelt, S. K., Jangam, A., Elias, Z., Ibroci, E., Maffei, C., Rosenthal, I. A., Ramdeo, R., Kim, J., Xu, J., Glasser, M. F., Neuwirth, A., Goldstein, T. A., Crone, N. E., Fifer, M. S., Tostaeva, G., Bickel, S., Griffin, D., Funaro, M., Carras, N. G., Pruitt, R., Ben-Shalom, N., Stein, A. B., Mehta, A. D., & Bouton, C. E. (2026). A neuroprosthesis for restoring hand movement and sensation in a person with complete tetraplegia. <i>Nature Medicine, 32</i>, 2591–2601. Published 16 July 2026. [https://doi.org/10.1038/s41591-026-04498-0](https://doi.org/10.1038/s41591-026-04498-0)
