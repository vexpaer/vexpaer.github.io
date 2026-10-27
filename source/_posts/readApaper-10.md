---
title: "readApaper#10 In vitro neurons learn and exhibit sentience when embodied in a simulated game-world"
title_zh: "readApaper#10 In vitro neurons learn and exhibit sentience when embodied in a simulated game-world"
date: 2026-10-27 22:00:00
tags:
  - readApaper
  - neuroscience
  - biological-computing
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: approximately 6–7 minutes · 27 October 2026 · Neuron (2022)</i>

<b>Can neurons growing on a chip learn to play Pong? And how can a dish of cells possibly know where the ball is?</b>

Kagan and colleagues built <b>DishBrain</b>, a system that connects living cortical neurons to a simple virtual game through electrical stimulation and recording. The most interesting part is not the game itself. It is the mechanism: <b>when a neural network's actions change the sensory input it receives next, its activity can adapt within minutes.</b>

## 1. Giving cultured neurons a body inside a game

The researchers used two sources of cortical neurons: <b>human induced pluripotent stem cells (hiPSCs)</b> differentiated into neurons, and <b>cortical neurons from embryonic mice</b>. The cells were grown on a high-density <b>microelectrode array (HD-MEA)</b>, which could both stimulate the culture and record its electrical activity.

Imagine a Pong game: a ball moves across the screen, and a paddle moves vertically to intercept it. The cells have no eyes and no hands. So the computer translates the game into a language the neurons can receive: <b>electrical pulses in, neural spikes out</b>.

The entire loop is:

<b>Ball position → electrical stimulation → living neural network → recorded spikes → paddle movement → hit or miss → new stimulation.</b>

![Original Figure 1 — DishBrain culture preparation and feedback arrangements](/img/readApaper-10/figure-1.jpg)

<i>Figure 1 (excerpt). The experimental protocol connects human- or mouse-derived cortical neurons on an HD-MEA to Pong. The lower panels distinguish stimulation, silent feedback, no feedback and rest.</i>

That final arrow—<b>the consequence of an action flowing back to the cells</b>—is what turns a recording setup into a closed-loop environment.

## 2. How does a dish of neurons “see” and move?

DishBrain used an intentionally simple encoder–decoder interface. There were no visual images shown to the cells; the ball's position became a pattern of electrical pulses delivered through <b>eight sensory electrodes</b>.

<b>Encoding the ball (sensory input).</b> Two coding schemes were combined:

- <b>Place coding:</b> which electrode was stimulated represented the ball's <b>vertical position (y)</b>.
- <b>Rate coding:</b> stimulation frequency represented the ball's <b>horizontal position (x)</b>. The frequency increased from roughly <b>4 Hz to 40 Hz</b> as the ball approached the paddle's side of the screen.

So a ball at a particular height, moving closer to the paddle, produced stimulation in a particular location at an increasing pulse rate.

<b>Decoding the paddle (motor output).</b> Other electrodes were assigned to two motor regions. Activity in <b>motor region 1</b> moved the paddle <b>up</b>; activity in <b>motor region 2</b> moved it <b>down</b>. The system compared activity in the two regions and compensated for differences in their baseline firing so one consistently more active region would not dominate the paddle. The decoder itself was kept simple: <b>the network had to change its own spike patterns to improve control</b>.

The loop was therefore direct and fast. When the neural network changed its activity, the paddle moved, changing what the network would receive next.

