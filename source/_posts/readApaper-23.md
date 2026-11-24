---
title: "readApaper#23 Low-latency neuromorphic closed-loop control of hippocampal ripples in vivo"
title_zh: "readApaper#23 Low-latency neuromorphic closed-loop control of hippocampal ripples in vivo"
date: 2026-11-09 22:00:00
tags:
  - readApaper
  - neuromorphic-computing
  - neuroengineering
  - closed-loop
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 9 November 2026 · bioRxiv, 2026</i>

A brief burst of activity in the hippocampus can last less than a tenth of a second. If you want to act on that burst while it is still happening, you have to notice it and respond inside the same short window. This post is about a system built to do that.

## Background

The <b>hippocampus</b> is a structure deep in the brain that is especially important for forming memories of events and places. A memory is not finished at the moment of experience. During later rest, the hippocampus can replay fragments of what just happened, a process thought to help those traces stabilize and, over time, settle into longer-lasting networks (Buzsáki, 2015).

To watch this activity, researchers place a thin electrode in the tissue and record the <b>local field potential</b> (LFP): the voltage in the fluid just outside neurons. That voltage is produced mainly by the summed electrical currents of many nearby cells acting together. It is a local population signal, not the spike of a single neuron (Buzsáki, Anastassiou, & Koch, 2012).

In the hippocampus, one of the most distinctive LFP patterns is the <b>sharp-wave ripple</b>. A slower deflection (the sharp wave) is accompanied by a brief, fast oscillation (the ripple). In the rodent recordings used here, the ripple sits in the 100–250 Hz range and typically lasts only about 30–100 milliseconds (Félix et al., 2026; Buzsáki, 2015). It is a short, highly synchronized burst in a local group of hippocampal neurons. These events appear mainly in “offline” states: when an animal is still and quietly awake, or during slow-wave (non-REM) sleep, rather than while it is actively moving and exploring (Buzsáki, 2015).

Why study them? During ripples, neurons that fired together in a recent experience can fire again in a compressed sequence, often called replay. This has been linked to memory consolidation. In one well-known experiment, interrupting ripples after a spatial learning session impaired later memory performance in rats (Girardeau et al., 2009). That kind of test only works if the intervention is timed to the event itself.

That is a <b>closed-loop</b> problem. A closed-loop system watches the ongoing brain signal and acts only when a chosen pattern appears, instead of stimulating all the time. For a ripple, the action has to arrive before that brief oscillation ends; otherwise it is no longer acting on that event. The paper discussed here builds a loop that can detect ripples and trigger a brief intervention. It measures how quickly the loop can respond, and whether a timed pulse of light changes the ripple’s electrical signature. It does not test whether the animals remember better or worse afterward.

## Problem

The difficulty is time as much as accuracy. A ripple is over in tens of milliseconds, so high-bandwidth brain data have to be turned into a decision and a command inside that window, and with a power budget that later devices could in principle carry. Large deep-learning detectors can be accurate, but they are often too heavy to run this quickly at the edge. A complete loop for such fast, fleeting events—fast enough, efficient enough, built on tools many labs already use, and tested in a living brain—had not been shown.

In a 2026 bioRxiv preprint, Félix and colleagues set out to close that gap. They train a compact <b>spiking neural network</b> (SNN)—a network whose units communicate with discrete pulses, like neurons—and run it on <b>SpiNNaker</b>, a board designed to simulate such networks in real time at low power. They plug the board into Open Ephys, a common lab recording system, and, when a ripple is detected, trigger a brief flash of light to suppress the event in an awake mouse.

## Method

The starting signal is an LFP recorded in CA1, a hippocampal subregion where ripples are often measured. The authors keep only the ripple band (100–250 Hz), then convert the filtered trace into two event streams: an UP pulse when the signal rises past a threshold, and a DN pulse when it falls. This is <b>asynchronous delta modulation</b>. Events first sampled at 30 kHz are reduced to 1 kHz to match SpiNNaker’s 1 ms time step. The aim is not a perfect reconstruction of the waveform, only to keep the timing pattern that marks a ripple. Rebuilt traces still show the fast oscillation, and the encoded pulses are much denser during ripples than during quiet baseline.

Those streams are cut into short overlapping windows and used to train a small feed-forward SNN: two input channels, two hidden layers of <b>leaky integrate-and-fire</b> neurons (24, then 16 units), and one output neuron that fires when the network reports a ripple—41 neurons and 530 adjustable parameters in all. Training used surrogate-gradient backpropagation, so a pulsing network can be trained with the same kind of gradient descent used in ordinary deep learning.

![Figure 1. Spike-based encoding and the compact SNN. (A) A raw CA1 local field potential is band-pass filtered in the ripple range (100–250 Hz) and converted into sparse UP and DN events, then downsampled from 30 kHz to 1 kHz. (B) Reconstructing the filtered trace from those events still shows the high-frequency ripple. (C) Encoded firing rate and reconstruction SNR are higher during ripples (R) than during non-ripple baseline (NR). (D) Overlapping windows are labeled for supervised training. (E) The network has two hidden layers of 24 and 16 leaky integrate-and-fire neurons and a single output neuron. From Félix et al., 2026, Figure 1.](/img/readApaper-23/p23_fig1_en.jpg)

