---
title: "readApaper#44 Spatio-temporal correlations and visual signalling in a complete neuronal population"
title_zh: "readApaper#44 Spatio-temporal correlations and visual signalling in a complete neuronal population"
date: 2026-11-30 22:00:00
tags:
  - readApaper
  - neuroscience
  - retina
  - neural-coding
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 30 November 2026 · Nature, 2008</i>

This paper shows that, in a complete mosaic of macaque retinal ganglion cells, a coupled model captures fine-timescale correlations and yields substantially more visual information than treating the cells as independent.

## Background

<b>Retinal ganglion cells</b> (RGCs) are the output neurons of the retina. They send spike trains up the optic nerve, and those spikes are the only visual messages the rest of the brain receives from the eye. Parasol cells, one major type, come in ON and OFF groups that raise or lower their firing when light in their receptive-field center increases. In a small patch of retina, the receptive fields of each type tile visual space as a mosaic: if every cell in that patch is recorded, one has a <b>complete population</b> of that cell class.

Neurons in such a population do not fire independently. They show <b>correlations</b>: a tendency to produce temporally coordinated spikes. Some of that structure is inherited from the stimulus, because neighboring cells have overlapping receptive fields and therefore see similar light. Some of it is not. Cells can also share internal noise, or influence one another through synapses or electrical junctions, so that a spike in one cell changes the odds of a spike in another, even when the stimulus is taken into account.

Whether those extra dependencies matter for coding has been debated for years. Studies of cell pairs have often found only modest gains when correlations are included, sometimes less than 10%. A pair, however, is not a mosaic: correlations that look weak between two cells can add up, or cancel, once the whole local population is observed. This paper asks what correlated firing does in a complete parasol population, both for predicting spikes and for recovering the visual stimulus.

## Problem

Two related questions have to be separated. The first is about encoding: can a single model capture how the stimulus and the recent spikes of the whole population together produce each cell’s spike train, including the sharp, millisecond-scale synchrony seen in the data? An independent model might still predict each cell’s average response to light quite well, yet miss the coordinated patterns that appear on a single trial.

The second is about information. Even if correlations help one predict spikes, they might not add much information about the stimulus itself. In that case, a decoder that treated the cells as independent, given the light, would already extract nearly everything the population had to say about the visual scene. The authors test that claim directly, by asking how much more of the stimulus can be recovered when the decoder may use the correlation structure.

## Method

The encoding model is a <b>generalized linear model</b> (GLM), a generalization of the familiar linear–nonlinear–Poisson cascade. Each cell is driven by three kinds of linear filter. A <b>stimulus filter</b> is the cell’s spatiotemporal receptive field. A <b>post-spike filter</b> captures the cell’s own recent history, such as refractoriness or burstiness. <b>Coupling filters</b> capture the influence of recent spikes in other cells. The filter outputs are summed and passed through an exponential nonlinearity to give an instantaneous spike rate. In that representation, an exponentiated post-spike or coupling filter is a gain: after a spike at time zero, it multiplies the cell’s firing rate.

![Figure 1. Coupled GLM and the complete parasol mosaics (Pillow et al., 2008, Fig. 1). (a) Each cell has a stimulus filter, a post-spike filter, and coupling filters from other cells; an exponential maps the summed filter output to an instantaneous rate. (b) Receptive-field mosaics of 11 ON and 16 OFF cells. (c–h) Fitted filters for example ON and OFF cells, including incoming coupling.](/img/readApaper-44/readapaper44-fig1.png)

<i>Figure 1. Coupled GLM and the complete parasol mosaics (Pillow et al., 2008, Fig. 1). (a) Each cell has a stimulus filter, a post-spike filter, and coupling filters from other cells; an exponential maps the summed filter output to an instantaneous rate. (b) Receptive-field mosaics of 11 ON and 16 OFF cells. (c–h) Fitted filters for example ON and OFF cells, including incoming coupling.</i>

