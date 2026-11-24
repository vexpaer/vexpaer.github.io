---
title: "readApaper#42 Generating Coherent Patterns of Activity from Chaotic Neural Networks"
title_zh: "readApaper#42 Generating Coherent Patterns of Activity from Chaotic Neural Networks"
date: 2026-11-28 22:00:00
tags:
  - readApaper
  - neuroscience
  - reservoir-computing
  - recurrent-neural-networks
cover: /img/readapaper-cover.png
bilingual: true
mathjax: true
---

<i>Reading time: about 8 minutes · 28 November 2026 · Neuron, 2009</i>

A randomly connected network can begin in chaotic spontaneous activity and still be trained to produce a controlled output. The key is to keep the error small from the first moments of training, then find fixed weights that can hold that output on their own.

## Background

Neural circuits are busy even when they are not carrying out a particular action. Cortical neurons often fire in irregular, fluctuating patterns with no obvious external command, a regime often called <b>spontaneous activity</b>. The same circuits must also generate <b>coherent patterns</b>—reliable, structured time courses of activity—when they produce a movement or respond to a stimulus. Can a controlled action arise by reorganizing activity that was already there?

A useful starting point is a <b>recurrent network</b>, in which neurons connect not only forward but also back to one another. In a simple <b>firing-rate</b> description, each unit is summarized by a continuously varying output rather than by discrete spikes. If random recurrent connections are scaled by a gain \(g\), the network is effectively quiet for \(g < 1\), but becomes <b>chaotic</b> for \(g > 1\): its activity is irregular and exponentially sensitive to tiny differences in the starting state (Sompolinsky, Crisanti, & Sommers, 1988).

Training means changing synaptic strengths so that a defined <b>output</b> matches a <b>target function</b> \(f(t)\). Recurrent networks are harder to train than feedforward ones, and standard algorithms generally fail when the activity is chaotic (Doya, 1992). One influential workaround is the <b>echo-state</b> approach (Jaeger, 2003; Jaeger & Haas, 2004). A random recurrent network is left largely untrained; only a linear <b>readout</b>, a weighted sum of the network's rates, is learned. In the original echo-state procedure, networks started inactive, and during training the feedback pathway was <b>clamped</b> to the target. Clamping stops errors from ricocheting around the loop, but the learner then never samples the fluctuations that appear once the clamp is removed.

## Problem

Sussillo and Abbott ask how chaotic spontaneous activity can be reorganized into coherent, controlled outputs, including patterns generated with no external input. That no-input case is harder, because the network must keep producing the pattern on its own.

Three difficulties stand in the way. If a badly wrong output is fed back, activity can drift so far that learning never catches up. <b>Credit assignment</b>—deciding which synapses should change—is especially hard inside a recurrent circuit. And chaos must be kept in check during training, or the updates have no stable target to chase. The authors want a procedure that leaves the feedback loop intact, starts from a spontaneously chaotic network, and still converges to fixed weights that generate the pattern autonomously.

## Method

They call the procedure <b>FORCE learning</b>, for First-Order Reduced and Controlled Error. Conventional training begins with a large error and slowly chips it down. FORCE makes a large correction at the first update, keeps the error small from then on, and then searches for fixed weights that can maintain that already-small error without further change.

The workhorse architecture (Figure 1A) is a randomly connected <b>generator network</b> whose firing-rate vector \(r(t)\) drives a linear readout, \(z(t) = w^{T} r(t)\). The output \(z\) is fed back into the same network. During training, only the readout weights \(w\) (drawn in red) are modified; the recurrent connections stay at their random initial values.

Two other architectures move plasticity to more plausible places. In Figure 1B, a separate <b>feedback network</b> returns activity to the generator, and FORCE is applied both to the readout and to the synapses into that feedback network. In Figure 1C there is no external feedback loop: FORCE is applied to synapses inside the generator, as well as to the readout. In B and C, every modified synapse is updated with the same global error from the readout.

![Figure 1. Three architectures for FORCE learning. In each case a generator network with firing rates r drives a linear readout z through weights w (red). Only the red connections are modified during training. (A) Feedback to the generator comes from the readout itself. (B) A separate feedback network returns activity to the generator; the synapses J^{FG} from the generator into that network are also trained. (C) There is no external feedback loop. FORCE is applied to synapses J^{GG} inside the generator.](/img/readApaper-42/fig1_architectures.png)

