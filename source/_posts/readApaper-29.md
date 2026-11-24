---
title: "readApaper#29 Simultaneous speech and gesture decoding for multimodal communication in paralysis"
title_zh: "readApaper#29 Simultaneous speech and gesture decoding for multimodal communication in paralysis"
date: 2026-11-15 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - speech-decoding
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 15 November 2026 · Nature Neuroscience, 2026</i>

Everyday conversation often pairs spoken words with a nod, a wave, or a thumbs-up. This paper tests whether a single cortical implant can decode attempted speech and communicative gestures at the same time in people with paralysis, and drive a personalized virtual avatar.

## Background

Human communication is rarely speech alone. Accompanying movements, often called <b>cospeech gestures</b>, help a listener take in what is being said.

Stroke and neurodegenerative disease can take away both voices and gestures. <b>Anarthria</b> is the loss of intelligible speech caused by paralysis of the muscles that shape sound. The same injury or disease—for example a brainstem stroke, or amyotrophic lateral sclerosis (ALS)—can also weaken the arms and hands.

A <b>brain–computer interface</b> (BCI) turns neural activity into a command for an external device: text, synthesized speech, or the motion of a virtual character. Many high-performing systems record from <b>sensorimotor cortex</b> (SMC), which helps control the mouth, face, and limbs. The implant here is a high-density <b>electrocorticography</b> (ECoG) array: 253 disk-shaped contacts, 3 mm apart, on the pial surface of the left hemisphere, with a percutaneous pedestal to an external headstage. The main features are <b>high-gamma activity</b> (HGA; 70–150 Hz), a marker of local population activity, and a <b>low-frequency signal</b> (LFS; 1–100 Hz).

Recent BCIs have usually decoded speech or movement in isolation. Prior work from the same group already used ECoG to decode speech and animate a face (Metzger et al., 2023). It has been less clear whether one implant can support speech and upper-body gestures produced together.

## Problem

The practical question is twofold. First, does a single ECoG grid over SMC capture enough orofacial and upper-limb activity to distinguish many attempted movements? Second, can speech and gesture be decoded in parallel when they are attempted together, not only when each is cued alone?

Those settings are not automatically the same. If some electrodes respond to both behaviors, a model trained only on isolated trials may see a different pattern when both are attempted at once. When two decoders run side by side, each should stay at rest during the other modality. If the rest class is trained only on true rest, the other modality can be mistaken for an intended word or movement—a <b>false positive</b>. The reverse error, a <b>false negative</b>, is an intended act labeled as rest.

The proposed system is a multi-effector BCI: two parallel decoders, trained across isolated and simultaneous contexts, whose outputs control a full-body avatar.

## Method

Three people in the BRAVO clinical trial (NCT03698149) took part. Bravo-1r and Bravo-3 have severe vocal-tract and limb paralysis after pontine stroke; Bravo-6 has severe vocal-tract paralysis and moderate limb paralysis from ALS. Bravo-3 withdrew before the avatar work, so simultaneous and real-time results include only Bravo-1r and Bravo-6.

Bravo-1r silently attempted speech and made minimal, often uncoordinated attempts at gestures. Bravo-6 attempted speech with vocalization—audible but unintelligible—and imagined gestures with no visible arm movement. Bravo-3 silently attempted speech and attempted other body movements. The 253-contact arrays were implanted in September 2022 (Bravo-3), April 2024 (Bravo-1r, a higher-density replacement), and March 2025 (Bravo-6), with later recordings taken at home through November 2025.

Two networks ran in parallel, each with a one-dimensional temporal convolution, two bidirectional GRU layers, and a linear output over the classes plus rest. A ten-model ensemble was averaged. Inputs were z-scored HGA and LFS, except Bravo-6’s gesture model, which used HGA alone. Training windows were aligned to the go-cue (−1 to 4 s for speech; 0 to 5 s or 0 to 3 s for gestures in Bravo-1r and Bravo-6). Models were trained offline and then run at home. Decoded speech appeared as text; decoded gestures animated a personalized Unreal Engine avatar (mean transmission latency 7.5 ms).

Two training choices were central. <b>Context-inclusive</b> (hybrid) training mixed isolated and simultaneous trials equally. <b>Cross-modality</b> training built the rest class from true rest and from the other modality labeled as rest, so each decoder learned to stay quiet during the other behavior.

![Figure 2. Copy-task structure and partially overlapping speech and gesture activity. (a) Each trial presents a text cue, an animated gesture, or both, then a countdown and a green go-cue. (b, c) Three example electrodes on Bravo-6’s grid: e58 responds to speech and gesture, e151 mainly to gesture, and e164 mainly to speech; the simultaneous (green) traces follow the relevant unimodal responses. (d) Relative high-gamma maps for Bravo-6 show speech more ventrally and gestures more dorsally, with simultaneous activity spanning both. (e) Electrodes with significant activity: for Bravo-6, 73 speech-only, 64 shared, and 33 gesture-only; for Bravo-1r, 21, 39, and 86. (f) Overlap scores, the geometric mean of speech-related and gesture-related high-gamma, are highest in precentral cortex. From Brosler et al., 2026, Figure 2.](/img/readApaper-29/p29_fig2.png)

