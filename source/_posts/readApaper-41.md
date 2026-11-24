---
title: "readApaper#41 Minimally invasive implantation of scalable high-density cortical microelectrode arrays for multimodal neural decoding and stimulation"
title_zh: "readApaper#41 Minimally invasive implantation of scalable high-density cortical microelectrode arrays for multimodal neural decoding and stimulation"
date: 2026-11-27 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - bioelectronics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 27 November 2026 · Nature Biomedical Engineering, 2026</i>

This paper describes a 1,024-channel thin-film array that sits on the cortical surface, a way to slide it under the dura through a narrow skull cut, and tests of recording, decoding, and stimulation in pigs, plus short recordings in five patients.

## Background

A <b>brain–computer interface</b> (BCI) reads neural activity and turns it into an output such as a cursor, a prosthetic limb, or speech, or delivers electrical stimulation back to the brain. High-performing systems usually need a large amount of neural data, often from more than one cortical area, at a scale fine enough to tell neighbouring sites apart.

<b>Penetrating arrays</b> send fine shanks into the cortex. They record at high spatial resolution, but tissue disruption tends to grow with shank count, and they are hard to remove without further damage. <b>Surface arrays</b> sit on the brain rather than in it. In <b>electrocorticography</b> (ECoG), contacts are placed on the cortical surface, typically in the <b>subdural space</b> between the dura and the pia. Clinical ECoG grids already support motor and speech prostheses, but with larger, more widely spaced contacts. <b>Micro-electrocorticography</b> (μECoG) uses smaller, more tightly packed contacts, so the surface map is finer.

Placing a surface grid usually means a <b>craniotomy</b>: removing a window of skull. Avoiding a large bone window, while still seating a high-density array accurately, would change the surgical cost of adding channels. A <b>bidirectional</b> interface can also pass current through the same or neighbouring contacts to modulate cortical activity.

The main large-animal work uses adult Göttingen minipigs, chosen in part because their skull thickness is comparable to that of adult humans. A recurring feature is <b>high-gamma</b> amplitude (about 70–150 Hz), which tracks local population activity and is used in decoding.

## Problem

More electrodes, closer together and spread over a larger area, generally provide more information. If each added channel also adds tissue injury or operating time, that path does not scale. The authors built a modular thin-film μECoG array that can be delivered through a narrow skull incision, later removed, and used to record and stimulate. They ask how much spatial detail is present on the surface, whether denser sampling improves decoding, and whether the platform can be used briefly during human neurosurgery.

## Method

Two designs were fabricated on a polyimide thin film with platinum tissue contacts. The first has 529 electrodes of four diameters (20, 50, 100, and 200 μm) on a 300 μm pitch, used to compare size, impedance, and inter-channel correlation. The second has 1,024 channels: 977 recording sites 50 μm across, 42 stimulation sites 380 μm across, and five 500 μm references, all on a 400 μm pitch. Manufacturing yields were greater than 93% and 91%. Arrays can be bonded into larger modules and passed through a single slit. Recordings were sampled at 20 kHz per channel.

Delivery uses a “<b>cranial micro-slit</b>.” A precision sagittal saw makes a 500- to 900-μm-wide cut in the skull, approaching roughly tangent to the cortical surface. A fibrescope opens the dura under direct vision and watches the array enter the subdural space. The array is carried on a radiopaque stylet that fits a polyimide pocket on its back; once endoscopy and fluoroscopy or CT confirm position, the stylet is withdrawn and the film stays on the cortex.

![Figure 1. Overview of the thin-film cortical interface (paper Figure 1). (a–c) A Göttingen minipig and a schematic of a micro-slit path into the subdural space (blue), with dura in purple and skull in beige. (d) A 1,024-channel array module. (e) A larger stimulation site with example current waveforms; (f) 50 μm recording sites with example traces. (g, h) Multichannel activity can be mapped and used for decoding or stimulation. Panels (e–g) are conceptual illustrations, not physiological data.](/img/readApaper-41/p41_fig1.png)

<i>Figure 1. Overview of the thin-film cortical interface (paper Figure 1). (a–c) A Göttingen minipig and a schematic of a micro-slit path into the subdural space (blue), with dura in purple and skull in beige. (d) A 1,024-channel array module. (e) A larger stimulation site with example current waveforms; (f) 50 μm recording sites with example traces. (g, h) Multichannel activity can be mapped and used for decoding or stimulation. Panels (e–g) are conceptual illustrations, not physiological data.</i>

Every electrode can record or stimulate. In vivo, 16 sites on each 529-channel array were reserved for stimulation. Currents first measured as safe in vitro (50–100 μA, 200 μs pulse width) were applied in the animal through the 200 μm electrodes, while neighbouring sites and an adjacent array recorded the response.