<i>Figure 1. Three architectures for FORCE learning. In each case a generator network with firing rates \(r\) drives a linear readout \(z\) through weights \(w\) (red). Only the red connections are modified during training. (A) Feedback to the generator comes from the readout itself. (B) A separate feedback network returns activity to the generator; the synapses \(J^{FG}\) from the generator into that network are also trained. (C) There is no external feedback loop. FORCE is applied to synapses \(J^{GG}\) inside the generator.</i>

Leaving the loop closed does not destroy learning, because the updates are fast enough to keep the fed-back error small. The feedback is held close to the desired signal, but it is not clamped; leftover fluctuations let the procedure sample instabilities and stabilize them. The update rule used throughout is <b>recursive least squares</b> (RLS), which adjusts \(w\) at short intervals so that the first update already makes the error small.

Chaos is handled by the same loop. A feedback signal of sufficient amplitude and frequency can drive a chaotic rate network into a non-chaotic state (Molgedey, Schuchhardt, & Schuster, 1992; Bertschinger & Natschläger, 2004). If the target is too weak for the feedback to suppress chaos, learning fails. In the standard examples the generator has \(N = 1000\) units, 10% of possible recurrent connections present, a time constant \(\tau = 10\) ms, and recurrent gain \(g = 1.5\).

## Experiments

Every test in the paper is a computer simulation of these firing-rate models. The paper does not report new recordings from animals or people. Human motion-capture data enter only as target trajectories.

The first tests ask a Figure 1A network to produce a prescribed waveform with no external input, then to keep producing it after learning is turned off. Targets include a triangle wave, sums of sinusoids, a square wave, a noisy periodic function, one variable of the chaotic Lorenz attractor, sine waves of very different periods, a one-shot aperiodic segment, and a low-amplitude sine wave used to test chaos suppression.

The authors also mix FORCE and echo-state feedback by feeding back \(\gamma f(t) + (1-\gamma) z(t)\) during training, so \(\gamma = 0\) is pure FORCE and \(\gamma = 1\) is the echo-state clamp. They measure post-training stability and residual error, and add noise in the feedback loop as a possible repair for echo-state training. To test the role of spontaneous chaos, they sweep the recurrent gain \(g\) on the same periodic target, recording training cycles, root-mean-square error, and the length of the learned readout weight vector \(|w|\).

Further simulations use delayed or distorted feedback, the architectures of Figures 1B and 1C, static <b>control inputs</b> that switch one network among several waveforms, an eight-input, four-output <b>4-bit memory</b>, and a high-dimensional motor example. In that last case, 95 joint-angle traces from the Carnegie Mellon Motion Capture Library—dataset 09\_02 for running and 08\_01 for walking—serve as targets. Translation through space is ignored, so the model is a runner or walker on a treadmill. Static control inputs initialize the network and select which gait to produce.

## Results

Figure 2A–C shows the basic sequence. Before learning, both the output (red) and sample firing rates (blue) are chaotic. As soon as FORCE starts, the readout weights fluctuate rapidly (orange), the activity becomes periodic, and the output already matches a triangle-wave target. After learning is turned off, the network continues to generate the triangle wave on its own. In this example the procedure converged in four cycles of the wave.

The same procedure produced a wide range of autonomous outputs (Figure 2D–K). Training typically converged in about \(1000\tau\), or roughly 10 s of simulated time. It could generate sine waves with periods from 60 ms to 8 s, and could still learn a noisy periodic target. For the Lorenz variable, because the target itself is chaotic, a precise match lasted only a finite time; after the traces diverged, the output still resembled the Lorenz model. A one-shot sequence could be produced if a second readout first established a brief fixed point that set the initial condition. When the target amplitude was too small, the rates remained chaotic and learning failed (Figure 2K).

![Figure 2. FORCE learning in the network of Figure 1A. (A–C) The training sequence. The output z is red, firing rates of 10 sample neurons are blue, and the orange trace is the magnitude of the time derivative of the readout weights. (A) Before learning, activity and output are chaotic. (B) During learning the output already matches a triangle-wave target, and activity becomes periodic while the weights fluctuate rapidly; those fluctuations then subside. (C) After training, the network produces the target without further weight changes. (D–K) Autonomous outputs after training (red); green traces, where visible, are targets. (D, E) Periodic functions of four and 16 sinusoids. (F) A four-sinusoid target learned from a noisy teacher. (G) A square wave. (H) One variable of the Lorenz attractor; the match is only temporary because the target is itself chaotic. (I) Sine waves with periods of 60 ms and 8 s. (J) A one-shot sequence: a second readout first sets a fixed point (left of the left arrow), then the sequence runs between the arrows before activity returns to chaos. (K) A low-amplitude sine wave for which chaos is not suppressed and learning fails.](/img/readApaper-42/fig2_force_learning.png)

