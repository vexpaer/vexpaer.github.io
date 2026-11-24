---
title: "readApaper#34 Real-Time Computing Without Stable States: A New Framework for Neural Computation Based on Perturbations"
title_zh: "readApaper#34 Real-Time Computing Without Stable States: A New Framework for Neural Computation Based on Perturbations"
date: 2026-11-20 22:00:00
tags:
  - readApaper
  - neuroscience
  - reservoir-computing
  - spiking-neural-networks
cover: /img/readapaper-cover.png
bilingual: true
mathjax: true
---

<i>Reading time: about 8 minutes · 20 November 2026 · Neural Computation, 2002</i>

A recurrent network does not have to settle into a stable state to compute. If its present activity still carries a usable trace of recent inputs, a simple readout can extract that information in real time.

## Background

Sensory input almost never arrives as a finished snapshot. Sounds, touches, and visual scenes change continuously, and a nervous system has to act while that stream is still unfolding. That is <b>real-time computation on a time-varying input</b>: the useful answer is needed now, and it may depend on the recent past as well as on what is arriving this instant.

In the neocortex, much of this processing is thought to take place in local <b>microcircuits</b>. These circuits are highly recurrent: axons do not only run forward, they also loop back, so neurons keep influencing one another. The paper notes that as many as 80% of the synapses inside a functional neocortical column can belong to such loops (Shepherd, 1988; Douglas & Martin, 1998). The same stereotyped local architecture also appears able to support many different tasks, which already suggests that the circuit is not rebuilt from scratch for each job.

Two familiar pictures sit awkwardly here. A <b>Turing machine</b> or finite-state machine moves step by step between discrete states, often with a central clock, and usually requires designing a special network. An <b>attractor network</b> instead lets activity settle into a stable pattern, like a ball rolling into a valley. Attractors can store discrete items reliably, but settling takes time, and a very large set of attractors is needed to keep many bits about the past—the paper’s example is 1024 attractors in order to store 10 bits.

The models below use <b>integrate-and-fire</b> neurons: incoming current charges a membrane voltage, the cell emits a brief pulse (a <b>spike</b>) when that voltage crosses a threshold, then resets. Many such cells in a recurrent circuit form a high-dimensional system that does not sit still. The question is whether those transient patterns can be used for computation.

## Problem

The paper asks how a generic recurrent circuit of spiking neurons can process a continuous input stream in real time, without building a new circuit for each task, without a central clock, and without waiting to settle into a stable state. It also asks whether several such tasks can run at once on the same circuit.

The proposed answer is to leave a sufficiently rich circuit largely as it is, treat its present activity as a fading record of recent perturbations, and train only the downstream neurons that read that activity out.

## Method

The authors call this model a <b>liquid state machine</b> (LSM). The name is an image: pebbles dropped into a pond leave moving ripples that still depend on what was thrown in, even though no ripple is stored as a lasting bit.

An LSM has two parts, shown in Figure 1. The first is a <b>liquid filter</b> \(L^M\). A time-varying input \(u(\cdot)\) is injected into this dynamical system, and at time \(t\) the system occupies a <b>liquid state</b> \(x^M(t) = (L^M u)(t)\). In a neural implementation, \(L^M\) is a recurrent circuit that is not built for one particular task. The second part is a <b>memoryless readout map</b> \(f^M\), which at every time \(t\) turns that state into an output \(y(t) = f^M(x^M(t))\). “Memoryless” means the readout need not keep its own history: anything required about the past must already be present in \(x^M(t)\). The readout <b>is</b> trained for a specific task, and several readouts can share the same liquid.

![Figure 1. Architecture of a liquid state machine. A time-varying input u(cdot) is injected into a liquid filter L^M, which produces a liquid state x^M(t). A memoryless readout map f^M turns that state into an output y(t).](/img/readApaper-34/fig1_lsm_architecture.png)

<i>Figure 1. Architecture of a liquid state machine. A time-varying input \(u(\cdot)\) is injected into a liquid filter \(L^M\), which produces a liquid state \(x^M(t)\). A memoryless readout map \(f^M\) turns that state into an output \(y(t)\).</i>

Because the readout has no private memory, the liquid must remember recent inputs. The relevant kind of memory is <b>fading memory</b> (Boyd & Chua, 1985): the present output depends on a finite window of the recent past, and it changes continuously when that recent input changes only slightly. The system is not asked to archive the distant past in a stable register.

