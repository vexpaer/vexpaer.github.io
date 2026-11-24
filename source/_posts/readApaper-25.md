---
title: "readApaper#25 A highly energy-efficient multi-core neuromorphic architecture for training deep spiking neural networks"
title_zh: "readApaper#25 A highly energy-efficient multi-core neuromorphic architecture for training deep spiking neural networks"
date: 2026-11-11 22:00:00
tags:
  - readApaper
  - neuromorphic-computing
  - spiking-neural-networks
  - hardware
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 11 November 2026 · Nature Communications, 2026</i>

Most neuromorphic chips are built to <b>run</b> a spiking network that has already been trained somewhere else. This paper designs a multi-core architecture that can also <b>train</b> a deep spiking network with backpropagation, and then evaluates that design in three different ways: software simulation, transistor-level analysis, and an FPGA prototype.

## Background

A model that never learns after it leaves the server is a poor fit for many edge settings. A camera at an intersection, a robot, or a wearable sensor may see new objects, new lighting, or new users. Sending every new sample to the cloud can be slow, expensive, or undesirable for privacy. That is the motivation for <b>edge training</b>: updating a model on or near the device itself, so it can adapt to a changing environment.

<b>Spiking neural networks</b> (SNNs) are one candidate for doing this efficiently. In a conventional artificial neural network, neurons pass around continuous numbers, often called activations. In an SNN, a neuron communicates mainly with brief events called <b>spikes</b>: at a given moment it either fires (1) or stays silent (0). The neuron model used here is the <b>leaky integrate-and-fire</b> (LIF) cell. Incoming spikes, each scaled by a synaptic weight, add to an internal voltage called the <b>membrane potential</b>. That voltage also leaks over time. If it crosses a threshold, the neuron emits a spike and is reset. Because many neurons are silent most of the time, a large fraction of the work can in principle be skipped. That sparsity is a central reason people look to SNNs for energy-efficient computing.

<b>Neuromorphic</b> hardware tries to exploit this style of computation. Chips such as TrueNorth, Loihi, Tianjic, and Darwin typically use many small cores arranged in a two-dimensional mesh, and they have been especially effective at <b>inference</b>: running a network forward to produce a prediction. Some of them also support <b>local learning</b> rules, such as spike-timing-dependent plasticity, which adjust a synapse using nearby activity. Those rules are useful, but they have generally been limited to shallower networks.

Training a <b>deep</b> network—the kind of multi-layer model used in modern image recognition—usually relies on <b>backpropagation</b>. The procedure has three stages:

1. <b>Feedforward propagation (FP)</b>, or inference: the input is passed through the layers, membrane potentials are updated, and spikes are produced.
2. <b>Backpropagation (BP)</b>: the prediction is compared with the correct label, and an error signal is sent backward through the layers so each neuron gets a <b>gradient</b>, a number that says how its activity should change to reduce the error. The spike function itself is not differentiable, so trainers use a smooth stand-in called a <b>surrogate gradient</b>.
3. <b>Weight-gradient (WG)</b> computation: those error signals are combined with the spikes from the forward pass to compute how each weight should be updated.

Inference is only the first of these stages. Training needs all three, has to keep intermediate results across layers and time steps, and therefore moves much more data. Putting training, not just inference, onto a neuromorphic fabric is the problem this paper takes on.

![Figure 1. Neuromorphic computing and SNN training (Li et al., 2026, Fig. 1). Panel a contrasts what neuromorphic hardware is good at with why backpropagation has been hard to place on those chips, and sketches this paper’s multi-core design plus an FPGA demonstration. Panel b shows the three computation stages of training: feedforward (FP), backpropagation (BP), and weight-gradient (WG). Panel c follows a leaky integrate-and-fire neuron in a convolution layer: spikes and weights produce a membrane potential, which is then compared with a threshold to emit a spike. Panel d unrolls those stages across time steps and layers: FP runs forward in time, BP runs backward, and WG accumulates updates from both.](/img/readApaper-25/Fig1_neuromorphic_SNN.png)

<i>Figure 1. Neuromorphic computing and SNN training (Li et al., 2026, Fig. 1). Panel a contrasts what neuromorphic hardware is good at with why backpropagation has been hard to place on those chips, and sketches this paper’s multi-core design plus an FPGA demonstration. Panel b shows the three computation stages of training: feedforward (FP), backpropagation (BP), and weight-gradient (WG). Panel c follows a leaky integrate-and-fire neuron in a convolution layer: spikes and weights produce a membrane potential, which is then compared with a threshold to emit a spike. Panel d unrolls those stages across time steps and layers: FP runs forward in time, BP runs backward, and WG accumulates updates from both.</i>

## Problem

Existing multi-core neuromorphic processors, as the authors review them, can run SNNs and sometimes apply local learning, but they have not supported backpropagation-based direct training of deep SNNs on the same multi-core fabric. In practice, training is often done on GPUs, or a hybrid loop is used in which the neuromorphic chip runs inference and a GPU performs the backward pass.

The authors argue that making training efficient on a multi-core neuromorphic design faces three concrete difficulties.

First, the arithmetic is mixed and the dependencies are two-dimensional. FP can treat spikes as 0 or 1 and often replace a multiply-add with a gated addition, but BP works with floating-point gradients. Data must also stay consistent both across layers (space) and across the network’s discrete time steps (time), and the backward pass runs those time steps in reverse.

Second, communication is heavier than in inference. During training, spikes, membrane potentials, and gradients have to travel forward and backward, between engines in the same core and between cores that hold different layers.

Third, training creates a large volume of intermediate data. If that traffic spills off-chip into DRAM, energy rises quickly, because a DRAM access typically costs much more energy than reading on-chip SRAM.

