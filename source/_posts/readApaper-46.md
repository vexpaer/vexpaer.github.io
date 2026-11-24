---
title: "readApaper#46 Long-term independent use of an intracortical brain–computer interface for speech and cursor control"
title_zh: "readApaper#46 长期独立使用皮质内脑机接口进行语音与光标控制"
date: 2026-12-02 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - speech-decoding
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 2 December 2026 · Nature Medicine, 2026</i>

This paper reports nearly two years of independent home use of a multimodal intracortical brain–computer interface that lets one person with ALS speak through decoded attempted speech and point through a neural cursor, with little or no daily prompted recalibration.

## Background

A <b>brain–computer interface</b> (BCI) turns recorded brain activity into a command that a computer or assistive device can use. An <b>intracortical</b> BCI places microelectrode arrays in the cortex itself, so that the signal comes from nearby neurons rather than from the scalp. That closer view can support faster and more accurate decoding, but it also means the system must be set up, calibrated and maintained as a daily tool, not only as a laboratory demonstration.

Many people who need such a tool have lost reliable speech, hand control, or both. <b>Amyotrophic lateral sclerosis</b> (ALS) is a neurodegenerative disease that weakens the muscles used for speaking and moving. In its later stages a person may still try to speak, yet the words are no longer intelligible—a condition called <b>dysarthria</b>. Eye-tracking and other residual-movement devices can help some users, but they can be tiring, slow, or unusable when those residual movements also decline.

Speech BCIs aim to decode the neural activity that accompanies attempted speech and turn it into text. Cursor BCIs aim to decode intended pointing so that the same person can click, type, or navigate a computer. In the laboratory, both kinds of decoder can look strong on short, prompted tasks. Everyday communication is different: the user is at home, researchers are not in the room, the decoder must keep working as neural recordings slowly drift, and the same system has to serve as both a voice and a mouse. This study follows one person who used such a system in just that setting.

## Problem

Prior intracortical speech or cursor BCIs have typically required researcher oversight to put the system on, frequent recalibration to keep accuracy from falling, or both. A system that works only when a trained assistant is present is not yet a daily communication tool. The practical problem is therefore long-term, independent, multimodal use: can a person with severe dysarthria and paralysis operate a speech decoder and a neural cursor at home, day after day, without a research team on site, and without a long prompted calibration each morning?

The authors address that problem in a single, intensively documented participant, and they measure not only formal copy-task accuracy but also how the system was actually used for personal communication.

## Method

The participant, T15, was a 45-year-old man with ALS and severe dysarthria, enrolled in 2023 in the BrainGate2 trial (NCT00912041). Four 64-electrode arrays were placed in the ventral precentral gyrus, in areas 55b, dorsal 6v, area 4 and ventral 6v—regions involved in speech and orofacial control. The implant was percutaneous and wired. Neural features were binned in 10–20 ms intervals, depending on the decoder.

For speech, an attempted utterance was decoded as a sequence of phoneme probabilities, originally with a recurrent network and, after post-implant day 600, with a transformer phoneme decoder. Those probabilities, emitted every 80 ms, were combined with a language model that selected likely word sequences from a vocabulary of more than 125,000 English words. The speech output could be used as a keyboard for any application. A separate recurrent decoder mapped neural activity to a computer cursor, so that speech and pointing could be used together, much as a keyboard and a mouse are used together.

![Figure 1. Independent use of the multimodal intracortical BCI (Card et al., 2026, Fig. 1). After daily setup, T15 used a speech decoder and a neural cursor at home without researchers present.](/img/readApaper-46/home_ibci_fig1.png)

<i>Figure 1. Independent use of the multimodal intracortical BCI (Card et al., 2026, Fig. 1). After daily setup, T15 used a speech decoder and a neural cursor at home without researchers present.</i>

Two design choices were meant to keep the system usable without a researcher. First, the speech decoder was <b>continuously recalibrated in the background</b> as T15 used it, to track slow changes in neural activity. Second, any explicit prompted calibration was optional and short: 0–20 calibration sentences at the start of the day, at the user’s discretion. Cursor calibration was likewise kept brief. After an investigational-device-exemption change allowed fully independent computer access, T15 and his care partners could start the system at home without the scientific team present.

## Experiments

Independent home use began on post-implant day 281. Before that day, use was limited to two to four researcher-supervised sessions per week, averaging 3.7 hours per day. After day 281 the system was used nearly every day for 19 months. T15 and his care partners reported that daily setup took approximately 20 minutes, after which he used the system continuously for up to 19 hours without additional researcher support.

