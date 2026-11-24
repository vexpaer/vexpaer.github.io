---
title: "readApaper#38 CHANI: Correlation-based Hawkes Aggregation of Neurons with bio-Inspiration"
title_zh: "readApaper#38 CHANI: Correlation-based Hawkes Aggregation of Neurons with bio-Inspiration"
date: 2026-11-24 22:00:00
tags:
  - readApaper
  - spiking-neural-networks
  - point-process
  - machine-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 9 minutes · 24 November 2026 · Journal of Machine Learning Research, February 2026</i>

This paper introduces CHANI, a spiking network whose neurons are discrete-time Hawkes processes and whose synapses are updated by a local expert-aggregation rule. The authors prove that, in a specified regime, the network learns to classify objects from feature correlations and forms neuronal assemblies, and they test it on a synthetic shape-and-color task and on handwritten digits.

### Background

Cognitive models such as Component-Cue formalize a simple idea: categories are learned by finding combinations of features that describe them. A spike is a brief, all-or-none pulse. A spiking neural network (SNN) represents activity as sequences of such pulses and is usually trained with local learning rules, in which a synapse is updated from signals available at that connection, without a global backward pass. Hebbian plasticity and STDP have been used to simulate neuronal assemblies: groups of cells that fire together to represent a concept, with one neuron allowed to belong to more than one group. A Hawkes process, in which past events raise or shape the probability of later events, is a standard model for such networks, but most mathematical analyses hold synaptic weights fixed, which rules out learning. The same group previously introduced HAN, a Hawkes network without hidden layers, trained by a local expert-aggregation rule. This paper adds hidden layers that detect synchrony among features.

### Problem

Local rules such as STDP have produced assembly-like behavior in simulations, but there has been little proof that those updates cause a network to learn a classification task, or that they produce assemblies in a precise sense. The Spiking Neuron Convergence Conjecture (SNCC) asks whether an SNN can learn any transformation that is in principle achievable, by analogy with the perceptron convergence theorem. CHANI addresses a concrete version of that question: classes may be defined by single features or by correlations among several features, and the network must assign each object to a class using only local transformations. Hidden neurons should become sensitive to those correlations, and a single hidden neuron may take part in more than one class.

### Method

CHANI is trained layer by layer (Figure 1). Each object is presented for a duration T; hidden layers see M objects, then the output layer is trained on N objects. Objects of the same nature drive the input neurons with the same spike probabilities. The input layer has one neuron per feature, emitting independent Bernoulli spikes at a rate that depends on whether, and how strongly, the feature is present. In the digit experiments, a feature is a pixel and the rate is proportional to darkness.

Each hidden neuron j<sub>S</sub> is tied to a feature subset S. Layer l is built from pairs of previous-layer neurons that encode disjoint subsets, so a neuron in layer l is responsible for a set of size 2<sup>l</sup>. Its spikes follow a nonlinear discrete-time Hawkes process: the probability of a spike at time t is the positive part of (−ν + w · x<sub>t−1</sub>), where x<sub>t−1</sub> is the previous layer’s activity, w is a probability distribution over presynaptic neurons, and ν is a threshold (1/2 in the main theorems). After training, weights are frozen. A selection step presents each nature once and keeps only neurons whose empirical firing rate exceeds a threshold s<sub>l</sub> for at least one nature. The output layer has one neuron per class, with spike probability w · x<sub>t−1</sub> during training. An object is assigned to the class whose output neuron spiked the most.

![From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 1. Panel A: objects are presented one after another, each for a duration T; curved arrows mark the same nature appearing more than once. Panel B, steps 1–4: input neurons spike according to the features of the presented object; a first-hidden neuron searches for a pair of features, and neurons that do not detect enough correlation are later pruned (red crosses). Panel C, steps 5–6: later hidden layers combine already selected neurons, then prune again. Panel D, step 7: once the hidden layers are trained, each output neuron k is connected to the last-hidden neurons most specific to class k.](/img/readApaper-38/chani_fig1.png)

