---
title: "readApaper#19 Value-guided attention links what we learn to how much we learn"
title_zh: "readApaper#19 Value-guided attention links what we learn to how much we learn"
date: 2026-11-05 22:00:00
tags:
  - readApaper
  - neuroscience
  - attention
  - reinforcement-learning
cover: /img/readapaper-cover.png
bilingual: true
mathjax: true
---

<i>Reading time: about 7 minutes · 5 November 2026 · bioRxiv preprint, 2026</i>

<b>After feedback, the brain has to answer two questions: which cue should get the credit, and how strongly should its value change?</b> Shahamati and Soltani argue that these are not separate problems. <b>Value-guided attention</b> — looking preferentially at some cues because of their worth and their relation to the choice — links what is learned to how much is learned.

## 1. Credit assignment and learning rate usually live in different boxes

Imagine you are deciding whether to turn left or right in a forest. A sign points right; a sound comes from the left. If the right turn works, which cue should be updated, and by how much? In reinforcement learning, these are often treated as two steps. <b>Credit assignment</b> decides which stimuli or actions are responsible for the outcome. The <b>learning rate</b> decides how large the value update should be.

A standard teaching equation is:

\[V_{j,t+1}=V_{j,t}+\alpha_{j,t}\,\delta_t\]

\(V_j\) is the estimated value of cue \(j\), \(\delta_t\) is the prediction error (how surprising the outcome was), and \(\alpha_{j,t}\) is that cue’s learning rate on this trial. The equation is here to make the idea precise; it is not a transcription of the paper’s fitted synaptic update. The authors’ proposal is that attention can change \(\alpha_{j,t}\), so different cues are not updated equally.

Why would that help? If every visible cue is updated at the same rate, the less informative cues can produce larger prediction errors and therefore move more. Over time, useful differences among competing cues get washed out. The hypothesis is that coupling credit assignment to the learning rate can protect those differences.

## 2. Predicting the weather from four shapes

Human participants predicted one of two weather outcomes, <b>windy</b> or <b>rainy</b>, from four simple shapes. The shapes could repeat in a display, and each shape carried a different amount of evidence for windy versus rainy. For each person, one outcome also had a higher prior probability (0.75 or 0.25), so it was the correct answer more often. After the choice, the screen showed whether the prediction was correct, and a reward bar was updated. Gaze was recorded throughout. In separate estimation trials, participants reported how strongly a cue, or a combination of cues, predicted each outcome.

People learned the task quickly. They chose the option with the higher posterior probability on 79% of trials, and performance approached its plateau after about 70 trials. The influence of individual cues on choice, measured as a subjective weight of evidence, also diverged in the correct order.

![Figure 1. Task and evidence that cue–outcome associations were learned. Panel a is the trial timeline: fixation, four cues plus the two weather options, then “correct” or “incorrect” feedback, with gaze recorded throughout. Panel b shows example cues and their evidence (log likelihood ratios) for the windy option, and the two possible priors. Panel c illustrates estimation trials, in which participants reported probabilities. Panel d shows that average performance rose quickly. Panels e–g show that the learned weights and reported posteriors followed the true ordering of the cues.](/img/readApaper-19/p19_fig1.jpg)

<i>Figure 1. Task and evidence that cue–outcome associations were learned. Panel a is the trial timeline: fixation, four cues plus the two weather options, then “correct” or “incorrect” feedback, with gaze recorded throughout. Panel b shows example cues and their evidence (log likelihood ratios) for the windy option, and the two possible priors. Panel c illustrates estimation trials, in which participants reported probabilities. Panel d shows that average performance rose quickly. Panels e–g show that the learned weights and reported posteriors followed the true ordering of the cues.</i>

## 3. Reward and no-reward update opposite kinds of cues

The team fitted a family of models to trial-by-trial choices. The baseline model used one learning rate for everything. Other models allowed different rates for reward versus no reward, or for cues that usually favor the high-prior option. The model that won was the <b>cue–choice congruency</b> model: the learning rate depends jointly on whether a cue supported or opposed the chosen option, and on whether the outcome was rewarded.

The pattern was systematic:

- After a <b>reward</b>, learning rates were higher for <b>congruent</b> cues (those that supported the chosen option) than for incongruent cues.
- After <b>no reward</b>, learning rates were higher for <b>incongruent</b> cues (those that opposed the chosen option).

This was not just a preference for the globally more rewarding option, and it was tied to the person’s actual choice rather than to an internal prediction alone. A separate control experiment with equal priors (rainy and windy equally likely) found the same asymmetry, so the result does not depend on one option being more common.

