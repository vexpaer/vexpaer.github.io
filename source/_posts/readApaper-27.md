---
title: "readApaper#27 Deep learning-based control of electrically evoked activity in human visual cortex"
title_zh: "readApaper#27 Deep learning-based control of electrically evoked activity in human visual cortex"
date: 2026-11-13 22:00:00
tags:
  - readApaper
  - neuroengineering
  - visual-prosthesis
  - machine-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 13 November 2026 · Neuron, 2026</i>

If a visual prosthesis is going to restore useful sight, the electrical pulses it sends into visual cortex have to produce reliable patterns of neural activity—and those patterns have to relate to what the person actually sees. This post is about a study that treats that intermediate step as the thing to predict and control, in a person who is blind.

## Background

A <b>cortical visual prosthesis</b> is a device that tries to restore vision by electrically stimulating the brain itself, rather than the eye. This matters for people whose eyes or optic nerves are too damaged for a retinal implant to help. The idea is straightforward in outline: a camera captures a scene, a computer turns it into a pattern of electrical pulses, and electrodes in <b>early visual cortex</b>—the region at the back of the brain that first processes visual information—activate nearby neurons. If those neurons fire in a useful pattern, the person may experience a flash, a spot, or a simple shape of light. These stimulation-evoked sensations are called <b>phosphenes</b>.

The hardware used here is a <b>Utah electrode array</b>: a small grid of 96 usable microelectrodes implanted in the cortical surface. The same array can both deliver pulses and record the electrical activity of neurons near each electrode tip. That two-way, or <b>bidirectional</b>, interface is what makes the study possible. The researchers can choose a stimulation pattern, deliver it, and then measure how the local population of neurons responds.

In practice, today’s cortical implants rarely produce more than simple flashes or crude shapes, and what a person reports can change from day to day. One reason is physical. Electrical current spreads, and neighboring electrodes interact, so the effect of stimulating several electrodes at once is not a simple sum of the effects of stimulating each one alone. Another reason is biological. Cortex is a nonlinear, ongoing network: the same pulse train can drive a different response depending on the <b>cortical state</b>—the background activity already present when the pulse arrives. That state drifts across days.

The most common engineering shortcut, often called a <b>1-to-1 mapping</b>, ignores much of this. It treats each electrode as if it painted one pixel in visual space, and sets that electrode’s current from the corresponding camera pixel. The mapping is assumed to be roughly linear and stable. If the real mapping from stimulation to population activity is nonlinear and state-dependent, that assumption will not scale, and the phosphenes will remain hard to control.

This is why the intermediate variable matters. Previous work has linked recorded cortical activity to perceptual thresholds, brightness, and duration. The implication is that what the person sees may track the evoked <b>population response</b>—the pattern of activity across many electrodes—more closely than it tracks the raw list of stimulation currents. If that is true, a practical way forward is to learn how stimulation plus cortical state produce that pattern, and then choose currents that aim at a desired pattern, rather than calibrating electrodes one by one.

## Problem

The paper asks two tightly related questions in one blind participant with a bidirectional implant in early visual cortex.

First, can a model predict, on a single trial, the population response evoked by a multi-electrode stimulus, even when that response changes from day to day? Second, once such a model exists, can it be turned around to <b>shape</b> activity: to synthesize a stimulation pattern that brings the recorded response closer to a chosen target, and to do so in the implant itself, not only in a simulation?

A third question sits alongside these. If population activity is the relevant intermediate, then a decoder that sees the recorded response should predict the participant’s perceptual reports more accurately than a decoder that sees only the stimulation parameters. The study tests that prediction separately from the control experiments. It examines neural controllability, and how well activity predicts reports. It is not a test of whether the prosthesis improved visual acuity.

## Method

The participant was a 27-year-old man who had lost his vision after a traumatic head injury and had undergone bilateral enucleation (removal of both eyes) a year before the study. One Utah array was implanted in the right occipital cortex, likely in or near primary visual cortex (V1) based on anatomy. The array remained in place for six months and was then removed. The data for this paper come from 26 recording days over about four months.

Each stimulation was a 167-millisecond train of 50 charge-balanced pulses at 300 Hz. On a given trial, between 1 and 10 electrodes could be active, with currents typically chosen between 5 and 50 μA. For safety, pulses on different electrodes were temporally interleaved when possible, so that not all electrodes fired at the exact same instant. The same array recorded the response. The authors summarized local spiking with <b>envelope multi-unit activity</b> (MUAₑ): a smoothed measure of the pooled spikes of neurons near each electrode. To isolate the change caused by stimulation, they computed <b>ΔMUAₑ</b>, the difference between mean MUAₑ in a window 100–200 ms after the pulse train ended and a pre-stimulus window from −110 to −10 ms. Those windows avoid stimulation artifacts while still capturing a short-latency evoked response. Because the same stimulus could look different across days, they also computed the average pre-stimulus activity on each day and treated it as a compact description of that day’s cortical state.

