---
title: "readApaper#37 High-performance brain-to-text communication via handwriting"
title_zh: "readApaper#37 High-performance brain-to-text communication via handwriting"
date: 2026-11-23 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - machine-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 23 November 2026 · Nature, 2021</i>

This paper shows that attempted handwriting, recorded from motor cortex in one person with spinal cord injury, can be turned into text in real time—fast enough to approach typical smartphone typing speeds in his age group.

## Background

A <b>brain–computer interface</b> (BCI) reads brain activity and turns it into a command or a message, so a person can act or communicate without using their muscles in the usual way. This matters for people who have lost the ability to move or speak, for example after a high spinal cord injury, a brainstem stroke, or late-stage ALS. When nearly all voluntary muscles are paralyzed, even simple typing can become extremely slow or impossible.

Many communication BCIs have focused on relatively large, simple movements: reaching and grasping, or moving a computer cursor and clicking on letters. In a <b>point-and-click</b> speller, the person steers a cursor to a key, selects it, and then moves to the next key. That works, but each letter costs a complete aiming movement. In a prior intracortical study used here as a comparison, the best reported point-and-click rate was 40 characters per minute (Pandarinath et al., 2017).

Handwriting is a different kind of motor skill. Each letter is a short, shaped trajectory, and letters can be produced in a rapid sequence. If the brain still represents those intended pen movements after paralysis, a decoder might identify letters from neural activity more quickly than it can drive a cursor from key to key.

The recordings come from <b>motor cortex</b>, specifically the hand “knob” of the <b>precentral gyrus</b>—a region involved in preparing and controlling hand movements. After paralysis, this area can still carry the intention to move. The authors ask whether that remains true for a fast, highly dexterous skill such as handwriting, years after injury.

It is important to be precise about what is being decoded. The participant is not having arbitrary thoughts read out. He is asked to <b>attempt handwriting</b>: to try to write as if his hand were not paralyzed, imagining that he is holding a pen on a piece of ruled paper. The interface translates those attempted writing movements into text. It does not read silent speech, inner monologue, or whatever else he might be thinking.

<b>Intracortical</b> here means the electrodes sit in the cortex itself. Two 96-electrode arrays were placed in the left (dominant) hand knob. Each electrode can pick up nearby neural spikes. The paper uses <b>multiunit threshold crossings</b>: brief voltage events that cross a threshold, counted in short time bins as a measure of local firing.

## Problem

The practical problem is speed and ease of communication. Existing intracortical point-and-click typers had not exceeded 40 characters per minute. Many other spellers are slower still, or they depend on flashing visual targets that occupy the eyes and are not fully self-paced.

The scientific problem underneath is whether rapid, dexterous attempted handwriting is still encoded clearly enough, years after paralysis, to support real-time text. If the neural patterns of different letters are distinct, a decoder might classify them directly instead of reconstructing a two-dimensional cursor path and waiting for a click.

Two technical difficulties follow. First, because the participant’s hand was paralyzed, the researchers could not see when each letter started and ended in the training data, so they could not simply pair neural snippets with letter labels in the usual supervised way. Second, the amount of data was modest by the standards of recurrent neural networks, so the model could easily overfit—that is, memorize the training sentences instead of learning to decode new ones.

## Method

The decoder is a <b>recurrent neural network</b> (RNN): a model that takes a sequence of inputs and keeps an internal memory of what has just happened, which is useful when letters unfold over time. The authors used a two-layer <b>gated recurrent unit</b> (GRU) network, a common RNN design that is good at keeping useful information over short stretches of time. Neural activity on each electrode was binned and smoothed in 20-millisecond steps. The network turned this time series into, at each moment, a probability for each of 31 characters and a “new character” probability that rises when a new letter appears to begin. The top layer ran more slowly, and the network updated its outputs every 100 milliseconds. A one-second output delay gave the network time to see a whole character before naming it.

For real-time use, those probabilities were thresholded. When the new-character probability crossed a threshold at time <i>t</i>, the most likely character at <i>t</i> + 0.3 seconds was printed on the screen. This is the <b>raw online output</b>. Separately, and only offline, a large-vocabulary <b>language model</b> (a custom 50,000-word bigram model, which scores how often one word follows another) could be applied to the same probabilities, like an autocorrect. A further offline analysis trained a <b>bidirectional</b> RNN that could look at an entire sentence at once, which is not how a live letter-by-letter interface works.

The character set had 31 symbols: the 26 lowercase English letters, plus comma, apostrophe, question mark, period (written as “\~”) and space (written as “>”). The participant printed each character, not in cursive, and stacked each new character on top of the previous one, as if writing in place.