![Figure 2. Choice behavior is best explained by cue–choice congruency-dependent learning. In panel a, look at the light-blue “cue-choice congruency” row: it has the strongest overall support (higher EF and PXP, lower BIC). Panel b is the key result: on rewarded trials (green), the learning rate is higher for congruent than incongruent cues; on unrewarded trials (red), the pattern reverses. Panel c shows decision weights from the second-best model, which also includes extra weighting during choice.](/img/readApaper-19/p19_fig2.jpg)

<i>Figure 2. Choice behavior is best explained by cue–choice congruency-dependent learning. In panel a, look at the light-blue “cue-choice congruency” row: it has the strongest overall support (higher EF and PXP, lower BIC). Panel b is the key result: on rewarded trials (green), the learning rate is higher for congruent than incongruent cues; on unrewarded trials (red), the pattern reverses. Panel c shows decision weights from the second-best model, which also includes extra weighting during choice.</i>

## 4. Gaze during feedback tracks the same asymmetry

If attention is part of the learning rule, you should be able to see it. During the feedback period, participants looked more at congruent cues after a reward, and more at incongruent cues after no reward. Across people, the difference in dwell time between congruent and incongruent cues predicted the difference in learning rates (r = 0.25, p = 0.002). The same gaze pattern during the choice period, before feedback, did not predict the learning asymmetry. So the important window is the moment when the outcome is shown.

This is not only a correlation. In a follow-up session, the luminance of one weakly informative cue was briefly increased at feedback onset, making it blink and capture the eyes. That exogenous boost changed both where people looked and how learning rates were arranged. The disruption was especially clear when the highlighted cue usually supported the chosen option, the case that would most interfere with the normal tendency to look at opposing cues after a missed reward.

People with a stronger cue–choice congruency effect also kept competing cues more clearly separated, learned faster, and performed better, especially early in the experiment (high-congruency group: asymptotic performance 0.853, time constant 23.4 trials; low-congruency group: 0.814 and 46.2). In the authors’ account, selective updating counters a built-in problem: if every cue were updated equally, opposing cues would often move more because they generate larger prediction errors, and the useful contrast among cues would shrink.

![Figure 3. Gaze during feedback predicts the learning asymmetry and relates to robustness. Panels a–c: during feedback, dwell time favors congruent cues after reward and incongruent cues after no reward, and this gaze difference correlates with the learning-rate difference (panel c: r = 0.248, p = 0.0026). Panel d compares trial-by-trial updates with simpler models. Panels e–j: a stronger cue–choice congruency (CC) index goes with higher cue discriminability (f, Spearman’s ρ = 0.71), faster and better performance (e, g, h), and tighter alignment between objective evidence and choice, especially in the first 70 trials (i).](/img/readApaper-19/p19_fig3.jpg)

<i>Figure 3. Gaze during feedback predicts the learning asymmetry and relates to robustness. Panels a–c: during feedback, dwell time favors congruent cues after reward and incongruent cues after no reward, and this gaze difference correlates with the learning-rate difference (panel c: r = 0.248, p = 0.0026). Panel d compares trial-by-trial updates with simpler models. Panels e–j: a stronger cue–choice congruency (CC) index goes with higher cue discriminability (f, Spearman’s ρ = 0.71), faster and better performance (e, g, h), and tighter alignment between objective evidence and choice, especially in the first 70 trials (i).</i>

## Why this matters

Attention is easy to think of as a filter that decides what gets into a decision. Here it also acts as a control signal for learning: it helps decide which association is revised, and how large the revision is. The same logic offers a common home for several known learning asymmetries, including the tendency to update more from information that confirms a choice. Looking, choosing, and updating become one loop rather than three separate stages.

## Takeaway

- After reward, people learn more from cues that supported their choice; after no reward, they learn more from cues that opposed it.
- Gaze at feedback tracks this pattern, and changing a cue’s saliency can change the learning rates.
- The asymmetry helps keep competing predictive cues distinct, and people who show it more strongly learn faster and more accurately.

---

## References and resources

