---
title: "readApaper#51 Masked Autoencoders Are Scalable Vision Learners"
title_zh: "readApaper#51 掩码自编码器是可扩展的视觉学习器"
date: 2026-12-07 22:00:00
tags:
  - readApaper
  - machine-learning
  - computer-vision
  - self-supervised-learning
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 7 December 2026 · CVPR, 2022</i>

This paper shows that a masked autoencoder can pretrain a large Vision Transformer by hiding most of the image, encoding only the visible patches, and reconstructing the missing pixels, and that this simple recipe scales to strong ImageNet accuracy.

## Background

In language, it has become common to pretrain a model by hiding some of the input and asking the model to fill it in. The same idea is appealing in vision: an image can be cut into patches, some of those patches can be removed, and a network can be trained to reconstruct what is missing. If the model must infer objects, textures and spatial relations from the parts that remain, the resulting representation may later be useful for recognition.

A <b>Vision Transformer</b> (ViT) is a natural architecture for this task, because it already treats an image as a sequence of patches. The difficulty is practical as well as conceptual. Images are highly redundant, so a model that sees most of the patches may reconstruct the missing ones by local interpolation, without learning much. Training a large encoder on every patch, including placeholders for the missing ones, is also computationally heavy. The authors’ question is whether a carefully designed masked autoencoder can turn those obstacles into advantages: use a very high masking ratio to make the task hard, and skip the masked patches in the encoder to make training efficient.

## Problem

Self-supervised pretraining in vision had often relied on contrastive learning, which compares different views of an image, or on other pretext tasks that do not reconstruct pixels. Masked reconstruction is simpler, but it was not obvious that it would scale to large ViT models on ImageNet, or that a high masking ratio would help rather than hurt. The problem is to design a masked autoencoder that is both an efficient learner and a strong transferable representation, and to measure how masking ratio, decoder size and related choices affect recognition after pretraining.

## Method

The method, called MAE, has two core designs. First, the architecture is <b>asymmetric</b>. During pretraining, a large random subset of patches—by default 75%—is masked out. The encoder sees only the visible patches, with no mask tokens. Mask tokens are introduced after the encoder, and a lightweight decoder then processes the full set of encoded patches plus mask tokens and reconstructs the image in pixels. The loss is mean squared error on the masked patches only. After pretraining, the decoder is discarded, and the encoder is applied to uncorrupted images, that is, to the full set of patches, for recognition tasks.

![Figure 1. Our MAE architecture (He et al., 2022, Fig. 1). During pre-training a large random subset of patches (e.g., 75%) is masked out. The encoder is applied only to visible patches; mask tokens are introduced after the encoder, and a lightweight decoder reconstructs pixels. The decoder is discarded at recognition time.](/img/readApaper-51/mae_fig1.png)

<i>Figure 1. Our MAE architecture (He et al., 2022, Fig. 1). During pre-training a large random subset of patches (e.g., 75%) is masked out. The encoder is applied only to visible patches; mask tokens are introduced after the encoder, and a lightweight decoder reconstructs pixels. The decoder is discarded at recognition time.</i>

Second, the high masking ratio is treated as a feature, not a compromise. Because only a quarter of the patches (under the 75% default) go through the encoder, pretraining is substantially cheaper than a symmetric design that would encode placeholders for every missing patch. The authors report that this accelerates training by 3× or more and also improves accuracy. Data augmentation can be minimal: the default in their ablations is random resized cropping, without a strong requirement for color jitter.

## Experiments

The main recognition benchmark is ImageNet-1K. Models are pretrained as masked autoencoders and then either fine-tuned or evaluated by linear probing, in which a linear classifier is trained on a frozen encoder. The default ablation configuration is a ViT-L/16 model with a decoder of depth 8 and width 512, unnormalized pixels as the reconstruction target, 75% random masking, and 800 pretraining epochs. Under those defaults, fine-tuning reaches 84.9% and linear probing reaches 73.5%. Fine-tuning after MAE uses 50 epochs, compared with 200 epochs for a from-scratch baseline.

Ablations vary decoder depth and width, the presence of mask tokens in the encoder, the reconstruction target, augmentation, and the masking strategy (random, block, or grid). A separate curve varies the masking ratio for both fine-tuning and linear probing. Scaling experiments include a ViT-Huge model. The paper also shows qualitative reconstructions, including examples at an 80% masking ratio (39 of 196 patches visible) and reconstructions of images that are masked even more heavily than the 75% used in training.

