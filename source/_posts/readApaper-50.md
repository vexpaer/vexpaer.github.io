---
title: "readApaper#50 Synaptic Modifications in Cultured Hippocampal Neurons: Dependence on Spike Timing, Synaptic Strength, and Postsynaptic Cell Type"
title_zh: "readApaper#50 培养海马神经元中的突触修饰：依赖于锋电位时序、突触强度和突触后细胞类型"
date: 2026-12-06 22:00:00
tags:
  - readApaper
  - neuroscience
  - synaptic-plasticity
  - stdp
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 6 minutes · 6 December 2026 · Journal of Neuroscience, 1998</i>

This classic paper shows that, in cultured hippocampal neurons, the direction of a synaptic change depends on the relative timing of pre- and postsynaptic spikes, on how strong the synapse already is, and on whether the postsynaptic cell is excitatory or inhibitory.

## Background

A synapse is a contact that lets one neuron influence another. If that contact can be made stronger or weaker depending on how the two cells fire, a circuit can store something about recent activity. Two of the best-known such changes are <b>long-term potentiation</b> (LTP), a lasting increase in synaptic strength, and <b>long-term depression</b> (LTD), a lasting decrease.

By the late 1990s it was already clear that many excitatory synapses in the hippocampus can undergo LTP or LTD, and that the <b>NMDA receptor</b>—a glutamate receptor that opens more readily when the postsynaptic cell is also depolarized—is often required. What was less clearly drawn was a precise timing rule. If the presynaptic cell fires and then the postsynaptic cell fires, should the synapse grow stronger? If the order is reversed, should it grow weaker? And does that rule apply equally to every synapse, or only to some, depending on their current strength or on the type of the postsynaptic cell?

Cultured hippocampal neurons offer a practical way to ask those questions. Cells from the rat hippocampus are dissociated, grown in a dish, and recorded in pairs, so that the experimenter can control the spikes of both the presynaptic and the postsynaptic neuron and measure the resulting excitatory postsynaptic current (EPSC).

## Problem

The problem is to determine how the sign and the size of a synaptic modification depend on spike timing, and to test two further conditions that a purely timing-based slogan might miss. First, does a given timing window produce LTP at all synapses, or only at synapses that are initially weak? Second, does the same pairing change synapses onto excitatory and inhibitory postsynaptic cells in the same way? Without those distinctions, a single “spike-timing” rule could be applied more broadly than the data allow.

## Method

The authors worked in dissociated cultures of rat hippocampal neurons and recorded from synaptically connected pairs. To induce plasticity they used a simple, stereotyped protocol: 60 pulses at 1 Hz, with a controlled delay between presynaptic activation and a postsynaptic spike. They then measured the change in EPSC amplitude.

The key independent variable was the time difference, Δt, between the two spikes. Postsynaptic spiking shortly after presynaptic activation corresponds to a positive Δt in the usual convention of this literature; postsynaptic spiking shortly before presynaptic activation corresponds to a negative Δt. The authors also grouped synapses by their initial EPSC size, and they identified postsynaptic cells as excitatory or GABAergic. Pharmacological tests asked whether the changes required NMDA receptors, and whether the L-type calcium channel blocker nimodipine altered LTP or LTD.

![Figure 1. Glutamatergic and GABAergic connections between cultured hippocampal neurons (Bi and Poo, 1998, Fig. 1). Paired recordings were used to measure monosynaptic EPSCs and to control the relative timing of presynaptic and postsynaptic spikes.](/img/readApaper-50/bipoo_fig1.png)

<i>Figure 1. Glutamatergic and GABAergic connections between cultured hippocampal neurons (Bi and Poo, 1998, Fig. 1). Paired recordings were used to measure monosynaptic EPSCs and to control the relative timing of presynaptic and postsynaptic spikes.</i>

## Experiments

Timing curves were built by repeating the 60-pulse, 1 Hz pairing at many values of Δt and plotting the resulting percentage change in EPSC amplitude. A central question was how wide the effective window was, and how sharp the transition was near Δt = 0. Separate analyses asked whether significant LTP appeared only when the initial EPSC was below a given size, and whether LTD depended as strongly on that initial strength.