- Shahamati, A., & Soltani, A. (2026). <i>Value-guided attention links what we learn to how much we learn.</i> bioRxiv preprint, posted 28 August 2026. [Preprint](https://doi.org/10.64898/2026.08.25.747046) · [bioRxiv page](https://www.biorxiv.org/content/10.64898/2026.08.25.747046v1)
- Figures 1–3 are cropped from the preprint PDF for this private Notion draft. The preprint is posted as an unreviewed author manuscript; the bioRxiv page states that the copyright holder is the author/funder and that reuse is not allowed without permission. Please confirm rights before publishing these figures on the public blog.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-11-05 · bioRxiv preprint, 2026</i>

<b>一次反馈到来时，大脑要同时回答两个问题：这次结果该记在哪条线索上？这条线索的价值又该改动多少？</b> Shahamati 与 Soltani 认为，这两个问题并不是分开处理的。<b>价值引导的注意力（value-guided attention）</b>——因为线索的价值和它与当前选择的关系，而更多地去看某些线索——把“学什么”和“学多少”连在了一起。

## 1. 信用分配和学习率常常被放在两个抽屉里

想象你在森林里决定向左还是向右走。一块路标指向右边，左边又传来声音。如果向右走成功了，该更新哪条线索，又该更新多少？在强化学习里，这两步经常被分开处理。<b>信用分配（credit assignment）</b>决定哪些刺激或动作该为结果负责；<b>学习率（learning rate）</b>决定价值更新该有多大。

一个便于理解的公式是：

\[V_{j,t+1}=V_{j,t}+\alpha_{j,t}\,\delta_t\]

其中 \(V_j\) 是第 \(j\) 条线索的估计价值，\(\delta_t\) 是预测误差（结果有多出乎意料），\(\alpha_{j,t}\) 是这条线索在这一试次的学习率。这个公式用来把机制讲清楚，并不是直接抄自论文里拟合的突触更新规则。作者的核心想法是：注意力可以改变 \(\alpha_{j,t}\)，因此不同线索不会被同等更新。

这为什么可能有用？如果屏幕上每条线索都以相同学习率更新，信息量较小的线索往往会产生更大的预测误差，于是被改动得更多。时间一长，相互竞争的线索之间那些有用的差别就会被冲淡。作者的假设是：把信用分配和学习率耦合起来，反而能保护这些差别。

## 2. 用四个图形预测天气

人类被试要根据四个简单图形，预测两种天气结果：<b>有风（windy）</b>还是<b>下雨（rainy）</b>。图形可以重复出现，每条线索对“有风”或“下雨”的证据强度不同。对每个被试来说，其中一种结果还有更高的先验概率（0.75 或 0.25），因而更常是正确答案。选择之后，屏幕会显示预测是否正确，并更新一条奖励进度条。实验全程记录眼动。在另外的估计试次中，被试还要报告单个线索或线索组合在多大程度上预测某一种天气。

被试学得很快。他们在 79% 的试次中选中了后验概率更高的选项，大约 70 个试次后成绩接近平台。单个线索对选择的影响（主观证据权重）也按正确的顺序逐渐分开。

![Figure 1. 任务设置，以及线索–结果关联已被学会的证据。a 图是试次流程：先注视，再出现四条线索和两个天气选项，随后给出“正确”或“错误”反馈，全程记录注视。b 图是示例线索及其对“有风”的证据（对数似然比），以及两种可能的先验。c 图是估计试次，被试在其中报告概率。d 图显示平均成绩迅速上升。e–g 图说明，学到的权重和被试报告的后验都跟随了线索的真实排序。](/img/readApaper-19/p19_fig1.jpg)

<i>Figure 1. 任务设置，以及线索–结果关联已被学会的证据。a 图是试次流程：先注视，再出现四条线索和两个天气选项，随后给出“正确”或“错误”反馈，全程记录注视。b 图是示例线索及其对“有风”的证据（对数似然比），以及两种可能的先验。c 图是估计试次，被试在其中报告概率。d 图显示平均成绩迅速上升。e–g 图说明，学到的权重和被试报告的后验都跟随了线索的真实排序。</i>

## 3. 有奖励和没奖励，会更新相反类型的线索

研究团队用一组模型去拟合试次级选择。最简单的基线模型对所有更新使用同一个学习率；其他模型允许奖励与无奖励、或通常支持高先验选项的线索使用不同学习率。最终胜出的是<b>线索–选择一致性（cue–choice congruency）</b>模型：学习率同时取决于一条线索是支持还是反对刚才的选择，以及结果是否得到奖励。

模式很清楚：

- <b>得到奖励</b>后，<b>一致（congruent）</b>线索（支持刚才所选选项的线索）的学习率更高。
- <b>没有奖励</b>后，<b>不一致（incongruent）</b>线索（反对刚才所选选项的线索）的学习率更高。

这并不仅仅是更喜欢总体上更常赢的那个选项，而且与被试<b>实际做出的选择</b>有关，而不是只与内部预测有关。在另一组控制实验里，两种天气的先验概率相等，仍然出现了同样的不对称。因此，这一结果并不依赖于某一个选项更常见。

![Figure 2. 选择行为最好由依赖线索–选择一致性的学习来解释。请先看 a 图中浅蓝色的 “cue-choice congruency” 一行：它的总体支持最强（EF、PXP 更高，BIC 更低）。b 图是核心结果：奖励试次（绿）中，一致线索的学习率高于不一致线索；无奖励试次（红）中，模式反过来。c 图来自第二好的模型，它在选择阶段还加了额外的权重差异。](/img/readApaper-19/p19_fig2.jpg)

<i>Figure 2. 选择行为最好由依赖线索–选择一致性的学习来解释。请先看 a 图中浅蓝色的 “cue-choice congruency” 一行：它的总体支持最强（EF、PXP 更高，BIC 更低）。b 图是核心结果：奖励试次（绿）中，一致线索的学习率高于不一致线索；无奖励试次（红）中，模式反过来。c 图来自第二好的模型，它在选择阶段还加了额外的权重差异。</i>

## 4. 反馈阶段的注视，跟踪着同一种不对称

如果注意力真的参与了学习规则，那就应该能直接看到它。在反馈阶段，被试在得到奖励后更多地看一致线索，在没有奖励后更多地看不一致线索。在不同被试之间，对一致与不一致线索的注视时间差，能够预测学习率的差异（r = 0.25，p = 0.002）。选择阶段、也就是反馈出现之前的同样注视模式，并不能预测这种学习不对称。因此，关键时间窗口是结果被揭示的那一刻。

这不只是相关。在后续会话中，一条信息量较弱的线索会在反馈开始时短暂提高亮度，看起来像闪了一下，从而抓住眼睛。这种外源性的凸显既改变了注视位置，也改变了学习率的安排。当被点亮的线索通常支持当前选择时，干扰尤为明显——因为这种情况最容易打乱“没得到奖励后去看反对线索”的正常倾向。

线索–选择一致性更强的被试，也能把相互竞争的线索区分得更开，学得更快，成绩更好，尤其是在实验前期（高一致性组：渐近成绩 0.853，时间常数 23.4 个试次；低一致性组：0.814 和 46.2）。在作者的解释里，这种选择性更新是在对抗一个内在问题：如果所有线索都以相同速率更新，反对当前选择的线索往往会因为预测误差更大而被改动得更多，线索之间有用的对比就会变弱。

![Figure 3. 反馈阶段的注视预测学习不对称，并与学习的稳健性有关。a–c 图：反馈阶段的注视在奖励后偏向一致线索，在无奖励后偏向不一致线索，而且这种注视差异与学习率差异相关（c 图：r = 0.248，p = 0.0026）。d 图把试次级更新与更简单的模型做了比较。e–j 图显示，更强的线索–选择一致性（CC）指数对应更高的线索可区分性（f 图，Spearman ρ = 0.71）、更快更好的成绩（e、g、h 图），以及客观证据与选择之间更紧密的对齐，尤其是在前 70 个试次（i 图）。](/img/readApaper-19/p19_fig3.jpg)

<i>Figure 3. 反馈阶段的注视预测学习不对称，并与学习的稳健性有关。a–c 图：反馈阶段的注视在奖励后偏向一致线索，在无奖励后偏向不一致线索，而且这种注视差异与学习率差异相关（c 图：r = 0.248，p = 0.0026）。d 图把试次级更新与更简单的模型做了比较。e–j 图显示，更强的线索–选择一致性（CC）指数对应更高的线索可区分性（f 图，Spearman ρ = 0.71）、更快更好的成绩（e、g、h 图），以及客观证据与选择之间更紧密的对齐，尤其是在前 70 个试次（i 图）。</i>

## 这项研究说明了什么？

注意力很容易被看成只是决定“什么信息进入决策”的过滤器。在这里，它还是学习的控制信号：它帮助决定该修正哪一种关联，以及修正该有多大。同一套逻辑，也可以把若干已知的学习不对称放进同一个框架，包括人们往往更多地从“印证自己选择”的信息中学习。看哪里、选什么、更新多少，由此变成一个连续的回路，而不是三个互相独立的阶段。

## 总结

- 得到奖励后，人们更多地从支持刚才选择的线索中学习；没有奖励后，则更多地从反对刚才选择的线索中学习。
- 反馈阶段的注视跟踪着这一模式，改变线索的视觉显著性也可以改变学习率。
- 这种不对称有助于保持竞争性预测线索之间的区分；表现更强的人学得更快、也更准确。

---

## References and resources

- Shahamati, A., & Soltani, A. (2026). <i>Value-guided attention links what we learn to how much we learn.</i> bioRxiv 预印本，2026 年 8 月 28 日发布。[预印本](https://doi.org/10.64898/2026.08.25.747046) · [bioRxiv 页面](https://www.biorxiv.org/content/10.64898/2026.08.25.747046v1)
- Figure 1–3 从预印本 PDF 裁切，仅用于这份私人 Notion 草稿。该预印本为未经同行评审的作者手稿；bioRxiv 页面标明版权归作者/资助方所有，未经许可不得再利用。正式发布到公开博客前，请先确认授权。