## Results

The reconstructions are semantically plausible even when most of the image is hidden. In the illustrative examples, an 80% mask still yields a coherent object, although the loss is computed only on masked patches, so the visible patches are not forced to look perfect. When a model trained at 75% masking is given still higher masking ratios, including 85% and 95%, the predictions remain plausible even when they differ from the original image, which the authors take as a sign that the model is generalizing rather than merely copying local texture.

![Figure 2. Example results on ImageNet validation images (He et al., 2022, Fig. 2). For each triplet: masked image (left), MAE reconstruction (middle), and ground truth (right). The masking ratio in these examples is 80%, leaving only 39 of 196 patches; the default method uses 75% masking.](/img/readApaper-51/mae_fig2.png)

<i>Figure 2. Example results on ImageNet validation images (He et al., 2022, Fig. 2). For each triplet: masked image (left), MAE reconstruction (middle), and ground truth (right). The masking ratio in these examples is 80%, leaving only 39 of 196 patches; the default method uses 75% masking.</i>

On ImageNet-1K, the default ViT-L configuration reaches 84.9% fine-tuning accuracy and 73.5% linear-probing accuracy. A ViT-L trained from scratch, in a comparison in the paper, reaches 82.5% with a longer 200-epoch fine-tuning schedule, versus 84.9% after MAE pretraining and 50 epochs of fine-tuning. A ViT-Huge model reaches 87.8% ImageNet-1K fine-tuning accuracy, which the paper reports as the best among the ImageNet-1K-only methods it compares.

![Figure 4. Reconstructions of ImageNet validation images using an MAE pre-trained at 75% masking but applied at higher masking ratios (He et al., 2022, Fig. 4). Predictions at 85% and 95% masking remain plausible even when they differ from the original images.](/img/readApaper-51/mae_fig4.png)

<i>Figure 4. Reconstructions of ImageNet validation images using an MAE pre-trained at 75% masking but applied at higher masking ratios (He et al., 2022, Fig. 4). Predictions at 85% and 95% masking remain plausible even when they differ from the original images.</i>

Masking-ratio curves show that high ratios work well for fine-tuning: the plotted curve remains in a narrow, high band, with 83.2% at 10% masking, 83.4% at 20% and 30% masking, and 83.0% at 90% masking. Linear probing is more sensitive and prefers higher ratios, rising from 54.6% at 10% masking to a peak of 73.5% at 75%, then falling to 66.1% at 90%. Random sampling at 75% outperforms block or grid masking in the default table.

![Figure 5. Masking ratio (He et al., 2022, Fig. 5). A high masking ratio (75%) works well for both fine-tuning (top) and linear probing (bottom). Linear probing rises from 54.6% at 10% masking to 73.5% at 75%. The y-axes are ImageNet-1K validation accuracy (%).](/img/readApaper-51/mae_fig5.png)

<i>Figure 5. Masking ratio (He et al., 2022, Fig. 5). A high masking ratio (75%) works well for both fine-tuning (top) and linear probing (bottom). Linear probing rises from 54.6% at 10% masking to 73.5% at 75%. The y-axes are ImageNet-1K validation accuracy (%).</i>

The decoder can be narrower than the encoder and still work; a width of 512 matches the default 84.9% / 73.5%, and a very shallow decoder is already enough for fine-tuning, while a deeper decoder helps linear probing (depth 8 gives 73.5% versus 65.5% at depth 1). An encoder without mask tokens is both more accurate and cheaper than an encoder that includes them (84.9% / 73.5% and 1× FLOPs, versus 84.2% / 59.6% and 3.3× FLOPs). Pixel reconstruction targets are effective; a normalized-pixel variant can be slightly higher (85.4% / 73.9%).

![Table 1. MAE ablation experiments with ViT-L/16 on ImageNet-1K (He et al., 2022, Table 1). Default settings (decoder depth 8, width 512, 75% random masking, 800-epoch pre-training) reach 84.9% fine-tuning and 73.5% linear-probing accuracy, marked in gray.](/img/readApaper-51/mae_table1.png)

