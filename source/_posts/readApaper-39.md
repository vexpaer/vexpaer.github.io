---
title: "readApaper#39 Active tactile exploration using a brain–machine–brain interface"
title_zh: "readApaper#39 Active tactile exploration using a brain–machine–brain interface"
date: 2026-11-25 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - somatosensory
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 25 November 2026 · Nature, 5 October 2011</i>

When you reach for a cup, your eyes tell you where it is, but touch tells you that contact has occurred and what the surface feels like. This paper shows that two monkeys could move a virtual actuator with motor-cortex activity and receive artificial textures through stimulation of somatosensory cortex, then use that loop to find a rewarded object among visually identical choices.

## Background

A <b>brain–machine interface</b> (BMI) records neuronal activity and turns it into commands for an external device, such as a cursor or a prosthetic arm (Lebedev & Nicolelis, 2006; Nicolelis & Lebedev, 2009). By 2011, such systems could support reaching and grasping, but they still relied almost exclusively on vision (Carmena et al., 2003; Velliste et al., 2008).

Vision locates an object; touch reports contact and surface properties, and that information guides exploration and grip (Johansson & Westling, 1984; Lederman & Klatzky, 1987). <b>Primary somatosensory cortex</b> (S1) represents this information. <b>Primary motor cortex</b> (M1) is a main source of the movement-related activity used to decode intended motion.

<b>Intracortical microstimulation</b> (ICMS) delivers brief electrical pulses through implanted microelectrodes. Stimulating S1 can evoke percepts that animals can discriminate and use as behavioural cues (Romo et al., 1998; Fitzsimmons et al., 2007). A <b>brain–machine–brain interface</b> (BMBI) closes both directions through the brain: M1 activity moves an actuator, and S1 stimulation sends a tactile-like signal back. This is the same loop as <b>active tactile exploration</b>, in which the hand is moved to gather touch information (Lederman & Klatzky, 1987).

## Problem

The question was how to give a BMI-controlled actuator a sense of touch that an animal could use while exploring. A pilot study from this group had already shown that a monkey could respond to ICMS cues by moving a BMI-controlled cursor (O’Doherty et al., 2009). That stimulation was a cue, however, not feedback of contact between the actuator and an object. This work asks whether ICMS can carry the artificial tactile properties of virtual objects, in real time, while the animal also uses M1 activity to move the actuator and search for a target.

A practical obstacle stands in the way. Each ICMS pulse leaves an artefact that masks recorded neuronal activity for 5–10 ms, so recording and stimulation have to share the same clock.

## Method

The BMBI is a closed loop (Figure 1). Activity from right-hemisphere M1 neurons is decoded into the position of an actuator—a computer cursor or, later, a first-person virtual arm. Whenever that actuator touches a virtual object, a temporal pattern of ICMS is delivered to S1. The objects look identical; only the stimulation pattern distinguishes them.

![Figure 1. The brain–machine–brain interface. (a) M1 activity is decoded into actuator motion (a cursor or virtual arm). When the actuator touches a virtual object, a temporal ICMS pattern is delivered to S1. In hand control the monkey uses a joystick; in brain control the joystick is disconnected. (b) Implant sites in M1 and S1. (c) The two microwire pairs used for ICMS in monkey M (red), in the S1 hand representation. (d) Example trial: the actuator first contacts a UAT object (400 Hz packets) and then holds on RAT (200 Hz packets). Grey bars mark stimulation. (e) Raster of M1 neurons during the same trial; brief gaps align with stimulation. From O’Doherty et al., 2011, Figure 1.](/img/readApaper-39/odoherty2011_fig1.jpg)

<i>Figure 1. The brain–machine–brain interface. (a) M1 activity is decoded into actuator motion (a cursor or virtual arm). When the actuator touches a virtual object, a temporal ICMS pattern is delivered to S1. In hand control the monkey uses a joystick; in brain control the joystick is disconnected. (b) Implant sites in M1 and S1. (c) The two microwire pairs used for ICMS in monkey M (red), in the S1 hand representation. (d) Example trial: the actuator first contacts a UAT object (400 Hz packets) and then holds on RAT (200 Hz packets). Grey bars mark stimulation. (e) Raster of M1 neurons during the same trial; brief gaps align with stimulation. From O’Doherty et al., 2011, Figure 1.</i>

Two adult rhesus monkeys (M and N) received microwire arrays in M1 and S1 of both hemispheres. Recordings came from the right-hemisphere arm arrays, matched to the left-hand joystick. ICMS was delivered through two pairs of microwires in the S1 hand representation in monkey M, and through one pair in the S1 leg representation in monkey N. The pulses were symmetric, biphasic, and charge-balanced. Pulse width was 105 µs in monkey M and 200 µs in monkey N; typical currents were 120–200 µA.