[Original Figure 4 — software loop, electrode layout and stimulation patterns](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/#fig4)

<i>In Figure 4D, look for the sensory electrodes and the motor regions; Figure 4C shows how stimulation changes during gameplay.</i>

## 3. The clever trick: make success predictable and mistakes surprising

If the cells control a paddle, what encourages them to hit the ball?

The authors drew on <b>active inference</b> and the <b>free energy principle</b>. The basic idea is that a system can organize its actions to make its incoming signals more predictable.

DishBrain expressed this idea through its feedback:

- <b>Successful hit:</b> the system delivered a <b>predictable, structured electrical pattern</b> and the ball continued moving.
- <b>Miss:</b> it delivered <b>unpredictable, randomized stimulation</b>, and the ball reset.

Think of trying to operate a machine by touch. One action produces a familiar, repeatable response; another produces an unexpected burst of changing signals. Over repeated attempts, the system may reorganize toward actions associated with a more predictable sequence of inputs.

In DishBrain, <b>the stimulation was not an explicit label saying “good” or “bad.” Its timing and predictability provided the learning signal.</b> The living network experienced the consequence of its own activity through the next incoming pulses.

## 4. What did the neurons actually learn?

The main experiment analyzed <b>399 game sessions</b> across five groups: mouse cortical neurons (<b>MCC</b>), human cortical neurons (<b>HCC</b>), media-only controls (<b>CTL</b>), in-silico/random-output controls (<b>IS</b>), and resting cultures without sensory game information (<b>RST</b>).

Performance was measured by dividing a 20-minute session into <b>T1 (0–5 min)</b> and <b>T2 (6–20 min)</b>. The researchers tracked three intuitive metrics:

- <b>Average rally length:</b> how many consecutive returns the paddle made.
- <b>Aces:</b> how often the ball passed the paddle without any return.
- <b>Long rallies:</b> sequences of more than three consecutive hits.

![Original Figure 5 — Pong performance across experimental and control groups](/img/readApaper-10/figure-5.jpg)

<i>Figure 5. Start with panel B: average rally length rises from T1 to T2 in both mouse (MCC) and human (HCC) cultures. Panels C–D show fewer aces and more long rallies.</i>

The result was striking: <b>both human and mouse cultures improved their average rally length</b>, while the control conditions did not show the same time-dependent improvement. The main comparisons reported <b>p = 5.27 × 10⁻⁸</b> for MCC and <b>p = 3.92 × 10⁻¹⁹</b> for HCC. The two biological groups also had fewer aces and more long rallies as play continued.

Notice what the experiment measures: the researchers did not train a conventional software classifier to predict paddle movement. Instead, the <b>biological neural network adjusted its activity while connected to the game</b>.

## 5. Why does closed-loop feedback matter?

The most important follow-up comparison changed what happened after a hit or miss:

<b>Stimulus:</b> predictable stimulation after a hit; randomized stimulation after a miss.

<b>Silent:</b> the game still changed after an action, but the explicit feedback pulse could be replaced by silence.

<b>No-feedback:</b> the cells received sensory stimulation, but the stream was not appropriately linked to the consequences of their paddle actions.

The results in <b>Figure 6</b> show that the <b>Stimulus</b> condition produced the strongest improvement in rally length. The <b>Silent</b> condition performed better than No-feedback, while <b>No-feedback</b> did not produce the same learning trend. In other words, <b>simply sending electrical pulses was less important than allowing neural activity to change what happened next</b>.

[Original Figure 6 — comparing Stimulus, Silent and No-feedback](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/#fig6)

<i>Figure 6A visualizes the three stimulation schedules; Figure 6C compares their changes in rally length.</i>

The authors also looked directly at neural dynamics. In <b>Figure 7</b>, electrophysiological activity reorganized during gameplay; information entropy was generally lower during gameplay than rest, while <b>unpredictable feedback increased measured neural-response entropy</b>. This links changing game performance with changing patterns of neuronal activity.

## Takeaway

DishBrain's essential contribution is a <b>working read–write interface between a living neural network and a virtual environment</b>. Eight electrodes encoded the ball; motor-region spikes controlled the paddle; the consequences of each action came back as electrical signals.

<b>A neural culture was able to improve its behavior because it was part of a closed loop.</b> This experiment offers a useful starting point for biological computing and for designing stimulation protocols that shape neural network activity through interaction.

---

## References / 参考资料

- Kagan, B. J., Kitchen, A. C., Tran, N. T., et al. (2022). <i>In vitro neurons learn and exhibit sentience when embodied in a simulated game-world</i>. <b>Neuron, 110</b>(23), 3952–3969.e8. [DOI: 10.1016/j.neuron.2022.09.001](https://doi.org/10.1016/j.neuron.2022.09.001).
- [Open-access full paper on PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/) · [Publisher article](<https://www.cell.com/neuron/fulltext/S0896-6273(22)00806-6>) · [Open data and analysis code](https://osf.io/5u6qv/).
- Figure 1 excerpt and Figure 5 reproduce original illustrations from Kagan et al. (2022), originally published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See the complete original paper for Figures 4, 6 and 7.

<!-- BLOG_ZH -->


<i>预计阅读时间：约 6–7 分钟 · 2026 年 10 月 27 日</i>

<b>培养皿里的神经元，为什么能够学会玩 Pong？它们没有眼睛和手，又是怎样知道球在哪里、控制挡板移动的？</b>

Kagan 等人在 2022 年的 <i>Neuron</i> 论文中构建了 <b>DishBrain</b>：把培养的神经元放到高密度微电极阵列上，通过电刺激和记录，让它们实时参与一个虚拟乒乓球游戏。最值得理解的并不是“神经元会打游戏”这个现象，而是其背后的机制：<b>当神经网络的输出能改变接下来收到的输入时，网络活动就可能在几分钟内发生适应性变化。</b>

## 1. 给培养皿里的神经元一个虚拟身体

研究者使用两类细胞：一类是由<b>人诱导多能干细胞（hiPSC）分化得到的皮层神经元，另一类是小鼠胚胎皮层神经元</b>。它们被培养在 **HD-MEA（高密度微电极阵列）**上。电极既能向细胞施加电脉冲，也能记录细胞放出的 spike。

Pong 游戏的规则很简单：小球在屏幕中来回弹跳，挡板只能上下移动，目标是持续接住球。

神经元看不到屏幕。因此，电脑要把游戏信息翻译成它们能接收的<b>电刺激模式</b>，再把神经元的放电翻译成挡板动作。

整个系统形成一条链：

<b>小球位置 → 电刺激 → 活体神经网络 → spike 记录 → 挡板移动 → 命中或失误 → 下一轮电刺激。</b>

![Original Figure 1 — DishBrain culture preparation and feedback arrangements](/img/readApaper-10/figure-1.jpg)

<i>Figure 1（节选）｜上半部分介绍人源和鼠源神经细胞的培养，下半部分对比不同的游戏反馈模式。</i>

这篇文章的关键在于最后一步：<b>动作产生的后果，会作为新的输入回到神经网络。</b> 这样，培养皿里的细胞才真正接入了一个闭环环境。

## 2. 具体怎么控制：8 个电极负责“看球”，两块区域负责“移动”

DishBrain 没有设计复杂的视觉识别网络，而是使用两种简单的神经编码方式，将小球的坐标变成电脉冲。

<b>第一步：把小球位置编码成电刺激。</b>

- <b>Place coding（位置编码）</b>：刺激哪个电极，对应小球的<b>纵向位置 y</b>。
- <b>Rate coding（频率编码）</b>：刺激频率对应小球的<b>横向位置 x</b>。球从对面逐渐靠近挡板时，频率从约 <b>4 Hz 增加至 40 Hz</b>。

例如，小球位于屏幕上方并逐渐靠近挡板时，某个代表“上方”的电极会以越来越快的频率向神经元发送脉冲。整个感觉区使用 <b>8 个预先指定的电极</b>。

<b>第二步：把神经元放电解码为挡板动作。</b>

研究者预先划分了两个运动区域（motor regions）：

- <b>Motor region 1</b>：放电活动用于控制挡板向上。
- <b>Motor region 2</b>：放电活动用于控制挡板向下。

系统比较两块区域的活动，并对各区域本身的放电强度差异进行增益校正，以免某块区域天然更活跃就一直把挡板推向同一侧。

这里有个特别关键的设计：<b>软件中的动作映射基本是固定的，实际需要改变的是神经元自己产生 spike 的模式。</b> 论文主要观察的学习过程发生在活体神经网络中。

[原论文 Figure 4｜实时闭环、感觉/运动电极和刺激模式](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/#fig4)

<i>Figure 4｜重点看 D：哪些电极提供感觉输入、哪些区域控制挡板；再看 C：命中或失误后刺激模式怎样变化。</i>

## 3. 最巧妙的地方：命中是可预测的，失误是随机的

神经元收到电刺激，也能移动挡板了。但它们凭什么学会“把球接住”？

作者采用了 **Active Inference（主动推断）**和 **Free Energy Principle（自由能原理）**的思想：系统可能通过调整自己的活动，让未来输入变得更可预测。

具体做法很直观：

<b>接住小球时</b>，系统提供<b>规律、可预测的刺激</b>，游戏继续。

<b>漏掉小球时</b>，系统提供<b>随机、不可预测的刺激</b>，小球重置。

想象你闭着眼睛操作一台机器。一种操作会带来熟悉且稳定的反馈，另一种操作会带来突如其来的杂乱信号。随着反复尝试，你可能逐渐形成一种操作方式，让反馈更稳定。

在 DishBrain 中，<b>刺激的可预测性就是反馈信号的核心</b>。电极并没有直接告诉神经元什么叫“正确答案”，而是让神经元的动作影响之后收到的信号，再观察网络是否逐渐适应。

## 4. 神经元真的学会了吗？看三项实验指标

论文的主要分析包含 <b>399 场游戏测试</b>，涉及五组：

- <b>MCC</b>：小鼠皮层神经元。
- <b>HCC</b>：人源皮层神经元。
- <b>CTL</b>：只有培养基、没有神经元的对照。
- <b>IS</b>：由随机输出控制挡板的计算机模拟对照。
- <b>RST</b>：有活体神经元，但不接收游戏感觉信息的休息条件。

每场游戏约 <b>20 分钟</b>，被分为 **T1（0–5 分钟）**和 <b>T2（6–20 分钟）</b>。研究者主要看三件事：

<b>Rally length（连续回合长度）</b>：挡板能连续把球接回多少次。

<b>Aces（直接失误）</b>：球在没有任何一次成功接球的情况下越过挡板的频率。

<b>Long rallies（长回合）</b>：连续接球超过 3 次的回合。

![Original Figure 5 — Pong performance across experimental and control groups](/img/readApaper-10/figure-5.jpg)

<i>Figure 5｜先看 B：MCC 和 HCC 在 T2 的平均连续接球次数明显增加；C、D 分别说明直接失误减少、长回合增加。</i>

结果是：<b>人源和鼠源神经元都表现出显著的连续接球能力提升，而对照组没有出现同样的随时间改善趋势。</b>

论文报告的主要组内比较为：

- <b>MCC：p = 5.27 × 10⁻⁸</b>
- <b>HCC：p = 3.92 × 10⁻¹⁹</b>

而且不只是 rally length 变长：两类神经元的 <b>aces 减少、long rallies 增加</b>，几个指标指向同一个方向。

这很有意思，因为研究者没有给挡板动作训练一个新的神经网络解码器。<b>发生变化的主要是与游戏实时交互的生物神经元活动。</b>

## 5. 最重要的对照：为什么闭环比持续刺激更重要？

作者又进一步研究：真正驱动学习的是什么？他们比较了三种反馈安排。

<b>Stimulus（完整刺激反馈）</b>：命中时收到规律刺激，失误时收到随机刺激。

<b>Silent（静默反馈）</b>：游戏中的行为仍然会引起环境变化，但显式反馈脉冲可由静默替代。

<b>No-feedback（无反馈）</b>：虽然还有感觉刺激，但输入不再与挡板动作产生的结果正确关联。

<b>Figure 6 是这篇论文最值得仔细看的结果之一。</b> Stimulus 条件下的连续回合长度改善最明显；Silent 的表现优于 No-feedback，而 No-feedback 没有出现同样的学习趋势。

[原论文 Figure 6｜Stimulus、Silent、No-feedback 的对照结果](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/#fig6)

<i>Figure 6｜A 展示三种刺激时序，C 展示三种条件的连续回合长度相对于 Rest 的变化。</i>

这说明一个重要机制：<b>仅仅持续向神经元发送电刺激，并不足以产生这样的学习效应；神经元的动作必须能影响它未来收到的信号。</b>

研究者还分析了 <b>Figure 7</b> 中的神经电活动。与 Rest 相比，Gameplay 中的神经响应信息熵整体更低；随机反馈出现后，神经响应的信息熵又会升高。这些电生理变化把游戏成绩和真实网络动力学联系起来，也为论文使用主动推断解释学习提供了依据。

## 总结

DishBrain 最有价值的成果，是实现了一套<b>活体神经网络与虚拟环境之间的实时双向接口</b>：

<b>电刺激负责输入、神经放电负责输出、游戏结果形成反馈，神经网络在持续交互中调整自身活动。</b>

理解这个闭环，就理解了这篇论文的核心。它提供了一种研究神经网络学习机制的新方法，也展示了将活体神经元作为可交互计算组件的可能性。

---

## References / 参考资料

- Kagan, B. J., Kitchen, A. C., Tran, N. T., et al. (2022). <i>In vitro neurons learn and exhibit sentience when embodied in a simulated game-world</i>. <b>Neuron, 110</b>(23), 3952–3969.e8. [DOI: 10.1016/j.neuron.2022.09.001](https://doi.org/10.1016/j.neuron.2022.09.001).
- [Open-access full paper on PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182/) · [Publisher article](<https://www.cell.com/neuron/fulltext/S0896-6273(22)00806-6>) · [Open data and analysis code](https://osf.io/5u6qv/).
- Figure 1 excerpt and Figure 5 reproduce original illustrations from Kagan et al. (2022), originally published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See the complete original paper for Figures 4, 6 and 7.
