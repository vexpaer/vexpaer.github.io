---
title: "readApaper#45 Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks"
title_zh: "readApaper#45 Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks"
date: 2026-12-01 22:00:00
tags:
  - readApaper
  - machine-learning
  - meta-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 1 December 2026 · ICML, 2017</i>

This paper introduces MAML, a way to train a neural network’s initial parameters so that a small number of gradient steps, with only a few examples from a new task, produce good performance—and the same idea applies to classification, regression, and reinforcement learning.

## Background

People can learn a new object or a new skill from a handful of examples. A deep network usually cannot: it needs many labeled samples, and if it is simply fine-tuned on a tiny new set it often overfits. <b>Few-shot learning</b> asks a model to adapt to a new task from only K examples per class, or a few trials. <b>Meta-learning</b>, or learning to learn, trains the model on a distribution of tasks so that this fast adaptation becomes the thing being optimized. During meta-training, each “training example” is itself a task: the model sees a small support set, adapts, and is judged on held-out examples from that same task. At meta-test time, the tasks are new.

Many successful few-shot methods are built for classification in particular. They may learn a comparison metric, as in Siamese or matching networks, or they may read a whole dataset with a recurrent or memory-augmented model. Those designs work well on character and image benchmarks, but they are not always easy to carry over to a new loss, a new architecture, or a problem such as policy learning, where the feedback is a reward rather than a class label.

If the adaptation step is just ordinary gradient descent, then any model already trained by gradients could, in principle, be prepared for fast fine-tuning. The question is what that preparation should optimize. Some internal features transfer more readily than others. One explicit goal is to find an initialization from which a small step along the new task’s gradient produces a large improvement, without inventing a new architecture or a learned update rule.

## Problem

The problem, then, is to make fast adaptation general. The method should work with fully connected, convolutional, or recurrent networks, and with both supervised losses and reinforcement-learning objectives. It should not add a large set of extra parameters, and it should leave the user free to take one gradient step or many, and to use whatever amount of new data is available.

Formally, tasks are drawn from a distribution p(T). In the K-shot setting, the model must adapt to a new task T<sub>i</sub> from only K samples and the corresponding loss. During meta-training, a task is sampled, the model is updated on those K points, and the meta-objective is the loss on a fresh set of points from the same task, evaluated after that update. The test error on sampled tasks is the training signal of the meta-learner. Held-out tasks are reserved for meta-testing.

## Method

The algorithm is called <b>model-agnostic meta-learning</b> (MAML). It leaves the model f<sub>θ</sub> unchanged in form and instead learns an initialization θ such that one or more gradient steps on a new task move the parameters to a good place.

![Figure 1. Diagram of MAML (Finn, Abbeel & Levine, 2017, Fig. 1). The initialization θ is trained so that a small gradient step on a new task loss moves the parameters toward a good solution θ*.](/img/readApaper-45/readapaper45-fig1.png)

<i>Figure 1. Diagram of MAML (Finn, Abbeel & Levine, 2017, Fig. 1). The initialization θ is trained so that a small gradient step on a new task loss moves the parameters toward a good solution θ\*.</i>

For a single inner step with step size α, the adapted parameters on task T<sub>i</sub> are

θ′<sub>i</sub> = θ − α ∇<sub>θ</sub> L<sub>T<sub>i</sub></sub>(f<sub>θ</sub>).

The meta-objective is the sum, over tasks drawn from p(T), of the loss of the adapted model f<sub>θ′</sub>, evaluated on a new set of examples from the same task. A meta-step then updates the original θ with step size β, using the gradient of that post-adaptation loss. Automatic differentiation can back-propagate through the inner gradient, which requires second derivatives, or Hessian-vector products. The authors also study a <b>first-order approximation</b> that drops those second derivatives but still evaluates the meta-gradient at the post-update parameters θ′.