They then trained a <b>forward neural network</b> (about 1.2 million parameters) to predict the single-trial ΔMUAₑ map from two inputs: the stimulation pattern (the current on each of the 96 electrodes) and that day’s average pre-stimulus activity. This forward model is a learned stand-in for the stimulation-to-response mapping. It was used in two complementary ways to choose new stimuli aimed at a <b>target</b> response—the activity pattern the authors wanted to produce.

The first method, <b>gradient-based optimization</b>, freezes the forward model and iteratively adjusts the currents so that the model’s predicted response matches the target as closely as possible, with a penalty that favors smaller currents and fewer active electrodes. On a desktop GPU this took about 10–20 seconds per stimulus. The second method, an <b>inverse network</b>, is trained with the forward model held fixed, in the style of an autoencoder: it learns to emit, in a single pass, a stimulus that the forward model maps back to the target. Inference took about 50 microseconds. Both methods also received the day’s average pre-stimulus activity, so they could adjust for day-to-day drift. All synthesized patterns were constrained to at most ten electrodes and to currents between 0 and 50 μA.

![Figure 1. How stimulation is delivered, how the response is measured, and how the two model-based methods choose currents. (A) A multi-electrode pattern is sent as a 167 ms, 300 Hz pulse train into the Utah array in early visual cortex. Envelope multi-unit activity is measured before and after the train; their difference, ΔMUAₑ, is the response map used throughout the paper. (B) Given a target response, a conventional 1-to-1 rule, a learned inverse network, or gradient-based optimization can propose a stimulation pattern. That pattern can be tested in the forward model or delivered in the implant. From Moure et al. (2026), Figure 1.](/img/readApaper-27/fig1-setup.png)

<i>Figure 1. How stimulation is delivered, how the response is measured, and how the two model-based methods choose currents. (A) A multi-electrode pattern is sent as a 167 ms, 300 Hz pulse train into the Utah array in early visual cortex. Envelope multi-unit activity is measured before and after the train; their difference, ΔMUAₑ, is the response map used throughout the paper. (B) Given a target response, a conventional 1-to-1 rule, a learned inverse network, or gradient-based optimization can propose a stimulation pattern. That pattern can be tested in the forward model or delivered in the implant. From Moure et al. (2026), Figure 1.</i>

## Experiments

The forward model was trained on 19 days (5,123 trials) and tested on 5 held-out, non-consecutive days (1,179 trials). Those trials combined random multi-electrode patterns (n = 5,818) and structured patterns such as lines or simple shapes (n = 484). A separate set of single-electrode stimuli (n = 2,389) was used only to build dictionary-style baselines, not to train the networks. Prediction was compared with several baselines that embody common assumptions: a 1-to-1 rule, linear and linear-nonlinear regressions, dictionary models built from single-electrode responses, a network trained without daily pre-stimulus activity, and a random lower bound. Performance was scored with mean squared error (MSE), the coefficient of determination (R²), and an earth-mover’s distance (EMD) that also reflects the spatial layout of activity. Scores used 54 of the 96 channels that had shown stimulus-evoked spiking and sufficient variability; all 96 electrodes could still be used for stimulation.

Causal shaping was tested on the last two of the 26 days, with the participant reporting on each trial whether a phosphene was present (a detection task). There were two kinds of targets. <b>Natural targets</b> were trial-resolved responses recorded on a previous day, for which a stimulus that had produced that response was already known. <b>Synthetic targets</b> were structured activity patterns chosen to lie outside the distribution of recorded responses, including both excitatory and inhibitory motifs. The inverse network and gradient method were compared with the same conventional baselines. For natural targets, the authors also <b>replayed</b> the original stimulus, which provides a reference for how consistent a repeated pattern can be across days.

A separate analysis asked how well perceptual reports could be decoded. Using leave-one-day-out cross-validation, deep-network decoders predicted phosphene detection (seen or not seen, n = 4,416), brightness ratings (n = 427), and color, later grouped into four categories (n = 427). The decoders were given stimulation parameters alone, neural features alone (ΔMUAₑ and/or pre-stimulus MUAₑ), or both. This test uses the recorded reports and recorded activity. It does not by itself show that the optimized stimuli improved the richness of perception.

## Results

The same stimulation pattern generally produced a similar spatial response, but the response still varied substantially from day to day. Across repeated patterns, variance across days was larger than variance within a day (p \< 0.0001). ΔMUAₑ was more stable across days than the raw post-stimulus MUAₑ (p \< 0.001), which is one reason the authors used the change from baseline. The response space itself was lower-dimensional than the stimulation space: 48 principal components explained 95% of the variance in ΔMUAₑ, whereas all dimensions were needed to explain 95% of the variance in the stimulation patterns.