Two properties then decide whether the scheme can work. The <b>separation property</b> (SP) concerns the liquid: if two input streams differ in a way that matters, their later liquid states should also differ, clearly enough to rise above noise. The <b>approximation property</b> (AP) concerns the readout: once those states are distinguishable, it must map them onto the intended targets. SP depends mainly on the liquid; AP depends mainly on how adaptable the readout is.

Appendix A gives this idea a mathematical backbone. Theorem 1 treats time-invariant fading-memory filters on continuous inputs; Theorem 2 extends the same statement to spike trains. If the liquid can separate different input histories, and if the readout class can approximate continuous functions, then any such target filter can be approximated to any chosen accuracy by an LSM. These are existence results under idealized conditions, not measurements of a particular simulated circuit, and not experiments on living tissue.

To test the idea, the authors used computer simulations of a generic recurrent circuit as the liquid (Appendix B). A single “column” contained 135 integrate-and-fire neurons, 20% of them inhibitory, with distance-dependent connectivity controlled by a parameter \(\lambda\), and synapses with short-term depression and facilitation (Markram, Wang, & Tsodyks, 1998). The membrane time constant was 30 ms. The recurrent circuit itself was not trained; only the readout was adapted. That split—a fixed dynamic circuit, and a trained readout—is the operational core of the method.

## Experiments

All of the tests below are computer simulations of these model circuits, not recordings from cultured neurons, organoids, or intact animals.

The central test is the fading-memory task in Figure 4. Each 1000 ms input was divided into four 250 ms segments. For every segment, one of two Poisson templates was chosen and then jittered. At time \(t = 1000\) ms, four readouts had to report which template had generated each segment. The last segment is still fresh; the first occurred 750–1000 ms earlier and has since been overwritten. There is no spatial pattern to lean on, only a fading timing trace.

![Figure 4. The fading-memory classification task. Each 1000 ms input is built from four 250 ms segments. For every segment, one of two Poisson templates is chosen and then jittered. At t = 1000 ms, four readouts must say which template produced each segment.](/img/readApaper-34/fig4_fading_memory_task.png)

<i>Figure 4. The fading-memory classification task. Each 1000 ms input is built from four 250 ms segments. For every segment, one of two Poisson templates is chosen and then jittered. At \(t = 1000\) ms, four readouts must say which template produced each segment.</i>

In the main series, new templates and a new randomly connected column (\(\lambda = 2\)) were drawn for each trial. The readouts were trained on 1000 examples, tested on 500 unseen inputs, and averaged over 50 trials. One control replaced dynamic synapses with static ones; others varied \(\lambda\), or compared one column with four unconnected columns. Two further simulations complete the main line: several readouts trained on the same untrained liquid and tested together on a novel input, and a readout asked to hold a nearly constant target while the liquid state kept changing.

## Results

In the fading-memory test at 4 ms jitter (Figure 5), all four readouts with dynamic synapses classified unseen inputs well above chance, including those assigned to earlier segments, and performance was highest for the most recent segment. With static synapses, performance dropped sharply for all but the last segment; the earliest segment fell close to chance.

![Figure 5. Fading-memory results. (A) Average correctness of the four readouts at t = 1000 ms with dynamic synapses, on 500 unseen test inputs, averaged over 50 trials. (B) Liquid spikes in a 0.5–0.8 s window for a typical input. (C, D) The same test after dynamic synapses were replaced by static ones with similar average activity. Earlier segments lose much of their recoverable information; the last segment remains easy.](/img/readApaper-34/fig5_fading_memory_results.png)

<i>Figure 5. Fading-memory results. (A) Average correctness of the four readouts at \(t = 1000\) ms with dynamic synapses, on 500 unseen test inputs, averaged over 50 trials. (B) Liquid spikes in a 0.5–0.8 s window for a typical input. (C, D) The same test after dynamic synapses were replaced by static ones with similar average activity. Earlier segments lose much of their recoverable information; the last segment remains easy.</i>

Circuit structure changed how useful the liquid’s separation was (Figure 7). A column with no recurrent connections (\(\lambda = 0\)) was a poor liquid for the delayed-segment task. Intermediate connectivity, around \(\lambda = 2\), worked better than packing many long-range connections into a single column (\(\lambda = 8\)), which became similarly sensitive to small jitter and to genuine pattern differences. Four columns with \(\lambda = 2\) separated those cases more usefully and classified more accurately as jitter increased.