The aim of the paper is a multi-core, sparsity-aware architecture that can deploy a full deep SNN across cores and train it with backpropagation.

## Method

The proposed design is a <b>32-core near-memory</b> architecture. The cores are arranged in a 4×8 two-dimensional mesh and share off-chip DRAM. Each core has its own on-chip SRAM and a router, and the 32 cores together provide 64.78 MB of SRAM. “Near-memory” here means that the compute engines sit next to this local SRAM, so they can reuse data on-chip instead of going out to DRAM for every step.

Each core contains three engines, all operating at 16-bit floating point (FP16):

- The <b>FP engine</b> performs the forward pass. Its main array is a 16×16 bank of selectors and adders. Because a spike is only 0 or 1, the engine adds a weight only when the corresponding spike is 1; it does not need a full multiplier for that convolution. A Soma module then updates the LIF membrane potential, and a Fire module compares it with a threshold to emit a spike. Spikes themselves are stored as a single bit.
- The <b>BP engine</b> sends gradients backward. Its array is a 16×16 multiply-accumulate unit that combines membrane-potential gradients with rotated weights. A Grad module computes spike gradients and the surrogate gradient used in place of the hard spike threshold.
- The <b>WG engine</b> accumulates weight gradients from spikes and from the backward signal. It also implements weight decay, a standard regularizer that slightly shrinks weights to reduce overfitting.

These three engines can work at the same time. Across cores, different layers, or segments of a layer, are mapped onto different engines, so one core can be computing the forward pass of a layer for one sample while another core is already doing the backward pass of another layer, possibly for a different sample. Inside a single core, the FP and BP engines can process the same layer on different samples in opposite time-step order, while the WG engine computes weight gradients for the next layer in parallel. That is the paper’s engine-level plus core-level parallelism.

Data movement is organized to increase reuse. The FP and BP engines keep weights stationary in the processing elements (a <b>weight-stationary</b> dataflow), so each weight is read once from SRAM during a convolution. The WG engine uses an <b>output-stationary</b> dataflow, keeping partial weight gradients in the array while they accumulate. Routers have six channels: four for north, south, east, and west, and two dedicated to the forward and backward sub-cores. A unified packet format carries both single-bit spikes and FP16 values. In the RTL design, cores run at 500 MHz and routers at 667 MHz under a globally asynchronous, locally synchronous (GALS) scheme, which is intended to raise on-chip bandwidth (the authors report 170 Gbps in this configuration) and to avoid a single global clock tree.

The engines also include sparsity-aware control. If a group of input spikes is zero, the corresponding additions, multiplications, or SRAM reads can be skipped. The same idea is applied to silent surrogate-gradient values and to zero membrane-potential gradients. In other words, the hardware tries to turn the natural silence of an SNN into fewer operations, not just a smaller stored spike.

A software toolchain compiles an SNN, maps layers onto cores, and deploys the whole model at once. After that one-time deployment, a batch can be trained without the host repeatedly shipping layer-by-layer instructions, which is how GPU training is often orchestrated.

![Figure 2. The multi-core architecture for SNN training (Li et al., 2026, Fig. 2). Panel a is one computing core: a yellow FP sub-core on the right, a blue BP sub-core with both the BP and WG engines on the left, and a shared router in the middle, with DRAM along the top. Panel b places many such cores in a mesh with off-chip interfaces. Panels c and d zoom in on the Soma and Grad modules that update membrane potentials and gradients. Panel g marks the two clock domains used in the RTL design, 500 MHz for cores and 667 MHz for routers. Panels i and j show how a full model is deployed once and then trained with forward and backward work overlapping across cores and time steps.](/img/readApaper-25/Fig2_multicore_architecture.png)

<i>Figure 2. The multi-core architecture for SNN training (Li et al., 2026, Fig. 2). Panel a is one computing core: a yellow FP sub-core on the right, a blue BP sub-core with both the BP and WG engines on the left, and a shared router in the middle, with DRAM along the top. Panel b places many such cores in a mesh with off-chip interfaces. Panels c and d zoom in on the Soma and Grad modules that update membrane potentials and gradients. Panel g marks the two clock domains used in the RTL design, 500 MHz for cores and 667 MHz for routers. Panels i and j show how a full model is deployed once and then trained with forward and backward work overlapping across cores and time steps.</i>

## Experiments

The paper evaluates the design in three complementary ways. The results below should be read with that split in mind.

<b>Software simulation of the 32-core design.</b> The authors built a simulator, S-ZigZag, to estimate throughput, utilization, and memory traffic for the 32-core architecture. They compared it with backpropagation-through-time training of the same spiking models in PyTorch on an NVIDIA A100 80 GB GPU and on an NVIDIA Jetson AGX Orin (64 GB). The models were Spiking ResNet-18, Spiking ResNet-50, and spiking VGG-16. Speed and DRAM comparisons used ImageNet-2012 training traffic at batch sizes 16, 32, 64, and 128. On the GPU side, peak memory came from PyTorch’s allocator API and DRAM traffic from NVIDIA Nsight Compute. On the proposed architecture, models were partitioned across 32 cores and simulated for one training batch.

<b>RTL and gate-level analysis in a 28 nm process.</b> The register-transfer-level design was synthesized with a TSMC N28HPC library. Area and power were estimated with Synopsys DC and VCS. The headline energy-efficiency number uses the typical-typical corner at 0.9 V and 25 °C (tt\_0.9V\_25°C), with engine clocks at 500 MHz and router clocks at 667 MHz. Sparse-optimization savings were computed from gate-level power on test cases that replayed the spike, surrogate-gradient, and gradient sparsity observed while training Spiking ResNet-18, Spiking ResNet-50, and spiking VGG-9 (VGG-9 here, not VGG-16). The reduction was defined relative to a 0%-sparsity case and a 100%-sparsity case, so that power unrelated to sparsity could be removed from the comparison.