![Algorithm 1 (Finn, Abbeel & Levine, 2017). For each sampled task, the inner loop computes adapted parameters θ′ with step size α. The meta-update then changes the original θ using the post-adaptation losses, with step size β.](/img/readApaper-45/readapaper45-algo1.png)

<i>Algorithm 1 (Finn, Abbeel & Levine, 2017). For each sampled task, the inner loop computes adapted parameters θ′ with step size α. The meta-update then changes the original θ using the post-adaptation losses, with step size β.</i>

The same structure covers several problem types. For regression the loss is mean-squared error; for classification it is cross-entropy. For reinforcement learning, the inner gradient is a policy-gradient estimate, because the expected reward is not differentiable through the environment, and the meta-optimizer can be a trust-region method. In all cases the learned object is only the initialization: after meta-training, adaptation is ordinary fine-tuning with any number of steps and any amount of data.

## Experiments

The first demonstration is few-shot regression of sine waves. Each task is a sinusoid whose amplitude is drawn from [0.1, 5.0] and whose phase is drawn from [0, π]. Inputs are sampled from [−5.0, 5.0], and the loss is mean-squared error. The regressor is a network with two hidden layers of 40 units and ReLU activations. MAML is trained with one inner gradient step on K = 10 points, α = 0.01, and Adam as the meta-optimizer. At evaluation, a single meta-learned model is fine-tuned on K = 5, 10, or 20 points and compared with a model pretrained on all tasks and then fine-tuned, as well as with an oracle that receives the true amplitude and phase.

Few-shot classification uses Omniglot and MiniImagenet, in the N-way, K-shot protocol of Vinyals et al. (2016): N held-out classes are chosen, K examples of each are provided, and new instances of those classes must be labeled. Omniglot has 1,623 characters from 50 alphabets, with 20 drawings each; 1,200 characters are used for training, the rest for testing, with 90-degree rotation augmentation. MiniImagenet uses 64 / 12 / 24 classes for train / validation / test. The convolutional model follows the four-module, 3 × 3 setup of Vinyals et al., with 64 filters (32 on MiniImagenet), batch normalization and ReLU; Omniglot images are 28 × 28. A non-convolutional network with hidden sizes 256, 128, 64, 64 is also reported, for comparison with memory-augmented models.

Reinforcement-learning tasks are built from rllab continuous-control environments. The policy has two hidden layers of 100 units. Inner updates use vanilla policy gradient (REINFORCE); the meta-optimizer is TRPO, with Hessian-vector products estimated by finite differences. In 2D navigation, a point mass must reach a goal sampled in the unit square; observations are position, actions are velocity clipped to [−0.1, 0.1], the reward is negative squared distance, and episodes end at a distance of 0.01 or a horizon of 100. MAML is trained to maximize performance after one update on 20 trajectories, and is evaluated with up to four updates of 40 samples each. Locomotion tasks ask a planar cheetah or a 3D ant to run at a randomly chosen velocity (uniform on [0, 2] for the cheetah, [0, 3] for the ant) or in a randomly chosen forward or backward direction, with horizon 200 and 20 rollouts per step (40 for the ant direction task).

## Results

On the sine task, the MAML initialization adapts to a new curve from as few as five points and can estimate parts of the wave where no points were given, which indicates that it has learned the periodic structure. A model pretrained on the same task distribution, then fine-tuned, does not extrapolate reliably from so few points and can overfit. Even though MAML was trained for performance after one step, the adapted model continues to improve over further gradient steps without collapsing to the tiny support set.

![Figure 2. Few-shot sine-wave regression (Finn, Abbeel & Levine, 2017, Fig. 2). Left: a MAML initialization adapts from K = 5 or 10 points and can estimate parts of the curve where no points were given. Right: a model pretrained on the same task distribution, then fine-tuned, overfits and fails to extrapolate.](/img/readApaper-45/readapaper45-fig2.png)