Each <b>artificial texture</b> (AT) was a high-frequency pulse train packaged at a lower secondary frequency. The rewarded texture (RAT) used 200 Hz pulses in 10 Hz packets, nine pulses per stimulation interval. The unrewarded texture (UAT) used 400 Hz pulses in 5 Hz packets, 18 pulses. A null texture (NAT) was the absence of ICMS.

Recording and stimulation were interleaved on a 20 Hz clock, and the BMI updated at 10 Hz. Each 100 ms window was split into a 50 ms recording half, whose spike count estimated the firing rate for the whole window, and a 50 ms stimulation half, whose spikes were discarded—even on NAT trials, so that missing data would not themselves become a cue. If the actuator was already in contact with an object at the start of a stimulation interval, the corresponding pulse train was delivered.

The motor decoder was an unscented Kalman filter (Li et al., 2009). In <b>hand control</b> (HC), the monkey moved a joystick to position the actuator. In <b>brain control</b> (BC), the joystick was disconnected and M1 activity took over. Each object had a peripheral <b>feedback zone</b>, where ICMS began, and a central <b>response zone</b>, where the actuator had to be held to make a selection.

## Experiments

All procedures were approved by the Duke University Institutional Animal Care and Use Committee. Two adult rhesus macaques (<i>Macaca mulatta</i>) participated.

A trial began with a centre hold of 0–2 s. Objects then appeared, and the monkey had to find the rewarded texture and hold the actuator in its response zone. In HC, the required hold was 800–1,300 ms; holding an incorrect object cancelled the trial.

The tasks grew more demanding in steps (Figure 2a). Task I used two objects, RAT versus NAT, in fixed locations. Task II kept those textures but varied their locations from trial to trial. Task III compared RAT with UAT. Task IV introduced three objects—RAT, UAT, and NAT—with a new arrangement on every trial, and brain control began here. Task V replaced the cursor with a virtual-reality arm.

Brain control had two forms. In <b>brain control with hand movements</b> (BCWH), the monkey still held the now-disconnected joystick. In <b>brain control without hand</b> (BCWOH), the joystick was removed, the selection hold was shortened to 300–500 ms, and the animals could remain on an incorrect object, so the main measure became rewards per minute rather than percent correct.

Chance was 50% with two objects and 33% with three. Some sessions included catch trials, typically 1%, with the stimulator at zero amplitude.

## Results

Performance rose with training. In Task I, monkey M surpassed chance after nine sessions and monkey N after four (<i>P</i> \< 0.001, one-sided binomial test). Figure 2 summarizes 72 sessions in monkey M: the fraction of correct trials increased, and time spent on unrewarded textures fell.

![Figure 2. Learning to use ICMS feedback, shown for monkey M across 72 sessions. (a) Task progression: I, RAT versus NAT at fixed locations; II, the same textures at varying locations; III, RAT versus UAT; IV, three objects, where brain control begins; V, the same three-object task with a virtual arm. (b) Fraction of correct trials. Filled circles, significantly above chance (P < 0.001); open circles, not significant. Black, hand control; red, BCWH. The asterisk marks a psychometric session. (c) Mean time in the feedback zone for RAT (squares), UAT (triangles), and NAT (crosses). (d) Within-session performance for monkey M. The main panel shows BCWOH rewards per minute, averaged over 3 sessions, rising from 1.021 ± 0.007 to 2.962 ± 0.005. Insets show HC and BCWH (12 sessions each). In BCWOH, mean exploration intervals were 3,620 ± 350 ms for NAT, 4,270 ± 310 ms for UAT, and 2,255 ± 94 ms for RAT (shortest because the selection hold was reduced). From O’Doherty et al., 2011, Figure 2.](/img/readApaper-39/odoherty2011_fig2.jpg)

<i>Figure 2. Learning to use ICMS feedback, shown for monkey M across 72 sessions. (a) Task progression: I, RAT versus NAT at fixed locations; II, the same textures at varying locations; III, RAT versus UAT; IV, three objects, where brain control begins; V, the same three-object task with a virtual arm. (b) Fraction of correct trials. Filled circles, significantly above chance (<i>P</i> \< 0.001); open circles, not significant. Black, hand control; red, BCWH. The asterisk marks a psychometric session. (c) Mean time in the feedback zone for RAT (squares), UAT (triangles), and NAT (crosses). (d) Within-session performance for monkey M. The main panel shows BCWOH rewards per minute, averaged over 3 sessions, rising from 1.021 ± 0.007 to 2.962 ± 0.005. Insets show HC and BCWH (12 sessions each). In BCWOH, mean exploration intervals were 3,620 ± 350 ms for NAT, 4,270 ± 310 ms for UAT, and 2,255 ± 94 ms for RAT (shortest because the selection hold was reduced). From O’Doherty et al., 2011, Figure 2.</i>

