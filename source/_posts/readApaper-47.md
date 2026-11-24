---
title: "readApaper#47 Neural population dynamics during reaching"
title_zh: "readApaper#47 到达运动中的神经群体动力学"
date: 2026-12-03 22:00:00
tags:
  - readApaper
  - neuroscience
  - motor-cortex
  - neural-dynamics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 6 minutes · 3 December 2026 · Nature, 2012</i>

This paper shows that when monkeys reach in many directions, motor and premotor cortical populations do not simply hold a static map of reach direction. Instead, their activity rotates in a low-dimensional state space, in a stereotyped way that begins just before movement and lasts about one to one-and-a-half cycles.

## Background

To move the arm, the brain must turn an intention into a changing pattern of muscle contractions. A natural place to look for that transformation is the motor and premotor cortex, where many neurons change their firing around the time of a reach. For decades, a common way to describe those neurons was in terms of <b>tuning</b>: a cell might fire more for reaches in one direction than another, as if it preferred a particular movement.

Tuning is a useful summary of one cell at one moment, but a reach is a trajectory through time, and cortex is a population. If one plots the activity of many neurons together, each moment becomes a point in a high-dimensional space, and a movement becomes a path through that space. The question is what those paths look like. Do they simply point in a direction that matches the reach, like a library of preferred-direction arrows? Or do they follow a deeper dynamical pattern that is only loosely related to the path of the hand?

A helpful experimental setting is the <b>delayed reach</b>. A target appears, but the animal must wait before moving. During the delay, cortex is already in a <b>preparatory</b> state. When the go cue arrives, that state gives way to movement-related activity. Comparing many reach directions, and many datasets, makes it possible to ask whether the transition out of preparation has a consistent geometry.

## Problem

If each neuron’s firing were mainly a snapshot of reach direction or muscle force, then population activity should look like a set of conditions that sit in different places according to where the hand is going. Apparent rotations or oscillations might then be an accident of how individual cells are tuned, or they might simply mirror the curved path of the hand. The authors asked a more specific question: once many neurons are viewed together, is the transition from preparation to movement a structured rotation that is shared across reach types, and if so, is that rotation just a readout of the reach’s kinematics?

## Method

The recordings came from the motor and premotor cortex of four monkeys (A, B, J and N). The authors analyzed 469 single-neuron recordings and, in two further datasets from monkeys J and N, 364 simultaneous recordings (single- and multi-unit) obtained with two pairs of 96-electrode arrays. In all, they analyzed nine datasets, each with 27–108 reach conditions. The task was a delayed reach, with delays ranging from 0 to 1,000 ms.

To look at population trajectories, they first reduced the data with principal component analysis and then applied a method they call <b>jPCA</b>. The idea is to find a plane, within the top principal components, in which the population state tends to rotate rather than merely translate. To be conservative, jPCA was applied only to the top six principal components. Most analyses used a 200 ms window, sampled every 10 ms, starting just before the rapid transition from preparatory to movement-related activity.

![Figure 1. Oscillation of neural firing rates during three movement types (Churchland et al., 2012, Fig. 1). The figure compares rhythmic activity, including reaching-related cortical responses, and illustrates quasi-oscillatory rate patterns around movement.](/img/readApaper-47/churchland_fig1.png)

<i>Figure 1. Oscillation of neural firing rates during three movement types (Churchland et al., 2012, Fig. 1). The figure compares rhythmic activity, including reaching-related cortical responses, and illustrates quasi-oscillatory rate patterns around movement.</i>

If the rotational structure were a trivial consequence of how single neurons are tuned, it should not survive careful controls. The authors therefore compared the observed rotations with the curvature of the reaches themselves, and they asked whether different conditions rotated in the same direction and with a phase that followed the preparatory state.

## Experiments

Each dataset contained many reach types, so the same analysis could be repeated across directions, distances and animals. The authors examined how strongly the first jPCA plane captured the population variance during the 200 ms transition, how many cycles the quasi-oscillations lasted, and whether the rotational direction was consistent across conditions. They also asked whether the phase of the rotation could be predicted from the preparatory state, which would mean that preparation sets the starting point on a shared underlying cycle rather than selecting an entirely different path for each reach.

Because some reaches are themselves curved, a key comparison was whether the neural rotation simply traced the hand path. The paper also uses simultaneously recorded populations, not only neurons collected on different days, to show that the same structure is visible when the whole population is observed at once.

## Results