For tactile location on the snout (the <b>rostrum</b>), each channel was reduced to low-frequency activity below 10 Hz and high-gamma amplitude (70–150 Hz) and passed to a convolutional–recurrent network. Walking used a simpler convolutional network on short time windows. Human speech onset used logistic regression.

## Experiments

Micro-slit placement was tested in 22 insertions (one to four per animal) in eight Göttingen minipigs, and repeatedly in 23 fresh human cadaver heads, aimed at the upper-limb region of motor cortex. A further 61 arrays were placed through small craniotomies in 21 minipigs for electrophysiology and biocompatibility; some recording experiments used a small craniectomy, separate from the micro-slit procedure.

![Figure 2. Micro-slit insertion, placement, and histology (paper Figure 2). (a–c) The saw cut, stylet-guided insertion, and stylet withdrawal. (d–f) The same steps in a human cadaver head, seen through an endoscope (arrowheads mark skull, dura, and pia). (g, h) CT slices of arrays on human motor cortex (cadaver) and pig somatosensory cortex; blue arrowheads are radiopaque markers. (i, j) Two 529-channel arrays on a pig cortex after a craniotomy, and the same surface just after removal, with an intact pia. (k, l) 42-day histology under the thin-film array and under a standard four-contact strip; representative sections from 1 of 8 replicates for each device.](/img/readApaper-41/p41_fig2.png)

<i>Figure 2. Micro-slit insertion, placement, and histology (paper Figure 2). (a–c) The saw cut, stylet-guided insertion, and stylet withdrawal. (d–f) The same steps in a human cadaver head, seen through an endoscope (arrowheads mark skull, dura, and pia). (g, h) CT slices of arrays on human motor cortex (cadaver) and pig somatosensory cortex; blue arrowheads are radiopaque markers. (i, j) Two 529-channel arrays on a pig cortex after a craniotomy, and the same surface just after removal, with an intact pia. (k, l) 42-day histology under the thin-film array and under a standard four-contact strip; representative sections from 1 of 8 replicates for each device.</i>

A formal safety and reversibility study implanted 16 minipigs bilaterally, through small burr-hole incisions, with either two thin-film arrays or two standard four-contact silastic strip electrodes. Animals were followed for 7 days (subacute) or 42 days (chronic). Daily neurologic exams were performed, and an independent veterinary neuropathologist reviewed haematoxylin–eosin, Iba1, and GFAP sections.

In pigs, the authors recorded spontaneous activity and evoked potentials from somatosensory, motor, visual, and auditory cortex; decoded tactile sites, limb evoked potentials, visual on–off responses, and walking-related behaviour; and stimulated visual cortex while recording nearby sites. Walking sessions used bilateral craniotomies, 2,048 channels (one 1,024-channel array over each motor cortex), and treadmill walking after anaesthesia, with limb motion captured by cameras, fiducials, and accelerometers.

In a five-patient intraoperative pilot, a 1,024-channel array was placed for up to 15 minutes alongside a standard subdural strip, after a traditional craniotomy already opened for clinical mapping. Two patients were under general anaesthesia; three underwent awake language mapping, with recordings from the left superior temporal gyrus, left angular gyrus, or left frontal operculum during cued speech.

## Results

The micro-slit procedure, from skin incision to securing the arrays, took under 20 minutes. The largest micro-slit configuration in one animal was four 529-channel devices—two through each of two slits—for 2,116 channels. Joined modules gave 1,058 channels over 0.96 cm². In cadaver heads, endoscopy and CT confirmed placement over motor cortex.

In the 16-animal safety study, no animal showed neurologic impairment, and the pial surface was intact after removal. Histology at 7 and 42 days found no acute or chronic tissue injury attributable to the subdural implants. The tissue response was similar for thin-film and control devices, with slightly less inflammation after chronic implantation of the thinner film. At 42 days the arrays could still be removed by gentle traction from the epidural lead.

Neighbouring surface channels were not fully redundant. Even at 300 μm spacing with 50 μm electrodes, the squared correlation r² fell as frequency rose: 0.67 ± 0.10 in beta (12–30 Hz), 0.56 ± 0.10 in low gamma (30–50 Hz), 0.35 ± 0.08 in mid-gamma (70–110 Hz), and 0.12 ± 0.06 in high gamma (130–170 Hz). Activity was visible up to 500 Hz. Limb somatosensory evoked potentials reversed phase at the motor–sensory boundary as a two-dimensional contour at 300 μm resolution. Visual evoked potentials were recorded over visual cortex, and 2,048 channels were recorded during walking together with limb motion.

