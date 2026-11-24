---
title: "readApaper#32 Real-time reinforcement for human-machine interface control"
title_zh: "readApaper#32 Real-time reinforcement for human-machine interface control"
date: 2026-11-18 22:00:00
tags:
  - readApaper
  - neuroengineering
  - human-machine-interface
  - reinforcement-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 18 November 2026 · Neuron, 2026</i>

When a person controls a machine with muscle force, they usually correct as they go, using what they can see and feel. This paper asks what happens if, during the movement itself, they also receive a simple success-or-failure signal—especially when those sensory cues are incomplete.

## Background

A <b>human-machine interface</b> (HMI) is any setup in which a person must produce a sequence of motor commands to make an external device do something useful: move a cursor, squeeze a prosthetic hand, or play a rehabilitation game. In everyday reaching and grasping, the nervous system can lean on two kinds of <b>sensory feedback</b>. Vision shows where the hand or cursor is relative to the goal. <b>Somatosensation</b>—touch and proprioception—reports how much force is being applied and how the limb is configured. Both streams are used for ongoing correction: if the cursor drifts off the target, the command is adjusted on the fly.

In many interfaces, that information is incomplete. The task itself may hide the relevant cues—for example, when precise grip force is needed but the contact surface is hard to see. The user’s condition may also limit sensation: a substantial fraction of people after stroke have somatosensory or visual impairment. Artificial sensory feedback can be added, but it is often delayed, noisy, or incomplete. Motor rehabilitation also has to stay engaging over long practice.

A second kind of information is <b>reinforcement feedback</b>: an explicit signal that the current action is succeeding or failing. Sensory feedback is typically vectorial—it tells you the direction and size of an error, and you still have to evaluate it. Reinforcement is scalar or binary: a simple “good” or “not good,” often with motivational value. In classical work on reinforcement learning, an agent uses such outcomes to choose among discrete actions. Related processes also operate in motor skill learning, where people refine the kinematics of a movement through practice.

Many laboratory studies of motor reinforcement deliver that success signal only after a movement has ended. Continuous interface control is different: the command is being updated throughout a several-second action, so a signal that arrives only at the end may come too late to steer the current trial. The idea in this paper is to give reinforcement <b>in real time</b>, while the person is still tracking. The learner here is the human user. The interface’s mapping from muscle activity to cursor motion is not itself being trained by a machine-learning algorithm.

## Problem

The practical question is how to improve HMI control when visual or somatosensory feedback is limited, and whether a short bout of practice can leave a trace that is still there when the extra signal is removed.

Vassiliadis and colleagues test a personalized, closed-loop rule that paints success and failure onto the target during a force-tracking task. They ask whether this real-time reinforcement improves online force control, whether the benefit is larger when sensory feedback is sparse, whether it generalizes from a handgrip to an EMG interface, and whether it appears in chronic stroke. They also ask whether any improvement survives in later tests that use full sensory feedback and no reinforcement—that is, whether there is <b>retention</b>.

## Method

Participants tracked a moving target for 7 seconds with a cursor. In most experiments they squeezed a handgrip force sensor; the cursor rose in proportion to grip force, and the force needed to reach the top of the screen was set at 4% of each person’s maximum voluntary contraction (MVC). In one experiment the cursor was controlled by isometric contractions of the right biceps, recorded with surface electromyography (EMG). The quantity of interest was <b>error</b>: the average absolute difference between the applied force and the force required to sit at the center of the target, expressed as a percentage of MVC.

Two kinds of feedback could be on at once, and they did different jobs. Continuous sensory feedback told participants where the cursor was and, in the EMG experiment, how much force was being applied to the palm. Real-time reinforcement told them whether the current sample counted as a success. In <b>Reinf ON</b> trials, the target turned green or red throughout the trial. In the main closed-loop schedule (exp 1 and 3–5), a force sample recorded at the screen refresh rate was labeled successful if its error was below the median error, at that same time point, over the previous three trials (four trials in exp 3), or if the cursor was already extremely close to the center (error below 0.2% of MVC). The rule is therefore personalized and constantly updated: to stay in the green, participants had to beat their own recent performance, and success occurred about half the time. In <b>Reinf OFF</b> trials, the target flipped between cyan and magenta at random, with matched luminance and a similar rate of color change, and participants were told that this coloring was uninformative and could be ignored.

Vision of the cursor was manipulated by hiding it in random 0.5-second bins after the first second of the trial. The target itself always stayed visible, and participants were asked to keep tracking. <b>Vision Full</b> showed the cursor for the entire 7 seconds; <b>Vision High</b> showed it for 5.5 seconds (about 79% of the trial); <b>Vision Low</b> showed it for 2.5 seconds (about 35%). Pre- and post-training assessments used Test trials: a gray target, full vision of the cursor, and no reinforcement. Those tests measure what was retained when both the sensory restriction and the success signal were removed.