<i>Figure 2. FORCE learning in the network of Figure 1A. (A–C) The training sequence. The output \(z\) is red, firing rates of 10 sample neurons are blue, and the orange trace is the magnitude of the time derivative of the readout weights. (A) Before learning, activity and output are chaotic. (B) During learning the output already matches a triangle-wave target, and activity becomes periodic while the weights fluctuate rapidly; those fluctuations then subside. (C) After training, the network produces the target without further weight changes. (D–K) Autonomous outputs after training (red); green traces, where visible, are targets. (D, E) Periodic functions of four and 16 sinusoids. (F) A four-sinusoid target learned from a noisy teacher. (G) A square wave. (H) One variable of the Lorenz attractor; the match is only temporary because the target is itself chaotic. (I) Sine waves with periods of 60 ms and 8 s. (J) A one-shot sequence: a second readout first sets a fixed point (left of the left arrow), then the sequence runs between the arrows before activity returns to chaos. (K) A low-amplitude sine wave for which chaos is not suppressed and learning fails.</i>

In the mixed-feedback test, the trained network was stable on the majority of trials only when \(\gamma < 0.15\), and in that range the error was smallest at \(\gamma = 0\). Pure echo-state training typically matched the target briefly and then drifted away. Adding noise to the feedback loop allowed echo-state training to converge on about 50% of trials, but the error on those successful trials remained substantially larger than for FORCE.

Figure 5 shows why starting from chaos helps. For the same periodic target, the number of training cycles, the RMS error, and \(|w|\) all fell as \(g\) increased, including as it crossed into the chaotic regime \(g > 1\). Large \(|w|\) would have meant a brittle solution built from cancelling contributions; the smallest weights were found for \(g > 1\). In this example learning converged only for \(0.75 < g < 1.56\): it failed below \(0.75\), and it failed again above \(1.56\) because the feedback could no longer suppress chaos. The most effective setting was just below that upper limit, at what the authors call the <b>edge of chaos</b>.

![Figure 5. Chaos improves training on the same periodic target used in the main tests. Results are shown for the range 0.75  1.](/img/readApaper-42/fig5_chaos_helps.png)

<i>Figure 5. Chaos improves training on the same periodic target used in the main tests. Results are shown for the range \(0.75 < g < 1.56\), where learning converged. (A) Number of cycles needed for training. (B) RMS error of the output after training. (C) Length of the learned readout weight vector \(|w|\). All three quantities fall as \(g\) increases, including as it crosses into the chaotic regime \(g > 1\).</i>

FORCE also succeeded with delayed or distorted feedback, and the architectures of Figures 1B and 1C generated comparably complex outputs. A single internally trained network, switched by static control inputs that carried no timing information, could produce several different periodic outputs (Figure 7A and B). Another network implemented a 4-bit memory: eight pulsed inputs acted as ON and OFF commands for four readouts, driving each output to \(+1\) or \(-1\). After training, each output responded to its own pair of inputs with little crosstalk, so the network had acquired 16 fixed-point attractors—one for each combination of the four binary outputs—and the correct transitions among them (Figure 7C and D).

![Figure 7. Multiple pattern generation and a 4-bit memory, using learning inside the generator network. (A) Static control inputs select among output patterns; trainable synapses and readout weights are in red. (B) Five different periodic outputs produced by one network, each selected by a static control pattern; the scale bar is 1.2 s. (C) A network with four readouts and eight inputs. (D) After training, each output (red; targets in green) turns on or off in response to its own pair of pulsed inputs (purple) and largely ignores the others. The scale bar is 1 s.](/img/readApaper-42/fig7_switching_memory.png)

<i>Figure 7. Multiple pattern generation and a 4-bit memory, using learning inside the generator network. (A) Static control inputs select among output patterns; trainable synapses and readout weights are in red. (B) Five different periodic outputs produced by one network, each selected by a static control pattern; the scale bar is 1.2 s. (C) A network with four readouts and eight inputs. (D) After training, each output (red; targets in green) turns on or off in response to its own pair of pulsed inputs (purple) and largely ignores the others. The scale bar is 1 s.</i>

Finally, one network generated both running and walking joint-angle patterns from the human motion-capture data (Figure 8). The other Figure 1 architectures could be trained similarly.