![Figure 7. Separation and performance depend on circuit structure. (A, B) One column versus four columns, each with 135 neurons. (C) Average distance between later liquid states as a function of input-spike-train distance. A single highly connected column (lambda = 8) becomes similarly sensitive to small and large input differences; four columns with lambda = 2 rise more in proportion to input distance. (D) Average correctness on the delayed-segment task as input jitter increases.](/img/readApaper-34/fig7_separation_and_columns.png)

<i>Figure 7. Separation and performance depend on circuit structure. (A, B) One column versus four columns, each with 135 neurons. (C) Average distance between later liquid states as a function of input-spike-train distance. A single highly connected column (\(\lambda = 8\)) becomes similarly sensitive to small and large input differences; four columns with \(\lambda = 2\) rise more in proportion to input distance. (D) Average correctness on the delayed-segment task as input jitter increases.</i>

On one untrained liquid, several independently trained readouts could follow different real-time targets on a novel input. Figure 9 shows the complementary point: for a new 40-channel input, the liquid activity kept changing, but after a short transient the trained readout stayed close to a constant target. A nearly constant output did not require a nearly constant internal state.

![Figure 9. A stable readout from changing liquid states. (A) Novel 40-channel Poisson input at 5 Hz. (B) Raster of the 135 liquid neurons. (C) Liquid population rate, 20 ms bins. (D) Readout activity (solid) and constant target (dashed). (E) Weight distribution onto one readout neuron, showing contributions from many liquid cells.](/img/readApaper-34/fig9_equivalent_states.png)

<i>Figure 9. A stable readout from changing liquid states. (A) Novel 40-channel Poisson input at 5 Hz. (B) Raster of the 135 liquid neurons. (C) Liquid population rate, 20 ms bins. (D) Readout activity (solid) and constant target (dashed). (E) Weight distribution onto one readout neuron, showing contributions from many liquid cells.</i>

## Analysis

The theorems and the simulations play different roles. The theorems say that, under idealized conditions, fading-memory real-time maps can be approximated by a separating liquid plus a flexible readout. The simulations show that a particular family of randomly connected integrate-and-fire circuits can support demanding instances of that idea: delayed classification, several readouts on one untrained liquid, and stable outputs from moving states. They are evidence about model circuits, not a demonstration that living tissue or an organoid has been trained in this way.

What the results support is a shift in where learning is placed. The recurrent circuit can stay generic and fixed for the task, keeping a high-dimensional trace of recent perturbations for a limited time. The readout learns which differences in that trace matter, so several readouts can share one liquid.

The controls add mechanism, still within the model. Dynamic synapses help the circuit remain sensitive to context several hundred milliseconds later, even though single-neuron time constants were only 30 ms. Recurrence is necessary here, but more of it is not automatically better: intermediate, partly local connectivity was more usable than a nearly globally connected column.

## Summary

Maass, Natschläger, and Markram replace the demand for stable internal states with a simpler division of labor. A generic recurrent circuit, the liquid, converts a stream of perturbations into a fading, high-dimensional state. A memoryless readout, trained for a task, reads from that state at every moment. If different input histories separate in the liquid, and if the readout can approximate the desired map, real-time computation can proceed even while the internal state keeps moving. In computer simulations, that scheme recovered events from several hundred milliseconds earlier, supported several tasks on one untrained liquid, and produced stable outputs from unstable states.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-20 · Neural Computation, 2002</i>

递归网络不必先进入稳定状态才能计算。只要此刻的活动里还留着近期输入的可用痕迹，一个简单的读出就可以实时把它取出来。

## 背景

感官输入几乎从不以“已经拍好的一张定格照片”的形式到达。声音、触感和视觉场景都在持续变化，神经系统必须在这股信息还在展开的时候就做出反应。这就是<b>对随时间变化的输入做实时计算</b>：有用的答案现在就要，而且它既可能依赖于此刻正在进入的信号，也可能依赖于刚才发生过的事情。

在新皮层里，这类处理很大一部分被认为发生在局部的<b>微回路</b>中。这些回路高度递归：轴突不只向前投射，还会折返回来，让神经元持续相互影响。论文指出，在一个功能性新皮层柱内部，多达 80% 的突触可以属于这类环路（Shepherd, 1988; Douglas & Martin, 1998）。同一套相当定型的局部结构似乎还能支持许多不同任务，这已经提示：回路未必会为每一项工作从头重新搭建。

