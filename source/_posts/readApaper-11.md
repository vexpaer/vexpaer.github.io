---
title: "readApaper#11 The Neural Hawkes Process: A Neurally Self-Modulating Multivariate Point Process"
title_zh: "readApaper#11 The Neural Hawkes Process: A Neurally Self-Modulating Multivariate Point Process"
date: 2026-10-28 22:00:00
tags:
  - readApaper
  - machine-learning
  - point-process
cover: /img/readapaper-cover.png
bilingual: true
mathjax: true
---

<i>Reading time: about 6–7 minutes · </i><i>2026-10-28</i><i> · NeurIPS 2017</i>


<b>Why does one event make another more likely—and why can that influence change several times before the next event even occurs?</b>

Mei and Eisner's <b>Neural Hawkes Process</b> offers a way to learn the timing and types of events from their history. The key idea is to couple a <b>continuous-time LSTM</b> with a <b>temporal point process</b>: the LSTM remembers what happened, while the point process predicts <b>when the next event will happen and what kind of event it will be</b>. The memory changes when an event arrives and keeps evolving during the quiet intervals between events.

## 1. Start with Hawkes: the past changes the future

Imagine observing neurons A and B. A fires at 10 ms; B fires at 14 ms. Does A's firing make B more likely to fire next? Does that effect disappear after a few milliseconds?

A classical <b>Hawkes process</b> describes precisely this kind of history dependence. Every event type has a time-varying <b>intensity</b>, \(\lambda_k(t)\), meaning its instantaneous expected event rate. Within a very short interval \(dt\), the probability of an event of type \(k\) is approximately \(\lambda_k(t)\,dt\).

In the classical exponentially decaying version,

\[
\lambda_k(t)=\mu_k+\sum_{t_j<t}\alpha_{k_j,k}\exp[-\delta_{k_j,k}(t-t_j)].
\]

The baseline \(\mu_k\) is the background event rate. Each past event adds an influence of size \(\alpha\), which fades with decay rate \(\delta\). In the standard self-exciting Hawkes process, those added influences are positive.

This works nicely for simple excitation, but some event sequences are more intricate. An event may <b>inhibit</b> another event; repeated events may produce diminishing returns; the effects may depend on the <b>order</b> of earlier events; and an effect may appear only after a delay. Neural Hawkes learns such patterns from the sequence rather than insisting on one fixed additive rule.

## 2. The key innovation: an LSTM that also changes between events

An ordinary LSTM updates its state as new inputs arrive. The paper designs a <b>continuous-time LSTM (CT-LSTM)</b> with two complementary operations.

<b>When event </b><b>\(i\)</b><b> occurs:</b> the event type and the preceding state pass through LSTM-like gates. They determine a new memory value \(c_i\), a target memory \(\bar c_i\), and a positive decay-rate vector \(\delta_i\).

<b>While no new event occurs:</b> every memory component follows a continuous curve:

\[
c(t)=\bar c_i+(c_i-\bar c_i)\odot\exp[-\delta_i(t-t_i)], \quad t_i<t\leq t_{i+1}.
\]

The formula is intuitive. Immediately after an event, memory starts at \(c_i\). As time passes, it approaches \(\bar c_i\). The learned \(\delta_i\) decides how quickly that happens. Because these are vectors, some dimensions can remember very recent events while others carry longer-lived context.

The target memory matters: the state is relaxing toward a <b>learned, history-dependent value</b>, not necessarily toward zero. The interval without events therefore carries information too—the model's state keeps changing as time passes.

![Continuous-time Neural Hawkes mechanism](/img/readApaper-11/neural-hawkes-continuous-time-schematic.svg)

<i>Schematic of the continuous-time loop. Each event updates the CT-LSTM, which determines the memory dynamics between events; the resulting intensities govern the next event. Self-drawn from the mechanism in Section 3.2.2.</i>

In the original paper's <b>Figure 1</b>, the purple and green intensity curves show how the same event can excite one event type but inhibit another. The curves can jump when an event occurs, then change continuously afterward. [See original Figure 1 in the paper](https://proceedings.neurips.cc/paper_files/paper/2017/file/6463c88460bd63bbe256e495c63aa40b-Paper.pdf#page=2).

## 3. Turning continuous memory into future-event predictions