![Figure 8. A network that generates both running and walking from human motion-capture data. (A) Either architecture can be used; the upper one, with a separate feedback network, is shown. Purple control inputs select running or walking, and 95 readout units generate 95 joint-angle traces. (B) The running motion after training; cyan frames are early in the cycle and magenta frames are later. (C) Ten sample generator neurons during walking. (D) The walking motion, colored as in (B). These are simulated kinematics trained on measured joint angles, not neural recordings from a walking person.](/img/readApaper-42/fig8_motion_capture.png)

<i>Figure 8. A network that generates both running and walking from human motion-capture data. (A) Either architecture can be used; the upper one, with a separate feedback network, is shown. Purple control inputs select running or walking, and 95 readout units generate 95 joint-angle traces. (B) The running motion after training; cyan frames are early in the cycle and magenta frames are later. (C) Ten sample generator neurons during walking. (D) The walking motion, colored as in (B). These are simulated kinematics trained on measured joint angles, not neural recordings from a walking person.</i>

## Analysis

FORCE splits training into two jobs. The first is control: hold the output close to the target so feedback does not re-excite chaos. The second is learning: shrink the weight changes until a fixed setting can do that job alone.

Leaving a little error in the feedback, rather than clamping it, allows instabilities to be sampled and suppressed; that is why performance clustered near \(\gamma = 0\). In these simulations, networks that began above the chaos threshold trained in fewer cycles, reached smaller errors, and found shorter, more robust readout weights than quieter networks—up to the point where the feedback could no longer tame the dynamics.

The motor examples should be read in the same spirit. The running and walking figures are simulated joint-angle trajectories trained to follow measured human kinematics; they are not neural recordings from a walking animal. The authors also note a qualitative resemblance to a known physiological finding: when a brief fixed point is used to initialize a one-shot or movement sequence, fluctuations in the model drop sharply just before the sequence begins, in the same direction as the drop in firing-rate variability reported in monkey motor and premotor cortex immediately before a reach (Churchland et al., 2006; Churchland & Shenoy, 2007). That is a comparison between a simulated initialization step and previously published recordings, not a new experiment in this paper. In the same networks, individual generator neurons often bear little obvious relationship to the output.

## Summary

FORCE learning keeps a small error under tight control from the outset, then searches for fixed weights that can maintain the desired output without further change. In computer simulations of firing-rate networks, that procedure converts chaotic spontaneous activity into a wide range of autonomous patterns, input-driven memories, and human-like gait trajectories. Starting from chaos, and leaving the feedback loop closed but tightly controlled, is part of what makes the learning work.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-28 · Neuron, 2009</i>

随机连接的网络可以从混沌的自发活动出发，仍然被训练出可控的输出。关键是在训练一开始就把误差压小，然后再找到一套固定权重，让网络能够自己把这个输出维持下去。

## 背景

即使并没有在执行某一特定动作，神经回路也往往是忙碌的。皮层神经元常常以不规则、不断起伏的模式发放，并没有明显的外部指令，这种状态通常称为<b>自发活动</b>。同样的回路在产生运动或对刺激作出反应时，又必须生成<b>相干模式</b>——可靠、有结构的活动时间过程。一个自然的问题是：受控的动作，能不能靠重组原本就已经存在的活动而产生？

一个有用的起点是<b>递归网络</b>：神经元的连接不只向前走，也会折返回来，让整个群体持续相互影响。在简单的<b>发放率</b>描述里，每个单元用一段连续变化的输出表示，而不是用一个个离散脉冲。若把随机的递归连接再乘上增益 \(g\)，一个经典结果是：\(g < 1\) 时网络大体安静；\(g > 1\) 时则进入<b>混沌</b>——活动不规则，并且对起始状态的微小差别指数地敏感（Sompolinsky, Crisanti, & Sommers, 1988）。描述皮层自发活动的模型，常常就处在这个混沌区里。

所谓训练，就是改突触强度，使网络的<b>输出</b>去匹配一个预定的<b>目标函数</b> \(f(t)\)。递归网络比前馈网络更难训练，而且当活动本身混沌时，常规算法通常会失败（Doya, 1992）。一个有影响的变通办法是<b>回声状态</b>方法（Jaeger, 2003; Jaeger & Haas, 2004）。随机递归网络大体保持不训练，只学习一个线性<b>读出</b>，也就是网络发放率的加权和。在最初的回声状态做法里，网络往往从静止开始，并且在训练期间把反馈通路<b>钳制</b>在目标本身上。钳制可以避免误差在环路里来回放大，但学习过程也就无法采样到钳制撤掉之后会出现的那些波动。

## 问题