To train the network despite unknown letter timings, the authors adapted methods from speech recognition. They built templates from isolated letters, used hidden Markov models to estimate when each letter occurred in a sentence, and cut and rearranged neural snippets to make synthetic training sentences. A day-specific affine transform—a simple linear adjustment of the neural features—helped the same network absorb day-to-day changes in the recordings.

## Experiments

All results come from one participant, identified as T5: a right-handed man, 65 years old at the time of data collection, with a C4 AIS-C spinal cord injury. He was paralyzed from the neck down; hand movements were limited to twitching and micromotion. The arrays had been implanted in August 2016; the sessions reported here were collected about 994 to 1,246 days after implant.

In isolated-character sessions, T5 attempted one character at a time from an on-screen prompt. These data were used to visualize neural patterns, reconstruct pen trajectories, and test offline classification.

In <b>copy typing</b>, T5 copied sentences shown on the screen, letter by letter, at his own pace, while decoded characters appeared in real time (after an estimated delay of 0.4–0.7 seconds once a character was completed). Evaluation ran over five days, each with four blocks of 7–10 sentences the decoder had never been trained on. Before the first evaluation day, 242 sentences from three pilot days were used for training. On later days, additional calibration sentences were collected, reaching 572 training sentences by the last day (7.3 hours, 30.4 thousand characters). There was no backspace; if a letter was wrong, he was asked to keep going.

In <b>free typing</b>, on two further days, T5 used the same interface to type answers to open-ended questions, so the sentences were self-generated rather than copied.

The main speed metric is characters per minute. The main accuracy metric is <b>character error rate</b>, the edit distance—insertions, deletions, and substitutions needed to match the intended text—divided by the number of characters. <b>Word error rate</b> counts a word as wrong if any of its characters is wrong, so it is typically higher. The headline online numbers are the raw, thresholded output. Language-model and bidirectional-RNN numbers are offline analyses.

The authors also compared, in a controlled analysis, 16 letters with 16 attempted straight-line movements, to test whether temporally richer letter trajectories are easier to tell apart than the point-to-point motions a cursor decoder relies on.

## Results

### Neural patterns of attempted letters

The activity associated with each letter was strong and repeatable. After aligning trials in time, each character had a distinctive pattern. A linear decoder, trained with each character held out, could reconstruct recognizable pen-tip trajectories from trial-averaged activity; the neural dimensions related to pen-tip velocity accounted for 30% of the total variance. A two-dimensional visualization (t-SNE) showed tight clusters, with letters that are written similarly sitting closer together. An offline k-nearest-neighbor classifier identified isolated characters with 94.1% accuracy (95% CI 92.6–95.8). This 94.1% is a letter-classification result on isolated characters, not the later sentence-typing accuracy.

![Figure 1. Neural patterns of attempted handwriting. (A) Participant T5 attempted one character at a time, following an on-screen prompt. (B) The top three principal components of neural activity for the letters d, e and m, each repeated 27 times. (C) After time-warping to remove changes in writing speed, each letter has a consistent, distinctive pattern. (D) Intended pen-tip velocity, linearly decoded from neural activity with each character held out, yields recognizable letter shapes; orange circles mark the start of each trajectory. (E) A t-SNE map of single trials: similarly written characters lie closer together. From Willett et al., 2021, Figure 1.](/img/readApaper-37/p37_fig1_en.png)

<i>Figure 1. Neural patterns of attempted handwriting. (A) Participant T5 attempted one character at a time, following an on-screen prompt. (B) The top three principal components of neural activity for the letters d, e and m, each repeated 27 times. (C) After time-warping to remove changes in writing speed, each letter has a consistent, distinctive pattern. (D) Intended pen-tip velocity, linearly decoded from neural activity with each character held out, yields recognizable letter shapes; orange circles mark the start of each trajectory. (E) A t-SNE map of single trials: similarly written characters lie closer together. From Willett et al., 2021, Figure 1.</i>

### Real-time copy typing

On held-out sentences, raw online decoding was already readable. Typing speed plateaued at 90 characters per minute, with a 5.4% character error rate on those later blocks (the average of the last day’s points in Figure 2c). Across all five evaluation days, the raw online character error rate was 5.9% (95% CI 5.3–6.5). That is the 94.1% raw online accuracy reported in the abstract: 100% minus 5.9%. The corresponding word error rate was 25.1%.

When a language model was applied offline to the same online probabilities, the character error rate fell to 0.89% (95% CI 0.61–1.2) and the word error rate to 3.4% (2.5–4.4)—greater than 99% character accuracy after this simulated autocorrect. A fully offline bidirectional RNN plus language model reached a 0.17% character error rate, a performance ceiling that would not provide letter-by-letter feedback.

