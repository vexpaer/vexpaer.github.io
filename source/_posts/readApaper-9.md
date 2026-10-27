---
title: "readApaper#9 Advancing neuroengineering with Neuromorphic Twins"
title_zh: "readApaper#9 Advancing neuroengineering with Neuromorphic Twins"
date: 2026-10-26 22:00:00
tags:
  - readApaper
  - neuroscience
  - neuromorphic-computing
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 6 minutes · 26 October 2026 · Nature Communications (2026)</i>

<b>What if a damaged neural circuit had an electronic counterpart that could listen, respond, and gradually adapt as the living tissue changed?</b>

This is the idea behind a <b>Neuromorphic Twin</b>. In a 2026 <i>Nature Communications</i> Perspective, Michela Chiappalone and Timothée Levi bring together digital twins, spiking neural networks (SNNs), and closed-loop neurostimulation into one architecture. The central design principle is simple: <b>a fast loop interacts with the brain; a slow loop keeps its artificial counterpart in tune.</b>

## 1. From a digital model to a living partner

A conventional brain digital twin uses measurements to build a computational representation of neural tissue. The model can help simulate activity, investigate mechanisms, or predict how a network might respond to treatment.

The authors take the next step: the model should also <b>exchange signals with the biological network continuously</b>. Neural recordings update the artificial system, while its output can drive stimulation back into the tissue. Both sides can therefore influence one another.

Why add <i>neuromorphic</i> hardware? A biological neural circuit consists of many neurons and synapses operating in parallel. <b>Spiking neural networks</b> represent information through discrete spikes and reproduce aspects of neuronal and synaptic dynamics. Implemented on FPGA or neuromorphic chips, they can process those events at low latency and with comparatively low power consumption.

The goal is an artificial circuit with two responsibilities: <b>reproduce meaningful biological dynamics</b> and <b>participate in a real-time feedback loop</b>.

## 2. How the three-part architecture works

The authors divide the Neuromorphic Twin into three cooperating modules (Figure 1).

<b>A. Signal-processing hardware — detect what the brain is doing.</b> Implanted electrodes or microelectrode arrays record electrical activity. Event-driven processing extracts spikes, bursts, or other useful patterns from the raw signal. An SNN can perform spike detection or classification close to the recording hardware.

<b>B. Biomimetic SNN hardware — emulate the neural circuit.</b> A second hardware network contains model neurons, synapses, and connections chosen to reproduce a biological circuit's dynamics. It receives the extracted events, evolves its own neural state, and generates outputs that can trigger adaptive stimulation.

<b>C. Automatic-tuning software — keep the model aligned.</b> Biological networks evolve, so a fixed set of SNN parameters will eventually become outdated. The software compares recorded activity with the emulated activity and adjusts neuron parameters, synaptic strengths, or network structure. The authors discuss optimization methods including particle swarm optimization (PSO), evolution strategies (ES), and gradient-based approaches.

![Figure 1: Neuromorphic Twin architecture](/img/readApaper-9/figure-1.jpg)

<i>Figure 1. Follow the arrows from neural recording to feature extraction, the biomimetic SNN, and adaptive stimulation. The software block below the SNN is responsible for slower parameter updates.</i>

The clever part is the <b>separation of timescales</b>. The paper describes event detection at roughly <b>1 ms</b>, event classification around <b>10 ms</b>, and hardware emulation of synaptic/ionic dynamics on the order of <b>100 μs</b>. Re-optimizing a network can happen over <b>minutes or hours</b>.

Imagine adjusting the sound system in a crowded room. The microphone and speaker must respond immediately to avoid a delayed conversation; an equalizer can recalibrate more slowly as the room's acoustics change. In a Neuromorphic Twin, stimulation is the fast response, while model personalization is the recalibration.

## 3. What does it mean to “copy” a neural network?

Matching a single firing rate is rarely enough. Two circuits may produce the same number of spikes per second yet organize those spikes very differently.

The Perspective discusses hardware emulation studies such as <b>BioemuS</b>, which implements biologically motivated spiking models on FPGA. Researchers compare candidate artificial networks with biological recordings using measures such as <b>mean firing rate</b>, <b>burst rate</b>, <b>inter-spike intervals (ISI)</b>, and correlations in population activity.

These measurements can guide tuning. For example, if a biological network produces repeated bursts separated by quiet periods, a useful twin should reproduce the <b>temporal organization</b> of those bursts—not merely their average spike count.