<i>Figure 2. Copy-task structure and partially overlapping speech and gesture activity. (a) Each trial presents a text cue, an animated gesture, or both, then a countdown and a green go-cue. (b, c) Three example electrodes on Bravo-6’s grid: e58 responds to speech and gesture, e151 mainly to gesture, and e164 mainly to speech; the simultaneous (green) traces follow the relevant unimodal responses. (d) Relative high-gamma maps for Bravo-6 show speech more ventrally and gestures more dorsally, with simultaneous activity spanning both. (e) Electrodes with significant activity: for Bravo-6, 73 speech-only, 64 shared, and 33 gesture-only; for Bravo-1r, 21, 39, and 86. (f) Overlap scores, the geometric mean of speech-related and gesture-related high-gamma, are highest in precentral cortex. From Brosler et al., 2026, Figure 2.</i>

## Experiments

The first experiment tested whether one grid could support many effectors. A single classifier was trained on 43 isolated-movement classes for Bravo-1r and 45 for Bravo-3 and Bravo-6, and tested with tenfold cross-validation (chance = 2.33% and 2.22%).

The copy task had three contexts: speech-only (S-only), gesture-only (G-only), and simultaneous speech-plus-gesture (S + G). After a cue and countdown, a green go-cue was followed by 2 s of rest. Bravo-6 used 10 phrases, 10 gestures, and all 100 pairings, so neither decoder could rely on a fixed pairing such as “hello” always coming with a wave. Bravo-1r’s S + G set was smaller: 5 phrases, 4 gestures, and 12 pairings, plus a separate 10-gesture isolated set used in mapping and in the real-time G-only task. Offline, models trained on isolated data, on S + G data, or on both were tested on held-out trials. In Bravo-6, one phrase or gesture was also withheld from simultaneous training. False-positive and false-negative rates were compared across these schemes.

Closed-loop tests used hybrid-trained models at home. The G-only copy task included Bravo-6 (5 blocks: 100 gesture and 10 rest trials) and Bravo-1r (12 blocks: 200 gesture and 20 rest trials), both with the 10-gesture set plus rest. Simultaneous copy was run in real time only for Bravo-6 (12 blocks, 200 S + G trials, with interleaved isolated and rest trials for false-positive checks); Bravo-1r’s simultaneous accuracies were evaluated offline. A shorter cued conversation included 20 trials for Bravo-6 (5 blocks of 4) and 9 trials for Bravo-1r (3 blocks of 3).

![Figure 1. A single ECoG array samples several body representations. (a) Schematic of one grid driving both speech and gesture on an avatar. (b) Electrode color encodes relative tuning to head and eyes (blue), hand and arm (red), and speech and orofacial movements (green); marker shape marks tactile responses, and the gray density behind the grid is the listening map. Hand-preferring sites sit more dorsally, orofacial sites more ventrally; Bravo-6 is more intermixed. (c) Bravo-3’s confusion matrix: many contralateral hand and speech classes form a dark diagonal, while ipsilateral hand movements and some leg or trunk movements are harder to tell apart. (d) Ten-fold classification accuracy for all three participants, well above chance (dotted lines). From Brosler et al., 2026, Figure 1.](/img/readApaper-29/p29_fig1.png)

<i>Figure 1. A single ECoG array samples several body representations. (a) Schematic of one grid driving both speech and gesture on an avatar. (b) Electrode color encodes relative tuning to head and eyes (blue), hand and arm (red), and speech and orofacial movements (green); marker shape marks tactile responses, and the gray density behind the grid is the listening map. Hand-preferring sites sit more dorsally, orofacial sites more ventrally; Bravo-6 is more intermixed. (c) Bravo-3’s confusion matrix: many contralateral hand and speech classes form a dark diagonal, while ipsilateral hand movements and some leg or trunk movements are harder to tell apart. (d) Ten-fold classification accuracy for all three participants, well above chance (dotted lines). From Brosler et al., 2026, Figure 1.</i>

## Results

In the multi-effector battery, many attempted movements were classified above chance in all three participants (Fig. 1c,d). Left-hand and leg movements were the main exceptions, consistent with array coverage. The maps were coarsely somatotopic, with hand-preferring electrodes more dorsal, and orofacial and speech electrodes more ventral, toward the Sylvian fissure.