The 90-character-per-minute rate can be compared with typical smartphone typing in the participant’s age group (115 characters per minute; Palin et al., 2018) and with the prior intracortical point-and-click record of 40 characters per minute (Pandarinath et al., 2017).

| Decoder | Character error rate [95% CI] | Word error rate [95% CI] |
| --- | --- | --- |
| Raw online output | 5.9% [5.3, 6.5] | 25.1% [22.5, 27.4] |
| Online output + offline language model | 0.89% [0.61, 1.2] | 3.4% [2.5, 4.4] |
| Offline bidirectional RNN + language model | 0.17% [0, 0.36] | 1.5% [0, 3.2] |

Mean error rates across all five copy-typing days (Willett et al., 2021, Table 1). The abstract’s 94.1% raw online accuracy is 100% minus the 5.9% character error rate.

![Figure 2. Real-time decoding of attempted handwriting. (A) Neural activity is binned every 20 ms and passed through an RNN that outputs character probabilities and a “new character” signal; thresholding those probabilities produces the raw online text, while a language model can be applied offline. (B) Two example held-out sentences: raw output is already understandable, with errors marked in red and spaces shown as “>”. (C) Over five days, copy-typing speed plateaus at 90 characters per minute, more than twice the prior intracortical point-and-click rate; open squares show lower error rates after the offline language model. From Willett et al., 2021, Figure 2.](/img/readApaper-37/p37_fig2_en.png)

<i>Figure 2. Real-time decoding of attempted handwriting. (A) Neural activity is binned every 20 ms and passed through an RNN that outputs character probabilities and a “new character” signal; thresholding those probabilities produces the raw online text, while a language model can be applied offline. (B) Two example held-out sentences: raw output is already understandable, with errors marked in red and spaces shown as “>”. (C) Over five days, copy-typing speed plateaus at 90 characters per minute, more than twice the prior intracortical point-and-click rate; open squares show lower error rates after the offline language model. From Willett et al., 2021, Figure 2.</i>

### Free typing

When T5 answered open-ended questions, the rate was 73.8 characters per minute, with an 8.54% raw online character error rate and 2.25% after the offline language model. The previous state of the art for free typing with an intracortical BCI was 24.4 correct characters per minute (Pandarinath et al., 2017).

### Retraining with less daily data

The online results above used about 50 calibration sentences each day. Offline simulations of the copy-typing data found that 10 sentences (8.7 minutes) yielded an 8.5% raw error rate (1.7% with a language model), while 30 sentences were needed to match the 5.9% raw online rate. When sessions were only 2–7 days apart, even no retraining gave an 11.1% raw error rate (1.5% with a language model). Unsupervised retraining that used a language model to correct and update the decoder reached 7.3% raw error (0.84% with a language model) for sessions separated by 7 days or less. Neural patterns for each character were relatively stable over a week (mean correlation 0.85 when sessions were 7 days apart or less). These retraining numbers are offline simulations, not new online tests.

![Figure 3. Performance when daily retraining is shortened or left unsupervised. (A) Offline simulations reduce the original 50 calibration sentences: 10 sentences already reach a low language-model-corrected error rate, while 30 sentences are needed to match the 5.9% raw online rate. Lines are means; shading is 95% confidence intervals. (B) When two sessions are closer in time, less calibration is required; unsupervised retraining also keeps error rates low if the gap is 7 days or less. From Willett et al., 2021, Figure 3.](/img/readApaper-37/p37_fig3_en.png)

<i>Figure 3. Performance when daily retraining is shortened or left unsupervised. (A) Offline simulations reduce the original 50 calibration sentences: 10 sentences already reach a low language-model-corrected error rate, while 30 sentences are needed to match the 5.9% raw online rate. Lines are means; shading is 95% confidence intervals. (B) When two sessions are closer in time, less calibration is required; unsupervised retraining also keeps error rates low if the gap is 7 days or less. From Willett et al., 2021, Figure 3.</i>

## Analysis

The 90-character-per-minute copy-typing rate, and the 94.1% raw online accuracy averaged across the five copy days, describe real-time performance in one person, T5, writing prompted sentences. The jump to greater than 99% character accuracy comes from an offline language model, not from what appeared on the screen during the session. Free typing, which is closer to everyday use, was slower and had a higher raw error rate, though it still far exceeded the previous intracortical free-typing benchmark.