<i>Figure 1. Spike-based encoding and the compact SNN. (A) A raw CA1 local field potential is band-pass filtered in the ripple range (100–250 Hz) and converted into sparse UP and DN events, then downsampled from 30 kHz to 1 kHz. (B) Reconstructing the filtered trace from those events still shows the high-frequency ripple. (C) Encoded firing rate and reconstruction SNR are higher during ripples (R) than during non-ripple baseline (NR). (D) Overlapping windows are labeled for supervised training. (E) The network has two hidden layers of 24 and 16 leaky integrate-and-fire neurons and a single output neuron. From Félix et al., 2026, Figure 1.</i>

The trained network then sits in a live chain. Open Ephys streams the LFP to a host program that filters and encodes each snippet. UP and DN events go over Ethernet to SpiNNaker. When the output neuron fires, an Arduino sends a pulse that turns on a 100 ms flash of blue light. This uses <b>optogenetics</b>: certain cells are genetically prepared so that light can switch them on or off. Here the light recruits inhibitory neurons in CA1, with the aim of damping the ripple. A firing threshold on the output neuron sets how readily the system declares a detection.

## Experiments

The authors tested the loop at several levels, and kept pre-recorded tests separate from sessions in a living animal. Three scores appear often, each answering a different question. <b>Recall</b> asks: of the ripples a person marked, what fraction did the network catch? <b>Precision</b> asks: of the moments the network said “ripple,” what fraction were real? The <b>F1-score</b> is a single number that balances the two. Timing is measured as <b>round-trip, or total closed-loop, latency</b>: how long from the start of a ripple, through recording, encoding, the board, and the trigger, until the command pulse appears. <b>Relative latency</b> compares that delay with how long that ripple lasted; a value below 100% means the pulse arrived before the event ended.

### Offline detection on annotated recordings

Detection was scored on 23 sessions from five mice, with 2,719 manually marked ripples, using a public dataset of awake, head-fixed CA1 recordings and additional sessions in a similar format. The SNN was compared with a classical Buzsáki-style RMS filter, another filter (Dutta), and larger deep-learning models, both at default settings and after tuning to this dataset.

### Closed-loop tests with pre-recorded signals

To run the network on the board without a live animal, pre-recorded LFPs were streamed through Open Ephys, encoded, and processed on SpiNNaker. This is <b>online</b> processing of buffered recordings, as opposed to <b>offline</b> playback in a software simulator or on the board. The authors varied the output threshold and compared power use on 14 sessions for a GPU, a CPU, and SpiNNaker.

To time the complete chain, they built a <b>hardware-in-the-loop</b> setup: pre-recorded hippocampal LFPs were played into Open Ephys as if they were arriving live, then through encoding, SpiNNaker, and an Arduino whose pulse was recorded back. They compared two ways of firing the Arduino, and varied how much data was buffered before each step and how high the detection threshold was set.

### In vivo optogenetic sessions

The full sensing–processing–stimulation loop was then run in two awake, head-fixed mice, across twelve sessions (4 with the light off, 8 with it on). CA1 signals were recorded with high-density electrodes that can also deliver light. A detection triggered a 100 ms inhibitory light pulse, aimed at inhibitory (GABAergic) neurons. These live sessions used a <b>preliminary configuration</b>, before the timing optimizations above: a longer (20 ms) buffer, and a slower route for the trigger. Afterward, 1,699 ripples were scored. The authors compared light-on and light-off sessions on detection scores, latency, ripple-band power around the detection time, and, for the longest 25% of detected ripples in each session, the energy of the oscillation—roughly, how strong and prolonged it was.

## Results

### Detection performance

In the offline software test, the network caught most marked ripples but also raised a fair number of false alarms: median recall was 0.89, median precision was 0.50, and median F1 was 0.56. The best SNN reached a median F1 of 0.61, in the same range as larger deep-learning models. A carefully tuned classical filter still scored higher (median F1 = 0.70). When those filters were left at their default settings, though, their scores dropped, and the SNN did better than the untuned versions.

Once the same network was running on SpiNNaker, raising the detection threshold made the system choosier (fewer false alarms, more misses). Moving from the software simulator to the board lowered F1 only modestly; switching from offline to online processing on the board added little further cost at the more balanced thresholds. The power difference was large. On 14 sessions, GPU and CPU inference used medians of 70 W and 53 W and did not keep up in real time. SpiNNaker ran the same sessions in biological real time at about 3.6 W for the whole board, of which about 0.35 W was attributed to the simulation itself—up to about 200-fold less if that simulation power is compared with the GPU or CPU.

![Figure 4. Online deployment on SpiNNaker. (A) Open Ephys view of streamed LFPs, with detection pulses compared against annotated ripples. (B, C) The output-neuron firing threshold trades recall for precision; thresholds between 0.8 and 1.0 give the best F1-scores. (D) Moving from the software simulator (snnTorch) to SpiNNaker lowers F1 somewhat; switching from offline to online buffered processing on the board has little further cost at the balanced thresholds. (E) False negatives and false positives per minute as a function of threshold. (F) Power during inference: GPU and CPU consume tens of watts, while SpiNNaker board power (Total) and the power attributed to the simulation (Sim) are much lower. From Félix et al., 2026, Figure 4.](/img/readApaper-23/p23_fig4_en.jpg)