<i>From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 1. Panel A: objects are presented one after another, each for a duration T; curved arrows mark the same nature appearing more than once. Panel B, steps 1–4: input neurons spike according to the features of the presented object; a first-hidden neuron searches for a pair of features, and neurons that do not detect enough correlation are later pruned (red crosses). Panel C, steps 5–6: later hidden layers combine already selected neurons, then prune again. Panel D, step 7: once the hidden layers are trained, each output neuron k is connected to the last-hidden neurons most specific to class k.</i>

Weights are updated by expert aggregation. Each postsynaptic neuron is a forecaster; its presynaptic neurons are the experts. After each object, every expert receives a gain and an algorithm updates the weights. EWA sets the next weight proportional to exp(η G<sub>e</sub>), so every expert keeps a positive weight. PWA puts zero weight on experts that lag the forecaster. A hidden neuron detecting two parents gives each candidate a gain equal to their empirical three-way correlation with that candidate. An output neuron k gives a gain proportional to the presynaptic firing rate, positive when the object belongs to class k and negative otherwise. There is no backward pass, and class labels enter only at the output layer.

Performance is measured by discrepancies (Figure 2): feature discrepancy (how class-specific a last-hidden neuron’s feature set is), class discrepancy (how much an output neuron out-fires the others on its own class), and their average, the network discrepancy. In an idealized limit network, a hidden neuron spikes in proportion to the correlation of its feature set, and an output neuron for class k is active precisely when the object belongs to k.

![From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 2. Three discrepancies used to measure CHANI. Feature discrepancy (left, blue): for a last-hidden neuron j_S, the average correlation of feature set S on objects in class k, minus the same average on objects not in k. Class discrepancy (top right): for output neuron k, its average activity on objects in class k minus the average activity of the other output neurons on those same objects. Network discrepancy (right) is the average of the class discrepancies over all classes.](/img/readApaper-38/chani_fig2.png)

<i>From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 2. Three discrepancies used to measure CHANI. Feature discrepancy (left, blue): for a last-hidden neuron j<sub>S</sub>, the average correlation of feature set S on objects in class k, minus the same average on objects not in k. Class discrepancy (top right): for output neuron k, its average activity on objects in class k minus the average activity of the other output neurons on those same objects. Network discrepancy (right) is the average of the class discrepancies over all classes.</i>

### Experiments

The first study is a simulated data set of colored shapes, built so that the assumptions of the theorems hold. There are nine natures (three shapes × three colors) and six input features. The two input neurons for an object’s shape and color spike independently with probability p = 0.5; the others stay silent. In the first task, class k1 is all circles and class k2 is squares and triangles, so the classes are unions of single features and are achievable with no hidden layer. In the second, each class is a union of specific shape–color pairs, so a hidden layer that detects pairs is required. CHANI is trained with EWA or PWA, and with zero or one hidden layer, using T = 2000, M = 40, and N = 360, repeated 100 times. After each output-training epoch, accuracy is measured on a test set of 99 objects, with a confidence interval of level 0.9.

The second study uses the scikit-learn digits data set: 1,797 images of 64 pixels, split 80%/20%, with each pixel neuron’s rate proportional to darkness. Not all theoretical assumptions hold here. The authors train networks with zero, one, or two hidden layers, using EWA or PWA, and in one variant add direct input-to-output connections, reporting test accuracy and comparing it with published STDP networks on the same data.

### Results

On the simulated first task, every configuration—EWA or PWA, with zero or one hidden layer—reaches 100% test accuracy (Figure 3, left). Networks with no hidden layer, and PWA with one hidden layer, learn faster and with less variance than EWA with one hidden layer. On the second task (Figure 3, right), EWA or PWA with no hidden layer does not exceed 67% accuracy, consistent with the theory that this class structure is not achievable without a hidden layer. With one hidden layer, both EWA and PWA reach 100%.