Discrimination required at least 8 nC per ICMS waveform phase, or 100 µs pulses of 80 µA (<i>P</i> \< 0.001). Catch trials in Task II were at chance (<i>P</i> = 0.90).

Exploration times showed that the monkeys treated the three patterns as distinct (Figure 3). Early in Task I, intervals for RAT and NAT were indistinguishable (<i>P</i> > 0.5). With training they became longer for RAT and shorter for NAT and, later, UAT. In both HC and BC, mean intervals were longest for RAT, shortest for NAT, and intermediate for UAT (<i>P</i> \< 0.01, ANOVA; means in the Figure 3 caption).

![Figure 3. Statistics of object exploration. (a, c) Time spent in the feedback zone during hand control and brain control (insets) for monkey M (a: HC n = 1,809, BC n = 1,355) and monkey N (c: HC n = 808, BC n = 729). Red, RAT; green, UAT; blue, NAT. In HC, mean intervals (± s.e.m.) were 1,396 ± 21 ms (M) and 1,165 ± 15 ms (N) for RAT; 452 ± 13 ms and 402 ± 14 ms for UAT; and 304 ± 8 ms and 300 ± 10 ms for NAT. In BC they were 1,420 ± 28 ms and 1,398 ± 55 ms for RAT; 685 ± 20 ms and 764 ± 32 ms for UAT; and 498 ± 15 ms and 587 ± 25 ms for NAT. (b, d) Transition probabilities after the first and second reach, for monkeys M and N. Black, HC; red, BC. Line thickness is proportional to probability. From O’Doherty et al., 2011, Figure 3.](/img/readApaper-39/odoherty2011_fig3.jpg)

<i>Figure 3. Statistics of object exploration. (a, c) Time spent in the feedback zone during hand control and brain control (insets) for monkey M (a: HC <i>n</i> = 1,809, BC <i>n</i> = 1,355) and monkey N (c: HC <i>n</i> = 808, BC <i>n</i> = 729). Red, RAT; green, UAT; blue, NAT. In HC, mean intervals (± s.e.m.) were 1,396 ± 21 ms (M) and 1,165 ± 15 ms (N) for RAT; 452 ± 13 ms and 402 ± 14 ms for UAT; and 304 ± 8 ms and 300 ± 10 ms for NAT. In BC they were 1,420 ± 28 ms and 1,398 ± 55 ms for RAT; 685 ± 20 ms and 764 ± 32 ms for UAT; and 498 ± 15 ms and 587 ± 25 ms for NAT. (b, d) Transition probabilities after the first and second reach, for monkeys M and N. Black, HC; red, BC. Line thickness is proportional to probability. From O’Doherty et al., 2011, Figure 3.</i>

Transition probabilities pointed to an active search (Figure 3b, d). In HC, after first contact the monkeys stayed on RAT with high probability (0.70 in M, 0.76 in N), almost never stayed on NAT (0.0 and 0.0), and rarely stayed on UAT (0.05 and 0.01). After a second texture, the probability of then moving to RAT rose to about 0.7, and that of revisiting the other objects fell to about 0.2. Brain-control transitions, plotted in red, show a similar qualitative pattern, most clearly in monkey M.

When BCWH began in Task IV, accuracy fell but remained above the 33% chance level for three objects. Monkey M, with more than 200 recorded neurons, reached 73.75 ± 3.00% correct in BCWH versus 91.48 ± 1.20% in HC. Monkey N, with 50 recorded neurons, reached 50.37 ± 3.74% versus 91.45 ± 1.91%.

In the eased BCWOH task, monkey M’s rewards per minute rose within sessions from 1.021 ± 0.007 to 2.962 ± 0.005 (Figure 2d; three sessions). Exploration was still texture-dependent: shorter for NAT than for UAT (<i>P</i> \< 0.02), and shortest for RAT because the selection hold itself had been reduced. For monkey N, BCWOH performance was 2.084 ± 0.085 rewards per minute, without a within-session change or significant interval differences.

M1 neurons remained directionally tuned during HC and BC. When Task V movements were replayed for the monkey to watch, an offline decoder reconstructed those passively viewed trajectories with accuracy similar to reconstructions of hand-controlled movements (Figure 4c, d).

![Figure 4. M1 activity during active control and passive observation in monkey M. (a) Average BCWH movements toward objects appearing on the left (n = 294 trials). Red, actuator; dashed black, the disconnected joystick. For UAT and NAT, only trials followed by a counter-clockwise reach are included. Red vertical lines mark object onset. (b) Corresponding neuronal firing rates, normalized by standard deviation. (c, d) Offline reconstructions (red) of actuator position during active hand control (c) and during passive observation of replayed Task V movements (d). From O’Doherty et al., 2011, Figure 4.](/img/readApaper-39/odoherty2011_fig4.jpg)