In the speech-and-gesture task, speech-related high-gamma was concentrated more ventrally in ventral precentral gyrus, and gesture-related activity more dorsally near hand and arm representations. They were not fully separate: many precentral electrodes responded in S-only, G-only, and S + G trials (Fig. 2e,f).

At matched training sizes, S + G-trained models were more accurate on held-out S + G trials, and isolated-trained models were more accurate on isolated tests (Supplementary Fig. 5; all P \< 0.002). Hybrid models stayed accurate in both contexts and outperformed the single-context models (Fig. 3a–d). In Bravo-6, a leave-one-out test found no significant difference between seen and unseen pairings: median gesture accuracy 65.8% (95% CI 65.6–66.2) versus 66.7% (64.7–68.7; P = 0.29), and median speech accuracy 79.3% (78.9–79.8) versus 80.0% (79.3–80.7; P = 0.35). \![Figure 3. Hybrid training supports decoding in both isolated and simultaneous contexts. (a–d) Offline accuracy for Bravo-6 (10 gestures or 10 phrases; chance = 10%) and Bravo-1r (4 gestures, chance = 25%; 5 phrases, chance = 20%). Orange, green, and dark blue boxes are models trained on isolated data, on S + G data, or on both; each box is 10 ensemble scores. Hybrid models hold up on both test sets. (e, f) For Bravo-6, warmer colors mark electrodes that contributed more after S + G training; circle size is the overlap score from Figure 2. (g, h) Leave-one-out results in Bravo-6: accuracy on seen versus unseen simultaneous pairings did not differ (P = 0.29 and 0.35). From Brosler et al., 2026, Figure 3.](/img/readApaper-29/p29_fig3.png)

<i><br />Figure 3. Hybrid training supports decoding in both isolated and simultaneous contexts. (a–d) Offline accuracy for Bravo-6 (10 gestures or 10 phrases; chance = 10%) and Bravo-1r (4 gestures, chance = 25%; 5 phrases, chance = 20%). Orange, green, and dark blue boxes are models trained on isolated data, on S + G data, or on both; each box is 10 ensemble scores. Hybrid models hold up on both test sets. (e, f) For Bravo-6, warmer colors mark electrodes that contributed more after S + G training; circle size is the overlap score from Figure 2. (g, h) Leave-one-out results in Bravo-6: accuracy on seen versus unseen simultaneous pairings did not differ (P = 0.29 and 0.35). From Brosler et al., 2026, Figure 3.<br />\</i>

With a rest class trained only on true rest, false-positive rates were low on true-rest trials—median 0.0% (0.0–9.1) in Bravo-6 and 2.7% (1.4–5.4) in Bravo-1r—but rose to 30.6% (2.6–58.6) and 76.0% (54.8–95.3) on the opposite modality. Cross-modality training brought those opposite-modality rates to 0.0%, while true-rest rates stayed low (0.0% and 2.8%). Isolated-trained models missed many simultaneous attempts, with S + G false-negative rates of 14.5% (7.0–27.5) and 34.9% (30.6–44.3), versus 0.0% and 0.8% on isolated tests. Training on both contexts reduced those simultaneous false negatives to 1.0% (0.0–1.5) and 4.5% (3.5–5.3). On the full isolated and simultaneous sets with cross-modality rest, mean offline S + G accuracy, including rest, was 68.8% (66.4–71.1) for gestures and 77.5% (75.1–79.8) for speech in Bravo-6 (10 classes plus rest; chance = 9.1%), and 88.3% (86.8–89.6) and 84.0% (82.8–85.1) in Bravo-1r (4 and 5 classes plus rest; chance = 20% and 16.7%).

![Figure 4. Cross-modality and context-inclusive training reduce errors in the parallel system. (a) A false positive is a decoder that outputs a word or gesture during true rest or during the other modality; a false negative is an intended act labeled as rest. (b) Gray boxes are rest-only training; purple boxes add opposite-modality examples to the rest class. Opposite-modality false positives drop after cross-training, while true-rest rates stay low. (c) Brown, green, and navy boxes are isolated, S + G-only, and hybrid training. Hybrid models keep false-negative rates low on both isolated and S + G tests. Each box pools 20 evaluations (10 speech and 10 gesture splits). From Brosler et al., 2026, Figure 4.](/img/readApaper-29/p29_fig4.png)

<i>Figure 4. Cross-modality and context-inclusive training reduce errors in the parallel system. (a) A false positive is a decoder that outputs a word or gesture during true rest or during the other modality; a false negative is an intended act labeled as rest. (b) Gray boxes are rest-only training; purple boxes add opposite-modality examples to the rest class. Opposite-modality false positives drop after cross-training, while true-rest rates stay low. (c) Brown, green, and navy boxes are isolated, S + G-only, and hybrid training. Hybrid models keep false-negative rates low on both isolated and S + G tests. Each box pools 20 evaluations (10 speech and 10 gesture splits). From Brosler et al., 2026, Figure 4.</i>