The authors quantified both personal communication and formal tasks. Personal-use logs recorded hours of use, the number of sentences and words produced, speaking rate, and T15’s own ratings of whether each sentence had been decoded at least mostly correctly. Formal copy-task sessions measured word accuracy on prompted speech, including after the switch to the transformer decoder. Cursor performance was measured in structured grid-selection tasks and compared, on some days, with gaze-based control on the same grids: a dense 14 × 14 grid with 0.77-inch tiles and a coarser 6 × 6 grid with 1.79-inch tiles.

## Results

Across personal-use sessions the system accumulated 3,801 hours of independent use. T15 communicated 183,060 sentences, totaling 1,960,163 words, at an average rate of 56 words per minute. He labeled 92% of sentences as being decoded at least mostly correctly. In a more detailed breakdown of the same 183,060 sentences, 53.3% were decoded completely correctly, and 12.9% were corrected by the user. The abstract describes this period as nearly two years of home use and more than 3,800 hours of independent use; the 19-month figure refers to nearly daily use after day 281, and the 3,801 hours are taken from all personal-use sessions.

On formal prompted copy tasks, word accuracy was consistently above 99% with the large vocabulary. After the day-600 switch, the transformer speech decoder reached 99.2% word accuracy on the copy task with the 125,000-word vocabulary, and it did so with little or no daily explicit recalibration.

![Figure 2. Speech decoding (Card et al., 2026, Fig. 2). Formal copy-task word accuracy remained above 99% with a 125,000-word vocabulary, reaching 99.2% after the transformer decoder was introduced on post-implant day 600.](/img/readApaper-46/home_ibci_fig2.png)

<i>Figure 2. Speech decoding (Card et al., 2026, Fig. 2). Formal copy-task word accuracy remained above 99% with a 125,000-word vocabulary, reaching 99.2% after the transformer decoder was introduced on post-implant day 600.</i>

In structured grid-task assessments, the neural cursor achieved 2.90 ± 0.16 bits per second of throughput (mean ± s.d.). That figure is the structured neural grid-task result and is not the comparison with gaze on the dense 14 × 14 grid. On that smaller-tile 14 × 14 grid, gaze-based control reached 0.80 ± 0.33 bits per second. On the larger-tile 6 × 6 grid, the neural cursor reached 1.67 ± 0.21 bits per second and gaze reached 2.59 ± 0.26 bits per second. The cursor could be calibrated in a few minutes or less over many months; in a later quantification, total cursor calibration was 9.2 ± 5.9 minutes per day while performance was maintained or improved.

![Figure 3. Computer control with the cursor BCI (Card et al., 2026, Fig. 3). In structured grid-task assessments the neural cursor reached 2.90 ± 0.16 bits per second; gaze and neural throughputs on 14 × 14 and 6 × 6 grids are shown separately and depend on tile size.](/img/readApaper-46/home_ibci_fig3.png)

<i>Figure 3. Computer control with the cursor BCI (Card et al., 2026, Fig. 3). In structured grid-task assessments the neural cursor reached 2.90 ± 0.16 bits per second; gaze and neural throughputs on 14 × 14 and 6 × 6 grids are shown separately and depend on tile size.</i>

Usage was not limited to laboratory-like copy tasks. T15 used speech as keyboard input and the cursor as a mouse for ordinary computer access, and the time distribution across the 3,801 personal-use hours shows extended self-directed use after the morning setup.

![Figure 4. Neural stability (Card et al., 2026, Fig. 4). Background recalibration and optional short prompted calibration (0–20 sentences per day at the user’s discretion) were used to track slow changes in neural activity during long-term home use.](/img/readApaper-46/home_ibci_fig4.png)

<i>Figure 4. Neural stability (Card et al., 2026, Fig. 4). Background recalibration and optional short prompted calibration (0–20 sentences per day at the user’s discretion) were used to track slow changes in neural activity during long-term home use.</i>

## Analysis

The central result is not a single laboratory score but a documented pattern of daily, unsupervised use. A person with ALS produced nearly two million words at 56 words per minute, rated most sentences as at least mostly correct, and, when formally tested, exceeded 99% word accuracy on a very large vocabulary. Background recalibration, optional short prompted calibration, and a care-partner setup of about 20 minutes were enough to keep that performance available for up to 19 hours a day.