<b>FPGA prototype.</b> The same architecture was implemented on five Xilinx VCU128 boards plus a host CPU (Lenovo ThinkSystem SR670), connected over PCIe 3.0 and 100 Gb/s Ethernet between FPGAs. This mapping used <b>20 cores</b> (four per board) in a 2×10 mesh. On the FPGA, each computing core ran at 150 MHz and each router at 200 MHz, lower than the 500/667 MHz clocks used in the 28 nm analysis. All FP, BP, and WG convolutions of training ran on the FPGAs. The authors trained Spiking ResNet-18 from scratch on MNIST, CIFAR-10, and CIFAR-100, then demonstrated continual learning and five-worker federated learning in a smart-traffic setting, using a traffic-sign dataset, a vehicle-and-pedestrian dataset, and IBM DVS-Gesture.

## Results

<b>Simulated training throughput and memory traffic.</b> In the 32-core software simulations, average training throughput was 233.8, 115.8, and 44.8 frames per second for Spiking ResNet-18, Spiking ResNet-50, and spiking VGG-16, respectively. Relative to the A100, that was about 16–18% of the GPU’s training speed for ResNet-18, about 38–40% for ResNet-50, and about 19–24% for VGG-16, depending on batch size. The authors note that the 32-core design’s peak compute is 16 TFLOPS at FP16, which is 5.13% of the 312 TFLOPS listed for the A100 in their comparison table. Relative to the Jetson AGX Orin, the same simulated throughputs were 190%, 330%, and 210% of the Orin’s measured training speed on the three models—that is, about 1.9×, 3.3×, and 2.1×. From the same 32-core speed estimates, fine-tuning Spiking ResNet-18 on new CIFAR-10 samples took 9.19 minutes, training that model from scratch on CIFAR-10 took 2.30 hours (the main text rounds this to 2.5 hours), and fine-tuning a three-layer spiking CNN on traffic-sign data took 9.29 seconds (Supplementary Table 11).

DRAM occupancy on the simulated architecture was lower than on the A100 by about 42–59% for ResNet-18, 45–60% for ResNet-50, and 60–75% for VGG-16, with larger savings at larger batch sizes. Most of the A100’s occupancy was intermediate data, and that component fell by about 62–78% in the simulated design. DRAM access volume fell by about 57% for ResNet-18 and by about 83–86% for ResNet-50 and VGG-16, matching the abstract’s overall 55–85% range. Simulated throughput also rose nearly linearly as the core count was scaled from 16 to 64.

![Figure 3. Dataflows and simulated training comparisons (Li et al., 2026, Fig. 3). Panels a–c show how the FP, BP, and WG engines reuse weights or partial results. Panels d–f plot engine utilization over two training batches. In panels g–l, orange bars are the A100 and blue bars are the simulated 32-core design: g–i are DRAM occupancy, j–l are DRAM access. Panels m–o compare training throughput in frames per second, now also including the Jetson AGX Orin in green; the blue bars sit between the green and the orange. Panels p and q show throughput rising nearly linearly with core count. Panels r–t break DRAM occupancy into intermediate data, optimizer state, weights, and weight gradients at batch size 16.](/img/readApaper-25/Fig3_dataflow_performance.png)

<i>Figure 3. Dataflows and simulated training comparisons (Li et al., 2026, Fig. 3). Panels a–c show how the FP, BP, and WG engines reuse weights or partial results. Panels d–f plot engine utilization over two training batches. In panels g–l, orange bars are the A100 and blue bars are the simulated 32-core design: g–i are DRAM occupancy, j–l are DRAM access. Panels m–o compare training throughput in frames per second, now also including the Jetson AGX Orin in green; the blue bars sit between the green and the orange. Panels p and q show throughput rising nearly linearly with core count. Panels r–t break DRAM occupancy into intermediate data, optimizer state, weights, and weight gradients at batch size 16.</i>

<b>28 nm area, power, and sparse energy savings.</b> Under tt\_0.9V\_25°C, the 32-core design is reported at 16 TFLOPS (FP16, 500 MHz), 14.49 W, an area of 218.63 mm², and an energy efficiency of <b>1.05 TFLOPS/W at FP16 in 28 nm</b>. In Table 1 of the paper, that efficiency is placed next to reported peak efficiencies of 0.78, 0.83, and 0.91 TFLOPS/W for an A100, a Graphcore processor, and DOJO D1, which are 7 nm general-purpose AI designs. Gate-level power analysis of the sparsity-aware circuits reduced compute-core energy by 61.09%, 46.81%, and 51.69% for Spiking ResNet-18, ResNet-50, and VGG-9, respectively. Those totals come from larger relative savings in the BP and WG engines than in the FP engine.

![Figure 4. Sparse computation optimization (Li et al., 2026, Fig. 4). Panels a–c are the control circuits in the FP, BP, and WG engines. Red and orange lines are gating signals: when spikes, surrogate gradients, or membrane-potential gradients are zero, the corresponding adders, multipliers, or SRAM reads can be skipped. Panels d–f compare gate-level power with and without this sparse control for Spiking ResNet-18, ResNet-50, and VGG-9. Blue bars are the unoptimized case, orange bars are the sparse case, and the percentages are the reductions for each engine and for the total.](/img/readApaper-25/Fig4_sparse_optimization.png)

<i>Figure 4. Sparse computation optimization (Li et al., 2026, Fig. 4). Panels a–c are the control circuits in the FP, BP, and WG engines. Red and orange lines are gating signals: when spikes, surrogate gradients, or membrane-potential gradients are zero, the corresponding adders, multipliers, or SRAM reads can be skipped. Panels d–f compare gate-level power with and without this sparse control for Spiking ResNet-18, ResNet-50, and VGG-9. Blue bars are the unoptimized case, orange bars are the sparse case, and the percentages are the reductions for each engine and for the total.</i>

