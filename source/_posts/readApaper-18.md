---
title: "readApaper#18 Contribution of amygdala to dynamic model arbitration under uncertainty"
title_zh: "readApaper#18 Contribution of amygdala to dynamic model arbitration under uncertainty"
date: 2026-11-04 22:00:00
tags:
  - readApaper
  - neuroscience
  - decision-making
  - reinforcement-learning
cover: /img/readapaper-cover.png
bilingual: true
mathjax: true
---

<i>Reading time: about 7–8 minutes · 4 November 2026 · Nature Communications, 2025</i>

<b>When a reward arrives, should the brain credit the object you just picked, or the movement you just made?</b> Woo, Costa, Taswell, Rothenhoefer, Averbeck and Soltani show that both kinds of learning can run at the same time. The amygdala helps decide which of the two models should control the next choice, while the ventral striatum mainly changes how strong the object-value signal is.

## 1. One reward, two possible explanations

The paper opens with a simple everyday puzzle. You get coffee from a new machine after pressing a flashing button on the left. Next time, should you press the same flashing button, or any button that happens to be on the left? The first strategy is <b>stimulus-based</b>, or <i>what</i> learning: reward is tied to the identity of an object. The second is <b>action-based</b>, or <i>where</i> learning: reward is tied to a left or right movement. In a natural setting, both stories can look equally plausible at first, so the brain may need to keep both models running and then <b>arbitrate</b> — that is, decide which model currently deserves more control over behavior.

Male rhesus macaques chose between two novel visual objects by making a saccade to the left or right. The objects swapped sides from trial to trial. Each block had 80 trials. Reward was probabilistic (80:20, 70:30, or 60:40), and the better and worse options reversed without warning on a random trial between trials 30 and 50. This already creates two kinds of uncertainty: which option is better right now, and when the rule will flip.

A third kind of uncertainty was added by the task structure. In the <b>What-only</b> task, reward always depended on object identity, so the correct model of the environment did not change. In the <b>What/Where</b> task, some blocks rewarded a particular object (What blocks) and others rewarded a particular side (Where blocks). The two block types were randomly interleaved, and the monkey was not told which rule was in force.

The researchers compared control monkeys with animals that had received bilateral lesions of either the <b>amygdala</b> or the <b>ventral striatum (VS)</b>. The amygdala is a subcortical region often linked to emotion, value, and attention to what matters; the ventral striatum is a key node for learning the value of stimuli. The question was whether these two areas play different computational roles when more than one learning model is available.

![Figure 1. Experimental paradigm, block types, and performance. Panel a shows one trial: fixation, a saccade to object A or B, and probabilistic juice. Reversal occurs somewhere between trials 30 and 50 of an 80-trial block. Panel b contrasts a What block (follow the object) with a Where block (follow the side). Panels c and d outline the What-only and mixed What/Where tasks. Panels e–g plot the probability of choosing the better option for control (black), amygdala-lesioned (red), and VS-lesioned (blue) monkeys. Notice how the ranking of the two lesion groups changes across tasks.](/img/readApaper-18/p18_fig1.jpg)

<i>Figure 1. Experimental paradigm, block types, and performance. Panel a shows one trial: fixation, a saccade to object A or B, and probabilistic juice. Reversal occurs somewhere between trials 30 and 50 of an 80-trial block. Panel b contrasts a What block (follow the object) with a Where block (follow the side). Panels c and d outline the What-only and mixed What/Where tasks. Panels e–g plot the probability of choosing the better option for control (black), amygdala-lesioned (red), and VS-lesioned (blue) monkeys. Notice how the ranking of the two lesion groups changes across tasks.</i>

## 2. Two learning systems can be seen in the choices

The authors did not only count correct choices. They also asked, after a reward or a missed reward, whether the monkey stayed with or switched away from the previous choice — and they did this separately for <b>the same object</b> and <b>the same side</b>. Those two kinds of “stay” are not the same once the objects swap places.