![From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 3. Test accuracy versus output-training epoch on the simulated colored-shape data, with a confidence interval of level 0.9, over 100 runs. Left, first task (classes defined by single features): all four configurations reach 100%. Right, second task (classes defined by shape–color pairs): networks with no hidden layer plateau at or below 67%, while networks with one hidden layer reach 100%. Shaded bands are the confidence intervals. On the right, PWA with one hidden layer (green) rises faster than EWA with one hidden layer (blue).](/img/readApaper-38/chani_fig3.png)

<i>From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 3. Test accuracy versus output-training epoch on the simulated colored-shape data, with a confidence interval of level 0.9, over 100 runs. Left, first task (classes defined by single features): all four configurations reach 100%. Right, second task (classes defined by shape–color pairs): networks with no hidden layer plateau at or below 67%, while networks with one hidden layer reach 100%. Shaded bands are the confidence intervals. On the right, PWA with one hidden layer (green) rises faster than EWA with one hidden layer (blue).</i>

On handwritten digits with no hidden layer, EWA reaches 53.0 accuracy, with a level-0.9 confidence interval of [50.8, 55.6], over 100 realizations (T = 2000, N = 1,437). PWA reaches only 14.8, with interval [14.7, 15.0]. With one hidden layer, 2,016 neurons are present before selection, the number of unordered pixel pairs. Figure 4 shows test accuracy against the number of selected neurons (T = 2000, M = 40, N = 1,357; 20 realizations each). PWA remains unstable and does not exceed 40% correct. EWA improves as more neurons are kept, exceeds 80% from 80 selected neurons, and levels off around 83.5%. Adding direct input-to-output connections raises the curve further: 76.6% with 10 selected neurons, above 84% from 70, and 87% with 200.

With two hidden layers and EWA, 100 selected neurons are kept in the first hidden layer and the second is varied. Over 10 realizations (T = 2000, M = 40, N = 1,277), accuracy is 44.6, 49.7, and 51.0 for 50, 100, and 150 selected neurons in the second layer, comparable to no hidden layer and well below one-hidden-layer EWA. On the same digits data, STDP networks reported by Rybka et al. (2024) and Sboev et al. (2022) reach 83% to 95% accuracy, depending on the setting; in some settings the numbers are comparable to CHANI with EWA and extra connections.

![From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 4. Test accuracy on the scikit-learn digits data set with one hidden layer, plotted against the number of selected hidden neurons. Blue: CHANI with EWA, which rises and levels off around 83.5%. Orange: CHANI with PWA, which stays below 40% and remains unstable. Green: CHANI with EWA and extra input-to-output connections, which lies above the blue curve and reaches 87% at 200 selected neurons.](/img/readApaper-38/chani_fig4.png)

<i>From Jaffard, Vaiter and Reynaud-Bouret, 2026, Figure 4. Test accuracy on the scikit-learn digits data set with one hidden layer, plotted against the number of selected hidden neurons. Blue: CHANI with EWA, which rises and levels off around 83.5%. Orange: CHANI with PWA, which stays below 40% and remains unstable. Green: CHANI with EWA and extra input-to-output connections, which lies above the blue curve and reaches 87% at 200 selected neurons.</i>

### Analysis

The theorems and the two experiments answer different questions. Theorem 3 is proved in a regime called CHANI EWA, which includes EWA on the output layer and binary correlations: each relevant feature set is either fully present or absent, at a common positive rate. In an asymptotic regime where N, T, and M grow in a specified way, the selected hidden layers and the weights converge almost surely to an explicit limit network. That limit is ideal if and only if each class can be written as a union of feature correlations of size 2<sup>L</sup> (Theorem 18). When this condition holds, an output neuron for class k is active precisely on objects of that class and is silent otherwise. The authors present this equivalence as a version of the SNCC for CHANI in this framework: if a strong feasible weight family exists, the trained output weights converge to one.