![Figure 3. High-density surface recordings in anesthetized and walking pigs (paper Figure 3). (a, d) Neighbouring 50 μm channels show small differences in the raw voltage. (b) Traces during spontaneous walking from one of two 1,024-channel arrays over sensorimotor cortex. (c) Placement of arrays on several functional areas in the same animal. (e) Spectrograms from two somatosensory channels. (f) Treadmill walking with limb tracking. (g) Tibial-nerve somatosensory evoked potentials; the inset shows a sub-millimetre phase reversal and a two-dimensional isoelectric contour (traces span 1 s; peak-to-peak about 5 μV). (h) Visual evoked potentials from left-eye photostimulation, on the same scales. (i) One frame of a 20 kHz, 1,024-channel voltage map over left sensorimotor cortex, aligned to the cortical surface.](/img/readApaper-41/p41_fig3.png)

<i>Figure 3. High-density surface recordings in anesthetized and walking pigs (paper Figure 3). (a, d) Neighbouring 50 μm channels show small differences in the raw voltage. (b) Traces during spontaneous walking from one of two 1,024-channel arrays over sensorimotor cortex. (c) Placement of arrays on several functional areas in the same animal. (e) Spectrograms from two somatosensory channels. (f) Treadmill walking with limb tracking. (g) Tibial-nerve somatosensory evoked potentials; the inset shows a sub-millimetre phase reversal and a two-dimensional isoelectric contour (traces span 1 s; peak-to-peak about 5 μV). (h) Visual evoked potentials from left-eye photostimulation, on the same scales. (i) One frame of a 20 kHz, 1,024-channel voltage map over left sensorimotor cortex, aligned to the cortical surface.</i>

In four animals, a network trained for 10–20 minutes on eight rostrum sites reached 85–98% accuracy on a later prospective set (mean 92.75% ± 6%), run in real time. Related models reached 82.5–100% on limb somatosensory potentials and on–off visual responses. For eight classes, accuracy stayed above 95% even after four-fold downsampling. In three further animals the task was hardened to 14, 24, or 30 sites. Accuracy then rose with channel count, was highest with all 1,024 channels, and did not level off for the 24- and 30-class problems. Those arrays had yields of 96%, 97%, and 98%.

![Figure 4. Tactile decoding improves with channel count and density (paper Figure 4). (a, b) Up to 30 stimulation sites on the rostrum, and a 1,024-channel array over the corresponding somatosensory cortex. (c) Subsampling used to mimic a coarser grid. (d) Preprocessing and the convolutional–recurrent decoder. (e) Accuracy versus the number of channels in one animal (left) and peak accuracy in three animals trained on 8, 14, 24, or 30 classes (right; 50 models per point; yields 96%, 97%, and 98%). (f, g) How correlation between channels falls with distance and with frequency; (g) is at a single 400 μm spacing (n = 11,856 pairs).](/img/readApaper-41/p41_fig4.png)

<i>Figure 4. Tactile decoding improves with channel count and density (paper Figure 4). (a, b) Up to 30 stimulation sites on the rostrum, and a 1,024-channel array over the corresponding somatosensory cortex. (c) Subsampling used to mimic a coarser grid. (d) Preprocessing and the convolutional–recurrent decoder. (e) Accuracy versus the number of channels in one animal (left) and peak accuracy in three animals trained on 8, 14, 24, or 30 classes (right; 50 models per point; yields 96%, 97%, and 98%). (f, g) How correlation between channels falls with distance and with frequency; (g) is at a single 400 μm spacing (n = 11,856 pairs).</i>

Walking-related decoding in untrained animals separated head movement, limb movement, and rest at 53–69% accuracy (chance = 33%; k-fold cross-validation, k = 5 or 10). Individualized behaviour labels, when enough examples were available, reached 60–80% (k = 5).

Focal stimulation of pig visual cortex changed high-gamma power in a patch about 2 mm across for under 2 seconds. The effect shrank under deeper anaesthesia and crossed onto a neighbouring array, consistent with a physiological response rather than a stimulus artefact. No saccades were evoked in the tested range. The example maps came from arrays with 90% and 86% yields.

![Figure 6. Focal cortical stimulation in pig visual cortex (paper Figure 6). (a) In vitro waveform used to check polarization; in vivo currents used the same amplitude without the interphase delay. (b–d) Example traces 1 mm from the stimulating site, with and without stimulation and under deeper anaesthesia. Activity is the variance from 200 ms to 2,000 ms, averaged over 40 trials. (e, f) Per-electrode activity with stimulation versus control, and under light versus heavier anaesthesia; highlighted sites lie within 2 mm of the stimulator. (g–i) Spatial maps of stimulated, control, and difference activity on two adjacent arrays (yields 90% and 86%), showing a suppressed region around the site. (j) How that pattern changes with anaesthetic depth.](/img/readApaper-41/p41_fig6.png)