Across datasets, population activity during the transition into movement displayed quasi-oscillatory rotations lasting about 1–1.5 cycles. These patterns were seen for all reach types and in all animals examined. The rotations began just before movement onset, consistent with a change in cortical state that precedes the hand’s motion rather than merely following it.

![Figure 2. Firing rate versus time for 10 example neurons (Churchland et al., 2012, Fig. 2). Traces show mean across-trial firing rates for each condition, colored by the firing rate at the end of the preparatory period, and aligned separately to target onset, the go cue, and movement onset.](/img/readApaper-47/churchland_fig2.png)

<i>Figure 2. Firing rate versus time for 10 example neurons (Churchland et al., 2012, Fig. 2). Traces show mean across-trial firing rates for each condition, colored by the firing rate at the end of the preparatory period, and aligned separately to target onset, the go cue, and movement onset.</i>

The rotations had a consistent direction across conditions: different reaches did not spin opposite ways simply because they pointed opposite ways. Instead, conditions were separated mainly by phase, and that phase followed the preparatory state. In other words, where the population sat during the delay predicted where it would enter the shared rotation when the movement began.

![Figure 3. Projections of the neural population response (Churchland et al., 2012, Fig. 3). Each trace plots the first 200 ms of movement-related activity away from the preparatory state in a jPCA plane; conditions are colored by their preparatory projection, and rotations share a common direction.](/img/readApaper-47/churchland_fig3.png)

<i>Figure 3. Projections of the neural population response (Churchland et al., 2012, Fig. 3). Each trace plots the first 200 ms of movement-related activity away from the preparatory state in a jPCA plane; conditions are colored by their preparatory projection, and rotations share a common direction.</i>

The neural rotations were not a direct map of reach curvature. Reaches that were relatively straight could still be accompanied by clear rotations in state space, and the geometry of the population trajectory did not simply reproduce the path of the hand. The same qualitative structure appeared in the simultaneous array recordings as in the sequentially collected single-neuron datasets, indicating that the result is a property of the population recorded together, not an artifact of combining cells across days.

![Figure 4. Projections of simulated neural and muscle populations (Churchland et al., 2012, Fig. 4). Simple kinematic or muscle-based models do not reproduce the rotational population geometry observed in motor cortex, showing that the neural rotations are not a direct map of reach curvature.](/img/readApaper-47/churchland_fig4.png)

<i>Figure 4. Projections of simulated neural and muscle populations (Churchland et al., 2012, Fig. 4). Simple kinematic or muscle-based models do not reproduce the rotational population geometry observed in motor cortex, showing that the neural rotations are not a direct map of reach curvature.</i>

## Analysis

The result reframes what motor cortical activity is doing at the start of a reach. Rather than only holding a static code for direction, the population follows a dynamical motif—a short, stereotyped rotation—whose starting phase is set by preparation. That picture helps explain why preparatory activity is useful even though the arm has not yet moved: it can place the population at the right point on a forthcoming trajectory.

It also cautions against reading every change in a single neuron as a change in a preferred direction or a muscle command. A neuron that appears to rise and fall, or even to flip its apparent preference, may simply be one coordinate of a rotating population state. The fact that the rotations last only about one to one-and-a-half cycles, rather than ringing on, fits a generator that produces a brief movement, not a continuous clock that keeps oscillating for its own sake.

Because the rotation is shared across many reach conditions and is not a copy of hand curvature, the authors argue that it is a population-level dynamical pattern, visible in the leading principal components and recoverable with jPCA. The delayed-reach design is what makes that pattern easier to see: preparation and movement can be separated in time, and many conditions can be placed on the same plot.

## Summary

In nine datasets from four monkeys, including 469 single neurons and 364 simultaneous array recordings, motor and premotor population activity rotates in a low-dimensional plane when a delayed reach begins. The quasi-oscillations last about 1–1.5 cycles, start just before movement, share a common direction across 27–108 conditions, and have a phase that follows the preparatory state rather than the curvature of the hand. jPCA applied to the top six principal components, in a 200 ms window around the preparatory-to-movement transition, is what makes this structure visible.

## References