The authors also discuss different levels of model fidelity: models may reproduce detailed membrane dynamics (such as Hodgkin–Huxley-type neurons) or more abstract circuit behavior. The best choice depends on the target network and the speed and power budget.

## 4. The organoid connection: a circuit made of living and artificial neurons

One particularly interesting application is <b>biohybrid intelligence</b>, where cultured neural tissue and silicon-based networks exchange electrical signals.

Figure 4B imagines <b>two brain organoids connected through an artificial SNN</b>, using microelectrode arrays (MEAs) as the interface. Activity recorded from one organoid can trigger an input to the SNN; the SNN's activity can then trigger stimulation of the other organoid. A software layer can tune the artificial network as the cultured tissue develops.

![Figure 4: Brain and organoid applications](/img/readApaper-9/figure-4.jpg)

<i>Figure 4. Panel A outlines a neural recording–model–stimulation loop in an animal brain. Panel B shows an organoid–SNN–organoid connection mediated by MEAs.</i>

This setup suggests an intriguing experiment: <b>can an artificial spiking circuit act as a programmable bridge between two living networks?</b> Researchers could vary its connectivity, delays, and plasticity, then observe changes in the organoids' spike timing, bursts, and synchronization.

The same framework points toward neuroprosthetics, where an implanted artificial circuit could detect abnormal activity and deliver stimulation shaped by an evolving patient-specific model.

## Takeaway

A Neuromorphic Twin combines <b>real-time neural emulation</b>, <b>bidirectional electrical interaction</b>, and <b>slow adaptive optimization</b>. The SNN is the fast computational partner; the software optimizer helps it remain aligned with changing biology.

The broader idea is powerful: rather than treating neural recordings as data to classify once, we can build artificial networks that <b>continually interact with—and adapt alongside—living circuits</b>.

---

## References / 参考资料