<i>Figure 2. Few-shot sine-wave regression (Finn, Abbeel & Levine, 2017, Fig. 2). Left: a MAML initialization adapts from K = 5 or 10 points and can estimate parts of the curve where no points were given. Right: a model pretrained on the same task distribution, then fine-tuned, overfits and fails to extrapolate.</i>

On held-out Omniglot characters, the convolutional MAML model reaches 98.7 ± 0.4% on 5-way 1-shot and 99.9 ± 0.1% on 5-shot, and 95.8 ± 0.3% and 98.9 ± 0.2% on 20-way 1-shot and 5-shot (95% confidence intervals over tasks). A non-convolutional MAML model already attains 89.7 ± 1.1% and 97.5 ± 0.6% on 5-way 1-shot and 5-shot, above the memory-augmented network of Santoro et al. (2016). On MiniImagenet 5-way classification, MAML reaches 48.70 ± 1.84% (1-shot) and 63.11 ± 0.92% (5-shot), above matching networks and the meta-learner LSTM. A first-order approximation is nearly the same, at 48.07 ± 1.75% and 63.15 ± 0.91%, and the authors report roughly a 33% speed-up in network computation by skipping the second-derivative backward pass. The paper notes that Omniglot train/test splits in prior work were not always available, so those numbers may not be strictly comparable.

![Table 1. Few-shot classification on held-out Omniglot characters and the MiniImagenet test set (Finn, Abbeel & Levine, 2017, Table 1). Values are accuracies with 95% confidence intervals over tasks. Convolutional MAML reaches 98.7 ± 0.4% (5-way 1-shot) and 99.9 ± 0.1% (5-shot) on Omniglot, and 48.70 ± 1.84% / 63.11 ± 0.92% on MiniImagenet 5-way 1-shot / 5-shot. A first-order approximation is nearly the same. The paper notes that Omniglot splits may not be strictly comparable to prior work.](/img/readApaper-45/readapaper45-table1.png)

<i>Table 1. Few-shot classification on held-out Omniglot characters and the MiniImagenet test set (Finn, Abbeel & Levine, 2017, Table 1). Values are accuracies with 95% confidence intervals over tasks. Convolutional MAML reaches 98.7 ± 0.4% (5-way 1-shot) and 99.9 ± 0.1% (5-shot) on Omniglot, and 48.70 ± 1.84% / 63.11 ± 0.92% on MiniImagenet 5-way 1-shot / 5-shot. A first-order approximation is nearly the same. The paper notes that Omniglot splits may not be strictly comparable to prior work.</i>

In 2D navigation and in the cheetah and ant locomotion tasks, a MAML initialization adapts to a new goal position, velocity, or direction substantially faster than conventional pretraining or random initialization, with good performance in two or three gradient steps. On these harder control problems, pretraining is sometimes worse than starting from scratch. Each RL gradient step, unlike the supervised cases, requires new samples from the environment.

![Figure 5. Continuous-control adaptation on half-cheetah and ant velocity and direction tasks (Finn, Abbeel & Levine, 2017, Fig. 5). MAML reaches good returns in two or three gradient steps, faster than conventional pretraining or random initialization. Each gradient step requires new environment samples. Random baselines on the goal-velocity tasks are omitted because their returns are much worse (below −200 for the cheetah and below −25 for the ant).](/img/readApaper-45/readapaper45-fig5.png)

<i>Figure 5. Continuous-control adaptation on half-cheetah and ant velocity and direction tasks (Finn, Abbeel & Levine, 2017, Fig. 5). MAML reaches good returns in two or three gradient steps, faster than conventional pretraining or random initialization. Each gradient step requires new environment samples. Random baselines on the goal-velocity tasks are omitted because their returns are much worse (below −200 for the cheetah and below −25 for the ant).</i>

## Analysis

MAML’s useful claim is not only the classification accuracies, which are comparable to or slightly above specialized few-shot methods, but that the same training idea transfers to regression and to policy gradient RL without a new architecture. The learned object is an initialization, so the number of parameters is just that of the underlying model, and adaptation can continue for more than the single step used in meta-training.