The model is phenomenological, but its parts have rough biophysical analogues, from outer-retinal integration to post-spike currents and coupling that can reflect synapses, gap junctions, or shared noise. Because one cell’s stochastic spike can change later rates in the population, the model produces shared, non-Poisson variability.

Parameters were fitted by penalized maximum likelihood to 7 minutes of responses to a non-repeating stimulus. Each cell had a rank-2 stimulus filter, a spike-history filter, incoming coupling filters, and a constant. An L1 penalty on the coupling filters removed unnecessary connections. An <b>uncoupled</b> model was fitted in the same way but without coupling, so that each cell depended only on the stimulus and its own history. A Poisson, or LNP, model further dropped the post-spike filter.

## Experiments

Multi-electrode recordings were made in vitro from a segment of isolated, peripheral macaque (<i>Macaca mulatta</i>) retina. Analysis was restricted to ON and OFF parasol cells. After ordinary spike sorting, a specialized method was used to detect synchronous spikes. The stimulus was photopic, achromatic, optically reduced spatiotemporal binary white noise, refreshing at 120 Hz, with 96% root-mean-square contrast.

The recorded population was complete in a small region: 11 ON and 16 OFF cells, 27 in all, whose receptive fields tiled the patch. That gives 351 possible cell pairs. Encoding predictions were cross-validated on 5 minutes of novel spiking, in bits per second. Repeat rasters used 200 presentations of a novel 10-second stimulus. For single-trial prediction, the coupled model was sampled given the stimulus and the rest of the population, and the resulting “population-conditioned” rate was compared with true spikes binned at 2 ms.

Decoding used the Bayes least-squares estimator (the posterior mean) to reconstruct short stimulus segments from all relevant population spike times. Each segment was 150 ms long, or 18 samples of a single stimulus pixel. For comparison, the authors also decoded under the uncoupled and Poisson models and with the optimal linear estimator. Performance was quantified as a log signal-to-noise ratio, an estimate of mutual information. Error bars on the main comparison are 95% confidence intervals from 2,000 bootstrap resamplings of 3,000 decoded segments.

## Results

Fitted filters have a familiar center–surround stimulus field. After a spike, the post-spike gain shows a brief refractory period and a gradual recovery, with a slight overshoot. Coupling is mostly nearest-neighbor and falls with distance between receptive-field centers. For an example ON cell, spikes in neighboring ON cells produce a large, transient excitation, multiplying the instantaneous rate by a factor of three, while nearby OFF spikes suppress it; the pattern reverses for an example OFF cell. Fitted stimulus filters also have smaller surrounds than the spike-triggered average, so part of the classical surround can be attributed to interactions between cells.

The full model reproduces pairwise cross-correlation functions (CCFs) for all 351 pairs, including the sharp zero-lag peak for nearby ON–ON and OFF–OFF pairs and the trough for ON–OFF pairs. The uncoupled model does not capture those sharp peaks. The same peaks are missing from trial-shuffled CCFs, which means that the fast synchrony is not induced by the stimulus and cannot be captured by any independent encoding model. Triplet CCFs for adjacent cells of the same type show a peak at zero—“triplet synchrony”—that the full model also matches.

![Figure 2. Pairwise and triple spike-time correlations (Pillow et al., 2008, Fig. 2). Recorded cross-correlation functions (black) are matched by the full model (red) but not by the uncoupled model (blue). (e–g) CCFs for all ON–ON, OFF–OFF, and ON–OFF pairs. (h–j) Triple correlations and peak-height comparisons.](/img/readApaper-44/readapaper44-fig2.png)

<i>Figure 2. Pairwise and triple spike-time correlations (Pillow et al., 2008, Fig. 2). Recorded cross-correlation functions (black) are matched by the full model (red) but not by the uncoupled model (blue). (e–g) CCFs for all ON–ON, OFF–OFF, and ON–OFF pairs. (h–j) Triple correlations and peak-height comparisons.</i>