Corollary 12 gives an average-learning bound on network discrepancy, minus an error that shrinks when M, T, and N are large; this concerns average firing-rate separations, not 100% accuracy on every data set. Hidden weights for a neuron that combines two parent sets converge to equal weights on those two parents, so the neuron encodes their correlation and can be recruited by more than one class (Theorem 9 and Corollary 10). After training, an output neuron connects to the last-hidden neurons that maximize feature discrepancy for its class (Theorem 14 and Corollary 15). The VC-dimension of the functions the limit network can implement equals the number of selected neurons in the last hidden layer (Proposition 19).

The colored-shape simulations check the setting the theorems describe and are not biological recordings. The digit experiments are simulations of CHANI on a standard image data set for which not all assumptions hold: EWA substantially outperforms PWA, one hidden layer helps, and a second hidden layer does not. The authors suggest that digits may be well described by single pixels and pairs rather than triples, that spike probabilities decrease across layers, and that the data need not satisfy the proof assumptions. The 87% figure is a test accuracy on 8×8 digits, not a theorem; it lies within the range of some published STDP results on the same data, below the upper end of that range.

### Summary

CHANI learns classification with a local expert-aggregation rule and hidden layers that search for feature synchrony. In the CHANI EWA regime, the authors prove convergence to an ideal classifier when classes are unions of correlations of size 2<sup>L</sup>, and that hidden neurons form assemblies that can be shared across classes. Simulated accuracies on a matching synthetic task follow the theorems. On handwritten digits, where not all assumptions hold, CHANI with EWA and one hidden layer, especially with extra input–output connections, reaches test accuracies in the mid-to-high 80% range.

### References

