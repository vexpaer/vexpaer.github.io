---
title: "readApaper#36 Shared latent representations of speech production for cross-patient speech decoding"
title_zh: "readApaper#36 Shared latent representations of speech production for cross-patient speech decoding"
date: 2026-11-22 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - speech-decoding
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 22 November 2026 · Nature Communications, 2026</i>

Speech brain-computer interfaces can turn brain activity into words, but they usually need a large amount of data from each new user. This paper asks whether speech-related activity from different people can be lined up in a shared space, so a decoder can train on data pooled across patients.

## Background

Spoken words are made by coordinated movements of the lips, tongue, jaw, soft palate, and vocal folds—the <b>articulators</b>. Those movements shape airflow into the sound units of a language, called <b>phonemes</b> (for example, the /k/, /a/, and /b/ in “cab”). Neuromotor disorders such as amyotrophic lateral sclerosis (ALS) or brainstem stroke can paralyze those muscles and take away speech, even when the intention to speak remains.

A <b>speech brain-computer interface</b> (speech BCI) tries to read that intention from brain activity and convert it into text or sound (Willett et al., 2023; Metzger et al., 2023). High-performing systems are usually invasive: electrodes sit in or on the cortex rather than on the scalp. This paper uses <b>micro-electrocorticography</b> (μECoG), a thin grid of many small contacts on the brain surface. The contacts are smaller and closer together than on a standard clinical ECoG grid, so the map of activity is finer.

The recordings come from <b>sensorimotor cortex</b> (SMC), a region involved in controlling the articulators. The main feature is <b>high-gamma</b> (HG) power, activity in the 70–150 Hz band. HG is a well-established marker of local population activity during speech and tracks the firing of nearby neurons reasonably well.

The nine phonemes used here can also be grouped by how they are produced: low vowels (/a/, /e/), high vowels (/i/, /u/), labial consonants (/p/, /b/, /v/), and dorsal consonants (/k/, /g/). These four <b>articulatory categories</b> are coarser than phonemes and appear in several analyses below.

A practical bottleneck is data. Speech BCI models are typically trained on one person, often across many sessions, because electrode placement and anatomy differ so much from user to user. Reusing data from previous users would shorten that process—if the neural patterns can be compared at all. In motor cortex, the activity of many neurons often follows a low-dimensional pattern that unfolds over time, a trajectory through a <b>latent space</b>. Such <b>latent dynamics</b> have already been aligned across animals performing reaching movements (Safaie et al., 2023). This paper tests whether a similar shared structure exists for human speech.

## Problem

The obstacle is concrete: electrodes do not line up across people. Cortical folding and functional layout differ, and arrays are placed in slightly different spots on the SMC. In this dataset some patients had 128 contacts spaced 1.33 mm apart, others 256 contacts spaced 1.72 mm apart. There is no reliable pairing between “channel 17” in one patient and any particular channel in another.

Simply concatenating raw channels, or matching contacts by anatomy alone, therefore mixes signals that are not comparable. The authors’ proposal is functional rather than anatomical: the latent dynamics of articulatory control may be shared, and may be aligned into a common space even when the electrode grids do not correspond.

## Method

Recordings came from eight patients during awake neurosurgery at Duke University Medical Center. All eight had fully intact speech (mean age 57.4 years; one woman). Four (S1, S2, S4, S5) were undergoing deep-brain stimulator implantation for Parkinson’s disease and were recorded with a narrow 128-channel μECoG array (11 mm × 21 mm; 1.33 mm spacing). Four (S3, S6, S7, S8) were undergoing tumor resection and were recorded with a larger 256-channel array (38 mm × 21 mm; 1.72 mm spacing). Both grids sat on the SMC.

The task was listen-and-repeat, not attempted speech in someone who cannot talk. On each trial the patient heard a three-phoneme non-word and immediately repeated it aloud. There were 52 unique items, built from the nine phonemes above in consonant–vowel–consonant or vowel–consonant–vowel form (for example /kab/ or /abe/). The sound lasted about 0.5 s; speech typically began about 1.1 s after stimulus onset and lasted about 0.45 s. Most patients completed three blocks. Combined utterance time across all eight people was about 8.2 minutes (about 68.5 minutes of experiment time). Patient S3 had only about one-third as much data as the others.

![Figure 1. Shared speech dynamics and the recording setup. (a) Even if two patients have different electrode layouts, the population activity that controls the articulators can be mapped into a shared low-dimensional space. (b) Array locations for all eight patients on a common brain. (c) The listen-and-repeat task and its typical timing. (d, e) Example spectrograms: high-gamma power rises around speech onset, and many contacts on both the 128-channel and 256-channel grids show a significant response. From Spalding et al., 2026, Figure 1.](/img/readApaper-36/p36_fig1.png)

<i>Figure 1. Shared speech dynamics and the recording setup. (a) Even if two patients have different electrode layouts, the population activity that controls the articulators can be mapped into a shared low-dimensional space. (b) Array locations for all eight patients on a common brain. (c) The listen-and-repeat task and its typical timing. (d, e) Example spectrograms: high-gamma power rises around speech onset, and many contacts on both the 128-channel and 256-channel grids show a significant response. From Spalding et al., 2026, Figure 1.</i>