有两种常见图景和这种场景不太合拍。<b>图灵机</b>或有限状态机在离散状态之间一步一步转移，往往还要靠中央时钟，而且通常要求专门设计一个网络。<b>吸引子网络</b>则让活动沉降到一种稳定模式，像球滚进山谷。吸引子可以较可靠地保存离散项目，但沉降需要时间；若要保存关于过去的许多比特，还需要非常多的吸引子。论文的例子是：要保存 10 个比特，需要 1024 个吸引子。

下文模型里的单元是<b>积分发放</b>神经元：输入电流给膜电位充电，电压越过阈值时细胞发出一次短暂脉冲（<b>锋电位</b>），然后复位。许多这样的细胞连成递归回路后，整体活动是一个不会静止的高维系统。问题是：这些转瞬即逝的模式本身，能不能被用来做计算。

## 问题

这篇论文要问的是：一个通用的脉冲神经元递归回路，怎样才能对连续的输入流做实时处理——不必为每个任务重新搭一条回路，不必依赖中央时钟，也不必等待网络沉降到稳定状态。它还要问：同一条回路上能否同时运行多项这样的任务。

作者给出的答案是：让一个足够丰富的回路大体保持原样，把它此刻的活动当作近期扰动留下的逐渐消退的记录，只训练那些把这活动读出来的下游神经元。

## 方法

作者把这套模型称为<b>液体状态机</b>（liquid state machine, LSM）。这个名字是一个比喻：向池塘里扔石子，水面会留下不断变化的涟漪，这些涟漪仍然依赖于刚才扔进去的东西，尽管没有任何一圈波纹是被当成不变的比特保存下来的。

液体状态机有两个部分，如图 1 所示。第一部分是<b>液体滤波器</b> \(L^M\)。随时间变化的输入 \(u(\cdot)\) 被注入这个动力系统，在时刻 \(t\)，系统处于一个<b>液体状态</b> \(x^M(t) = (L^M u)(t)\)。在神经实现里，\(L^M\) 是一个并非为某一特定任务构造的递归回路。第二部分是<b>无记忆读出映射</b> \(f^M\)，它在每个时刻 \(t\) 把该状态变成输出 \(y(t) = f^M(x^M(t))\)。所谓“无记忆”，是指读出不必自己保存历史：凡是此刻需要的过去信息，都已经包含在 \(x^M(t)\) 里。读出<b>是</b>为特定任务训练的，多个读出可以共享同一团液体。

![图 1. 液体状态机的结构。随时间变化的输入 u(cdot) 进入液体滤波器 L^M，产生液体状态 x^M(t)，再由无记忆读出映射 f^M 得到输出 y(t)。](/img/readApaper-34/fig1_lsm_architecture.png)

<i>图 1. 液体状态机的结构。随时间变化的输入 \(u(\cdot)\) 进入液体滤波器 \(L^M\)，产生液体状态 \(x^M(t)\)，再由无记忆读出映射 \(f^M\) 得到输出 \(y(t)\)。</i>

因为读出没有私有记忆，液体必须记住近期输入。这里需要的是<b>消退记忆</b>（fading memory; Boyd & Chua, 1985）：当前输出依赖于最近一段时间的有限窗口，并且当这段近期输入只发生很小变化时，输出也连续地变化。系统并没有被要求把遥远的过去存进一个稳定的寄存器。

接下来有两个性质，决定这套方案能否成立。<b>分离性质</b>（separation property, SP）针对液体：如果两段输入流在关键之处不同，它们稍后的液体状态也应当能够区分，而且要高过噪声。<b>逼近性质</b>（approximation property, AP）针对读出：液体状态一旦可以区分，读出还要把它们映射到预定的目标值。SP 主要取决于液体，AP 主要取决于读出是否容易为任务做出调整。

附录 A 给出了数学骨架。定理 1 考虑作用在连续输入上、具有时不变性和消退记忆的滤波器；定理 2 把同样的结论推广到脉冲序列。如果液体能够分离不同的输入历史，并且读出所属的函数类能够逼近连续函数，那么任何这样的目标滤波器，都可以被一台液体状态机以任意选定的精度逼近。这些是理想条件下的存在性结果，既不是对某一个具体模拟回路的测量，也不是在活体组织上做的实验。

为了检验这个想法，作者用计算机模拟的通用递归回路作为液体（附录 B）。一个“柱”里有 135 个积分发放神经元，其中 20% 为抑制性；连接随距离下降，由参数 \(\lambda\) 控制；突触带有短时程抑制和易化（Markram, Wang, & Tsodyks, 1998）。膜时间常数为 30 毫秒。递归回路本身并不针对任务训练，被调整的只有读出。这种划分——液体固定、只训练读出——就是方法的操作核心。

