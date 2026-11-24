---
title: "readApaper#48 Foundation model of neural activity predicts response to new stimulus types"
title_zh: "readApaper#48 神经活动基础模型可预测对新刺激类型的反应"
date: 2026-12-04 22:00:00
tags:
  - readApaper
  - neuroscience
  - machine-learning
  - visual-cortex
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 6 minutes · 4 December 2026 · Nature, 2025</i>

This paper presents a foundation model of visual cortical activity, trained on many neurons and mice watching natural videos, that can be transferred to a new animal with relatively little new data and can predict responses to stimulus types the model never saw during training.

## Background

When light enters the eye, it is transformed, stage by stage, into patterns of activity in visual cortex. Different areas emphasize different properties of the image, and even neighboring neurons can respond in their own way. For decades, a standard approach has been to record from one animal, train a model on that animal’s neurons, and then ask how well the model predicts held-out responses to similar images or videos.

That approach works, but it is expensive in data. A model fit to one mouse often needs a long recording before it generalizes well, and a new mouse typically requires starting over. In other fields, <b>foundation models</b> have changed this pattern: a large model is trained once on a broad dataset, and then only a smaller part of the system is adjusted for a new task or a new subject.

Visual neuroscience now has recordings large enough to try the same idea. If many neurons, in several visual areas and several animals, share a common way of representing the visual world, then a shared “core” might be learned once and reused. The test is not only whether the model fits the training videos, but whether it can be transferred to a new mouse and whether it can predict responses to stimuli that were never used in training, such as simple laboratory patterns.

## Problem

The practical problem is sample efficiency and out-of-distribution prediction. An individual model, trained from scratch on one animal, may need a large amount of that animal’s data before its predictions become good. It may also fail when the stimulus changes from natural video to a very different family of images. The authors ask whether a single shared core, trained on many mice watching ecological videos, can reduce the amount of new data needed for a new animal, and whether that transferred model can predict responses to new stimulus types and even relate activity to anatomy and connectivity.

## Method

The authors recorded responses to ecological, natural videos from approximately 135,000 neurons across multiple visual cortical areas in 14 awake, behaving mice. A shared foundation core was trained on eight of those mice, covering six areas—primary visual cortex (V1) and the lateromedial (LM), anterolateral (AL), rostrolateral (RL), anteromedial (AM) and posteromedial (PM) areas—and around 66,000 neurons, with more than 900 minutes of natural-video responses collected across recording sessions.

The model is modular. A <b>perspective</b> module accounts for how the stimulus is seen, a <b>modulation</b> module captures ongoing behavioral or state fluctuations, a shared <b>core</b> learns a common visual representation, and a <b>readout</b> maps that representation onto individual neurons. For transfer to a new mouse, the trained core is frozen, and the remaining modules are fit on the new animal’s data. Individual models, trained separately for each mouse without a shared core, serve as the comparison.

![Figure 1. ANN model of the visual cortex (Wang et al., 2025, Fig. 1). The model has a shared core plus perspective, modulation and readout modules; for transfer, the trained core is frozen and the remaining modules are fit on a new mouse.](/img/readApaper-48/foundation_fig1.png)

<i>Figure 1. ANN model of the visual cortex (Wang et al., 2025, Fig. 1). The model has a shared core plus perspective, modulation and readout modules; for transfer, the trained core is frozen and the remaining modules are fit on a new mouse.</i>

Importantly, some test stimuli, including drifting gratings or Gabors, were not used to train the foundation core. Success on those stimuli is therefore a test of out-of-distribution generalization, not of memorizing the same stimulus family. The authors also applied the representation to the MICrONS mouse, in which activity and nanoscale anatomy can be compared directly.

## Experiments

Prediction quality was summarized with normalized correlation (CCnorm).

Training-data curves asked how much natural-video data was needed before predictions became strong. For individual models, the authors measured how many minutes were required to surpass a median CCnorm of 0.65 for all mice; for foundation models, they measured the corresponding time after transfer of the frozen core. They then tested drifting Gabor stimuli, which had not been part of training, and compared how much natural-video data each approach needed to reach a median CCnorm greater than 0.55.

In the MICrONS animal, the responses of more than 70,000 excitatory neurons to natural videos were measured across 14 sequential scans covering about 1 mm³ of cortex. The model was asked to classify anatomically defined types of excitatory cells and to relate activity to dendritic features and connectivity, using the same representation that had been trained to predict responses.

## Results

The transferred foundation models were substantially more sample-efficient than individual models. Individual models required more than 60 minutes of training data to surpass a median CCnorm of 0.65 for all mice, whereas foundation models required less than 30 minutes. The same advantage appeared across the tested stimulus durations and animals.