![Figure 1. The force-tracking task and the five experiments. (A) In most experiments, participants squeezed a handgrip to move a cursor toward a moving target. (B) During training, the target could turn green or red to signal success or failure (Reinf ON), or cyan or magenta at random (Reinf OFF). Pre- and post-training tests used a gray target, full vision of the cursor, and no reinforcement. (C) Design of exp 1–5, including who took part and how vision or touch was varied. (D) Example force traces: under low vision, cursor visibility and reinforcement appear only in intermittent windows. From Vassiliadis et al. (2026), Figure 1.](/img/readApaper-32/fig1-task-protocol.jpg)

<i>Figure 1. The force-tracking task and the five experiments. (A) In most experiments, participants squeezed a handgrip to move a cursor toward a moving target. (B) During training, the target could turn green or red to signal success or failure (Reinf ON), or cyan or magenta at random (Reinf OFF). Pre- and post-training tests used a gray target, full vision of the cursor, and no reinforcement. (C) Design of exp 1–5, including who took part and how vision or touch was varied. (D) Example force traces: under low vision, cursor visibility and reinforcement appear only in intermittent windows. From Vassiliadis et al. (2026), Figure 1.</i>

## Experiments

Five experiments enrolled 106 people: 88 right-handed healthy adults and 18 chronic stroke patients. Healthy participants used the right (dominant) hand; patients used the affected hand. Error during training indexed online control. The change from pre- to post-training tests indexed retention. Condition order was balanced so that Reinf ON and Reinf OFF were paired within the same sensory setting.

In exp 1, 24 healthy adults completed six blocks on a handgrip. Each block used a new target path and one combination of vision (Full, High, or Low) with reinforcement (ON or OFF). Training lasted 18 trials, which is the “fewer than 20 reinforcement trials” referred to in the paper; each block also had 3 pre-training and 9 post-training Test trials. Exp 2 used the same 24 people immediately afterward. They continued the last pattern for about 150 trials in total, both to test whether performance had already hit a ceiling and to re-test reinforcement at six interleaved vision levels (from 100% down to 14% of the trial). Because those trial types were mixed within a block, exp 2 used a fixed, open-loop success rule: the target was green when the cursor was inside it (error below 0.4% of MVC). Exp 2 was not designed to measure retention separately for each vision level. Exp 3 was a between-subject replication of the Vision Low condition in another 24 healthy adults (24 training trials per block); some of those data came from a sham-stimulation condition collected in an MRI setting.

Exp 4 asked whether the same idea generalizes when somatosensation is limited. Forty healthy adults controlled the cursor with isometric right-biceps EMG, which was set so that 20% of MVC reached the top of the screen. To reduce natural proprioception, they were asked not to move the forearm. Artificial tactile feedback was delivered to the palm by a servo-motor whose angle was linearly mapped to the applied force at 60 Hz; the hand was covered and white noise masked the motor sound. Vision, touch, or both could be reduced to 35% of the trial, giving four sensory conditions (V+T+, V+T−, V−T+, V−T−), each with Reinf ON and Reinf OFF—eight blocks of 18 training trials, with 3 pre- and 3 post-training tests.

Exp 5 was a pilot in 18 people with a first-ever unilateral stroke more than three months earlier and an upper-limb motor deficit (mean age 58.6 years). They performed the handgrip task with the paretic hand, in Vision Full or Vision Low, with or without reinforcement (18 training trials, with a short break every 6 trials; 3 pre- and 6 post-training tests). Target-path difficulty was personalized at the start of the session.

## Results

Reducing vision made the task harder, as expected. In exp 1, real-time reinforcement improved online control at every vision level (all p \< 0.001), but the benefit was much larger when the cursor was often hidden: Cohen’s d was 0.94 in Vision Low, versus 0.32 in Vision Full and 0.29 in Vision High (Figure 2B). After training, error on the full-vision, no-reinforcement tests fell to 89.1% ± 1.18% of the pre-training level in 23 of 24 participants (p \< 0.001). That retention benefit of Reinf ON was significant only after Vision Low practice (p \< 0.001, d = −0.33), not after Vision Full (p = 0.60) or Vision High (p = 0.50; Figure 2D). When reinforcement was absent, Vision Low training also left worse retention than the more complete vision conditions; with reinforcement, that disruption was not observed.

![Figure 2. Main results of exp 1 in 24 healthy participants. (A) Tracking error over a block, then the same data normalized to each person’s pre-training level. The gap between Reinf ON and Reinf OFF is largest when vision of the cursor is low. (B) Online control: reinforcement reduced error at every vision level, but the effect was much larger in Vision Low (Cohen’s d = 0.94) than in Vision Full or Vision High (d = 0.32 and 0.29). (C, D) Retention on later tests with full vision and no reinforcement: post-training error fell to 89.1% of the pre-training level overall, and the reinforcement benefit on retention was significant only after Vision Low training. From Vassiliadis et al. (2026), Figure 2.](/img/readApaper-32/fig2-exp1-results.jpg)