<i>Figure 4. M1 activity during active control and passive observation in monkey M. (a) Average BCWH movements toward objects appearing on the left (<i>n</i> = 294 trials). Red, actuator; dashed black, the disconnected joystick. For UAT and NAT, only trials followed by a counter-clockwise reach are included. Red vertical lines mark object onset. (b) Corresponding neuronal firing rates, normalized by standard deviation. (c, d) Offline reconstructions (red) of actuator position during active hand control (c) and during passive observation of replayed Task V movements (d). From O’Doherty et al., 2011, Figure 4.</i>

## Analysis

These findings show that ICMS of S1 can serve as a usable tactile channel during ongoing BMI control. The monkeys distinguished RAT from both a different pulse pattern and from silence, lingered on the rewarded texture, left the others, and could use a second contact to close in on the target.

Catch trials at zero amplitude were at chance, so performance depended on the delivered ICMS, and discrimination required a minimum charge per phase.

Brain control was less accurate than hand control, especially in the monkey with fewer recorded neurons, but both animals stayed above chance in the three-object task, and texture-dependent exploration times appeared in BC as well. In BCWOH, monkey M increased rewarded selections by scanning faster, while still spending different amounts of time on NAT and UAT.

M1 movement-related modulations persisted across ICMS patterns, and M1 activity also tracked a passively viewed virtual arm (Graziano et al., 2000; Maravita & Iriki, 2004). The experiment was a bidirectional loop in two rhesus monkeys, using visually identical virtual objects and, in one animal, an S1 site in the leg representation rather than the hand. The authors suggest that motor neuroprostheses could benefit from adding ICMS feedback to a mechanical, robotic, or virtual actuator.

## Summary

This BMBI closed a loop that usually runs through the arm: M1 activity moved a cursor or virtual hand, and S1 stimulation returned an artificial texture when that actuator touched a virtual object. Two monkeys learned to search among look-alike objects and select the rewarded texture, first with a joystick and then with brain control. Recording and microstimulation operated together, in real time, as a bidirectional interface for active tactile exploration.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-25 · Nature, 5 October 2011</i>

伸手拿杯子时，眼睛告诉你杯子在哪里，但触觉告诉你已经碰到了，以及表面是什么感觉。这篇论文表明，两只猴子可以用运动皮层的活动来移动一个虚拟执行器，并通过刺激体感皮层获得人工质地，然后用这个回路在外观相同的物体中找出带有奖励质地的那一个。

## 背景

<b>脑机接口</b>（brain–machine interface，BMI）记录神经元活动，并把它转换成对外部装置的指令，例如光标或假肢（Lebedev & Nicolelis, 2006; Nicolelis & Lebedev, 2009）。到 2011 年，这类系统已经能够支持伸手和抓取，但几乎仍然只依赖视觉（Carmena et al., 2003; Velliste et al., 2008）。

视觉适合定位物体；触觉报告接触和表面属性，这些信息会引导探索和抓握（Johansson & Westling, 1984; Lederman & Klatzky, 1987）。<b>初级体感皮层</b>（primary somatosensory cortex，S1）表征这类信息。<b>初级运动皮层</b>（primary motor cortex，M1）则是解码运动意图时常用的活动来源。

<b>皮层内微刺激</b>（intracortical microstimulation，ICMS）通过植入的微电极送入短暂电脉冲。刺激 S1 可以引出动物能够分辨、并用作行为线索的知觉（Romo et al., 1998; Fitzsimmons et al., 2007）。<b>脑–机–脑接口</b>（brain–machine–brain interface，BMBI）把两个方向都放在脑内闭合：M1 的活动移动执行器，S1 的刺激把类触觉信号送回来。这和<b>主动触觉探索</b>是同一类回路：手被主动移动，是为了获取触觉信息（Lederman & Klatzky, 1987）。

## 问题

要回答的问题是：怎样给一个由 BMI 控制的执行器配上动物在探索时真正用得上的触觉。这个团队先前的预实验已经表明，猴子可以根据 ICMS 线索来移动 BMI 控制的光标（O’Doherty et al., 2009）。不过，那里的刺激是线索，而不是执行器与物体接触后的反馈。这项工作要问的是：ICMS 能否在实时条件下携带虚拟物体的人工触觉属性，同时让动物继续用 M1 活动来移动执行器并搜索目标。

这里还有一个实际障碍。每一次 ICMS 脉冲都会留下伪迹，在随后的 5–10 毫秒里掩盖所记录的神经元活动，因此记录和刺激必须共用同一套时钟。

## 方法

这套 BMBI 是一个闭环（图 1）。右侧半球 M1 神经元的活动被解码成执行器的位置——先是计算机光标，后来是第一人称视角的虚拟手臂。每当这个执行器碰到虚拟物体，一组具有特定时间模式的 ICMS 就被送到 S1。这些物体外观相同，只有刺激模式能够区分它们。