On held-out days, the forward network’s predicted maps aligned with the recorded maps. Error was low on most channels, and R² was higher on channels with more spiking activity. The forward network outperformed all of the baselines, including linear models and an idealized dictionary, with significantly higher R² and lower MSE and EMD (Figure 2).

![Figure 2. Day-to-day variability, and how well the forward network predicts single-trial responses. (A) The same stimulation pattern, recorded on three days, with each day’s average pre-stimulus activity and two example trials. (B, C) Across-day variance exceeds within-day variance, and ΔMUAₑ is more stable than post-stimulus MUAₑ. (D) Cumulative variance explained by principal components for responses versus stimuli. (E, F) Example predictions versus recorded responses, and per-channel error. (G) The forward network has lower MSE and EMD, and higher R², than the baseline models. From Moure et al. (2026), Figure 2.](/img/readApaper-27/fig2-forward-model.png)

<i>Figure 2. Day-to-day variability, and how well the forward network predicts single-trial responses. (A) The same stimulation pattern, recorded on three days, with each day’s average pre-stimulus activity and two example trials. (B, C) Across-day variance exceeds within-day variance, and ΔMUAₑ is more stable than post-stimulus MUAₑ. (D) Cumulative variance explained by principal components for responses versus stimuli. (E, F) Example predictions versus recorded responses, and per-channel error. (G) The forward network has lower MSE and EMD, and higher R², than the baseline models. From Moure et al. (2026), Figure 2.</i>

When the task was to reproduce a natural target on a new day, both the inverse network and gradient optimization significantly outperformed the conventional baselines (p \< 0.05). Gradient optimization gave the closest matches, with errors comparable to replaying the original stimulus (Figure 3A, B). On the detection task, the participant’s “seen / not seen” reports after the deep-learning-optimized stimuli more closely matched the reports that had accompanied the original stimuli than did the reports after baseline methods (Figure 3C). This is a result about the consistency of detection reports, not about finer spatial detail.

![Figure 3. Shaping natural targets in the implant. (A) For one example target, the stimulation pattern chosen by each method and the response actually recorded, with trial MSE. (B) Across natural targets, gradient optimization and the inverse network reach lower error than the conventional baselines; gradient is closest to the “replay stimulus” reference. (C) Confusion matrices of the participant’s previous and new detection reports (not seen vs. seen). The deep-learning methods and stimulus replay show more consistent detection reports than the baselines. From Moure et al. (2026), Figure 3.](/img/readApaper-27/fig3-natural-targets.png)

<i>Figure 3. Shaping natural targets in the implant. (A) For one example target, the stimulation pattern chosen by each method and the response actually recorded, with trial MSE. (B) Across natural targets, gradient optimization and the inverse network reach lower error than the conventional baselines; gradient is closest to the “replay stimulus” reference. (C) Confusion matrices of the participant’s previous and new detection reports (not seen vs. seen). The deep-learning methods and stimulus replay show more consistent detection reports than the baselines. From Moure et al. (2026), Figure 3.</i>

Synthetic targets were harder for every method: MSE was higher than for natural targets. Even so, the inverse network and gradient method still significantly outperformed the baselines (p \< 0.05; Figure 4A, B). Both also used lower overall stimulation currents than the conventional methods (Figure 4C). That current reduction does not by itself explain the better matches: the correlation between mean current and response error was only weak (r = 0.25; Figure 4D).

What did predict difficulty was geometry. After accounting for noise, 95% of the variance of evoked responses on their intrinsic manifold could be explained with 10 latent factors, compared with 96 factors needed to explain 95% of the variance in stimulation parameters. Natural targets clustered near this manifold; synthetic targets sat farther away (p \< 0.001; Figure 4E). The farther a target lay from the manifold, the larger the control error, with a strong correlation (r = 0.85; Figure 4F).

![Figure 4. Synthetic targets, currents, and the neural manifold. (A, B) Example and summary performance when the target is a structured pattern outside the recorded response distribution. (C) Mean stimulation amplitude is lower for the inverse network and gradient method. (D) Mean amplitude is only weakly related to error (r = 0.25). (E) Natural targets lie closer to the low-dimensional manifold of evoked activity than synthetic targets. (F) Distance to that manifold strongly predicts reconstruction error (r = 0.85; shown for the gradient method). From Moure et al. (2026), Figure 4.](/img/readApaper-27/fig4-synthetic-manifold.png)

<i>Figure 4. Synthetic targets, currents, and the neural manifold. (A, B) Example and summary performance when the target is a structured pattern outside the recorded response distribution. (C) Mean stimulation amplitude is lower for the inverse network and gradient method. (D) Mean amplitude is only weakly related to error (r = 0.25). (E) Natural targets lie closer to the low-dimensional manifold of evoked activity than synthetic targets. (F) Distance to that manifold strongly predicts reconstruction error (r = 0.85; shown for the gradient method). From Moure et al. (2026), Figure 4.</i>