## 实验

下面所有测试都是对这些模型回路的计算机模拟，不是培养神经元、类器官或完整动物的记录。

主要测试是图 4 中的消退记忆任务。每段输入长 1000 毫秒，分成 4 个 250 毫秒的片段。每个片段从两条泊松模板中选一条，再做时间抖动。在 \(t = 1000\) 毫秒，4 个读出必须报告每个片段来自哪一条模板。最后一个片段还新鲜地留在回路里；第一个片段发生在 750–1000 毫秒之前，并且已经被后来的脉冲覆盖。这里没有空间模式可以依靠，只有逐渐消退的时间痕迹。

![图 4. 消退记忆分类任务。每段 1000 毫秒的输入由 4 个 250 毫秒片段组成。每个片段从两条泊松模板中选一条，再做时间抖动。在 t = 1000 毫秒，4 个读出需判断每个片段来自哪条模板。](/img/readApaper-34/fig4_fading_memory_task.png)

<i>图 4. 消退记忆分类任务。每段 1000 毫秒的输入由 4 个 250 毫秒片段组成。每个片段从两条泊松模板中选一条，再做时间抖动。在 \(t = 1000\) 毫秒，4 个读出需判断每个片段来自哪条模板。</i>

在主系列中，每次试验都重新抽取模板，并重新随机连接一个柱（\(\lambda = 2\)）。读出用 1000 个样本训练，在 500 个未见过的输入上测试，并对 50 次试验取平均。一项对照把动态突触换成静态突触；其他对照则改变 \(\lambda\)，或比较单柱与 4 个互不相连的柱。另外两项模拟补全主线：多个读出在同一团未经训练的液体上受训，并在新颖输入上一起测试；以及一个读出在液体状态持续变化时，仍被要求维持接近恒定的目标。

## 结果

在抖动为 4 毫秒的消退记忆测试中（图 5），使用动态突触时，4 个读出在未见过的输入上都明显高于随机水平，包括负责更早片段的读出，并且最近一个片段的正确率最高。换成静态突触后，除最后一个片段外，成绩都明显下降；最早的片段接近随机水平。

![图 5. 消退记忆测试的结果。(A) 使用动态突触时，4 个读出在 t = 1000 毫秒对 500 个未见测试输入的平均正确率，对 50 次试验取平均。(B) 典型输入在 0.5–0.8 秒窗口内的液体脉冲。(C, D) 把动态突触换成平均活动相近的静态突触后的同一测试。较早片段可恢复的信息大幅减少，最后一段仍然容易。](/img/readApaper-34/fig5_fading_memory_results.png)

<i>图 5. 消退记忆测试的结果。(A) 使用动态突触时，4 个读出在 \(t = 1000\) 毫秒对 500 个未见测试输入的平均正确率，对 50 次试验取平均。(B) 典型输入在 0.5–0.8 秒窗口内的液体脉冲。(C, D) 把动态突触换成平均活动相近的静态突触后的同一测试。较早片段可恢复的信息大幅减少，最后一段仍然容易。</i>

回路结构会改变液体分离的“好用程度”（图 7）。没有递归连接的柱（\(\lambda = 0\)）对延迟片段任务是很差的液体。中等连接（约 \(\lambda = 2\)）优于在单柱里堆入许多长程连接（\(\lambda = 8\)）；后者对很小的抖动和真正的模式差异变得同样敏感。4 个 \(\lambda = 2\) 的柱能更有用地分开这两种情况，并且随着抖动增加，分类也更准确。

![图 7. 分离能力与成绩依赖于回路结构。(A, B) 一个柱与四个柱，每个柱 135 个神经元。(C) 稍后液体状态之间的平均距离，相对于输入脉冲序列距离作图。高度连接的单柱（lambda = 8）对很小和很大的输入差异变得同样敏感；4 个 lambda = 2 的柱随输入距离更成比例地上升。(D) 延迟片段任务的平均正确率随输入抖动增加的变化。](/img/readApaper-34/fig7_separation_and_columns.png)

<i>图 7. 分离能力与成绩依赖于回路结构。(A, B) 一个柱与四个柱，每个柱 135 个神经元。(C) 稍后液体状态之间的平均距离，相对于输入脉冲序列距离作图。高度连接的单柱（\(\lambda = 8\)）对很小和很大的输入差异变得同样敏感；4 个 \(\lambda = 2\) 的柱随输入距离更成比例地上升。(D) 延迟片段任务的平均正确率随输入抖动增加的变化。</i>