<i>Figure 2. Main results of exp 1 in 24 healthy participants. (A) Tracking error over a block, then the same data normalized to each person’s pre-training level. The gap between Reinf ON and Reinf OFF is largest when vision of the cursor is low. (B) Online control: reinforcement reduced error at every vision level, but the effect was much larger in Vision Low (Cohen’s d = 0.94) than in Vision Full or Vision High (d = 0.32 and 0.29). (C, D) Retention on later tests with full vision and no reinforcement: post-training error fell to 89.1% of the pre-training level overall, and the reinforcement benefit on retention was significant only after Vision Low training. From Vassiliadis et al. (2026), Figure 2.</i>

Exp 2 showed that the modest reinforcement effect under full or high vision in exp 1 was not simply a ceiling. After about 150 trials on one pattern, participants reduced error by a further 18.7% relative to pre-training, more than after the first 18-trial block (p \< 0.001). When six vision levels were interleaved, reinforcement improved control at Vision 57%, 35%, and 14% (p ≤ 0.001), but not at the three highest levels (all p > 0.17). Exp 3 reproduced the Vision Low benefit on control and retention in a separate cohort.

In the EMG experiment, withdrawing touch, vision, or both all increased error, confirming that the artificial tactile signal was being used. Reinforcement did not improve control when both senses were fully available (p = 0.79). It did reduce error when touch was limited (p = 0.046, d = −0.11), when vision was limited (p \< 0.001, d = −0.18), and when both were limited (p \< 0.001, d = −0.36; Figure 4C). Overall retention after this short training was not significant (post-training error was not reliably below pre-training, p = 0.73). Looking by condition, Reinf ON improved later performance when vision was low but touch remained (p = 0.046, d = −0.26), and it had the opposite effect when both vision and touch were reduced (p = 0.007, d = 0.35). Those retention contrasts rest on only three post-training trials per block.

![Figure 4. Exp 4: an EMG interface and artificial tactile feedback (n = 40; statistics on n = 39). (A) Isometric biceps contraction controlled the cursor, while a servo-motor on the palm delivered force-mapped tactile feedback. (B, C) Online control: withdrawing vision, touch, or both raised error, and real-time reinforcement reduced that error only when at least one sensory channel was limited. (D, E) Retention after short training was small overall; reinforcement improved later performance when vision was low but touch remained, and the opposite pattern appeared when both were reduced. From Vassiliadis et al. (2026), Figure 4.](/img/readApaper-32/fig4-exp4-emg.jpg)

<i>Figure 4. Exp 4: an EMG interface and artificial tactile feedback (n = 40; statistics on n = 39). (A) Isometric biceps contraction controlled the cursor, while a servo-motor on the palm delivered force-mapped tactile feedback. (B, C) Online control: withdrawing vision, touch, or both raised error, and real-time reinforcement reduced that error only when at least one sensory channel was limited. (D, E) Retention after short training was small overall; reinforcement improved later performance when vision was low but touch remained, and the opposite pattern appeared when both were reduced. From Vassiliadis et al. (2026), Figure 4.</i>

In the stroke cohort, reinforcement again interacted with vision. Under Vision Low, the mean error change with Reinf ON versus Reinf OFF was −24.14% ± 12.60%, a significant improvement in online control (p \< 0.001, d = −0.46). Under Vision Full, the same comparison went the other way: error increased by 6.22% ± 4.78% (p = 0.016, d = 0.24; Figure 5B). Unlike the healthy groups in exp 1, patients did not show learning on the post-training tests (average post-training error 104.69% ± 4.78% of pre-training), and reinforcement did not significantly change that retention pattern (p = 0.19; Figure 5C).

![Figure 5. Exp 5 in 18 chronic stroke patients, using the paretic hand. (A) Error across pre-training, training, and post-training under Vision Full and Vision Low. (B) Online control: reinforcement reduced error under Vision Low (mean change −24.14%) but increased it under Vision Full. (C) Retention: post-training error stayed near the pre-training level, and reinforcement did not reliably change that. From Vassiliadis et al. (2026), Figure 5.](/img/readApaper-32/fig5-exp5-stroke.jpg)

<i>Figure 5. Exp 5 in 18 chronic stroke patients, using the paretic hand. (A) Error across pre-training, training, and post-training under Vision Full and Vision Low. (B) Online control: reinforcement reduced error under Vision Low (mean change −24.14%) but increased it under Vision Full. (C) Retention: post-training error stayed near the pre-training level, and reinforcement did not reliably change that. From Vassiliadis et al. (2026), Figure 5.</i>