<b>FPGA training, continual learning, and federated learning.</b> On the 20-core FPGA system, Spiking ResNet-18 trained from scratch reached 99.23% accuracy on MNIST, 85.5% on CIFAR-10, and 63.89% on CIFAR-100. Compared with GPU training, the accuracy drops were 0.05, 0.49, and 2.41 percentage points. Weight decay in the WG engine improved the CIFAR-100 accuracy from 62.59% to 63.89%. In continual learning, a pre-trained SNN was fine-tuned on new classes; accuracy on mixed old and new data rose from 75.01% to 92.98% on traffic signs, from 58.09% to 91.30% on vehicle and pedestrian detection, and from 43.06% to 85.47% on DVS-Gesture. In five-worker federated learning, each worker ran on one FPGA, with worker 1 also acting as the server, and the federated model reached 94.75% on traffic signs and 84.03% on DVS-Gesture, above the individual workers.

![Figure 5. FPGA implementation and applications (Li et al., 2026, Fig. 5). Panels a and b show the host, the five FPGA boards, and the Ethernet adapter used for inter-board traffic. Panels c and d outline the software toolchain and the deploy-then-train flow. Panel e maps a 20-core mesh across five FPGAs; panels f and g are accuracy and loss for Spiking ResNet-18 trained from scratch on MNIST, CIFAR-10, and CIFAR-100. Panels i–l illustrate continual learning: the orange curves, which adapt after new classes appear, finish above the blue curves that do not. Panels m–r show five-worker federated learning, with the red federated-model curve above the gray curves of the individual workers.](/img/readApaper-25/Fig5_FPGA_implementation.png)

<i>Figure 5. FPGA implementation and applications (Li et al., 2026, Fig. 5). Panels a and b show the host, the five FPGA boards, and the Ethernet adapter used for inter-board traffic. Panels c and d outline the software toolchain and the deploy-then-train flow. Panel e maps a 20-core mesh across five FPGAs; panels f and g are accuracy and loss for Spiking ResNet-18 trained from scratch on MNIST, CIFAR-10, and CIFAR-100. Panels i–l illustrate continual learning: the orange curves, which adapt after new classes appear, finish above the blue curves that do not. Panels m–r show five-worker federated learning, with the red federated-model curve above the gray curves of the individual workers.</i>

## Analysis

The central design idea is to treat training as a first-class workload for a neuromorphic multi-core chip, not as a step that must be finished on a GPU. Three specialized engines in every core, plus a mesh that can move both spikes and gradients, are what make a distributed backward pass possible. The sparsity circuits and the dataflows then try to keep that extra training traffic from turning into a DRAM-energy problem.

The numbers support that story when they are kept in their own evaluation lane. The comparisons with the A100 and the Jetson AGX Orin are <b>software simulations of a 32-core, 500 MHz design</b> against measured PyTorch training on those platforms. Under the authors’ simulator, the design delivers a substantial fraction of A100 training throughput with a much smaller peak-FLOPS budget, exceeds a popular edge GPU’s training speed on the same tasks, and cuts DRAM occupancy and access. Those figures are simulator estimates, not wall-clock timings from a fabricated 28 nm chip.

The 1.05 TFLOPS/W figure is a <b>gate-level power result</b> for that 32-core RTL design in TSMC 28 nm at a specified process corner, voltage, and temperature, using 16-bit floating point and the 500/667 MHz clocks. It is an architectural efficiency estimate, and it is the number the authors compare with 7 nm GPU-class parts in Table 1. It is not a measurement of the FPGA boards, whose cores run at 150 MHz, and it is not a measurement from a fabricated chip.

The FPGA results are the place where the architecture is shown to train in hardware. With 20 cores and lower clocks, Spiking ResNet-18 converges on standard image datasets with only a small accuracy gap relative to a GPU, and the same platform can fine-tune a model on new classes or aggregate five workers in federated learning. Those experiments speak to functional correctness and application flexibility. They are separate from the 1.05 TFLOPS/W figure and from the A100 memory-traffic percentages.

Taken together, the evidence supports a coherent claim: a multi-core neuromorphic architecture can be built around backpropagation training of deep SNNs; its simulated and analyzed 32-core form looks competitive on speed and memory traffic; and a reduced-scale FPGA mapping can perform that training.

## Summary

If you remember one thing, remember the split between inference and training. This paper’s contribution is a 32-core neuromorphic design in which every core has feedforward, backpropagation, and weight-gradient engines, so a deep SNN can be trained on the fabric itself. Software simulation of that design shows training throughput above a Jetson AGX Orin and a fraction of an A100, with substantially less DRAM traffic. A 28 nm gate-level analysis yields 1.05 TFLOPS/W at FP16 under the stated conditions. An FPGA prototype with 20 cores then shows that the same idea can train, fine-tune, and federate models in hardware.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-11 · Nature Communications, 2026</i>

大多数神经形态芯片的设计目标，是把已经训练好的脉冲网络<b>跑起来</b>。这篇论文则设计了一种多核架构，让同一套阵列也能用反向传播去<b>训练</b>深度脉冲网络，并用软件仿真、晶体管级分析和 FPGA 原型三条路径分别检验这套设计。

## 背景

模型一旦离开服务器就不再学习，很难适应许多边缘场景。路口摄像头、机器人或可穿戴传感器会遇到新的目标、光线或使用者。把所有新样本送到云端可能慢、贵，也不利于隐私保护。这就是<b>边缘训练</b>的动机：在设备上或设备附近更新模型，使它能适应变化的环境。