The first-order results on MiniImagenet suggest that much of the benefit comes from evaluating the meta-objective at the post-update parameters, rather than from the second-order terms that arise when differentiating through the inner step. That is consistent with the observation that ReLU networks are often locally close to linear. For RL, the same sensitivity viewpoint explains why a carefully prepared initialization can move a high-dimensional policy with very little new experience, and why pretraining on a mixture of tasks is not automatically a good starting point.

## Summary

MAML meta-trains a model’s initial weights so that a few gradient steps on a new task, with only a small amount of new data, produce good generalization. The same procedure covers sine-wave few-shot regression, Omniglot and MiniImagenet classification—where it matches or exceeds strong specialized baselines—and accelerated adaptation of continuous-control policies, without adding parameters beyond the model being trained.

## References

Finn, C., Abbeel, P., & Levine, S. (2017). Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks. In <i>Proceedings of the 34th International Conference on Machine Learning</i> (PMLR 70:1126–1135). [https://proceedings.mlr.press/v70/finn17a.html](https://proceedings.mlr.press/v70/finn17a.html)

Vinyals, O., Blundell, C., Lillicrap, T., Kavukcuoglu, K., & Wierstra, D. (2016). Matching networks for one shot learning. In <i>Advances in Neural Information Processing Systems</i>.

Ravi, S., & Larochelle, H. (2017). Optimization as a model for few-shot learning. In <i>International Conference on Learning Representations</i>.

Santoro, A., Bartunov, S., Botvinick, M., Wierstra, D., & Lillicrap, T. (2016). Meta-learning with memory-augmented neural networks. In <i>International Conference on Machine Learning</i>.

Lake, B. M., Salakhutdinov, R., & Tenenbaum, J. B. (2011). Omniglot. As cited in Finn et al. (2017).

Figures and Table 1 are from Finn, Abbeel & Levine (2017), PMLR 70:1126–1135.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-12-01 · ICML, 2017</i>

这篇论文提出了 MAML：它训练的是神经网络的初始参数，使得在新任务上只需少量样本、再走少数几步梯度，就能得到好的效果；同一套想法可以用于分类、回归和强化学习。

## 背景

人往往看几个例子就能学会新物体或新技能。深度网络通常做不到：它需要大量标注，如果只在很小的新集合上微调，又很容易过拟合。<b>少样本学习</b>要求模型只靠每类 K 个例子、或少数几次尝试，就适应到新任务。<b>元学习</b>（学会学习）则在一个任务分布上训练模型，把这种快速适应本身变成被优化的目标。元训练时，每一个“训练样本”就是一个任务：模型看到一小份支持集，完成适应，再在同一任务的留出样本上接受评价。元测试时，面对的是新任务。

许多成功的少样本方法是专门为分类设计的。它们可能学习一种比较度量，例如孪生网络或匹配网络，也可能用循环或记忆增强模型去读入整个数据集。这些设计在字符和图像基准上效果很好，但不一定容易迁移到新的损失、新的结构，或策略学习这类反馈是奖励而不是类别标签的问题。

如果适应步骤就是普通的梯度下降，那么任何本来就用梯度训练的模型，原则上都可以被事先准备好，以便快速微调。问题是这种准备应该优化什么。有些内部特征比另一些更容易迁移。一个明确的目标是：找到一个初始化，使得沿着新任务梯度走一小步就能有明显提升，而不必发明新的结构或可学习的更新规则。

## 问题

因此，要解决的是让快速适应变得通用。方法应当适用于全连接、卷积或循环网络，也适用于监督损失和强化学习目标。它不应增加一大批额外参数，并应允许使用者走一步或许多步梯度，使用当时能得到的任意数量的新数据。

形式上，任务抽自分布 p(T)。在 K-shot 设定里，模型必须只靠 K 个样本和相应的损失，就适应到新任务 T<sub>i</sub>。元训练时抽出一个任务，用这 K 个点更新模型，元目标则是更新之后、同一任务上一批新样本的损失。各个抽样任务上的测试误差，就是元学习器的训练信号。留出的任务用于元测试。

## 方法

这个算法叫做<b>与模型无关的元学习</b>（MAML）。它不改变模型 f<sub>θ</sub> 的形式，而是学习一个初始化 θ，使得在新任务上走一步或几步梯度后，参数能落到一个好的位置。

![图 1. MAML 示意图（Finn、Abbeel 与 Levine，2017，Fig. 1）。训练的是初始化 θ，使得沿着新任务损失走一小步梯度，参数就能移向一个较好的解 θ*。](/img/readApaper-45/readapaper45-fig1.png)

<i>图 1. MAML 示意图（Finn、Abbeel 与 Levine，2017，Fig. 1）。训练的是初始化 θ，使得沿着新任务损失走一小步梯度，参数就能移向一个较好的解 θ\*。</i>

若内层只用步长为 α 的一步，则任务 T<sub>i</sub> 上适配后的参数为

θ′<sub>i</sub> = θ − α ∇<sub>θ</sub> L<sub>T<sub>i</sub></sub>(f<sub>θ</sub>)。

元目标是：对从 p(T) 抽出的任务，把适配后模型 f<sub>θ′</sub> 在同一任务一批新样本上的损失加起来。然后用步长 β，根据这一“适应之后”的损失的梯度，去更新原来的 θ。自动微分可以把梯度传过内层更新，这需要二阶导数或 Hessian-向量积。作者也考察了一种<b>一阶近似</b>：丢掉这些二阶项，但仍在更新后的参数 θ′ 处计算元梯度。

![算法 1（Finn、Abbeel 与 Levine，2017）。对抽到的每个任务，内层循环用步长 α 计算适配后的参数 θ′；元更新再用适应之后的损失、以步长 β 去改原来的 θ。](/img/readApaper-45/readapaper45-algo1.png)

<i>算法 1（Finn、Abbeel 与 Levine，2017）。对抽到的每个任务，内层循环用步长 α 计算适配后的参数 θ′；元更新再用适应之后的损失、以步长 β 去改原来的 θ。</i>

同一结构覆盖多种问题。回归用均方误差，分类用交叉熵。强化学习里，由于期望奖励不能对环境反向传播，内层梯度是策略梯度估计，元优化器则可以采用信赖域方法。无论哪种情况，学到的对象都只是初始化：元训练结束之后，适应就是普通的微调，步数和数据量都可以另选。

## 实验

第一个演示是正弦波的少样本回归。每个任务是一条正弦，振幅抽自 [0.1, 5.0]，相位抽自 [0, π]。输入在 [−5.0, 5.0] 上采样，损失为均方误差。回归器是两层隐层、每层 40 个单元、ReLU 激活的网络。MAML 的训练使用 K = 10 个点上的一步内层梯度，α = 0.01，元优化器为 Adam。评估时，用同一个元学习到的模型在 K = 5、10 或 20 个点上微调，并与先在所有任务上预训练再微调的模型，以及能直接看到真实振幅和相位的 oracle 比较。

少样本分类使用 Omniglot 和 MiniImagenet，协议采用 Vinyals 等（2016）的 N-way、K-shot：选出 N 个未见过的类，每类提供 K 个例子，再给这些类的新实例分类。Omniglot 有来自 50 种字母表的 1,623 个字符，每个字符 20 张书写；1,200 个字符用于训练，其余用于测试，并做 90 度旋转增广。MiniImagenet 的训练 / 验证 / 测试类别为 64 / 12 / 24。卷积模型沿用 Vinyals 等的四模块、3 × 3 设置，64 个滤波器（MiniImagenet 上为 32），带批归一化和 ReLU；Omniglot 图像为 28 × 28。为了和记忆增强模型比较，也报告了隐层尺寸为 256、128、64、64 的非卷积网络。

强化学习任务建立在 rllab 连续控制环境上。策略有两层 100 单元的隐层。内层更新使用朴素策略梯度（REINFORCE），元优化器是 TRPO，Hessian-向量积用有限差分估计。二维导航中，质点要到达单位正方形内随机采样的目标；观察是位置，动作是裁剪到 [−0.1, 0.1] 的速度，奖励是负的平方距离，距离达到 0.01 或地平线 100 时结束。MAML 被训练成在 20 条轨迹上更新一次后性能最好，评估时最多再更新四次，每次 40 个样本。运动任务则要求平面猎豹或三维蚂蚁跑到随机速度（猎豹在 [0, 2] 上均匀，蚂蚁在 [0, 3] 上均匀），或沿随机选定的向前 / 向后方向跑，地平线为 200，每步 20 条 rollout（蚂蚁方向任务为 40 条）。

## 结果

在正弦任务上，MAML 的初始化只需五个点就能适应到新的曲线，并且能估计没有样本的那一段波形，说明它已经学会了周期结构。在同一任务分布上预训练再微调的模型，在如此少的点上无法可靠外推，还可能过拟合。尽管 MAML 是按“一步之后的表现”来训练的，适配后的模型在继续走更多梯度步时仍会变好，而不会塌缩到那一小份支持集上。

![图 2. 正弦波少样本回归（Finn、Abbeel 与 Levine，2017，Fig. 2）。左：MAML 的初始化只需 K = 5 或 10 个点就能适应，并能估计没有样本的那一段曲线。右：在同一任务分布上预训练再微调的模型会过拟合，也无法外推。](/img/readApaper-45/readapaper45-fig2.png)

<i>图 2. 正弦波少样本回归（Finn、Abbeel 与 Levine，2017，Fig. 2）。左：MAML 的初始化只需 K = 5 或 10 个点就能适应，并能估计没有样本的那一段曲线。右：在同一任务分布上预训练再微调的模型会过拟合，也无法外推。</i>

在留出的 Omniglot 字符上，卷积 MAML 在 5-way 1-shot 上达到 98.7 ± 0.4%，5-shot 为 99.9 ± 0.1%；在 20-way 的 1-shot 和 5-shot 上分别为 95.8 ± 0.3% 和 98.9 ± 0.2%（跨任务的 95% 置信区间）。非卷积的 MAML 在 5-way 1-shot 和 5-shot 上已达到 89.7 ± 1.1% 和 97.5 ± 0.6%，高于 Santoro 等（2016）的记忆增强网络。在 MiniImagenet 的 5-way 分类上，MAML 达到 48.70 ± 1.84%（1-shot）和 63.11 ± 0.92%（5-shot），高于匹配网络和元学习器 LSTM。一阶近似几乎相同，为 48.07 ± 1.75% 和 63.15 ± 0.91%，作者报告跳过二阶反向传播后，网络计算大约加快 33%。论文也指出，先前工作的 Omniglot 训练 / 测试划分并不总能获得，因此那些数字未必可以严格直接比较。

![表 1. 在留出的 Omniglot 字符和 MiniImagenet 测试集上的少样本分类（Finn、Abbeel 与 Levine，2017，Table 1）。数值为准确率及跨任务的 95% 置信区间。卷积 MAML 在 Omniglot 的 5-way 1-shot 和 5-shot 上分别达到 98.7 ± 0.4% 和 99.9 ± 0.1%，在 MiniImagenet 的 5-way 1-shot / 5-shot 上为 48.70 ± 1.84% / 63.11 ± 0.92%。一阶近似几乎相同。论文指出，Omniglot 的划分未必能与先前工作严格直接比较。](/img/readApaper-45/readapaper45-table1.png)

<i>表 1. 在留出的 Omniglot 字符和 MiniImagenet 测试集上的少样本分类（Finn、Abbeel 与 Levine，2017，Table 1）。数值为准确率及跨任务的 95% 置信区间。卷积 MAML 在 Omniglot 的 5-way 1-shot 和 5-shot 上分别达到 98.7 ± 0.4% 和 99.9 ± 0.1%，在 MiniImagenet 的 5-way 1-shot / 5-shot 上为 48.70 ± 1.84% / 63.11 ± 0.92%。一阶近似几乎相同。论文指出，Omniglot 的划分未必能与先前工作严格直接比较。</i>

在二维导航以及猎豹、蚂蚁运动任务上，MAML 初始化适应到新的目标位置、速度或方向，比常规预训练或随机初始化明显更快，两三步梯度就能达到较好表现。在这些更难的控制问题上，预训练有时还不如从头开始。与监督情形不同，强化学习的每一步梯度都需要从环境中重新采样。

![图 5. 半猎豹和蚂蚁在速度与方向任务上的连续控制适应（Finn、Abbeel 与 Levine，2017，Fig. 5）。MAML 在两三步梯度内就能达到较好回报，快于常规预训练或随机初始化。每一步梯度都需要从环境中重新采样。速度任务的随机基线因回报过低而未画出（猎豹低于 −200，蚂蚁低于 −25）。](/img/readApaper-45/readapaper45-fig5.png)

<i>图 5. 半猎豹和蚂蚁在速度与方向任务上的连续控制适应（Finn、Abbeel 与 Levine，2017，Fig. 5）。MAML 在两三步梯度内就能达到较好回报，快于常规预训练或随机初始化。每一步梯度都需要从环境中重新采样。速度任务的随机基线因回报过低而未画出（猎豹低于 −200，蚂蚁低于 −25）。</i>

## 分析

MAML 的价值不仅在于分类精度——它与专门的少样本方法相当，或略高——更在于同一套训练想法可以不用改结构，就迁移到回归和策略梯度强化学习。学到的对象是初始化，因此参数量就是底层模型本身的参数量；适应也可以继续走完元训练时所使用的那一步之外的更多步。

MiniImagenet 上的一阶结果表明，很大一部分好处来自在更新后的参数处计算元目标，而不是来自对内层更新求微分时出现的二阶项。这与“ReLU 网络在局部往往接近线性”的观察相一致。对强化学习而言，同样的敏感性视角可以解释：为什么一个仔细准备的初始化，能用很少的新经验推动高维策略；以及为什么在混合任务上预训练，并不自动就是一个好的起点。

## 总结

MAML 对模型的初始权重做元训练，使得在新任务上只需少量新数据、再走几步梯度，就能有好的泛化。同一套流程覆盖了正弦波少样本回归，Omniglot 和 MiniImagenet 分类——在这些基准上它达到或超过了很强的专门基线——以及连续控制策略的加速适应，并且除了被训练的模型本身，不再增加额外参数。

## 参考文献

Finn, C., Abbeel, P., & Levine, S. (2017). Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks. 载于 <i>Proceedings of the 34th International Conference on Machine Learning</i>（PMLR 70:1126–1135）。[https://proceedings.mlr.press/v70/finn17a.html](https://proceedings.mlr.press/v70/finn17a.html)

Vinyals, O., Blundell, C., Lillicrap, T., Kavukcuoglu, K., & Wierstra, D. (2016). Matching networks for one shot learning. 载于 <i>Advances in Neural Information Processing Systems</i>。

Ravi, S., & Larochelle, H. (2017). Optimization as a model for few-shot learning. 载于 <i>International Conference on Learning Representations</i>。

Santoro, A., Bartunov, S., Botvinick, M., Wierstra, D., & Lillicrap, T. (2016). Meta-learning with memory-augmented neural networks. 载于 <i>International Conference on Machine Learning</i>。

Lake, B. M., Salakhutdinov, R., & Tenenbaum, J. B. (2011). Omniglot。见 Finn et al.（2017）的引用。

图和 Table 1 引自 Finn、Abbeel 与 Levine（2017），PMLR 70:1126–1135。