<i>Figure 4. Online deployment on SpiNNaker. (A) Open Ephys view of streamed LFPs, with detection pulses compared against annotated ripples. (B, C) The output-neuron firing threshold trades recall for precision; thresholds between 0.8 and 1.0 give the best F1-scores. (D) Moving from the software simulator (snnTorch) to SpiNNaker lowers F1 somewhat; switching from offline to online buffered processing on the board has little further cost at the balanced thresholds. (E) False negatives and false positives per minute as a function of threshold. (F) Power during inference: GPU and CPU consume tens of watts, while SpiNNaker board power (Total) and the power attributed to the simulation (Sim) are much lower. From Félix et al., 2026, Figure 4.</i>

### Speed of the optimized loop

In the hardware-in-the-loop test, the path of the trigger mattered. Driving the Arduino directly from the control program, rather than through an Open Ephys plugin, shortened the median delay and raised the share of ripples that still received a pulse before they ended from 59% to about 80%. Shorter buffers were faster; longer buffers improved detection only a little, while adding a lot of delay.

The fastest setting—a 3 ms buffer and a relatively sensitive threshold—gave a median total closed-loop latency of 48.53 ms, with the middle half of delays falling between 41.37 and 56.52 ms. This is the paper’s “approximately 50 ms.” At that setting, a pulse arrived before ripple termination in 80.4% of events. These 50 ms and 80% figures come from this pre-recorded, optimized hardware-in-the-loop test. They are not the latencies measured later in the live-animal sessions.

![Figure 5. Hardware-in-the-loop measurement of total closed-loop latency. (A) Pre-recorded LFPs are played into Open Ephys, encoded, sent to SpiNNaker, and used to trigger an Arduino pulse that is recorded back for timing. (B) Direct Python control of the Arduino (PY) is faster than the Open Ephys plugin (OE), and closer to the offline baseline (OFF). The right panel shows latency as a percentage of each ripple’s duration; the dashed line at 100% is the event’s end. (C) Round-trip latency grows with buffer size. Short buffers fall within the typical ripple-duration distribution (histogram); longer buffers push relative latency above 100%. (D) Larger buffers raise F1 only modestly, while median latency increases substantially. (E, F) Buffer size and firing threshold together set the latency–performance operating point. From Félix et al., 2026, Figure 5.](/img/readApaper-23/p23_fig5_en.jpg)

<i>Figure 5. Hardware-in-the-loop measurement of total closed-loop latency. (A) Pre-recorded LFPs are played into Open Ephys, encoded, sent to SpiNNaker, and used to trigger an Arduino pulse that is recorded back for timing. (B) Direct Python control of the Arduino (PY) is faster than the Open Ephys plugin (OE), and closer to the offline baseline (OFF). The right panel shows latency as a percentage of each ripple’s duration; the dashed line at 100% is the event’s end. (C) Round-trip latency grows with buffer size. Short buffers fall within the typical ripple-duration distribution (histogram); longer buffers push relative latency above 100%. (D) Larger buffers raise F1 only modestly, while median latency increases substantially. (E, F) Buffer size and firing threshold together set the latency–performance operating point. From Félix et al., 2026, Figure 5.</i>

### Effects in the awake mouse

In the preliminary in vivo configuration, the median round-trip latency was 76.47 ms, with the middle half of delays between 66.67 and 88.13 ms, and only 13.7% of ripples received stimulation before they ended. The detector still found most marked events (median recall 0.77, precision 0.30, F1 0.44).

Aligning ripple-band power on the detection time, light-on and light-off sessions looked similar before the pulse. In the 50 ms after detection, mean power was lower when the light was on. Across all 12 sessions, that difference did not reach the paper’s threshold for statistical significance (p = 0.07), though the effect was large (Cliff’s δ = 0.69; this number describes how consistently one group sits below the other).

Because the longer delay meant brief ripples were often already finished when the light arrived, the authors then looked at the longest 25% of detected ripples in each session—the events most likely to still be ongoing. In that subset, light-on sessions had significantly lower ripple energy than light-off sessions (p = 0.048, δ = 0.75). Other features moved in the same direction: the longest events looked weaker and more spread out in frequency, with large effects that were not statistically significant given the number of sessions.

![Figure 6. Closed-loop optogenetic experiments in awake, head-fixed mice. (A) CA1 signals recorded with µLED optoelectrodes go through Open Ephys and a Python bridge to SpiNNaker; a detection triggers a 100 ms inhibitory light pulse. (B) In these sessions the detector’s median recall was 0.77, median precision 0.30, and median F1-score 0.44. (C) With a preliminary 20 ms buffer and the Open Ephys plugin, median latency sat to the right of most ripple durations, so relative latency was typically above 100%. (D) Mean ripple-band power aligned to detection. After the pulse, ON sessions (orange, n = 8) fall below OFF sessions (blue, n = 4); the difference in the +50 ms window was p = 0.07, with a large effect size. (E) For the longest 25% of ripples in each session, ON sessions had significantly lower energy (star). Other features show large effects in the same direction but were not statistically significant. From Félix et al., 2026, Figure 6.](/img/readApaper-23/p23_fig6_en.jpg)