<b>脉冲神经网络</b>（SNN）是实现这一点的一条候选路线。常规人工神经网络里，神经元传递的是连续数值，也就是激活值。在 SNN 里，神经元主要用短暂的事件——<b>脉冲</b>——来通信：某一时刻它要么发放（1），要么沉默（0）。本文采用的是<b>漏积分发放</b>（LIF）神经元。输入脉冲按突触权重累加到称为<b>膜电位</b>的内部电压上，该电压也会随时间泄漏。一旦越过阈值，神经元就发出一个脉冲并复位。由于许多神经元大部分时间保持沉默，大量计算原则上可以跳过。这种稀疏性，是人们指望 SNN 实现高能效计算的重要原因。

<b>神经形态</b>硬件试图利用这种计算方式。TrueNorth、Loihi、Tianjic、Darwin 等芯片通常把许多小核排成二维网格，尤其擅长<b>推理</b>：把网络向前运行以得到预测。有些芯片也支持<b>局部学习</b>规则，例如依赖脉冲时间的突触可塑性，用邻近活动来调整突触。这些规则有用，但一般局限于较浅的网络。

训练<b>深度</b>网络——现代图像识别里那种多层模型——通常依赖<b>反向传播</b>。过程分成三个阶段：

1. <b>前向传播（FP）</b>，也就是推理：输入逐层传递，更新膜电位并产生脉冲。
2. <b>反向传播（BP）</b>：把预测与正确标签比较，再把误差信号逐层传回，使每个神经元得到一个<b>梯度</b>，即“为了减小误差，它的活动该如何改变”。脉冲函数本身不可微，因此训练时用光滑的替代函数，称为<b>代理梯度</b>。
3. <b>权值梯度（WG）</b>计算：把这些误差信号与前向过程中的脉冲结合起来，得到每个权重应如何更新。

推理只是其中第一阶段。训练需要全部三个阶段，还要在层与时间步之间保存中间结果，因此数据搬移要多得多。把训练而不只是推理放到神经形态阵列上，正是这篇论文要解决的问题。

![图 1. 神经形态计算与 SNN 训练（Li 等，2026，Fig. 1）。面板 a 对比了神经形态硬件的优势，以及反向传播难以落到这类芯片上的原因，并勾勒出本文的多核设计与 FPGA 演示。面板 b 给出训练的三个计算阶段：前向（FP）、反向（BP）和权值梯度（WG）。面板 c 跟踪卷积层中的漏积分发放神经元：脉冲与权重形成膜电位，再与阈值比较后发出脉冲。面板 d 把这些阶段沿时间步和层展开：FP 沿时间向前，BP 沿时间向后，WG 则从两者中累积更新。](/img/readApaper-25/Fig1_neuromorphic_SNN.png)

<i>图 1. 神经形态计算与 SNN 训练（Li 等，2026，Fig. 1）。面板 a 对比了神经形态硬件的优势，以及反向传播难以落到这类芯片上的原因，并勾勒出本文的多核设计与 FPGA 演示。面板 b 给出训练的三个计算阶段：前向（FP）、反向（BP）和权值梯度（WG）。面板 c 跟踪卷积层中的漏积分发放神经元：脉冲与权重形成膜电位，再与阈值比较后发出脉冲。面板 d 把这些阶段沿时间步和层展开：FP 沿时间向前，BP 沿时间向后，WG 则从两者中累积更新。</i>

## 问题

在作者的回顾中，现有的多核神经形态处理器可以运行 SNN，有时也能做局部学习，但还不能在同一套多核阵列上，用反向传播直接训练深度 SNN。实际中，训练往往在 GPU 上完成，或者采用混合回路：神经形态芯片做推理，GPU 做反向传播。

作者认为，要在多核神经形态设计上高效完成训练，有三个具体难点。

第一，运算类型混杂，依赖关系是二维的。FP 可以把脉冲当作 0 或 1，常常用门控加法代替乘加；BP 则处理浮点梯度。数据还要在层与层之间（空间）和网络的离散时间步之间（时间）保持一致，而反向过程会按相反的时间顺序进行。

第二，通信负担比推理更重。训练时，脉冲、膜电位和梯度既要正向也要反向传递，既发生在同一核内的引擎之间，也发生在承载不同层的核与核之间。

第三，训练会产生大量中间数据。如果这些访问溢出到片外 DRAM，能耗会迅速上升，因为一次 DRAM 访问的能耗通常远高于读取片上 SRAM。

本文的目标，就是做成一种感知稀疏性的多核架构，能把完整的深度 SNN 分布到各个核上，并用反向传播来训练。

## 方法

提出的方案是一种<b>32 核近存</b>架构。计算核排成 4×8 的二维网格，共享片外 DRAM。每个核有自己的片上 SRAM 和路由器，32 核合计提供 64.78 MB SRAM。这里的“近存”，是指计算引擎紧挨着本地 SRAM，从而可以在片上复用数据，而不必每一步都访问 DRAM。

每个核包含三个引擎，均采用 16 位浮点（FP16）：

- <b>FP 引擎</b>做前向计算。主阵列是 16×16 的选择器与加法器。由于脉冲只有 0 或 1，对应脉冲为 1 时才把权重加进去，这种卷积不需要完整的乘法器。随后 Soma 模块更新 LIF 膜电位，Fire 模块与阈值比较后发出脉冲。脉冲本身用 1 比特存储。
- <b>BP 引擎</b>把梯度向后传递。其阵列是 16×16 的乘加单元，把膜电位梯度与旋转后的权重结合。Grad 模块计算脉冲梯度和用来代替硬阈值的代理梯度。
- <b>WG 引擎</b>根据脉冲和反向信号累积权值梯度。它还实现了权值衰减，这是一种略微缩小权重、减轻过拟合的常规正则方法。