![Figure 3. Predictive accuracy of foundation models (Wang et al., 2025, Fig. 3). Individual models needed more than 60 minutes of training data to surpass a median CCnorm of 0.65 for all mice, whereas foundation models needed less than 30 minutes.](/img/readApaper-48/foundation_fig3.png)

<i>Figure 3. Predictive accuracy of foundation models (Wang et al., 2025, Fig. 3). Individual models needed more than 60 minutes of training data to surpass a median CCnorm of 0.65 for all mice, whereas foundation models needed less than 30 minutes.</i>

On out-of-distribution drifting Gabors, foundation models reached a median CCnorm greater than 0.55 using only 16 minutes of natural-video training data. Individual models required more than an hour of training data to reach the same performance level. Because those Gabor stimuli were never used to train the core, the result indicates that the shared representation carries information that is not limited to the natural-video training distribution.

![Figure 4. Parametric tuning from foundation models (Wang et al., 2025, Fig. 4). The transferred models also predict responses to stimulus types not used to train the core, including drifting Gabor stimuli, with a median CCnorm greater than 0.55 after only 16 minutes of natural-video data.](/img/readApaper-48/foundation_fig4.png)

<i>Figure 4. Parametric tuning from foundation models (Wang et al., 2025, Fig. 4). The transferred models also predict responses to stimulus types not used to train the core, including drifting Gabor stimuli, with a median CCnorm greater than 0.55 after only 16 minutes of natural-video data.</i>

In the MICrONS mouse, the same modeling approach accurately classified anatomically defined types of excitatory neurons and captured relationships between predicted activity, dendritic features and connectivity among more than 70,000 neurons. The foundation representation was therefore useful not only for predicting responses in new animals and to new stimuli, but also for connecting functional predictions with the structural map of one densely reconstructed cortex.

![Figure 5. The foundation model of the MICrONS volume relates neuronal function to structure and anatomy (Wang et al., 2025, Fig. 5). The same representation classifies anatomically defined excitatory cell types and relates activity to dendritic features and connectivity among more than 70,000 neurons.](/img/readApaper-48/foundation_fig5.png)

<i>Figure 5. The foundation model of the MICrONS volume relates neuronal function to structure and anatomy (Wang et al., 2025, Fig. 5). The same representation classifies anatomically defined excitatory cell types and relates activity to dendritic features and connectivity among more than 70,000 neurons.</i>

## Analysis

The main claim is that a large fraction of what makes visual cortical responses predictable can be shared across animals and reused. Once that shared core exists, a new mouse does not require a full end-to-end fit from scratch; fitting the animal-specific modules is enough to reach strong predictions with less data. The reduction from more than 60 minutes to less than 30 minutes, for a median CCnorm of 0.65 on all mice, is the clearest quantitative expression of that reuse.

The Gabor result extends the claim beyond interpolation. A model that has seen only natural video can still predict responses to a classic laboratory stimulus, and it can do so with 16 minutes of new natural-video data, whereas an individual model needs more than an hour. That is a practical difference for experiments that want a good functional model without recording a full battery of every stimulus type in every animal.

The MICrONS analysis suggests a second use of the same representation: not only to predict what a neuron will do, but to ask how that predicted function sits among cell types, dendrites and connections. The paper does not treat the foundation model as a finished atlas of all vision; it treats it as a transferable core that makes new recordings more informative, sooner.

## Summary

A modular foundation model, with a shared core trained on eight mice, six visual areas, about 66,000 neurons and more than 900 minutes of natural-video responses, can be transferred to new animals by freezing the core and fitting the remaining modules. Among 14 mice and about 135,000 recorded neurons, foundation models needed less than 30 minutes of new data to surpass a median CCnorm of 0.65 for all mice, versus more than 60 minutes for individual models, and they reached a median CCnorm greater than 0.55 on unseen drifting Gabors with only 16 minutes of natural-video data. The same approach also related activity to cell types, dendritic features and connectivity among more than 70,000 excitatory neurons in the MICrONS mouse.

## References