<i>Figure 6. Closed-loop optogenetic experiments in awake, head-fixed mice. (A) CA1 signals recorded with µLED optoelectrodes go through Open Ephys and a Python bridge to SpiNNaker; a detection triggers a 100 ms inhibitory light pulse. (B) In these sessions the detector’s median recall was 0.77, median precision 0.30, and median F1-score 0.44. (C) With a preliminary 20 ms buffer and the Open Ephys plugin, median latency sat to the right of most ripple durations, so relative latency was typically above 100%. (D) Mean ripple-band power aligned to detection. After the pulse, ON sessions (orange, n = 8) fall below OFF sessions (blue, n = 4); the difference in the +50 ms window was p = 0.07, with a large effect size. (E) For the longest 25% of ripples in each session, ON sessions had significantly lower energy (star). Other features show large effects in the same direction but were not statistically significant. From Félix et al., 2026, Figure 6.</i>

## Analysis

The compact SNN is useful here because it is small enough to run in real time on a low-power board, and remains competitive when classical filters are not painstakingly retuned. A carefully calibrated filter still reached the highest F1-score on this dataset.

The 50 ms median delay and the “up to 80%” intra-event rate describe the optimized pre-recorded loop. They show that, in that configuration, the full recording-to-trigger chain can often fit inside a ripple. The live-animal sessions used a slower preliminary setup, so most pulses arrived after that ripple had already ended. Only a pulse that still overlaps the oscillation can act on that event.

What the in vivo data show is more specific. Across all events, the drop in power after detection was large but not statistically significant (p = 0.07). On the longest quarter of ripples, where a delayed pulse was more likely to overlap the event, the energy of the oscillation was significantly lower when the light was on (p = 0.048). That is evidence that a neuromorphic-triggered light pulse can alter an ongoing ripple when it still coincides with the event. The measurements concern timing and the ripple’s electrical signature, not later memory performance.

## Summary

- A 41-neuron spiking network can detect hippocampal ripples in the same performance range as larger deep-learning detectors, and can run in real time on a SpiNNaker board at a fraction of the power of a CPU or GPU simulation.
- In an optimized hardware-in-the-loop test with pre-recorded signals, the full loop reached a median total closed-loop latency of 48.53 ms and delivered a pulse before ripple termination in 80.4% of events.
- In the actual in vivo sessions, which still used a slower preliminary setup, most pulses arrived after the ripple had ended (median 76.47 ms; only 13.7% arrived in time). On the longest events, the timed light pulse significantly reduced ripple energy. This paper measures timing and the ripple’s electrical signature, not later memory.

---

## References and resources