The multimodal design matters for interpretation. Speech and cursor were not competing demonstrations; they were used as complementary inputs, which is closer to how a computer is actually operated. The grid-task numbers also need to be read on their own terms: the headline 2.90 ± 0.16 bits per second describes structured neural-cursor assessments, whereas the direct gaze comparison depends on tile size. On the dense 14 × 14 grid, gaze was relatively slow; on the coarser 6 × 6 grid, gaze was faster than the neural cursor. The paper therefore supports high-throughput neural pointing in structured tasks without claiming that the neural cursor beat gaze in every layout.

The decoder change on day 600 is a reminder that “the system” was not frozen. The transformer improved copy-task word accuracy to 99.2%, but the long-term use record already included many months of earlier RNN-based decoding. Both phases belong to the same independent-use story: a home system that could be started without researchers and that continued to be used as the algorithms improved.

## Summary

In one person with ALS, four arrays in ventral precentral cortex supported years of independent home use of a speech-and-cursor BCI. After day 281, nearly daily use over 19 months produced 3,801 hours of personal sessions, 183,060 sentences and 1,960,163 words at 56 words per minute, with 92% of sentences rated at least mostly correct and copy-task accuracy above 99%, reaching 99.2% with a transformer decoder and a 125,000-word vocabulary. Daily setup took about 20 minutes; explicit speech calibration, when used, was 0–20 sentences; and the neural cursor reached 2.90 ± 0.16 bits per second in structured grid assessments.

## References