<i>Table 1. MAE ablation experiments with ViT-L/16 on ImageNet-1K (He et al., 2022, Table 1). Default settings (decoder depth 8, width 512, 75% random masking, 800-epoch pre-training) reach 84.9% fine-tuning and 73.5% linear-probing accuracy, marked in gray.</i>

## Analysis

MAE’s contribution is the combination of a hard pretext task with an encoder that never sees the discarded patches during pretraining. The high mask ratio is what makes reconstruction difficult enough to be useful, and it is also what makes the encoder cheap. The fact that fine-tuning remains strong across a wide band of high mask ratios, while linear probing peaks near 75%, suggests that the representation used by a frozen encoder is more sensitive to the pretext design than the representation obtained after fine-tuning the whole model.

The paper’s strongest ImageNet-1K fine-tuning number in this set of experiments is 87.8% with ViT-Huge. That should be read as the authors state it: a leading result among methods trained only on ImageNet-1K in their comparison, not as a claim about every later system or every larger dataset. The 84.9% default ViT-L number is the more useful reference for the ablations, because that is the setting in which decoder depth, width, mask tokens and sampling were varied.

Discarding the decoder at recognition time is part of the practical design. The decoder exists to give the encoder a reconstruction objective; once pretraining is done, recognition uses a complete, unmasked image and does not need mask tokens. That asymmetry is why the method can spend capacity on a large encoder without paying the same cost on every masked position.

## Summary

MAE pretrains a Vision Transformer by randomly masking a large fraction of patches—75% by default—encoding only the visible subset, and reconstructing pixels with a lightweight decoder that is discarded at recognition time. On ImageNet-1K, a default ViT-L model reaches 84.9% fine-tuning and 73.5% linear-probing accuracy, compared with 82.5% for a from-scratch ViT-L in the paper’s comparison, and a ViT-Huge model reaches 87.8% fine-tuning accuracy among the ImageNet-1K-only methods compared. High masking ratios work well for fine-tuning, linear probing peaks at 75% (54.6% at 10% masking versus 73.5% at 75%), and an encoder without mask tokens is both more accurate and computationally cheaper.

## References

He, K., Chen, X., Xie, S., Li, Y., Dollár, P., & Girshick, R. (2022). Masked autoencoders are scalable vision learners. In <i>Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)</i>.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-12-07 · CVPR, 2022</i>

这篇论文表明，掩码自编码器可以通过隐藏大部分图像、只对可见图块编码并重建缺失像素，来预训练大型视觉 Transformer，而且这一简单做法可以扩展到较强的 ImageNet 精度。

## 背景

在语言领域，通过隐藏部分输入并让模型补全，来预训练模型，已经变得常见。同样的想法在视觉中也很有吸引力：图像可以被切成图块，其中一些图块被去掉，网络被训练去重建缺失的部分。如果模型必须从留下的部分推断物体、纹理和空间关系，得到的表示日后就可能对识别有用。

<b>视觉 Transformer</b>（ViT）是这一任务的自然架构，因为它本来就把图像当作图块序列来处理。困难既是概念上的，也是实际上的。图像有很高的冗余，如果模型还能看到大部分图块，它也许只需做局部插值就能重建缺失部分，而学不到多少东西。若让大型编码器处理每一个图块，包括为缺失图块准备的占位符，计算代价也会很高。作者的问题是：精心设计的掩码自编码器，能否把这些障碍变成优势——用非常高的掩码比例让任务变难，并在编码器中跳过被掩码的图块，从而提高训练效率。

## 问题

视觉中的自监督预训练，常常依赖对比学习（比较同一图像的不同视图），或其他并不重建像素的前置任务。掩码重建更简单，但当时并不清楚它能否在 ImageNet 上扩展到大型 ViT 模型，也不清楚高掩码比例是会有帮助还是会有损害。问题是要设计一种既高效、又能得到强可迁移表示的掩码自编码器，并测量掩码比例、解码器大小和相关选择如何影响预训练之后的识别表现。

## 方法

这种方法称为 MAE，有两个核心设计。第一，架构是<b>非对称</b>的。预训练时，很大一部分随机图块——默认是 75%——被掩码去掉。编码器只看到可见图块，不包含掩码标记。掩码标记在编码器之后才引入，一个轻量解码器随后处理全部已编码图块加上掩码标记，并在像素空间重建图像。损失函数是仅在被掩码图块上计算的均方误差。预训练结束后，解码器被丢弃，编码器被用于未破坏的图像，也就是完整的图块集合，以完成识别任务。