![图 1. 脑–机–脑接口。(a) M1 活动被解码为执行器运动（光标或虚拟手臂）。当执行器碰到虚拟物体时，一组具有特定时间模式的 ICMS 被送到 S1。手控时猴子使用操纵杆；脑控时操纵杆被断开。(b) M1 和 S1 的植入位置。(c) 猴 M 用于 ICMS 的两对微丝（红色），位于 S1 手代表区。(d) 示例试验：执行器先接触 UAT 物体（400 Hz 打包），再停在 RAT 上（200 Hz 打包）。灰色条带表示刺激。(e) 同一试验中 M1 神经元的光栅图；短暂的间隙与刺激对齐。取自 O’Doherty 等，2011，Figure 1。](/img/readApaper-39/odoherty2011_fig1.jpg)

<i>图 1. 脑–机–脑接口。(a) M1 活动被解码为执行器运动（光标或虚拟手臂）。当执行器碰到虚拟物体时，一组具有特定时间模式的 ICMS 被送到 S1。手控时猴子使用操纵杆；脑控时操纵杆被断开。(b) M1 和 S1 的植入位置。(c) 猴 M 用于 ICMS 的两对微丝（红色），位于 S1 手代表区。(d) 示例试验：执行器先接触 UAT 物体（400 Hz 打包），再停在 RAT 上（200 Hz 打包）。灰色条带表示刺激。(e) 同一试验中 M1 神经元的光栅图；短暂的间隙与刺激对齐。取自 O’Doherty 等，2011，Figure 1。</i>

两只成年恒河猴（M 和 N）在双侧 M1 和 S1 植入了微丝阵列。记录来自右侧半球上肢代表区的阵列，与训练时左手操作的操纵杆相对应。ICMS 在猴 M 经两对微丝送到 S1 的手代表区，在猴 N 则经一对微丝送到 S1 的腿代表区。脉冲是对称、双相、电荷平衡的。脉宽在猴 M 为 105 µs，在猴 N 为 200 µs；常用电流为 120–200 µA。

每一种<b>人工质地</b>（artificial texture，AT）都是一串高频脉冲，再按较低的次级频率打包。奖励质地（rewarded AT，RAT）是 200 Hz 脉冲，按 10 Hz 打包，每个刺激间隔 9 个脉冲。非奖励质地（unrewarded AT，UAT）是 400 Hz 脉冲，按 5 Hz 打包，共 18 个脉冲。空质地（null AT，NAT）就是没有 ICMS。

记录和刺激按 20 Hz 时钟交错进行，BMI 以 10 Hz 更新。每个 100 毫秒窗口被分成 50 毫秒的记录半段和 50 毫秒的刺激半段：前一半的锋电位计数用来估计整个窗口的发放率；后一半的锋电位被丢弃——即使是 NAT 试验也是如此，以免缺失数据本身变成线索。如果在一个刺激间隔开始时，执行器已经与某个物体接触，就发放对应的脉冲串。

运动解码器是无迹卡尔曼滤波器（unscented Kalman filter）（Li et al., 2009）。在<b>手控</b>（hand control，HC）中，猴子用操纵杆来移动执行器。在<b>脑控</b>（brain control，BC）中，操纵杆被断开，改由 M1 活动接管。每个物体都有外周的<b>反馈区</b>（feedback zone），ICMS 在此开始；还有中央的<b>反应区</b>（response zone），执行器必须在此停留才能完成选择。

## 实验

全部程序经杜克大学机构动物护理与使用委员会批准。两只成年恒河猴（<i>Macaca mulatta</i>）参加了实验。

一次试验从 0–2 秒的中央停留开始。随后物体出现，猴子必须找到带有奖励质地的那一个，并把执行器停在它的反应区里。在 HC 中，要求的停留时间是 800–1,300 毫秒；停在错误物体上会取消该次试验。

任务按步骤逐渐变难（图 2a）。任务 I 使用两个位置固定的物体，RAT 对 NAT。任务 II 仍是这两种质地，但它们的位置每轮都会变。任务 III 比较 RAT 与 UAT。任务 IV 引入三个物体——RAT、UAT 和 NAT——每轮重新布置，脑控也从这里开始。任务 V 把光标换成了虚拟现实手臂。

脑控有两种形式。在<b>伴随手部运动的脑控</b>（brain control with hand movements，BCWH）中，猴子仍然握着已经断开的操纵杆。在<b>无手脑控</b>（brain control without hand，BCWOH）中，操纵杆被拿走，选择停留缩短为 300–500 毫秒，并且允许停在错误物体上，因此主要指标改成分钟奖励次数，而不是正确率。

两个物体时的随机水平是 50%，三个物体时是 33%。部分场次包含捕捉试验，通常约占 1%，刺激器以零幅度运行。

## 结果