Sussillo 和 Abbott 要问的是：混沌的自发活动怎样才能被重组为相干、可控的输出，包括在完全没有外部输入时也能自己生成的模式。没有输入的情形更难：网络必须自己把模式维持下去，不稳定性不能靠驱动信号遮住。

前面有三道障碍。如果把还错得很厉害的输出送回网络，活动可能偏得太远，学习就再也追不上。<b>信用分配</b>——决定该改哪些突触——在递归回路里尤其困难。训练过程中还必须把混沌管住，否则更新没有稳定的目标可追。作者想要的方法是：反馈环保持闭合，网络从自发混沌出发，仍然能收敛到一套固定权重，让目标模式可以自主生成。

## 方法

他们把这套方法称为<b>FORCE 学习</b>，全称是 First-Order Reduced and Controlled Error（一阶、缩小并受控的误差）。常规训练往往从很大的误差开始，再慢慢往下削。FORCE 则在第一次更新时就做一次大幅度修正，此后一直把误差保持得很小，再去寻找一套固定权重，使已经很小的误差在不再改权重时也能维持。

最常用的结构（图 1A）是一个随机连接的<b>发生器网络</b>，其发放率向量 \(r(t)\) 驱动线性读出 \(z(t) = w^{T} r(t)\)。输出 \(z\) 再被送回同一网络。训练时只修改读出权重 \(w\)（图中为红色）；递归连接保持随机初值不变。

另外两种结构把可塑性放到更合理的位置。在图 1B 里，一个单独的<b>反馈网络</b>把活动送回发生器，FORCE 同时用在读出上，以及从发生器进入该反馈网络的突触上。在图 1C 里没有外部反馈环：FORCE 用在发生器内部的突触上，同时也用在读出上。在 B 和 C 中，每个被修改的突触都使用来自读出的同一个全局误差。

![图 1. FORCE 学习的三种结构。每种结构里，发放率为 r 的发生器网络都通过权重 w（红色）驱动线性读出 z；训练时只修改红色连接。(A) 反馈由读出单元直接送回发生器。(B) 另有一个反馈网络把活动送回发生器；从发生器进入该网络的突触 J^{FG} 也一起训练。(C) 没有外部反馈环，FORCE 被用在发生器内部的突触 J^{GG} 上。](/img/readApaper-42/fig1_architectures.png)

<i>图 1. FORCE 学习的三种结构。每种结构里，发放率为 \(r\) 的发生器网络都通过权重 \(w\)（红色）驱动线性读出 \(z\)；训练时只修改红色连接。(A) 反馈由读出单元直接送回发生器。(B) 另有一个反馈网络把活动送回发生器；从发生器进入该网络的突触 \(J^{FG}\) 也一起训练。(C) 没有外部反馈环，FORCE 被用在发生器内部的突触 \(J^{GG}\) 上。</i>

环路保持闭合并不会把学习毁掉，因为权重更新足够快，送回去的误差始终很小，延迟效应也就只停留在一阶。反馈被维持在接近目标的位置，但并没有被钳制；剩下的那一点波动，让算法有机会采样到不稳定性并把它们稳住。全文使用的更新规则是<b>递归最小二乘</b>（recursive least squares, RLS）。它按很短的间隔调整 \(w\)，第一次更新就已经把误差压小。

混沌也由同一条环路来处理。只要反馈信号的幅度和频率足够，就可以把混沌的发放率网络推入非混沌状态（Molgedey, Schuchhardt, & Schuster, 1992; Bertschinger & Natschläger, 2004）。如果目标太弱，反馈压不住混沌，学习就会失败。在标准例子里，发生器有 \(N = 1000\) 个单元，可能的递归连接中有 10% 存在，时间常数 \(\tau = 10\) 毫秒，递归增益 \(g = 1.5\)，未训练时的网络因此处于混沌区。

## 实验

论文中的每一项测试，都是对这些发放率模型的计算机模拟。论文没有报告来自动物或人的新记录。人体动作捕捉数据只是作为模拟的目标轨迹出现。

第一组测试要求图 1A 的网络在没有外部输入的情况下生成指定波形，并在关闭学习之后继续生成它。目标包括三角波、正弦波的叠加、方波、带噪声的周期函数、混沌 Lorenz 吸引子中的一个变量、周期相差很大的正弦波、一次性的非周期片段，以及用来检验混沌抑制的低幅度正弦波。

