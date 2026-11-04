---
title: "readApaper#15 To Simulate Neural Organoid: A Framework and a Benchmark Based on AI"
title_zh: "readApaper#15 To Simulate Neural Organoid: A Framework and a Benchmark Based on AI"
date: 2026-11-01 22:00:00
tags:
  - readApaper
  - neuroscience
  - spiking-neural-networks
  - neural-simulation
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 14–16 minutes · 1 November 2026 · ICLR 2024 submission version · OpenReview PDF labelled “under review”</i>

<b>Can we build a digital stand-in for a neural organoid before running another wet-lab experiment?</b>

The Neural Organoid Simulation Framework (NOSF) explores this idea. It builds a spiking-neuron network that approximates selected properties of a neural organoid, compares simulated activity with recordings from real tissue, and connects the simulated spikes to a separate trainable spiking neural network (SNN).

The paper addresses two related but different questions: how to simulate selected biological activity, and how to use that simulated activity in a machine-learning task.

![Figure 1A. NOSF's simulated organoid and its separate supervised SNN expansion module.](/img/readApaper-15/NOSF_architecture_two_networks.svg)

<i>Figure 1A. NOSF's simulated organoid and its separate supervised SNN expansion module.</i>

## 1. Why simulate an organoid?

Real organoid experiments are expensive and variable. Changing an electrode location, stimulation pattern, or network parameter can require another biological experiment. A simulator could help researchers screen candidate settings before returning to the lab.

The authors propose an organoid–simulation loop:

<b>real recordings → calibrate the simulator → explore parameters in silico → design a new experiment → collect new recordings.</b>

This is a research workflow, not a real-time sensorimotor loop. The simulator is intended to help design experiments; it does not itself make a biological organoid respond to a physical environment.

## 2. What is inside NOSF?

NOSF combines four main ingredients:

- <b>GIF neurons (Generalized Integrate-and-Fire):</b> simplified neuron models that integrate input and emit spikes when their membrane state crosses a threshold.
- <b>AMPA synapses:</b> a model of fast excitatory synaptic transmission.
- <b>Small-world connectivity:</b> mostly local connections with a limited number of longer-range links.
- <b>STDP (spike-timing-dependent plasticity):</b> synaptic weights change according to the relative timing of pre- and postsynaptic spikes.

The simulated observation/stimulation array (O/S array) plays a role similar to an MEA: it delivers input and reads neural activity. The model also includes lateral inhibition and weight attenuation to limit uncontrolled network-wide firing.

The paper describes two input-encoding strategies. <b>Intensity encoding</b> maps values in a matrix, such as image pixels, to stimulation intensity. <b>Position encoding</b> represents simple patterns by selecting stimulation locations on the O/S array.

The simulated network has a 2D configuration, with one layer of neurons close to the O/S array, and a 3D extension that adds further layers. In the model, each O/S node is mapped one-to-one to a simulated neuron. This makes the simulation convenient to control, but it is an idealization of a real MEA interface.

## 3. Two spiking networks, two learning rules

An important detail is that the paper contains <b>two different spiking networks</b>.

The GIF network is the simulated organoid. Its synaptic weights are modified through STDP, an unsupervised, timing-based plasticity rule. Lateral inhibition encourages competition between neurons, while weight attenuation keeps connection strengths within a bounded range.

A separate LIF-SNN receives the simulated organoid's output. This additional network is trained using supervised surrogate-gradient backpropagation. Its role is to improve task performance by learning how to interpret the simulated spikes.

The two systems should not be conflated: STDP changes connections inside the simulated organoid, while supervised learning trains the external SNN.

## 4. Does the simulator resemble real neural activity?

The authors compare NOSF with recordings from an approximately 200-day-old neural organoid attached to an 8 × 8 MEA. The array has 64 electrodes. The real experiment uses three stimulation trials, each lasting 10 seconds, with regular stimulation reported at 500 mV and 1 Hz.

The comparison includes spike raster patterns, average firing rate, spike-time statistics, and matrix-based measures such as singular value decomposition (SVD), QR decomposition, and spectral norm. The authors report similarities across several selected measurements.

These comparisons show that NOSF can reproduce some observed features under the tested conditions. They do not establish that the model reproduces every cell type, synaptic mechanism, or dynamical response of a living organoid.

## 5. What happens when NOSF is used for classification?

The paper reports two different classification settings.

<b>Binary MNIST (digits 0 and 1).</b> The simulated organoid network classifies images using an activity-based voting rule. Under selected hyperparameters, the best reported accuracy is <b>96.80% for the 2D model</b> and <b>94.52% for the 3D model</b>.

<b>Full MNIST (10 classes).</b> The simulator alone reaches <b>31.45%</b>. When its spike output is passed to a separately trained one-layer LIF-SNN, the combined system reaches <b>91.64%</b>. Two- and three-layer versions reach <b>97.60%</b> and <b>97.96%</b>, respectively.

![Figure 1B. Classification results separate the simulator-only result from the hybrid simulator-plus-SNN result.](/img/readApaper-15/NOSF_classification_results.svg)

<i>Figure 1B. Classification results separate the simulator-only result from the hybrid simulator-plus-SNN result.</i>

These numbers answer different questions. The 31.45% result measures the simulator's own classification performance under the described setup. The 91.64% result includes an additional supervised network that learns to interpret the simulated spikes. It would be misleading to attribute the latter score entirely to the simulated organoid.

The goal of the expansion platform is to test organoid–machine collaboration, not to claim that the simulated tissue alone matches a conventional AI classifier.

## 6. What does the model leave out?

NOSF is a useful abstraction, but it makes simplifying assumptions:

- One simulated O/S node corresponds to one neuron, whereas a real MEA electrode can record activity from multiple neurons.
- GIF and AMPA models capture selected dynamics, not the full biophysics of every cell and synapse.
- The framework does not simulate cell growth, differentiation, or proliferation. It works with an existing network whose synaptic connections can change.
- Similarity is tested on a limited set of recordings and selected statistics. Matching those statistics does not guarantee accurate predictions under new stimulation conditions.

The OpenReview PDF reviewed here is explicitly labelled <b>“under review as a conference paper at ICLR 2024.”</b> It should be cited as that submission version, not presented as a confirmed peer-reviewed ICLR proceedings paper.

## 7. How does the simulator represent an experiment?

NOSF begins with the interface. In a real MEA experiment, electrodes deliver electrical signals to neural tissue and record the resulting activity. The framework models this interface as an observation/stimulation (O/S) array. Each O/S node is assigned to one simulated neuron, so the model can address individual units directly.

The paper describes two encoding strategies. <b>Intensity encoding</b> maps values in a fixed-size matrix, such as image pixels, to stimulation current. The current is normalized within a permitted range so that the simulated input remains bounded. <b>Position encoding</b> represents simple shapes, letters, or digits by selecting particular stimulation sites on the O/S array. The second method is closer to the spatial electrode patterns used in several organoid experiments.

The O/S array acts as both input and output interface. In the model, there are no trainable weights between an O/S node and its corresponding neuron: the array delivers the input and records the output. The internal network performs the transformation.

## 8. Why GIF, AMPA, and small-world connectivity?

The <b>GIF neuron</b> is chosen because it can reproduce diverse firing patterns, including bursting and bistability, without modelling every ion channel. This makes it more expressive than a very simple integrate-and-fire unit while remaining computationally manageable.

The <b>AMPA synapse</b> represents fast excitatory transmission. Its state changes with glutamate binding and unbinding. The <b>small-world network</b> starts from a local ring-like topology and rewires some connections, creating a mixture of local neighbourhoods and long-range links. This structure is intended to provide efficient communication and useful short-term dynamics.

The model uses 64 GIF neurons in the reported benchmark, with five nearest neighbours in the small-world construction. STDP updates synaptic weights according to the relative timing of pre- and postsynaptic spikes: causal timing can strengthen a connection, while the opposite timing can weaken it. Lateral inhibition adds competition, and weight attenuation prevents a few connections from dominating indefinitely.

The 2D model has one neuron layer adjacent to the O/S array. The 3D extension stacks additional layers and adds small-world connections between them. A subtle design choice is that the observable response still comes from the layer nearest the O/S array, rather than simply reading the outermost layer as in a conventional feedforward network.

## 9. How convincing is the biological-similarity benchmark?

The authors compare the simulator with recordings from an approximately 200-day-old neural organoid attached to an 8 × 8 MEA. The experiment uses 500-mV, 1-Hz stimulation, with three 10-second recording rounds. The simulator is configured with 64 GIF neurons and five small-world neighbours.

The comparison is broader than looking at whether two spike rasters appear similar. It includes average firing rate, mean and variance of spike times, maximum and minimum firing intervals, and matrix-based measures such as singular-value decomposition (SVD), QR decomposition, and spectral norm.

For example, one reported group has an average firing rate of 6.16 in the biological recording and 6.41 in NOSF; its average firing time is 2.33 s versus 2.49 s. The spectral norm is 23.32 versus 21.00. These values show that selected summary statistics can be approximated.

However, the benchmark uses only three short stimulation rounds from a limited biological recording. Matching aggregate statistics does not guarantee that the model will predict the response to a new stimulation pattern, reproduce the same causal connectivity, or capture the full three-dimensional biology of the tissue.

## 10. The classification numbers need two separate readings

For <b>binary MNIST (0 versus 1)</b>, the simulated organoid network uses an activity-based voting rule: neurons are associated with the class that elicits the higher average firing rate, and their responses are combined to classify an image. The best reported accuracies are 96.80% for the 2D model and 94.52% for the 3D model. The authors also show that performance is sensitive to hyperparameters such as network density, STDP timing, and simulation duration.

For <b>full MNIST (10 classes)</b>, the simulator alone reaches 31.45%. Its output is then flattened and passed to an additional supervised LIF-SNN. The combined system reaches 91.64% with one SNN layer, 97.60% with two layers, and 97.96% with three layers.

The paper also reports pure ANN and pure SNN comparisons: the one-layer ANN and SNN reach 92.79% and 92.71%; the two-layer versions reach 97.89% and 98.34%; and the three-layer versions reach 98.34% and 98.69%. Thus, the hybrid system approaches conventional models in the deeper settings, but the simulator alone does not. The 91.64% result belongs to the combined simulator-plus-SNN pipeline.

## My perspective

I see NOSF as a possible <b>virtual test bench</b>, not a replacement for biological experiments.

For a closed-loop organoid project, a simulator could help test whether an input encoder produces distinguishable activity, whether a decoder can recover useful states, or whether a proposed network configuration produces pathological synchrony. These are valuable engineering questions to explore before using scarce biological samples.

But a useful simulator needs more than a similar-looking spike raster or a high classification score. It should predict how the biological system responds to new stimulation patterns, how its activity changes over time, and whether those changes transfer to a task. <b>Biological fidelity and task utility should be evaluated separately.</b>

The full-MNIST result illustrates why this distinction matters: the simulator alone reaches 31.45%, while the additional supervised SNN raises the combined system to 91.64%. That is a meaningful hybrid-computing result, but it does not mean the simulated organoid independently achieved 91.64%.

A stronger validation would hold out stimulation patterns and recording sessions, then test whether the calibrated simulator predicts responses it has not seen. It would also compare simulated and biological networks on causal responses, not only aggregate spike statistics.

## Takeaway

- NOSF is a computational framework for simulating selected neural-organoid dynamics.
- It combines GIF neurons, AMPA synapses, small-world connectivity, and STDP.
- The authors compare simulated activity with a limited set of real organoid recordings.
- The simulator alone reaches 31.45% on full MNIST; adding a supervised LIF-SNN raises the one-layer system to 91.64%.
- Similarity to selected recordings is not proof of complete biological fidelity or reliable generalization.

## References / 参考资料

- <i>To Simulate Neural Organoid: A Framework and a Benchmark Based on AI</i>. ICLR 2024 submission version, labelled “under review.” [OpenReview PDF](https://openreview.net/pdf?id=jXOVnxvLic)
- [OpenReview submission page](https://openreview.net/forum?id=jXOVnxvLic)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 14–16 分钟 · 2026-11-01</i>

<b>能不能先在电脑里建立一个类器官替身，再决定下一次真实实验怎么做？</b>

神经类器官模拟框架（Neural Organoid Simulation Framework，NOSF）探索的就是这个方向。作者构建了一个脉冲神经元网络，近似模拟类器官的部分特征，再将模拟活动与真实组织的记录进行比较，最后把模拟产生的 spikes 接入另一套可训练的脉冲神经网络（SNN）。

这篇论文实际上讨论两个相关但不同的问题：如何模拟部分生物神经活动，以及如何利用模拟活动完成机器学习任务。

## 1. 为什么要模拟类器官？

真实类器官实验成本较高，而且不同样本之间存在差异。每次改变电极位置、刺激模式或网络参数，都可能需要重新进行生物实验。模拟器可以帮助研究者先在电脑中筛选候选设置，再决定哪些方案值得进入湿实验。

作者提出了一个实验—模拟循环：

<b>真实记录 → 校准模拟器 → 在计算机中探索参数 → 设计新实验 → 获取新的真实记录。</b>

这是一种研究工作流程，不等于实时感觉—运动闭环。模拟器用于辅助实验设计，它不会直接让真实类器官与物理环境交互。

## 2. NOSF 内部由什么组成？

NOSF 主要组合了四种机制：

- <b>GIF 神经元（Generalized Integrate-and-Fire）</b>：简化的神经元模型，整合输入，并在膜状态达到阈值时产生 spike。
- <b>AMPA 突触</b>：模拟快速兴奋性突触传递。
- <b>小世界连接（small-world connectivity）</b>：以局部连接为主，同时保留少量远距离连接。
- <b>STDP（spike-timing-dependent plasticity）</b>：根据突触前后神经元放电的相对时间更新连接权重。

模拟的观察/刺激阵列（O/S array）类似真实 MEA，负责输入刺激并读取神经活动。模型还加入侧抑制（lateral inhibition）和权重衰减（weight attenuation），限制整个网络失控放电。

论文设计了两种输入编码方法。\*\*强度编码（intensity encoding）\*\*把图像像素等矩阵数值映射为刺激强度；\*\*位置编码（position encoding）\*\*则通过选择 O/S array 上的刺激位置表示简单图案。

模拟网络有两种结构：2D 模型只有一层靠近 O/S array 的神经元；3D 扩展模型在此基础上增加更多层。模型中每个 O/S 节点与一个模拟神经元一一对应。这种设计便于控制和计算，但属于对真实 MEA 接口的理想化处理。

## 3. 两套脉冲网络，两种学习规则

这里有一个很容易混淆的地方：论文实际上包含<b>两套不同的脉冲网络</b>。

GIF 网络负责模拟类器官，内部突触权重通过 STDP 改变。STDP 是一种基于放电时间关系的非监督可塑性规则。侧抑制让神经元之间形成竞争，权重衰减则限制连接强度，避免个别连接不断增强。

另一套 LIF-SNN 接收模拟类器官产生的输出，并通过监督式代理梯度反向传播（surrogate-gradient backpropagation）训练。它的作用是学习如何解释模拟 spikes，从而提高最终任务表现。

这两套系统不能混为一谈：STDP 改变的是模拟类器官内部连接；监督学习训练的是外部 SNN。

## 4. 模拟器产生的神经活动像真实类器官吗？

作者使用一个培养约 200 天、连接在 8 × 8 MEA 上的真实类器官作为比较对象。阵列包含 64 个电极。真实实验进行了三次刺激，每次持续 10 秒，文中报告的常规刺激参数为 500 mV、1 Hz。

比较内容包括 spike raster、平均放电率、放电时间统计，以及奇异值分解（SVD）、QR 分解和谱范数（spectral norm）等矩阵指标。作者报告，模拟器在若干选定指标上与真实记录相似。

这些结果说明 NOSF 能在测试条件下重现部分观测特征，但不能证明它已经复现真实类器官的全部细胞类型、突触机制和动态响应。

## 5. NOSF 能完成分类任务吗？

论文报告了两种不同的分类实验。

<b>MNIST 0/1 二分类。</b> 模拟类器官网络根据自身神经活动进行投票分类。在选定超参数下，2D 模型最高达到 <b>96.80%</b>，3D 模型最高达到 <b>94.52%</b>。

<b>完整 MNIST 十分类。</b> 模拟器自身的准确率为 <b>31.45%</b>。如果把它产生的 spikes 输入另一套经过监督训练的单层 LIF-SNN，组合系统可以达到 <b>91.64%</b>。两层和三层版本分别达到 <b>97.60%</b> 和 <b>97.96%</b>。

这些数字回答的是不同问题。31.45% 衡量的是模拟器自身在该设置下的分类表现；91.64% 则包含了额外训练的监督式神经网络。不能把后者全部归功于模拟类器官。

扩展平台的目标是探索类器官与机器协作，而不是声称模拟组织本身已经达到常规 AI 分类器的水平。

## 6. 模型省略了什么？

NOSF 是一种有用的抽象，但包含若干简化假设：

- 一个模拟 O/S 节点对应一个神经元，而真实 MEA 的单个电极可能同时记录多个神经元。
- GIF 和 AMPA 只描述部分动力学，不能覆盖所有细胞和突触的生物物理细节。
- 框架不模拟细胞生长、分化和增殖，只研究已有网络及其突触连接变化。
- 相似性验证依赖有限的真实记录和选定统计指标。匹配这些指标不代表能够准确预测新的刺激条件。

我阅读的 OpenReview PDF 首页明确标注 <b>“under review as a conference paper at ICLR 2024”</b>。因此应将它引用为这一投稿版本，不能直接写成已确认正式发表的 ICLR 会议论文。

## 7. 模拟器如何表示一次真实实验？

NOSF 从接口开始建模。真实 MEA 实验中，电极向神经组织发送电信号，再记录组织产生的活动。框架把这个接口抽象为观察/刺激阵列（O/S array）。每个 O/S 节点与一个模拟神经元一一对应，因此模型可以直接对单个单元进行刺激和记录。

论文设计了两种编码方法。\*\*强度编码（intensity encoding）\*\*把图像像素等固定矩阵数值映射为刺激电流，并在允许范围内进行归一化。\*\*位置编码（position encoding）\*\*则通过选择 O/S array 上的特定刺激位置表示简单形状、字母或数字。第二种方法更接近部分类器官实验中通过不同电极组合表达空间图案的方式。

O/S array 同时承担输入和输出接口的作用。模型中，O/S 节点与对应神经元之间没有可训练权重：阵列负责输入刺激和读取响应，真正的信号变换发生在内部神经网络。

## 8. 为什么选择 GIF、AMPA 和小世界连接？

\*\*GIF 神经元（Generalized Integrate-and-Fire）\*\*能够表示 burst、双稳态等多种放电模式，又不需要模拟每一种离子通道。因此，它比最简单的积分发放模型更有表达能力，同时保留了较好的计算效率。

<b>AMPA 突触</b>用于表示快速兴奋性传递，其状态会随着谷氨酸结合和解离而变化。\*\*小世界网络（small-world network）\*\*从局部环状连接出发，再随机重连部分连接，使网络同时具有局部邻居和远距离连接。作者希望这种结构提供有效的信息传播和短时动态。

论文报告的基准模型使用 64 个 GIF 神经元，小世界网络中每个节点连接五个近邻。STDP 根据突触前后神经元的放电时序更新权重：某些时序关系会增强连接，另一些则会减弱连接。侧抑制（lateral inhibition）增加神经元之间的竞争，权重衰减（weight attenuation）则防止少数连接无限增强。

2D 模型只有一层紧贴 O/S array 的神经元；3D 扩展模型在此基础上叠加更多层，并增加层间小世界连接。一个容易忽略的设计是：无论 2D 还是 3D，模型最终仍从靠近 O/S array 的第一层读取响应，而不是像传统前馈网络那样直接读取最外层。

## 9. 生物相似性基准有多充分？

作者使用一个培养约 200 天、连接在 8 × 8 MEA 上的真实类器官作为比较对象。实验采用 500 mV、1 Hz 刺激，进行三轮、每轮 10 秒的记录。模拟器则使用 64 个 GIF 神经元和五近邻的小世界连接。

比较指标不只看两张 spike raster 是否相似，还包括平均放电率、放电时间的均值和方差、最大与最小放电间隔，以及奇异值分解（SVD）、QR 分解和谱范数（spectral norm）等矩阵指标。

例如，其中一组真实记录的平均放电率为 6.16，NOSF 为 6.41；平均放电时间分别为 2.33 s 和 2.49 s；谱范数分别为 23.32 和 21.00。这些数值说明，模拟器可以近似部分选定的统计特征。

但基准只使用了有限真实记录中的三轮短时刺激。总体统计相似，不代表模型能够预测新的刺激模式、复现相同的因果连接，或完整捕捉组织的三维生物结构。

## 10. 分类准确率需要分开解读

在 <b>MNIST 0/1 二分类</b>中，模拟类器官网络使用基于神经活动的投票规则：根据每个神经元对两类图像的平均放电率，将神经元分配给相应类别，再综合它们的响应进行分类。2D 模型最高准确率为 96.80%，3D 模型为 94.52%。作者还发现，网络密度、STDP 时序和仿真时长等超参数会明显影响表现。

在 <b>完整 MNIST 十分类</b>中，模拟器自身准确率为 31.45%。之后，模拟输出被展平并输入额外训练的监督式 LIF-SNN。组合系统使用一层 SNN 时达到 91.64%，两层达到 97.60%，三层达到 97.96%。

论文还给出了纯 ANN 和纯 SNN 的对照：一层 ANN 和 SNN 分别达到 92.79% 和 92.71%；两层分别达到 97.89% 和 98.34%；三层分别达到 98.34% 和 98.69%。因此，混合系统在更深层配置下接近传统模型，但模拟器自身并没有达到这一水平。91.64% 是模拟器加 SNN 的组合结果。

## My Perspective｜我的思考

我更愿意把 NOSF 理解为一个<b>虚拟实验台（virtual test bench）</b>，而不是生物实验的替代品。

对于闭环类器官研究，模拟器可以先帮助测试：输入编码能否产生可区分的神经活动？解码器能否恢复有用状态？某种网络配置会不会导致异常同步放电？这些工程问题可以在消耗真实生物样本之前先进行探索。

但一个有用的模拟器不能只满足于 spike raster 看起来相似，或者分类准确率很高。它还应该预测系统面对新刺激模式时的响应、活动如何随时间变化，以及这些变化能否迁移到任务表现上。<b>生物拟真度（biological fidelity）和任务效用（task utility）应该分别评价。</b>

完整 MNIST 的结果正好说明了这一点：模拟器自身只有 31.45%，加入额外监督训练的 SNN 后，组合系统达到 91.64%。这是有意义的混合计算结果，但不代表模拟类器官独立达到 91.64%。

更有说服力的验证可以留出从未用于校准的刺激模式和记录 session，测试模拟器能否预测新条件下的真实响应。评价时也应比较刺激诱发的因果响应，而不只是总体放电统计。

## 总结

- NOSF 是用于模拟部分神经类器官动力学的计算框架。
- 它组合 GIF 神经元、AMPA 突触、小世界连接和 STDP。
- 作者用有限的真实类器官记录比较模拟活动。
- 完整 MNIST 上，模拟器自身达到 31.45%；增加监督式 LIF-SNN 后，单层组合系统达到 91.64%。
- 与部分真实记录相似，不等于完整复现生物机制，也不等于已经证明可靠泛化。

---

## References / 参考资料

- <i>To Simulate Neural Organoid: A Framework and a Benchmark Based on AI</i>. ICLR 2024 submission version, labelled “under review.” [OpenReview PDF](https://openreview.net/pdf?id=jXOVnxvLic)
- [OpenReview submission page](https://openreview.net/forum?id=jXOVnxvLic)