三个引擎可以同时工作。在核与核之间，不同层（或一层的不同片段）被映射到不同引擎上，因此一个核可以为某个样本计算某一层的前向，另一个核已经在为另一层、甚至另一个样本做反向。在同一核内，FP 与 BP 引擎可以按相反的时间步顺序，为同一层的不同样本计算；WG 引擎则并行计算下一层的权值梯度。这就是论文所说的引擎级加核级并行。

数据流的设计着眼于提高复用。FP 和 BP 引擎采用<b>权值静止</b>数据流，把权重留在处理单元里，一次卷积过程中每个权重只需从 SRAM 读一次。WG 引擎采用<b>输出静止</b>数据流，让部分权值梯度在阵列中累积。路由器有六个通道：东南西北四个方向，再加上前向、反向子核各一条专用通道。统一的数据包格式可以同时承载 1 比特脉冲和 FP16 数值。在 RTL 设计中，计算核工作在 500 MHz，路由器工作在 667 MHz，采用全局异步局部同步（GALS）方案，以提高片上带宽（作者在该配置下给出 170 Gbps），并避免单一的全局时钟树。

引擎里还加入了感知稀疏性的控制电路。如果一组输入脉冲全为 0，相应的加法、乘法或 SRAM 读取就可以跳过。对为 0 的代理梯度和膜电位梯度，也采用同样的思路。也就是说，硬件试图把 SNN 固有的“沉默”变成更少的操作，而不仅仅是更省的脉冲存储。

配套的软件工具链负责编译 SNN、把层映射到核上，并一次性部署整个模型。完成这一次部署后，一批样本的训练不必再由主机像 GPU 训练中常见的那样，反复按层下发指令。

![图 2. 用于 SNN 训练的多核架构（Li 等，2026，Fig. 2）。面板 a 是单个计算核：右侧黄色为 FP 子核，左侧蓝色为同时包含 BP 与 WG 引擎的 BP 子核，中间是共享路由器，顶部是 DRAM。面板 b 把许多这样的核排成网格，并画出片外接口。面板 c、d 放大显示更新膜电位和梯度的 Soma、Grad 模块。面板 g 标出 RTL 设计中的两个时钟域：计算核 500 MHz，路由器 667 MHz。面板 i、j 说明模型只需部署一次，随后前向与反向工作就可以在不同核和时间步上重叠进行。](/img/readApaper-25/Fig2_multicore_architecture.png)

<i>图 2. 用于 SNN 训练的多核架构（Li 等，2026，Fig. 2）。面板 a 是单个计算核：右侧黄色为 FP 子核，左侧蓝色为同时包含 BP 与 WG 引擎的 BP 子核，中间是共享路由器，顶部是 DRAM。面板 b 把许多这样的核排成网格，并画出片外接口。面板 c、d 放大显示更新膜电位和梯度的 Soma、Grad 模块。面板 g 标出 RTL 设计中的两个时钟域：计算核 500 MHz，路由器 667 MHz。面板 i、j 说明模型只需部署一次，随后前向与反向工作就可以在不同核和时间步上重叠进行。</i>

## 实验

这篇论文用三条互补的路径评估该设计。下面的结果需要按这条分界来读。

<b>32 核设计的软件仿真。</b>作者基于 S-ZigZag 仿真器，估计 32 核架构的吞吐、利用率和访存。对照是在 NVIDIA A100 80 GB GPU 和 NVIDIA Jetson AGX Orin（64 GB）上，用 PyTorch 对同一组脉冲模型做随时间反向传播（BPTT）训练。模型为 Spiking ResNet-18、Spiking ResNet-50 和脉冲 VGG-16。速度和 DRAM 对比使用 ImageNet-2012 的训练访存，批大小为 16、32、64 和 128。GPU 一侧，峰值显存来自 PyTorch 分配接口，DRAM 访问量来自 NVIDIA Nsight Compute。在所提出的架构上，模型被划分到 32 个核，并仿真一批训练。

<b>28 nm 工艺下的 RTL 与门级分析。</b>寄存器传输级设计用 TSMC N28HPC 库综合，面积和功耗用 Synopsys DC 与 VCS 估计。主要能效数字采用典型工艺角、0.9 V、25 °C（tt\_0.9V\_25°C），引擎时钟 500 MHz、路由器时钟 667 MHz。稀疏优化带来的节省，来自门级功耗分析，测试用例复现了训练 Spiking ResNet-18、Spiking ResNet-50 和脉冲 VGG-9 时观察到的脉冲、代理梯度和梯度稀疏性（这里是 VGG-9，不是 VGG-16）。降低比例是相对于 0% 稀疏和 100% 稀疏两种情形定义的，以便去掉与稀疏无关的功耗。

<b>FPGA 原型。</b>同一架构被实现在五块 Xilinx VCU128 开发板和一台主机 CPU（联想 ThinkSystem SR670）上，FPGA 与主机通过 PCIe 3.0 连接，板间通过 100 Gb/s 以太网连接。这次映射使用<b>20 个核</b>（每板 4 个），拓扑为 2×10 网格。在 FPGA 上，计算核运行在 150 MHz，路由器运行在 200 MHz，低于 28 nm 分析中的 500/667 MHz。训练中的全部 FP、BP、WG 卷积都在 FPGA 上完成。作者用 Spiking ResNet-18 在 MNIST、CIFAR-10 和 CIFAR-100 上从头训练，随后在智慧交通场景中演示了持续学习和五工作者联邦学习，数据包括交通标志、车辆与行人，以及 IBM DVS-Gesture。

## 结果

