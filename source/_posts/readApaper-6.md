---
title: "readApaper#6 BiœmuS: A new tool for neurological disorders studies through real-time emulation and hybridization using biomimetic Spiking Neural Network"
title_zh: "readApaper#6 BiœmuS: A new tool for neurological disorders studies through real-time emulation and hybridization using biomimetic Spiking Neural Network"
date: 2026-10-24 00:40:00
tags:
  - readApaper
  - neuroscience
  - neuroengineering
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Can an artificial neural network do more than predict brain activity—and actually interact with living neurons in real time?</i>

<b>Reading time: about 6 minutes.</b>

Most spiking neural networks (SNNs) are used either to study neural activity in simulations or to build efficient AI systems. BiœmuS asks a different question: <b>what would it take to build an artificial neural circuit that can exchange signals with a living brain or brain organoid while the experiment is happening?</b>

In a 2024 <i>Nature Communications</i> paper, Beaubois and colleagues presented a small FPGA-based platform that runs detailed biophysical neuron models, reproduces selected neural activity patterns, and connects to real biological recording and stimulation devices. The important achievement is not a new learning algorithm. It is turning a simulated network into a <b>real-time component of a biohybrid experiment</b>.

## 1. Why is “real time” harder than “fast simulation”?

Imagine recording a burst of spikes from a brain organoid. You want an artificial network to respond, then electrically stimulate that organoid based on the response.

It is not enough for a simulation to finish one second of neural activity in less than one second <i>on average</i>. In a closed-loop experiment, a late response may arrive after the biological event you intended to influence. The system also needs predictable timing and working connections to lab equipment.

There is another design choice: <b>bio-inspired versus biomimetic</b> neurons. A simple leaky integrate-and-fire (LIF) neuron makes a convenient model for efficient computation. A Hodgkin–Huxley (HH) family neuron instead tracks how membrane voltage changes through ion-channel currents. That richer description costs more computation, but its parameters have a more direct relationship to neural electrophysiology.

BiœmuS uses a Pospischil-style HH model with six conductance-based currents and configurable biophysical synapses, including AMPA, NMDA and GABA receptor dynamics. Its goal is to emulate relevant neural dynamics at biological time scales, not just generate spikes.

## 2. How does BiœmuS run a complex SNN on a small board?

The trick is to divide responsibilities between two parts of an AMD Xilinx Kria KR260 system:

- <b>FPGA programmable logic (PL):</b> carries out the neuron and synapse updates on a fixed, hard-real-time schedule.
- <b>CPU processing system (PS):</b> runs Ubuntu and a C++ controller to configure the network, monitor activity and communicate with equipment through familiar interfaces.

Users create network configurations with Python. They can test them in software before loading them onto the FPGA. This keeps experiment design flexible without sacrificing deterministic computation.

![Figure 1 — Overview of the BiœmuS platform](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig1_HTML.png)

<i>Figure 1 \| Original paper Figure 1 (unmodified). The crucial boundary is between the FPGA that performs time-critical HH calculations and the Ubuntu/CPU side that handles configuration and communication. Source: Beaubois et al., Nature Communications (2024), CC BY 4.0.</i>

<b>The reported capacity is 1,024 HH neurons and 2²⁰ (1,048,576) synapses, updated every 31.25 μs</b>—32,000 model steps per second. Total board power consumption is reported as approximately <b>6.50 W</b>.

How can HH calculations fit into that schedule? One practical optimization is to <b>precompute expensive voltage-dependent ion-channel functions in lookup tables</b>. At runtime, the FPGA mostly performs table reads and multiply-add operations instead of repeatedly evaluating expensive functions such as exponentials. This is an example of hardware–model co-design, not a simplification to LIF neurons.

## 3. Does the artificial network behave like a biological one?

A configurable SNN is useful only if it can reproduce some meaningful population behavior.

One demonstration models two cortical organoids. The authors compared a <b>disconnected</b> configuration, where the two networks have no links between them, with a <b>connectoid-like</b> configuration, where neurons in the two groups can connect across the boundary.

![Figure 3 — Artificial disconnected and connected organoids](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig3_HTML.png)

<i>Figure 2 of this blog \| Original paper Figure 3 (unmodified). Compare the raster plots: in the connected configuration, bursts across the two artificial organoid populations become more synchronized. Source: Beaubois et al., Nature Communications (2024), CC BY 4.0.</i>