<i>Figure 6. Focal cortical stimulation in pig visual cortex (paper Figure 6). (a) In vitro waveform used to check polarization; in vivo currents used the same amplitude without the interphase delay. (b–d) Example traces 1 mm from the stimulating site, with and without stimulation and under deeper anaesthesia. Activity is the variance from 200 ms to 2,000 ms, averaged over 40 trials. (e, f) Per-electrode activity with stimulation versus control, and under light versus heavier anaesthesia; highlighted sites lie within 2 mm of the stimulator. (g–i) Spatial maps of stimulated, control, and difference activity on two adjacent arrays (yields 90% and 86%), showing a suppressed region around the site. (j) How that pattern changes with anaesthetic depth.</i>

In the human recordings, a somatosensory phase-reversal contour already visible on the four-contact strip was resolved in finer detail on the 1,024-channel array. During awake speech, low-frequency (0–40 Hz) activity was modulated around utterances. Offline, a logistic regression trained on 4 minutes of data containing 54 utterances distinguished speech onset from silence at 79.8% accuracy (95% confidence interval, 77.6–82.0%). The example array had a 99% electrode yield. This is a binary, offline detection of onset, not a decoding of words.

![Figure 5. Intraoperative human recordings and offline speech-onset detection (paper Figure 5). (a–c) MRI of a left temporal tumour, and the left superior temporal gyrus before and after placement of a 1,024-channel array (99% yield) during awake language mapping. (d) Voltage map immediately before speech onset, at the dashed line in (e, f). (e, f) Speech audio and its spectrogram. (g) Neural spectrogram from the starred electrode. (h) Offline accuracy of speech-onset detection from a 4-minute training set, across 100 random train–test splits.](/img/readApaper-41/p41_fig5.png)

<i>Figure 5. Intraoperative human recordings and offline speech-onset detection (paper Figure 5). (a–c) MRI of a left temporal tumour, and the left superior temporal gyrus before and after placement of a 1,024-channel array (99% yield) during awake language mapping. (d) Voltage map immediately before speech onset, at the dashed line in (e, f). (e, f) Speech audio and its spectrogram. (g) Neural spectrogram from the starred electrode. (h) Offline accuracy of speech-onset detection from a 4-minute training set, across 100 random train–test splits.</i>

## Analysis

A thin surface film can carry many channels without a proportional increase in cortical injury, and the surface still contains information at the scale of a few hundred micrometres, especially in higher-frequency bands. That detail matters most when the decoding problem is hard: eight tactile sites were almost solved with a thinned grid, whereas fourteen to thirty sites kept improving out to all 1,024 channels.

The settings of the tests matter. Micro-slit delivery is shown in pigs and in cadaver heads; the 7- and 42-day safety and removal data come from pigs implanted through burr holes; the walking recordings used bilateral craniotomies. The five human cases are short intraoperative recordings made after a standard craniotomy, and the speech result is onset detection from a few minutes of data. Stimulation, tested in anesthetized pig visual cortex, produced a focal, anaesthesia-sensitive change in nearby activity. Together they describe a scalable μECoG platform and the signals it can record and evoke, in animals and in a first intraoperative use in people.

## Summary

The authors show that a modular 1,024-channel thin-film cortical array can be placed through a sub-millimetre skull slit, can record and decode sensory and motor activity in pigs, can deliver focal surface stimulation, and can be used for brief high-density mapping during human neurosurgery. On harder tactile tasks, performance kept rising to the full channel count.

## References