In real time, G-only copy-task accuracy, including rest, was 81.8% (74.5–89.1) for Bravo-6 and 61.7% (55.3–68.2) for Bravo-1r (10 gestures plus rest; chance = 9.1%). In Bravo-6’s real-time simultaneous copy task, accuracy was 66.0% (59.5–72.5) for gestures and 70.0% (63.5–76.0) for speech (chance reported as 9.1%). In the smaller conversation blocks, Bravo-6 averaged 85.0% (70.0–100.0) for gestures and 75.0% (55.0–90.0) for speech across 20 trials; Bravo-1r’s median was 100% for both decoders across 9 trials (chance = 20% and 16.7%). Real-time false-positive rates in Bravo-6 were 0.0% for speech and 2.5% (0.0–7.5) for gestures.

![Figure 5. Closed-loop control of a personalized avatar, shown for Bravo-6. (a) After the go-cue, neural activity is sent to parallel gesture and speech decoders; gestures animate the avatar, and speech is shown as text. (b) Real-time accuracy in the G-only copy task: each dot is one block, the half-violin is a bootstrap over trials, and the dotted line is chance. (c) Real-time simultaneous copy-task accuracy for gestures (orange) and speech (blue). (d) The same layout for the short conversation paradigm; the spread is wide because the trial count is small. (e) False-positive rates during rest and during the other modality. From Brosler et al., 2026, Figure 5.](/img/readApaper-29/p29_fig5.png)

<i>Figure 5. Closed-loop control of a personalized avatar, shown for Bravo-6. (a) After the go-cue, neural activity is sent to parallel gesture and speech decoders; gestures animate the avatar, and speech is shown as text. (b) Real-time accuracy in the G-only copy task: each dot is one block, the half-violin is a bootstrap over trials, and the dotted line is chance. (c) Real-time simultaneous copy-task accuracy for gestures (orange) and speech (blue). (d) The same layout for the short conversation paradigm; the spread is wide because the trial count is small. (e) False-positive rates during rest and during the other modality. From Brosler et al., 2026, Figure 5.</i>

## Analysis

One high-density ECoG grid over left SMC can sample orofacial and upper-limb representations together, and those signals support above-chance classification of many isolated movements in three people. Speech and gesture are partly, but not wholly, separable.

Isolated training does not automatically transfer to simultaneous attempts. Hybrid training improves simultaneous decoding without giving up isolated performance, and it lowers missed simultaneous attempts. A leave-one-out test in Bravo-6 suggests the models were not memorizing all 100 pairings. Cross-modality rest training keeps each decoder quiet when only the other output is being used.

The G-only and Bravo-6 simultaneous copy tasks are the main closed-loop tests, with closed vocabularies of 10 gestures and, for simultaneous copy, 10 phrases. Bravo-1r’s simultaneous performance is offline, on a smaller set (4 gestures and 5 phrases). Conversation accuracies come from 20 trials in Bravo-6 and 9 in Bravo-1r, showing that the same pipeline can be used when an experimenter prompts a reply, rather than a large-sample conversational benchmark. “Attempt” also meant different overt behavior: silent, minimal movement in Bravo-1r, and overt unintelligible speech with imagined gestures in Bravo-6. The decoders were reading cortical activity, not a fully executed movement.

## Summary

A single subdural ECoG implant can feed two parallel decoders that output speech and gestures, including when those behaviors are attempted together, and those outputs can drive a personalized avatar in real time. Training is more reliable when it includes both isolated and simultaneous examples, and when each rest class also includes the other modality. In the larger closed-loop tests, Bravo-6 reached 81.8% on isolated gestures and 66.0% / 70.0% on simultaneous gestures and speech; the same architecture also ran in Bravo-1r, with offline simultaneous accuracies of 88.3% and 84.0% on a smaller vocabulary.

## References