在一团未经训练的液体上，多个独立训练的读出可以在新颖输入上跟上不同的实时目标。图 9 给出了互补的一点：对于一个新的 40 路输入，液体活动持续变化，但受过训练的读出在短暂过渡之后，仍然靠近一个恒定目标。接近恒定的输出，并不要求接近恒定的内部状态。

![图 9. 从不断变化的液体状态得到稳定读出。(A) 新颖的 40 路、每路 5 赫兹的泊松输入。(B) 135 个液体神经元的光栅图。(C) 液体群体速率，bin 宽 20 毫秒。(D) 读出活动（实线）与恒定目标（虚线）。(E) 一个读出神经元上的权重分布，显示许多液体细胞都有贡献。](/img/readApaper-34/fig9_equivalent_states.png)

<i>图 9. 从不断变化的液体状态得到稳定读出。(A) 新颖的 40 路、每路 5 赫兹的泊松输入。(B) 135 个液体神经元的光栅图。(C) 液体群体速率，bin 宽 20 毫秒。(D) 读出活动（实线）与恒定目标（虚线）。(E) 一个读出神经元上的权重分布，显示许多液体细胞都有贡献。</i>

## 分析

定理和模拟扮演的角色不同。定理说的是：在理想条件下，具有消退记忆的实时映射，可以被“能够分离的液体 + 灵活的读出”所逼近。模拟则表明，某一类随机连接的积分发放回路，能够支撑这一想法的几个高要求实例：延迟分类、多个读出共享一个未经训练的液体，以及从不断变化的状态中给出稳定输出。它们是关于模型回路的证据，并不是证明某个活体网络、培养组织或类器官已经按这种方式被训练过。

这些结果真正支持的，是学习和记忆被放在何处的一次调整。递归回路可以是通用的，并且在任务中保持固定，在有限时间里保留近期扰动的高维痕迹。读出再学习这些痕迹里哪些差异是要紧的，因此多个读出可以共享同一团液体。

对照实验补充了机制，但仍然是在模型内部。动态突触帮助回路在数百毫秒之后仍能对语境保持敏感，尽管单个神经元的时间常数只有 30 毫秒。在这一设置里，递归是必要的，但更多并不自动更好：中等的、部分局部的连接，比接近全局连接的柱更好用。

## 总结

Maass、Natschläger 和 Markram 用一种更简单的分工，替代了对稳定内部状态的要求。一个通用的递归回路——液体——把一连串扰动转换成逐渐消退的高维状态；一个为任务训练过的无记忆读出，每时每刻都从该状态中取值。如果不同的输入历史能在液体中分开，并且读出能够逼近所需的映射，那么即使内部状态一直在动，实时计算也可以进行。在计算机模拟中，这套方案能恢复数百毫秒之前的事件，能让多个任务共享一个未经训练的液体，也能从不稳定的状态中给出稳定的输出。

## References

- Maass, W., Natschläger, T., & Markram, H. (2002). <i>Real-Time Computing Without Stable States: A New Framework for Neural Computation Based on Perturbations.</i> Neural Computation, 14(11), 2531–2560。[doi.org/10.1162/089976602760407955](https://doi.org/10.1162/089976602760407955) · [PDF](https://igi-web.tugraz.at/PDF/130.pdf)
- Boyd, S., & Chua, L. O. (1985). <i>Fading memory and the problem of approximating nonlinear operators with Volterra series.</i> IEEE Transactions on Circuits and Systems, 32, 1150–1161。[doi.org/10.1109/TCS.1985.1085649](https://doi.org/10.1109/TCS.1985.1085649)
- Douglas, R., & Martin, K. (1998). Neocortex. In G. M. Shepherd (Ed.), <i>The synaptic organization of the brain</i> (pp. 459–509). Oxford University Press.
- Markram, H., Wang, Y., & Tsodyks, M. (1998). <i>Differential signaling via the same axon of neocortical pyramidal neurons.</i> Proceedings of the National Academy of Sciences, 95(9), 5323–5328。[doi.org/10.1073/pnas.95.9.5323](https://doi.org/10.1073/pnas.95.9.5323)
- Shepherd, G. M. (1988). A basic circuit for cortical organization. In M. Gazzaniga (Ed.), <i>Perspectives in memory research</i> (pp. 93–134). MIT Press.
- Figures 1, 4, 5, 7, and 9 are from Maass, Natschläger, and Markram (2002).