The changing cell memory is converted to a hidden state \(h(t)\) by an output gate and a nonlinear function. Then each event type receives its own intensity:

\[
\lambda_k(t)=f_k\!\left(w_k^\top h(t)\right), \qquad
f_k(x)=s_k\log(1+\exp(x/s_k)).
\]

The scaled <b>softplus</b> function keeps the intensity positive. The weight vector \(w_k\) maps the shared history representation to event type \(k\); \(s_k\) controls the transfer function's scale.

For neurons, we might <i>interpret</i> the event type as a neuron ID and each event as a spike. The model then assigns every neuron a time-varying firing intensity. In the paper's experiments, event types instead represent observations such as social-media actions, online phrases, or clinical records.

How is it trained? By maximizing the point-process log-likelihood:

\[
\ell=\sum_{i:t_i\leq T}\log\lambda_{k_i}(t_i)-\int_0^T\sum_k\lambda_k(t)\,dt.
\]

The first term rewards high intensity where events actually occur. The second measures the total predicted intensity across <b>all the periods in which events could have occurred</b>. Together, they teach the model both the observed event timings and the intervals of silence. The authors approximate the integral with Monte Carlo sampling.

## 4. What did the experiments show?

The authors compared three models: classical self-exciting Hawkes (<b>SE-MPP</b>), Hawkes with inhibition and nonlinear intensity (<b>D-SM-MPP</b>), and the proposed Neural Hawkes (<b>N-SM-MPP</b>).

On <b>Retweets</b> (three event types) and <b>MemeTrack</b> (5,000 event types), the neural version achieved substantially better test log-likelihood per event. The improvement over D-SM-MPP is particularly informative: adding inhibition helps, but the recurrent representation of complete event history adds further predictive power. See <b>Figure 2</b> for the learning curves and <b>Figure 3</b> for the per-sequence comparisons.

The paper also examined synthetic streams and real datasets involving financial activity, MIMIC-II clinical events, and Stack Overflow. In an experiment that systematically hid selected event types, the neural model outperformed classical Hawkes across <b>all 31 evaluated missing-event-type combinations</b> (Figure 4). On next-event prediction, its improvements were especially consistent for <b>event type</b>; results for <b>event time</b> were more mixed.

## 5. Why does this matter beyond the equations?

Think about a viral post. One retweet may briefly increase the chance of another. Several retweets in quick succession can create a wave of attention. But what if no one retweets it for an hour? That quiet interval also tells us something about what might happen next.

The same principle applies to other event streams, from online discussions to sequences of clinical records. <b>What happened matters, but so do the order of events and the time between them.</b> A model that keeps track of time between observations can use both the events and the gaps to build a better picture of what comes next.

Neural Hawkes makes this possible by giving the past a changing influence: every new event reshapes the model's memory, and that memory continues to evolve until another event appears.

## Takeaway

<b>Neural Hawkes gives event sequences a memory that keeps changing even when nothing happens.</b> Instead of treating the past as a simple collection of fading signals, it learns how different events interact over time. The central lesson is simple: <b>to predict the next event, we need to understand not only what happened, but also when it happened.</b>

---

## References / 参考资料