- Brosler, S. C., Liu, J. R., Silva, A. B., Hallinan, I. P., Kurtz-Miott, C. M., Dunkel Wilker, J. F. B., Tu-Chan, A., Ganguly, K., & Chang, E. F. (2026). <i>Simultaneous speech and gesture decoding for multimodal communication in paralysis.</i> Nature Neuroscience, 29, 2445–2455. [doi.org/10.1038/s41593-026-02446-2](https://doi.org/10.1038/s41593-026-02446-2) · [Article](https://www.nature.com/articles/s41593-026-02446-2)
- Metzger, S. L., et al. (2023). <i>A high-performance neuroprosthesis for speech decoding and avatar control.</i> Nature, 620, 1037–1046. [doi.org/10.1038/s41586-023-06443-4](https://doi.org/10.1038/s41586-023-06443-4)
- Figures 1–5 are from Brosler et al. (2026).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-15 · Nature Neuroscience, 2026</i>

日常交谈里，说话常常会配上点头、挥手或竖起拇指。这篇论文检验的是：在瘫痪患者中，单独一块皮层植入物能否同时解码尝试的言语和交流性手势，并驱动一个个性化的虚拟化身。

## 背景

人类交流很少只靠说话。伴随言语出现的动作，常常被称为<b>伴随手势</b>（cospeech gestures），能帮助听者理解正在说的内容。

中风和神经退行性疾病可能同时夺走声音和手势。<b>构音不能</b>（anarthria）是指负责塑形声音的肌肉瘫痪后，人失去了可懂的言语。同一种损伤或疾病——例如脑干中风，或肌萎缩侧索硬化（ALS）——也可能削弱手臂和手。

<b>脑机接口</b>（BCI）把脑活动转换成对外部设备的指令：文字、合成语音，或虚拟人物的动作。许多高性能系统记录的是<b>感觉运动皮层</b>（SMC），它参与控制口、面和四肢。本研究使用的是高密度<b>皮层脑电图</b>（ECoG）阵列：253 个盘状触点，间距 3 mm，放在左半球软脑膜表面，经皮基座接到体外头阶。主要特征是<b>高伽马活动</b>（HGA；70–150 Hz），它是局部群体活动的标志，以及<b>低频信号</b>（LFS；1–100 Hz）。

近年来的 BCI 通常一次只解码言语或运动。同一研究组先前已经用 ECoG 解码言语并驱动面部化身（Metzger 等，2023）。仍不那么清楚的是：单独一块植入物是否仍能同时支持一起产生的言语和上肢手势。

## 问题

实际问题有两层。第一，覆盖 SMC 的一块 ECoG 网格，是否足以采集口面部和上肢活动，从而区分多种尝试的动作？第二，当言语和手势被同时尝试，而不只是分别提示时，这两路信号能否被并行解码？

这两种情境并不自动相同。如果有些电极对两种行为都有反应，只在单独试验上训练的模型，在两者同时进行时可能会看到不同的模式。两套解码器并行运行时，各自应在另一模态期间保持为休息。如果休息类别只在真正休息上训练，另一模态就可能被误当成有意的词或动作，这是<b>假阳性</b>。相反的错误是<b>假阴性</b>：一次有意动作被标成了休息。

提出的方案是一套多效应器 BCI：两路并行解码器，在单独和同时两种情境下训练，输出用于控制个性化的全身化身。

## 方法

三名参与者来自 BRAVO 临床试验（NCT03698149）。Bravo-1r 和 Bravo-3 因脑桥中风而有严重的声道和肢体瘫痪；Bravo-6 因 ALS 而有严重的声道瘫痪和中等程度的肢体瘫痪。Bravo-3 在化身实验开始前退出，因此同时和实时结果只包括 Bravo-1r 和 Bravo-6。

Bravo-1r 默读式地尝试说话，对手势做最小、往往不协调的尝试。Bravo-6 带发声地尝试说话，声音可闻但不可懂，并在没有可见上肢动作的情况下想像手势。Bravo-3 默读式尝试说话，并尝试其他身体动作。253 触点阵列分别于 2022 年 9 月（Bravo-3）、2024 年 4 月（Bravo-1r，更高密度的更换植入）和 2025 年 3 月（Bravo-6）植入，此后的记录持续到 2025 年 11 月，并在家中进行。

两套网络并行运行，各自包含一维时间卷积、两层双向 GRU，以及覆盖各类别外加休息的线性输出。十模型集成取平均。输入是经过 z 分数标准化的 HGA 和 LFS；Bravo-6 的手势模型只用 HGA。训练窗口对准开始提示（言语为 −1 到 4 秒；手势在 Bravo-1r 为 0 到 5 秒，在 Bravo-6 为 0 到 3 秒）。模型离线训练后在家中运行。解码出的言语显示为文字；解码出的手势驱动与参与者共同选定的 Unreal Engine 全身化身（平均传输延迟 7.5 毫秒）。

有两种训练策略很关键。<b>包含情境</b>（混合）训练把单独试验和同时试验各用一半。<b>跨模态</b>训练则把休息类别建立在真正休息与被标成休息的另一模态之上，从而让每个解码器在另一行为期间保持安静。

![Figure 2. 抄写任务的结构和部分重叠的言语与手势活动。（a）每次试验先呈现文字提示、动画手势，或两者一起，再倒计时，最后出现绿色开始提示。（b, c）Bravo-6 网格上的三个示例电极：e58 对言语和手势都有反应，e151 主要对手势，e164 主要对言语；同时条件（绿色）的轨迹跟随相应的单模态反应。（d）Bravo-6 的相对高伽马地图显示言语更靠腹侧、手势更靠背侧，同时活动覆盖两者。（e）有显著活动的电极：Bravo-6 为仅言语 73、共享 64、仅手势 33；Bravo-1r 为 21、39 和 86。（f）重叠分数是言语相关与手势相关高伽马的几何平均，在中央前回最高。取自 Brosler 等，2026，Figure 2。](/img/readApaper-29/p29_fig2.png)

<i>Figure 2. 抄写任务的结构和部分重叠的言语与手势活动。（a）每次试验先呈现文字提示、动画手势，或两者一起，再倒计时，最后出现绿色开始提示。（b, c）Bravo-6 网格上的三个示例电极：e58 对言语和手势都有反应，e151 主要对手势，e164 主要对言语；同时条件（绿色）的轨迹跟随相应的单模态反应。（d）Bravo-6 的相对高伽马地图显示言语更靠腹侧、手势更靠背侧，同时活动覆盖两者。（e）有显著活动的电极：Bravo-6 为仅言语 73、共享 64、仅手势 33；Bravo-1r 为 21、39 和 86。（f）重叠分数是言语相关与手势相关高伽马的几何平均，在中央前回最高。取自 Brosler 等，2026，Figure 2。</i>

## 实验

第一项实验检验一块网格能否支持多种效应器。一个分类器在 Bravo-1r 的 43 类单独动作、以及 Bravo-3 和 Bravo-6 的 45 类上训练，并用十折交叉验证测试（随机水平为 2.33% 和 2.22%）。

抄写任务有三种情境：只说话（S-only）、只做手势（G-only），以及同时说话加手势（S + G）。提示和倒计时之后，绿色开始提示后是 2 秒休息。Bravo-6 使用 10 个短语、10 个手势和全部 100 种配对，因此任一解码器都不能依赖“hello”总是配挥手这类固定组合。Bravo-1r 的 S + G 集合更小：5 个短语、4 个手势和 12 种配对；另外还有一套 10 个手势的单独集合，用于映射和实时的只做手势任务。离线分析把在单独数据、S + G 数据或两者上训练的模型，放到留出试验上测试。对 Bravo-6，他们还从同时训练中拿掉一个短语或一个手势。假阳性和假阴性率也在这些方案之间做了比较。

闭环测试使用混合训练的模型，在家中进行。只做手势的抄写任务包括 Bravo-6（5 个组块：100 次手势和 10 次休息试验）和 Bravo-1r（12 个组块：200 次手势和 20 次休息试验），两人都使用 10 个手势外加休息。同时抄写只在 Bravo-6 上做了实时（12 个组块，200 次 S + G 试验，并穿插单独和休息试验以检查假阳性）；Bravo-1r 的同时准确率只做了离线评估。更短的提示性对话包括 Bravo-6 的 20 次试验（5 个组块，每块 4 次）和 Bravo-1r 的 9 次试验（3 个组块，每块 3 次）。

![Figure 1. 单独一块 ECoG 阵列可以采样多种身体表征。（a）一块网格同时驱动化身上的言语和手势的示意图。（b）电极颜色编码对头和眼（蓝）、手和臂（红）以及言语和口面部运动（绿）的相对调谐；标记形状表示触觉反应，网格后方的灰色密度是听反应图。偏好手的位点更靠背侧，口面部位点更靠腹侧；Bravo-6 的分布更混合。（c）Bravo-3 的混淆矩阵：许多对侧手部和言语类别形成深色对角线，同侧手运动以及部分腿或躯干运动更难区分。（d）三名参与者的十折分类准确率都明显高于随机水平（虚线）。取自 Brosler 等，2026，Figure 1。](/img/readApaper-29/p29_fig1.png)

<i>Figure 1. 单独一块 ECoG 阵列可以采样多种身体表征。（a）一块网格同时驱动化身上的言语和手势的示意图。（b）电极颜色编码对头和眼（蓝）、手和臂（红）以及言语和口面部运动（绿）的相对调谐；标记形状表示触觉反应，网格后方的灰色密度是听反应图。偏好手的位点更靠背侧，口面部位点更靠腹侧；Bravo-6 的分布更混合。（c）Bravo-3 的混淆矩阵：许多对侧手部和言语类别形成深色对角线，同侧手运动以及部分腿或躯干运动更难区分。（d）三名参与者的十折分类准确率都明显高于随机水平（虚线）。取自 Brosler 等，2026，Figure 1。</i>

## 结果

在多效应器动作组中，三名参与者的许多尝试动作都高于随机水平（图 1c,d）。主要的例外是左手运动和腿部运动，这与阵列覆盖一致。地图大致呈躯体定位：偏好手的电极更靠背侧，口面部和言语电极更靠腹侧、朝向外侧裂。

在言语和手势任务中，言语相关的高伽马更集中在腹侧中央前回，手势相关活动更靠背侧、接近手和臂表征。它们并非完全分开：许多中央前回电极在 S-only、G-only 和 S + G 中都有反应（图 2e,f）。

在匹配的训练规模下，用 S + G 数据训练的模型在留出的 S + G 试验上更准，单独训练的模型则在单独测试上更准（补充图 5；全部 P \< 0.002）。混合模型在两种情境中都保持较高准确率，并优于单一情境模型（图 3a–d）。Bravo-6 的留一检验中，见过与未见过的配对没有显著差异：手势中位准确率为 65.8%（95% 置信区间 65.6–66.2）对 66.7%（64.7–68.7；P = 0.29），言语为 79.3%（78.9–79.8）对 80.0%（79.3–80.7；P = 0.35）。\![Figure 3. 混合训练在单独和同时两种情境下都支持解码。（a–d）Bravo-6（10 个手势或 10 个短语；随机水平 = 10%）和 Bravo-1r（4 个手势，随机水平 = 25%；5 个短语，随机水平 = 20%）的离线准确率。橙、绿和深蓝框分别是在单独数据、S + G 数据或两者上训练的模型；每个框是 10 个集成分数。混合模型在两套测试集上都站得住。（e, f）对 Bravo-6 而言，暖色表示在 S + G 训练后贡献增加的电极；圆点大小是图 2 中的重叠分数。（g, h）Bravo-6 的留一结果：见过与未见过的同时配对准确率没有差异（P = 0.29 和 0.35）。取自 Brosler 等，2026，Figure 3。](/img/readApaper-29/p29_fig3.png)

<i><br />Figure 3. 混合训练在单独和同时两种情境下都支持解码。（a–d）Bravo-6（10 个手势或 10 个短语；随机水平 = 10%）和 Bravo-1r（4 个手势，随机水平 = 25%；5 个短语，随机水平 = 20%）的离线准确率。橙、绿和深蓝框分别是在单独数据、S + G 数据或两者上训练的模型；每个框是 10 个集成分数。混合模型在两套测试集上都站得住。（e, f）对 Bravo-6 而言，暖色表示在 S + G 训练后贡献增加的电极；圆点大小是图 2 中的重叠分数。（g, h）Bravo-6 的留一结果：见过与未见过的同时配对准确率没有差异（P = 0.29 和 0.35）。取自 Brosler 等，2026，Figure 3。<br />\</i>

休息类别只在真正休息上训练时，真正休息试验上的假阳性率已经很低——Bravo-6 的中位数为 0.0%（0.0–9.1），Bravo-1r 为 2.7%（1.4–5.4）——但在相反模态上分别升到 30.6%（2.6–58.6）和 76.0%（54.8–95.3）。跨模态训练把这些相反模态比率降到 0.0%，真正休息上的比率仍然很低（0.0% 和 2.8%）。只在单独行为上训练的模型也经常漏掉同时尝试：S + G 假阴性率为 14.5%（7.0–27.5）和 34.9%（30.6–44.3），单独测试上则是 0.0% 和 0.8%。在两种情境上都训练后，这些同时假阴性降到 1.0%（0.0–1.5）和 4.5%（3.5–5.3）。在全部单独和同时数据上训练并加入跨模态休息后，把休息也算在内，Bravo-6 的平均离线 S + G 准确率为手势 68.8%（66.4–71.1）、言语 77.5%（75.1–79.8）（10 类加休息；随机水平 = 9.1%）；Bravo-1r 为 88.3%（86.8–89.6）和 84.0%（82.8–85.1）（4 类和 5 类加休息；随机水平为 20% 和 16.7%）。

![Figure 4. 跨模态和包含情境的训练降低了并行系统中的错误。（a）假阳性是解码器在真正休息或另一模态期间输出了词或手势；假阴性是一次有意动作被标成休息。（b）灰框是只在休息上训练；紫框把相反模态的例子加入休息类别。跨训练后，相反模态的假阳性下降，真正休息上的比率仍然很低。（c）棕、绿和海军蓝框分别是单独、只在 S + G、以及混合训练。混合模型在单独和 S + G 测试上都把假阴性率保持得很低。每个框汇集 20 次评估（10 次言语和 10 次手势划分）。取自 Brosler 等，2026，Figure 4。](/img/readApaper-29/p29_fig4.png)

<i>Figure 4. 跨模态和包含情境的训练降低了并行系统中的错误。（a）假阳性是解码器在真正休息或另一模态期间输出了词或手势；假阴性是一次有意动作被标成休息。（b）灰框是只在休息上训练；紫框把相反模态的例子加入休息类别。跨训练后，相反模态的假阳性下降，真正休息上的比率仍然很低。（c）棕、绿和海军蓝框分别是单独、只在 S + G、以及混合训练。混合模型在单独和 S + G 测试上都把假阴性率保持得很低。每个框汇集 20 次评估（10 次言语和 10 次手势划分）。取自 Brosler 等，2026，Figure 4。</i>

实时条件下，只做手势的抄写任务准确率（含休息）为 Bravo-6 的 81.8%（74.5–89.1）和 Bravo-1r 的 61.7%（55.3–68.2）（10 个手势加休息；随机水平 = 9.1%）。在 Bravo-6 的实时同时抄写任务中，手势准确率为 66.0%（59.5–72.5），言语为 70.0%（63.5–76.0）（文中报告的随机水平为 9.1%）。在规模更小的对话组块中，Bravo-6 在 20 次试验上的平均准确率为手势 85.0%（70.0–100.0）、言语 75.0%（55.0–90.0）；Bravo-1r 在 9 次试验上两个解码器的中位数都是 100%（随机水平为 20% 和 16.7%）。Bravo-6 的实时假阳性率为言语 0.0%、手势 2.5%（0.0–7.5）。

![Figure 5. 个性化化身的闭环控制，图中为 Bravo-6。（a）开始提示之后，神经活动被送到并行的手势和言语解码器；手势驱动化身，言语显示为文字。（b）只做手势抄写任务的实时准确率：每个点是一个组块，半小提琴是对试验的自助抽样，虚线是随机水平。（c）同时抄写任务中手势（橙）和言语（蓝）的实时准确率。（d）短对话范式的同样画法；因为试验次数少，分布较宽。（e）在休息和另一模态期间的假阳性率。取自 Brosler 等，2026，Figure 5。](/img/readApaper-29/p29_fig5.png)

<i>Figure 5. 个性化化身的闭环控制，图中为 Bravo-6。（a）开始提示之后，神经活动被送到并行的手势和言语解码器；手势驱动化身，言语显示为文字。（b）只做手势抄写任务的实时准确率：每个点是一个组块，半小提琴是对试验的自助抽样，虚线是随机水平。（c）同时抄写任务中手势（橙）和言语（蓝）的实时准确率。（d）短对话范式的同样画法；因为试验次数少，分布较宽。（e）在休息和另一模态期间的假阳性率。取自 Brosler 等，2026，Figure 5。</i>

## 分析

左半球 SMC 上的一块高密度 ECoG 网格，可以同时采集口面部和上肢表征；这些信号在三人中都支持对许多单独动作的高于随机的分类。言语和手势部分可分，但并非完全分离。

单独训练并不会自动迁移到同时尝试。混合训练提高同时解码，又不放弃单独表现，并降低被漏掉的同时尝试。Bravo-6 的留一检验说明，模型并不是在记住全部 100 种配对。跨模态休息训练让每个解码器在只使用另一路输出时保持安静。

只做手势的任务，以及 Bravo-6 的同时抄写任务，是主要的闭环检验，词表是封闭的 10 个手势；同时抄写还有 10 个短语。Bravo-1r 的同时表现是较小词表（4 个手势和 5 个短语）上的离线结果。对话准确率来自 Bravo-6 的 20 次试验和 Bravo-1r 的 9 次试验，表明同一套流程可以在实验者提示回答时使用，而不是提供大样本的对话基准。两名参与者的“尝试”所对应的外显行为也不同：Bravo-1r 是默读和最小动作，Bravo-6 是不可懂的发声并想像手势。解码器读的是皮层活动，而不是一次完整执行的运动。

## 总结

单独一块硬膜下 ECoG 植入物，可以供给两路并行解码器，输出言语和手势，包括这些行为被同时尝试的时候；这些输出还能在实时中驱动个性化的化身。当训练同时包含单独和同时的例子，并且每个休息类别也包含另一模态时，系统更为可靠。在规模更大的闭环测试中，Bravo-6 在单独手势上达到 81.8%，在同时手势和言语上达到 66.0% / 70.0%；同一架构也在 Bravo-1r 上运行，其较小词表上的离线同时准确率为 88.3% 和 84.0%。

## 参考资料

- Brosler, S. C., Liu, J. R., Silva, A. B., Hallinan, I. P., Kurtz-Miott, C. M., Dunkel Wilker, J. F. B., Tu-Chan, A., Ganguly, K., & Chang, E. F. (2026). <i>Simultaneous speech and gesture decoding for multimodal communication in paralysis.</i> Nature Neuroscience, 29, 2445–2455。[doi.org/10.1038/s41593-026-02446-2](https://doi.org/10.1038/s41593-026-02446-2) · [原文](https://www.nature.com/articles/s41593-026-02446-2)
- Metzger, S. L., et al. (2023). <i>A high-performance neuroprosthesis for speech decoding and avatar control.</i> Nature, 620, 1037–1046。[doi.org/10.1038/s41586-023-06443-4](https://doi.org/10.1038/s41586-023-06443-4)
- Figure 1–5 取自 Brosler 等（2026）。