The forward model was also a useful stand-in for comparing methods before they were tested in the implant. Simulated errors systematically underestimated the errors later measured in vivo, but the ranking of methods was preserved, and simulated versus in vivo MSE was highly correlated (r = 0.86 for natural targets; r = 0.95 for synthetic targets).

In the separate decoding analysis, recorded neural activity predicted the participant’s reports better than stimulation parameters alone for detection, brightness, and color (p \< 0.05; Figure 6). Adding pre-stimulus MUAₑ and ΔMUAₑ to the stimulation parameters improved detection accuracy from 77.0% to 87.8%, a 47% reduction in classification error; color accuracy from 49.4% to 76.7% (54% error reduction); and brightness accuracy from 44.8% to 60.9% (29% error reduction). About 25% of detection-task trials in the broader dataset produced a reported percept, so a decoder that always answered “not seen” would already be fairly accurate; the F1 scores in Figure 6D help interpret that imbalance.

![Figure 6. How well different inputs predict the participant’s reports. (A–C) Decoder accuracy for phosphene detection (n = 4,416), brightness (n = 427), and color (n = 427), under leave-one-day-out cross-validation. (D–F) The corresponding F1 scores. The dashed line repeats the stimulation-only baseline. Adding recorded activity to the stimulation parameters improves prediction of detection, brightness, and color. From Moure et al. (2026), Figure 6.](/img/readApaper-27/fig6-perception-decoding.png)

<i>Figure 6. How well different inputs predict the participant’s reports. (A–C) Decoder accuracy for phosphene detection (n = 4,416), brightness (n = 427), and color (n = 427), under leave-one-day-out cross-validation. (D–F) The corresponding F1 scores. The dashed line repeats the stimulation-only baseline. Adding recorded activity to the stimulation parameters improves prediction of detection, brightness, and color. From Moure et al. (2026), Figure 6.</i>

## Analysis

Taken together, the results separate three claims that are easy to blur.

The first is about <b>neural control</b>. In this participant, a forward model that sees both the stimulation pattern and a daily baseline can predict single-trial population responses better than linear or electrode-wise rules. When that model is inverted, the implant can be driven toward a chosen activity map, including on a new day, and can do so with lower currents than the conventional strategies. Gradient search is the more accurate of the two inversions; the inverse network is the one fast enough for real-time use. The close correlation between simulated and in vivo errors means the forward model can be used to compare candidate stimuli, even though it is optimistic about absolute error.

The second is about <b>what can be reached</b>. Not every imagined activity map is equally achievable. Evoked responses live on a low-dimensional manifold, and targets that leave that manifold are systematically harder to hit. That is a direct explanation of why natural targets—patterns the cortex had already produced—were shaped more accurately than synthetic ones. Lower current is a practical advantage, but the weak current–error correlation shows that the improvement is not just “stimulate less.” The geometry of the response space matters more.

The third is about <b>perception</b>, and it is narrower than a claim about restored sight. On the two evaluation days, the deep-learning-optimized stimuli made the participant’s detection reports more consistent with the reports that had gone with the original natural targets. In a separate analysis of the broader dataset, recorded population activity predicted detection, brightness, and color reports more accurately than stimulation parameters alone. Those findings support treating evoked activity as a meaningful intermediate between current and percept. They show consistency of reports, and a tighter link from activity to those reports, rather than richer shapes, more precise locations, or better visual acuity. The behavioral measures in this study were detection, brightness, color, and consistency.

## Summary

The practical picture is simple. In a bidirectional visual-cortex implant, stimulation can be chosen not by painting currents onto electrodes one-to-one, but by aiming at a desired population response. A learned forward model makes that aim possible; an inverse network can do it in tens of microseconds, and a slower gradient search can do it more precisely. The responses that can be reached are constrained by the cortex’s own low-dimensional activity patterns, and those patterns predict what the participant reported seeing more closely than the stimulation parameters themselves. That is the foundation the paper puts in place: control the activity, and you have a clearer handle on both the stimulation and the percept.

## References