- Chiappalone, M., & Levi, T. (2026). <i>Advancing neuroengineering with Neuromorphic Twins</i>. <i>Nature Communications</i>, <b>17</b>, 1938. [DOI: 10.1038/s41467-026-68923-1](https://doi.org/10.1038/s41467-026-68923-1).
- [Full article (Nature Communications)](https://www.nature.com/articles/s41467-026-68923-1) · [PubMed Central full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12923540/).
- Figures 1 and 4 are from Chiappalone & Levi (2026), with captions here explaining the relevant panels. [Article license: CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

<!-- BLOG_ZH -->


<i>预计阅读时间：约 6 分钟 · 2026 年 10 月 26 日</i>

<b>如果受损的神经回路能拥有一个电子“分身”，它既能监听真实神经元的活动，又能参与刺激，并随着生物组织的变化不断调整自己，会发生什么？</b>

这就是 <b>Neuromorphic Twin（神经形态孪生）</b> 的设想。Chiappalone 和 Levi 在 2026 年的 <i>Nature Communications</i> Perspective 中，将数字孪生、脉冲神经网络（SNN）与闭环神经刺激组合成一套完整架构。理解它的关键只有一句话：<b>快环路负责实时和大脑交互，慢环路负责让人工模型持续跟上生物网络。</b>

## 1. 从数字模型，变成能与神经组织互动的“分身”

传统的脑数字孪生，主要是利用神经数据构建计算模型，再用模型模拟神经活动、研究疾病机制，或预测不同治疗方案可能产生的影响。

作者希望再推进一步：让这个模型与真实神经网络<b>持续交换信息</b>。生物神经元的放电进入人工系统，人工系统的输出则可以触发电刺激，反过来影响生物网络。

为什么选择 <b>SNN（Spiking Neural Network）</b>？生物神经系统由大量并行运行的神经元和突触组成，信息以离散的 spike 和复杂的时间模式传播。SNN 用脉冲事件表示信息，并利用神经元、突触模型重现其中一部分动力学。在 FPGA 或神经形态芯片上运行时，它适合做低延迟、低功耗的事件驱动计算。

因此，Neuromorphic Twin 有两个任务：<b>模拟真实神经网络的动态行为</b>，以及<b>作为闭环的一部分直接参与交互</b>。

## 2. 核心架构：两块硬件，加一个软件优化器

论文 Figure 1 给出三个相互配合的模块。

<b>第一层：信号处理硬件，负责“听”。</b> 电极或 MEA 采集神经电信号，实时提取 spike、burst 等事件或特征。例如用一个轻量 SNN 完成 spike detection、分类或时序模式识别。

<b>第二层：仿生 SNN 硬件，负责“模拟和响应”。</b> 另一组由模型神经元和突触组成的网络，按照目标生物回路的动力学运行。它接收第一层提取的神经事件，更新自己的网络状态，并生成可用于触发刺激的输出。

<b>第三层：自动调参软件，负责“校准”。</b> 生物神经网络会随发育、学习或疾病进程改变。软件比较真实活动与人工网络输出，再调整神经元参数、突触权重甚至连接结构。论文讨论了 <b>PSO（粒子群优化）</b>、<b>ES（进化策略）</b> 等可能的优化方法。

![Figure 1: Neuromorphic Twin architecture](/img/readApaper-9/figure-1.jpg)

<i>Figure 1｜沿箭头看：记录神经活动 → 提取特征 → 仿生 SNN → 自适应刺激；下方软件模块负责较慢的参数更新。</i>

这里最巧妙的设计是<b>两种时间尺度分开运行</b>。文中讨论的硬件指标包括：事件检测约 <b>1 ms</b>、分类约 <b>10 ms</b>、模拟突触及离子电流动力学约 <b>100 μs</b>；而整个网络的参数优化可以每隔<b>几分钟或几小时</b>进行一次。

可以想象一个会自动校音的音响系统：麦克风、扬声器必须立即响应，但房间声学环境变化后，均衡器只需要偶尔重新校准。神经形态孪生也是这样：<b>实时刺激在快环路发生，模型个性化在慢环路完成。</b>

## 3. 怎样判断人工 SNN 真的“像”生物网络？

只比较放电频率是不够的。两个网络即使每秒产生相同数量的 spike，放电的时间结构也可能完全不同。

论文讨论了 <b>BioemuS</b> 等基于 FPGA 的仿生神经网络实现：研究者可比较人工网络和生物记录之间的<b>平均放电频率、簇发率（burst rate）、放电间隔（ISI）以及群体活动相关性</b>，再据此寻找更合适的网络参数。

例如，真实神经网络每隔一段时间产生一轮集中簇发，中间存在较长静默期。那么模拟网络除了产生相似数量的 spike，还应尽量重现<b>簇发持续时间、间隔和不同神经元之间的协调方式</b>。

模型可以有不同复杂度：一端是接近生物物理机制的 Hodgkin–Huxley 类神经元，另一端是简化神经元模型与网络动力学。选择哪一种，取决于要模拟的生物对象，以及硬件资源和实时性的要求。

## 4. 类器官应用：让生物神经网络和人工网络连接

对类器官智能来说，Figure 4B 特别值得看。作者提出了一种<b>类器官—SNN—类器官</b>的混合连接构想，用微电极阵列（MEA）将培养的神经组织与人工网络连接。

其中一个类器官的神经事件通过 MEA 被采集，成为仿生 SNN 的输入；SNN 产生的事件再触发对另一个类器官的电刺激。随着类器官成熟或网络状态改变，软件优化器还可以定期校准人工网络。

![Figure 4: Brain and organoid applications](/img/readApaper-9/figure-4.jpg)

<i>Figure 4｜A 展示动物脑中的记录—模型—刺激闭环；B 展示以 MEA 为接口的类器官—SNN—类器官连接。</i>

这个架构引出了一个很有意思的实验问题：<b>能否让人工 SNN 充当两个活体神经网络之间的可编程“桥梁”？</b>

例如，改变人工网络的连接拓扑、传输延迟或突触可塑性，再测量类器官的 spike timing、burst 和 synchrony 是否随之变化。这把 SNN 从单纯的分类模型，变成了<b>能够参与生物网络动力学的计算组件</b>。

类似思路也能延伸到神经假体：系统持续监测神经活动，结合个体化模型输出刺激，再根据患者的神经状态变化调整治疗参数。

## 总结

<b>Neuromorphic Twin = 实时仿生 SNN + 双向电信号交互 + 慢速自动调参。</b>

它最值得关注的思想，是让人工神经网络长期参与生物系统的反馈循环。<b>SNN 负责及时响应，优化器负责持续适应，而真实神经网络始终在闭环之中。</b>

---

## References / 参考资料

- Chiappalone, M., & Levi, T. (2026). <i>Advancing neuroengineering with Neuromorphic Twins</i>. <i>Nature Communications</i>, <b>17</b>, 1938. [DOI: 10.1038/s41467-026-68923-1](https://doi.org/10.1038/s41467-026-68923-1).
- [Full article (Nature Communications)](https://www.nature.com/articles/s41467-026-68923-1) · [PubMed Central full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12923540/).
- Figures 1 and 4 are from Chiappalone & Levi (2026), with captions here explaining the relevant panels. [Article license: CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).
