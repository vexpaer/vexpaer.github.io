---
title: "readApaper#12 Brain organoid reservoir computing for artificial intelligence"
title_zh: "readApaper#12 Brain organoid reservoir computing for artificial intelligence"
date: 2026-10-29 22:00:00
tags:
  - readApaper
  - neuroscience
  - biological-computing
  - organoid-intelligence
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 10–12 minutes · 29 October 2026 · Nature Electronics (2023)</i>

<b>Can a living brain organoid work as part of a computer?</b>

Brainoware uses a human cortical organoid as a physical reservoir-computing system. The organoid receives electrical stimulation and produces neural responses that an external readout model uses for classification and prediction.

![Figure 1A. Original schematic of the Brainoware input–reservoir–readout pipeline.](/img/readApaper-12/Brainoware_architecture.svg)

<i>Figure 1A. Original schematic of the Brainoware input–reservoir–readout pipeline.</i>

## 1. The idea: let biology transform the input

A conventional reservoir-computing system has three parts: input encoding, a recurrent reservoir, and a readout. The encoder converts data into signals the reservoir can receive. The reservoir transforms those signals through its internal dynamics, while a comparatively simple readout maps its activity to the desired output.

Brainoware replaces the conventional reservoir with a human cortical organoid placed on a high-density microelectrode array (MEA). The MEA delivers spatiotemporal electrical stimulation and records the resulting spikes.



The authors also examine how the organoid responds over time. Nonlinearity means that a larger electrical input does not simply produce a proportionally larger response. Fading memory means that activity caused by an earlier input remains briefly in the network state and then decays. These properties allow the reservoir to represent both the current signal and traces of recent history.

![Figure 1B. Conceptual illustration of nonlinear response and fading memory. Curves are explanatory, not digitized data.](/img/readApaper-12/Brainoware_reservoir_properties.svg)

<i>Figure 1B. Conceptual illustration of nonlinear response and fading memory. Curves are explanatory, not digitized data.</i>



## 2. What tasks did the organoid perform?

The first task was <b>eight-speaker recognition</b> using a Japanese vowel dataset. It contained 240 speech segments from eight male speakers. Speech was transformed into spatiotemporal biphasic electrical pulses, delivered to the organoid, and the recorded neural activity was used to train a logistic-regression readout.

The reported recognition performance increased from <b>51.0 ± 7.8% before training to 78.0 ± 5.2% after four training epochs</b>.

The second task was prediction of a <b>Hénon map</b>, a nonlinear chaotic time series. A linear-regression readout predicted the next value. The reported regression score increased from <b>0.356 ± 0.071 to 0.812 ± 0.043</b> after repeated stimulation and training.

The authors also used K252a to interfere with activity-dependent plasticity. Under this treatment, the improvement was much smaller. This supports a role for biological plasticity in the adaptive reservoir, although it does not identify every synaptic mechanism responsible for the change.



## 3. What is actually learning?

This is the distinction I find most important in the paper. The <b>biological reservoir</b> can change its responses through repeated stimulation. The <b>readout model</b>, however, is trained with labelled examples: logistic regression for speaker recognition and linear regression for time-series prediction. The reported task performance therefore comes from a combined system.

Calling the organoid an adaptive reservoir is reasonable. Saying that the organoid independently learned to recognize speaker identities would go beyond the experiment.

The main figures report five organoids from three independent experiments. The results are a proof of concept, not evidence that every organoid will produce the same performance.

## 4. The unusual part: the reservoir itself can adapt

In textbook reservoir computing, the reservoir is usually fixed. The input is transformed by a recurrent dynamical system, and only the readout is trained. Brainoware adds a biological twist: repeated stimulation can reshape the organoid's functional connectivity. The reservoir is therefore not merely a passive, fixed feature generator.

The authors compare functional connectivity before and during training. They report changes that include strengthened and weakened connections, newly detected connections, and pruned connections. This gives a plausible biological route by which the same input can produce a different activity pattern after experience.

K252a is used to interfere with activity-dependent synaptic plasticity. Under this treatment, the organoid can still produce neural responses, but the training-associated improvement is strongly suppressed. This distinction matters: the tissue can continue to act as a reservoir while its adaptive component is disrupted.

## 5. Read the two demonstrations carefully

<b>Speech recognition.</b> The dataset contains 240 isolated Japanese vowel clips (/a/ and /e/) from eight male speakers. One complete dataset epoch was delivered every 12 hours over two days. The readout is logistic regression. Across five organoids from three independent experiments, mean accuracy increased from 51.0 ± 7.8% before training to 78.0 ± 5.2% after four training epochs.

The result is meaningful because the organoid's responses become more useful for distinguishing speakers after repeated exposure. However, the classifier is still an external model trained on labelled examples. The experiment therefore demonstrates an adaptive biological reservoir paired with a supervised readout—not an organoid independently learning the concept of speaker identity.