作者还把 FORCE 与回声状态反馈混合起来：训练时反馈 \(\gamma f(t) + (1-\gamma) z(t)\)，因此 \(\gamma = 0\) 是纯 FORCE，\(\gamma = 1\) 是回声状态的钳制。他们测量训练后的稳定性和残余误差，并在反馈环中加入噪声，作为纯回声状态训练的一种可能补救。为了检验自发混沌的作用，他们在同一周期目标上扫描递归增益 \(g\)，记录训练所需周期数、训练后的均方根误差，以及学到的读出权重向量长度 \(|w|\)。

后续模拟还使用了延迟或畸变的反馈、图 1B 和 1C 的结构、用静态<b>控制输入</b>在几种波形之间切换的单一网络、八输入四输出的<b>4 比特记忆</b>，以及一个高维运动例子。在最后这个例子里，目标是卡内基梅隆大学动作捕捉库中的 95 条关节角轨迹——跑的数据集为 09\_02，走的数据集为 08\_01。空间中的平移被忽略，因此模型相当于在跑步机上跑或走。静态控制输入既用来初始化网络，也用来选择生成哪一种步态。

## 结果

图 2A–C 给出了基本过程。学习之前，输出（红色）和样本发放率（蓝色）都是混沌的。FORCE 一开始，读出权重就迅速波动（橙色），活动变为周期，输出已经能对上三角波目标。这些波动随后减小，静态解出现。学习关闭之后，网络继续自己生成三角波。在这个例子里，算法在四个波形周期内收敛。

同一套程序产生了多种自主输出（图 2D–K）。训练通常在大约 \(1000\tau\)、也就是约 10 秒的模拟时间内收敛。它可以生成周期从 60 毫秒到 8 秒的正弦波，也能从带噪声的周期目标中学会。对 Lorenz 变量而言，因为目标本身是混沌的，精确吻合只能维持有限时间；两条曲线分开之后，输出看起来仍然像 Lorenz 模型。若先用第二个读出建立一个短暂的不动点来设定初值，还可以生成一次性的序列。当目标幅度太小时，发放率仍然混沌，学习失败（图 2K）。

![图 2. 在图 1A 网络中的 FORCE 学习。(A–C) 训练过程。输出 z 为红色，10 个样本神经元的发放率为蓝色，橙色曲线是读出权重时间导数的大小。(A) 学习前，活动和输出都是混沌的。(B) 学习开始后，输出已经对上三角波目标，活动变为周期，权重迅速波动，随后波动减弱。(C) 训练结束后，网络在不再改权重的情况下继续产生目标。(D–K) 训练后自主运行的输出（红色）；能看见的绿色曲线是目标。(D、E) 由 4 个和 16 个正弦波组成的周期函数。(F) 从带噪声的教师信号中学会的四正弦波目标。(G) 方波。(H) Lorenz 吸引子的一个变量；因为目标本身混沌，精确吻合只是暂时的。(I) 周期为 60 毫秒和 8 秒的正弦波。(J) 一次性序列：第二个读出先设定一个不动点（左箭头左侧），序列在两个箭头之间展开，随后活动回到混沌。(K) 低幅度正弦波，混沌未被抑制，学习失败。](/img/readApaper-42/fig2_force_learning.png)

<i>图 2. 在图 1A 网络中的 FORCE 学习。(A–C) 训练过程。输出 \(z\) 为红色，10 个样本神经元的发放率为蓝色，橙色曲线是读出权重时间导数的大小。(A) 学习前，活动和输出都是混沌的。(B) 学习开始后，输出已经对上三角波目标，活动变为周期，权重迅速波动，随后波动减弱。(C) 训练结束后，网络在不再改权重的情况下继续产生目标。(D–K) 训练后自主运行的输出（红色）；能看见的绿色曲线是目标。(D、E) 由 4 个和 16 个正弦波组成的周期函数。(F) 从带噪声的教师信号中学会的四正弦波目标。(G) 方波。(H) Lorenz 吸引子的一个变量；因为目标本身混沌，精确吻合只是暂时的。(I) 周期为 60 毫秒和 8 秒的正弦波。(J) 一次性序列：第二个读出先设定一个不动点（左箭头左侧），序列在两个箭头之间展开，随后活动回到混沌。(K) 低幅度正弦波，混沌未被抑制，学习失败。</i>

在混合反馈测试中，训练后的网络只在 \(\gamma < 0.15\)、也就是接近纯 FORCE 时，才在大多数试验中保持稳定；在这个范围内，误差在 \(\gamma = 0\) 时最小。纯回声状态训练往往只能短暂对准目标，随后就偏走。在反馈环中加噪声后，回声状态训练大约在 50% 的试验中收敛，但这些成功试验上的误差仍明显大于 FORCE。