Two further analyses asked how the signal was used. In both healthy participants (exp 1 and 3 pooled, n = 48) and patients, questionnaire scores of sensitivity to reward and punishment interacted with Reinf TYPE under Vision Low: higher sensitivity was associated with lower error when reinforcement was on, but not when it was off. Separately, an information-theoretic measure of feedback control—how much the recent target position informs the cursor, after a visuomotor delay—fell when vision was reduced, and reinforcement restored it, especially in Vision Low (p \< 0.001, d = 0.42 in exp 1), with replications in exp 2 and 3 (Figure 7A–C). Acceleration after a 250 ms delay also became more clearly split between success and failure under low vision. In that condition, reinforcement reduced variability after success (p \< 0.001, d = 0.60) without changing variability after failure, a pattern the authors describe as exploitation of successful commands rather than exploration after errors. Larger reductions in variability after success were associated with larger retention gains in Vision Low (R² = 0.21, p = 0.036; Figure 7G).

![Figure 7. How real-time reinforcement was used. (A–C) An information-theoretic measure of feedback control fell when vision was reduced, and reinforcement restored it, especially at low vision, in exp 1–3. (D–F) After a typical 250 ms visuomotor delay, low-vision reinforcement widened the difference between success- and failure-related accelerations and reduced variability after success, a pattern the authors interpret as exploitation of successful commands. (G) Larger reductions in variability after success were associated with larger retention gains in Vision Low. From Vassiliadis et al. (2026), Figure 7.](/img/readApaper-32/fig7-mechanisms.jpg)

<i>Figure 7. How real-time reinforcement was used. (A–C) An information-theoretic measure of feedback control fell when vision was reduced, and reinforcement restored it, especially at low vision, in exp 1–3. (D–F) After a typical 250 ms visuomotor delay, low-vision reinforcement widened the difference between success- and failure-related accelerations and reduced variability after success, a pattern the authors interpret as exploitation of successful commands. (G) Larger reductions in variability after success were associated with larger retention gains in Vision Low. From Vassiliadis et al. (2026), Figure 7.</i>

## Analysis

The results line up along three related claims, and they are worth keeping separate.

The first is about <b>online control</b> while the extra signal is present. Across a handgrip interface and an EMG interface, and in both young healthy adults and chronic stroke patients, real-time reinforcement reduced tracking error most clearly when continuous sensory feedback was sparse. When vision and touch were both fully available, the same green-and-red signal added little in healthy participants and, in patients, slightly worsened control. The mechanistic measurements give a coherent account of the low-vision benefit: people relied more on the explicit success signal when the cursor was often hidden, they recovered a form of feedback control that vision had taken away, and they stabilized commands that had just been marked as successful. The questionnaire interaction further ties the training effect to individual sensitivity to incentives, rather than to the colors simply serving as another visual cue about cursor position.

The second is about <b>retention</b>, measured later with full vision and no reinforcement. In healthy participants, 18 trials with real-time reinforcement were enough to leave a lower error after Vision Low practice. In the EMG experiment, that later benefit appeared when touch was still available during low-vision training, and it reversed when both vision and touch were withdrawn. Immediate gains in control and later gains in retention therefore do not automatically travel together, and somatosensation may matter more for the second than for the first.

The third is the <b>stroke result</b>, which is specifically about those two timescales. With a short, personalized protocol, patients improved online force control under limited vision, in the same direction as the healthy groups. That same short training did not produce retention, and adding reinforcement under full vision did not help. The paper therefore supports real-time reinforcement as a way to improve control during practice when vision is limited, including in this chronic stroke cohort; it does not show a lasting skill gain in patients after this amount of training.

Throughout, the success signal is a feedback policy for the person. It is updated from recent error, delivered during the trial, and used by the user to adjust their own motor commands. The cursor mapping is fixed.

## Summary

The usable picture is compact. In a continuous force-tracking interface, a personalized green-or-red success signal, given while the movement is still unfolding, can improve online control when vision or touch is limited, and in healthy participants it can leave a residual benefit after the signal is turned off. The same short protocol improved control in chronic stroke patients under low vision, without producing retention. The signal works alongside continuous sensory feedback, not as a substitute for it, and it is used by the person to stabilize successful commands.

## References