- Hettick, M., Ho, E., Poole, A. J., Monge, M., Papageorgiou, D., Takahashi, K., LaMarca, M., Trietsch, D., Reed, K., Murphy, M., Rider, S., Gelman, K. R., Byun, Y. W., Miller, J. S., Hanson, T., Tolosa, V., Lee, S.-H., Bhatia, S., Konrad, P. E., Mager, M., Mermel, C. H., & Rapoport, B. I. (2026). <i>Minimally invasive implantation of scalable high-density cortical microelectrode arrays for multimodal neural decoding and stimulation.</i> Nature Biomedical Engineering, 10, 1206–1221. Published online 2 October 2025. [doi.org/10.1038/s41551-025-01501-w](https://doi.org/10.1038/s41551-025-01501-w) · [Article](https://www.nature.com/articles/s41551-025-01501-w) · [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13278958/)
- Figures 1–6 are from Hettick et al. (2026).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-27 · Nature Biomedical Engineering, 2026</i>

这篇论文介绍了一种贴在皮层表面的 1,024 通道薄膜阵列，以及把它从一道很窄的颅骨切口送入硬膜下方的方法；作者在猪体内测试了记录、解码和刺激，并在五名神经外科患者的术中做了短时记录。

## 背景

<b>脑机接口</b>（BCI）读取神经活动，并把它转换成光标、假肢或语音等输出，也可以把电刺激送回大脑。高性能系统通常需要大量神经数据，而且往往要覆盖不止一个皮层区域，空间尺度还要细到能把相邻位点区分开。

<b>穿入式阵列</b>把纤细的电极刺入皮层。它们可以达到很高的空间分辨率，但组织扰动往往会随电极数量增加，取出时也容易造成额外损伤。<b>表面阵列</b>则贴在大脑表面，而不是刺进去。在<b>皮层脑电</b>（ECoG）中，触点放在皮层表面，通常位于硬膜与软膜之间的<b>硬膜下腔</b>。临床 ECoG 网格已经用于运动和言语假体，但触点较大、间距较宽。<b>微皮层脑电</b>（μECoG）使用更小、排得更密的触点，因而表面图谱更细。

放置表面网格通常需要<b>开颅</b>：去掉一块颅骨。如果能避开大块骨窗，同时仍把高密度阵列准确地放到位，提高通道数的手术代价就会不同。<b>双向</b>接口还可以通过同一或相邻触点通电，用以调节皮层活动。

这里的主体大动物实验使用成年哥廷根小型猪，选择这一品系的部分原因是其颅骨厚度与成年人类相近。文中反复使用的神经特征是<b>高伽马</b>幅度（约 70–150 Hz），这一频段能反映局部群体活动，也常被用于皮层解码。

## 问题

电极更多、排得更密、覆盖更广，通常能提供更多信息。可如果每增加一个通道，组织损伤或手术时间也跟着增加，这条路就难以放大。作者制作了一种模块化的薄膜 μECoG 阵列：它可以通过一道很窄的颅骨切口放入，之后还能取出，并且既能记录也能刺激。随后他们要问：皮层表面究竟还保留多少空间细节，更密的采样是否能提高解码，以及同一套平台能否在人体神经外科手术中做短时使用。

## 方法

两款阵列都做在聚酰亚胺薄膜上，与组织接触的金属是铂。第一款有 529 个电极，直径分为 20、50、100 和 200 μm，间距 300 μm，用来比较尺寸、阻抗和相邻通道的相关程度。第二款承担了大部分高通道数工作，共 1,024 个通道：977 个直径 50 μm 的记录位点、42 个直径 380 μm 的刺激位点，以及 5 个直径 500 μm 的参考电极，间距均为 400 μm。两款的制造完好率分别高于 93% 和 91%。阵列可以拼接成更大的模块，也可以从同一道缝放入多块。记录采样率为每通道 20 kHz。

放入方法称为“<b>颅骨微缝</b>”。用精密矢状锯在颅骨上开出宽 500–900 μm 的切口，进入角度大致与皮层表面相切。再用纤维内镜在直视下切开硬膜，并观察阵列进入硬膜下腔。阵列背面有一个聚酰亚胺“口袋”，不透 X 线的管芯插在其中把阵列送入；内镜以及透视或 CT 确认位置后抽出管芯，薄膜留在皮层上。

![Figure 1. 薄膜皮层接口概览（论文 Figure 1）。（a–c）哥廷根小型猪，以及经微缝进入硬膜下腔（蓝色）的路径示意，紫色为硬膜，米色为颅骨。（d）一块 1,024 通道阵列模块。（e）较大的刺激位点及示例电流波形；（f）直径 50 μm 的记录位点及示例电位。（g, h）多通道活动可以被成像，并用于解码或刺激。（e–g）为概念示意图，不是生理数据。](/img/readApaper-41/p41_fig1.png)

<i>Figure 1. 薄膜皮层接口概览（论文 Figure 1）。（a–c）哥廷根小型猪，以及经微缝进入硬膜下腔（蓝色）的路径示意，紫色为硬膜，米色为颅骨。（d）一块 1,024 通道阵列模块。（e）较大的刺激位点及示例电流波形；（f）直径 50 μm 的记录位点及示例电位。（g, h）多通道活动可以被成像，并用于解码或刺激。（e–g）为概念示意图，不是生理数据。</i>

每个电极既可以记录也可以刺激。在体内刺激实验中，每块 529 通道阵列预留 16 个位点用于刺激。安全电流先在体外测定（50–100 μA，脉宽 200 μs），再经 200 μm 电极施加到动物体内，同时用相邻位点以及旁边一块阵列记录反应。

不同任务使用不同的解码模型。对于吻突（猪的吻部）上的触觉位置，每个通道被提取为低于 10 Hz 的低频活动和 70–150 Hz 的高伽马幅度，再送入卷积–循环网络。行走任务用更简单的卷积网络对短时间窗分类。人体言语起始则使用逻辑回归。

## 实验

整项工作由一组相关实验构成，而且各实验用的手术方法并不相同。

微缝植入在 8 头哥廷根小型猪中做了 22 次（每只 1 到 4 次），并在 23 个新鲜人尸头中多次植入，目标是运动皮层上肢代表区。另有 61 块阵列经小开颅放入 21 头小型猪，用于电生理和生物相容性研究。部分记录和解码实验也使用了传统的小骨窗，以便把表面信号质量与微缝操作分开评估。

![Figure 2. 微缝植入、定位与组织学（论文 Figure 2）。（a–c）锯开颅骨、用管芯引导插入、再抽出管芯。（d–f）在人尸体头部用内镜看到的相同步骤（箭头标出颅骨、硬膜和软膜）。（g, h）CT 切片：阵列分别位于人运动皮层（尸体）和猪体感皮层；蓝色箭头为不透 X 线标记。（i, j）开颅后置于猪皮层上的两块 529 通道阵列，以及取出后仍完整的软膜表面。（k, l）薄膜阵列与标准 4 触点条带在植入 42 天后的组织学；各为 8 个重复中的代表性切片。](/img/readApaper-41/p41_fig2.png)

<i>Figure 2. 微缝植入、定位与组织学（论文 Figure 2）。（a–c）锯开颅骨、用管芯引导插入、再抽出管芯。（d–f）在人尸体头部用内镜看到的相同步骤（箭头标出颅骨、硬膜和软膜）。（g, h）CT 切片：阵列分别位于人运动皮层（尸体）和猪体感皮层；蓝色箭头为不透 X 线标记。（i, j）开颅后置于猪皮层上的两块 529 通道阵列，以及取出后仍完整的软膜表面。（k, l）薄膜阵列与标准 4 触点条带在植入 42 天后的组织学；各为 8 个重复中的代表性切片。</i>

正式的安全与可取出研究在 16 头小型猪中经双侧小钻孔植入：实验组双侧各放薄膜阵列，对照组双侧各放标准的 4 触点硅胶条带电极。动物分别观察到 7 天（亚急性）或 42 天（慢性）。期间每天做神经系统检查；随后由独立的兽医神经病理医师用苏木精–伊红染色，以及小胶质细胞（Iba1）和星形胶质细胞（GFAP）免疫组化评估脑组织。

在猪体内，作者记录了体感、运动、视觉和听觉皮层的自发活动和诱发电位；解码了吻突触觉位置、肢体诱发电位、视觉开–关反应以及与行走相关的行为；并在刺激视觉皮层的同时记录周围位点。行走实验采用双侧开颅，每侧运动皮层放置一块 1,024 通道阵列（合计 2,048 通道）。动物从麻醉中醒来后，在吊带中于跑步机上行走，并用相机、标记点和加速度计同步记录肢体运动。

在五名患者的术中可行性研究中，1,024 通道阵列被放在已因临床定位而完成的传统开颅术野中，与标准硬膜下条带并排放置，最长 15 分钟。两名患者在全身麻醉下记录；三名患者接受清醒语言定位，记录部位分别是左侧颞上回、左侧角回或左侧额盖，并与提示下的言语同步。

## 结果

微缝操作从切开皮肤到固定阵列，可在 20 分钟内完成。经微缝放入的最大配置是一只动物中的四块 529 通道器件，两道缝各放入两块，共 2,116 通道。拼接的 529 通道模块在 0.96 cm² 上提供 1,058 通道。在尸头中，内镜和 CT 确认阵列位于运动皮层。

在 16 只动物的安全研究中，没有一只出现神经功能损害。取出后软膜表面完整。7 天和 42 天的组织学未发现可归咎于硬膜下植入的急性或慢性组织损伤。薄膜器件与对照的组织反应相近，慢性植入时薄膜引起的炎症还略轻一些。到 42 天，仍可从硬膜外段轻轻牵拉取出阵列。

相邻的表面通道并非完全冗余。即便在 300 μm 间距、50 μm 电极上，平方相关系数 r² 也随频率上升而下降：β 频段（12–30 Hz）为 0.67 ± 0.10，低伽马（30–50 Hz）为 0.56 ± 0.10，中伽马（70–110 Hz）为 0.35 ± 0.08，高伽马（130–170 Hz）为 0.12 ± 0.06。记录中可见高达 500 Hz 的活动。刺激肢体得到的体感诱发电位，在运动–感觉交界处出现相位翻转，并能以 300 μm 分辨率画成二维轮廓。视觉皮层上记录到了视觉诱发电位。行走时，2,048 个通道与肢体运动同步采集。

![Figure 3. 麻醉和行走状态下的高密度皮层表面记录（论文 Figure 3）。（a, d）相邻的 50 μm 通道在原始电位上已有细小差别。（b）自发行走时，覆盖感觉运动皮层的两块 1,024 通道阵列之一上的电位。（c）同一只动物上多个功能区的阵列位置。（e）体感皮层两个通道的频谱图。（f）跑步机行走及肢体追踪。（g）刺激胫神经得到的体感诱发电位；插图显示亚毫米尺度的相位翻转，以及二维等电位轮廓（轨迹长 1 s，峰–峰值约 5 μV）。（h）左眼光刺激的视觉诱发电位，标尺与（g）相同。（i）左侧感觉运动皮层上一帧 20 kHz、1,024 通道电压图，已与皮层表面对齐。](/img/readApaper-41/p41_fig3.png)

<i>Figure 3. 麻醉和行走状态下的高密度皮层表面记录（论文 Figure 3）。（a, d）相邻的 50 μm 通道在原始电位上已有细小差别。（b）自发行走时，覆盖感觉运动皮层的两块 1,024 通道阵列之一上的电位。（c）同一只动物上多个功能区的阵列位置。（e）体感皮层两个通道的频谱图。（f）跑步机行走及肢体追踪。（g）刺激胫神经得到的体感诱发电位；插图显示亚毫米尺度的相位翻转，以及二维等电位轮廓（轨迹长 1 s，峰–峰值约 5 μV）。（h）左眼光刺激的视觉诱发电位，标尺与（g）相同。（i）左侧感觉运动皮层上一帧 20 kHz、1,024 通道电压图，已与皮层表面对齐。</i>

量化最充分的是触觉解码。在 4 只动物中，网络用 10–20 分钟训练来区分 8 个吻突位点，随后在前瞻采集的验证集上达到 85–98% 的准确率（均值 92.75% ± 6%），并且是实时运行的。类似模型在单肢体体感电位和视觉开–关反应上达到 82.5–100%。在 8 类问题上，即使通道数下调到 1/4，准确率仍高于 95%。随后在 3 只动物中把任务加难到 14、24 或 30 个位点。这时准确率随通道数上升，在用上全部 1,024 通道时最高，而且在 24 类和 30 类问题上没有出现平台期。这些阵列的电极完好率分别为 96%、97% 和 98%。

![Figure 4. 触觉解码准确率随通道数和密度提高（论文 Figure 4）。（a, b）吻突上最多 30 个刺激点，以及对侧体感皮层上的 1,024 通道阵列。（c）用抽稀模拟更稀疏的网格。（d）预处理与卷积–循环解码器。（e）一只动物的准确率随通道数的变化（左），以及三只动物在 8、14、24 或 30 类任务上的最高准确率（右；每个点 50 个模型；电极完好率分别为 96%、97%、98%）。（f, g）通道间相关如何随距离和频率下降；（g）对应 400 μm 的单一间距（n = 11,856 对）。](/img/readApaper-41/p41_fig4.png)

<i>Figure 4. 触觉解码准确率随通道数和密度提高（论文 Figure 4）。（a, b）吻突上最多 30 个刺激点，以及对侧体感皮层上的 1,024 通道阵列。（c）用抽稀模拟更稀疏的网格。（d）预处理与卷积–循环解码器。（e）一只动物的准确率随通道数的变化（左），以及三只动物在 8、14、24 或 30 类任务上的最高准确率（右；每个点 50 个模型；电极完好率分别为 96%、97%、98%）。（f, g）通道间相关如何随距离和频率下降；（g）对应 400 μm 的单一间距（n = 11,856 对）。</i>

在未经训练的动物中，与行走相关的解码把头部运动、肢体运动和休息分成三类，准确率为 53–69%（随机水平为 33%；k 折交叉验证，k = 5 或 10）。当样本足够时，针对个体的行为标签准确率达到 60–80%（k = 5）。

对猪视觉皮层做局灶刺激，会在大约 2 mm 范围、短于 2 秒的时间内改变高伽马功率。加深麻醉后这一效应减弱，并且会从一块阵列扩到相邻阵列，这与生理反应相符，而不是刺激伪迹。在所测参数范围内没有诱发出眼跳。示例图中两块阵列的完好率分别为 90% 和 86%。

![Figure 6. 猪视觉皮层的局灶电刺激（论文 Figure 6）。（a）体外用于确认极化电位的波形；体内使用相同电流幅度，但没有用于测量极化的相位间隔。（b–d）距刺激电极 1 mm 处的示例电位：有刺激、无刺激，以及更深麻醉下。活动量取刺激后 200 ms 到 2,000 ms 的方差，并在 40 次试验上平均。（e, f）各电极在刺激与对照、浅麻醉与深麻醉下的活动；高亮位点位于刺激电极 2 mm 以内。（g–i）相邻两块阵列上刺激、对照和差值的空间图（完好率 90% 和 86%），刺激点周围出现活动被抑制的区域。（j）该模式随麻醉深度的变化。](/img/readApaper-41/p41_fig6.png)

<i>Figure 6. 猪视觉皮层的局灶电刺激（论文 Figure 6）。（a）体外用于确认极化电位的波形；体内使用相同电流幅度，但没有用于测量极化的相位间隔。（b–d）距刺激电极 1 mm 处的示例电位：有刺激、无刺激，以及更深麻醉下。活动量取刺激后 200 ms 到 2,000 ms 的方差，并在 40 次试验上平均。（e, f）各电极在刺激与对照、浅麻醉与深麻醉下的活动；高亮位点位于刺激电极 2 mm 以内。（g–i）相邻两块阵列上刺激、对照和差值的空间图（完好率 90% 和 86%），刺激点周围出现活动被抑制的区域。（j）该模式随麻醉深度的变化。</i>

在人体记录中，4 触点条带上已经能看到的体感相位翻转轮廓，在 1,024 通道阵列上被分辨得更细。清醒言语时，低频（0–40 Hz）活动在发声前后出现可重复的调制。离线条件下，用包含 54 次发声的 4 分钟数据训练的逻辑回归，把言语起始与静音区分开来，准确率为 79.8%（95% 置信区间 77.6–82.0%）。该图中的示例阵列完好率为 99%。这是对起始时刻的二元、离线检测，而不是对词语的解码。

![Figure 5. 术中人体记录与离线言语起始检测（论文 Figure 5）。（a–c）左侧颞叶肿瘤的 MRI，以及清醒语言定位时左侧颞上回在放置 1,024 通道阵列（完好率 99%）前后的表面。（d）言语起始前瞬间的电压图，对应（e, f）中的虚线时刻。（e, f）语音及其频谱。（g）星号电极的神经频谱。（h）用 4 分钟训练集做离线言语起始检测，在 100 次随机训练–测试划分上的准确率分布。](/img/readApaper-41/p41_fig5.png)

<i>Figure 5. 术中人体记录与离线言语起始检测（论文 Figure 5）。（a–c）左侧颞叶肿瘤的 MRI，以及清醒语言定位时左侧颞上回在放置 1,024 通道阵列（完好率 99%）前后的表面。（d）言语起始前瞬间的电压图，对应（e, f）中的虚线时刻。（e, f）语音及其频谱。（g）星号电极的神经频谱。（h）用 4 分钟训练集做离线言语起始检测，在 100 次随机训练–测试划分上的准确率分布。</i>

## 分析

一层薄膜可以在不按比例增加皮层损伤的前提下承载大量通道；而皮层表面在数百微米的尺度上仍保留着信息，尤其是在更高频段。当解码问题变难时，这些空间细节最重要：8 个触觉位点用抽稀后的网格已经接近做对，而 14 到 30 个位点的准确率一直提高到用满 1,024 个通道。

实验条件决定了现有证据能够支持什么。微缝放入是在猪和人尸头中完成的；7 天和 42 天的安全与取出数据，来自经钻孔植入的猪；行走记录使用的是双侧开颅。五例人体数据是在传统开颅之后做的短时术中表面记录，言语结果是用几分钟数据做的起始检测。刺激实验在麻醉猪的视觉皮层上进行，引起了附近活动的局灶、随麻醉深度变化的改变。合在一起，这些实验刻画的是一个可扩展的 μECoG 平台，以及它在动物和首次人体术中使用中能够记录和诱发的信号。

## 总结

Hettick 及其同事表明：一块模块化的 1,024 通道薄膜皮层阵列，可以通过亚毫米宽的颅骨微缝放入，能在猪体内记录并解码感觉与运动活动，能施加局灶的表面刺激，也能在人体神经外科手术中做短时高密度标测。在更难的触觉任务上，成绩一直提高到用上全部通道。

## 参考资料

- Hettick, M., Ho, E., Poole, A. J., Monge, M., Papageorgiou, D., Takahashi, K., LaMarca, M., Trietsch, D., Reed, K., Murphy, M., Rider, S., Gelman, K. R., Byun, Y. W., Miller, J. S., Hanson, T., Tolosa, V., Lee, S.-H., Bhatia, S., Konrad, P. E., Mager, M., Mermel, C. H., & Rapoport, B. I. (2026). <i>Minimally invasive implantation of scalable high-density cortical microelectrode arrays for multimodal neural decoding and stimulation.</i> Nature Biomedical Engineering, 10, 1206–1221。2025 年 10 月 2 日在线发表。[doi.org/10.1038/s41551-025-01501-w](https://doi.org/10.1038/s41551-025-01501-w) · [原文](https://www.nature.com/articles/s41551-025-01501-w) · [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13278958/)
- Figure 1–6 取自 Hettick 等（2026）。