Cell-type tests asked whether the same pairing that modified synapses onto excitatory neurons also modified synapses onto GABAergic postsynaptic cells. NMDA-receptor antagonists were used to test dependence of both LTP and LTD on NMDA current. Nimodipine was used to test a role for L-type calcium channels, and the size of LTP with and without the drug was compared directly.

## Results

Repetitive postsynaptic spiking within a 20 ms window after presynaptic activation produced LTP, whereas postsynaptic spiking within a 20 ms window before repetitive presynaptic activation produced LTD. Outside that roughly 40 ms window, the same 60 pulses at 1 Hz produced little change. The transition around Δt = 0 was sharp, on the order of 5 ms, and was fluctuating rather than a perfectly deterministic flip at zero.

![Figure 7. Critical window for the induction of synaptic potentiation and depression (Bi and Poo, 1998, Fig. 7). The percentage change in EPSC amplitude is plotted against spike timing (Δt) after 60 pulses at 1 Hz. LTP occurs when a postsynaptic spike follows presynaptic activation by less than 20 ms; LTD occurs when it precedes it by less than 20 ms.](/img/readApaper-50/bipoo_fig7.png)

<i>Figure 7. Critical window for the induction of synaptic potentiation and depression (Bi and Poo, 1998, Fig. 7). The percentage change in EPSC amplitude is plotted against spike timing (Δt) after 60 pulses at 1 Hz. LTP occurs when a postsynaptic spike follows presynaptic activation by less than 20 ms; LTD occurs when it precedes it by less than 20 ms.</i>

Significant LTP was observed only at initially weak synapses, defined as those with an EPSC smaller than 500 pA. LTD was less dependent on the initial synaptic strength: synapses that were already relatively strong could still be depressed by the pre-after-post timing, even when they did not potentiate under the opposite order.

![Figure 5. Dependence of synaptic modifications on the initial synaptic strength (Bi and Poo, 1998, Fig. 5). Significant LTP is seen only at initially weak synapses (EPSC < 500 pA), whereas LTD depends less on the initial EPSC amplitude.](/img/readApaper-50/bipoo_fig5.png)

<i>Figure 5. Dependence of synaptic modifications on the initial synaptic strength (Bi and Poo, 1998, Fig. 5). Significant LTP is seen only at initially weak synapses (EPSC \< 500 pA), whereas LTD depends less on the initial EPSC amplitude.</i>

Both the potentiation and the depression depended on NMDA receptors. The same spike-timing protocol did not produce these modifications when the postsynaptic cell was GABAergic: the timing rule, as measured here, was not a universal property of every postsynaptic target in the culture. Nimodipine abolished LTD and reduced LTP, from 48.4 ± 9.9% (n = 14) to 27.3 ± 8.6% (n = 4), a difference that did not reach conventional significance (p = 0.068).

![Figure 8. Differential effects of nimodipine on LTP and LTD induced by correlated spiking (Bi and Poo, 1998, Fig. 8). Nimodipine abolished LTD and reduced LTP from 48.4 ± 9.9% (n = 14) to 27.3 ± 8.6% (n = 4, p = 0.068).](/img/readApaper-50/bipoo_fig8.png)

<i>Figure 8. Differential effects of nimodipine on LTP and LTD induced by correlated spiking (Bi and Poo, 1998, Fig. 8). Nimodipine abolished LTD and reduced LTP from 48.4 ± 9.9% (n = 14) to 27.3 ± 8.6% (n = 4, p = 0.068).</i>

## Analysis

The paper supplies one of the clearest early demonstrations that the order of two spikes, not only their coincidence, can set the sign of a synaptic change. A postsynaptic spike that follows a presynaptic spike by less than 20 ms strengthens the synapse; a postsynaptic spike that precedes it by less than 20 ms weakens it. That is the empirical core of what later work often calls spike-timing-dependent plasticity, stated here with an explicit 20 ms window on each side and with little change outside the resulting 40 ms interval.