The comparison with cursor typing is about more than practice or motivation. In point-and-click BCIs, speed is raised by turning up cursor gain until decoding errors make the cursor hard to control. Handwritten letters, the authors argue, may simply be easier to tell apart, because they have richer time-varying shapes than straight point-to-point movements.

They tested this with 16 letters and 16 straight-line movements. Nearest-neighbor distances between neural patterns were 72% larger for letters than for lines (95% CI 60–86%). Spatial dimensionality was only modestly higher for letters (1.24 times; 95% CI 1.19–1.30), but temporal dimensionality was 2.65 times higher (2.58–2.72). In a small toy model, adding a bend in time was enough to push trajectories farther apart and improve classification when noise was high. This is a reason handwriting may be fundamentally easier to decode than cursor-like point-to-point motion; the authors treat it as one important factor, not necessarily the only one.

![Figure 4. Why temporally rich movements can be easier to decode. (A, B) Neural patterns for 16 handwritten characters are compared with 16 straight-line movements. (C) Letters have larger nearest-neighbor distances, so they are less easily confused. (D) In a noise simulation, letters remain easier to classify. (E) Spatial dimensionality is similar, but temporal dimensionality is more than twice as high for letters. (F–H) A toy example with two hypothetical neurons: adding a bend in time increases nearest-neighbor distances and classification accuracy. From Willett et al., 2021, Figure 4.](/img/readApaper-37/p37_fig4_en.png)

<i>Figure 4. Why temporally rich movements can be easier to decode. (A, B) Neural patterns for 16 handwritten characters are compared with 16 straight-line movements. (C) Letters have larger nearest-neighbor distances, so they are less easily confused. (D) In a noise simulation, letters remain easier to classify. (E) Spatial dimensionality is similar, but temporal dimensionality is more than twice as high for letters. (F–H) A toy example with two hypothetical neurons: adding a bend in time increases nearest-neighbor distances and classification accuracy. From Willett et al., 2021, Figure 4.</i>

What the evidence supports, then, is this: years after paralysis, attempted handwriting in this participant’s motor cortex is still richly patterned; those patterns can be decoded, letter by letter, into general-purpose text in real time; and the geometry of those patterns helps explain why this approach can outrun a two-dimensional cursor.

## Summary

- In one participant with cervical spinal cord injury, attempted handwriting—not the readout of arbitrary thoughts—was decoded from motor cortex and turned into text in real time.
- On copy-typing days, speed plateaued at 90 characters per minute. Raw online accuracy across five days was 94.1% (a 5.9% character error rate). An offline language model raised character accuracy above 99% (0.89% character error rate).
- Free answers to open-ended questions reached 73.8 characters per minute, with 8.54% raw and 2.25% language-model-corrected character error rates.
- Letters were more separable than straight-line movements, largely because their neural patterns varied more over time, which helps explain why handwriting can be easier to decode than point-and-click cursor typing.

---

## References and resources