They summarized this consistency with a quantity called ERDS (the conditional entropy of a reward-dependent stay/switch strategy). A lower ERDS on the stimulus dimension means that reward feedback tightly organizes object-based staying and switching; a lower ERDS on the action dimension means the same for left/right movements. Even in the What-only task, where side was objectively uninformative, the two measures were negatively correlated: more consistent object-based behavior went with less consistent action-based behavior. The negative relationship was much stronger in the mixed What/Where task. Reaction times also tracked the dominant system: object-based trials were slower than action-based trials.

## 3. Learn two values, then decide which one to trust

To explain these patterns, the team fitted reinforcement-learning models that update <b>stimulus values</b> and <b>action values</b> in parallel, then combine them into an overall value for a left or right choice. A model with a single fixed mixing weight already beat models that used only one system. Models that updated the mixing weight on every trial did better still.

The best model was called <b>Dynamic ω–ρ</b>. It uses two separate knobs:

\[OV_i=\rho\,\omega(t)\,V_{\mathrm{Stim}(i)}+(1-\rho)(1-\omega(t))\,V_{\mathrm{Action}(i)}\]

Here \(V_{\mathrm{Stim}}\) is the learned value of an object, and \(V_{\mathrm{Action}}\) is the learned value of a left or right movement. The time-varying weight \(\omega(t)\) is the <b>arbitration weight</b>: it rises when the stimulus system looks more reliable, and falls when the action system does. The constant \(\rho\), estimated once per monkey, is a <b>baseline balance</b> between the two value signals. It allows one system to be generally stronger without forcing every increase in one weight to be matched by an equal decrease in the other.

Among several candidates for “reliability,” the value of the chosen option (\(V_{\mathrm{cho}}\)) best explained the data, better than the magnitude of reward prediction error. Five-fold cross-validation favored this model in both tasks and in every group of monkeys. The effective weight on the stimulus system, denoted \(\Omega\), also predicted reaction time: more stimulus-based control went with slower responses.

![Figure 2. Parallel learners and dynamic arbitration in control monkeys. Panel a is the model cartoon: one action-value system and one stimulus-value system, mixed by the baseline factor ρ and the changing weight ω. Panel b shows that Dynamic ω–ρ (using chosen value to estimate reliability) has the best cross-validated fit. Panel c follows arbitration through an example Where block; panel d shows average Ω trajectories by task and reward schedule, shifting toward the correct system and dropping at reversal. Panel e links a more stimulus-based Ω to slower reaction times.](/img/readApaper-18/p18_fig2.jpg)

<i>Figure 2. Parallel learners and dynamic arbitration in control monkeys. Panel a is the model cartoon: one action-value system and one stimulus-value system, mixed by the baseline factor ρ and the changing weight ω. Panel b shows that Dynamic ω–ρ (using chosen value to estimate reliability) has the best cross-validated fit. Panel c follows arbitration through an example Where block; panel d shows average Ω trajectories by task and reward schedule, shifting toward the correct system and dropping at reversal. Panel e links a more stimulus-based Ω to slower reaction times.</i>

## 4. Amygdala and ventral striatum do different jobs

This is the heart of the paper. Both lesion groups were still best described by the same Dynamic ω–ρ model, so the lesions did not abolish either learning system. They changed the model in different ways.

After <b>amygdala lesions</b>, the initial arbitration weight \(\omega_0\) was biased more strongly toward the action system. During the mixed What/Where task, these monkeys no longer updated arbitration at clearly different rates toward the correct versus the incorrect system. In What blocks, Ω still drifted upward over time; in Where blocks, it also drifted upward, instead of falling as it did in controls. In short, the amygdala appears important for setting the starting balance and for pushing control toward the model that is actually more reliable.