Despite that difference in correlations, the full and uncoupled models predict average light responses with nearly identical accuracy, capturing 80–95% of the variance of the peri-stimulus time histogram (PSTH) in 26 of 27 cells (about 84% in the example of Figure 3). On single trials, however, the full model is more accurate: it predicts multi-neuronal spike responses with 8 ± 3% more bits per spike. When the model is given the stimulus and the rest of the population, the population-conditioned rate is more highly correlated with the cell’s true 2 ms spike times, on nearly every trial, than the cell’s ordinary PSTH. The PSTH is the best possible prediction that does not depend on the trial; exploiting the correlation structure therefore beats any independent encoding model at predicting single-neuron spike times.

![Figure 3. Spike-train prediction on a novel stimulus (Pillow et al., 2008, Fig. 3). (a, b) Rasters and PSTHs of an ON cell across 25 repeats; both models account for about 84% of PSTH variance in this example, and 80–95% in 26 of 27 cells. (d) The full model provides 8 ± 3% more bits/spike. (f, g) Population-conditioned single-trial rates track trial-to-trial fluctuations better than the true PSTH.](/img/readApaper-44/readapaper44-fig3.png)

<i>Figure 3. Spike-train prediction on a novel stimulus (Pillow et al., 2008, Fig. 3). (a, b) Rasters and PSTHs of an ON cell across 25 repeats; both models account for about 84% of PSTH variance in this example, and 80–95% in 26 of 27 cells. (d) The full model provides 8 ± 3% more bits/spike. (f, g) Population-conditioned single-trial rates track trial-to-trial fluctuations better than the true PSTH.</i>

Bayesian decoding under the coupled model recovers 20% more information about the 150 ms stimulus segments than Bayesian decoding under the uncoupled model, and, as stated in the abstract, preserves 40% more visual information than optimal linear decoding. A Poisson model preserves 6% less information than the uncoupled model, so spike history also matters for decoding. The benefit of correlations is largest at the temporal frequencies, 6–20 Hz, that are already encoded with the highest fidelity. When the same Bayesian decoder is applied only to isolated pairs from this population, the information gain from including correlations is ≤10%, in line with earlier pairwise studies and smaller than the gain for the complete population.

![Figure 4. Bayesian stimulus decoding (Pillow et al., 2008, Fig. 4). (b) Log SNR for linear decoding and for Bayesian decoding under Poisson, uncoupled, and full models. The coupled model recovers 20% more information than the uncoupled model; the abstract reports 40% more than optimal linear decoding. Error bars are 95% confidence intervals from 2,000 bootstrap resamplings of 3,000 decoded segments. (c) The extra information is largest at about 6–20 Hz.](/img/readApaper-44/readapaper44-fig4.png)

<i>Figure 4. Bayesian stimulus decoding (Pillow et al., 2008, Fig. 4). (b) Log SNR for linear decoding and for Bayesian decoding under Poisson, uncoupled, and full models. The coupled model recovers 20% more information than the uncoupled model; the abstract reports 40% more than optimal linear decoding. Error bars are 95% confidence intervals from 2,000 bootstrap resamplings of 3,000 decoded segments. (c) The extra information is largest at about 6–20 Hz.</i>

## Analysis

The first insight is about noise. At the population level, these cells are less noisy than their individual variability suggests. Once neighboring spikes are known, a cell’s next spike is more predictable. Shared variability is not just a nuisance: it is a source of information about what one neuron will do, beyond what the stimulus alone provides.

The second insight is about the stimulus. The 20% decoding gain is a statement about the complete mosaic, not about any one pair. Pairwise analyses in the same data give at most a 10% gain, which is why earlier pair studies could look as if correlations were almost dispensable. Second-order pairwise correlations could in principle have scaled up or down with population size; here, measuring the whole local mosaic shows a larger benefit than the pairs reveal. The gain is also specific to the correlation structure: improving stimulus filters or nonlinearities in the uncoupled model does not close the gap.