![图 1. MAE 架构（He 等，2022，图 1）。预训练时，很大一部分随机图块（例如 75%）被掩码去掉。编码器只作用于可见图块；掩码标记在编码器之后引入，由轻量解码器重建像素。识别时解码器被丢弃。](/img/readApaper-51/mae_fig1.png)

<i>图 1. MAE 架构（He 等，2022，图 1）。预训练时，很大一部分随机图块（例如 75%）被掩码去掉。编码器只作用于可见图块；掩码标记在编码器之后引入，由轻量解码器重建像素。识别时解码器被丢弃。</i>

第二，高掩码比例被视为一种特性，而不是一种折中。在 75% 的默认设置下，只有四分之一的图块经过编码器，因此预训练比那种为每个缺失图块编码占位符的对称设计便宜得多。作者报告，这使训练加速 3 倍或更多，同时也提高了精度。数据增强可以很少：在他们的消融中，默认是随机改变大小后裁剪，并不强依赖颜色抖动。

## 实验

主要的识别基准是 ImageNet-1K。模型先作为掩码自编码器预训练，然后进行微调，或用线性探测评估，即在冻结的编码器上训练一个线性分类器。默认消融配置是 ViT-L/16，解码器深度为 8、宽度为 512，重建目标为未归一化像素，随机掩码比例为 75%，预训练 800 个周期。在这些默认设置下，微调达到 84.9%，线性探测达到 73.5%。MAE 之后的微调使用 50 个周期，而从零训练的基线则为 200 个周期。

消融实验改变了解码器深度和宽度、编码器中是否包含掩码标记、重建目标、增强方式，以及掩码策略（随机、块状或网格）。另一条曲线同时改变微调和线性探测中的掩码比例。扩展实验包括 ViT-Huge 模型。论文还展示了定性重建，包括 80% 掩码比例（196 个图块中仅 39 个可见）的例子，以及对掩码比例高于训练所用 75% 的图像的重建。

## 结果

即使大部分图像被隐藏，重建在语义上仍然合理。在示意例子中，80% 的掩码仍能得到连贯的物体；不过损失只在被掩码图块上计算，因此可见图块并不被强制看起来完美。当一个在 75% 掩码下训练的模型面对更高的掩码比例，包括 85% 和 95% 时，预测仍然合理，即使它们与原图不同，作者把这看作模型在泛化、而不仅仅是复制局部纹理的迹象。

![图 2. ImageNet 验证图像上的示例结果（He 等，2022，图 2）。每组三张图为：被掩码的图像（左）、MAE 重建（中）和真实图像（右）。这些例子的掩码比例是 80%，196 个图块中只留下 39 个；默认方法使用 75% 掩码。](/img/readApaper-51/mae_fig2.png)

<i>图 2. ImageNet 验证图像上的示例结果（He 等，2022，图 2）。每组三张图为：被掩码的图像（左）、MAE 重建（中）和真实图像（右）。这些例子的掩码比例是 80%，196 个图块中只留下 39 个；默认方法使用 75% 掩码。</i>

在 ImageNet-1K 上，默认的 ViT-L 配置达到 84.9% 的微调精度和 73.5% 的线性探测精度。论文中的一个比较显示，从零训练的 ViT-L 在更长的 200 周期微调安排下达到 82.5%，而经过 MAE 预训练并微调 50 个周期后为 84.9%。ViT-Huge 模型的 ImageNet-1K 微调精度达到 87.8%，论文把它报告为所比较的、仅在 ImageNet-1K 上训练的方法中最好的结果。

![图 4. 用在 75% 掩码下预训练、但在更高掩码比例下应用的 MAE，对 ImageNet 验证图像的重建（He 等，2022，图 4）。在 85% 和 95% 掩码下，预测仍然合理，即使它们与原图不同。](/img/readApaper-51/mae_fig4.png)

<i>图 4. 用在 75% 掩码下预训练、但在更高掩码比例下应用的 MAE，对 ImageNet 验证图像的重建（He 等，2022，图 4）。在 85% 和 95% 掩码下，预测仍然合理，即使它们与原图不同。</i>