- Willett, F. R., Avansino, D. T., Hochberg, L. R., Henderson, J. M., & Shenoy, K. V. (2021). <i>High-performance brain-to-text communication via handwriting.</i> Nature, 593(7858), 249–254. [doi.org/10.1038/s41586-021-03506-2](https://doi.org/10.1038/s41586-021-03506-2) · [Publisher](https://www.nature.com/articles/s41586-021-03506-2) · [PMC author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC8163299/)
- Pandarinath, C., et al. (2017). <i>High performance communication by people with paralysis using an intracortical brain-computer interface.</i> eLife, 6, e18554. [doi.org/10.7554/eLife.18554](https://doi.org/10.7554/eLife.18554)
- Palin, K., Feit, A. M., Kim, S., Kristensson, P. O., & Oulasvirta, A. (2018). <i>How do people type on mobile devices? Observations from a study with 37,000 volunteers.</i> In Proceedings of the 21st International Conference on Human-Computer Interaction with Mobile Devices and Services. [doi.org/10.1145/3229434.3229445](https://doi.org/10.1145/3229434.3229445)
- Data: Dryad, [doi.org/10.5061/dryad.wh70rxwmv](https://doi.org/10.5061/dryad.wh70rxwmv). Offline decoding code: [github.com/fwillett/handwritingBCI](https://github.com/fwillett/handwritingBCI).
- Figures 1–4 are from Willett et al. (2021).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-11-23 · Nature, 2021</i>

这篇论文表明，在一名脊髓损伤患者的运动皮层中记录“试图手写”的神经活动，可以实时转换成文字，速度已经接近他这个年龄段的典型手机打字速度。

## 背景

<b>脑机接口</b>（BCI）读取脑活动，并把它变成指令或文字，让人不必按通常方式使用肌肉，也能行动或交流。这对因高位脊髓损伤、脑干卒中或晚期渐冻症（ALS）而失去运动或言语能力的人尤其重要。当几乎所有随意肌都瘫痪时，连简单打字也会变得极慢，甚至无法完成。

许多用于交流的脑机接口，关注的是比较大、也比较简单的动作：伸手抓握，或者移动电脑光标再点击字母。在<b>指向并点击</b>的拼写方式里，使用者要把光标移到一个键上，选中它，再移向下一个键。这是可行的，但每个字母都要完成一次瞄准。本文用来对比的一项先前皮层内研究中，报道过的最高指向并点击速度是每分钟 40 个字符（Pandarinath 等，2017）。

手写是另一种运动技能。每个字母都是一段短暂而有形状的轨迹，而且可以快速连续写出。如果瘫痪之后，大脑仍然保留这些预期的笔尖运动，解码器也许能直接从神经活动中识别字母，而不必再一格一格地驱动光标。

本文的记录来自<b>运动皮层</b>，具体是<b>中央前回</b>上的手区“旋钮”部位——这块区域参与准备和控制手部动作。瘫痪之后，这里仍然可以携带运动意图。作者想知道的是：在受伤多年以后，这种快速、高灵活性的手写技能，是否也仍然被清晰地编码。

需要先说清楚，这里解码的是什么。系统并不是在读取任意想法。被试被要求<b>试图手写</b>：假设手没有瘫痪，想象自己握着笔，在横格纸上书写。接口把这些试图写出的动作翻译成文字，并不读取默读、内心独白，或其他正在想的内容。

这里的<b>皮层内</b>，指电极直接放在皮层里。两枚 96 通道电极阵列被植入左侧（优势侧）手区旋钮。每根电极可以拾取附近神经元的放电。论文使用的是<b>多单元阈值穿越</b>：把短暂越过阈值的电压事件，在短时间窗里计数，作为局部放电的指标。

## 问题

实际要解决的，是交流的速度和便利。已有的皮层内指向并点击系统，还没有超过每分钟 40 个字符。许多其他拼写器更慢，或者依赖闪烁的视觉目标，既占用眼睛，也不能完全由使用者自己掌握节奏。

背后的科学问题是：在瘫痪多年之后，快速而精细的试图手写，是否仍然被编码得足够清楚，可以支持实时文字输出。如果不同字母的神经模式彼此分明，解码器也许能直接分类字母，而不必先重建二维光标轨迹，再等待一次点击。

接下来还有两个技术难点。第一，被试的手已经瘫痪，研究者在训练数据里看不到每个字母何时开始、何时结束，因此不能按通常的监督学习方式，把一段神经活动和一个字母标签直接配对。第二，数据量以循环神经网络的标准来看并不大，模型很容易过拟合，也就是把训练句子记住，而不是学会解码新句子。

## 方法

解码器是一个<b>循环神经网络</b>（RNN）：它接收一串按时间排列的输入，并保留对刚刚发生之事的内部记忆，这正好适合字母随时间展开的过程。作者使用了两层<b>门控循环单元</b>（GRU）网络，这是一种常见的 RNN 结构，擅长在较短时间里保存有用信息。每根电极上的神经活动按 20 毫秒分箱并平滑。网络在每一时刻输出 31 个字符各自的概率，以及一个“新字符”概率——当新字母似乎开始时，这个量会升高。上层运行得更慢，网络每 100 毫秒更新一次输出。输出还带有 1 秒延迟，好让网络看完整一个字符再给出判断。

实时使用时，这些概率会被阈值化。当“新字符”概率在时刻 <i>t</i> 越过阈值，系统就把 <i>t</i> + 0.3 秒时最可能的那个字符显示到屏幕上。这就是<b>原始在线输出</b>。另外，只在离线条件下，可以用一个大词表<b>语言模型</b>（自定义的 5 万词二元模型，用来评价一个词紧跟另一个词的常见程度）处理同一组概率，相当于自动纠错。还有一项离线分析训练了<b>双向</b> RNN，可以一次看到整句，这并不是逐字母实时界面的工作方式。

字符集共 31 个符号：26 个小写英文字母，再加上逗号、撇号、问号、句号（写成“\~”）和空格（写成“>”）。被试用印刷体书写，而不是连写，并且把每个新字符叠写在前一个字符上面，相当于在原地写字。

由于不知道每个字母的起止时间，作者借鉴了语音识别的方法：用单字母数据建立模板，再用隐马尔可夫模型估计句子中每个字母出现的时刻，并把神经片段剪开、重新排列，做成合成训练句子。每天还有一个特有的仿射变换——对神经特征做一次简单的线性调整——帮助同一个网络适应逐日变化的记录。

## 实验

全部结果来自一名被试，编号为 T5：数据采集时 65 岁，右利手，C4 AIS-C 级脊髓损伤。他颈部以下瘫痪，手部动作仅限于抽动和微动。电极阵列于 2016 年 8 月植入；本文报告的场次大约在植入后第 994 到 1246 天采集。

在单字符场次中，T5 按照屏幕提示一次试图写一个字符。这些数据用来观察神经模式、重建笔尖轨迹，并做离线分类。

在<b>抄写</b>任务中，T5 按照自己的节奏，逐字母抄写屏幕上的句子，解码出的字符会实时出现在屏幕上（一个字符完成后，估计还有 0.4–0.7 秒延迟）。评估共进行 5 天，每天 4 个区组，每个区组 7–10 句解码器从未训练过的句子。第一次评估之前，先用 3 个预实验日的 242 句训练；之后每天再采集校准句子，到最后一天一共有 572 句训练数据（7.3 小时，3.04 万个字符）。系统没有退格键；如果解错了，他被要求继续往下写。

在<b>自由回答</b>任务中，另外两天里，T5 用同一套接口回答开放式问题，句子是自己组织的，而不是抄写提示。

主要速度指标是每分钟字符数。主要准确率指标是<b>字符错误率</b>，也就是把输出改成目标文本所需的插入、删除和替换次数，再除以字符数。<b>词错误率</b>则是：一个词里只要有任何字符出错，整个词就算错，所以通常更高。文中突出报道的在线数字，都来自原始的阈值输出。语言模型和双向 RNN 的数字，属于离线分析。

作者还做了一项对照分析，比较 16 个字母和 16 种试图画直线的动作，检验时间上更丰富的字母轨迹，是否比光标解码所依赖的点对点运动更容易区分。

## 结果

### 试图手写字母的神经模式

每个字母对应的活动都强，而且可以重复。把多次试验在时间上对齐之后，每个字符都有独特的模式。一个线性解码器在每次都留出一个字符做检验时，仍能从平均后的神经活动中重建出可辨认的笔尖轨迹；与笔尖速度有关的神经维度，占全部方差的 30%。二维可视化（t-SNE）显示出紧密的簇，写法相近的字母靠得更近。离线的 k 近邻分类器识别单字符的准确率是 94.1%（95% 置信区间 92.6–95.8）。这个 94.1% 是单字符分类结果，不是后面整句打字的准确率。

![图 1. 试图手写的神经表征。(A) 被试 T5 按照屏幕提示，一次试图写一个字符。(B) 字母 d、e、m 的神经活动前三个主成分，每个字母重复 27 次。(C) 用时间扭曲去掉书写速度变化后，每个字母都有稳定而独特的模式。(D) 在每次留出一个字符的交叉验证下，从神经活动中线性解码出的预期笔尖速度，可以形成可辨认的字母形状；橙色圆点标记轨迹起点。(E) 单次试验的 t-SNE 图：写法相近的字符离得更近。取自 Willett 等，2021，Figure 1。](/img/readApaper-37/p37_fig1_en.png)

<i>图 1. 试图手写的神经表征。(A) 被试 T5 按照屏幕提示，一次试图写一个字符。(B) 字母 d、e、m 的神经活动前三个主成分，每个字母重复 27 次。(C) 用时间扭曲去掉书写速度变化后，每个字母都有稳定而独特的模式。(D) 在每次留出一个字符的交叉验证下，从神经活动中线性解码出的预期笔尖速度，可以形成可辨认的字母形状；橙色圆点标记轨迹起点。(E) 单次试验的 t-SNE 图：写法相近的字符离得更近。取自 Willett 等，2021，Figure 1。</i>

### 实时抄写

在从未训练过的句子上，原始在线解码已经可读。打字速度后来稳定在每分钟 90 个字符，这些较后区组的字符错误率是 5.4%（图 2c 中最后一天各点的平均值）。把 5 个评估日合在一起，原始在线字符错误率是 5.9%（95% 置信区间 5.3–6.5）。摘要里所说的 94.1% 原始在线准确率，就是 100% 减去 5.9%。对应的词错误率是 25.1%。

如果把语言模型离线加到同一组在线概率上，字符错误率降到 0.89%（95% 置信区间 0.61–1.2），词错误率降到 3.4%（2.5–4.4）——也就是这种模拟自动纠错之后，字符准确率高于 99%。完全离线的双向 RNN 再加上语言模型，字符错误率可以到 0.17%。这是表现的上限，但不能提供逐字母的实时反馈。

每分钟 90 个字符，可以和被试年龄段的典型手机打字速度（每分钟 115 个字符；Palin 等，2018）以及此前皮层内指向并点击的最高纪录（每分钟 40 个字符；Pandarinath 等，2017）对照来看。

| 解码方式 | 字符错误率 [95% 置信区间] | 词错误率 [95% 置信区间] |
| --- | --- | --- |
| 原始在线输出 | 5.9% [5.3, 6.5] | 25.1% [22.5, 27.4] |
| 在线输出 + 离线语言模型 | 0.89% [0.61, 1.2] | 3.4% [2.5, 4.4] |
| 离线双向 RNN + 语言模型 | 0.17% [0, 0.36] | 1.5% [0, 3.2] |

五个抄写评估日的平均错误率（Willett 等，2021，Table 1）。摘要中 94.1% 的原始在线准确率，等于 100% 减去 5.9% 的字符错误率。

![图 2. 试图手写的实时解码。(A) 神经活动每 20 毫秒分箱，进入 RNN，输出各字符概率和“新字符”信号；对这些概率做阈值处理，就得到原始在线文字，语言模型则可在离线时使用。(B) 两句从未训练过的例子：原始输出已经能读懂，错误标红，空格写成“>”。(C) 在 5 天里，抄写速度稳定在每分钟 90 个字符，超过先前皮层内指向并点击速度的两倍；空心方块是离线语言模型之后更低的错误率。取自 Willett 等，2021，Figure 2。](/img/readApaper-37/p37_fig2_en.png)

<i>图 2. 试图手写的实时解码。(A) 神经活动每 20 毫秒分箱，进入 RNN，输出各字符概率和“新字符”信号；对这些概率做阈值处理，就得到原始在线文字，语言模型则可在离线时使用。(B) 两句从未训练过的例子：原始输出已经能读懂，错误标红，空格写成“>”。(C) 在 5 天里，抄写速度稳定在每分钟 90 个字符，超过先前皮层内指向并点击速度的两倍；空心方块是离线语言模型之后更低的错误率。取自 Willett 等，2021，Figure 2。</i>

### 自由回答

当 T5 回答开放式问题时，速度是每分钟 73.8 个字符，原始在线字符错误率 8.54%，离线语言模型之后为 2.25%。此前皮层内脑机接口自由打字的最好纪录，是每分钟 24.4 个正确字符（Pandarinath 等，2017）。

### 减少每日重新训练时的表现

上面的在线结果，每天大约使用 50 句校准句子。对抄写数据的离线模拟显示：10 句（8.7 分钟）就能把原始错误率做到 8.5%（加语言模型后为 1.7%）；要达到 5.9% 的原始在线错误率，则需要 30 句。如果两场之间只隔 2–7 天，即使完全不重新训练，原始错误率也是 11.1%（加语言模型后为 1.5%）。用语言模型纠错后再更新解码器的无监督再训练，在间隔不超过 7 天时，原始错误率为 7.3%（加语言模型后为 0.84%）。每个字符的神经模式在一周内相对稳定（间隔 7 天或更短时，平均相关为 0.85）。这些再训练数字都是离线模拟，不是新的在线测试。

![图 3. 缩短每日再训练、或改为无监督再训练时的表现。(A) 离线模拟减少原来的 50 句校准句子：10 句已经能把语言模型校正后的错误率降到很低，要达到 5.9% 的原始在线错误率则需要 30 句。线为均值，阴影为 95% 置信区间。(B) 两场相隔越近，需要的校准数据越少；如果间隔不超过 7 天，无监督再训练也能把错误率保持在较低水平。取自 Willett 等，2021，Figure 3。](/img/readApaper-37/p37_fig3_en.png)

<i>图 3. 缩短每日再训练、或改为无监督再训练时的表现。(A) 离线模拟减少原来的 50 句校准句子：10 句已经能把语言模型校正后的错误率降到很低，要达到 5.9% 的原始在线错误率则需要 30 句。线为均值，阴影为 95% 置信区间。(B) 两场相隔越近，需要的校准数据越少；如果间隔不超过 7 天，无监督再训练也能把错误率保持在较低水平。取自 Willett 等，2021，Figure 3。</i>

## 分析

每分钟 90 个字符的抄写速度，以及 5 个抄写日平均得到的 94.1% 原始在线准确率，描述的是一名被试 T5 在实时条件下抄写提示句子的表现。提高到 99% 以上的字符准确率，来自离线语言模型，并不是当时屏幕上出现的结果。更接近日常使用的自由回答更慢，原始错误率也更高，但仍然远超此前皮层内自由打字的基准。

和光标打字的对比，不只是练习或动机的问题。在指向并点击的脑机接口里，人们通常靠提高光标增益来加快速度，直到解码误差让光标难以控制。作者认为，手写字母可能本来就更容易区分，因为它们在时间上的形状变化，比直线式的点对点运动更丰富。

他们用 16 个字母和 16 种直线动作做了检验。字母神经模式的最近邻距离，比直线大 72%（95% 置信区间 60–86%）。空间维度只略高（1.24 倍；95% 置信区间 1.19–1.30），但时间维度是直线的 2.65 倍（2.58–2.72）。在一个小型示意模型里，只要在时间上增加一个弯折，轨迹就会彼此分开，并在噪声较大时提高分类准确率。这是手写可能比光标那样的点对点运动更易解码的一个原因；作者把它看作重要因素之一，而不一定是唯一因素。

![图 4. 为什么时间上更丰富的动作可能更容易解码。(A, B) 比较 16 个手写字符和 16 种直线动作的神经模式。(C) 字母的最近邻距离更大，因此更不容易被混淆。(D) 在噪声模拟中，字母仍然更容易分类。(E) 空间维度相近，但字母的时间维度高出一倍以上。(F–H) 用两个假设神经元做的示意：在时间上加一个弯折，就能增大最近邻距离并提高分类准确率。取自 Willett 等，2021，Figure 4。](/img/readApaper-37/p37_fig4_en.png)

<i>图 4. 为什么时间上更丰富的动作可能更容易解码。(A, B) 比较 16 个手写字符和 16 种直线动作的神经模式。(C) 字母的最近邻距离更大，因此更不容易被混淆。(D) 在噪声模拟中，字母仍然更容易分类。(E) 空间维度相近，但字母的时间维度高出一倍以上。(F–H) 用两个假设神经元做的示意：在时间上加一个弯折，就能增大最近邻距离并提高分类准确率。取自 Willett 等，2021，Figure 4。</i>

现有证据能够支持的是：在瘫痪多年之后，这名被试运动皮层中的试图手写仍然具有丰富而可分的模式；这些模式可以按字母实时解码成通用文本；而这些模式的几何结构，也有助于说明为什么这条路可以快过二维光标。

## 总结

- 在一名颈髓损伤被试中，从运动皮层解码的是试图手写，而不是任意想法，并被实时转换成文字。
- 抄写时，速度稳定在每分钟 90 个字符。五个评估日的原始在线准确率是 94.1%（字符错误率 5.9%）。离线语言模型把字符准确率提高到 99% 以上（字符错误率 0.89%）。
- 对开放式问题的自由回答达到每分钟 73.8 个字符，原始字符错误率 8.54%，语言模型校正后为 2.25%。
- 字母比直线运动更容易分开，主要是因为它们的神经模式在时间上变化更多，这有助于说明为什么手写可能比指向并点击的光标打字更容易解码。

---

## 参考资料

- Willett, F. R., Avansino, D. T., Hochberg, L. R., Henderson, J. M., & Shenoy, K. V. (2021). <i>High-performance brain-to-text communication via handwriting.</i> Nature, 593(7858), 249–254。[doi.org/10.1038/s41586-021-03506-2](https://doi.org/10.1038/s41586-021-03506-2) · [期刊页面](https://www.nature.com/articles/s41586-021-03506-2) · [PMC 作者稿](https://pmc.ncbi.nlm.nih.gov/articles/PMC8163299/)
- Pandarinath, C., et al. (2017). <i>High performance communication by people with paralysis using an intracortical brain-computer interface.</i> eLife, 6, e18554。[doi.org/10.7554/eLife.18554](https://doi.org/10.7554/eLife.18554)
- Palin, K., Feit, A. M., Kim, S., Kristensson, P. O., & Oulasvirta, A. (2018). <i>How do people type on mobile devices? Observations from a study with 37,000 volunteers.</i> In Proceedings of the 21st International Conference on Human-Computer Interaction with Mobile Devices and Services。[doi.org/10.1145/3229434.3229445](https://doi.org/10.1145/3229434.3229445)
- 数据：Dryad，[doi.org/10.5061/dryad.wh70rxwmv](https://doi.org/10.5061/dryad.wh70rxwmv)。离线解码代码：[github.com/fwillett/handwritingBCI](https://github.com/fwillett/handwritingBCI)。
- 图 1–4 取自 Willett 等（2021）。