For offline analyses, the authors extracted HG in a ±500 ms window around speech onset, keeping contacts with a significant increase relative to a pre-stimulus baseline. <b>Principal component analysis</b> (PCA) then compressed those channels into components that still explain 90% of the variance. Each trial becomes a trajectory in a patient-specific latent space, whose axes are mixtures of that patient’s electrodes rather than the electrodes themselves.

To compare two patients they used <b>canonical correlation analysis</b> (CCA). CCA finds linear combinations of each patient’s principal components such that the resulting signals are as correlated as possible: it looks for the views of the two latent spaces that move together most consistently. Because the recordings differ in length and in which trials remain, trials were first averaged by phoneme sequence, keeping only sequences both patients produced. Sequence identity is used only to put time points in correspondence; the CCA fit itself does not classify speech. A source patient’s activity can then be sent into a chosen <b>target patient’s</b> space, so several sources can be stacked onto one target.

This is not a matching of electrodes. Each person’s contacts stay in their own grid. What is aligned is the functional trajectory—how the population evolves while producing the same sounds. That trajectory can later be projected back onto a target grid if a spatial map is needed.

![Figure 2. Aligning latent dynamics with CCA. (a) High-gamma patterns differ by articulatory category, and also differ between S1 and S2. (b, c) After PCA, S1’s trials form articulatory clusters, with a silhouette score well above a shuffled-label chance distribution. (d) Trajectories of S1 and S2 look different in their own principal-component spaces (left) and more similar after CCA maps S2 into S1’s space (right). (e, f) Alignment raises cross-patient clustering toward the patient-specific level and increases representational similarity for all eight people. From Spalding et al., 2026, Figure 2.](/img/readApaper-36/p36_fig2.png)

<i>Figure 2. Aligning latent dynamics with CCA. (a) High-gamma patterns differ by articulatory category, and also differ between S1 and S2. (b, c) After PCA, S1’s trials form articulatory clusters, with a silhouette score well above a shuffled-label chance distribution. (d) Trajectories of S1 and S2 look different in their own principal-component spaces (left) and more similar after CCA maps S2 into S1’s space (right). (e, f) Alignment raises cross-patient clustering toward the patient-specific level and increases representational similarity for all eight people. From Spalding et al., 2026, Figure 2.</i>

## Experiments

The first tests asked whether aligned trajectories carry shared speech information. Clustering was compared with a shuffled-label chance distribution. <b>Representational similarity analysis</b> (RSA) then compared, for each target, how similarly the eight patients organized articulatory sequences before and after alignment. A surrogate control used random data that kept the same averages and correlations but no speech structure.

A second set of tests looked at spatial maps. Each contact was scored on how well it distinguished the four articulatory categories, producing an articulator map on the grid. Source activity was pushed through PCA and CCA and inverse-projected into a target grid. In a related test, a four-class articulator model was trained in one patient’s space and tested on the others after projection, with or without alignment (illustrated with S1 as the common space).

The main offline decoding test used a nine-class phoneme model (chance = 0.11) built from PCA and a support-vector machine. For a chosen target, data from the other patients could be added to the target’s training set, either after CCA alignment or without it. Accuracy was always measured on held-out target trials, with 20-fold cross-validation. The authors also varied how much of the target’s own training data was kept for alignment and training (down to 5%), and how much source data was added.

Those offline models used a window centered on speech onset, which a live BCI would not have. A <b>simulated real-time</b> analysis therefore replayed the same intraoperative recordings causally. HG power was computed in 20 ms windows with no knowledge of when speech began. A recurrent network trained with connectionist temporal classification (CTC) predicted the phoneme sequence of the heard stimulus. The first two task blocks were used for training, the last for testing. S3, who had only one block, was excluded as a target but could still serve as a source. Alignment was learned from the target’s training period together with the source data. The metric was <b>phoneme error rate</b> (PER): the fraction of phonemes that would need to be inserted, deleted, or substituted to match the true sequence. Lower is better.

Finally, the arrays were subsampled by thinning contacts, shrinking the grid, or averaging neighbors to mimic larger electrodes, and the aligned phoneme comparison was repeated.

## Results

### Shared structure after alignment

In a single patient’s latent space, articulatory categories already formed clusters stronger than chance (silhouette analysis, p = 7.07e-18). Concatenating two patients without CCA weakened that clustering. After alignment, clustering was significantly stronger than the unaligned case (p = 1.06e-17) and much closer to the patient-specific value. RSA showed the same pattern across all eight people: representational similarity rose after alignment (n = 8, p = 0.01).

### Spatial maps and articulator decoding