After <b>VS lesions</b>, the main change was a lower \(\rho\): stimulus-value signals became weaker relative to action-value signals. Arbitration itself remained more intact. In the What/Where task, Ω increased in What blocks and decreased in Where blocks, as in controls, but with an overall tilt toward actions. This matches the VS’s established role in stimulus-based learning.

These parameter differences help explain a result that looks contradictory if one only compares accuracy. In the What-only task, amygdala-lesioned monkeys performed worse than VS-lesioned monkeys. In What blocks of the mixed task, the ranking reversed: VS-lesioned monkeys were worse. If both lesions simply damaged “stimulus learning,” that flip would be hard to understand. Once arbitration and baseline signal strength are separated, it becomes clearer: the two areas are not doing the same computation.

Simulations confirmed the split. Lowering \(\omega_0\), as in the amygdala group, reduced the difference between the two arbitration rates and lowered performance. Lowering \(\rho\), as in the VS group, was enough to bias updates toward actions. Over many sessions of the What-only task, VS-lesioned monkeys (with an intact amygdala) gradually used the stimulus strategy more and the action strategy less; amygdala-lesioned monkeys did not show this slow adjustment.

![Figure 3. Model fits and arbitration dynamics after lesions. Panel a: Dynamic ω–ρ remains the best model for both lesion groups. Panels b and c: average Ω trajectories. In the mixed task, VS-lesioned monkeys (c) still shift Ω up in What blocks and down in Where blocks; amygdala-lesioned monkeys (b) drift upward in both. Panel d defines the effective arbitration rates toward the stimulus system (ψ+) and the action system (ψ−). Panels e–g are the key comparison: after reversal, controls (black) and VS-lesioned monkeys (blue) update faster toward the correct system; the amygdala group (red) shows little difference between the two rates in the mixed task (insets in f and g are not significantly different from zero).](/img/readApaper-18/p18_fig3.jpg)

<i>Figure 3. Model fits and arbitration dynamics after lesions. Panel a: Dynamic ω–ρ remains the best model for both lesion groups. Panels b and c: average Ω trajectories. In the mixed task, VS-lesioned monkeys (c) still shift Ω up in What blocks and down in Where blocks; amygdala-lesioned monkeys (b) drift upward in both. Panel d defines the effective arbitration rates toward the stimulus system (ψ+) and the action system (ψ−). Panels e–g are the key comparison: after reversal, controls (black) and VS-lesioned monkeys (blue) update faster toward the correct system; the amygdala group (red) shows little difference between the two rates in the mixed task (insets in f and g are not significantly different from zero).</i>

## Why this matters

Flexible choice is not only about updating values. It is also about deciding which representation of experience to trust. This study assigns that arbitration role, in part, to the amygdala, and distinguishes it from the ventral striatum’s effect on the strength of stimulus-value signals. The same framework also helps explain why amygdala damage can look harmful in one task and less so — or even helpful around a reversal — in another: the starting arbitration state changes how learning and choice unfold over time.

## Takeaway

- Stimulus-based and action-based learning can run in parallel, even when only one of them is useful.
- Dynamic arbitration, plus a stable baseline balance between the two signals, best describes the monkeys’ trial-by-trial choices.
- Amygdala lesions disrupt the initial balance and the ability to update toward the correct model; VS lesions mainly weaken stimulus-value signals.

---

## References and resources