<b>仿真得到的训练吞吐与访存。</b>在 32 核软件仿真中，Spiking ResNet-18、Spiking ResNet-50 和脉冲 VGG-16 的平均训练吞吐分别为每秒 233.8、115.8 和 44.8 帧。相对 A100，ResNet-18 约为 GPU 训练速度的 16–18%，ResNet-50 约为 38–40%，VGG-16 约为 19–24%，随批大小略有变化。作者指出，32 核设计的峰值算力为 FP16 下 16 TFLOPS，相当于他们对照表中 A100 的 312 TFLOPS 的 5.13%。相对 Jetson AGX Orin，同样的仿真吞吐分别是 Orin 实测训练速度的 190%、330% 和 210%，也就是大约 1.9 倍、3.3 倍和 2.1 倍。根据同一套 32 核速度估计，在新的 CIFAR-10 样本上微调 Spiking ResNet-18 需要 9.19 分钟，在 CIFAR-10 上从头训练该模型需要 2.30 小时（正文里约写成 2.5 小时），在交通标志数据上微调一个三层脉冲 CNN 需要 9.29 秒（补充表 11）。

仿真架构的 DRAM 占用相对 A100 更低：ResNet-18 约低 42–59%，ResNet-50 约低 45–60%，VGG-16 约低 60–75%，批越大节省越多。A100 占用中的大部分是中间数据，这一部分在仿真设计中下降了约 62–78%。DRAM 访问量方面，ResNet-18 约下降 57%，ResNet-50 和 VGG-16 约下降 83–86%，与摘要中 55–85% 的总体范围一致。把核数从 16 扩到 64 时，仿真吞吐也接近线性上升。

![图 3. 数据流与仿真训练对比（Li 等，2026，Fig. 3）。面板 a–c 展示 FP、BP、WG 引擎如何复用权重或部分结果。面板 d–f 画出两个训练批次中的引擎利用率。面板 g–l 中，橙色是 A100，蓝色是仿真的 32 核设计：g–i 是 DRAM 占用，j–l 是 DRAM 访问量。面板 m–o 比较以帧/秒计的训练吞吐，并加上绿色的 Jetson AGX Orin；蓝条位于绿条与橙条之间。面板 p、q 显示吞吐随核数接近线性上升。面板 r–t 在批大小为 16 时，把 DRAM 占用拆成中间数据、优化器状态、权重和权值梯度。](/img/readApaper-25/Fig3_dataflow_performance.png)

<i>图 3. 数据流与仿真训练对比（Li 等，2026，Fig. 3）。面板 a–c 展示 FP、BP、WG 引擎如何复用权重或部分结果。面板 d–f 画出两个训练批次中的引擎利用率。面板 g–l 中，橙色是 A100，蓝色是仿真的 32 核设计：g–i 是 DRAM 占用，j–l 是 DRAM 访问量。面板 m–o 比较以帧/秒计的训练吞吐，并加上绿色的 Jetson AGX Orin；蓝条位于绿条与橙条之间。面板 p、q 显示吞吐随核数接近线性上升。面板 r–t 在批大小为 16 时，把 DRAM 占用拆成中间数据、优化器状态、权重和权值梯度。</i>

<b>28 nm 面积、功耗与稀疏节能。</b>在 tt\_0.9V\_25°C 条件下，32 核设计的报告值为：16 TFLOPS（FP16，500 MHz）、14.49 W、面积 218.63 mm²，能效为<b>28 nm 工艺、FP16 下 1.05 TFLOPS/W</b>。在论文表 1 中，这一能效被放在 A100、Graphcore 和 DOJO D1 所报告的峰值能效 0.78、0.83 和 0.91 TFLOPS/W 旁边，后三者是 7 nm 的通用 AI 设计。对稀疏电路的门级功耗分析显示，训练 Spiking ResNet-18、ResNet-50 和 VGG-9 时，计算核能量分别下降 61.09%、46.81% 和 51.69%。其中 BP 和 WG 引擎的相对降幅大于 FP 引擎。

![图 4. 稀疏计算优化（Li 等，2026，Fig. 4）。面板 a–c 是 FP、BP、WG 引擎中的控制电路。红线与橙线是门控信号：当脉冲、代理梯度或膜电位梯度为 0 时，相应的加法器、乘法器或 SRAM 读取可以跳过。面板 d–f 比较有无这种稀疏控制时，Spiking ResNet-18、ResNet-50 和 VGG-9 的门级功耗。蓝条是未优化情形，橙条是稀疏优化情形，百分数是各引擎以及总体的下降幅度。](/img/readApaper-25/Fig4_sparse_optimization.png)

<i>图 4. 稀疏计算优化（Li 等，2026，Fig. 4）。面板 a–c 是 FP、BP、WG 引擎中的控制电路。红线与橙线是门控信号：当脉冲、代理梯度或膜电位梯度为 0 时，相应的加法器、乘法器或 SRAM 读取可以跳过。面板 d–f 比较有无这种稀疏控制时，Spiking ResNet-18、ResNet-50 和 VGG-9 的门级功耗。蓝条是未优化情形，橙条是稀疏优化情形，百分数是各引擎以及总体的下降幅度。</i>

<b>FPGA 上的训练、持续学习与联邦学习。</b>在 20 核 FPGA 系统上，从头训练的 Spiking ResNet-18 在 MNIST、CIFAR-10 和 CIFAR-100 上分别达到 99.23%、85.5% 和 63.89% 的准确率。相对 GPU 训练，准确率下降为 0.05、0.49 和 2.41 个百分点。WG 引擎中的权值衰减把 CIFAR-100 准确率从 62.59% 提高到 63.89%。在持续学习中，预训练 SNN 用新类别微调后，在新旧数据混合测试上的准确率，交通标志从 75.01% 升至 92.98%，车辆与行人检测从 58.09% 升至 91.30%，DVS-Gesture 从 43.06% 升至 85.47%。在五工作者联邦学习中，每个工作者占用一块 FPGA（工作者 1 同时作为服务器），联邦模型在交通标志和 DVS-Gesture 上分别达到 94.75% 和 84.03%，高于各个工作者单独的模型。