Reconstructed articulator maps were more similar to the target’s own maps when the projection included CCA (n = 8, p = 0.04). In the four-class test, illustrated with S1 as the common space and the other seven patients projected into it (chance = 0.25), patient-specific models reached a mean accuracy of 0.39, and models tested on aligned reconstructions reached 0.43. Those two were not significantly different (n = 7, p = 0.79). Without alignment, mean accuracy fell to 0.23, below the aligned case (p = 0.002) and not significantly above chance (p = 0.11).

![Figure 3. Alignment preserves spatial articulator maps. (a) In S1, different articulatory categories light up different parts of the grid (ROC-AUC at each contact). (b) S3’s maps are pushed through PCA and CCA and inverse-projected into S1’s electrode layout. (c) Reconstructed maps match the target better with alignment than without, both in the S3-to-S1 example and across all patients (n = 8, p = 0.04). (d) A four-class decoder trained in one space stays near patient-specific accuracy on aligned reconstructions, and falls toward chance without alignment. From Spalding et al., 2026, Figure 3.](/img/readApaper-36/p36_fig3.png)

<i>Figure 3. Alignment preserves spatial articulator maps. (a) In S1, different articulatory categories light up different parts of the grid (ROC-AUC at each contact). (b) S3’s maps are pushed through PCA and CCA and inverse-projected into S1’s electrode layout. (c) Reconstructed maps match the target better with alignment than without, both in the S3-to-S1 example and across all patients (n = 8, p = 0.04). (d) A four-class decoder trained in one space stays near patient-specific accuracy on aligned reconstructions, and falls toward chance without alignment. From Spalding et al., 2026, Figure 3.</i>

### Offline phoneme decoding

On the nine-way phoneme task (chance = 0.11), the three training schemes differed overall (repeated-measures ANOVA, F(2, 14) = 12.59, p = 0.007). Patient-specific models had a mean accuracy of 0.24 (95% CI 0.17–0.31). Pooling other patients without alignment reduced this to 0.19 (95% CI 0.15–0.24; p = 0.03 versus patient-specific). Pooling after CCA raised it to 0.31 (95% CI 0.22–0.40), above the patient-specific baseline (p = 0.01). The largest single-patient change was in S3, who had the smallest dataset: 0.29 with their own data, 0.53 with aligned extra data.

The aligned advantage was present at every target-data subsample from 5% to 100% (n = 8, p = 0.008 at each level). For S5, the patient-specific mean of 0.17 was already exceeded after 4.4 minutes of added cross-patient data, and reached about 0.22 when all of that extra data were used. The relative gain was larger when the patient-specific score was lower (n = 7, excluding S3; r = −0.77, p = 0.04).

![Figure 4. Aligned extra data improve offline phoneme decoding. (a) Across all eight targets, unaligned pooling falls below a patient-specific model, and CCA-aligned pooling rises above it (dashed line: chance = 0.11). (b) The same comparison for S1, S2, and S3; S3, with the least data, shows the largest jump. (c) Aligned models stay ahead at every fraction of the target’s own training trials, including 5%. (d) For S5, accuracy rises with added source data and surpasses the patient-specific mean after 4.4 minutes. (e) Patients with lower patient-specific scores tend to improve more (S3 omitted). From Spalding et al., 2026, Figure 4.](/img/readApaper-36/p36_fig4.png)

<i>Figure 4. Aligned extra data improve offline phoneme decoding. (a) Across all eight targets, unaligned pooling falls below a patient-specific model, and CCA-aligned pooling rises above it (dashed line: chance = 0.11). (b) The same comparison for S1, S2, and S3; S3, with the least data, shows the largest jump. (c) Aligned models stay ahead at every fraction of the target’s own training trials, including 5%. (d) For S5, accuracy rises with added source data and surpasses the patient-specific mean after 4.4 minutes. (e) Patients with lower patient-specific scores tend to improve more (S3 omitted). From Spalding et al., 2026, Figure 4.</i>

### Simulated real-time decoding

In the causal simulation (n = 7, excluding S3 as a target), a patient-specific CTC-RNN was essentially at chance: mean PER 87.1%, versus 88.4% for shuffled labels (p = 0.81). Unaligned source data lowered PER to 82.5% (p = 0.02 versus patient-specific). CCA-aligned source data lowered it further, to 79.4% (p = 0.02 versus unaligned). Patient S2 improved the most, from 84.2% to 67.9%.

With only 5% of the target patient’s data—about five trials, or 0.3 minutes—aligned models still outperformed patient-specific ones. When the full target training set was kept (about 6.3 minutes of experiment time), a significant PER improvement appeared after about 38.8 minutes of added cross-patient data. A log-linear fit to that curve projects a 25% average PER at 14.6 hours of cross-patient data and a 10% PER at 25.3 hours. Those two numbers are extrapolations, not measured operating points. Computing the CCA mapping took 5.8 seconds on average, and up to about 10 seconds.

![Figure 5. Alignment also helps in a causal, simulated real-time setting. (a) High-gamma features are computed in short windows locked to the stimulus, source data are aligned into the target space, and a CTC-RNN emits a phoneme sequence without using speech-onset times. (b) Phoneme error rate falls from chance-like patient-specific performance to 82.5% with unaligned pooling and 79.4% with aligned pooling (n = 7). (c) The aligned advantage remains when the target training set is reduced, including at 5%. (d) A significant improvement over the patient-specific baseline appears after about 38.8 minutes of added source data. From Spalding et al., 2026, Figure 5.](/img/readApaper-36/p36_fig5.png)