Churchland, M. M., Cunningham, J. P., Kaufman, M. T., Foster, J. D., Nuyujukian, P., Ryu, S. I., & Shenoy, K. V. (2012). Neural population dynamics during reaching. <i>Nature, 487</i>(7405), 51–56. Published 3 June 2012. [https://doi.org/10.1038/nature11129](https://doi.org/10.1038/nature11129)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 6 分钟 · 2026-12-03 · Nature, 2012</i>

这篇论文表明，当猴子向许多方向做到达运动时，运动皮层和运动前皮层的神经元群体并不是简单地保持一份关于到达方向的静态地图。相反，它们的活动在一个低维状态空间中旋转，这种旋转以刻板的方式在运动即将开始时出现，并持续大约 1 到 1.5 个周期。

## 背景

要让手臂动起来，大脑必须把意图转换成不断变化的肌肉收缩模式。一个自然的观察位置是运动皮层和运动前皮层：许多神经元会在到达运动前后改变发放。几十年来，描述这些神经元的常见方式是<b>调谐</b>：某个细胞对某一方向的到达发放更多，仿佛它偏好某种运动。

调谐是对单个细胞在某一时刻的有用概括，但一次到达是一条随时间展开的轨迹，而皮层是一个群体。如果把许多神经元的活动画在一起，每一个时刻都变成高维空间中的一个点，一次运动就变成穿过该空间的一条路径。问题是这些路径看起来像什么。它们是否只是指向与到达方向一致的方向，像一组“偏好方向”的箭头？还是它们遵循一种与手的路径只松散相关的、更深层的动力学模式？

一个有帮助的实验设置是<b>延迟到达</b>。目标出现后，动物必须先等待再开始运动。在延迟期间，皮层已经处于<b>准备</b>状态。当“开始”提示出现后，这一状态让位于与运动相关的活动。比较许多到达方向和许多数据集，就可以询问：从准备到运动的转换，是否具有一致的几何结构。

## 问题

如果每个神经元的发放主要是到达方向或肌力的瞬时快照，那么群体活动看起来就应当是：不同条件按照手要去的方向，坐落在不同的位置。表面上的旋转或振荡，也许只是单个细胞调谐方式带来的巧合，或者只是在追随手的弯曲路径。作者提出了一个更具体的问题：当许多神经元被放在一起观察时，从准备到运动的转换是否是一种在不同到达类型之间共享的、有结构的旋转？如果是，这种旋转是否只是对到达运动学的读出？

## 方法

记录来自四只猴子（A、B、J 和 N）的运动皮层和运动前皮层。作者分析了 469 个单神经元记录，并在猴子 J 和 N 的另外两个数据集中，用两对 96 通道电极阵列获得了 364 个同时记录（包括单单位和多单位）。他们一共分析了 9 个数据集，每个数据集包含 27–108 种到达条件。任务是延迟到达，延迟时间从 0 到 1,000 毫秒不等。

为了观察群体轨迹，他们先用主成分分析降低数据维度，再使用一种他们称为 <b>jPCA</b> 的方法。其想法是在前几个主成分中找到一个平面，使群体状态倾向于在该平面内旋转，而不仅仅是平移。为了更加保守，jPCA 只应用于前 6 个主成分。大多数分析使用 200 毫秒的窗口，每 10 毫秒采样一次，起始点就在从准备活动快速转为运动相关活动之前。

![图 1. 三种运动类型中神经发放率的振荡（Churchland 等，2012，图 1）。该图比较了包括到达相关皮层反应在内的节律性活动，并展示了运动前后准振荡的发放率模式。](/img/readApaper-47/churchland_fig1.png)

<i>图 1. 三种运动类型中神经发放率的振荡（Churchland 等，2012，图 1）。该图比较了包括到达相关皮层反应在内的节律性活动，并展示了运动前后准振荡的发放率模式。</i>

如果旋转结构只是单神经元调谐方式的平凡后果，它就不应当在仔细的对照中保留下来。因此，作者把观测到的旋转与到达轨迹本身的弯曲程度进行了比较，并询问不同条件是否沿同一方向旋转，以及相位是否跟随准备状态。

## 实验

每个数据集都包含许多种到达类型，因此同一分析可以在不同方向、不同距离和不同动物上重复。作者考察了第一 jPCA 平面在 200 毫秒转换期内捕获了多少群体方差，准振荡持续了多少个周期，以及旋转方向在各条件之间是否一致。他们还询问旋转的相位能否由准备状态预测，若可以，就意味着准备是把群体放到一条共享周期上的正确起点，而不是为每一次到达选择完全不同的路径。

由于有些到达轨迹本身是弯曲的，一个关键比较是：神经旋转是否只是在描摹手的路径。论文也使用了同时记录的群体，而不只是不同天收集的神经元，以表明当整个群体被同时观察到时，同样的结构仍然可见。

## 结果

在各个数据集中，进入运动时的群体活动都表现出持续约 1–1.5 个周期的准振荡旋转。所有到达类型、所有被考察的动物都出现了这些模式。旋转在运动起始之前就已经开始，这与皮层状态的变化先于手的运动、而不仅仅是跟随手的运动相一致。

![图 2. 10 个示例神经元的发放率随时间变化（Churchland 等，2012，图 2）。每条轨迹是各条件下跨试验的平均发放率，颜色由准备期末的发放率决定，并分别对齐到目标出现、“开始”提示和运动起始。](/img/readApaper-47/churchland_fig2.png)

<i>图 2. 10 个示例神经元的发放率随时间变化（Churchland 等，2012，图 2）。每条轨迹是各条件下跨试验的平均发放率，颜色由准备期末的发放率决定，并分别对齐到目标出现、“开始”提示和运动起始。</i>

各条件的旋转方向是一致的：不同到达并不会仅仅因为指向相反就反向旋转。相反，各条件主要是在相位上分开，而相位跟随准备状态。换句话说，延迟期群体所处的位置，可以预测运动开始时它会从共享旋转的哪一点进入。

![图 3. 神经群体反应的投影（Churchland 等，2012，图 3）。每条轨迹在 jPCA 平面中绘制离开准备状态后前 200 毫秒的运动相关活动；各条件按准备期投影着色，旋转具有共同方向。](/img/readApaper-47/churchland_fig3.png)

<i>图 3. 神经群体反应的投影（Churchland 等，2012，图 3）。每条轨迹在 jPCA 平面中绘制离开准备状态后前 200 毫秒的运动相关活动；各条件按准备期投影着色，旋转具有共同方向。</i>

神经旋转并不是到达轨迹弯曲程度的直接映射。相对较直的到达，仍可能伴随着状态空间中清晰的旋转；群体轨迹的几何结构也并不只是在复制手的路径。在同时进行的阵列记录中，出现了与跨天收集的单神经元数据集相同的定性结构，说明这一结果是被同时记录的群体本身的性质，而不是把不同天的细胞拼在一起造成的假象。

![图 4. 模拟神经和肌肉群体的投影（Churchland 等，2012，图 4）。简单的运动学或基于肌肉的模型不能再现运动皮层中观测到的旋转群体几何，说明神经旋转并不是到达轨迹弯曲程度的直接映射。](/img/readApaper-47/churchland_fig4.png)

<i>图 4. 模拟神经和肌肉群体的投影（Churchland 等，2012，图 4）。简单的运动学或基于肌肉的模型不能再现运动皮层中观测到的旋转群体几何，说明神经旋转并不是到达轨迹弯曲程度的直接映射。</i>

## 分析

这一结果重新框定了到达开始时运动皮层活动在做什么。群体并不仅仅持有一份关于方向的静态编码，而是遵循一种动力学母题——一次短暂而刻板的旋转——其起始相位由准备状态设定。这有助于解释为什么在手臂尚未移动时准备活动仍然有用：它可以把群体放到即将展开的轨迹上的正确位置。

它也提醒我们，不要把单个神经元的每一次变化都读成偏好方向或肌肉指令的改变。一个看起来上升又下降、甚至表观偏好发生翻转的神经元，可能只是旋转着的群体状态中的一个坐标。旋转只持续大约 1 到 1.5 个周期，而不是一直响下去，这符合一个用于产生短暂运动的生成器，而不是一个为自己不断振荡的时钟。

因为这种旋转在许多到达条件中是共享的，并且不是手部曲率的副本，作者认为它是一种群体水平的动力学模式，可以在主要主成分中看到，并用 jPCA 恢复。延迟到达的设计使这一模式更容易被看见：准备和运动可以在时间上分开，许多条件可以被放在同一张图上。

## 总结

在来自四只猴子的 9 个数据集中，包括 469 个单神经元和 364 个同时阵列记录，当延迟到达开始时，运动皮层和运动前皮层的群体活动在一个低维平面内旋转。准振荡持续约 1–1.5 个周期，在运动即将开始时出现，在 27–108 种条件中具有共同方向，并且其相位跟随准备状态，而不是手的弯曲路径。将 jPCA 应用于前 6 个主成分，并在准备到运动转换附近的 200 毫秒窗口中分析，使这一结构得以显现。

## 参考文献

Churchland, M. M., Cunningham, J. P., Kaufman, M. T., Foster, J. D., Nuyujukian, P., Ryu, S. I., & Shenoy, K. V. (2012). Neural population dynamics during reaching. <i>Nature, 487</i>(7405), 51–56. Published 3 June 2012. [https://doi.org/10.1038/nature11129](https://doi.org/10.1038/nature11129)