This teaches a useful distinction. A <b>spike</b> is an individual firing event; a <b>network burst</b> is a brief episode in which many neurons fire together. If the two populations become connected, their bursts can influence one another and align in time. BiœmuS reproduces this qualitative change in network dynamics.

In a second test, the authors built a clustered SNN to emulate activity in the rat <i>rostral forelimb area</i> (RFA). They tested <b>80 configurations</b> and compared their mean firing rate, mean bursting rate and burst duration against recordings from six rats. The selected artificial networks approached the biological recordings on these summary measures.

But similar spike statistics do <b>not</b> prove that an artificial network replicates an entire brain circuit. The authors demonstrated matching on particular activity features, not functional equivalence.

## 4. The key experiment: connecting living and artificial neurons

The strongest part of this study comes after the simulations. In the organoid experiment, living connected organoids sat on a <b>high-density microelectrode array (HD-MEA)</b>, which records extracellular spikes and delivers electrical stimulation. A gateway computer ran Python software connecting the HD-MEA to BiœmuS.

The loop worked in both directions:

1. A burst in the <b>living organoid</b> is detected, and software stimulates the <b>artificial SNN</b>.
2. A burst in the <b>artificial SNN</b> is detected, and software stimulates the <b>living organoid</b> through the HD-MEA.

![Figure 5 — Biohybrid experimental prototypes](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig5_HTML.png)

<i>Figure 3 of this blog \| Original paper Figure 5 (unmodified). Panel A shows the bidirectional organoid–FPGA experiment and the activity traces; panel B shows the separate rat-brain stimulation prototype. Source: Beaubois et al., Nature Communications (2024), CC BY 4.0.</i>

That is a genuine <b>biohybrid closed-loop prototype</b>: living activity changes the artificial network's input, and artificial activity can trigger a new intervention in living tissue.

The authors also showed a different, <b>open-loop</b> animal experiment. An artificial RFA model generated spikes that triggered stimulation in the rat's somatosensory cortex (S1) via an INTAN interface. The interval from SNN spike detection to delivered stimulation was reported as <b>less than 1 ms</b>. This is an interface demonstration; it does not establish a new therapy's clinical efficacy.

## 5. What has not been solved?

There is an important difference between <i>the FPGA being real-time</i> and <i>the whole biohybrid loop being precisely synchronized</i>.

- The <b>31.25 μs</b> step applies to computation inside the FPGA, not to every external device and software process.
- The organoid loop still had around <b>±100 ms timing uncertainty</b> when timestamps were aligned across systems. Better clock synchronization and interface characterization remain necessary.
- Stimulation can create large <b>electrical artifacts</b> that resemble spikes. If those artifacts are mistakenly detected as neural events, they could trigger unwanted repeated stimulation.
- <b>1,024 neurons</b> is tiny compared with a real brain region. Memory for synaptic weights and precomputed lookup tables is also an important hardware bottleneck.

## Takeaway

BiœmuS is best understood as an <b>experimental bridge between computational neuroscience and living electrophysiology</b>. It shows that a detailed, configurable neural model can be packaged into embedded hardware and plugged into real recording and stimulation setups.

The next challenge is not simply to simulate more neurons. It is to make the <b>entire</b> read–compute–stimulate loop reliable, precisely timed and biologically meaningful. This paper demonstrates that the bridge can be built—not that it can already cure neurological disease.


---

## References