成绩随训练提高。在任务 I 中，猴 M 在 9 个场次后超过随机水平，猴 N 在 4 个场次后超过（<i>P</i> \< 0.001，单侧二项检验）。提高一直持续到任务 II–V。图 2 汇总了猴 M 的 72 个场次：正确试验的比例上升，花在非奖励质地上的时间下降。

![图 2. 学习使用 ICMS 反馈，展示猴 M 的 72 个场次。(a) 任务进程：I，位置固定的 RAT 对 NAT；II，同样质地但位置变化；III，RAT 对 UAT；IV，三个物体，脑控从此开始；V，同样的三物体任务，但改用虚拟手臂。(b) 正确试验的比例。实心圆点表示显著高于随机水平（P < 0.001），空心圆点不显著。黑色是手控，红色是 BCWH。星号标出心理物理场次。(c) 反馈区平均停留时间：RAT（方块）、UAT（三角）、NAT（叉）。(d) 猴 M 的场次内成绩。主图是 BCWOH 的每分钟奖励次数，3 个场次平均，从 1.021 ± 0.007 升到 2.962 ± 0.005。插图是 HC 和 BCWH（各 12 个场次）。在 BCWOH 中，平均探索间隔是 NAT 3,620 ± 350 ms，UAT 4,270 ± 310 ms，RAT 2,255 ± 94 ms（最短是因为选择停留被缩短了）。取自 O’Doherty 等，2011，Figure 2。](/img/readApaper-39/odoherty2011_fig2.jpg)

<i>图 2. 学习使用 ICMS 反馈，展示猴 M 的 72 个场次。(a) 任务进程：I，位置固定的 RAT 对 NAT；II，同样质地但位置变化；III，RAT 对 UAT；IV，三个物体，脑控从此开始；V，同样的三物体任务，但改用虚拟手臂。(b) 正确试验的比例。实心圆点表示显著高于随机水平（<i>P</i> \< 0.001），空心圆点不显著。黑色是手控，红色是 BCWH。星号标出心理物理场次。(c) 反馈区平均停留时间：RAT（方块）、UAT（三角）、NAT（叉）。(d) 猴 M 的场次内成绩。主图是 BCWOH 的每分钟奖励次数，3 个场次平均，从 1.021 ± 0.007 升到 2.962 ± 0.005。插图是 HC 和 BCWH（各 12 个场次）。在 BCWOH 中，平均探索间隔是 NAT 3,620 ± 350 ms，UAT 4,270 ± 310 ms，RAT 2,255 ± 94 ms（最短是因为选择停留被缩短了）。取自 O’Doherty 等，2011，Figure 2。</i>

分辨质地至少需要每个 ICMS 波形相位 8 nC，相当于 100 µs、80 µA 的脉冲（<i>P</i> \< 0.001）。任务 II 中的捕捉试验处于随机水平（<i>P</i> = 0.90）。

探索时间表明，猴子把三种模式当成了不同的质地（图 3）。在任务 I 早期，RAT 和 NAT 的间隔无法区分（<i>P</i> > 0.5）。随着训练，RAT 的间隔变长，NAT 的变短，随后 UAT 也变短。无论是 HC 还是 BC，平均间隔都是 RAT 最长、NAT 最短、UAT 居中（<i>P</i> \< 0.01，ANOVA；具体均值见图 3 图注）。

![图 3. 物体探索的统计。(a, c) 手控和脑控（插图）时在反馈区停留的时间，分别是猴 M（a：HC n = 1,809，BC n = 1,355）和猴 N（c：HC n = 808，BC n = 729）。红色是 RAT，绿色是 UAT，蓝色是 NAT。HC 的平均间隔（± s.e.m.）为：RAT 在 M、N 分别为 1,396 ± 21 ms 和 1,165 ± 15 ms；UAT 为 452 ± 13 ms 和 402 ± 14 ms；NAT 为 304 ± 8 ms 和 300 ± 10 ms。BC 中则为：RAT 1,420 ± 28 ms 和 1,398 ± 55 ms；UAT 685 ± 20 ms 和 764 ± 32 ms；NAT 498 ± 15 ms 和 587 ± 25 ms。(b, d) 第一次和第二次到达后的转移概率，分别对应猴 M 和猴 N。黑色是 HC，红色是 BC。线宽与概率成正比。取自 O’Doherty 等，2011，Figure 3。](/img/readApaper-39/odoherty2011_fig3.jpg)

<i>图 3. 物体探索的统计。(a, c) 手控和脑控（插图）时在反馈区停留的时间，分别是猴 M（a：HC <i>n</i> = 1,809，BC <i>n</i> = 1,355）和猴 N（c：HC <i>n</i> = 808，BC <i>n</i> = 729）。红色是 RAT，绿色是 UAT，蓝色是 NAT。HC 的平均间隔（± s.e.m.）为：RAT 在 M、N 分别为 1,396 ± 21 ms 和 1,165 ± 15 ms；UAT 为 452 ± 13 ms 和 402 ± 14 ms；NAT 为 304 ± 8 ms 和 300 ± 10 ms。BC 中则为：RAT 1,420 ± 28 ms 和 1,398 ± 55 ms；UAT 685 ± 20 ms 和 764 ± 32 ms；NAT 498 ± 15 ms 和 587 ± 25 ms。(b, d) 第一次和第二次到达后的转移概率，分别对应猴 M 和猴 N。黑色是 HC，红色是 BC。线宽与概率成正比。取自 O’Doherty 等，2011，Figure 3。</i>