<b>Hénon-map prediction.</b> The Hénon map is a deterministic nonlinear system that can generate chaotic trajectories. The authors convert its two-dimensional state into a one-dimensional sequence, encode the sequence as spatiotemporal electrical pulses, and use a linear-regression readout to predict the next value. Each training epoch contains 200 data points; four epochs are delivered, one per day. The regression score rises from 0.356 ± 0.071 to 0.812 ± 0.043.

This task is useful because prediction requires the reservoir to retain information about recent inputs. A system that only responds to the current pulse, with no residual state, would have difficulty representing temporal dependencies.

## 6. What the results establish—and what they do not

The study establishes a proof of concept for a living neural reservoir with nonlinear response, fading memory, spatially distinguishable activity, and stimulation-associated adaptation. The authors also show that blocking plasticity interferes with improvement, which strengthens the argument that the biological network contributes more than a static electrical transducer.

The experimental scale remains small: the headline task results use five organoids from three independent experiments. The tasks are controlled laboratory benchmarks, and the input/output pipeline still relies on external electronics and conventional regression models. The paper also does not close the loop through a changing physical environment. That step appears in the later Brainobot work.

The strongest interpretation is therefore specific: biological tissue can act as a dynamic, adaptive computational substrate whose activity is useful to an external decoder. The study does not demonstrate a general-purpose biological computer.

## My perspective

Brainoware raises a useful question for biological computing: <b>where does the computation happen, and which component is responsible for the improvement?</b>

A strong evaluation should separate the input encoder, the biological reservoir, and the trained readout. One possible test is to keep the readout fixed after an initial training stage, then evaluate later sessions under the same input protocol. This would help distinguish changes in the biological reservoir from changes introduced by the external model.

For a future closed-loop system, an increase in task performance should be traced to its source: did the biological network change, did the decoder adapt, or did the input strategy become more effective? Brainoware provides a starting point for this question, but its demonstrations remain offline classification and prediction rather than real-time environmental control.

## Takeaway

- Brainoware uses a human cortical organoid as an adaptive reservoir.
- Nonlinearity and fading memory are the key computational properties tested.
- Speaker recognition improved from 51.0% to 78.0%; Hénon prediction score improved from 0.356 to 0.812.
- Biological plasticity and supervised readout training are separate contributors.
- The paper demonstrates biological reservoir computing, not a complete closed-loop intelligent agent.

## References / 参考资料