![图 5. FPGA 实现与应用（Li 等，2026，Fig. 5）。面板 a、b 给出主机、五块 FPGA 开发板，以及板间通信用的以太网适配器。面板 c、d 概括软件工具链和“先部署再训练”的流程。面板 e 把 20 核网格映射到五块 FPGA 上；面板 f、g 是 Spiking ResNet-18 在 MNIST、CIFAR-10 和 CIFAR-100 上从头训练的准确率与损失。面板 i–l 展示持续学习：出现新类别后继续适应的橙线，最终高于不再适应的蓝线。面板 m–r 是五工作者联邦学习，红色联邦模型曲线高于各个工作者的灰色曲线。](/img/readApaper-25/Fig5_FPGA_implementation.png)

<i>图 5. FPGA 实现与应用（Li 等，2026，Fig. 5）。面板 a、b 给出主机、五块 FPGA 开发板，以及板间通信用的以太网适配器。面板 c、d 概括软件工具链和“先部署再训练”的流程。面板 e 把 20 核网格映射到五块 FPGA 上；面板 f、g 是 Spiking ResNet-18 在 MNIST、CIFAR-10 和 CIFAR-100 上从头训练的准确率与损失。面板 i–l 展示持续学习：出现新类别后继续适应的橙线，最终高于不再适应的蓝线。面板 m–r 是五工作者联邦学习，红色联邦模型曲线高于各个工作者的灰色曲线。</i>

## 分析

核心设计思想，是把训练当作神经形态多核芯片的一类一等负载，而不是必须先在 GPU 上完成的步骤。每个核里的三个专用引擎，再加上能够同时搬运脉冲与梯度的网格，使分布式反向传播成为可能。稀疏电路和数据流，则试图避免这些额外的训练流量变成 DRAM 能耗问题。

只有把数字留在各自的评估路径里，它们才支持上述判断。与 A100 和 Jetson AGX Orin 的对比，是<b>对 32 核、500 MHz 设计的软件仿真</b>，对照的是这些平台上实测的 PyTorch 训练。在作者的仿真器下，该设计能以小得多的峰值算力，达到 A100 训练吞吐的可观比例，并在相同任务上超过一款常见边缘 GPU 的训练速度，同时降低 DRAM 占用和访问。这些数字是仿真估计，而不是已制造的 28 nm 芯片上的墙钟时间。

1.05 TFLOPS/W 是该 32 核 RTL 设计在 TSMC 28 nm、指定工艺角、电压和温度下的<b>门级功耗结果</b>，精度为 16 位浮点，时钟为 500/667 MHz。它可以作为架构能效估计，也是作者在表 1 中与 7 nm GPU 类芯片比较的数字。它不是 FPGA 开发板的测量值（FPGA 上计算核运行在 150 MHz），也不是已流片芯片的测量值。

FPGA 结果则说明这套架构能够在硬件上完成训练。在 20 核、较低时钟的条件下，Spiking ResNet-18 能在标准图像数据集上收敛，与 GPU 的准确率差距很小；同一平台还可以在新类别上微调，或在联邦学习中聚合五个工作者。这些实验支持的是功能正确性和应用灵活性，而不是 1.05 TFLOPS/W，也不是相对 A100 的访存比例。

综合来看，现有证据支持一个连贯的判断：可以围绕深度 SNN 的反向传播训练来构建多核神经形态架构；其仿真和分析中的 32 核形态在速度和访存上具有竞争力；缩小规模后的 FPGA 映射也确实能够完成这种训练。

## 总结

如果只记一件事，请记住推理和训练的区分。这篇论文的贡献，是一种每个核都包含前向、反向和权值梯度引擎的 32 核神经形态设计，从而可以在阵列本身上训练深度 SNN。对该设计的软件仿真显示，训练吞吐高于 Jetson AGX Orin，并达到 A100 的一部分，同时 DRAM 访问明显更少。28 nm 门级分析在给定条件下给出 FP16 的 1.05 TFLOPS/W。20 核的 FPGA 原型则表明，同一思路可以在硬件上完成训练、微调和联邦学习。

## References

- Li, M., Zhou, H., Xu, X., Zhong, Z., Quan, P., Zhu, X., Lin, Y., Lin, W., Li, X., Wang, D., Zhang, J., Ma, Y., Cui, X., Wang, W., Meng, Q., Ma, Z., Li, G., Cui, X., & Tian, Y. (2026). <i>A highly energy-efficient multi-core neuromorphic architecture for training deep spiking neural networks.</i> Nature Communications, 17, 4403. Published 25 March 2026. [doi.org/10.1038/s41467-026-70586-x](https://doi.org/10.1038/s41467-026-70586-x) · [Article](https://www.nature.com/articles/s41467-026-70586-x) · [PDF](https://www.nature.com/articles/s41467-026-70586-x.pdf)
- Supplementary information: [41467\_2026\_70586\_MOESM1\_ESM.pdf](https://static-content.springer.com/esm/art%3A10.1038%2Fs41467-026-70586-x/MediaObjects/41467_2026_70586_MOESM1_ESM.pdf)
- Code and data: [github.com/dayanhn/NeuroMC](https://github.com/dayanhn/NeuroMC) · [doi.org/10.5281/zenodo.18311893](https://doi.org/10.5281/zenodo.18311893)
- Figures 1–5 are from Li et al. (2026).