图 5 说明了从混沌出发为什么有帮助。对同一个周期目标，训练所需周期数、均方根误差和 \(|w|\) 都随 \(g\) 增大而下降，包括在进入混沌区 \(g > 1\) 之后。很大的 \(|w|\) 往往意味着解是靠正负项相互抵消拼出来的，比较脆弱；最小的权重出现在 \(g > 1\) 时。在这个例子里，学习只在 \(0.75 < g < 1.56\) 时收敛：低于 \(0.75\) 会失败，高于 \(1.56\) 也会失败，因为反馈再也压不住混沌。最有效的设置就在这条上限稍下，作者称之为<b>混沌边缘</b>。

![图 5. 在与主要测试相同的周期目标上，混沌改善了训练。结果画在学习能够收敛的范围 0.75  1 之后。](/img/readApaper-42/fig5_chaos_helps.png)

<i>图 5. 在与主要测试相同的周期目标上，混沌改善了训练。结果画在学习能够收敛的范围 \(0.75 < g < 1.56\) 内。(A) 训练所需的周期数。(B) 训练后输出的均方根误差。(C) 学到的读出权重向量长度 \(|w|\)。这三个量都随 \(g\) 增大而下降，包括在进入混沌区 \(g > 1\) 之后。</i>

在反馈被延迟或非线性畸变时，FORCE 仍然可以成功；图 1B 和 1C 的结构也能生成复杂程度相当的输出。一个在内部训练过的网络，只要用本身并不携带时间信息的静态控制输入来切换，就可以产生几种不同的周期输出（图 7A、B）。另一个网络实现了 4 比特记忆：八个脉冲输入分别作为四个读出的开、关指令，把每个输出驱动到 \(+1\) 或 \(-1\)。训练之后，每个输出主要对自己的那一对输入作出反应，串扰很小，这意味着网络得到了 16 个不动点吸引子——对应四个二进制输出的每一种组合——以及它们之间正确的转移（图 7C、D）。

![图 7. 在发生器网络内部学习，实现多种模式生成和 4 比特记忆。(A) 静态控制输入在不同输出模式之间切换；可训练的突触和读出权重为红色。(B) 同一个网络产生的五种不同周期输出，各自由一种静态控制模式选出；时间标尺为 1.2 秒。(C) 四个读出、八个输入的网络。(D) 训练之后，每个输出（红色；目标为绿色）主要对自己的那一对脉冲输入（紫色）作出开关反应，对其余输入大多忽略。时间标尺为 1 秒。](/img/readApaper-42/fig7_switching_memory.png)

<i>图 7. 在发生器网络内部学习，实现多种模式生成和 4 比特记忆。(A) 静态控制输入在不同输出模式之间切换；可训练的突触和读出权重为红色。(B) 同一个网络产生的五种不同周期输出，各自由一种静态控制模式选出；时间标尺为 1.2 秒。(C) 四个读出、八个输入的网络。(D) 训练之后，每个输出（红色；目标为绿色）主要对自己的那一对脉冲输入（紫色）作出开关反应，对其余输入大多忽略。时间标尺为 1 秒。</i>

最后，一个网络根据人体动作捕捉数据，同时生成了跑和走的关节角模式（图 8）。95 个读出产生 95 个关节角。图 1 中的其他结构也能得到类似的训练结果。

![图 8. 一个网络根据人体动作捕捉数据同时生成跑和走。(A) 两种结构都可以用，这里展示的是上方带单独反馈网络的结构。紫色控制输入选择跑或走，95 个读出单元生成 95 条关节角轨迹。(B) 训练后的跑步动作；青色帧是周期较早的阶段，品红帧是较晚的阶段。(C) 行走时 10 个样本发生器神经元的活动。(D) 行走动作，配色与 (B) 相同。这些是按测得的关节角训练出来的模拟运动学，并不是行走者的神经记录。](/img/readApaper-42/fig8_motion_capture.png)

<i>图 8. 一个网络根据人体动作捕捉数据同时生成跑和走。(A) 两种结构都可以用，这里展示的是上方带单独反馈网络的结构。紫色控制输入选择跑或走，95 个读出单元生成 95 条关节角轨迹。(B) 训练后的跑步动作；青色帧是周期较早的阶段，品红帧是较晚的阶段。(C) 行走时 10 个样本发生器神经元的活动。(D) 行走动作，配色与 (B) 相同。这些是按测得的关节角训练出来的模拟运动学，并不是行走者的神经记录。</i>

## 分析