<i>Figure 5. Alignment also helps in a causal, simulated real-time setting. (a) High-gamma features are computed in short windows locked to the stimulus, source data are aligned into the target space, and a CTC-RNN emits a phoneme sequence without using speech-onset times. (b) Phoneme error rate falls from chance-like patient-specific performance to 82.5% with unaligned pooling and 79.4% with aligned pooling (n = 7). (c) The aligned advantage remains when the target training set is reduced, including at 5%. (d) A significant improvement over the patient-specific baseline appears after about 38.8 minutes of added source data. From Spalding et al., 2026, Figure 5.</i>

### Spatial sampling

When contacts were thinned, aligned phoneme models significantly outperformed patient-specific models only at pitches under 3 mm (1.5 mm and 2 mm; n = 8, p = 0.04). When the grid was cropped, the same advantage appeared only for sub-grids of 6 × 12 contacts or larger, about 8 mm × 17 mm (p = 0.04). Averaging neighbors to mimic larger electrodes produced a trend toward better scores with smaller contacts, but that comparison was not significant after correction for multiple tests.

## Analysis

CCA builds a shared set of coordinates for how population activity evolves during the same speech conditions, as linear mixtures of each patient’s principal components. The electrodes never have to be paired. Once a source trajectory lives in the target’s latent space, it can be used as extra training examples, or inverse-projected onto the target grid to rebuild a spatial map. That is why unaligned pooling often hurt the simpler offline models: without the functional mapping, the added channels are not in a common coordinate system.

The eight participants could speak and were repeating heard non-words during surgery. That is a different setting from a clinical speech BCI user who cannot vocalize and may be attempting or imagining speech. The “real-time” results are a causal replay of those same intraoperative recordings, not a live session in which a decoder drove a communication interface.

Alignment also used some of the target patient’s own training data, including overlapping phoneme-sequence conditions, to compute the mapping. The 5% condition is a small calibration set, not a setting with no target-patient data. In the articulator-map test, the classifier could be trained on other people, but the projection into the target space still used the target’s neural signals.

Absolute scores in this short intraoperative dataset remain modest: a mean of 0.31 on the nine-way offline task, and a mean PER of 79.4% in the causal simulation, where a patient-specific recurrent model had not left chance. The consistent finding is the relative gain from alignment, especially when the target set is small. In the array-subsampling tests, that advantage showed up clearly only when the grid was both dense (pitch under 3 mm) and wide enough (at least about 8 mm × 17 mm).

## Summary

In eight people with intact speech, recorded with high-density μECoG on sensorimotor cortex during awake surgery, speech-related population dynamics could be aligned across patients with canonical correlation analysis. Decoders trained on the pooled, aligned data outperformed patient-specific models on offline phoneme classification and in a causal simulation on the same recordings. The method still uses a modest amount of the target patient’s data to learn the mapping, and the shared space is functional: it does not require electrodes in one person to correspond directly to electrodes in another.

## References