- Vassiliadis, P., Pinheiro, D. L., Fleury, L., Zenon, A., Esparza-Iaizzo, M., Ingster, A., Micera, S., Shokur, S., & Hummel, F. C. (2026). <i>Real-time reinforcement for human-machine interface control.</i> Neuron, 114, 3901–3917. Published online 2026-06-15. [doi.org/10.1016/j.neuron.2026.05.009](https://doi.org/10.1016/j.neuron.2026.05.009) · [Article](<https://www.cell.com/neuron/fulltext/S0896-6273(26)00380-6>)
- Figures 1, 2, 4, 5, and 7 are from Vassiliadis et al. (2026).
- Experiment 1 data and analysis code: [zenodo.org/records/20594184](https://zenodo.org/records/20594184)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-18 · Neuron, 2026</i>

当一个人用肌肉力量去控制一台机器时，通常会边做边改，依据当时能看见和感觉到的信息。这篇论文问的是：如果在动作进行的同时，再给一个简单的成功/失败信号，尤其是在这些感觉线索并不完整的时候，会发生什么。

## 背景

<b>人机接口</b>（human-machine interface, HMI）是指人必须发出一连串运动指令，才能让外部装置完成有用动作的任何设置：移动光标、让假手握紧，或进行康复游戏。在日常的伸手和抓握中，神经系统可以依靠两类<b>感觉反馈</b>。视觉告诉你手或光标相对目标在哪里。<b>躯体感觉</b>——触压觉和本体感觉——报告正在用多大的力、肢体处于何种姿态。这两路信息都用于持续校正：如果光标偏离目标，指令就会被即时调整。

在许多接口里，这些信息并不完整。任务本身就可能藏起相关线索，例如需要精细握力、接触面却看不清。使用者的病情也可能限制感觉：卒中后相当一部分人会有躯体感觉或视觉损害。即使加上人工感觉反馈，也常常有延迟、噪声或不完整。运动康复还需要在长时间练习中保持参与感。

第二类信息是<b>强化反馈</b>：一个明确告诉你当前动作是成功还是失败的信号。感觉反馈通常是矢量性的——它给出误差的方向和大小，你还需要自己去判断。强化则是标量或二值的：简单的“好”或“不好”，并常常带有动机价值。在经典的强化学习研究中，智能体用这类结果在离散动作中做选择。类似过程也出现在运动技能学习里，人们通过练习逐步改进动作的运动学。

许多运动强化实验只在动作结束之后才给出成功信号。连续的接口控制则不同：指令会在数秒的动作过程中不断更新，只在结束时到达的信号，可能已经来不及引导当前这一次试验。本文的想法，是在人还在追踪的时候，就<b>实时</b>给出强化。这里的学习者是使用者本人。接口把肌肉活动映射到光标运动的规则，并不是由机器学习算法在训练。

## 问题

实际问题是：当视觉或躯体感觉反馈受限时，怎样改善人机接口控制；以及短时间练习能否留下痕迹，在额外信号被撤掉之后仍然存在。

Vassiliadis 和同事检验了一套个性化的闭环规则，在力追踪任务进行过程中，把成功和失败画到目标上。他们问：这种实时强化能否改善在线力控制；当感觉反馈稀缺时收益是否更大；它能否从握力计推广到肌电接口；以及在慢性卒中中是否同样出现。他们还问：改善能否在之后那些使用完整感觉反馈、且不再给强化的测试中保留下来，也就是是否存在<b>保持</b>（retention）。

## 方法

被试在 7 秒内用光标追踪一个移动目标。多数实验中，他们捏一个握力传感器；光标随握力成比例上升，到达屏幕顶端所需的力被设为每人最大自主收缩（MVC）的 4%。在一项实验中，光标由右侧肱二头肌的等长收缩控制，用表面肌电图（EMG）记录。关注的指标是<b>误差</b>：施加的力与使光标落在目标中心所需的力之间的平均绝对差，以 MVC 的百分比表示。

两类反馈可以同时存在，但职责不同。连续感觉反馈告诉被试光标在哪里，在肌电实验中还告诉手掌被施加了多大的力。实时强化则告诉他们当前样本是否算成功。在 <b>Reinf ON</b> 试验中，目标在整个试验过程中会变绿或变红。在主要的闭环规则（实验 1 以及 3–5）里，按屏幕刷新率记录的力样本，若其误差低于前三次试验在同一时间点的误差中位数（实验 3 为前四次），或光标已经非常靠近中心（误差低于 MVC 的 0.2%），就被标为成功。因此这套规则是个性化的、不断更新的：要保持绿色，被试必须超过自己最近的表现，成功大约占一半时间。在 <b>Reinf OFF</b> 试验中，目标在青色和品红之间随机切换，亮度和颜色变化频率与强化条件相匹配，并明确告诉被试这种颜色没有信息，可以忽略。

光标视觉的操纵方式，是在试验的第一秒之后，按随机的 0.5 秒小段把光标藏起来。目标本身始终可见，并要求被试继续追踪。<b>Vision Full</b> 在全部 7 秒都显示光标；<b>Vision High</b> 显示 5.5 秒（约 79% 的试验时间）；<b>Vision Low</b> 显示 2.5 秒（约 35%）。训练前后的评估使用 Test 试验：灰色目标、完整的光标视觉、没有强化。这些测试衡量的是，当感觉限制和成功信号都被撤掉之后，还留下了什么。

![图 1. 力追踪任务与五项实验。(A) 在多数实验中，被试通过捏握力传感器，把光标推向一个移动的目标。(B) 训练时，目标可变绿或变红以表示成功或失败（Reinf ON），或随机变为青色或品红（Reinf OFF）。训练前后的测试使用灰色目标、完整的光标视觉，并且没有强化反馈。(C) 实验 1–5 的设计，包括被试构成以及视觉或触觉如何被改变。(D) 示例力曲线：在低视觉条件下，光标可见性和强化反馈只在间断的时间窗里出现。取自 Vassiliadis 等（2026）Figure 1。](/img/readApaper-32/fig1-task-protocol.jpg)

<i>图 1. 力追踪任务与五项实验。(A) 在多数实验中，被试通过捏握力传感器，把光标推向一个移动的目标。(B) 训练时，目标可变绿或变红以表示成功或失败（Reinf ON），或随机变为青色或品红（Reinf OFF）。训练前后的测试使用灰色目标、完整的光标视觉，并且没有强化反馈。(C) 实验 1–5 的设计，包括被试构成以及视觉或触觉如何被改变。(D) 示例力曲线：在低视觉条件下，光标可见性和强化反馈只在间断的时间窗里出现。取自 Vassiliadis 等（2026）Figure 1。</i>

## 实验

五项实验共纳入 106 人：88 名右利手健康成年人和 18 名慢性卒中患者。健康被试使用右侧（优势）手，患者使用患侧手。训练中的误差反映在线控制；训练前到训练后测试的变化反映保持。条件顺序经过平衡，使 Reinf ON 与 Reinf OFF 在同一感觉设置下成对出现。

实验 1 中，24 名健康成年人在握力计上完成 6 个组块。每个组块使用一条新的目标轨迹，以及视觉（Full、High 或 Low）与强化（ON 或 OFF）的一种组合。训练为 18 次试验，也就是文中所说的“不到 20 次强化试验”；每个组块还有 3 次训练前和 9 次训练后的 Test 试验。实验 2 紧接着用同一批 24 人进行。他们把最后一条轨迹继续练到总共约 150 次，既检验表现是否已经触及天花板，也在六个交错的视觉水平（从 100% 降到 14%）上再次检验强化。由于这些试验类型在组块内混合，实验 2 使用固定的开环成功规则：光标落在目标内（误差低于 MVC 的 0.4%）时目标为绿色。实验 2 并非为分别测量每个视觉水平的保持而设计。实验 3 是在另外 24 名健康成年人中对 Vision Low 条件的被试间重复（每组块 24 次训练试验）；其中部分数据来自在磁共振环境中采集的伪刺激对照条件。

实验 4 问的是：当躯体感觉受限时，同一思路能否推广。40 名健康成年人用右侧肱二头肌的等长肌电控制光标，使 MVC 的 20% 到达屏幕顶端。为减少自然本体感觉，要求他们不要移动前臂。人工触觉由手掌上的伺服电机提供，其转角以 60 Hz 线性映射到所施之力；手被遮住，白噪声掩盖电机声音。视觉、触觉或两者都可以减到试验时间的 35%，形成四种感觉条件（V+T+、V+T−、V−T+、V−T−），再各配 Reinf ON 和 Reinf OFF，共 8 个组块、每块 18 次训练，另有 3 次训练前和 3 次训练后测试。

实验 5 是一项试点，纳入 18 名首次单侧卒中超过三个月、并有上肢运动缺损的患者（平均年龄 58.6 岁）。他们用患侧手做握力任务，条件为 Vision Full 或 Vision Low，有或没有强化（18 次训练，每 6 次有一次短休息；3 次训练前和 6 次训练后测试）。目标轨迹的难度在开始时按个人调整。

## 结果

减少视觉会使任务变难，这符合预期。在实验 1 中，实时强化在所有视觉水平上都能改善在线控制（均 p \< 0.001），但当光标经常被隐藏时，收益大得多：Vision Low 的 Cohen’s d 为 0.94，而 Vision Full 和 Vision High 分别为 0.32 和 0.29（图 2B）。训练之后，在完整视觉、无强化的测试上，24 人中有 23 人的误差降到训练前水平的 89.1% ± 1.18%（p \< 0.001）。Reinf ON 对保持的这一益处，只在 Vision Low 练习之后显著（p \< 0.001，d = −0.33），而在 Vision Full（p = 0.60）或 Vision High（p = 0.50）之后不显著（图 2D）。没有强化时，Vision Low 训练留下的保持也差于视觉更完整的条件；有强化时，这种破坏没有再出现。

![图 2. 实验 1 在 24 名健康被试中的主要结果。(A) 一个组块内的追踪误差，以及按每人训练前水平标准化后的同一数据。Reinf ON 与 Reinf OFF 之间的差距，在光标视觉较低时最大。(B) 在线控制：强化在所有视觉水平上都能降低误差，但在 Vision Low 中效应量大得多（Cohen’s d = 0.94），而 Vision Full 和 Vision High 分别为 0.32 和 0.29。(C, D) 在随后进行的、具有完整视觉且无强化的测试上的保持：总体上，训练后误差降到训练前水平的 89.1%；强化对保持的益处仅在 Vision Low 训练之后显著。取自 Vassiliadis 等（2026）Figure 2。](/img/readApaper-32/fig2-exp1-results.jpg)

<i>图 2. 实验 1 在 24 名健康被试中的主要结果。(A) 一个组块内的追踪误差，以及按每人训练前水平标准化后的同一数据。Reinf ON 与 Reinf OFF 之间的差距，在光标视觉较低时最大。(B) 在线控制：强化在所有视觉水平上都能降低误差，但在 Vision Low 中效应量大得多（Cohen’s d = 0.94），而 Vision Full 和 Vision High 分别为 0.32 和 0.29。(C, D) 在随后进行的、具有完整视觉且无强化的测试上的保持：总体上，训练后误差降到训练前水平的 89.1%；强化对保持的益处仅在 Vision Low 训练之后显著。取自 Vassiliadis 等（2026）Figure 2。</i>

实验 2 表明，实验 1 中在完整或高视觉下较小的强化效应，并不是因为已经到了天花板。在同一条轨迹上练到约 150 次后，被试相对训练前又把误差多降低了 18.7%，超过最初 18 次训练后的水平（p \< 0.001）。当六个视觉水平交错出现时，强化在 Vision 57%、35% 和 14% 改善了控制（p ≤ 0.001），但在三个最高水平上没有改善（均 p > 0.17）。实验 3 在另一组被试中重复了 Vision Low 对控制和保持的益处。

在肌电实验中，撤去触觉、视觉或两者都会增加误差，说明人工触觉信号确实被用到了。当两种感觉都完整时，强化没有改善控制（p = 0.79）。当触觉受限（p = 0.046，d = −0.11）、视觉受限（p \< 0.001，d = −0.18），或两者都受限（p \< 0.001，d = −0.36）时，它降低了误差（图 4C）。这段短训练后的总体保持不显著（训练后误差并未可靠地低于训练前，p = 0.73）。按条件看，当视觉较低但触觉仍在时，Reinf ON 改善了随后的表现（p = 0.046，d = −0.26）；当视觉和触觉都被减弱时，则出现相反效果（p = 0.007，d = 0.35）。这些保持比较每个组块只有三次训练后试验。

![图 4. 实验 4：肌电接口与人工触觉反馈（n = 40；统计为 n = 39）。(A) 等长肱二头肌收缩控制光标，同时手掌上的伺服电机提供与力度映射的触觉反馈。(B, C) 在线控制：撤去视觉、触觉或两者都会提高误差；实时强化仅在至少一种感觉通道受限时降低误差。(D, E) 短训练后的总体保持很小；当视觉较低但触觉仍在时，强化改善了随后的表现，而当两者都被减弱时则出现相反模式。取自 Vassiliadis 等（2026）Figure 4。](/img/readApaper-32/fig4-exp4-emg.jpg)

<i>图 4. 实验 4：肌电接口与人工触觉反馈（n = 40；统计为 n = 39）。(A) 等长肱二头肌收缩控制光标，同时手掌上的伺服电机提供与力度映射的触觉反馈。(B, C) 在线控制：撤去视觉、触觉或两者都会提高误差；实时强化仅在至少一种感觉通道受限时降低误差。(D, E) 短训练后的总体保持很小；当视觉较低但触觉仍在时，强化改善了随后的表现，而当两者都被减弱时则出现相反模式。取自 Vassiliadis 等（2026）Figure 4。</i>

在卒中队列中，强化再次与视觉发生交互。在 Vision Low 下，Reinf ON 相对 Reinf OFF 的平均误差变化为 −24.14% ± 12.60%，在线控制显著改善（p \< 0.001，d = −0.46）。在 Vision Full 下，同一比较则相反：误差增加了 6.22% ± 4.78%（p = 0.016，d = 0.24；图 5B）。与实验 1 中的健康组不同，患者在训练后测试上没有表现出学习（平均训练后误差为训练前的 104.69% ± 4.78%），强化也没有显著改变这一保持模式（p = 0.19；图 5C）。

![图 5. 实验 5：18 名慢性卒中患者用患侧手完成任务。(A) 在 Vision Full 和 Vision Low 下，训练前、训练中和训练后的误差。(B) 在线控制：强化在 Vision Low 下降低误差（平均变化 −24.14%），但在 Vision Full 下反而提高误差。(C) 保持：训练后误差仍接近训练前水平，强化没有可靠地改变这一点。取自 Vassiliadis 等（2026）Figure 5。](/img/readApaper-32/fig5-exp5-stroke.jpg)

<i>图 5. 实验 5：18 名慢性卒中患者用患侧手完成任务。(A) 在 Vision Full 和 Vision Low 下，训练前、训练中和训练后的误差。(B) 在线控制：强化在 Vision Low 下降低误差（平均变化 −24.14%），但在 Vision Full 下反而提高误差。(C) 保持：训练后误差仍接近训练前水平，强化没有可靠地改变这一点。取自 Vassiliadis 等（2026）Figure 5。</i>

另外两项分析询问这个信号是如何被使用的。在健康被试（合并实验 1 和 3，n = 48）和患者中，奖励与惩罚敏感性问卷得分都与 Vision Low 下的 Reinf TYPE 发生交互：敏感性更高，在强化打开时误差更低，而在强化关闭时则不然。另一方面，一种信息论指标衡量的反馈控制——在一段视动延迟之后，近期目标位置对光标有多少信息——会随视觉减少而下降，而强化能把它补回来，尤其是在 Vision Low（实验 1 中 p \< 0.001，d = 0.42），并在实验 2 和 3 中得到重复（图 7A–C）。在 250 毫秒延迟之后的加速度，在低视觉下也更清楚地分成成功与失败两类。在该条件下，强化降低了成功之后的变异（p \< 0.001，d = 0.60），但不改变失败之后的变异，作者将此描述为对成功指令的利用，而不是失败后的探索。成功后变异下降得越多，Vision Low 中的保持收益也越大（R² = 0.21，p = 0.036；图 7G）。

![图 7. 实时强化是如何被使用的。(A–C) 一种信息论指标衡量的反馈控制，会随视觉减少而下降；强化能把它补回来，尤其是在低视觉时，这一模式在实验 1–3 中都出现了。(D–F) 在约 250 毫秒的典型视动延迟之后，低视觉下的强化拉大了成功与失败相关加速度分布的差别，并降低成功之后的变异，作者将此理解为对成功指令的利用。(G) 成功后变异下降得越多，Vision Low 中的保持收益也越大。取自 Vassiliadis 等（2026）Figure 7。](/img/readApaper-32/fig7-mechanisms.jpg)

<i>图 7. 实时强化是如何被使用的。(A–C) 一种信息论指标衡量的反馈控制，会随视觉减少而下降；强化能把它补回来，尤其是在低视觉时，这一模式在实验 1–3 中都出现了。(D–F) 在约 250 毫秒的典型视动延迟之后，低视觉下的强化拉大了成功与失败相关加速度分布的差别，并降低成功之后的变异，作者将此理解为对成功指令的利用。(G) 成功后变异下降得越多，Vision Low 中的保持收益也越大。取自 Vassiliadis 等（2026）Figure 7。</i>

## 分析

这些结果可以沿着三条相关的判断来看，最好分开记。

第一条关乎信号还在时的<b>在线控制</b>。在握力接口和肌电接口上，在年轻健康成年人和慢性卒中患者中，实时强化都在连续感觉反馈稀缺时最清楚地降低了追踪误差。当视觉和触觉都完整时，同样的绿红信号在健康被试中几乎没有增益，在患者中还略微使控制变差。机制测量为低视觉下的收益提供了一致的解释：光标经常被藏起来时，人们更依赖那个明确的成功信号；他们恢复了一种被视觉剥夺所削弱的反馈控制；并且把刚刚被标为成功的指令稳定下来。问卷上的交互还把训练效应与个体对激励的敏感性联系起来，而不是把颜色仅仅当成又一种关于光标位置的视觉线索。

第二条关乎<b>保持</b>，在后来使用完整视觉、且不再给强化的测试中测量。在健康被试中，18 次带实时强化的试验，就足以在 Vision Low 练习之后留下更低的误差。在肌电实验中，这一随后的益处出现在低视觉训练时触觉仍然保留的情况下；当视觉和触觉都被撤掉时，它发生了反转。因此，控制上的即时收益与保持上的随后收益并不自动同行，躯体感觉对后者的影响可能比对前者更大。

第三条是<b>卒中结果</b>，它特别关乎这两个时间尺度。在短而个性化的流程中，患者在有限视觉下改善了在线力控制，方向与健康组相同。同样这段短训练没有产生保持，在完整视觉下再加强化也没有帮助。因此，这篇论文支持把实时强化当作一种在视觉受限的练习中改善控制的方法，包括在这个慢性卒中队列中；它并没有表明，在这么多训练量之后，患者获得了持久的技能提升。

贯穿始终，成功信号是给“人”用的反馈策略。它根据近期误差更新，在试验过程中给出，由使用者用来调整自己的运动指令。光标映射是固定的。

## 总结

可以记住的图景很紧凑。在连续的力追踪接口中，一个个性化的绿/红成功信号，如果在动作仍在进行时给出，就能在视觉或触觉受限时改善在线控制；在健康被试中，关掉这个信号之后还可以留下残余益处。同一套短流程在低视觉下改善了慢性卒中患者的控制，但没有产生保持。这个信号是与连续感觉反馈一起工作的，而不是去替代它，并且被人用来把成功的指令稳定下来。

## 参考文献

- Vassiliadis, P., Pinheiro, D. L., Fleury, L., Zenon, A., Esparza-Iaizzo, M., Ingster, A., Micera, S., Shokur, S., & Hummel, F. C. (2026). <i>Real-time reinforcement for human-machine interface control.</i> Neuron, 114, 3901–3917。2026-06-15 在线发表。[doi.org/10.1016/j.neuron.2026.05.009](https://doi.org/10.1016/j.neuron.2026.05.009) · [论文页面](<https://www.cell.com/neuron/fulltext/S0896-6273(26)00380-6>)
- 图 1、2、4、5、7 取自 Vassiliadis 等（2026）。
- 实验 1 的数据与分析代码：[zenodo.org/records/20594184](https://zenodo.org/records/20594184)