- Félix, P., Jurado-Parras, M.-T., Freitas, J., Ventura, J., de la Prida, L. M., & Aguiar, P. (2026). <i>Low-latency neuromorphic closed-loop control of hippocampal ripples in vivo.</i> bioRxiv. Preprint, posted 2026-07-15. [doi.org/10.64898/2026.07.09.737518](https://doi.org/10.64898/2026.07.09.737518) · [Full text](https://www.biorxiv.org/content/10.64898/2026.07.09.737518v1)
- Buzsáki, G. (2015). <i>Hippocampal sharp wave-ripple: A cognitive biomarker for episodic memory and planning.</i> Hippocampus, 25(10), 1073–1188. [doi.org/10.1002/hipo.22488](https://doi.org/10.1002/hipo.22488)
- Buzsáki, G., Anastassiou, C. A., & Koch, C. (2012). <i>The origin of extracellular fields and currents — EEG, ECoG, LFP and spikes.</i> Nature Reviews Neuroscience, 13, 407–420. [doi.org/10.1038/nrn3241](https://doi.org/10.1038/nrn3241)
- Girardeau, G., Benchenane, K., Wiener, S. I., Buzsáki, G., & Zugaro, M. B. (2009). <i>Selective suppression of hippocampal ripples impairs spatial memory.</i> Nature Neuroscience, 12, 1222–1223. [doi.org/10.1038/nn.2384](https://doi.org/10.1038/nn.2384)
- Figures 1, 4, 5, and 6 are from Félix et al. (2026).
- Training and evaluation used a public CA1 dataset (Figshare project 117897) and additional sessions, described in Navas-Olive, A., Amaducci, R., Jurado-Parras, M.-T., Sebastian, E. R., & de la Prida, L. M. (2022). <i>Deep learning-based feature extraction for prediction and interpretation of sharp-wave ripples in the rodent hippocampus.</i> eLife, 11, e77772. [doi.org/10.7554/eLife.77772](https://doi.org/10.7554/eLife.77772) and Navas-Olive, A., Rubio, A., Abbaspoor, S., Hoffman, K. L., & de la Prida, L. M. (2024). <i>A machine learning toolbox for the analysis of sharp-wave ripples reveals common waveform features across species.</i> Communications Biology, 7, 211. [doi.org/10.1038/s42003-024-05871-w](https://doi.org/10.1038/s42003-024-05871-w).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-09 · bioRxiv, 2026</i>

海马里一次短暂的活动爆发，往往持续不到十分之一秒。如果想在它还在进行时采取行动，就必须在同一个短窗口里发现它并做出响应。这篇文章要讲的，就是一套为此而建的系统。

## 背景

<b>海马</b>是大脑深处的一个结构，对形成关于事件和地点的记忆尤其重要。记忆并不是在经历发生的那一刻就完成了。在随后的休息中，海马可以重放刚刚发生过的活动片段，这一过程被认为有助于这些痕迹稳定下来，并随着时间进入更持久的网络（Buzsáki, 2015）。

要观察这些活动，研究者会把细电极放到组织里，记录<b>局部场电位</b>（local field potential, LFP）：也就是神经元外侧附近的电压。它主要来自许多邻近细胞一起活动时产生的电流总和，是一种局部的群体信号，而不是单个神经元的一次发放（Buzsáki, Anastassiou, & Koch, 2012）。

在海马中，最有特点的 LFP 模式之一是<b>锐波涟漪</b>（sharp-wave ripple）。较慢的电位偏转（锐波）上，叠着一次短暂的快速振荡（涟漪）。在本文使用的啮齿类记录里，涟漪位于 100–250 Hz，通常只持续约 30–100 毫秒（Félix 等, 2026；Buzsáki, 2015）。它是局部海马神经元群一次短促、高度同步的爆发。这类事件主要出现在“离线”状态：动物安静清醒、身体不动时，或在慢波（非快速眼动）睡眠中，而不是在主动走动和探索时（Buzsáki, 2015）。

为什么值得研究？在涟漪期间，近期经历中一起发放过的神经元，可以再次以压缩的顺序发放，常被称为重放（replay）。这与记忆巩固有关。在一项著名实验中，学习空间任务后如果选择性地打断涟漪，大鼠随后的记忆表现会变差（Girardeau 等, 2009）。这类检验只有在干预对准这一事件本身时才有意义。

这就是一个<b>闭环</b>问题。闭环系统持续观察正在进行的脑信号，只在出现选定模式时才动作，而不是一直刺激。对涟漪来说，动作必须在这次短暂振荡结束前到达，否则就不再是在干预这一事件。本文讨论的研究，正是要建立一个能检出涟漪并触发短暂干预的回路。它测量的是回路能有多快做出响应，以及一次定时的光脉冲会不会改变涟漪的电信号特征，并没有测试动物事后记不记得更好。

## 问题

难点不仅是准确，还有时间。一次涟漪在几十毫秒内就会结束，因此高带宽的脑数据必须在这个窗口里变成判断和指令，功耗也需要控制在未来设备有可能承受的范围内。大型深度学习检测器可以很准，但往往太重，难以在端侧这么快地运行。一套针对这类快速、短暂事件的完整回路——足够快、足够省电、建立在许多实验室已有的工具上，并且在活体大脑中得到检验——此前还没有被展示出来。

在 2026 年的一篇 bioRxiv 预印本里，Félix 和同事试图补上这一缺口。他们训练一个紧凑的<b>脉冲神经网络</b>（spiking neural network, SNN）——单元之间像神经元一样用离散脉冲通信——并把它放到 <b>SpiNNaker</b> 上运行，这是一块为实时、低功耗仿真这类网络而设计的板卡。板卡接入实验室常用的记录系统 Open Ephys；一旦检出涟漪，就在清醒小鼠中触发一道短暂的光，用来抑制这一事件。

## 方法

起始信号是在 CA1 记录到的 LFP。CA1 是海马中一个常被用来观察涟漪的亚区。作者先只保留涟漪频段（100–250 Hz），再把滤波后的波形变成两路事件：信号向上越过阈值时产生 UP 脉冲，向下越过时产生 DN 脉冲。这就是<b>异步增量调制</b>。这些事件最初按 30 kHz 采样，再被降到 1 kHz，以匹配 SpiNNaker 的 1 毫秒时间步。这样做不是为了完美重建波形，而是保留能标志涟漪的时间模式。用这些事件重建后，仍然能看到快速振荡，而且编码后的脉冲在涟漪期间比安静基线密得多。

这些事件流被切成相互重叠的短窗口，用来训练一个很小的前馈 SNN：两个输入通道，两层<b>漏积分发放</b>隐层（先是 24 个单元，再是 16 个），再加上一个在报告涟漪时发放的输出神经元。整个网络一共 41 个神经元、530 个可调参数。训练在软件里用替代梯度反向传播完成，让脉冲网络也能用普通深度学习里的那种梯度下降来训练。

![Figure 1. 脉冲编码和这个小型 SNN。(A) 原始 CA1 局部场电位先在涟漪频段（100–250 Hz）带通滤波，再被转换成稀疏的 UP、DN 事件，并从 30 kHz 降采样到 1 kHz。(B) 用这些事件重建滤波轨迹，仍然能看到高频涟漪。(C) 编码后的发放率和重建信噪比在涟漪段（R）都高于非涟漪基线（NR）。(D) 用相互重叠的窗口做有监督训练并标注。(E) 网络有两层隐层，分别是 24 和 16 个漏积分发放神经元，以及一个输出神经元。取自 Félix 等，2026，Figure 1。](/img/readApaper-23/p23_fig1_en.jpg)

<i>Figure 1. 脉冲编码和这个小型 SNN。(A) 原始 CA1 局部场电位先在涟漪频段（100–250 Hz）带通滤波，再被转换成稀疏的 UP、DN 事件，并从 30 kHz 降采样到 1 kHz。(B) 用这些事件重建滤波轨迹，仍然能看到高频涟漪。(C) 编码后的发放率和重建信噪比在涟漪段（R）都高于非涟漪基线（NR）。(D) 用相互重叠的窗口做有监督训练并标注。(E) 网络有两层隐层，分别是 24 和 16 个漏积分发放神经元，以及一个输出神经元。取自 Félix 等，2026，Figure 1。</i>

训练好的网络随后被放进一条实时链路。记录系统 Open Ephys 把 LFP 送到主机上的程序，由它对每一段到来的信号做滤波和编码。UP 和 DN 事件经以太网送到 SpiNNaker。输出神经元发放时，Arduino 发出脉冲，打开持续 100 毫秒的蓝光。这里用的是<b>光遗传学</b>：某些细胞经过遗传准备，可以用光来打开或关闭。在这里，光用来募集 CA1 中的抑制性神经元，目的是减弱这次涟漪。输出神经元的发放阈值决定系统有多容易宣布检出。

## 实验

作者在几个层次上测试了这条回路，并把预记录信号上的测试和活体实验分开。文中常见的三个分数，各自回答不同的问题。<b>召回率</b>问的是：在人工标出的涟漪里，网络抓住了多少？<b>精确率</b>问的是：在网络宣布“这是涟漪”的时刻里，有多少是真的？<b>F1 分数</b>则是把两者加以平衡的一个数。时间用<b>往返延迟，也就是总闭环延迟</b>来衡量：从一次涟漪开始，经过记录、编码、板卡和触发，到指令脉冲出现，花了多久。<b>相对延迟</b>则是把这段延迟和该次涟漪自己的持续时间相比；低于 100%，表示脉冲在事件结束前到达。

### 在已标注记录上的离线检测

检测在 23 次记录、5 只小鼠、共 2,719 个人工标注涟漪上评分，数据来自公开的清醒、头部固定 CA1 数据集，以及格式相近的补充场次。SNN 还和已有检测器做了比较，包括经典的 Buzsáki 风格均方根滤波器、另一种滤波器（Dutta），以及更大的深度学习模型，既使用默认设置，也使用针对这个数据集调过的设置。

### 用预记录信号做的闭环测试

为了在尚未使用活体动物时就把网络放到板卡上，预记录的 LFP 经 Open Ephys 流式播放，编码后在 SpiNNaker 上处理。这是对已缓存记录做<b>在线</b>处理，有别于软件仿真器或板卡上的<b>离线</b>回放。作者改变了输出阈值，并在 14 场记录上比较了 GPU、CPU 和 SpiNNaker 的功耗。

为了测量整条链路的速度，他们搭建了<b>硬件在环</b>装置：把预先记录的海马 LFP 送进 Open Ephys，模拟现场采集，再经过编码、SpiNNaker 和 Arduino，并把 Arduino 的脉冲录回来。他们比较了两种触发 Arduino 的方式，并改变了每一步处理前缓存多少数据，以及检测阈值设得有多高。

### 活体光遗传实验

完整的“感知—处理—刺激”回路随后在两只清醒、头部固定的小鼠中运行，共 12 场实验（关灯 4 场，开灯 8 场）。CA1 信号用既能记录又能打光的高密度电极采集。一旦检出，系统就给出 100 毫秒的抑制性光脉冲，作用对象是抑制性（GABA 能）神经元。这些活体实验用的是<b>尚未做延迟优化的初步配置</b>：缓存更长（20 毫秒），触发路径也更慢。事后共标注了 1,699 个涟漪。作者比较了开灯和关灯场次的检测分数、延迟、检测时刻前后的涟漪频段功率，以及每场中最长的 25% 检出涟漪的振荡能量——大致就是这次振荡有多强、持续有多久。

## 结果

### 检测表现

在离线软件测试中，网络抓住了大部分已标注涟漪，但也有不少假警报：中位召回率 0.89，中位精确率 0.50，中位 F1 为 0.56。表现最好的 SNN 中位 F1 达到 0.61，和更大的深度学习模型处在同一范围。经过仔细校准的经典滤波器仍然更高（中位 F1 = 0.70）。不过，当这些滤波器停在默认设置时，分数会明显下降，而 SNN 优于未调参的版本。

同一网络在 SpiNNaker 上运行时，提高检测阈值会让系统更“挑剔”（假警报更少，漏检更多）。从软件仿真器迁到板卡后，F1 只是中等程度下降；在板卡上从离线转到在线处理，在较均衡的阈值上几乎不再增加损失。功耗差异则很大。在 14 场记录上，GPU 和 CPU 推理的中位功耗分别是 70 W 和 53 W，而且无法实时跟上。SpiNNaker 能以生物实时处理这些记录，整板大约 3.6 W，其中约 0.35 W 被记为仿真本身的功耗——如果只拿这部分和 GPU 或 CPU 比，最高大约节省 200 倍。

![Figure 4. 在 SpiNNaker 上的在线部署。(A) Open Ephys 中流式播放的 LFP，并把检测脉冲和标注涟漪对照。(B, C) 输出神经元的发放阈值会在召回率和精确率之间取舍；0.8 到 1.0 的阈值给出最好的 F1。(D) 从软件仿真器（snnTorch）迁到 SpiNNaker 后，F1 会有所下降；在板卡上从离线转到在线缓存处理，在较均衡的阈值上几乎不再增加损失。(E) 假阴性和假阳性次数随阈值的变化（每分钟）。(F) 推理功耗：GPU 和 CPU 是几十瓦，SpiNNaker 的整板功耗（Total）和记在仿真上的功耗（Sim）要低得多。取自 Félix 等，2026，Figure 4。](/img/readApaper-23/p23_fig4_en.jpg)

<i>Figure 4. 在 SpiNNaker 上的在线部署。(A) Open Ephys 中流式播放的 LFP，并把检测脉冲和标注涟漪对照。(B, C) 输出神经元的发放阈值会在召回率和精确率之间取舍；0.8 到 1.0 的阈值给出最好的 F1。(D) 从软件仿真器（snnTorch）迁到 SpiNNaker 后，F1 会有所下降；在板卡上从离线转到在线缓存处理，在较均衡的阈值上几乎不再增加损失。(E) 假阴性和假阳性次数随阈值的变化（每分钟）。(F) 推理功耗：GPU 和 CPU 是几十瓦，SpiNNaker 的整板功耗（Total）和记在仿真上的功耗（Sim）要低得多。取自 Félix 等，2026，Figure 4。</i>

### 优化后闭环有多快

在硬件在环测试中，触发路径本身就有影响。用控制程序直接驱动 Arduino，而不是走 Open Ephys 插件，缩短了中位延迟，并把能在结束前接到脉冲的涟漪比例从 59% 提高到约 80%。更短的缓存更快；加长缓存对检测的帮助不大，延迟却增加很多。

最快的设置——3 毫秒缓存加一个较灵敏的阈值——给出的中位总闭环延迟是 48.53 毫秒，中间一半的延迟落在 41.37 到 56.52 毫秒之间。这就是文中“大约 50 毫秒”。在这一设置下，80.4% 的事件能在涟漪结束前接到脉冲。这组 50 毫秒和 80% 的数字，来自用预记录信号、并经过优化的硬件在环测试，并不是后面活体实验里测到的延迟。

![Figure 5. 用硬件在环测量总闭环延迟。(A) 预记录的 LFP 被送进 Open Ephys，编码后交给 SpiNNaker，再触发 Arduino 脉冲，并把脉冲录回来计时。(B) 用 Python 直接控制 Arduino（PY）比走 Open Ephys 插件（OE）更快，也更接近离线基线（OFF）。右图把延迟表示成该次涟漪时长的百分比，虚线 100% 表示事件结束。(C) 往返延迟随缓存增大而增加。短缓存落在典型涟漪时长分布（直方图）之内；更长的缓存会把相对延迟推到 100% 以上。(D) 加大缓存只能略微提高 F1，中位延迟却明显增加。(E, F) 缓存大小和发放阈值一起决定延迟与检测表现的工作点。取自 Félix 等，2026，Figure 5。](/img/readApaper-23/p23_fig5_en.jpg)

<i>Figure 5. 用硬件在环测量总闭环延迟。(A) 预记录的 LFP 被送进 Open Ephys，编码后交给 SpiNNaker，再触发 Arduino 脉冲，并把脉冲录回来计时。(B) 用 Python 直接控制 Arduino（PY）比走 Open Ephys 插件（OE）更快，也更接近离线基线（OFF）。右图把延迟表示成该次涟漪时长的百分比，虚线 100% 表示事件结束。(C) 往返延迟随缓存增大而增加。短缓存落在典型涟漪时长分布（直方图）之内；更长的缓存会把相对延迟推到 100% 以上。(D) 加大缓存只能略微提高 F1，中位延迟却明显增加。(E, F) 缓存大小和发放阈值一起决定延迟与检测表现的工作点。取自 Félix 等，2026，Figure 5。</i>

### 清醒小鼠中的效应

在活体实验的初步配置下，中位往返延迟是 76.47 毫秒，中间一半的延迟落在 66.67 到 88.13 毫秒之间，只有 13.7% 的涟漪在结束前接到了刺激。检测器仍然找到了大部分已标注事件（中位召回率 0.77，精确率 0.30，F1 为 0.44）。

把涟漪频段功率对齐到检测时刻后，开灯和关灯场次在脉冲之前看起来相近。检测后 50 毫秒内，开灯时的平均功率更低。在全部 12 场实验上，这个差异没有达到论文设定的统计显著标准（p = 0.07），不过效应很大（Cliff’s δ = 0.69；这个数描述的是一组是否一贯低于另一组）。

由于延迟较长，短暂的涟漪往往在光到达时已经结束，作者于是查看每场中最长的 25% 检出涟漪——也就是最可能仍在进行的事件。在这个子集里，开灯场次的涟漪能量显著低于关灯场次（p = 0.048，δ = 0.75）。其他特征也朝着同一方向变化：这些较长的事件看起来更弱，频谱也更分散，效应量大，但在现有场次数量下没有达到统计显著。

![Figure 6. 在清醒、头部固定小鼠中的闭环光遗传实验。(A) 用 µLED 光电电极记录的 CA1 信号经 Open Ephys 和 Python 桥接到 SpiNNaker；检出后触发 100 毫秒的抑制性光脉冲。(B) 在这些场次中，检测器的中位召回率是 0.77，中位精确率是 0.30，中位 F1 是 0.44。(C) 在初步的 20 毫秒缓存和 Open Ephys 插件条件下，中位延迟落在大多数涟漪时长的右侧，因此相对延迟通常高于 100%。(D) 以检测时刻对齐的平均涟漪频段功率。脉冲之后，开灯场次（橙色，n = 8）低于关灯场次（蓝色，n = 4）；检测后 50 毫秒窗口的差异是 p = 0.07，效应量很大。(E) 对每场中最长的 25% 涟漪，开灯场次的能量显著更低（星号）。其他特征也有同方向的大效应，但没有达到统计显著。取自 Félix 等，2026，Figure 6。](/img/readApaper-23/p23_fig6_en.jpg)

<i>Figure 6. 在清醒、头部固定小鼠中的闭环光遗传实验。(A) 用 µLED 光电电极记录的 CA1 信号经 Open Ephys 和 Python 桥接到 SpiNNaker；检出后触发 100 毫秒的抑制性光脉冲。(B) 在这些场次中，检测器的中位召回率是 0.77，中位精确率是 0.30，中位 F1 是 0.44。(C) 在初步的 20 毫秒缓存和 Open Ephys 插件条件下，中位延迟落在大多数涟漪时长的右侧，因此相对延迟通常高于 100%。(D) 以检测时刻对齐的平均涟漪频段功率。脉冲之后，开灯场次（橙色，n = 8）低于关灯场次（蓝色，n = 4）；检测后 50 毫秒窗口的差异是 p = 0.07，效应量很大。(E) 对每场中最长的 25% 涟漪，开灯场次的能量显著更低（星号）。其他特征也有同方向的大效应，但没有达到统计显著。取自 Félix 等，2026，Figure 6。</i>

## 分析

这个小型 SNN 在这里有用，是因为它足够小，能在低功耗板卡上实时运行，并且在经典滤波器没有被仔细重调时仍然有竞争力。经过仔细校准的滤波器，在这个数据集上仍然拿到了最高的 F1。

约 50 毫秒的中位延迟，以及“最多约 80%”能在事件内接到刺激，描述的是优化后的预记录回路。它们说明，在那种配置下，从记录到触发的整条链常常赶得上一次涟漪。活体实验用的是更慢的初步配置，因此大多数脉冲是在该次涟漪已经结束后才到达。只有仍然与振荡重合的脉冲，才能作用于这一事件。

活体数据说明的事情更具体。在全部事件上，检测后的功率下降效应量大，但没有达到统计显著（p = 0.07）。在最长的那四分之一涟漪上，延迟脉冲更有可能还叠在事件上，开灯时振荡能量显著更低（p = 0.048）。这是神经形态系统触发的光脉冲，在仍然与事件重合时，能够改变一次正在进行的涟漪的证据。这些测量针对的是时机和涟漪的电信号特征，而不是事后的记忆表现。

## 总结

- 一个只有 41 个神经元的脉冲网络，检测海马涟漪的表现可以和更大的深度学习检测器处在同一范围，并且能在 SpiNNaker 板上实时运行，功耗远低于 CPU 或 GPU 仿真。
- 在用预记录信号、经过优化的硬件在环测试中，完整回路的中位总闭环延迟是 48.53 毫秒，并能在 80.4% 的事件结束前送出脉冲。
- 真正的活体实验仍使用较慢的初步配置，大多数脉冲是在涟漪结束后才到达（中位 76.47 毫秒，只有 13.7% 赶在结束前）。对于其中较长的事件，定时光脉冲显著降低了涟漪能量。本文测量的是时机和涟漪的电信号特征，而不是事后记忆。

---

## References and resources

- Félix, P., Jurado-Parras, M.-T., Freitas, J., Ventura, J., de la Prida, L. M., & Aguiar, P. (2026). <i>Low-latency neuromorphic closed-loop control of hippocampal ripples in vivo.</i> bioRxiv. 预印本，发布于 2026-07-15。[doi.org/10.64898/2026.07.09.737518](https://doi.org/10.64898/2026.07.09.737518) · [全文](https://www.biorxiv.org/content/10.64898/2026.07.09.737518v1)
- Buzsáki, G. (2015). <i>Hippocampal sharp wave-ripple: A cognitive biomarker for episodic memory and planning.</i> Hippocampus, 25(10), 1073–1188。[doi.org/10.1002/hipo.22488](https://doi.org/10.1002/hipo.22488)
- Buzsáki, G., Anastassiou, C. A., & Koch, C. (2012). <i>The origin of extracellular fields and currents — EEG, ECoG, LFP and spikes.</i> Nature Reviews Neuroscience, 13, 407–420。[doi.org/10.1038/nrn3241](https://doi.org/10.1038/nrn3241)
- Girardeau, G., Benchenane, K., Wiener, S. I., Buzsáki, G., & Zugaro, M. B. (2009). <i>Selective suppression of hippocampal ripples impairs spatial memory.</i> Nature Neuroscience, 12, 1222–1223。[doi.org/10.1038/nn.2384](https://doi.org/10.1038/nn.2384)
- Figure 1、4、5、6 取自 Félix 等（2026）。
- 训练和评估使用了公开的 CA1 数据集（Figshare 项目 117897）以及补充场次，见 Navas-Olive, A., Amaducci, R., Jurado-Parras, M.-T., Sebastian, E. R., & de la Prida, L. M. (2022). <i>Deep learning-based feature extraction for prediction and interpretation of sharp-wave ripples in the rodent hippocampus.</i> eLife, 11, e77772。[doi.org/10.7554/eLife.77772](https://doi.org/10.7554/eLife.77772) 以及 Navas-Olive, A., Rubio, A., Abbaspoor, S., Hoffman, K. L., & de la Prida, L. M. (2024). <i>A machine learning toolbox for the analysis of sharp-wave ripples reveals common waveform features across species.</i> Communications Biology, 7, 211。[doi.org/10.1038/s42003-024-05871-w](https://doi.org/10.1038/s42003-024-05871-w)。