Card, N. S., Singer-Clark, T., Peracha, H., Iacobacci, C., Hou, X., Wairagkar, M., Fogg, Z., Offenberg, E. C., Hochberg, L. R., Stavisky, S. D., & Brandman, D. M. (2026). Long-term independent use of an intracortical brain–computer interface for speech and cursor control. <i>Nature Medicine, 32</i>, 2504–2510. Published 15 June 2026. [https://doi.org/10.1038/s41591-026-04414-6](https://doi.org/10.1038/s41591-026-04414-6)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-12-02 · Nature Medicine, 2026</i>

这篇论文报告了一名肌萎缩侧索硬化（ALS）患者在家中近两年独立使用一套多模态皮质内脑机接口的过程：通过解码试图说出的语音来交流，并用神经光标完成指向操作，每天只需很少甚至不需要提示性重新校准。

## 背景

<b>脑机接口</b>（BCI）把记录到的脑活动转换成计算机或辅助设备可以使用的指令。<b>皮质内</b>脑机接口把微电极阵列放到皮层里，信号来自附近的神经元，而不是头皮。这样通常能解码得更快、更准，但系统必须能够作为日常工具来佩戴、校准和维护，而不能只停留在实验室演示。

许多需要这类工具的人已经失去了可靠的说话或手部控制，或两者都受到影响。<b>肌萎缩侧索硬化</b>（ALS）是一种神经退行性疾病，会逐渐削弱用于说话和运动的肌肉。到了较晚阶段，患者仍可能尝试说话，但发音已难以听清，这种情况称为<b>构音障碍</b>。眼动追踪或其他残存动作设备可以帮助一部分使用者，可一旦这些残存动作也减退，它们就会变得费力、缓慢，甚至无法使用。

语音脑机接口试图解码伴随“试图说话”的神经活动，并把它变成文字。光标脑机接口则试图解码指向意图，让同一个人能够点击、输入或操作计算机。在实验室里，两类解码器都可以在短时、有提示的任务上表现很好。日常交流则不同：使用者在家里，研究人员不在场，解码器必须在神经记录缓慢漂移时继续工作，而且同一套系统还要同时充当“声音”和“鼠标”。这项研究跟踪的，正是一名在这种真实环境中使用系统的患者。

## 问题

此前的皮质内语音或光标脑机接口，通常需要研究人员在场协助佩戴，或需要频繁重新校准才能避免精度下降，或两者都需要。只有在受过训练的助手在场时才能工作的系统，还不能算日常交流工具。因此，实际问题是长期、独立、多模态的使用：一名有严重构音障碍和瘫痪的人，能否在没有科研团队到场、也无需每天早晨进行长时间提示性校准的情况下，日复一日地在家中同时使用语音解码器和神经光标？

作者在一名被详细记录的参与者身上回答这个问题，测量的不仅是正式抄写任务的准确率，也包括系统在个人交流中的真实使用情况。

## 方法

参与者 T15 是一名 45 岁、患有 ALS 和严重构音障碍的男性，于 2023 年入组 BrainGate2 试验（NCT00912041）。四个 64 通道电极阵列被植入腹侧中央前回，分别位于 55b 区、背侧 6v、4 区和腹侧 6v——这些区域与言语和口面部控制有关。植入体为经皮有线连接。神经特征按解码器需要，以 10–20 毫秒为间隔进行分箱。

在语音方面，一次试图发出的话语被解码为音素概率序列，起初使用循环网络，在植入后第 600 天起改用 Transformer 音素解码器。这些概率每 80 毫秒输出一次，再与语言模型结合，从超过 125,000 个英语单词的词表中选出可能的词序列。语音输出可以用作任何应用程序的键盘输入。另一套循环解码器把神经活动映射为计算机光标，从而让语音和指向可以一起使用，就像键盘和鼠标可以一起使用一样。

![图 1. 多模态皮质内脑机接口的独立使用（Card 等，2026，图 1）。完成每天的准备后，T15 在没有研究人员在场的情况下，于家中使用语音解码器和神经光标。](/img/readApaper-46/home_ibci_fig1.png)

<i>图 1. 多模态皮质内脑机接口的独立使用（Card 等，2026，图 1）。完成每天的准备后，T15 在没有研究人员在场的情况下，于家中使用语音解码器和神经光标。</i>

两个设计选择是为了让系统在没有研究人员时也能使用。第一，语音解码器在 T15 使用过程中<b>于后台持续重新校准</b>，以跟踪神经活动的缓慢变化。第二，任何显式的提示性校准都是可选且简短的：每天开始时由使用者自行决定是否说 0–20 句校准句子。光标校准同样被控制得很短。在试验用器械豁免（IDE）修改并允许完全独立的计算机访问之后，T15 和他的照护者可以在科研团队不在场的情况下，于家中自行启动系统。

## 实验

独立居家使用从植入后第 281 天开始。在此之前，使用仅限于每周 2–4 次由研究人员监督的会话，平均每天 3.7 小时。第 281 天之后，系统在 19 个月里几乎每天都被使用。T15 和照护者报告，每天的准备大约需要 20 分钟，之后他可以连续使用系统长达 19 小时，而无需额外的研究人员支持。

作者同时量化了个人交流和正式任务。个人使用日志记录了使用时长、产生的句子数和词数、语速，以及 T15 自己对每句话是否“至少大体正确”的评分。正式抄写任务测量提示性语音的词正确率，也包括切换到 Transformer 解码器之后的表现。光标表现在结构化网格选择任务中测量，并在部分日子里与同一网格上的注视控制进行比较：一种是每格 0.77 英寸的稠密 14 × 14 网格，另一种是每格 1.79 英寸的较粗 6 × 6 网格。

## 结果

在个人使用会话中，系统累计独立使用了 3,801 小时。T15 一共交流了 183,060 句，合计 1,960,163 个词，平均语速为每分钟 56 词。他把 92% 的句子标记为至少大体解码正确。在对这 183,060 句的更细划分中，53.3% 被完全正确解码，12.9% 由使用者做了修正。摘要把这一时期表述为近两年的居家使用和超过 3,800 小时的独立使用；19 个月指的是第 281 天之后几乎每天使用，而 3,801 小时来自全部个人使用会话。

在正式的提示性抄写任务中，使用这一大词表时词正确率持续高于 99%。第 600 天切换之后，Transformer 语音解码器在抄写任务上达到了 99.2% 的词正确率（125,000 词词表），而且每天只需很少甚至不需要显式重新校准。

![图 2. 语音解码（Card 等，2026，图 2）。在 125,000 词词表的正式抄写任务中，词正确率持续高于 99%；植入后第 600 天引入 Transformer 解码器后达到 99.2%。](/img/readApaper-46/home_ibci_fig2.png)

<i>图 2. 语音解码（Card 等，2026，图 2）。在 125,000 词词表的正式抄写任务中，词正确率持续高于 99%；植入后第 600 天引入 Transformer 解码器后达到 99.2%。</i>

在结构化网格任务评估中，神经光标的吞吐量为 2.90 ± 0.16 比特/秒（均值 ± 标准差）。这个数字是结构化神经网格任务的结果，并不是在稠密 14 × 14 网格上与注视控制的对比。在该小格 14 × 14 网格上，注视控制达到 0.80 ± 0.33 比特/秒。在较大格子的 6 × 6 网格上，神经光标为 1.67 ± 0.21 比特/秒，注视控制为 2.59 ± 0.26 比特/秒。光标在许多个月里都可以在几分钟或更短时间内完成校准；在后来的量化中，每天的光标校准总时长为 9.2 ± 5.9 分钟，同时表现得到保持或提高。

![图 3. 用光标脑机接口进行计算机控制（Card 等，2026，图 3）。在结构化网格任务评估中，神经光标达到 2.90 ± 0.16 比特/秒；14 × 14 和 6 × 6 网格上的注视与神经吞吐量分开给出，并取决于格子大小。](/img/readApaper-46/home_ibci_fig3.png)

<i>图 3. 用光标脑机接口进行计算机控制（Card 等，2026，图 3）。在结构化网格任务评估中，神经光标达到 2.90 ± 0.16 比特/秒；14 × 14 和 6 × 6 网格上的注视与神经吞吐量分开给出，并取决于格子大小。</i>

使用并不限于类似实验室的抄写任务。T15 把语音当作键盘输入、把光标当作鼠标，用于日常计算机访问；在 3,801 个个人使用小时中的时间分布显示，早晨准备之后还有长时间的自主使用。

![图 4. 神经稳定性（Card 等，2026，图 4）。在长期居家使用中，后台重新校准以及可选的短时提示性校准（由使用者自行决定每天 0–20 句）被用来跟踪神经活动的缓慢变化。](/img/readApaper-46/home_ibci_fig4.png)

<i>图 4. 神经稳定性（Card 等，2026，图 4）。在长期居家使用中，后台重新校准以及可选的短时提示性校准（由使用者自行决定每天 0–20 句）被用来跟踪神经活动的缓慢变化。</i>

## 分析

这项研究的核心结果不是某一个实验室分数，而是一套被记录下来的每日、无监督使用模式。一名 ALS 患者以每分钟 56 词的速度写出了近两百万个词，把大多数句子评为至少大体正确，并且在正式测试中，在非常大的词表上超过了 99% 的词正确率。后台重新校准、可选的短时提示性校准，以及照护者约 20 分钟的准备，足以让这一表现在一天中持续长达 19 小时。

多模态设计对解读很重要。语音和光标不是相互竞争的演示，而是作为互补输入来使用，这更接近计算机的真实操作方式。网格任务的数字也需要按各自条件来读：作为标题数字的 2.90 ± 0.16 比特/秒描述的是结构化神经光标评估，而与注视的直接比较则取决于格子大小。在稠密的 14 × 14 网格上，注视相对较慢；在较粗的 6 × 6 网格上，注视比神经光标更快。因此，论文支持神经指向在结构化任务中具有高吞吐量，但并不声称神经光标在每一种布局上都超过注视。

第 600 天的解码器更换也提醒我们，“这套系统”并不是固定不变的。Transformer 把抄写任务的词正确率提高到了 99.2%，但长期使用记录中已经包含了此前许多个月基于循环网络的解码。这两个阶段同属于一个独立使用的故事：一套可以在没有研究人员的情况下启动的家用系统，并且在算法改进后仍然继续被使用。

## 总结

在一名 ALS 患者中，腹侧中央前回的四个阵列支持了多年独立的居家语音-光标脑机接口使用。第 281 天之后，19 个月里几乎每天的使用产生了 3,801 小时个人会话、183,060 句和 1,960,163 个词，平均每分钟 56 词；92% 的句子被评为至少大体正确，抄写任务准确率高于 99%，在 Transformer 解码器和 125,000 词词表下达到 99.2%。每天准备约 20 分钟；显式语音校准若使用则为 0–20 句；神经光标在结构化网格评估中达到 2.90 ± 0.16 比特/秒。

## 参考文献

Card, N. S., Singer-Clark, T., Peracha, H., Iacobacci, C., Hou, X., Wairagkar, M., Fogg, Z., Offenberg, E. C., Hochberg, L. R., Stavisky, S. D., & Brandman, D. M. (2026). Long-term independent use of an intracortical brain–computer interface for speech and cursor control. <i>Nature Medicine, 32</i>, 2504–2510. Published 15 June 2026. [https://doi.org/10.1038/s41591-026-04414-6](https://doi.org/10.1038/s41591-026-04414-6)