Wang, E. Y., Fahey, P. G., Ding, Z., Papadopoulos, S., Ponder, K., Weis, M. A., Chang, A., Muhammad, T., Patel, S., Ding, Z., Tran, D., Fu, J., Schneider-Mizell, C. M., Reid, R. C., Collman, F., da Costa, N. M., Franke, K., Ecker, A. S., Reimer, J., Pitkow, X., Sinz, F. H., & Tolias, A. S. (2025). Foundation model of neural activity predicts response to new stimulus types. <i>Nature, 640</i>(8058), 470–477. [https://doi.org/10.1038/s41586-025-08829-y](https://doi.org/10.1038/s41586-025-08829-y)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 6 分钟 · 2026-12-04 · Nature, 2025</i>

这篇论文提出了一种视觉皮层活动的基础模型。它在许多神经元和小鼠观看自然视频的数据上训练，只需相对较少的新数据就可以迁移到新动物，并能够预测模型在训练中从未见过的刺激类型所引起的反应。

## 背景

光线进入眼睛后，会一步步转化成视觉皮层中的活动模式。不同脑区强调图像的不同属性，即使相邻的神经元也可能各有各的反应。几十年来，标准做法是：在一只动物中记录，用该动物的神经元训练模型，再问模型对留出的相似图像或视频反应预测得有多好。

这种方法是有效的，但在数据上很昂贵。拟合于一只小鼠的模型，往往需要很长的记录才能有良好泛化；换一只新的小鼠，通常又得从头开始。在其他领域，<b>基础模型</b>改变了这一模式：先在广泛的数据上训练一个大模型，然后只需调整系统中较小的部分，就能面向新任务或新对象。

视觉神经科学现在已经拥有足够大的记录，可以尝试同样的想法。如果许多神经元、多个视觉区域和多只动物共享一种对视觉世界的表示方式，那么就可以先学习一个共享的“核心”，再加以复用。真正的检验不只是模型能否拟合训练视频，还包括它能否迁移到新的小鼠，以及能否预测训练中从未使用过的刺激（例如简单的实验室图形）所引起的反应。

## 问题

实际问题是样本效率以及分布外预测。从零开始为单只动物训练的个体模型，可能需要该动物的大量数据，预测才会变好；当刺激从自然视频换成完全不同的图像家族时，它也可能失败。作者想知道：在许多小鼠观看生态视频的数据上训练得到的单个共享核心，能否减少为新动物所需的新数据量，以及迁移后的模型能否预测新刺激类型的反应，甚至把活动与解剖和连接联系起来。

## 方法

作者在 14 只清醒、行为中的小鼠中，记录了多个视觉皮层区域大约 135,000 个神经元对生态自然视频的反应。共享的基础核心在其中 8 只小鼠上训练，覆盖 6 个脑区——初级视觉皮层（V1）以及外侧中部（LM）、前外侧（AL）、前外侧偏吻侧（RL）、前内侧（AM）和后内侧（PM）区——约 66,000 个神经元，并在多次记录中累计获得超过 900 分钟的自然视频反应。

模型是模块化的。<b>视角</b>模块说明刺激是如何被看到的，<b>调制</b>模块捕捉持续的行为或状态波动，共享<b>核心</b>学习共同的视觉表示，<b>读出</b>再把这一表示映射到单个神经元。迁移到新小鼠时，训练好的核心被冻结，其余模块在新动物的数据上拟合。作为对照，个体模型则为每只小鼠单独训练，不使用共享核心。

![图 1. 视觉皮层的人工神经网络模型（Wang 等，2025，图 1）。模型包括一个共享核心以及视角、调制和读出模块；迁移时冻结训练好的核心，并在新小鼠上拟合其余模块。](/img/readApaper-48/foundation_fig1.png)

<i>图 1. 视觉皮层的人工神经网络模型（Wang 等，2025，图 1）。模型包括一个共享核心以及视角、调制和读出模块；迁移时冻结训练好的核心，并在新小鼠上拟合其余模块。</i>

重要的是，一些测试刺激，包括漂移光栅或 Gabor 刺激，并没有用于训练基础核心。因此，在这些刺激上的成功是对分布外泛化的检验，而不是对同一类刺激的记忆。作者还将这一表示应用于 MICrONS 小鼠，从而把活动与纳米尺度解剖直接比较。

## 实验

预测质量用归一化相关系数（CCnorm）来概括。训练数据曲线询问：需要多少自然视频数据，预测才会变强。对于个体模型，作者测量需要多少分钟才能在所有小鼠上超过 0.65 的 CCnorm 中位数；对于基础模型，他们测量在冻结核心迁移之后对应的时间。随后他们测试了训练中未出现过的漂移 Gabor 刺激，并比较两种方法各需要多少自然视频数据，才能达到大于 0.55 的 CCnorm 中位数。

在 MICrONS 动物中，超过 70,000 个兴奋性神经元对自然视频的反应，是在覆盖约 1 mm³ 皮层的 14 次连续扫描中测量的。模型被要求对解剖上定义的兴奋性细胞类型进行分类，并把活动与树突特征和连接联系起来，使用的正是为预测反应而训练的同一表示。

## 结果

迁移后的基础模型在样本效率上明显高于个体模型。个体模型需要超过 60 分钟的训练数据，才能在所有小鼠上超过 0.65 的 CCnorm 中位数；基础模型则需要不到 30 分钟。这一优势在所测试的刺激时长和动物中都出现了。

![图 3. 基础模型的预测精度（Wang 等，2025，图 3）。个体模型需要超过 60 分钟的训练数据，才能在所有小鼠上超过 0.65 的 CCnorm 中位数；基础模型则需要不到 30 分钟。](/img/readApaper-48/foundation_fig3.png)

<i>图 3. 基础模型的预测精度（Wang 等，2025，图 3）。个体模型需要超过 60 分钟的训练数据，才能在所有小鼠上超过 0.65 的 CCnorm 中位数；基础模型则需要不到 30 分钟。</i>

在分布外的漂移 Gabor 刺激上，基础模型只用 16 分钟的自然视频训练数据，就达到了大于 0.55 的 CCnorm 中位数。个体模型则需要超过一小时的训练数据，才能达到同样的表现。因为这些 Gabor 刺激从未用于训练核心，这一结果说明共享表示所携带的信息并不局限于自然视频的训练分布。

![图 4. 来自基础模型的参数调谐（Wang 等，2025，图 4）。迁移后的模型也能预测训练核心时未使用的刺激类型，包括漂移 Gabor 刺激，并在只用 16 分钟自然视频数据后达到大于 0.55 的 CCnorm 中位数。](/img/readApaper-48/foundation_fig4.png)

<i>图 4. 来自基础模型的参数调谐（Wang 等，2025，图 4）。迁移后的模型也能预测训练核心时未使用的刺激类型，包括漂移 Gabor 刺激，并在只用 16 分钟自然视频数据后达到大于 0.55 的 CCnorm 中位数。</i>

在 MICrONS 小鼠中，同一建模方法准确地分类了解剖上定义的兴奋性神经元类型，并在超过 70,000 个神经元中捕捉到了预测活动、树突特征和连接之间的关系。因此，这一基础表示不仅有助于预测新动物和新刺激上的反应，也有助于把功能预测与一只被密集重建的皮层的结构图联系起来。

![图 5. MICrONS 体积的基础模型把神经元功能与结构和解剖联系起来（Wang 等，2025，图 5）。同一表示能够分类解剖上定义的兴奋性细胞类型，并在超过 70,000 个神经元中把活动与树突特征和连接联系起来。](/img/readApaper-48/foundation_fig5.png)

<i>图 5. MICrONS 体积的基础模型把神经元功能与结构和解剖联系起来（Wang 等，2025，图 5）。同一表示能够分类解剖上定义的兴奋性细胞类型，并在超过 70,000 个神经元中把活动与树突特征和连接联系起来。</i>

## 分析

主要论点是：使视觉皮层反应可被预测的很大一部分内容，可以在动物之间共享并复用。一旦有了这个共享核心，新的小鼠就不需要从头做完整的端到端拟合；拟合动物特异的模块，就足以用更少的数据达到较强的预测。对所有小鼠达到 0.65 的 CCnorm 中位数时，所需数据从超过 60 分钟降到不到 30 分钟，是这种复用最清楚的定量表达。

Gabor 结果把这一论点延伸到了插值之外。一个只见过自然视频的模型，仍然能够预测经典实验室刺激的反应，并且只用 16 分钟新的自然视频数据就能做到，而个体模型需要超过一小时。对于希望在不必给每只动物记录所有刺激类型的情况下就获得良好功能模型的实验来说，这是一个实际差别。

MICrONS 分析提示了同一表示的第二种用途：不仅预测神经元会做什么，还询问这种预测出的功能如何位于细胞类型、树突和连接之中。论文并没有把基础模型当成一部已完成的全部视觉图谱，而是把它当作一个可迁移的核心，使新的记录能更早、更多地提供信息。

## 总结

一个模块化基础模型，其共享核心在 8 只小鼠、6 个视觉区域、约 66,000 个神经元和超过 900 分钟的自然视频反应上训练，可以通过冻结核心并拟合其余模块迁移到新动物。在 14 只小鼠和约 135,000 个被记录神经元中，基础模型只需不到 30 分钟的新数据，就能在所有小鼠上超过 0.65 的 CCnorm 中位数，而个体模型需要超过 60 分钟；对于未见过的漂移 Gabor 刺激，基础模型只用 16 分钟自然视频数据就达到了大于 0.55 的 CCnorm 中位数。同一方法还把活动与 MICrONS 小鼠中超过 70,000 个兴奋性神经元的细胞类型、树突特征和连接联系起来。

## 参考文献

Wang, E. Y., Fahey, P. G., Ding, Z., Papadopoulos, S., Ponder, K., Weis, M. A., Chang, A., Muhammad, T., Patel, S., Ding, Z., Tran, D., Fu, J., Schneider-Mizell, C. M., Reid, R. C., Collman, F., da Costa, N. M., Franke, K., Ecker, A. S., Reimer, J., Pitkow, X., Sinz, F. H., & Tolias, A. S. (2025). Foundation model of neural activity predicts response to new stimulus types. <i>Nature, 640</i>(8058), 470–477. [https://doi.org/10.1038/s41586-025-08829-y](https://doi.org/10.1038/s41586-025-08829-y)