FORCE 把训练分成两件工作。第一件是控制：把输出维持在目标附近，以免反馈重新激发混沌。第二件是学习：把权重变化逐步减小，直到一套固定设置就能单独完成这件事。

和规则本身同样重要的，还有两个设计选择。让反馈里留下一点点误差，而不是把它钳死，才能采样到不稳定性并把它们压住；这就是成绩集中在 \(\gamma = 0\) 附近的原因。混沌自发活动也并不只是障碍。在这些模拟里，从混沌阈值以上出发的网络，训练周期更少，误差更小，找到的读出权重也更短、更稳健——直到反馈再也约束不住动力学的那一点为止。

运动方面的例子也应当这样读。跑和走的图是按照测得的人体运动学来训练的模拟关节角轨迹，并不是行走动物的神经记录。作者还指出，这与一项已知的生理发现有定性上的相似：当用一个短暂的不动点来初始化一次性序列或运动序列时，模型中的波动会在序列开始前急剧下降，方向与猴子运动皮层和前运动皮层在伸手之前发放率变异性下降一致（Churchland et al., 2006; Churchland & Shenoy, 2007）。这是模拟中的初始化步骤与先前已发表记录之间的比较，并不是这篇论文里的新实验。在这些网络里，单个发生器神经元的活动往往和输出没有明显的对应关系。

## 总结

FORCE 学习从一开始就把小误差控制得很紧，然后再寻找一套固定权重，使目标输出在不再改权重时也能维持。在发放率网络的计算机模拟中，这套程序把混沌的自发活动转变成多种自主模式、由输入驱动的记忆，以及类似人类步态的轨迹。从混沌出发，并让反馈环保持闭合却又受到严格控制，正是这套学习能够奏效的一部分原因。

## References

- Sussillo, D., & Abbott, L. F. (2009). <i>Generating Coherent Patterns of Activity from Chaotic Neural Networks.</i> Neuron, 63(4), 544–557。[doi.org/10.1016/j.neuron.2009.07.018](https://doi.org/10.1016/j.neuron.2009.07.018)
- Sompolinsky, H., Crisanti, A., & Sommers, H. J. (1988). <i>Chaos in random neural networks.</i> Physical Review Letters, 61(3), 259–262。[doi.org/10.1103/PhysRevLett.61.259](https://doi.org/10.1103/PhysRevLett.61.259)
- Doya, K. (1992). <i>Bifurcations in the learning of recurrent neural networks.</i> IEEE International Symposium on Circuits and Systems, 6, 2777–2780。
- Jaeger, H. (2003). Adaptive nonlinear system identification with echo state networks. In S. Becker, S. Thrun, & K. Obermayer (Eds.), <i>Advances in Neural Information Processing Systems 15</i> (pp. 593–600). MIT Press。
- Jaeger, H., & Haas, H. (2004). <i>Harnessing nonlinearity: Predicting chaotic systems and saving energy in wireless communication.</i> Science, 304(5667), 78–80。[doi.org/10.1126/science.1091277](https://doi.org/10.1126/science.1091277)
- Molgedey, L., Schuchhardt, J., & Schuster, H. G. (1992). <i>Suppressing chaos in neural networks by noise.</i> Physical Review Letters, 69(26), 3717–3719。[doi.org/10.1103/PhysRevLett.69.3717](https://doi.org/10.1103/PhysRevLett.69.3717)
- Bertschinger, N., & Natschläger, T. (2004). <i>Real-time computation at the edge of chaos in recurrent neural networks.</i> Neural Computation, 16(7), 1413–1436。[doi.org/10.1162/089976604323057443](https://doi.org/10.1162/089976604323057443)
- Churchland, M. M., Yu, B. M., Ryu, S. I., Santhanam, G., & Shenoy, K. V. (2006). <i>Neural variability in premotor cortex provides a signature of motor preparation.</i> Journal of Neuroscience, 26(14), 3697–3712。[doi.org/10.1523/JNEUROSCI.3762-05.2006](https://doi.org/10.1523/JNEUROSCI.3762-05.2006)
- Churchland, M. M., & Shenoy, K. V. (2007). <i>Delay of movement caused by disruption of cortical preparatory activity.</i> Journal of Neurophysiology, 97(1), 348–359。[doi.org/10.1152/jn.00808.2006](https://doi.org/10.1152/jn.00808.2006)
- Carnegie Mellon University Motion Capture Library, datasets 09\_02 (running) and 08\_01 (walking)。[mocap.cs.cmu.edu](http://mocap.cs.cmu.edu/)
- Figures 1, 2, 5, 7, and 8 are from Sussillo and Abbott (2009).