- Cai, H. et al. (2023). <i>Brain organoid reservoir computing for artificial intelligence</i>. Nature Electronics, 6, 1032–1039. [DOI](https://doi.org/10.1038/s41928-023-01069-w)
- [Nature Electronics — original article](https://www.nature.com/articles/s41928-023-01069-w)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 10–12 分钟 · 2026-10-29</i>

<b>活体脑类器官能不能成为计算机的一部分？</b>

Cai 等人的 Brainoware 尝试把人源脑类器官作为一种物理计算系统。研究者向类器官输入电刺激，记录它产生的神经活动，再训练一个相对简单的模型读取这些活动。这个思路属于<b>储备池计算（reservoir computing）</b>：利用复杂动态系统把输入转换成更丰富的响应，再由读出模型完成任务。

## 1. 核心思路：让生物网络变换输入

传统储备池计算包含三个部分：输入编码、储备池和读出器。输入编码把数据转成电信号；储备池利用内部动态处理输入；读出器再把神经活动映射成任务输出。

Brainoware 用放置在高密度微电极阵列（MEA）上的人源皮层类器官替代传统储备池。MEA 负责输入时空电刺激，也负责记录类器官产生的 spikes。

作者重点验证两种性质：<b>非线性（nonlinearity）</b>，即输入增加一倍时神经响应不一定增加一倍；以及<b>衰退记忆（fading memory）</b>，即刺激结束后，神经活动仍会保留近期输入的痕迹，随后逐渐衰减。

## 2. 类器官完成了什么任务？

第一个任务是<b>八位说话人识别</b>。作者使用日语元音数据集，包含八位男性说话人的 240 段语音。语音先被转换为时空双相电脉冲，再输入类器官。研究者记录神经活动，并使用逻辑回归（logistic regression）训练读出器。

论文报告的识别率从训练前的 <b>51.0 ± 7.8%</b> 提升到四个训练 epoch 后的 <b>78.0 ± 5.2%</b>。

第二个任务是预测 \*\*Hénon map（埃农映射）\*\*产生的非线性混沌时间序列。系统使用线性回归预测下一个数值。经过重复刺激和训练，论文报告的回归得分从 <b>0.356 ± 0.071</b> 提升到 <b>0.812 ± 0.043</b>。

作者还使用 K252a 干预活动依赖性可塑性。处理后，性能改善幅度明显减小。这支持生物可塑性参与储备池适应，但还不能确定具体是哪一种突触机制造成了变化。

## 3. 究竟是哪一部分在学习？

<b>生物储备池</b>会因为重复刺激而改变自身响应；但<b>读出器</b>仍然使用带标签的数据训练。说话人识别使用逻辑回归，时间序列预测使用线性回归。因此，最终任务表现来自整个系统的共同作用。

称类器官为自适应储备池是合理的；如果说类器官独立学会了识别说话人身份，就超出了实验能够支持的范围。

论文主要实验报告了来自三次独立实验的五个类器官。它展示的是有价值的概念验证，还不能说明不同批次的类器官都能稳定获得相同表现。

## 4. 特别之处：储备池本身也会适应

在经典储备池计算中，储备池通常是固定的。输入经过循环动态系统变换，真正接受训练的只有读出器。Brainoware 加入了一个生物学层面的变化：重复刺激会改变类器官的功能连接。因此，它不是一个完全固定的特征提取器。

作者比较了训练前后的功能连接，观察到连接增强、减弱、新连接出现和原有连接消失等变化。这提供了一种合理机制：经历刺激之后，同样的输入可能引起不同的神经活动模式。

研究者使用 K252a 干预活动依赖性突触可塑性。处理后，类器官仍然可以产生神经响应，但训练带来的性能改善受到明显抑制。这个区别很重要：组织可以继续充当储备池，但它的适应能力受到干扰。

## 5. 两项任务应该怎样理解？

<b>说话人识别。</b> 数据集包含 8 位男性说话人的 240 段日语元音（/a/ 和 /e/）录音。每 12 小时输入一次完整数据集，持续两天。读出器使用逻辑回归。来自三次独立实验的五个类器官，平均识别率从训练前的 51.0 ± 7.8% 提升到四个训练 epoch 后的 78.0 ± 5.2%。

这个结果说明，重复输入之后，类器官产生的活动更有利于区分不同说话人。但分类器仍然是外部模型，而且使用带标签样本训练。因此，实验展示的是“可适应的生物储备池 + 监督式读出器”，不能说类器官独立学会了说话人身份的概念。

<b>Hénon 映射预测。</b> Hénon map 是一种确定性的非线性系统，可以产生混沌轨迹。作者先把二维状态转换为一维序列，再将序列编码成时空电脉冲，最后使用线性回归读出器预测下一个数值。每个训练 epoch 包含 200 个数据点，共进行四个 epoch，每天一次。回归得分从 0.356 ± 0.071 提高到 0.812 ± 0.043。

这项任务的价值在于，它要求储备池保留近期输入的信息。若系统只对当前电脉冲作出瞬时响应，无法保留内部状态，就很难表示时间依赖关系。

## 6. 结果证明了什么？

这项研究完成了活体神经储备池的概念验证：类器官具有非线性响应、衰退记忆、空间模式区分能力，并且会因重复刺激而发生适应。阻断可塑性后，性能改善受到抑制，也支持生物网络参与了计算过程，而不只是充当电信号转换器。

实验规模仍然有限：核心任务结果来自三次独立实验中的五个类器官；任务是受控的实验室基准；输入输出仍依赖外部电子设备和传统回归模型。论文也没有让系统通过真实物理环境的变化形成闭环，这一步在后续 Brainobot 工作中才出现。

因此，最准确的结论是：生物组织可以作为动态且可适应的计算基质，其神经活动能够被外部解码器利用。这项研究尚未展示通用型生物计算机。

## My Perspective｜我的思考

Brainoware 提出了一个值得继续追问的问题：<b>计算究竟发生在哪里？性能提升又来自哪个组件？</b>

评价这类系统时，至少应该区分输入编码器、生物储备池和训练后的读出器。一个可行的验证思路是：在初始训练后固定读出器，再测试后续 session 的表现，并在相同输入和评价条件下比较可塑性储备池与固定储备池。

对未来的类器官系统，这个问题会更加重要。如果闭环任务的表现提高，我们需要判断究竟是生物网络发生了变化、解码器进行了适应，还是输入策略变得更有效。Brainoware 为这个问题提供了起点，但它展示的仍然是离线分类与预测，而不是实时环境控制。

## 总结

- Brainoware 将人源皮层类器官用作自适应储备池。
- 非线性响应和衰退记忆是论文重点验证的计算性质。
- 说话人识别率从 51.0% 提高到 78.0%；Hénon 预测得分从 0.356 提高到 0.812。
- 生物可塑性与读出器的监督训练是两个不同的过程。
- 论文证明了活体储备池计算的可行性，还没有实现完整的闭环智能体。

---

## References / 参考资料

- Cai, H. et al. (2023). <i>Brain organoid reservoir computing for artificial intelligence</i>. Nature Electronics, 6, 1032–1039. [DOI](https://doi.org/10.1038/s41928-023-01069-w)
- [Nature Electronics — original article](https://www.nature.com/articles/s41928-023-01069-w)