掩码比例曲线显示，高比例对微调效果很好：曲线保持在较窄的高位区间，10% 掩码时为 83.2%，20% 和 30% 时为 83.4%，90% 时为 83.0%。线性探测更为敏感，并且更偏好较高比例：从 10% 掩码时的 54.6% 上升到 75% 时的峰值 73.5%，再在 90% 时降到 66.1%。在默认表格中，75% 的随机采样优于块状或网格掩码。

![图 5. 掩码比例（He 等，2022，图 5）。75% 的高掩码比例对微调（上）和线性探测（下）都效果很好。线性探测从 10% 掩码时的 54.6% 上升到 75% 时的 73.5%。纵轴为 ImageNet-1K 验证精度（%）。](/img/readApaper-51/mae_fig5.png)

<i>图 5. 掩码比例（He 等，2022，图 5）。75% 的高掩码比例对微调（上）和线性探测（下）都效果很好。线性探测从 10% 掩码时的 54.6% 上升到 75% 时的 73.5%。纵轴为 ImageNet-1K 验证精度（%）。</i>

解码器可以比编码器更窄，仍然有效；宽度 512 对应默认的 84.9% / 73.5%。非常浅的解码器对微调已经足够，而较深的解码器有助于线性探测（深度 8 为 73.5%，深度 1 为 65.5%）。不含掩码标记的编码器既更准确也更便宜（84.9% / 73.5%，1× FLOPs），而包含掩码标记的编码器是 84.2% / 59.6%，3.3× FLOPs。像素重建目标是有效的；归一化像素的变体可以略高（85.4% / 73.9%）。

![表 1. 在 ImageNet-1K 上用 ViT-L/16 进行的 MAE 消融实验（He 等，2022，表 1）。默认设置（解码器深度 8、宽度 512、75% 随机掩码、预训练 800 个周期）达到 84.9% 微调和 73.5% 线性探测精度，并在表中以灰色标出。](/img/readApaper-51/mae_table1.png)

<i>表 1. 在 ImageNet-1K 上用 ViT-L/16 进行的 MAE 消融实验（He 等，2022，表 1）。默认设置（解码器深度 8、宽度 512、75% 随机掩码、预训练 800 个周期）达到 84.9% 微调和 73.5% 线性探测精度，并在表中以灰色标出。</i>

## 分析

MAE 的贡献，在于把一项困难的前置任务，与一个在预训练时从不看被丢弃图块的编码器结合在一起。高掩码比例使重建难到足以有用，同时也使编码器变得便宜。微调在很宽的高掩码比例范围内仍然很强，而线性探测在接近 75% 时达到峰值，这说明冻结编码器所使用的表示，比微调整个模型之后得到的表示，对前置任务的设计更敏感。

在这组实验中，论文最强的 ImageNet-1K 微调数字是 ViT-Huge 的 87.8%。这一点应当按作者的表述来理解：在他们的比较中，这是仅在 ImageNet-1K 上训练的方法里的领先结果，而不是关于后来所有系统或所有更大数据集的断言。对消融实验来说，更有用的参照是默认 ViT-L 的 84.9%，因为解码器深度、宽度、掩码标记和采样方式，都是在这一设置下变化的。

在识别时丢弃解码器，也是这一实用设计的一部分。解码器的存在是为了给编码器一个重建目标；预训练结束后，识别使用完整、未被掩码的图像，并不需要掩码标记。正是这种不对称，使该方法可以把容量花在大型编码器上，而不必在每一个被掩码的位置上支付同样的代价。

## 总结

MAE 通过随机掩码很大一部分图块（默认 75%）、只对可见子集编码，并用一个在识别时被丢弃的轻量解码器重建像素，来预训练视觉 Transformer。在 ImageNet-1K 上，默认的 ViT-L 达到 84.9% 微调和 73.5% 线性探测精度，而论文比较中从零训练的 ViT-L 为 82.5%；ViT-Huge 在所比较的仅使用 ImageNet-1K 的方法中达到 87.8% 的微调精度。高掩码比例对微调效果很好，线性探测在 75% 时达到峰值（10% 掩码时为 54.6%，75% 时为 73.5%），而且不含掩码标记的编码器既更准确，计算上也更便宜。

## 参考文献

He, K., Chen, X., Xie, S., Li, Y., Dollár, P., & Girshick, R. (2022). Masked autoencoders are scalable vision learners. In <i>Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)</i>.