- Woo, J. H., Costa, V. D., Taswell, C. A., Rothenhoefer, K. M., Averbeck, B. B., & Soltani, A. (2025). <i>Contribution of amygdala to dynamic model arbitration under uncertainty.</i> Nature Communications, 16, 11704. [Open-access article and figures](https://doi.org/10.1038/s41467-025-66745-1)
- Data and code: [github.com/DartmouthCCNL/woo\_etal\_amygdala](https://github.com/DartmouthCCNL/woo_etal_amygdala)
- Figures 1–3 are from the published article (Creative Commons CC BY 4.0).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7–8 分钟 · 2026-11-04 · Nature Communications, 2025</i>

<b>得到奖励以后，大脑该把功劳记在“我刚选中的物体”上，还是记在“我刚做的动作”上？</b> Woo、Costa、Taswell、Rothenhoefer、Averbeck 与 Soltani 发现，这两套学习可以同时进行。杏仁核帮助决定当前更该相信哪一套模型，腹侧纹状体则主要改变“物体值多少”这一信号的强度。

## 1. 一次奖励，两种解释

论文用一个日常例子开头。你在一台新咖啡机上按了左侧一个闪着的按钮，然后喝到了咖啡。下一次，你该继续按那个闪着的按钮，还是按任何出现在左侧的按钮？前一种策略是<b>基于刺激（stimulus-based）</b>的学习，也叫 <i>what</i> 学习：奖励跟物体身份有关。后一种是<b>基于动作（action-based）</b>的学习，也叫 <i>where</i> 学习：奖励跟向左还是向右有关。在真实环境里，一开始两种说法都可能说得通，所以大脑也许需要让两套模型同时运行，再做<b>仲裁（arbitration）</b>——也就是决定当前该把行为控制权更多地交给哪一套模型。

雄性恒河猴通过向左或向右的眼跳，在两个从未见过的视觉图形之间做选择，图形位置会不断对调。每个 block 有 80 个试次。奖励是概率性的（80:20、70:30 或 60:40），更好与更差的选项会在第 30 到 50 个试次之间的某个随机时刻无提示地反转。这已经带来两种不确定性：此刻哪个选项更好，以及规则何时会翻转。

任务结构还引入了第三种不确定性。在 <b>What-only</b> 任务中，奖励始终取决于图形身份，环境的正确模型不会改变。在 <b>What/Where</b> 任务中，有的 block 奖励特定图形（What），有的 block 奖励特定位置（Where）。两类 block 随机交错，猴子事先不知道当前该跟图形走还是跟位置走。

研究者比较了正常猕猴，以及双侧<b>杏仁核（amygdala）</b>或<b>腹侧纹状体（ventral striatum, VS）</b>损伤的猕猴。杏仁核常与情绪、价值和“把注意力转向要紧的事情”有关；腹侧纹状体则是学习刺激价值的重要节点。问题是：当不止一套学习模型可用时，这两个脑区是不是在做不同的计算？

![Figure 1. 实验范式、block 类型与行为表现。a 图是单次试次：注视、朝图形 A 或 B 做眼跳、再按概率得到果汁；反转发生在 80 个试次中的第 30–50 次之间。b 图对比 What block（跟着图形走）和 Where block（跟着位置走）。c、d 图分别是 What-only 与混合 What/Where 任务。e–g 图画出控制组（黑）、杏仁核损伤组（红）和腹侧纹状体损伤组（蓝）选择更好选项的概率。注意两组损伤动物的相对表现会随任务类型而互换。](/img/readApaper-18/p18_fig1.jpg)

<i>Figure 1. 实验范式、block 类型与行为表现。a 图是单次试次：注视、朝图形 A 或 B 做眼跳、再按概率得到果汁；反转发生在 80 个试次中的第 30–50 次之间。b 图对比 What block（跟着图形走）和 Where block（跟着位置走）。c、d 图分别是 What-only 与混合 What/Where 任务。e–g 图画出控制组（黑）、杏仁核损伤组（红）和腹侧纹状体损伤组（蓝）选择更好选项的概率。注意两组损伤动物的相对表现会随任务类型而互换。</i>

## 2. 从选择里就能看出两套学习系统

作者不只统计“做对了多少次”，还看奖励或没有奖励之后，猴子是保持还是切换上次的选择——并且把“继续选同一个图形”和“继续选同一侧”分开。图形换边之后，这两种“保持”就不再是一回事。

他们用 ERDS（奖励依赖的 stay/switch 策略的条件熵）来概括这种一致性。刺激维度上的 ERDS 越低，说明奖励反馈更有规律地组织了基于图形的保持和切换；动作维度上的 ERDS 越低，则说明左右动作也是如此。即使在侧边其实并不提供信息的 What-only 任务中，这两个指标也呈负相关：图形策略越一致，动作策略往往就越不一致。在混合的 What/Where 任务里，这种负相关更强。反应时也跟着占优的系统变化：以图形为主的试次，比以动作为主的试次更慢。

## 3. 先学两套价值，再决定该相信哪一套

为了解释这些现象，研究团队拟合了并行更新<b>刺激价值</b>和<b>动作价值</b>的强化学习模型，再把它们组合成向左或向右的总体价值。只用一套系统的模型拟合较差；用固定比例混合两套系统就更好；若再让混合比例随试次更新，拟合还会再提高。

效果最好的模型叫做 <b>Dynamic ω–ρ</b>。它有两个需要分开理解的旋钮：

- <b>ω(t)</b> 是随时间变化的<b>仲裁权重</b>：当刺激系统显得更可靠时升高，当动作系统更可靠时降低。
- <b>ρ</b> 是每只猴子估计出的一个相对稳定的<b>基线平衡</b>，表示两套价值信号谁更“底气足”。有了它，一套系统可以整体更强，而不必让一个权重的升高总被另一个权重同等下降所抵消。

在多种“可靠性”指标里，已选选项的价值（\(V_{\mathrm{cho}}\)）最能解释数据，效果优于奖励预测误差的绝对值。五折交叉验证表明，这一模型在两类任务和各组猴子中都表现最好。刺激系统的有效权重 \(\Omega\) 还能预测反应时：越偏向刺激系统，反应越慢。

![Figure 2. 控制组猴子中的并行学习与动态仲裁。a 图是模型示意图：动作价值与刺激价值两套系统，由基线因子 ρ 和动态权重 ω 混合。b 图显示，用已选价值估计可靠性的 Dynamic ω–ρ 交叉验证拟合最好。c 图跟踪一个 Where block 中的仲裁过程；d 图按任务和奖励日程给出平均 Ω 轨迹，会朝正确系统移动，并在反转处下降。e 图表明，更偏向刺激系统的 Ω 对应更慢的反应时。](/img/readApaper-18/p18_fig2.jpg)

<i>Figure 2. 控制组猴子中的并行学习与动态仲裁。a 图是模型示意图：动作价值与刺激价值两套系统，由基线因子 ρ 和动态权重 ω 混合。b 图显示，用已选价值估计可靠性的 Dynamic ω–ρ 交叉验证拟合最好。c 图跟踪一个 Where block 中的仲裁过程；d 图按任务和奖励日程给出平均 Ω 轨迹，会朝正确系统移动，并在反转处下降。e 图表明，更偏向刺激系统的 Ω 对应更慢的反应时。</i>

## 4. 杏仁核和腹侧纹状体做的不是同一件事

这是全文最关键的比较。两组损伤动物仍然最适合用同一个 Dynamic ω–ρ 模型来描述，说明损伤并没有让某一套学习系统完全消失，而是以不同方式改变了模型。

<b>杏仁核损伤</b>后，初始仲裁权重 \(\omega_0\) 更明显地偏向动作系统。在混合的 What/Where 任务中，这些猴子不再以明显不同的速度，把仲裁推向正确或错误的系统。在 What block 里，Ω 仍会随时间上升；在 Where block 里，它也在上升，而不是像控制组那样下降。也就是说，杏仁核对于设定起始平衡、并把控制权推向当前更可靠的模型，是重要的。

<b>腹侧纹状体损伤</b>后，最主要的变化是 ρ 下降：刺激价值信号相对于动作价值信号变弱。仲裁过程本身保留得更好。在 What/Where 任务中，Ω 仍像控制组那样在 What block 上升、在 Where block 下降，只是整体更偏向动作。这与腹侧纹状体在刺激学习中的已知作用一致。

把参数拆开之后，一组看起来互相矛盾的成绩也能说通。在 What-only 任务中，杏仁核损伤组比腹侧纹状体损伤组更差；但在混合任务的 What block 里，名次反过来，腹侧纹状体损伤组更差。如果两种损伤都只是破坏了“刺激学习”，这种对调就很难理解。一旦把“仲裁”和“信号基线强度”分开，就会更清楚：两个脑区并不是在做同一项计算。

模拟也支持这种区分。把 \(\omega_0\) 降低（模拟杏仁核损伤）会缩小两种仲裁速率的差别，并降低成绩；把 ρ 降低（模拟腹侧纹状体损伤）就足以让更新偏向动作。在 What-only 任务的多个会话中，腹侧纹状体损伤、但杏仁核完好的猴子会逐渐更多地使用刺激策略、更少使用动作策略；杏仁核损伤的猴子没有表现出这种缓慢调整。

![Figure 3. 损伤后的模型拟合与仲裁动态。a 图：Dynamic ω–ρ 对两组损伤动物仍然是最佳模型。b、c 图是平均 Ω 轨迹：在混合任务里，腹侧纹状体损伤组（c）仍会在 What block 上升、在 Where block 下降；杏仁核损伤组（b）在两类 block 中都往上走。d 图定义了朝向刺激系统（ψ+）和动作系统（ψ−）的有效仲裁速率。e–g 图是最关键的比较：反转之后，控制组（黑）和腹侧纹状体损伤组（蓝）会更快地更新向正确系统；杏仁核组（红）在混合任务中两种速率几乎没有差别（f、g 图插图与零的差异不显著）。](/img/readApaper-18/p18_fig3.jpg)

<i>Figure 3. 损伤后的模型拟合与仲裁动态。a 图：Dynamic ω–ρ 对两组损伤动物仍然是最佳模型。b、c 图是平均 Ω 轨迹：在混合任务里，腹侧纹状体损伤组（c）仍会在 What block 上升、在 Where block 下降；杏仁核损伤组（b）在两类 block 中都往上走。d 图定义了朝向刺激系统（ψ+）和动作系统（ψ−）的有效仲裁速率。e–g 图是最关键的比较：反转之后，控制组（黑）和腹侧纹状体损伤组（蓝）会更快地更新向正确系统；杏仁核组（红）在混合任务中两种速率几乎没有差别（f、g 图插图与零的差异不显著）。</i>

## 这项研究说明了什么？

灵活的选择不只是更新价值，还要决定当前该相信哪一种经验表征。这项研究把仲裁的一部分作用归于杏仁核，并把它与腹侧纹状体对刺激价值信号强度的影响区分开来。同一套框架也有助于理解：为什么杏仁核损伤在一种任务里显得很有害，在另一种任务里却不那么严重，甚至在反转时可能带来好处——因为起始的仲裁状态会改变随后的学习和选择轨迹。

## 总结

- 基于刺激和基于动作的学习可以并行运行，即使其中一套在客观上并没有用。
- 动态仲裁，再加上两套信号之间相对稳定的基线平衡，最能描述猴子的试次级选择。
- 杏仁核损伤会破坏初始平衡，并削弱朝正确模型更新的能力；腹侧纹状体损伤则主要减弱刺激价值信号。

---

## References and resources

- Woo, J. H., Costa, V. D., Taswell, C. A., Rothenhoefer, K. M., Averbeck, B. B., & Soltani, A. (2025). <i>Contribution of amygdala to dynamic model arbitration under uncertainty.</i> Nature Communications, 16, 11704. [开放获取论文与原图](https://doi.org/10.1038/s41467-025-66745-1)
- 数据与代码：[github.com/DartmouthCCNL/woo\_etal\_amygdala](https://github.com/DartmouthCCNL/woo_etal_amygdala)
- Figure 1–3 来自发表论文（Creative Commons CC BY 4.0）。