- Spalding, Z., Duraivel, S., Rahimpour, S., Wang, C., Barth, K., Schmitz, C., Lad, S. P., Friedman, A. H., Southwell, D. G., Viventi, J., & Cogan, G. B. (2026). <i>Shared latent representations of speech production for cross-patient speech decoding.</i> Nature Communications, 17, 8716. [doi.org/10.1038/s41467-026-75455-1](https://doi.org/10.1038/s41467-026-75455-1) · [article](https://www.nature.com/articles/s41467-026-75455-1)
- Willett, F. R., et al. (2023). <i>A high-performance speech neuroprosthesis.</i> Nature, 620, 1031–1036. [doi.org/10.1038/s41586-023-06377-x](https://doi.org/10.1038/s41586-023-06377-x)
- Metzger, S. L., et al. (2023). <i>A high-performance neuroprosthesis for speech decoding and avatar control.</i> Nature, 620, 1037–1046. [doi.org/10.1038/s41586-023-06443-4](https://doi.org/10.1038/s41586-023-06443-4)
- Safaie, M., et al. (2023). <i>Preserved neural dynamics across animals performing similar behaviour.</i> Nature, 623, 765–771. [doi.org/10.1038/s41586-023-06714-0](https://doi.org/10.1038/s41586-023-06714-0)
- Figures 1–5 are from Spalding et al. (2026).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-22 · Nature Communications, 2026</i>

言语脑机接口可以把脑活动转换成文字，但通常需要从每一位新使用者那里采集大量数据。这篇论文关心的是：不同人记录到的言语相关活动，能不能被对齐到一个共享空间里，从而让解码器用多人合并后的数据来训练。

## 背景

说话依赖嘴唇、舌头、下颌、软腭和声带这些<b>构音器官</b>的协调动作。它们把气流塑造成语言中的声音单元，也就是<b>音素</b>（例如 “cab” 里的 /k/、/a/、/b/）。肌萎缩侧索硬化（ALS）或脑干卒中这类神经运动障碍一旦让这些肌肉瘫痪，人就可能失去发声能力，但说话的意图仍在。

<b>言语脑机接口</b>（speech BCI）试图从脑活动中读出这种意图，再把它变成文字或声音（Willett 等，2023；Metzger 等，2023）。目前表现较好的系统多半是侵入式的：电极放在皮层上或皮层里，而不是头皮上。本文使用<b>微皮层脑电</b>（μECoG），也就是贴在脑表面、带有许多微小触点的薄膜。和常规临床 ECoG 相比，触点更小、间距更密，空间图也更细。

记录位置在<b>感觉运动皮层</b>（SMC），这一区域参与控制构音器官。主要特征是<b>高伽马</b>（HG）频段的能量，也就是 70–150 Hz 的活动。HG 是言语过程中局部群体活动的常用指标，和附近神经元的放电也比较接近。

这里的九个音素还可以按发音方式分成四类：低元音（/a/、/e/）、高元音（/i/、/u/）、唇音（/p/、/b/、/v/）和舌背音（/k/、/g/）。这四个<b>构音类别</b>比音素更粗，后文的多项分析都会用到。

一个实际瓶颈是数据。言语脑机接口模型通常只用同一个人的记录来训练，采集往往要跨许多场次，因为电极位置和解剖在人与人之间差得很多。如果能复用以往使用者的数据，新植入后需要的自身训练时间就可能短得多——前提是这些神经模式能够互相比较。在运动皮层里，许多神经元的活动常常沿着一个低维模式随时间展开，形成<b>潜空间</b>中的轨迹。这种<b>潜在动力学</b>已经在做伸手动作的动物之间对齐过（Safaie 等，2023）。本文要检验的，是人类言语产生是否也有类似的共享结构。

## 问题

困难很具体：电极在不同人之间对不上。皮层褶皱和功能布局因人而异，阵列在 SMC 上的放置位置也略有差别。这份数据里，有的患者是 128 个触点、间距 1.33 mm，有的是 256 个触点、间距 1.72 mm。不存在可靠的一一对应，不能假定 A 患者的“第 17 通道”就等于 B 患者的某一个通道。

因此，如果只是把原始通道直接拼接，或只按解剖坐标去配对触点，混在一起的信号其实并不可比。作者提出的办法是功能对齐，而不是解剖对齐：构音控制背后的潜在动力学可能是共享的；即便电极网格对不上，也可以被对齐到一个共同空间里。

## 方法

数据来自杜克大学医学中心八名患者在清醒手术中的记录。八人都有完整的言语能力（平均年龄 57.4 岁；其中一名女性）。S1、S2、S4、S5 正在接受帕金森病的脑深部电刺激器植入，使用较窄的 128 通道 μECoG（11 mm × 21 mm，间距 1.33 mm）。S3、S6、S7、S8 正在接受肿瘤切除，使用更大的 256 通道阵列（38 mm × 21 mm，间距 1.72 mm）。两组阵列都放在 SMC 上。

任务是听后口头复述，而不是无法发声者的试图言语。每场试验中，患者先听到一个由三个音素组成的非词，再立刻大声重复。一共 52 个不同项目，由上面九个音素按“辅音–元音–辅音”或“元音–辅音–元音”排列而成（例如 /kab/ 或 /abe/）。听觉刺激大约持续 0.5 秒；言语通常在刺激开始后约 1.1 秒出现，持续约 0.45 秒。多数患者完成三个组块。八人合计的发声时长大约 8.2 分钟（实验时长大约 68.5 分钟）。S3 的数据大约只有其他人的三分之一。

![Figure 1. 共享的言语动力学与记录设置。（a）即便两名患者的电极布局不同，控制构音器官的群体活动也可以被映射到一个共享的低维空间。（b）八名患者的阵列位置，画在同一张标准脑上。（c）听后复述任务及典型时间。（d, e）示例频谱图：高伽马能量在发声开始附近升高，128 通道和 256 通道阵列上都有许多触点出现显著反应。取自 Spalding 等，2026，Figure 1。](/img/readApaper-36/p36_fig1.png)

<i>Figure 1. 共享的言语动力学与记录设置。（a）即便两名患者的电极布局不同，控制构音器官的群体活动也可以被映射到一个共享的低维空间。（b）八名患者的阵列位置，画在同一张标准脑上。（c）听后复述任务及典型时间。（d, e）示例频谱图：高伽马能量在发声开始附近升高，128 通道和 256 通道阵列上都有许多触点出现显著反应。取自 Spalding 等，2026，Figure 1。</i>

在离线分析中，作者提取发声开始前后 ±500 毫秒的 HG 活动，只保留相对刺激前基线有显著升高的触点。再用<b>主成分分析</b>（PCA）把这些通道压成仍能解释 90% 方差的成分。这样，每次试验都变成一条患者自己的潜空间轨迹：坐标轴是该患者电极的线性组合，而不是电极本身。

要比较两名患者，他们使用<b>典型相关分析</b>（CCA）。CCA 会为双方的主成分寻找线性组合，使得到的信号尽可能相关，也就是寻找两个潜空间里最能一起变动的视角。由于记录长度不同，缺失的试验也不一样，作者先按音素序列做条件平均，并只保留双方都说过的序列。这一步只用序列身份来让时间点对应起来；CCA 拟合本身并不靠标签来做言语分类。映射学会之后，源患者的活动可以被送到选定的<b>目标患者</b>空间里，这样多名源患者就可以叠到同一个目标上。

这并不是在配对电极。每个人的触点仍然留在自己的网格里。被对齐的是功能轨迹——群体活动在发出相同声音时如何随时间演化。如果后面需要空间图，这条轨迹还可以再投影回目标患者的电极网格。

![Figure 2. 用 CCA 对齐潜在动力学。（a）阵列上的高伽马模式随构音类别而变，在 S1 和 S2 之间也不相同。（b, c）PCA 之后，S1 的试验按构音类别成簇，轮廓系数明显高于打乱标签的随机水平。（d）S1 和 S2 的轨迹在各自的主成分空间里看起来不同（左），CCA 把 S2 映到 S1 空间后更为接近（右）。（e, f）对齐后，跨人聚类升到更接近单患者的水平，八人的表征相似性也都提高。取自 Spalding 等，2026，Figure 2。](/img/readApaper-36/p36_fig2.png)

<i>Figure 2. 用 CCA 对齐潜在动力学。（a）阵列上的高伽马模式随构音类别而变，在 S1 和 S2 之间也不相同。（b, c）PCA 之后，S1 的试验按构音类别成簇，轮廓系数明显高于打乱标签的随机水平。（d）S1 和 S2 的轨迹在各自的主成分空间里看起来不同（左），CCA 把 S2 映到 S1 空间后更为接近（右）。（e, f）对齐后，跨人聚类升到更接近单患者的水平，八人的表征相似性也都提高。取自 Spalding 等，2026，Figure 2。</i>

## 实验

第一组检验关心对齐后的轨迹是否携带共享的言语信息。聚类结果会和打乱标签的随机分布比较。接着用<b>表征相似性分析</b>（RSA），对每个目标患者比较对齐前后八人组织构音序列的相似程度。对照则是替代数据：随机生成，但保留原数据的均值和相关结构，不再含有言语结构。

第二组检验关心空间图。每个触点会得到一个区分四类构音的分数，从而在网格上形成构音图。源患者的活动经过 PCA 和 CCA 后，再反向投影到目标网格。在相关的解码检验中，四类构音模型在一名患者的空间里训练，再在投影进来的其他患者数据上测试，分别比较有对齐和没有对齐。Figure 3 以 S1 作为公共空间来示意。

主要的离线解码检验用的是九类音素模型（随机水平为 0.11），由 PCA 和支撑向量机构成。对选定的目标患者，可以把其他患者的数据加进该目标的训练集，一种是先做 CCA 对齐，一种是不对齐。准确率始终只在目标患者的留出试验上评估，并做 20 折交叉验证。作者还改变了目标患者自己留给对齐和训练的数据比例（最低到 5%），以及额外加入的源数据量。

这些离线模型使用的是以发声开始为中心的时间窗，而这在真正的脑机接口里是拿不到的。因此作者在同一批术中记录上做了<b>模拟实时</b>分析。高伽马能量在因果的 20 毫秒窗口里计算，不使用患者何时开始说话的信息。一个用连接主义时序分类（CTC）训练的循环网络，预测听到的刺激中的音素序列。前两个任务组块用于训练，最后一组块用于测试。只有一个组块的 S3 不作为目标患者，但仍可作为源数据。对齐由目标患者的训练阶段和其他人的数据共同学会。指标是<b>音素错误率</b>（PER）：要把预测序列改成正确序列，需要插入、删除或替换的音素比例。越低越好。

最后，他们用抽疏触点、裁小网格、或平均邻近触点以模拟更大电极这三种方式做子采样，并重复对齐后的音素比较。

## 结果

### 对齐后的共享结构

在单名患者自己的潜空间里，构音类别的聚类已经强于随机水平（轮廓系数分析，p = 7.07e-18）。如果只是把两名患者直接拼接、不做 CCA，跨人聚类会变弱。对齐之后，聚类显著强于未对齐条件（p = 1.06e-17），并且更接近单患者的数值。RSA 在全部八人中也得到同样的结论：对齐后表征相似性上升（n = 8，p = 0.01）。

### 空间图与构音解码

重建得到的构音图，在投影包含 CCA 时，与目标患者自己的图更相似（n = 8，p = 0.04）。在四类构音检验中，示意方式是把其他七人投影到 S1 的空间（随机水平为 0.25）：单患者模型的平均准确率是 0.39，对齐重建上的模型是 0.43，两者没有显著差异（n = 7，p = 0.79）。不对齐时，平均准确率降到 0.23，显著低于对齐条件（p = 0.002），也没有显著高于随机水平（p = 0.11）。

![Figure 3. 对齐能够保留空间构音图。（a）在 S1 上，不同构音类别点亮网格的不同部位（每个触点的 ROC-AUC）。（b）S3 的图经过 PCA 和 CCA，再反向投影到 S1 的电极布局。（c）有对齐时，重建图与目标更接近，S3 映到 S1 的例子和全部患者都是如此（n = 8，p = 0.04）。（d）在一个空间里训练的四类构音解码器，用对齐重建测试时仍接近单患者准确率；不对齐时则落到接近随机的水平。取自 Spalding 等，2026，Figure 3。](/img/readApaper-36/p36_fig3.png)

<i>Figure 3. 对齐能够保留空间构音图。（a）在 S1 上，不同构音类别点亮网格的不同部位（每个触点的 ROC-AUC）。（b）S3 的图经过 PCA 和 CCA，再反向投影到 S1 的电极布局。（c）有对齐时，重建图与目标更接近，S3 映到 S1 的例子和全部患者都是如此（n = 8，p = 0.04）。（d）在一个空间里训练的四类构音解码器，用对齐重建测试时仍接近单患者准确率；不对齐时则落到接近随机的水平。取自 Spalding 等，2026，Figure 3。</i>

### 离线音素解码

在九类音素任务上（随机水平为 0.11），三种训练方式总体不同（重复测量方差分析，F(2, 14) = 12.59，p = 0.007）。单患者模型的平均准确率是 0.24（95% 置信区间 0.17–0.31）。不对齐地并入其他患者后，准确率降到 0.19（95% 置信区间 0.15–0.24；相对单患者 p = 0.03）。经 CCA 对齐后再合并，准确率升到 0.31（95% 置信区间 0.22–0.40），高于单患者基线（p = 0.01）。单名患者中变化最大的是数据最少的 S3：只用自己的数据是 0.29，加上对齐后的额外数据是 0.53。

从目标数据保留 5% 到保留 100%，对齐的优势在每一个子采样比例上都还在（n = 8，每一档 p = 0.008）。以 S5 为例，单患者平均准确率 0.17，在额外加入 4.4 分钟跨人数据后就被超过，用上全部额外数据后大约达到 0.22。单患者分数越低，相对提升往往越大（n = 7，不含 S3；r = −0.77，p = 0.04）。

![Figure 4. 对齐后的额外数据提高了离线音素解码。（a）在全部八个目标上，不对齐合并低于单患者模型，CCA 对齐后的合并高于单患者模型（虚线为随机水平 0.11）。（b）S1、S2、S3 的同样比较；数据最少的 S3 提升最大。（c）无论目标患者自己的训练试验保留多少，对齐模型都更好，包括只保留 5% 的情况。（d）对 S5 来说，准确率随源数据增加而提高，在 4.4 分钟后超过单患者均值。（e）单患者分数较低的患者，往往提升更大（未计入 S3）。取自 Spalding 等，2026，Figure 4。](/img/readApaper-36/p36_fig4.png)

<i>Figure 4. 对齐后的额外数据提高了离线音素解码。（a）在全部八个目标上，不对齐合并低于单患者模型，CCA 对齐后的合并高于单患者模型（虚线为随机水平 0.11）。（b）S1、S2、S3 的同样比较；数据最少的 S3 提升最大。（c）无论目标患者自己的训练试验保留多少，对齐模型都更好，包括只保留 5% 的情况。（d）对 S5 来说，准确率随源数据增加而提高，在 4.4 分钟后超过单患者均值。（e）单患者分数较低的患者，往往提升更大（未计入 S3）。取自 Spalding 等，2026，Figure 4。</i>

### 模拟实时解码

在因果模拟中（n = 7，S3 不作为目标），单患者 CTC-RNN 基本处于随机水平：平均 PER 为 87.1%，打乱标签则为 88.4%（p = 0.81）。加入未对齐的源数据后，PER 降到 82.5%（相对单患者 p = 0.02）。加入 CCA 对齐后的源数据后，再降到 79.4%（相对未对齐 p = 0.02）。S2 的改善最大，从 84.2% 降到 67.9%。

即便只用目标患者 5% 的数据——大约 5 次试验、0.3 分钟——对齐模型仍然优于单患者模型。当目标训练集完整保留时（实验时长约 6.3 分钟），在额外加入约 38.8 分钟跨人数据后，PER 相对单患者模型出现显著改善。对这条曲线做对数线性拟合，会外推到：跨人数据达到 14.6 小时时平均 PER 为 25%，达到 25.3 小时时为 10%。这两个数字是由已测曲线外推得到的，并不是实际测到的工作点。计算 CCA 映射平均需要 5.8 秒，最多约 10 秒。

![Figure 5. 在因果的模拟实时设置里，对齐同样有帮助。（a）高伽马特征在对准刺激的短窗口里计算，源数据被对齐到目标空间，CTC-RNN 在不使用发声起始时刻的情况下输出音素序列。（b）音素错误率从接近随机的单患者水平，降到未对齐合并的 82.5%，再降到对齐合并的 79.4%（n = 7）。（c）即使减少目标训练集，包括只剩 5% 时，对齐的优势仍然在。（d）额外加入约 38.8 分钟源数据后，相对单患者基线出现显著改善。取自 Spalding 等，2026，Figure 5。](/img/readApaper-36/p36_fig5.png)

<i>Figure 5. 在因果的模拟实时设置里，对齐同样有帮助。（a）高伽马特征在对准刺激的短窗口里计算，源数据被对齐到目标空间，CTC-RNN 在不使用发声起始时刻的情况下输出音素序列。（b）音素错误率从接近随机的单患者水平，降到未对齐合并的 82.5%，再降到对齐合并的 79.4%（n = 7）。（c）即使减少目标训练集，包括只剩 5% 时，对齐的优势仍然在。（d）额外加入约 38.8 分钟源数据后，相对单患者基线出现显著改善。取自 Spalding 等，2026，Figure 5。</i>

### 空间采样

把触点抽疏之后，对齐音素模型只在间距小于 3 mm 时显著优于单患者模型（1.5 mm 和 2 mm；n = 8，p = 0.04）。把网格裁小之后，同样的优势只出现在 6 × 12 或更大的子网格上，大约是 8 mm × 17 mm（p = 0.04）。把邻近触点平均以模拟更大电极时，更小的触点趋势上更好，但在多重比较校正后，这一项没有达到显著。

## 分析

CCA 做的事情，是为“在相同言语条件下，群体活动如何随时间演化”建立一套共享坐标，而这些坐标是各方主成分的线性组合。电极不必一一配对。源轨迹进入目标潜空间之后，既可以作为额外的训练样本，也可以反向投影到目标网格上，重建空间图。这也解释了为什么不对齐的合并往往会损害更简单的离线模型：没有这种功能映射，加进来的通道就不在同一套坐标系里。

这八名参与者能够说话，并且是在手术中口头重复刚听到的非词。这和临床上无法发声、可能只是在试图说话或想象说话的言语脑机接口使用者，不是同一种情境。文中的“实时”结果，是对同一批术中记录做的因果回放，并不是解码器在现场驱动交流界面的活体实验。

对齐时也用到了目标患者自己的一部分训练数据，包括双方都有的音素序列条件，来计算映射。所谓 5% 的条件，是一小份校准数据，而不是完全没有目标患者数据。在构音图检验中，分类器可以在其他人身上训练，但投影到目标空间时，仍然用到了目标患者的神经信号。

在这份较短的术中数据里，绝对分数仍然不高：九类离线任务的平均准确率是 0.31；因果模拟中的平均 PER 是 79.4%，而且单患者循环模型还没有离开随机水平。比较稳定的发现，是对齐带来的相对提升，尤其是在目标数据较少的时候。阵列子采样还给出一个更实际的细节：在这份数据里，对齐相对单患者模型的优势，要在网格既足够密（间距小于 3 mm）、覆盖又足够宽（至少约 8 mm × 17 mm）时，才清楚地出现。

## 总结

在八名言语功能完整的患者中，手术清醒记录到的感觉运动皮层高密度 μECoG 显示：言语相关的群体动力学可以用典型相关分析跨人对齐。用合并并对齐后的数据训练的解码器，在离线音素分类和同一批记录的因果模拟中，都优于只使用目标患者自己数据的模型。这种方法仍需要目标患者的少量数据来学习映射；而这个共享空间是功能上的：它并不要求一个人的电极直接对应到另一个人的电极。

## 参考资料

- Spalding, Z., Duraivel, S., Rahimpour, S., Wang, C., Barth, K., Schmitz, C., Lad, S. P., Friedman, A. H., Southwell, D. G., Viventi, J., & Cogan, G. B. (2026). <i>Shared latent representations of speech production for cross-patient speech decoding.</i> Nature Communications, 17, 8716。[doi.org/10.1038/s41467-026-75455-1](https://doi.org/10.1038/s41467-026-75455-1) · [原文](https://www.nature.com/articles/s41467-026-75455-1)
- Willett, F. R., et al. (2023). <i>A high-performance speech neuroprosthesis.</i> Nature, 620, 1031–1036。[doi.org/10.1038/s41586-023-06377-x](https://doi.org/10.1038/s41586-023-06377-x)
- Metzger, S. L., et al. (2023). <i>A high-performance neuroprosthesis for speech decoding and avatar control.</i> Nature, 620, 1037–1046。[doi.org/10.1038/s41586-023-06443-4](https://doi.org/10.1038/s41586-023-06443-4)
- Safaie, M., et al. (2023). <i>Preserved neural dynamics across animals performing similar behaviour.</i> Nature, 623, 765–771。[doi.org/10.1038/s41586-023-06714-0](https://doi.org/10.1038/s41586-023-06714-0)
- Figure 1–5 取自 Spalding 等（2026）。