Equally important are the two qualifications that the title already names. Timing is not enough if the synapse is already strong: LTP, under this protocol, is reserved for initially weak contacts (EPSC \< 500 pA), whereas LTD is more broadly available. Timing is also not enough if the postsynaptic cell is inhibitory: the modifications were absent onto GABAergic neurons. NMDA-receptor dependence places both directions of change in a familiar hippocampal mechanism, while the nimodipine result suggests that L-type calcium channels contribute, especially to LTD, even though the reduction of LTP itself was only marginal (p = 0.068) with a small comparison sample.

The fluctuating 5 ms transition near coincidence is a warning against treating the rule as a perfectly clean step function. Near Δt = 0, the same nominal timing can yield different outcomes, which is consistent with a process that is sensitive to small differences in the exact voltages and conductances of each trial.

## Summary

In cultured rat hippocampal pairs, 60 pulses at 1 Hz produced LTP when a postsynaptic spike followed presynaptic activation by less than 20 ms, and LTD when it preceded it by less than 20 ms, with little change outside that 40 ms window and a fluctuating transition of about 5 ms around coincidence. Significant LTP occurred only at initially weak synapses (EPSC \< 500 pA); LTD depended less on initial strength. Both changes were NMDA-dependent and were absent onto GABAergic postsynaptic cells. Nimodipine abolished LTD and reduced LTP from 48.4 ± 9.9% (n = 14) to 27.3 ± 8.6% (n = 4, p = 0.068).

## References