转移概率指向一种主动搜索（图 3b、d）。在 HC 中，第一次接触后，猴子停留在 RAT 上的概率很高（M 为 0.70，N 为 0.76），几乎从不停留在 NAT 上（均为 0.0），也很少停留在 UAT 上（0.05 和 0.01）。检查第二种质地之后，随后转到 RAT 的概率升到大约 0.7，再访其他物体的概率降到大约 0.2。同一张图里用红色标出的脑控转移，也呈现出类似的定性模式，在猴 M 上尤其清楚。

任务 IV 开始 BCWH 后，正确率下降，但仍然高于三物体任务 33% 的随机水平。记录到 200 个以上神经元的猴 M，BCWH 正确率为 73.75 ± 3.00%，HC 为 91.48 ± 1.20%。记录到 50 个神经元的猴 N，则是 50.37 ± 3.74% 对 91.45 ± 1.91%。

在放宽条件的 BCWOH 任务中，猴 M 的每分钟奖励次数在场次内从 1.021 ± 0.007 升到 2.962 ± 0.005（图 2d；3 个场次）。探索仍然随质地而变：NAT 短于 UAT（<i>P</i> \< 0.02），RAT 最短，因为选择停留本身被缩短了。猴 N 的 BCWOH 成绩是每分钟 2.084 ± 0.085 次奖励，场次内没有变化，各质地探索间隔的差异也不显著。

M1 神经元在 HC 和 BC 中都保持了方向调谐。当任务 V 的运动被回放给猴子观看时，一个另行训练的离线解码器能够重建这些被动观察的轨迹，精度与手控运动的重建相近（图 4c、d）。

![图 4. 主动控制和被动观察时的 M1 活动，来自猴 M。(a) 朝向屏幕左侧物体的平均 BCWH 运动（n = 294 次试验）。红色是执行器，黑色虚线是已断开的操纵杆。UAT 和 NAT 只纳入随后做逆时针到达的试验。红色竖线表示物体出现。(b) 对应的神经元发放率，按标准差归一化。(c, d) 离线重建（红色）的执行器位置：主动手控（c），以及被动观看回放的任务 V 运动（d）。取自 O’Doherty 等，2011，Figure 4。](/img/readApaper-39/odoherty2011_fig4.jpg)

<i>图 4. 主动控制和被动观察时的 M1 活动，来自猴 M。(a) 朝向屏幕左侧物体的平均 BCWH 运动（<i>n</i> = 294 次试验）。红色是执行器，黑色虚线是已断开的操纵杆。UAT 和 NAT 只纳入随后做逆时针到达的试验。红色竖线表示物体出现。(b) 对应的神经元发放率，按标准差归一化。(c, d) 离线重建（红色）的执行器位置：主动手控（c），以及被动观看回放的任务 V 运动（d）。取自 O’Doherty 等，2011，Figure 4。</i>

## 分析

这些结果说明，在持续的 BMI 控制过程中，对 S1 的 ICMS 可以充当一条用得上的触觉通道。猴子并不是仅仅在检测有没有刺激。它们能把 RAT 既与另一种脉冲模式、也与沉默区分开，在奖励质地上停留更久，离开其他质地，并且可以利用第二次接触来逼近目标。

零幅度捕捉试验处于随机水平，说明成绩依赖于实际送出的 ICMS，而且分辨还需要每个相位达到最低电荷。

脑控不如手控准确，在记录神经元较少的那只猴子上下降更多，但两只动物在三物体任务中都高于随机水平，而且 BC 中同样出现了随质地变化的探索时间。在放宽的 BCWOH 条件下，猴 M 通过更快扫描提高了奖励选择的速率，同时在 NAT 和 UAT 上花费的时间仍然不同。

运动表征并没有被感觉通道抹掉：与执行器运动有关的 M1 调制在不同 ICMS 模式中仍然存在，而且 M1 活动也能跟踪被被动观看的虚拟手臂（Graziano et al., 2000; Maravita & Iriki, 2004）。实验是在两只恒河猴中完成的双向回路，使用的是外观相同的虚拟物体，并且其中一只动物的 S1 刺激位点在腿代表区而不是手代表区。作者提出，运动神经假体可以受益于增加 ICMS 反馈，把它与机械、机器人或虚拟执行器联系起来。

## 总结