- Mei, H., & Eisner, J. (2017). <i>The Neural Hawkes Process: A Neurally Self-Modulating Multivariate Point Process</i>. <i>Advances in Neural Information Processing Systems</i>, 30. [NeurIPS paper](https://proceedings.neurips.cc/paper/2017/hash/6463c88460bd63bbe256e495c63aa40b-Abstract.html) · [Full PDF](https://proceedings.neurips.cc/paper_files/paper/2017/file/6463c88460bd63bbe256e495c63aa40b-Paper.pdf).
- [Author's original code (Theano)](https://github.com/hongyuanmei/neurawkes).
- Schematic diagram is original and explanatory, based on the architecture described by Mei & Eisner (2017), Section 3.2.2.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 6–7 分钟 · </i><i>2026-10-28</i><i> · NeurIPS 2017</i>

<b>一个事件发生以后，为什么另一个事件会变得更容易发生？这种影响又为什么会随着时间改变，甚至先抑制、后促进？</b>

Mei 和 Eisner 在 2017 年提出的 <b>Neural Hawkes Process（神经霍克斯过程）</b>，尝试让模型直接从历史事件中学习<b>下一个事件什么时候发生、属于哪一种类型</b>。它将<b>连续时间 LSTM</b>与<b>时间点过程（Temporal Point Process）</b>结合：事件来临时更新记忆，两次事件之间记忆仍然不断演化。

## 1. 从传统 Hawkes 说起：过去的事件会影响未来

设想两个神经元 A、B。A 在 10 ms 发放，B 在 14 ms 发放。A 的发放是否会影响 B 接下来产生 spike 的机会？这种影响经过几毫秒后是否会消失？

传统 <b>Hawkes Process</b> 可以描述这样的历史依赖。它用<b>强度函数（intensity）</b> \(\lambda_k(t)\) 表示事件类型 \(k\) 在时刻 \(t\) 的瞬时发生率。在足够短的 \(dt\) 时间内，发生该事件的概率约为 \(\lambda_k(t)dt\)。

经典的指数衰减 Hawkes 模型写成：

\[
\lambda_k(t)=\mu_k+\sum_{t_j<t}\alpha_{k_j,k}\exp[-\delta_{k_j,k}(t-t_j)].
\]

其中 \(\mu_k\) 是背景发生率；每个历史事件都会贡献一份大小为 \(\alpha\) 的影响，并以速率 \(\delta\) 随时间衰减。在经典自激发 Hawkes 中，这些贡献是正的。

但现实中的事件关系往往更加复杂：过去的事件可能<b>抑制</b>未来事件；同一个事件重复十次，效果未必是一次的十倍；先发生 A 后发生 B 与相反顺序可能得到不同结果；有些影响还会<b>延迟出现</b>。这篇论文希望让模型从数据中学习这些模式，而不再受固定叠加形式的约束。

## 2. 核心机制：两次事件之间仍然在变化的 LSTM

普通 LSTM 主要在收到新输入时更新隐藏状态。论文设计的 <b>Continuous-time LSTM（CT-LSTM）</b>则把状态变化分成两部分。

<b>第一部分：事件到达时更新。</b> 模型读取新事件的类型及之前的隐藏状态，通过类似 LSTM 的门控结构得到新的记忆 \(c_i\)、目标记忆 \(\bar c_i\)，以及衰减速率 \(\delta_i\)。

<b>第二部分：事件之间持续演化。</b> 没有新输入时，记忆仍按照下面的规律变化：

\[
c(t)=\bar c_i+(c_i-\bar c_i)\odot\exp[-\delta_i(t-t_i)], \quad t_i<t\leq t_{i+1}.
\]

这条公式可以直接读成：<b>记忆从当前值 </b><b>\(c_i\)</b><b> 出发，逐渐靠近目标值 </b><b>\(\bar c_i\)</b><b>；靠近的速度由可学习参数 </b><b>\(\delta_i\)</b><b> 决定。</b>

这里的 \(c\)、\(\bar c\) 和 \(\delta\) 都是向量，所以不同记忆维度可以有不同的时间尺度。有的维度只记得刚刚发生的事件，有的维度能保留更长时间的信息。

更巧妙的是，目标记忆本身也由历史决定，<b>记忆并不总是衰减到零</b>。即使没有事件发生，模型内部对下一次事件的预测也会随着时间改变。

![Continuous-time Neural Hawkes mechanism](/img/readApaper-11/neural-hawkes-continuous-time-schematic.svg)

<i>自绘示意图｜事件触发 CT-LSTM 状态更新，事件间隔内记忆连续演化，最后生成不同事件类型的强度函数。对应原论文 Section 3.2.2。</i>

再看原论文 <b>Figure 1</b>：紫色和绿色曲线分别是两类事件的发生强度。新事件到来时，曲线可能突然跳变；随后又在连续时间中变化。同一事件还可以提高一种事件的强度、降低另一种事件的强度。[查看原论文 Figure 1](https://proceedings.neurips.cc/paper_files/paper/2017/file/6463c88460bd63bbe256e495c63aa40b-Paper.pdf#page=2)。

## 3. 如何从记忆预测下一次事件？

CT-LSTM 将连续变化的记忆 \(c(t)\) 转换为隐藏状态 \(h(t)\)，再为每种事件计算发生强度：

\[
\lambda_k(t)=f_k\!\left(w_k^\top h(t)\right),\qquad
f_k(x)=s_k\log(1+\exp(x/s_k)).
\]

其中 \(w_k\) 将共享记忆映射到事件类型 \(k\)，\(f_k\) 是带有可学习尺度 \(s_k\) 的 <b>Softplus</b> 函数，用来确保发生强度始终为正。

如果把模型用于神经活动，事件类型可以对应“哪一个神经元”，事件时间则对应“什么时候发放 spike”。不过本文的实际数据来自转发、媒体短语、医疗事件等事件序列。

模型训练使用<b>点过程最大似然</b>：

\[
\ell=\sum_{i:t_i\leq T}\log\lambda_{k_i}(t_i)-\int_0^T\sum_k\lambda_k(t)\,dt.
\]

可以把它理解为两项配合：<b>真实事件发生时，模型应该给出较高强度；整个观察期内，也不能随意把所有时间点的发生强度都抬高。</b> 第二项积分把事件之间的“安静时段”也纳入学习。作者通过 Monte Carlo 采样近似积分。

## 4. 实验验证：增加记忆真的有用吗？

作者比较了三种模型：

- <b>SE-MPP</b>：传统的自激发 Hawkes。
- <b>D-SM-MPP</b>：加入抑制效应与非线性强度函数的 Hawkes。
- <b>N-SM-MPP</b>：本文提出、使用 CT-LSTM 的 Neural Hawkes。

在 <b>Retweets</b>（三种事件类型）和 <b>MemeTrack</b>（5,000 种事件类型）数据上，Neural Hawkes 获得了更好的测试集单事件对数似然。<b>Figure 2</b> 显示随训练数据量增加的性能曲线，<b>Figure 3</b> 则比较了每条测试序列上的差异。加入抑制机制本身已有帮助，而进一步用循环网络编码事件的完整历史，又取得了额外提升。

论文还评估了合成序列、金融活动、MIMIC-II 医疗记录和 Stack Overflow。在一组系统性隐藏部分事件类型的实验中，Neural Hawkes 在<b>全部 31 种受测的事件类型缺失组合</b>上都优于经典 Hawkes（Figure 4）。它对<b>下一事件类型</b>的预测改善更稳定，而事件发生时间的预测则依数据集有所不同。

## 5. 除了公式，这个模型有什么意义？

想象一条突然火起来的帖子。一次转发可能短暂提高下一次转发的机会；短时间内接连出现的转发，则可能形成一波关注。但如果接下来一个小时完全没人转发呢？<b>这段安静的时间，同样会改变我们对下一次转发的预期。</b>

这种现象也出现在其他事件序列中，例如网络讨论或医疗记录。<b>重要的不只是发生过什么，还有事件先后顺序，以及两次事件之间隔了多久。</b> 如果模型能在事件间隔内持续追踪时间，就能同时利用实际发生的事件和它们之间的空白。

Neural Hawkes 正是这样处理历史的：每当新事件出现，它都会调整记忆；而在下一个事件到来前，这份记忆也在不断变化。

## 总结

<b>Neural Hawkes 为事件序列加入了一种“即使没有新事件，也会随时间变化”的记忆。</b>

它不再仅仅把过去的影响看作几条逐渐消失的曲线，而是学习不同事件怎样随时间相互影响。理解这篇论文，可以记住一句话：<b>想预测接下来会发生什么，不仅要知道过去发生了什么，还要知道它们是什么时候发生的。</b>

---

## References / 参考资料

- Mei, H., & Eisner, J. (2017). <i>The Neural Hawkes Process: A Neurally Self-Modulating Multivariate Point Process</i>. <i>Advances in Neural Information Processing Systems</i>, 30. [NeurIPS paper](https://proceedings.neurips.cc/paper/2017/hash/6463c88460bd63bbe256e495c63aa40b-Abstract.html) · [Full PDF](https://proceedings.neurips.cc/paper_files/paper/2017/file/6463c88460bd63bbe256e495c63aa40b-Paper.pdf).
- [Author's original code (Theano)](https://github.com/hongyuanmei/neurawkes).
- Schematic diagram is original and explanatory, based on the architecture described by Mei & Eisner (2017), Section 3.2.2.