- Beaubois, R. et al. (2024). <i>BiœmuS: A new tool for neurological disorders studies through real-time emulation and hybridization using biomimetic Spiking Neural Network</i>. <b>Nature Communications, 15</b>, 5142. [DOI: 10.1038/s41467-024-48905-x](https://doi.org/10.1038/s41467-024-48905-x).
- [Open-source BiœmuS repository](https://github.com/Ceramic-Blue-Tim/bioemus).
- Original figures: Figures 1, 3 and 5, reproduced without modification from Beaubois et al. (2024) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

<!-- BLOG_ZH -->

<i>人工神经网络能不能不只是分析脑信号，而是真正与活体神经元实时交互？</i>

<b>预计阅读时间：约 6 分钟。</b>

我们常见的脉冲神经网络（Spiking Neural Network，SNN）要么用于离线模拟大脑活动，要么被当作更接近生物神经元的 AI 计算模型。但如果希望让人工神经网络真正成为实验中的一部分，例如实时接收脑类器官的放电，再控制电刺激，仅仅「模拟得像」是不够的。

2024 年，Beaubois 等人在 <i>Nature Communications</i> 发表了 <b>BiœmuS</b>：一套基于 FPGA 的实时仿生 SNN 平台。它能够运行较复杂的生物物理神经元模型，并通过常见设备接口与真实神经组织交互。

<b>这篇论文最重要的不是提出新的 SNN 训练算法，而是把仿生神经网络变成了一块能接进生物闭环实验的实时硬件。</b>

## 1. 为什么「仿真很快」不等于「能够实时交互」？

想象这样一个实验：类器官里的神经元突然集体放电。我们希望人工神经网络马上接收到这一事件，计算一个响应，然后通过电极反过来刺激类器官。

这里的关键是时间。如果软件平均每秒能模拟一秒神经活动，但偶尔会慢上几十毫秒，那么它仍可能错过想干预的生物事件。<b>闭环系统要求的不是平均速度快，而是关键计算必须按时完成。</b>

另一个问题是神经元模型。常见的 <b>LIF（Leaky Integrate-and-Fire）模型</b>把神经元简化为一个漏电积分器，达到阈值就发放 Spike，计算很省。<b>Hodgkin–Huxley（HH）类模型</b>则进一步描述膜电位如何被离子通道电流改变，更接近电生理机制，但计算也更复杂。

BiœmuS 选择了后一条路线：使用 Pospischil 风格的 HH 神经元模型、六种电导电流，以及具有 AMPA、NMDA、GABA 等受体动力学的突触。它希望模拟的不只是「有没有放电」，还包括神经元为何、何时放电。

## 2. 一块 FPGA 怎么实时计算上千个 HH 神经元？

BiœmuS 运行在 AMD Xilinx Kria KR260 上。它把任务拆成两个部分：

- <b>PL / FPGA：</b> 按严格固定的时间节拍计算神经元和突触，是 hard real-time 的核心。
- <b>PS / CPU：</b> 运行 Ubuntu 与 C++ 控制程序，负责网络配置、数据采集和对外通信，灵活但不是同等意义上的硬实时。

用户用 Python 定义神经元、连接和刺激参数，可以先在软件中测试，再将配置加载到 FPGA。这样，生物实验需要的灵活接口和神经计算需要的确定性，就不必由同一模块承担。

![图 1｜BiœmuS 平台的硬件与软件分层](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig1_HTML.png)

<i>配图 1｜原论文 Figure 1，未修改。重点看 CPU/Ubuntu 与 FPGA 的分工：前者管理配置和实验设备，后者严格按节拍运行 HH 神经网络。来源：Beaubois et al., Nature Communications (2024)，CC BY 4.0。</i>

论文报告该系统最多可以支持 <b>1,024 个 HH 神经元、2²⁰（约 105 万）个突触</b>，每 <b>31.25 μs</b> 更新一次网络状态，相当于每秒 32,000 个计算步。整块板卡功耗约 <b>6.50 W</b>。

问题来了：HH 方程含有复杂的电压依赖函数，FPGA 怎么来得及？

作者采用了经典但有效的工程技巧：<b>预先算好离子通道函数，存入 Lookup Table（查找表）</b>。运行时根据膜电位查表，再完成乘法和加法，避免每个时间步都重复计算昂贵的指数函数。这也是生物物理模型与硬件结构协同设计的例子。

## 3. 模拟出的神经网络，真的像真实网络吗？

作者先展示了一个很好理解的例子：模拟两个皮层脑类器官。

- <b>Single（分离）：</b> 两组神经元之间没有跨组连接。
- <b>Connected / Connectoid（连接）：</b> 两组神经元之间存在一定的突触连接。

![图 2｜分离与连接的人工类器官网络](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig3_HTML.png)

<i>配图 2｜原论文 Figure 3，未修改。重点看下方 Raster Plot：连接后，两组人工类器官网络的群体 Burst 趋于同步。来源：Beaubois et al., Nature Communications (2024)，CC BY 4.0。</i>

这里要区分两个概念：<b>Spike</b> 是单个神经元的一次放电，<b>Network Burst</b> 则是许多神经元在短时间内密集放电。两个网络各自出现 Burst，并不代表它们同步；但当两组神经元建立连接，活动就可能相互影响，让 Burst 在时间上更接近。

BiœmuS 成功复现了这种与连接结构相关的同步变化，说明它不只是随机生成 Spike，也能模拟一部分网络级动力学。

作者还建立了大鼠前肢运动相关皮层 <b>RFA（Rostral Forelimb Area）</b> 的簇状网络模型。研究者扫描了 <b>80 组 SNN 配置</b>，根据平均放电率（MFR）、平均 Burst 频率（MBR）和 Burst 持续时间（BD）与六只大鼠的记录进行比较，并找到在这些指标上相近的配置。

不过，<b>几个统计指标接近，不等于整个真实神经回路已被完整复制</b>。这里验证的是特定活动特征，而不是功能等价。

## 4. 最重要的实验：人工神经网络与活体类器官形成闭环

如果说前面的实验只证明「模拟得像」，那么 <b>Figure 5</b> 才真正说明这套系统为什么叫 <i>biohybrid</i>。

研究人员把真实连接脑类器官放在 <b>HD-MEA（高密度微电极阵列）</b> 上。HD-MEA 既能记录细胞外放电，也能施加电脉冲。BiœmuS 则在另一侧运行人工类器官网络，中间由 Python gateway 程序连接。

这个实验形成了双向交互：

1. <b>真实类器官 → 人工 SNN：</b> 检测到真实网络 Burst 后，向 BiœmuS 发送刺激。
2. <b>人工 SNN → 真实类器官：</b> 检测到人工网络 Burst 后，通过 HD-MEA 刺激真实组织。

![图 3｜类器官闭环与大鼠脑刺激原型](https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-024-48905-x/MediaObjects/41467_2024_48905_Fig5_HTML.png)

<i>配图 3｜原论文 Figure 5，未修改。A：真实类器官、Python gateway 和 BiœmuS 组成的双向交互原型，下面是放电记录；B：将人工 RFA 的 Spike 用于驱动大鼠 S1 刺激的另一实验。来源：Beaubois et al., Nature Communications (2024)，CC BY 4.0。</i>

这样一来，真实神经活动可以改变人工网络的输入，人工网络的活动也能触发对真实组织的干预。这才是本文最有价值的 <b>生物—人工闭环（biohybrid closed loop）</b> 证据。

论文还展示了另一种 <b>open-loop（开环）</b> 原型：用人工 RFA 网络生成的 Spike 驱动 INTAN 设备，刺激大鼠的躯体感觉皮层 <b>S1</b>。从检测到人工 Spike 到发出刺激，延迟报告为 <b>小于 1 ms</b>。这证明接口可以快速工作，但<b>不是</b>证明某种疾病治疗已经有效。

## 5. 「FPGA 是微秒级」不代表「整个系统都是微秒级」

这篇论文尤其值得记住的一点，是必须区分计算核心与实际实验闭环。

- <b>31.25 μs</b> 是 FPGA 内部网络更新的固定步长，不是从真实组织记录到再次刺激的全链路延迟。
- 类器官闭环依赖 HD-MEA、Python 程序、设备 API 和通信。论文报告跨系统时间对齐的不确定性约为 <b>±100 ms</b>，同步精度仍有很大提升空间。
- <b>刺激伪迹（stimulation artifact）</b> 可能被系统误认为 Spike，进而产生错误的重复触发。
- <b>1,024 个神经元</b> 与真实脑网络相比仍然很少，而突触权重和查找表还会占用大量 FPGA 存储资源。

因此，下一个难点不只是「多跑几个神经元」，而是让记录、计算、刺激、同步与伪迹抑制真正组成一个可靠的整体。

## 结语

可以把 BiœmuS 理解为<b>连接计算神经科学与真实电生理实验的一座桥</b>。作者证明：复杂的 HH 类 SNN 不一定只能离线运行，它也能被做成嵌入式硬件，并接入真实神经组织的交互实验。

<b>这篇论文完成的是平台可行性验证，不是神经疾病的治疗效果验证。</b> 它留给我们的核心启示是：一个可用的闭环系统，既需要足够真实的神经模型，也需要足够可靠的系统时序。


---

## 参考资料

- Beaubois, R. et al. (2024). <i>BiœmuS: A new tool for neurological disorders studies through real-time emulation and hybridization using biomimetic Spiking Neural Network</i>. <b>Nature Communications, 15</b>, 5142. [DOI: 10.1038/s41467-024-48905-x](https://doi.org/10.1038/s41467-024-48905-x).
- [Open-source BiœmuS repository](https://github.com/Ceramic-Blue-Tim/bioemus).
- Original figures: Figures 1, 3 and 5, reproduced without modification from Beaubois et al. (2024) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