- Moure, P., Granley, J., Grani, F., Soo, L., Lozano, A., López-Peco, R., Villamarín-Ortiz, A., Soto-Sánchez, C., Liu, S.-C., Beyeler, M., & Fernández, E. (2026). <i>Deep learning-based control of electrically evoked activity in human visual cortex.</i> Neuron, 114, 1–15. Published online 2026-08-07. [doi.org/10.1016/j.neuron.2026.07.006](https://doi.org/10.1016/j.neuron.2026.07.006) · [Article](<https://www.cell.com/neuron/abstract/S0896-6273(26)00535-0>)
- Figures 1, 2, 3, 4, and 6 are from Moure et al. (2026).
- Data and code: [github.com/jgranley/deep\_neural\_shaping](https://github.com/jgranley/deep_neural_shaping)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-13 · Neuron, 2026</i>

视觉假体若要恢复有用的视觉，送入视觉皮层的电脉冲必须能产生可靠的神经活动模式，而且这些模式还要和当事人实际看见的内容有关。这篇文章讨论的，就是一项把这一中间环节当作预测和控制对象的研究，对象是一位失明的被试。

## 背景

<b>皮层视觉假体</b>是一种不刺激眼睛、而是直接用电刺激大脑来尝试恢复视觉的装置。对眼睛或视神经损伤过重、视网膜植入无法起作用的人来说，这条路径很重要。思路可以先这样理解：摄像机拍摄场景，计算机把它转换成电脉冲图案，电极位于<b>早期视觉皮层</b>——大脑后部最先处理视觉信息的区域——并激活附近的神经元。如果这些神经元以有用的模式放电，被试就可能看到闪光、光点或简单的光形状。这类由刺激诱发的感觉叫做<b>光幻视</b>（phosphene）。

这里使用的硬件是<b>犹他电极阵列</b>（Utah electrode array）：一块植入皮层表面、有 96 个可用微电极的小栅格。同一阵列既能发放脉冲，也能记录每根电极尖端附近神经元的电活动。正是这种双向接口，使这项研究成为可能：研究者可以选择刺激图案、施加刺激，然后测量局部神经元群体如何反应。

在实际中，现有的皮层植入很少能产生超出简单闪光或粗糙形状的知觉，而且被试的报告还可能天天变化。一个原因是物理上的：电流会扩散，相邻电极会相互作用，同时刺激多根电极的效果，并不是分别刺激每一根后再简单相加。另一个原因是生物学上的。皮层是一个非线性、持续活动的网络：同一串脉冲会因<b>皮层状态</b>——脉冲到达时已经存在的背景活动——而驱动不同的反应。这种状态会随天数漂移。

最常见的工程捷径往往被称为<b>一对一映射</b>，它在很大程度上忽略了上述事实。这种方法把每根电极当作视觉空间中的一个像素，并按对应摄像机像素来设定该电极的电流，同时假定映射大致线性且稳定。如果从刺激到群体活动的真实映射是非线性的、并且依赖于状态，这一假定就很难扩展，光幻视也会一直难以控制。

这正是中间变量重要的原因。已有工作把记录到的皮层活动与知觉阈值、亮度和持续时间联系起来。这意味着，当事人看见的内容，可能更跟随诱发出来的<b>群体反应</b>——许多电极上的活动图案，而不是更跟随那一份原始的刺激电流列表。如果这一点成立，一条可行的路就是：先学会“刺激加上皮层状态如何产生这种图案”，再选择旨在逼近目标图案的电流，而不是一根电极一根电极地校准。

## 问题

论文在一位植入了早期视觉皮层双向接口的失明被试身上，提出了两个紧密相关的问题。

第一，模型能否在单次试验上预测多电极刺激所诱发的群体反应，即使这一反应会随天数变化？第二，一旦有了这样的模型，能否把它反过来用于<b>塑形</b>活动：合成一套刺激图案，让记录到的反应更接近选定的目标，并且是在植入体中实现，而不只是在仿真里实现？

旁边还有第三个问题。如果群体活动确实是那个关键的中间量，那么看到记录反应的解码器，应当比只看到刺激参数的解码器更准确地预测被试的知觉报告。这项研究把这一预测与控制实验分开检验。它考察的是神经活动是否可被控制，以及活动对报告的预测有多好，而不是假体是否提高了视敏度。

## 方法

被试是一名 27 岁男性，因头部外伤失明，并在研究开始一年前接受了双眼摘除。一块犹他阵列被植入右侧枕叶皮层，根据解剖位置，很可能位于或邻近初级视觉皮层（V1）。阵列留置六个月后取出。本文的数据来自约四个月里的 26 个记录日。

每次刺激都是一串持续 167 毫秒、含 50 个电荷平衡脉冲、频率为 300 Hz 的脉冲序列。在一次试验中，可以有 1 到 10 根电极处于激活状态，电流通常选在 5 到 50 μA 之间。出于安全考虑，不同电极上的脉冲在可能的情况下会在时间上交错，从而避免所有电极在同一瞬间同时放电。同一阵列记录反应。作者用<b>包络多单位活动</b>（MUAₑ）来概括局部放电：这是对电极尖端附近多个神经元脉冲的平滑、汇总度量。为了分离由刺激造成的变化，他们计算 <b>ΔMUAₑ</b>，即脉冲序列结束后 100–200 毫秒窗口内的平均 MUAₑ，减去刺激前 −110 到 −10 毫秒窗口内的平均 MUAₑ。这两个窗口可以避开刺激伪迹，同时仍然捕捉短潜伏期的诱发反应。由于同一刺激在不同天可能看起来不一样，他们还计算每天的平均刺激前活动，把它当作当天皮层状态的一个简洁描述。

随后，他们训练了一个约 120 万参数的<b>正向神经网络</b>，用两个输入来预测单次试验的 ΔMUAₑ 图：刺激图案（96 根电极上各自的电流），以及当天的平均刺激前活动。这个正向模型是“刺激到反应”映射的一个学得替代。它又以两种互补的方式，用来选择旨在产生<b>目标</b>反应——也就是作者希望得到的活动图案——的新刺激。

第一种方法是<b>基于梯度的优化</b>：把正向模型冻结，迭代调整电流，使模型预测的反应尽可能接近目标，同时加上一项惩罚，使电流更小、激活电极更少。在台式 GPU 上，每个刺激大约需要 10–20 秒。第二种方法是<b>逆向网络</b>：在正向模型保持固定的前提下，按自编码器的方式训练，使它能一次性输出一套刺激，再经正向模型映射回目标。推理大约需要 50 微秒。两种方法都会接收当天的平均刺激前活动，以便对逐日漂移做出调整。所有合成图案最多使用十根电极，电流限制在 0 到 50 μA。

![图 1. 刺激如何施加、反应如何测量，以及两种基于模型的方法如何选择电流。(A) 多电极刺激图案以 167 毫秒、300 Hz 的脉冲序列送入早期视觉皮层中的犹他电极阵列。脉冲序列前后分别测量包络多单位活动，二者之差 ΔMUAₑ 就是全文使用的反应图。(B) 给定目标反应后，可以用传统的一对一规则、学到的逆向网络，或基于梯度的优化来提出刺激图案。该图案既可以在正向模型中测试，也可以在植入体中实际施加。取自 Moure 等（2026）Figure 1。](/img/readApaper-27/fig1-setup.png)

<i>图 1. 刺激如何施加、反应如何测量，以及两种基于模型的方法如何选择电流。(A) 多电极刺激图案以 167 毫秒、300 Hz 的脉冲序列送入早期视觉皮层中的犹他电极阵列。脉冲序列前后分别测量包络多单位活动，二者之差 ΔMUAₑ 就是全文使用的反应图。(B) 给定目标反应后，可以用传统的一对一规则、学到的逆向网络，或基于梯度的优化来提出刺激图案。该图案既可以在正向模型中测试，也可以在植入体中实际施加。取自 Moure 等（2026）Figure 1。</i>

## 实验

正向模型在 19 天的数据上训练（5,123 次试验），在 5 个留出的、不相邻的天数上测试（1,179 次试验）。这些试验包含随机多电极图案（n = 5,818）以及线段或简单形状等结构化图案（n = 484）。另外一组单电极刺激（n = 2,389）只用来构建词典式基线，不用于训练网络。预测与若干体现常见假定的基线相比较：一对一规则、线性及线性-非线性回归、由单电极反应构建的词典模型、不使用每日刺激前活动训练的网络，以及随机下界。表现用均方误差（MSE）、决定系数（R²），以及同时反映活动空间布局的推土机距离（EMD）来评分。评分使用 96 个通道中 54 个曾出现刺激诱发放电且变异足够的通道；全部 96 根电极仍可用于刺激。

因果塑形在 26 天中的最后两天进行，被试在每次试验后报告是否出现光幻视（检测任务）。目标分为两类。<b>自然目标</b>是此前某一天记录到的单次试验反应，并且已经知道有哪种刺激产生过该反应。<b>合成目标</b>是特意选在已记录反应分布之外的结构化活动图案，其中既有兴奋性模式，也有抑制性模式。逆向网络和梯度方法与同样的传统基线相比较。对自然目标，作者还<b>重放</b>了原来的刺激，以此作为同一图案跨天能稳定到什么程度的参照。

另一项单独分析询问知觉报告能被解码到什么程度。使用留一日交叉验证，深度网络解码器预测光幻视检测（看见或没看见，n = 4,416）、亮度评分（n = 427），以及后来归为四类的颜色（n = 427）。解码器分别只获得刺激参数、只获得神经特征（ΔMUAₑ 和/或刺激前 MUAₑ），或同时获得两者。这项检验使用的是已记录的报告和已记录的活动，它本身并不表明优化后的刺激提高了知觉的丰富程度。

## 结果

同一刺激图案通常会产生相似的空间反应，但反应在不同天之间仍有明显变化。对重复图案来说，跨天方差大于天内方差（p \< 0.0001）。ΔMUAₑ 比原始的刺激后 MUAₑ 更稳定（p \< 0.001），这也是作者使用相对基线变化量的原因之一。反应空间本身的维度也低于刺激空间：48 个主成分可以解释 ΔMUAₑ 中 95% 的方差，而要解释刺激图案中 95% 的方差则需要全部维度。

在留出的测试日上，正向网络预测的活动图与记录图相符。多数通道上的误差较低，放电更多的通道上 R² 更高。正向网络优于所有基线，包括线性模型和理想化的词典模型，R² 显著更高，MSE 和 EMD 显著更低（图 2）。

![图 2. 逐日变异，以及正向网络对单次试验反应的预测。(A) 同一刺激图案在三天中的记录，包括每天的平均刺激前活动以及两次示例试验。(B, C) 跨天方差大于天内方差，且 ΔMUAₑ 比刺激后的 MUAₑ 更稳定。(D) 反应与刺激的主成分累计解释方差。(E, F) 预测与实测反应的示例，以及各通道误差。(G) 与基线模型相比，正向网络的 MSE 和 EMD 更低，R² 更高。取自 Moure 等（2026）Figure 2。](/img/readApaper-27/fig2-forward-model.png)

<i>图 2. 逐日变异，以及正向网络对单次试验反应的预测。(A) 同一刺激图案在三天中的记录，包括每天的平均刺激前活动以及两次示例试验。(B, C) 跨天方差大于天内方差，且 ΔMUAₑ 比刺激后的 MUAₑ 更稳定。(D) 反应与刺激的主成分累计解释方差。(E, F) 预测与实测反应的示例，以及各通道误差。(G) 与基线模型相比，正向网络的 MSE 和 EMD 更低，R² 更高。取自 Moure 等（2026）Figure 2。</i>

当任务是在新的一天重现自然目标时，逆向网络和梯度优化都显著优于传统基线（p \< 0.05）。梯度优化给出最接近的匹配，误差与重放原刺激相当（图 3A, B）。在检测任务中，深度学习优化刺激后，被试“看见 / 没看见”的报告，比基线方法更接近原刺激当时所伴随的报告（图 3C）。这是关于检测报告一致性的结果，而不是关于更精细的空间细节。

![图 3. 在植入体中塑形自然目标。(A) 对一个示例目标，各方法选出的刺激图案以及实际记录到的反应，并标出该次试验的 MSE。(B) 在自然目标上，梯度优化和逆向网络的误差低于传统基线；梯度方法最接近“重放原刺激”这一参照。(C) 被试先前与新一次检测报告（未见 / 看见）的混淆矩阵。深度学习方法与刺激重放的检测报告，比基线方法更为一致。取自 Moure 等（2026）Figure 3。](/img/readApaper-27/fig3-natural-targets.png)

<i>图 3. 在植入体中塑形自然目标。(A) 对一个示例目标，各方法选出的刺激图案以及实际记录到的反应，并标出该次试验的 MSE。(B) 在自然目标上，梯度优化和逆向网络的误差低于传统基线；梯度方法最接近“重放原刺激”这一参照。(C) 被试先前与新一次检测报告（未见 / 看见）的混淆矩阵。深度学习方法与刺激重放的检测报告，比基线方法更为一致。取自 Moure 等（2026）Figure 3。</i>

对所有方法来说，合成目标都更难：MSE 高于自然目标。即便如此，逆向网络和梯度方法仍显著优于基线（p \< 0.05；图 4A, B）。二者使用的总体刺激电流也低于传统方法（图 4C）。电流降低本身并不能解释更好的匹配：平均电流与反应误差之间只有弱相关（r = 0.25；图 4D）。

真正能预测难度的是几何结构。在计入噪声之后，诱发反应在其内在流形上 95% 的方差可以用 10 个潜在因子解释，而要解释刺激参数中 95% 的方差则需要 96 个因子。自然目标聚集在这一流形附近，合成目标则离得更远（p \< 0.001；图 4E）。目标离流形越远，控制误差越大，二者有很强的相关（r = 0.85；图 4F）。

![图 4. 合成目标、电流与神经流形。(A, B) 当目标是落在已记录反应分布之外的结构化图案时，各方法的示例与总体表现。(C) 逆向网络和梯度方法的平均刺激幅度更低。(D) 平均幅度与误差仅有弱相关（r = 0.25）。(E) 与合成目标相比，自然目标更靠近诱发活动的低维流形。(F) 到该流形的距离能较强地预测重建误差（r = 0.85；图中为梯度方法）。取自 Moure 等（2026）Figure 4。](/img/readApaper-27/fig4-synthetic-manifold.png)

<i>图 4. 合成目标、电流与神经流形。(A, B) 当目标是落在已记录反应分布之外的结构化图案时，各方法的示例与总体表现。(C) 逆向网络和梯度方法的平均刺激幅度更低。(D) 平均幅度与误差仅有弱相关（r = 0.25）。(E) 与合成目标相比，自然目标更靠近诱发活动的低维流形。(F) 到该流形的距离能较强地预测重建误差（r = 0.85；图中为梯度方法）。取自 Moure 等（2026）Figure 4。</i>

正向模型也是在植入体测试之前比较各方法的有用替代。仿真误差系统地低估了后来在体测量到的误差，但方法的排序得以保持，仿真 MSE 与在体 MSE 高度相关（自然目标 r = 0.86；合成目标 r = 0.95）。

在单独的解码分析中，记录到的神经活动在检测、亮度和颜色上，对被试报告的预测都优于仅使用刺激参数（p \< 0.05；图 6）。把刺激前 MUAₑ 和 ΔMUAₑ 加到刺激参数上之后，检测准确率从 77.0% 提高到 87.8%，分类误差下降 47%；颜色准确率从 49.4% 提高到 76.7%（误差下降 54%）；亮度准确率从 44.8% 提高到 60.9%（误差下降 29%）。在更大的数据集中，检测任务大约只有 25% 的试验产生了报告的光幻视，因此一个总是回答“没看见”的解码器本来就会相当准确；图 6D 中的 F1 分数有助于理解这种不平衡。

![图 6. 不同输入对被试报告的预测。(A–C) 在留一日交叉验证下，光幻视检测（n = 4,416）、亮度（n = 427）和颜色（n = 427）的解码准确率。(D–F) 相应的 F1 分数。虚线重复“仅用刺激参数”的基线。把记录到的神经活动加到刺激参数上，能改善对检测、亮度和颜色的预测。取自 Moure 等（2026）Figure 6。](/img/readApaper-27/fig6-perception-decoding.png)

<i>图 6. 不同输入对被试报告的预测。(A–C) 在留一日交叉验证下，光幻视检测（n = 4,416）、亮度（n = 427）和颜色（n = 427）的解码准确率。(D–F) 相应的 F1 分数。虚线重复“仅用刺激参数”的基线。把记录到的神经活动加到刺激参数上，能改善对检测、亮度和颜色的预测。取自 Moure 等（2026）Figure 6。</i>

## 分析

把这些结果放在一起，可以分开三条容易被混在一起的判断。

第一条关乎<b>神经控制</b>。在这名被试身上，同时看到刺激图案和每日基线的正向模型，对单次试验群体反应的预测优于线性或按电极一一对应的规则。把该模型反过来用，就可以在新的一天把植入体推向选定的活动图，而且所用电流低于传统策略。两种反向方法里，梯度搜索更准确；逆向网络则快到可以实时使用。仿真误差与在体误差之间的密切相关意味着，正向模型可以用来比较候选刺激，尽管它对绝对误差偏乐观。

第二条关乎<b>哪些反应能够被达到</b>。并非每一种想象中的活动图都同样可实现。诱发反应落在一个低维流形上，离开这个流形的目标会系统地更难打中。这直接解释了为什么自然目标——皮层已经产生过的图案——会比合成目标塑形得更准。更低的电流是一个实际优点，但电流与误差只有弱相关，说明改进并不只是“刺激得更少”。反应空间的几何结构更为关键。

第三条关乎<b>知觉</b>，而且比“恢复了视力”要窄。在两天评估中，深度学习优化的刺激使被试的检测报告，与原来自然目标所伴随的报告更为一致。在对更大数据集的单独分析中，记录到的群体活动对检测、亮度和颜色报告的预测，也比仅用刺激参数更准确。这些发现支持把诱发活动当作电流与知觉之间有意义的中间量。它们表明的是报告的一致性，以及活动与这些报告之间更紧的联系，而不是更丰富的形状、更精确的位置，或更好的视敏度。本研究的行为指标是检测、亮度、颜色和一致性。

## 总结

可以记住的图景其实很简单。在一个双向的视觉皮层植入中，刺激不必再按一对一的方式把电流画到电极上，而可以瞄准一个期望的群体反应。学得的正向模型使这种瞄准成为可能；逆向网络能在数十微秒内完成，较慢的梯度搜索则可以做得更精确。能够达到的反应，受到皮层自身低维活动模式的约束；而这些模式对被试所报告内容的预测，比刺激参数本身更接近。这就是这篇论文打下的基础：先控制活动，才能更清楚地把握刺激，也更清楚地把握知觉。

## 参考文献

- Moure, P., Granley, J., Grani, F., Soo, L., Lozano, A., López-Peco, R., Villamarín-Ortiz, A., Soto-Sánchez, C., Liu, S.-C., Beyeler, M., & Fernández, E. (2026). <i>Deep learning-based control of electrically evoked activity in human visual cortex.</i> Neuron, 114, 1–15。2026-08-07 在线发表。[doi.org/10.1016/j.neuron.2026.07.006](https://doi.org/10.1016/j.neuron.2026.07.006) · [论文页面](<https://www.cell.com/neuron/abstract/S0896-6273(26)00535-0>)
- 图 1、2、3、4、6 取自 Moure 等（2026）。
- 数据与代码：[github.com/jgranley/deep\_neural\_shaping](https://github.com/jgranley/deep_neural_shaping)