这套 BMBI 闭合了一条通常要经过手臂的回路：M1 活动移动光标或虚拟手，S1 刺激则在执行器碰到虚拟物体时送回一种人工质地。两只猴子学会了在外观相似的物体中搜索并选出奖励质地，先是用手控，然后是用脑控。记录和微刺激在实时条件下一起工作，构成了一个用于主动触觉探索的双向接口。

## 参考文献与资料

- O’Doherty, J. E., Lebedev, M. A., Ifft, P. J., Zhuang, K. Z., Shokur, S., Bleuler, H., & Nicolelis, M. A. L. (2011). <i>Active tactile exploration using a brain–machine–brain interface.</i> Nature, 479(7372), 228–231. [doi.org/10.1038/nature10489](https://doi.org/10.1038/nature10489)
- O’Doherty, J. E., Lebedev, M. A., Hanson, T. L., Fitzsimmons, N. A., & Nicolelis, M. A. (2009). <i>A brain-machine interface instructed by direct intracortical microstimulation.</i> Frontiers in Integrative Neuroscience, 3, 20. [doi.org/10.3389/neuro.07.020.2009](https://doi.org/10.3389/neuro.07.020.2009)
- Lebedev, M. A., & Nicolelis, M. A. (2006). <i>Brain-machine interfaces: past, present and future.</i> Trends in Neurosciences, 29, 536–546. [doi.org/10.1016/j.tins.2006.07.004](https://doi.org/10.1016/j.tins.2006.07.004)
- Nicolelis, M. A., & Lebedev, M. A. (2009). <i>Principles of neural ensemble physiology underlying the operation of brain-machine interfaces.</i> Nature Reviews Neuroscience, 10, 530–540. [doi.org/10.1038/nrn2653](https://doi.org/10.1038/nrn2653)
- Carmena, J. M., Lebedev, M. A., Crist, R. E., O’Doherty, J. E., Santucci, D. M., Dimitrov, D. F., Patil, P. G., Henriquez, C. S., & Nicolelis, M. A. (2003). <i>Learning to control a brain-machine interface for reaching and grasping by primates.</i> PLoS Biology, 1, e42. [doi.org/10.1371/journal.pbio.0000042](https://doi.org/10.1371/journal.pbio.0000042)
- Velliste, M., Perel, S., Spalding, M. C., Whitford, A. S., & Schwartz, A. B. (2008). <i>Cortical control of a prosthetic arm for self-feeding.</i> Nature, 453, 1098–1101. [doi.org/10.1038/nature06996](https://doi.org/10.1038/nature06996)
- Johansson, R. S., & Westling, G. (1984). <i>Roles of glabrous skin receptors and sensorimotor memory in automatic control of precision grip when lifting rougher or more slippery objects.</i> Experimental Brain Research, 56, 550–564. [doi.org/10.1007/BF00237997](https://doi.org/10.1007/BF00237997)
- Lederman, S. J., & Klatzky, R. L. (1987). <i>Hand movements: a window into haptic object recognition.</i> Cognitive Psychology, 19, 342–368. [doi.org/10.1016/0010-0285(87)90008-9](<https://doi.org/10.1016/0010-0285(87)90008-9>)
- Romo, R., Hernández, A., Zainos, A., & Salinas, E. (1998). <i>Somatosensory discrimination based on cortical microstimulation.</i> Nature, 392, 387–390. [doi.org/10.1038/32891](https://doi.org/10.1038/32891)
- Fitzsimmons, N. A., Drake, W., Hanson, T. L., Lebedev, M. A., & Nicolelis, M. A. (2007). <i>Primate reaching cued by multichannel spatiotemporal cortical microstimulation.</i> Journal of Neuroscience, 27, 5593–5602. [doi.org/10.1523/JNEUROSCI.5297-06.2007](https://doi.org/10.1523/JNEUROSCI.5297-06.2007)
- Li, Z., O’Doherty, J. E., Hanson, T. L., Lebedev, M. A., Henriquez, C. S., & Nicolelis, M. A. (2009). <i>Unscented Kalman filter for brain-machine interfaces.</i> PLoS ONE, 4, e6243. [doi.org/10.1371/journal.pone.0006243](https://doi.org/10.1371/journal.pone.0006243)
- Graziano, M. S., Cooke, D. F., & Taylor, C. S. (2000). <i>Coding the location of the arm by sight.</i> Science, 290, 1782–1786. [doi.org/10.1126/science.290.5497.1782](https://doi.org/10.1126/science.290.5497.1782)
- Maravita, A., & Iriki, A. (2004). <i>Tools for the body (schema).</i> Trends in Cognitive Sciences, 8, 79–86. [doi.org/10.1016/j.tics.2003.12.008](https://doi.org/10.1016/j.tics.2003.12.008)
- 图 1–4 取自 O’Doherty 等（2011）的 Nature 发表图。