1. Jaffard, S., Vaiter, S. & Reynaud-Bouret, P. CHANI: Correlation-based Hawkes Aggregation of Neurons with bio-Inspiration. <i>Journal of Machine Learning Research</i> 27(32), 1–62 (2026). [https://www.jmlr.org/papers/v27/24-0783.html](https://www.jmlr.org/papers/v27/24-0783.html)
2. Jaffard, S., Vaiter, S., Muzy, A. & Reynaud-Bouret, P. Provable local learning rule by expert aggregation for a Hawkes network. In <i>Proceedings of the 27th International Conference on Artificial Intelligence and Statistics</i> (PMLR, 2024).
3. Cesa-Bianchi, N. & Lugosi, G. <i>Prediction, Learning, and Games</i>. Cambridge University Press (2006).
4. Legenstein, R., Naeger, C. & Maass, W. What can a neuron learn with spike-timing-dependent plasticity? <i>Neural Computation</i> 17, 2337–2382 (2005).
5. Gluck, M. A. & Bower, G. H. From conditioning to category learning: an adaptive network model. <i>Journal of Experimental Psychology</i> 117, 227–247 (1988).
6. Singer, W. et al. Neuronal assemblies: necessity, signature and detectability. <i>Trends in Cognitive Sciences</i> 1, 252–261 (1997).
7. Rybka, R. et al. Comparison of bagging and sparsity methods for connectivity reduction in spiking neural networks with memristive plasticity. <i>Big Data and Cognitive Computing</i> 8, 22 (2024).
8. Sboev, A., Davydov, Y., Rybka, R., Vlasov, D. & Serenko, A. A comparison of two variants of memristive plasticity for solving the classification problem of handwritten digits recognition. In <i>Biologically Inspired Cognitive Architectures 2021</i>, 438–446 (2022).
9. Figures are taken from Jaffard, Vaiter and Reynaud-Bouret, <i>Journal of Machine Learning Research</i> (2026), licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 9 分钟 · 2026-11-24 · Journal of Machine Learning Research, February 2026</i>

本文介绍 CHANI：一种脉冲网络，其神经元由离散时间 Hawkes 过程描述，突触则由局部的专家聚合规则更新。作者证明，在一个明确给出的机制下，该网络能从特征相关中学习物体分类，并形成神经元集群；他们还在合成的形状–颜色任务和手写数字上检验了这一算法。

### 背景

像 Component-Cue 这样的认知模型把一件简单的事说清楚：类别是通过寻找能够描述它们的特征组合来学习的。脉冲是一次短暂的、全或无的发放。脉冲神经网络（SNN）用这样的脉冲序列来表示活动，通常用局部学习规则来训练：一条突触只根据该连接处能够得到的信号来更新，而不在整个网络上做一次全局的反向传播。Hebbian 可塑性和 STDP 已被用来模拟神经元集群：一群细胞共同发放以表示某个概念，而且同一个神经元可以属于多个集群。Hawkes 过程是这类网络的常用模型，其中过去的事件会提高或塑造后来事件发生的概率；但大多数数学分析都把突触权重固定下来，以便系统进入平稳状态，这也就排除了学习。同一研究组此前提出过没有隐层的 Hawkes 网络 HAN，用局部专家聚合规则训练，并分析了简单分类任务。本文加上了用于检测特征同步的隐层。

### 问题

STDP 这类局部规则在模拟中已经产生过类似集群的行为，但几乎还没有证明：这些更新会使网络学会一项分类任务，或者在精确的意义上产生集群。脉冲神经元收敛猜想（SNCC）问的是：SNN 是否能够学会原则上可以实现的任意变换，这与感知机收敛定理是同一思路；对使用 STDP 的网络，这一猜想尚未被解决。CHANI 处理的是该问题的一个具体版本：类别可以由单个特征定义，也可以由若干特征之间的相关定义，网络必须只用局部变换把每个物体分到一个类别中。隐层神经元应当变得对这些相关敏感，而且同一个隐层神经元可以参与不止一个类别。

### 方法

CHANI 是逐层训练的（图 1）。每个物体被呈现一段时间 T；隐层看到 M 个物体，然后输出层在 N 个物体上训练。具有相同“本性”的物体，会以相同的脉冲概率驱动输入神经元。输入层对每个特征有一个神经元，它发出相互独立的伯努利脉冲，发放率取决于该特征是否出现，以及在需要时出现的程度：在数字实验中，一个特征就是一个像素，发放率与暗度成正比。

每个隐层神经元 j<sub>S</sub> 对应一个特征子集 S。第 l 层由上一层中编码不相交子集的神经元成对组成，因此第 l 层的一个神经元负责大小为 2<sup>l</sup> 的集合。它的脉冲服从非线性离散时间 Hawkes 过程：在给定过去的条件下，时刻 t 发放的概率是 (−ν + w · x<sub>t−1</sub>) 的正部，其中 x<sub>t−1</sub> 是上一层在上一时刻的活动，权重 w 是这些突触前神经元上的一个概率分布，ν 是阈值（主要定理中取 1/2）。一层训练结束后，权重被冻结。随后的选择步骤把每一种本性呈现一次，只保留经验发放率在至少一种本性上超过阈值 s<sub>l</sub> 的神经元。输出层对每个类别有一个神经元，训练时的发放概率是与最后隐层的线性乘积 w · x<sub>t−1</sub>。物体被分到在呈现期间发放次数最多的那个输出神经元所对应的类别。

![取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 1。图 A：物体依次呈现，每个呈现时长为 T；弧线标出同一“本性”可以出现多次。图 B，步骤 1–4：输入神经元按当前物体的特征发放；第一隐层神经元寻找一对特征的共现，相关不够的神经元随后被剪除（红叉）。图 C，步骤 5–6：更深层的隐层组合已被选中的神经元，然后再做一次剪除。图 D，步骤 7：隐层训练结束后，每个输出神经元 k 连接到对类别 k 最特异的最后隐层神经元。](/img/readApaper-38/chani_fig1.png)

<i>取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 1。图 A：物体依次呈现，每个呈现时长为 T；弧线标出同一“本性”可以出现多次。图 B，步骤 1–4：输入神经元按当前物体的特征发放；第一隐层神经元寻找一对特征的共现，相关不够的神经元随后被剪除（红叉）。图 C，步骤 5–6：更深层的隐层组合已被选中的神经元，然后再做一次剪除。图 D，步骤 7：隐层训练结束后，每个输出神经元 k 连接到对类别 k 最特异的最后隐层神经元。</i>

权重由专家聚合来更新。每个突触后神经元是一个预测者，它的突触前神经元是专家。每呈现完一个物体，每个专家得到一个收益，再由算法更新权重。指数加权平均（EWA）让下一个权重与 exp(η G<sub>e</sub>) 成正比，其中 G<sub>e</sub> 是该专家的累积收益，因此每个专家都保持严格为正的权重。多项式加权平均（PWA）则把落后于预测者的专家权重置为零。若一个隐层神经元要检测两个“父”神经元的共现，候选突触前神经元的收益就是它与这两个父神经元的经验三元相关。对输出神经元 k，收益与突触前发放率成正比：当物体属于类别 k 时为正，否则为负。没有反向传播，类别标签只进入输出层。

性能用发放率和相关上的偏差来衡量（图 2）：特征偏差刻画最后隐层神经元的特征集对某一类有多特异，类别偏差刻画输出神经元在本类物体上比其他输出神经元多发放多少，网络偏差则是各类别偏差的平均。在理想化的极限网络中，隐层神经元的发放与其特征集的相关成正比，类别 k 的输出神经元恰好在物体属于 k 时活动。

![取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 2。用来衡量 CHANI 的三种偏差。特征偏差（左，蓝框）：对最后隐层神经元 j_S，特征集 S 在类别 k 的物体上的平均相关，减去它在非 k 物体上的同一平均。类别偏差（右上）：输出神经元 k 在类别 k 的物体上的平均活动，减去其他输出神经元在这些物体上的平均活动。网络偏差（右）是所有类别的类别偏差的平均。](/img/readApaper-38/chani_fig2.png)

<i>取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 2。用来衡量 CHANI 的三种偏差。特征偏差（左，蓝框）：对最后隐层神经元 j<sub>S</sub>，特征集 S 在类别 k 的物体上的平均相关，减去它在非 k 物体上的同一平均。类别偏差（右上）：输出神经元 k 在类别 k 的物体上的平均活动，减去其他输出神经元在这些物体上的平均活动。网络偏差（右）是所有类别的类别偏差的平均。</i>

### 实验

第一项数值研究是彩色形状的模拟数据集，其构造使定理所需的假设成立。共有九种本性（三种形状 × 三种颜色）和六个输入特征。呈现一个物体时，对应其形状和颜色的两个输入神经元以概率 p = 0.5 独立发放，其余保持沉默。第一项任务中，类别 k1 是所有圆形，类别 k2 是方形和三角形，因此类别是单个特征的并，原则上无需隐层即可实现。第二项任务中，每个类别是若干特定形状–颜色对的并，因此需要一层能够检测特征对的隐层。作者用 EWA 或 PWA、以及零层或一层隐层来训练 CHANI，参数为 T = 2000、M = 40、N = 360，每种配置重复 100 次。每完成一轮输出层训练（epoch），就在由 99 个物体组成的测试集上测量准确率，并给出水平为 0.9 的置信区间。

第二项研究使用 scikit-learn 的手写数字数据集：1,797 张 64 像素的图像，按 80%/20% 划分为训练集和测试集，每个像素神经元的发放率与暗度成正比。这里并非所有理论假设都成立。作者训练了零层、一层或两层隐层的网络，分别使用 EWA 或 PWA，并在一种单隐层变体中加入从输入层到输出层的直接连接，报告测试准确率，并与在同一数字数据上发表的 STDP 网络作比较。

### 结果

在模拟的第一项任务上，每一种配置——EWA 或 PWA，零层或一层隐层——都达到 100% 的测试准确率（图 3，左）。没有隐层的网络，以及带一层隐层的 PWA，比带一层隐层的 EWA 学得更快、方差也更小。在第二项任务上（图 3，右），没有隐层的 EWA 或 PWA 准确率不超过 67%，这与“这种类别结构在没有隐层时不可实现”的理论一致。加上一层隐层后，EWA 和 PWA 都达到 100%。

![取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 3。在模拟的彩色形状数据上，测试准确率随输出层训练轮次（epoch）变化，置信区间水平为 0.9，共 100 次重复。左图为第一项任务（类别由单个特征定义）：四种配置都达到 100%。右图为第二项任务（类别由形状–颜色对定义）：没有隐层的网络停在 67% 或以下，有一层隐层的网络达到 100%。阴影带是置信区间。右图中，带一层隐层的 PWA（绿）比带一层隐层的 EWA（蓝）上升更快。](/img/readApaper-38/chani_fig3.png)

<i>取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 3。在模拟的彩色形状数据上，测试准确率随输出层训练轮次（epoch）变化，置信区间水平为 0.9，共 100 次重复。左图为第一项任务（类别由单个特征定义）：四种配置都达到 100%。右图为第二项任务（类别由形状–颜色对定义）：没有隐层的网络停在 67% 或以下，有一层隐层的网络达到 100%。阴影带是置信区间。右图中，带一层隐层的 PWA（绿）比带一层隐层的 EWA（蓝）上升更快。</i>

在手写数字、没有隐层时，EWA 的准确率为 53.0，水平 0.9 的置信区间为 [50.8, 55.6]，共 100 次实现（T = 2000，N = 1,437）。PWA 只有 14.8，区间为 [14.7, 15.0]。使用一层隐层时，选择前有 2,016 个神经元，恰好是无序像素对的数目。图 4 给出测试准确率随被选中神经元数目的变化（T = 2000，M = 40，N = 1,357；每种选择规模 20 次实现）。PWA 不稳定，正确率不超过 40%。EWA 随着保留神经元增多而提高，从 80 个被选中神经元起超过 80%，并在约 83.5% 处趋于平稳。再加上从输入到输出的直接连接后，曲线进一步上升：10 个被选中神经元时已达 76.6%，从 70 个起超过 84%，200 个时达到 87%。

使用两层隐层和 EWA 时，第一隐层固定保留 100 个被选中神经元，并改变第二层。在 10 次实现中（T = 2000，M = 40，N = 1,277），第二层分别保留 50、100 和 150 个神经元时，准确率为 44.6、49.7 和 51.0，与没有隐层的网络相当，并明显低于一层隐层的 EWA。在同一数字数据上，Rybka 等人（2024）和 Sboev 等人（2022）报告的 STDP 网络准确率随设置不同介于 83% 到 95%；在其中一些设置下，这些数字与带额外连接的 CHANI EWA 相当。

![取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 4。在 scikit-learn 手写数字数据集上、使用一层隐层时，测试准确率随被选中隐层神经元数目变化。蓝线：CHANI 使用 EWA，上升后在约 83.5% 处趋于平稳。橙线：CHANI 使用 PWA，不超过 40%，并且不稳定。绿线：CHANI 使用 EWA 并加上输入到输出的额外连接，位于蓝线上方，在 200 个被选中神经元时达到 87%。](/img/readApaper-38/chani_fig4.png)

<i>取自 Jaffard、Vaiter 与 Reynaud-Bouret, 2026, Figure 4。在 scikit-learn 手写数字数据集上、使用一层隐层时，测试准确率随被选中隐层神经元数目变化。蓝线：CHANI 使用 EWA，上升后在约 83.5% 处趋于平稳。橙线：CHANI 使用 PWA，不超过 40%，并且不稳定。绿线：CHANI 使用 EWA 并加上输入到输出的额外连接，位于蓝线上方，在 200 个被选中神经元时达到 87%。</i>

### 分析

定理和两项实验回答的是不同的问题。定理 3 是在称为 CHANI EWA 的机制下证明的，其中包括输出层也使用 EWA，以及二元相关：每个相关的特征集要么完全出现，要么完全不出现，并以一个共同的正速率发放。在 N、T 和 M 按指定方式增长的渐近机制下，被选出的隐层和权重几乎必然收敛到一个明确给出的极限网络。当且仅当每个类别都可以写成大小为 2<sup>L</sup> 的特征相关的并时，这一极限是理想的（定理 18）。该条件成立时，类别 k 的输出神经元恰好在物体属于 k 时活动，否则保持沉默。作者把这一等价看作 CHANI 在该框架下的一种 SNCC：只要存在强可行的权重族，训练得到的输出权重就会收敛到其中之一。

推论 12 给出网络偏差的平均学习界，再减去一项在 M、T 和 N 较大时变小的误差；这说的是平均发放率分离，而不是在每一个数据集上都达到 100% 准确率。组合两个父集合的隐层神经元，其权重收敛为在这两个父神经元上均等，因此该神经元编码它们的相关，并可以被不止一个类别征用（定理 9 与推论 10）。训练结束后，输出神经元连接到对本类特征偏差最大的那些最后隐层神经元（定理 14 与推论 15）。极限网络所能实现的函数，其 VC 维等于最后隐层中被选中的神经元数目（命题 19）。

彩色形状模拟检验的是定理所描述的设定，并不是生物学记录。数字实验是在一个并非所有假设都成立的标准图像数据集上对 CHANI 的模拟：EWA 明显优于 PWA，一层隐层有帮助，第二层隐层则没有。作者提出，数字也许更适合用单个像素和像素对、而不是三元组来描述，发放概率会逐层下降，而且数据不必满足证明中用到的假设。87% 这一数字是该模型在 8×8 数字上的测试准确率，不是一条定理；它落在同一数据上部分已发表 STDP 结果的范围内，并低于该范围的上端。

### 总结

CHANI 用局部的专家聚合规则，以及寻找特征同步的隐层，来学习分类。在 CHANI EWA 机制下，作者证明：当类别是大小为 2<sup>L</sup> 的相关的并时，网络收敛到理想分类器，而且隐层神经元会形成可被多个类别共享的集群。在为匹配这些假设而构造的合成任务上，模拟准确率与定理一致。在并非所有假设都成立的手写数字上，使用 EWA 和一层隐层的 CHANI，尤其是再加上输入到输出的额外连接时，测试准确率达到 80% 出头到高 80% 的范围。

### 参考文献

1. Jaffard, S., Vaiter, S. & Reynaud-Bouret, P. CHANI: Correlation-based Hawkes Aggregation of Neurons with bio-Inspiration. <i>Journal of Machine Learning Research</i> 27(32), 1–62 (2026). [https://www.jmlr.org/papers/v27/24-0783.html](https://www.jmlr.org/papers/v27/24-0783.html)
2. Jaffard, S., Vaiter, S., Muzy, A. & Reynaud-Bouret, P. Provable local learning rule by expert aggregation for a Hawkes network. In <i>Proceedings of the 27th International Conference on Artificial Intelligence and Statistics</i> (PMLR, 2024).
3. Cesa-Bianchi, N. & Lugosi, G. <i>Prediction, Learning, and Games</i>. Cambridge University Press (2006).
4. Legenstein, R., Naeger, C. & Maass, W. What can a neuron learn with spike-timing-dependent plasticity? <i>Neural Computation</i> 17, 2337–2382 (2005).
5. Gluck, M. A. & Bower, G. H. From conditioning to category learning: an adaptive network model. <i>Journal of Experimental Psychology</i> 117, 227–247 (1988).
6. Singer, W. et al. Neuronal assemblies: necessity, signature and detectability. <i>Trends in Cognitive Sciences</i> 1, 252–261 (1997).
7. Rybka, R. et al. Comparison of bagging and sparsity methods for connectivity reduction in spiking neural networks with memristive plasticity. <i>Big Data and Cognitive Computing</i> 8, 22 (2024).
8. Sboev, A., Davydov, Y., Rybka, R., Vlasov, D. & Serenko, A. A comparison of two variants of memristive plasticity for solving the classification problem of handwritten digits recognition. In <i>Biologically Inspired Cognitive Architectures 2021</i>, 438–446 (2022).
9. 图取自 Jaffard、Vaiter 与 Reynaud-Bouret, <i>Journal of Machine Learning Research</i> (2026)，许可为 [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)。