The comparison with linear decoding is a reminder that how one reads the spikes matters as much as whether the cells are modeled as coupled. A linear readout leaves still more information on the table, and the extra information is concentrated at the frequencies the retina already encodes most faithfully.

## Summary

In a complete mosaic of 27 macaque parasol cells, a coupled GLM captures both average light responses and the fine-timescale correlations that independent models miss. Using that correlation structure makes single-trial spikes more predictable, and it lets a Bayesian decoder recover 20% more visual information than an independent model and 40% more than an optimal linear decoder—more than pairwise analyses of the same population would have suggested.

## References

Pillow, J. W., Shlens, J., Paninski, L., Sher, A., Litke, A. M., Chichilnisky, E. J., & Simoncelli, E. P. (2008). Spatio-temporal correlations and visual signalling in a complete neuronal population. <i>Nature, 454</i>, 995–999. [https://doi.org/10.1038/nature07140](https://doi.org/10.1038/nature07140)

Warland, D., Reinagel, P., & Meister, M. (1997). Decoding visual information from a population of retinal ganglion cells. <i>Journal of Neurophysiology, 78</i>, 2336–2350.

Paninski, L. (2004). Maximum likelihood estimation of cascade point-process neural encoding models. <i>Network: Computation in Neural Systems, 15</i>, 243–262.

Nirenberg, S., Carcieri, S., Jacobs, A., & Latham, P. (2001). Retinal ganglion cells act largely as independent encoders. <i>Nature, 411</i>, 698–701.

Figures are from Pillow et al. (2008), <i>Nature, 454</i>, 995–999.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-30 · Nature, 2008</i>

这篇论文表明，在猕猴视网膜神经节细胞的完整镶嵌里，一个带耦合的编码模型能够抓住精细时间尺度上的相关；利用这些相关，比把细胞当作相互独立，可以多取出相当可观的视觉信息。

## 背景

<b>视网膜神经节细胞</b>（RGC）是视网膜的输出神经元。它们把脉冲沿视神经送出去，这是大脑从眼睛接收到的全部视觉消息。寄生细胞（parasol cells）是其中主要的一类，又分为 ON 和 OFF：感受野中心变亮时，前者发放升高，后者降低。在一小片视网膜上，同一类型的感受野会像镶嵌一样铺满视觉空间；如果这片里的每个细胞都被记录到，就得到该细胞类型的一个<b>完整群体</b>。

这样的群体里，神经元并不是独立发放的。它们表现出<b>相关性</b>：脉冲在时间上倾向于协同出现。一部分结构来自刺激，因为邻近细胞的感受野有重叠，看到的光也相似。还有一部分不是这样。细胞可以共享内部噪声，或通过化学突触、电突触互相影响，因而即使考虑了刺激，一个细胞的发放仍会改变另一个细胞发放的机会。

这些额外的依赖对编码是否重要，已经争论多年。针对细胞对的研究常常发现，把相关算进去之后，信息增益并不大，有时不到 10%。可是一对细胞并不是一整片镶嵌。在两个细胞之间显得很弱的相关，一旦观察到整个局部群体，既可能累加，也可能抵消。这篇论文要问的是：在完整的寄生细胞群体里，相关发放对预测脉冲、以及对恢复视觉刺激，究竟起了什么作用。

## 问题

这里要分开两个相关的问题。第一个是关于编码：能不能用同一个模型，同时抓住刺激和整个群体近期脉冲如何共同产生每个细胞的脉冲序列，包括数据里看到的、毫秒尺度的同步？一个独立模型也许仍能很好地预测每个细胞对光的平均反应，却会错过单次试验里那些协同的模式。

第二个是关于信息。即使相关有助于预测脉冲，它们也未必给关于刺激本身的信息增加多少。若是那样，一个在给定光刺激后把细胞当作独立的解码器，就已经能取出这个群体关于视觉场景的几乎全部内容。作者需要一个足够准确的模型，才能直接检验这个判断：当解码器被允许使用相关结构时，到底能多恢复多少刺激。

## 方法

编码模型是一个<b>广义线性模型</b>（GLM），也就是常见的线性–非线性–泊松级联的推广。每个细胞由三类线性滤波器驱动。<b>刺激滤波器</b>是细胞的时空感受野。<b>脉冲后滤波器</b>刻画细胞自身的近期历史，例如不应期或簇发放。<b>耦合滤波器</b>刻画其他细胞近期脉冲的影响。各滤波器输出相加后，经过指数非线性，得到瞬时发放率。在这种写法里，指数化后的脉冲后滤波器或耦合滤波器就是一种增益：在零时刻发放之后，它去乘这个细胞的发放率。

![图 1. 耦合广义线性模型与完整的 parasol 镶嵌（Pillow 等，2008，Fig. 1）。（a）每个细胞有刺激滤波器、发放后滤波器，以及来自其他细胞的耦合滤波器；指数函数把滤波输出之和映射为瞬时发放率。（b）11 个 ON 细胞和 16 个 OFF 细胞的感受野镶嵌。（c–h）示例 ON、OFF 细胞的拟合滤波器，包括传入耦合。](/img/readApaper-44/readapaper44-fig1.png)

<i>图 1. 耦合广义线性模型与完整的 parasol 镶嵌（Pillow 等，2008，Fig. 1）。（a）每个细胞有刺激滤波器、发放后滤波器，以及来自其他细胞的耦合滤波器；指数函数把滤波输出之和映射为瞬时发放率。（b）11 个 ON 细胞和 16 个 OFF 细胞的感受野镶嵌。（c–h）示例 ON、OFF 细胞的拟合滤波器，包括传入耦合。</i>

模型是现象学的，但各部分可以大致对应到生物物理机制：刺激滤波器近似外层视网膜和树突上的整合，脉冲后滤波器近似发放后的电流，耦合近似突触或电相互作用，也可以模仿共享噪声，指数则像是从电压到发放概率的软阈值。因为一个细胞的随机发放可以改变群体里后续的发放率，模型会产生共享的、非泊松的变异。

参数用带惩罚的最大似然，拟合到 7 分钟非重复刺激下的反应。每个细胞包括一个秩为 2 的刺激滤波器、一个发放历史滤波器、一组输入耦合滤波器，以及一个常数。耦合滤波器上的 L1 惩罚用来去掉不必要的连接。作为对照，作者用同样方式拟合了<b>无耦合</b>模型，去掉耦合，使每个细胞只依赖刺激和自身历史；泊松（LNP）模型则进一步去掉脉冲后滤波器。

## 实验

实验在离体的猕猴（<i>Macaca mulatta</i>）周边视网膜片段上，用多电极做记录，分析限于 ON 和 OFF 寄生细胞。常规排序之后，还用专门方法检测同步脉冲。刺激是明视、消色差、经光学缩小的时空二元白噪声，刷新率 120 Hz，均方根对比度为 96%。

在一小片区域里，记录是完整的：11 个 ON 细胞和 16 个 OFF 细胞，共 27 个，感受野铺满这一小块，一共有 351 对可能的细胞对。编码预测在 5 分钟新的发放数据上做交叉验证，单位是比特每秒。重复光栅使用一段新的 10 秒刺激，呈现 200 次。做单次试验预测时，耦合模型在给定刺激和其余群体活动的条件下采样，得到的“群体条件”发放率，再与按 2 ms 分箱的真实脉冲比较。

解码使用贝叶斯最小二乘估计（后验均值），从所有相关的群体脉冲时间重建短刺激片段。每段长 150 ms，相当于单个刺激像素的 18 个样本。作为对照，作者也在无耦合模型和泊松模型下做贝叶斯解码，并用最优线性估计器解码。性能用对数信噪比来量化，它是互信息的一种估计。主要信息比较的误差条，是对 3000 个解码片段做 2000 次自助抽样得到的 95% 置信区间。按频率分解时，使用了刺激和残差的傅里叶谱。

## 结果

拟合出的滤波器呈现出熟悉的中心–周边刺激野。发放之后，脉冲后增益先有短暂不应，再逐渐恢复，并略有超调。耦合以近邻为主，并随感受野中心之间的距离下降。对一个示例 ON 细胞，邻近 ON 细胞的发放会引起大而短暂的兴奋，把瞬时发放率乘上三倍，而邻近 OFF 发放则起抑制作用；示例 OFF 细胞上的模式正好相反。拟合得到的刺激滤波器，周边也比脉冲触发平均更小，说明经典周边的一部分可以用细胞之间的相互作用来解释。

完整模型能重现全部 351 对的成对互相关函数（CCF），包括邻近 ON–ON、OFF–OFF 对在零延迟处的尖锐峰，以及 ON–OFF 对的谷。无耦合模型抓不住这些尖峰。试验打乱后的 CCF 里同样没有这些峰，说明这种快速同步不是由刺激引起的，任何独立编码模型都无法抓住它。同一类型的相邻细胞三联 CCF 在零处有峰，也就是“三联同步”，完整模型也能匹配。

![图 2. 成对及三元组的发放时间相关（Pillow 等，2008，Fig. 2）。记录到的互相关函数（黑）能被完整模型（红）拟合，但不能被无耦合模型（蓝）拟合。（e–g）全部 ON–ON、OFF–OFF 和 ON–OFF 对的互相关。（h–j）三阶相关以及峰高度比较。](/img/readApaper-44/readapaper44-fig2.png)

<i>图 2. 成对及三元组的发放时间相关（Pillow 等，2008，Fig. 2）。记录到的互相关函数（黑）能被完整模型（红）拟合，但不能被无耦合模型（蓝）拟合。（e–g）全部 ON–ON、OFF–OFF 和 ON–OFF 对的互相关。（h–j）三阶相关以及峰高度比较。</i>

尽管相关结构差别很大，完整模型和无耦合模型对平均光反应的预测精度几乎相同：在 27 个细胞中的 26 个上，能解释刺激后时间直方图（PSTH）方差的 80–95%（图 3 的例子约为 84%）。但在单次试验上，完整模型更准：它对多种经元脉冲反应的预测要多出 8 ± 3% 比特/脉冲。当模型同时得到刺激和其余群体的活动时，群体条件发放率与细胞真实的 2 ms 脉冲，在几乎每一次试验上，都比这个细胞普通的 PSTH 有更高的相关。PSTH 是不依赖试验的最好预测；利用相关结构，因此比任何独立编码模型都能更准确地预测单个神经元的发放时刻。

![图 3. 在新刺激上的发放序列预测（Pillow 等，2008，Fig. 3）。（a、b）一个 ON 细胞在 25 次重复上的栅格图和 PSTH；在这个例子里，两个模型大约都能解释 PSTH 方差的 84%，在 27 个细胞中的 26 个上为 80–95%。（d）完整模型多提供 8 ± 3% 的 bits/spike。（f、g）以群体为条件的单次试验发放率，比真实 PSTH 更能跟上试次间的波动。](/img/readApaper-44/readapaper44-fig3.png)

<i>图 3. 在新刺激上的发放序列预测（Pillow 等，2008，Fig. 3）。（a、b）一个 ON 细胞在 25 次重复上的栅格图和 PSTH；在这个例子里，两个模型大约都能解释 PSTH 方差的 84%，在 27 个细胞中的 26 个上为 80–95%。（d）完整模型多提供 8 ± 3% 的 bits/spike。（f、g）以群体为条件的单次试验发放率，比真实 PSTH 更能跟上试次间的波动。</i>

在耦合模型下做贝叶斯解码，比在无耦合模型下做贝叶斯解码，能从 150 ms 的刺激片段中多恢复 20% 的信息；摘要还写明，它比最优线性解码多保留 40% 的视觉信息。泊松模型比无耦合模型少保留 6% 的信息，说明发放历史对解码也有作用。相关带来的好处，在已经编码得最忠实的 6–20 Hz 时间频率上最为明显。如果把同样的贝叶斯解码只用在这个群体里抽出的细胞对上，计入相关后的信息增益不超过 10%，这与更早的成对研究一致，也小于完整群体上的增益。

![图 4. 贝叶斯刺激解码（Pillow 等，2008，Fig. 4）。（b）线性解码，以及泊松、无耦合和完整模型下贝叶斯解码的对数信噪比。耦合模型比无耦合模型多恢复 20% 的信息；摘要中还写到，比最优线性解码多 40%。误差棒是对 3,000 段解码结果做 2,000 次自助抽样的 95% 置信区间。（c）额外信息主要集中在大约 6–20 Hz。](/img/readApaper-44/readapaper44-fig4.png)

<i>图 4. 贝叶斯刺激解码（Pillow 等，2008，Fig. 4）。（b）线性解码，以及泊松、无耦合和完整模型下贝叶斯解码的对数信噪比。耦合模型比无耦合模型多恢复 20% 的信息；摘要中还写到，比最优线性解码多 40%。误差棒是对 3,000 段解码结果做 2,000 次自助抽样的 95% 置信区间。（c）额外信息主要集中在大约 6–20 Hz。</i>

## 分析

第一点洞察与噪声有关。在群体水平上，这些细胞并不像它们各自的变异看起来那么吵。一旦知道邻近细胞的发放，一个细胞的下一次脉冲就更可预测。共享变异不只是干扰：除了刺激本身，它还提供了关于单个神经元将做什么的信息。

第二点洞察与刺激有关。那 20% 的解码增益，说的是完整镶嵌，而不是某一对细胞。在同一批数据里，成对分析最多只给出 10% 的增益，这也是为什么更早的成对研究看起来会觉得相关几乎可以忽略。二阶的成对相关按理既可能随群体变大而放大，也可能缩小；在这里，测量整个局部镶嵌之后，看到的好处大于成对分析所揭示的。这一增益也专属于相关结构：改进无耦合模型的刺激滤波器或非线性，并不能弥合差距。

与线性解码的比较则提醒我们：如何读这些脉冲，和是否把细胞建成耦合的，同样重要。线性读出比一个仍然基于模型、但把细胞当作独立的解码器，会留下更多视觉信息。按频率的分析还补上一个功能细节：多出来的信息并不是均匀铺开的，而是集中在视网膜本来就把刺激编码得最忠实的地方。

## 总结

在 27 个猕猴寄生细胞构成的完整镶嵌里，带耦合的 GLM 既能抓住平均光反应，也能抓住独立模型错过的精细时间相关。利用这种相关结构，单次试验的脉冲更好预测；贝叶斯解码器也比独立模型多恢复 20% 的视觉信息，比最优线性解码器多 40%——这比在同一群体里做成对分析所显示的要更多。

## 参考文献

Pillow, J. W., Shlens, J., Paninski, L., Sher, A., Litke, A. M., Chichilnisky, E. J., & Simoncelli, E. P. (2008). Spatio-temporal correlations and visual signalling in a complete neuronal population. <i>Nature, 454</i>, 995–999. [https://doi.org/10.1038/nature07140](https://doi.org/10.1038/nature07140)

Warland, D., Reinagel, P., & Meister, M. (1997). Decoding visual information from a population of retinal ganglion cells. <i>Journal of Neurophysiology, 78</i>, 2336–2350.

Paninski, L. (2004). Maximum likelihood estimation of cascade point-process neural encoding models. <i>Network: Computation in Neural Systems, 15</i>, 243–262.

Nirenberg, S., Carcieri, S., Jacobs, A., & Latham, P. (2001). Retinal ganglion cells act largely as independent encoders. <i>Nature, 411</i>, 698–701.

图引自 Pillow et al.（2008），<i>Nature, 454</i>, 995–999。