Bi, G.-q., & Poo, M.-m. (1998). Synaptic modifications in cultured hippocampal neurons: dependence on spike timing, synaptic strength, and postsynaptic cell type. <i>Journal of Neuroscience, 18</i>(24), 10464–10472. [https://doi.org/10.1523/JNEUROSCI.18-24-10464.1998](https://doi.org/10.1523/JNEUROSCI.18-24-10464.1998)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 6 分钟 · 2026-12-06 · Journal of Neuroscience, 1998</i>

这篇经典论文表明，在培养的海马神经元中，突触改变的方向取决于突触前与突触后锋电位的相对时序、突触原本有多强，以及突触后细胞是兴奋性还是抑制性。

## 背景

突触是一个神经元影响另一个神经元的接触点。如果这一接触能够根据两个细胞如何发放而变强或变弱，回路就可以保存与近期活动有关的信息。两类最著名的这类变化是<b>长时程增强</b>（LTP，突触强度的持久增加）和<b>长时程抑制</b>（LTD，突触强度的持久下降）。

到 20 世纪 90 年代末，人们已经清楚海马中的许多兴奋性突触可以发生 LTP 或 LTD，而且<b>NMDA 受体</b>——一种在突触后细胞同时去极化时更容易开放的谷氨酸受体——常常是必需的。当时还不太清楚的，是一条精确的时序规则。如果突触前细胞先发放、突触后细胞后发放，突触是否应当变强？如果顺序相反，是否应当变弱？这条规则是同样适用于每一个突触，还是只适用于其中一些，取决于它们当前的强度，或取决于突触后细胞的类型？

培养的海马神经元为回答这些问题提供了一种可行的方法。大鼠海马的细胞被分离后在培养皿中生长，并成对记录，实验者可以控制突触前和突触后神经元的锋电位，并测量由此产生的兴奋性突触后电流（EPSC）。

## 问题

问题是要确定突触修饰的符号和幅度如何依赖于锋电位时序，并检验一个纯粹基于时序的表述可能忽略的两个进一步条件。第一，给定的时序窗口是否会在所有突触上产生 LTP，还是只在最初较弱的突触上产生？第二，同样的配对是会以相同方式改变投射到兴奋性突触后细胞和抑制性突触后细胞的突触，还是不会？如果没有这些区分，一条单一的“锋电位时序”规则就可能被用得比数据所允许的更宽。

## 方法

作者在大鼠海马分离培养中工作，并对有突触连接的细胞对进行记录。为了诱导可塑性，他们使用了一套简单而刻板的方案：以 1 Hz 给出 60 个脉冲，并控制突触前激活与突触后锋电位之间的延迟，然后测量 EPSC 幅度的变化。

关键的自变量是两次锋电位之间的时间差 Δt。突触后锋电位紧跟在突触前激活之后，对应于这一文献中通常的正 Δt；突触后锋电位紧出现在突触前激活之前，则对应于负 Δt。作者还按初始 EPSC 大小对突触分组，并把突触后细胞区分为兴奋性或 GABA 能。药理学实验询问这些变化是否需要 NMDA 受体，以及 L 型钙通道阻断剂尼莫地平是否会改变 LTP 或 LTD。

![图 1. 培养海马神经元之间的谷氨酸能和 GABA 能连接（Bi 与 Poo，1998，图 1）。成对记录被用来测量单突触 EPSC，并控制突触前与突触后锋电位的相对时序。](/img/readApaper-50/bipoo_fig1.png)

<i>图 1. 培养海马神经元之间的谷氨酸能和 GABA 能连接（Bi 与 Poo，1998，图 1）。成对记录被用来测量单突触 EPSC，并控制突触前与突触后锋电位的相对时序。</i>

## 实验

时序曲线是通过在许多 Δt 值上重复 60 个脉冲、1 Hz 的配对，并绘制 EPSC 幅度的百分比变化而建立的。核心问题是有效窗口有多宽，以及在 Δt = 0 附近转换有多陡。另外的分析询问：显著的 LTP 是否只在初始 EPSC 低于某一大小时出现，以及 LTD 是否同样强烈地依赖于这一初始强度。

细胞类型实验询问：能修饰投射到兴奋性神经元之突触的同一套配对，是否也能修饰投射到 GABA 能突触后细胞的突触。NMDA 受体拮抗剂被用来检验 LTP 和 LTD 对 NMDA 电流的依赖性。尼莫地平被用来检验 L 型钙通道的作用，并直接比较加药与不加药时 LTP 的幅度。

## 结果

突触后神经元在突触前激活之后 20 毫秒窗口内重复发放，会产生 LTP；而在重复的突触前激活之前 20 毫秒窗口内发放，则会产生 LTD。在大约 40 毫秒的窗口之外，同样以 1 Hz 给出的 60 个脉冲几乎不引起变化。在 Δt = 0 附近的转换是陡峭的，大约为 5 毫秒，并且是波动的，而不是在零点发生完全确定的翻转。

![图 7. 诱导突触增强和抑制的关键时间窗口（Bi 与 Poo，1998，图 7）。在以 1 Hz 给出 60 个脉冲后，EPSC 幅度的百分比变化相对于锋电位时序（Δt）绘制。突触后锋电位在突触前激活之后不到 20 毫秒出现时产生 LTP，领先不到 20 毫秒时产生 LTD。](/img/readApaper-50/bipoo_fig7.png)

<i>图 7. 诱导突触增强和抑制的关键时间窗口（Bi 与 Poo，1998，图 7）。在以 1 Hz 给出 60 个脉冲后，EPSC 幅度的百分比变化相对于锋电位时序（Δt）绘制。突触后锋电位在突触前激活之后不到 20 毫秒出现时产生 LTP，领先不到 20 毫秒时产生 LTD。</i>

显著的 LTP 只出现在最初较弱的突触上，即 EPSC 小于 500 pA 的突触。LTD 对初始突触强度的依赖较弱：已经相对较强的突触，仍然可以被“先突触后、后突触前”的时序所抑制，即使它们在相反顺序下不会增强。

![图 5. 突触修饰对初始突触强度的依赖（Bi 与 Poo，1998，图 5）。显著的 LTP 只出现在最初较弱的突触（EPSC < 500 pA），而 LTD 对初始 EPSC 幅度的依赖较小。](/img/readApaper-50/bipoo_fig5.png)

<i>图 5. 突触修饰对初始突触强度的依赖（Bi 与 Poo，1998，图 5）。显著的 LTP 只出现在最初较弱的突触（EPSC \< 500 pA），而 LTD 对初始 EPSC 幅度的依赖较小。</i>

增强和抑制都依赖于 NMDA 受体。当突触后细胞是 GABA 能时，同一套锋电位时序方案不会产生这些修饰：这里测到的时序规则，并不是培养中每一种突触后靶细胞的普遍性质。尼莫地平取消了 LTD，并减小了 LTP，从 48.4 ± 9.9%（n = 14）降到 27.3 ± 8.6%（n = 4），这一差异未达到常规的显著性水平（p = 0.068）。

![图 8. 尼莫地平对相关发放所诱导的 LTP 和 LTD 的不同影响（Bi 与 Poo，1998，图 8）。尼莫地平取消了 LTD，并把 LTP 从 48.4 ± 9.9%（n = 14）降到 27.3 ± 8.6%（n = 4，p = 0.068）。](/img/readApaper-50/bipoo_fig8.png)

<i>图 8. 尼莫地平对相关发放所诱导的 LTP 和 LTD 的不同影响（Bi 与 Poo，1998，图 8）。尼莫地平取消了 LTD，并把 LTP 从 48.4 ± 9.9%（n = 14）降到 27.3 ± 8.6%（n = 4，p = 0.068）。</i>

## 分析

这篇论文提供了早期最清晰的演示之一：两次锋电位的先后顺序，而不仅仅是它们是否同时出现，可以决定突触改变的符号。紧随突触前锋电位之后不到 20 毫秒的突触后锋电位会增强突触；领先不到 20 毫秒的突触后锋电位则会减弱突触。这就是后来常被称为锋电位时序依赖可塑性的经验核心，在这里被明确表述为两侧各 20 毫秒的窗口，并且在由此形成的 40 毫秒区间之外几乎没有变化。

同样重要的是标题已经指出的两点限定。如果突触已经很强，仅有时序是不够的：在这一方案下，LTP 只属于最初较弱的接触（EPSC \< 500 pA），而 LTD 的适用范围更广。如果突触后细胞是抑制性的，仅有时序也不够：投射到 GABA 能神经元的突触没有出现这些修饰。对 NMDA 受体的依赖，把两个方向的变化都放进了熟悉的海马机制之中；尼莫地平的结果则提示 L 型钙通道有贡献，尤其是对 LTD，尽管 LTP 本身的减小在较小的比较样本中只是边缘性的（p = 0.068）。

在接近同时的附近出现约 5 毫秒、而且带有波动的转换，也提醒我们不要把这条规则当成一个完全干净的阶跃函数。在 Δt = 0 附近，名义上相同的时序可以产生不同结果，这与一个对每次试验中精确电压和电导的微小差异都很敏感的过程相一致。

## 总结

在培养的大鼠海马细胞对中，以 1 Hz 给出 60 个脉冲时，若突触后锋电位在突触前激活之后不到 20 毫秒出现，则产生 LTP；若领先不到 20 毫秒，则产生 LTD。在这 40 毫秒窗口之外几乎没有变化，在接近同时处有大约 5 毫秒的波动性转换。显著的 LTP 只出现在最初较弱的突触（EPSC \< 500 pA）；LTD 对初始强度的依赖较小。两种变化都依赖于 NMDA 受体，并且在 GABA 能突触后细胞上不出现。尼莫地平取消了 LTD，并把 LTP 从 48.4 ± 9.9%（n = 14）降到 27.3 ± 8.6%（n = 4，p = 0.068）。

## 参考文献

Bi, G.-q., & Poo, M.-m. (1998). Synaptic modifications in cultured hippocampal neurons: dependence on spike timing, synaptic strength, and postsynaptic cell type. <i>Journal of Neuroscience, 18</i>(24), 10464–10472. [https://doi.org/10.1523/JNEUROSCI.18-24-10464.1998](https://doi.org/10.1523/JNEUROSCI.18-24-10464.1998)
