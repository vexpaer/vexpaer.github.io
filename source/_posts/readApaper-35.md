---
title: "readApaper#35 Flexible 3D multimodal organoid interface reveals functional subnetworks and coordinated circuit activity in cortical organoids"
title_zh: "readApaper#35 Flexible 3D multimodal organoid interface reveals functional subnetworks and coordinated circuit activity in cortical organoids"
date: 2026-11-21 22:00:00
tags:
  - readApaper
  - neuroengineering
  - organoid-intelligence
  - bioelectronics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 21 November 2026 · bioRxiv, posted 4 October 2026</i>

This paper introduces INFORM, a flexible electrode interface that wraps around a living human cortical organoid so that the same intact tissue can be recorded, imaged, electrically stimulated, and pharmacologically perturbed over many months. The authors use that combination to follow how activity becomes coordinated when two organoids fuse, and to show that stimulation can recruit spatially distinct functional subnetworks, including ones whose silencing depends on inhibitory GABA signaling.

## Background

A <b>cortical organoid</b> is a three-dimensional piece of neural tissue grown in a dish from <b>human induced pluripotent stem cells</b> (hiPSCs): adult cells that have been reprogrammed to an embryonic-like state and then guided to become cortex-like. Over months in culture, these organoids can produce excitatory and inhibitory neurons, supporting cells called glia, and coordinated bursts of activity. That is why they are used as models of human cortical development and of disorders in which those networks go awry (Trujillo et al., 2019; Chiaradia & Lancaster, 2020).

Cortical circuits depend on a balance between two kinds of influence. <b>Excitatory</b> neurons, often using the transmitter glutamate, make it more likely that other cells will fire. <b>Inhibitory</b> neurons, often using <b>GABA</b> (γ-aminobutyric acid), make firing less likely. This push-and-pull is called <b>excitatory/inhibitory (E/I) balance</b>. It keeps activity stable enough to process information; imbalance is implicated in epilepsy, autism spectrum disorder, and several other conditions.

Studying that balance in a living organoid is harder than it first sounds. An organoid is a soft, curved, growing three-dimensional ball, often about a millimeter across, and useful experiments can last many months. A conventional <b>microelectrode array</b> (MEA) is a flat grid of electrodes on the floor of a dish. Placing a 3D organoid on that grid tends to flatten it, and the electrodes see only the side that sits on the dish.

Even a better electrical recording is only one kind of evidence. An <b>action potential</b>, or <b>spike</b>, is a brief electrical pulse from one neuron; it is fast and local. A <b>local field potential</b> (LFP) is a slower voltage summed from many nearby cells. <b>Two-photon calcium imaging</b> takes a different route: neurons are labeled with a sensor such as <b>GCaMP</b>, which lights up when calcium enters the cell after it fires. A two-photon microscope can then show <i>where</i> those cells are in the tissue. The spatial picture is rich, but the signal is slower than a spike. <b>Electrical microstimulation</b> sends small current pulses through chosen electrodes to activate a local region. A <b>chemical intervention</b> adds a drug, for example to block a receptor, and asks whether a response depends on that receptor.

Cell-type identity is often obtained in a different way again, by immunostaining or single-cell RNA sequencing. Those methods can be precise, but they usually require the tissue to be fixed, so they cannot follow the same living network week after week. The practical problem is how to keep an intact, growing organoid healthy while combining these views over a long time.

## Problem

The authors argue that no existing technology can simultaneously resolve neuronal identity, spatial organization, and dynamic network activity inside an intact organoid. Recent arrays that bend or wrap around 3D tissue improve mechanical contact, but greater flexibility or electrode density alone still does not give concurrent optical, electrical, stimulatory, and pharmacological access to the same organoid.

Without that combination, it is difficult to ask a mechanistic question about E/I circuits in living 3D tissue: not only whether cells of the right types are present, but whether stimulation can recruit distinct activity patterns, and whether a silencing effect actually depends on inhibitory synapses.

## Method

The device is called <b>INFORM</b>, for INtegrated Flexible Organoid Recording Multimodal neural interface. Two thin arrays wrap the organoid from above and below. Each has 64 electrode channels, for 128 channels in total. The recording sites are 12 µm-diameter gold electrodes, connected by 2 µm-wide gold wires and encapsulated in a transparent polymer, parylene C, only 4 µm thick. Eight flexible serpentine arms, each carrying eight wires, reach a central 1.6 mm-diameter electrode field, a size chosen to match the average organoid diameter in this study.

The authors used mechanical simulations and tests with weight-matched surrogates to choose that geometry. Fewer arms, a thinner film, and narrower arms increased how much the array could deflect under an organoid’s weight. They settled on eight arms, 4 µm thickness, and a 2 µm margin from the outermost wire to the edge of each arm. The intended effect is <b>conformal</b> contact: the film follows the curved surface closely enough for electrodes to couple to the tissue, while gaps between the arms leave paths for oxygen and culture medium. The organoid remains suspended in a PDMS well with an open top for microscopy, side pads for electronics, and fluidic ports for media or drugs.

To make the tiny electrodes useful for both recording and stimulation, the authors deposited <b>platinum nanoparticles</b> (PtNP) on the gold. Impedance fell from 1–2 MΩ to about 50 kΩ, with a mean of 46.6 kΩ at 1 kHz. Coated electrodes could inject current safely up to 125 µA, compared with 5 µA for bare gold.

Four modalities are then applied to the same intact organoid: electrophysiology, two-photon calcium imaging, targeted electrical microstimulation, and chemical intervention.

![Figure 1. How INFORM is built and how it wraps an organoid. Panel (a) shows organoids grown from human stem cells, then placed between a bottom array and a top array (ii–iii) so electrodes cover both hemispheres. Panel (b) is the culture well, open at the top for a microscope and fitted with ports for media. Panels (c–d) compare how much arrays with 8, 16, or 32 arms deflect; fewer arms bend more, and the experiments (blue) follow the simulations (red). Panel (e) is a photograph of the assembled well and the serpentine gold wires at its center. Panel (f) shows how easily the arms stretch. Panels (g–j) show tissue growing onto the array: neurites along the arms, a two-photon view of an organoid between the two arrays, and cleared tissue in which axons lie close to an electrode. From Wilson et al., 2026, Figure 1.](/img/readApaper-35/wilson2026_fig1.png)

<i>Figure 1. How INFORM is built and how it wraps an organoid. Panel (a) shows organoids grown from human stem cells, then placed between a bottom array and a top array (ii–iii) so electrodes cover both hemispheres. Panel (b) is the culture well, open at the top for a microscope and fitted with ports for media. Panels (c–d) compare how much arrays with 8, 16, or 32 arms deflect; fewer arms bend more, and the experiments (blue) follow the simulations (red). Panel (e) is a photograph of the assembled well and the serpentine gold wires at its center. Panel (f) shows how easily the arms stretch. Panels (g–j) show tissue growing onto the array: neurites along the arms, a two-photon view of an organoid between the two arrays, and cleared tissue in which axons lie close to an electrode. From Wilson et al., 2026, Figure 1.</i>

## Experiments

The tissue was dorsal cortical organoids derived from hiPSCs. At 5–7 months of age, organoids were plated between two INFORM arrays and left for two weeks to attach, after which neurites were seen branching along the arms (n = 10 organoids). Weekly recording sessions then continued for one year without removing or replacing the organoid.

Cellular composition was checked separately. Single-cell RNA sequencing of 120-day organoids, together with later immunostaining, showed a dorsal forebrain identity and both excitatory and inhibitory neurons, along with progenitors and glia. For the functional experiments, organoids were transduced with GCaMP8s under a synapsin promoter, so neuronal calcium signals could be imaged at the same time as electrical recordings.

To watch connections form between tissues, the authors co-plated pairs of 5- to 7-month-old organoids and allowed them to fuse into <b>assembloids</b> (n = 6 organoids on 3 interfaces). Intra- and inter-organoid activity was followed with weekly two-photon calcium imaging.

For perturbation, bipolar microstimulation was delivered through two of the 128 electrodes: one cathode and one anode, each receiving a biphasic pulse of opposite polarity (100 µs per phase, 100 Hz). A parameter search across amplitudes of 20–100 µA and pulse counts of 1–20 (n = 3 organoid interfaces) identified 100 µA and 10 pulses as the combination that elicited the strongest calcium responses, and those settings were used thereafter. To test whether stimulus-evoked silencing depended on GABAergic synapses, the authors added <b>bicuculline</b> (10 µM), a drug that blocks GABA-A receptors, and compared responses before and after the drug.

## Results

### Long-term recordings and optical–electrical alignment

Physical integration was visible in more than the first two weeks. Two-photon images and CLARI-O-cleared organoids sampled three months after plating showed cellular processes embedding and surrounding the arrays; staining for neurofilament heavy chain identified those processes as axons.

Electrical access remained usable over the year. At the start of each weekly session the authors measured electrode impedance. The share of working channels, defined as impedance below 2 MΩ, stayed above 90% across 52 weeks in vitro (n = 6 interfaces). That figure is a measure of electrical yield, not yet a claim about spikes.

When calcium imaging and electrophysiology were run together, population bursts lined up across the two signals: calcium transients rose at the same times as spikes and LFP peaks (Figure 3b). Burst rate itself changed with time after plating. It was undetectable at four weeks, when only individual spikes were seen, and reached 0.33–1 Hz one year after plating (n = 3 organoids). Because the organoids were already 5–7 months old when plated, synchronized activity was expected to be present; the authors interpret the early rise mainly as the tissue anchoring to the array, after which the same interface could follow changing network dynamics over the year.

Figure 3d shows sorted spike waveforms on 12 channels out to 371 days after plating. That 371-day span is the duration illustrated for those sorted units across weekly sessions, not a continuous, around-the-clock recording. Mean firing rate generally increased and peaked around 50–60 weeks after plating (n = 3 organoids); the main-figure panel reports the mean across 64 channels over 52 weeks (Figure 3e). The percentage of electrodes detecting, on average, at least 3 spikes per second stayed above 90% across these sessions (Figure 3f).

![Figure 3. Simultaneous calcium imaging and electrical recording, followed over many months. Panel (a) is a two-photon view of an organoid (green) sitting in the array (magenta). In (b), look at the red arrows: calcium traces (top), spike rasters (middle), and LFPs (bottom) rise together during population bursts; the callout at right zooms in on one burst. Panel (c) maps spike waveforms onto the organoid. Panel (d) is the long-timescale record: sorted spikes on 12 channels from day 14 to day 371 after plating. Panels (e) and (f) summarize 52 weeks of weekly sessions, with mean firing rate in (e) and the share of electrodes detecting at least 3 spikes per second in (f). From Wilson et al., 2026, Figure 3.](/img/readApaper-35/wilson2026_fig3.png)

<i>Figure 3. Simultaneous calcium imaging and electrical recording, followed over many months. Panel (a) is a two-photon view of an organoid (green) sitting in the array (magenta). In (b), look at the red arrows: calcium traces (top), spike rasters (middle), and LFPs (bottom) rise together during population bursts; the callout at right zooms in on one burst. Panel (c) maps spike waveforms onto the organoid. Panel (d) is the long-timescale record: sorted spikes on 12 channels from day 14 to day 371 after plating. Panels (e) and (f) summarize 52 weeks of weekly sessions, with mean firing rate in (e) and the share of electrodes detecting at least 3 spikes per second in (f). From Wilson et al., 2026, Figure 3.</i>

### Synchrony after two organoids fuse

In the assembloid experiments, the two organoids attached and grew a bridge of cells between them. At two weeks after plating, each organoid already showed internally synchronized bursts, but activity in one organoid was uncorrelated with activity in the other. By week three, a subset of bursts had become correlated across the pair. By week four, activity in both organoids was almost entirely synchronized (Figure 4c,d). An inter-organoid synchrony index rose over eleven weeks until the two tissues fired in near-perfect unison (Figure 4e). In other pairs, synchronization could appear even before the two-week mark. In one example burst, cells on one side led those on the other by an average of 0.82 seconds (Figure 4g). These observations describe the emergence of functional connectivity after fusion.

![Figure 4. Two organoids become an assembloid and their activity aligns. Panels (a) and (b) show the fused pair in brightfield and in a two-photon view, 11 weeks after plating. In (c), each row is one cell’s calcium activity; compare day 14, when the two organoids burst on different schedules, with day 28, when the vertical burst bands line up. Panel (d) makes the same point as correlation matrices: the off-diagonal blocks, which compare cells in organoid 1 with cells in organoid 2, go from pale to red. Panel (e) tracks an inter-organoid synchrony index over 11 weeks. Panel (f) shows cells at the bridge; (g) colors cells by when they peak in one burst, with earlier cells in purple and later cells in yellow. From Wilson et al., 2026, Figure 4.](/img/readApaper-35/wilson2026_fig4.png)

<i>Figure 4. Two organoids become an assembloid and their activity aligns. Panels (a) and (b) show the fused pair in brightfield and in a two-photon view, 11 weeks after plating. In (c), each row is one cell’s calcium activity; compare day 14, when the two organoids burst on different schedules, with day 28, when the vertical burst bands line up. Panel (d) makes the same point as correlation matrices: the off-diagonal blocks, which compare cells in organoid 1 with cells in organoid 2, go from pale to red. Panel (e) tracks an inter-organoid synchrony index over 11 weeks. Panel (f) shows cells at the bridge; (g) colors cells by when they peak in one burst, with earlier cells in purple and later cells in yellow. From Wilson et al., 2026, Figure 4.</i>

### Targeted stimulation recruits local subnetworks

Bipolar microstimulation increased calcium burst frequency and spiking. The increase in spike-band power (0.5–4 kHz) was larger on electrodes near the stimulating pair, consistent with a focal effect. When the authors chose different stimulating pairs, each pairing activated a different spatial pattern, sometimes visible on both the top and bottom arrays (Figure 5d). Calcium imaging and electrical maps agreed at cellular scale: cells that showed stimulus-locked calcium transients sat next to electrodes with elevated spike-band power, and inactive cells did not (Figure 5e–g).

![Figure 5. Local electrical stimulation and the spatial patterns it recruits. Panel (a) shows the bipolar pulse: one electrode is driven cathodic-first, the other anodic-first. Panel (b) compares calcium responses across amplitudes and pulse counts; 100 µA and 10 pulses gave the strongest responses and were used later. In (c), orange lines mark stimuli, and both the calcium trace and the spike raster increase during the train. The key comparison is (d): four different stimulating pairs, marked by black and red arrowheads, each produce a different yellow hotspot of spike-band power. Panels (e–g) zoom to single cells. Cells A–C (white) fire calcium transients and sit by electrodes e1–e3, which show a power increase; cells D–E (yellow) stay quiet, and nearby electrodes e4–e5 do not rise. From Wilson et al., 2026, Figure 5.](/img/readApaper-35/wilson2026_fig5.png)

<i>Figure 5. Local electrical stimulation and the spatial patterns it recruits. Panel (a) shows the bipolar pulse: one electrode is driven cathodic-first, the other anodic-first. Panel (b) compares calcium responses across amplitudes and pulse counts; 100 µA and 10 pulses gave the strongest responses and were used later. In (c), orange lines mark stimuli, and both the calcium trace and the spike raster increase during the train. The key comparison is (d): four different stimulating pairs, marked by black and red arrowheads, each produce a different yellow hotspot of spike-band power. Panels (e–g) zoom to single cells. Cells A–C (white) fire calcium transients and sit by electrodes e1–e3, which show a power increase; cells D–E (yellow) stay quiet, and nearby electrodes e4–e5 do not rise. From Wilson et al., 2026, Figure 5.</i>

### Stimulus-evoked suppression and a GABA-A blocker

At cellular resolution, stimulation split the imaged neurons into two groups that had looked alike at baseline. <b>Enhanced</b> cells produced calcium transients locked to the stimulation. <b>Suppressed</b> cells went quiet during the same train (Figure 6a,b). These names describe how a cell responded; they do not identify it as excitatory or inhibitory. A suppressed cell, for example, may be an excitatory neuron receiving stronger inhibitory input.

The organoids did contain the machinery for inhibition. In 180-day-old organoids, cells that were positive for both the neuronal marker NeuN and the inhibitory marker GAD65/67 made up 54.4 ± 20.9% of NeuN+ neurons (n = 6 organoids from two cell lines). Transcriptomic and staining data also showed GABA-A receptor subunits in both excitatory and inhibitory neurons.

The mechanistic test was the bicuculline experiment. Before the drug, stimulation left 60% of active cells in the field of view suppressed and 40% enhanced. After bicuculline, the suppressed fraction fell to 9.2% and the enhanced fraction rose to 90.8%, a net shift of 50.8% of cells from suppression to enhancement (Figure 6h–k). That average was computed from 120 microstimulations in two independent sessions on a representative organoid interface, including sessions on days 562 and 632. A minority of cells, the remaining 9.2%, stayed suppressed after the drug. Enhanced and suppressed cells were distributed fairly uniformly across the imaged plane, which the authors take as evidence that many of these responses were relayed through the network rather than produced only by direct activation next to the stimulating electrodes.

![Figure 6. Two functional responses to stimulation, and what happens after GABA-A receptors are blocked. In (a–b), blue-outlined cells keep firing during the orange stimulus train (enhanced); red-outlined cells fall silent (suppressed). Panels (c–f) document inhibitory cells and GABA-A receptors, including a 54.4% inhibitory share among NeuN+ neurons in (d). Panel (g) is a schematic: stimulation can send mixed excitatory and inhibitory input to an imaged cell; bicuculline removes the GABA-A component. The traces in (h) are the direct comparison—suppressed cells S1–S3 are quiet in the red box, then respond after the drug in the blue box. Panels (i–k) quantify the field of view: many red (suppressed) cells become blue (enhanced), and the bar graph in (k) shows the 60% to 9.2% drop in the suppressed fraction. From Wilson et al., 2026, Figure 6.](/img/readApaper-35/wilson2026_fig6.png)

<i>Figure 6. Two functional responses to stimulation, and what happens after GABA-A receptors are blocked. In (a–b), blue-outlined cells keep firing during the orange stimulus train (enhanced); red-outlined cells fall silent (suppressed). Panels (c–f) document inhibitory cells and GABA-A receptors, including a 54.4% inhibitory share among NeuN+ neurons in (d). Panel (g) is a schematic: stimulation can send mixed excitatory and inhibitory input to an imaged cell; bicuculline removes the GABA-A component. The traces in (h) are the direct comparison—suppressed cells S1–S3 are quiet in the red box, then respond after the drug in the blue box. Panels (i–k) quantify the field of view: many red (suppressed) cells become blue (enhanced), and the bar graph in (k) shows the 60% to 9.2% drop in the suppressed fraction. From Wilson et al., 2026, Figure 6.</i>

## Analysis

The results are easiest to read if four claims are kept apart. The first is how long the interface can sit on a living organoid and still record. Weekly sessions over a year, waveforms followed on the same channels out to 371 days after plating, and more than 90% of channels still detecting spikes, describe chronic coupling and recording yield. Those numbers do not, by themselves, show learning, training, or computation.

The second is mechanical and optical access. The wrap-around geometry, the thin transparent traces, and the open-top well are what make it possible to image and record the same intact organoid without flattening it onto a flat array.

The third is perturbation. Bipolar stimulation and bicuculline were applied to the same tissue that was being imaged and recorded. That is what turns a correlation into a test of mechanism.

The fourth is what counts as evidence for a <b>functional subnetwork</b> here. One line of evidence is spatial: different stimulating electrode pairs recruited different activity patterns, sometimes on both hemispheres. Another is functional: stimulation revealed enhanced and suppressed response classes that were not obvious at rest. The bicuculline result supports a more specific conclusion, namely that a large fraction of the observed, stimulus-evoked suppression is mediated by GABA-A receptors. The quantified 50.8% shift comes from two sessions on one representative interface. The labels “enhanced” and “suppressed” remain descriptions of the response, not assignments of cell type. The assembloid recordings, finally, show that functional connectivity can appear after two organoids fuse; they measure rising synchrony, not a trained skill.

Taken together, the platform’s value is that these four kinds of evidence can be gathered from the same intact human organoid.

## Summary

INFORM is a 128-channel, wrap-around interface that can remain on a living human cortical organoid for a year of weekly recordings, while also allowing two-photon imaging, local electrical stimulation, and drug delivery. With that combination, the authors followed the emergence of synchrony in fusing organoid pairs, recruited spatially distinct activity patterns by choosing different stimulating electrodes, and showed that much of the stimulus-evoked silencing they observed depends on GABAergic inhibition.

## References

- Wilson, M. N., Kharitonova, E. K., Yeh, J., Lee, J., Hemaidan, S., Essig, S., Shi, M., Crain, C. W., Ramezani, M., Sun, F., Zhou, T., Surucu, I., Mortazavi, F., Cubukcu, E., Thunemann, M., Zeldich, E., & Kuzum, D. (2026). <i>Flexible 3D multimodal organoid interface reveals functional subnetworks and coordinated circuit activity in cortical organoids.</i> bioRxiv. [doi.org/10.64898/2026.10.02.756317](https://doi.org/10.64898/2026.10.02.756317)
- Trujillo, C. A., Gao, R., Negraes, P. D., et al. (2019). <i>Complex oscillatory waves emerging from cortical organoids model early human brain network development.</i> Cell Stem Cell, 25(4), 558–569. [doi.org/10.1016/j.stem.2019.08.002](https://doi.org/10.1016/j.stem.2019.08.002)
- Chiaradia, I., & Lancaster, M. A. (2020). <i>Brain organoids for the study of human neurobiology at the interface of in vitro and in vivo.</i> Nature Neuroscience, 23, 1496–1508. [doi.org/10.1038/s41593-020-00730-3](https://doi.org/10.1038/s41593-020-00730-3)
- Yang, X., Forró, C., Li, T., et al. (2024). <i>Kirigami electronics for long-term electrophysiological recording of human neural organoids and assembloids.</i> Nature Biotechnology, 42, 1836–1843. [doi.org/10.1038/s41587-023-02081-3](https://doi.org/10.1038/s41587-023-02081-3)

Figures 1 and 3–6 are from Wilson et al., 2026, bioRxiv preprint, DOI [10.64898/2026.10.02.756317](https://doi.org/10.64898/2026.10.02.756317).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-21 · bioRxiv, posted 4 October 2026</i>

这篇论文介绍了 INFORM：一种可以包裹活体人源皮层类器官的柔性电极接口，让同一块完整组织在数月时间里既能被电记录和光学成像，也能接受电刺激和药物干预。作者用这套组合跟踪两块类器官融合后活动如何逐渐对齐，并表明刺激可以招募空间上彼此分开的功能亚网络，其中包括依赖抑制性 GABA 信号才会被压静的那一类。

## 背景

<b>皮层类器官</b>是在培养皿里长出来的三维神经组织。它来自<b>人诱导多能干细胞</b>（hiPSC）：先把成体细胞重编程到类似胚胎的状态，再诱导它们走向皮层方向。培养数月后，类器官里可以出现兴奋性和抑制性神经元、胶质细胞，以及成群的同步放电。因此，它常被用来研究人皮层发育，以及这些网络出问题时的疾病机制（Trujillo et al., 2019; Chiaradia & Lancaster, 2020）。

皮层回路依赖两种作用之间的平衡。<b>兴奋性</b>神经元多半使用谷氨酸，会提高其他细胞放电的可能性；<b>抑制性</b>神经元多半使用 <b>GABA</b>（γ-氨基丁酸），会降低这种可能性。这种一推一拉叫做<b>兴奋/抑制（E/I）平衡</b>。它让网络既足够活跃、又足够稳定；失衡与癫痫、自闭谱系等疾病有关。

要在活的类器官里观察这种平衡，并不容易。类器官是柔软、弯曲、还在生长的三维球体，直径常常在一毫米左右，而有意义的实验往往要持续许多个月。常规的<b>微电极阵列</b>（MEA）是培养皿底部一块平坦的电极网格。把三维类器官放上去，组织容易被压扁，电极也只能“看到”贴在皿底的那一面。

即便电记录本身做得很好，也只是一类证据。<b>动作电位</b>，也就是<b>锋电位（spike）</b>，是单个神经元发出的短暂电脉冲，又快又局部。<b>局部场电位</b>（LFP）则是附近许多细胞叠加出来的较慢电压。<b>双光子钙成像</b>走的是另一条路：给神经元标记 <b>GCaMP</b> 这类钙指示剂，细胞放电后钙离子进入，指示剂就会发光；双光子显微镜可以标出这些细胞在组织里的位置。空间信息很丰富，但信号比锋电位慢。<b>电微刺激</b>是通过选定的电极送入很小的电流脉冲，激活局部区域。<b>化学干预</b>则是加入药物，例如阻断某一种受体，从而询问某种反应是否依赖于该受体。

细胞身份通常还要靠免疫染色或单细胞 RNA 测序来确认。这些方法可以很精确，但往往需要把组织固定，也就无法一周又一周地跟踪同一块活的网络。真正的困难在于：怎样让完整、仍在生长的类器官保持健康，同时在很长时间里把这些观察合在一起。

## 问题

作者指出，现有技术还无法在完整类器官内部同时解析神经元身份、空间组织和动态网络活动。近年来已有可以弯曲或包裹三维组织的电极，机械贴合更好了，但只提高柔顺性或电极密度，仍不能在同一块类器官上同时做光学成像、电记录、电刺激和药物干预。

缺少这种组合，就很难对活体三维组织里的 E/I 回路提出机制性问题：不仅要问“有没有正确类型的细胞”，还要问刺激能否招募出不同的活动模式，以及某种被压静的现象是否真的依赖于抑制性突触。

## 方法

这套装置叫做 <b>INFORM</b>，全称是 INtegrated Flexible Organoid Recording Multimodal neural interface，也就是“集成式柔性类器官多模态记录接口”。两片薄膜阵列从上下两侧包裹类器官，每片 64 个通道，一共 128 个通道。记录位点是直径 12 µm 的金电极，由 2 µm 宽的金导线连接，再封装在透明的聚对二甲苯 C（parylene C）里，整层厚度只有 4 µm。八条柔性蛇形臂各带 8 根导线，通向中央直径 1.6 mm 的电极区；这个尺寸是按本研究中类器官的平均直径来选的。

作者用力学仿真，并用质量相当的替代物做了实验，再确定几何参数。臂的数量更少、薄膜更薄、臂更窄时，阵列在类器官重量下弯得更多。他们最终选用 8 条臂、4 µm 厚度，以及最外侧导线到臂边缘 2 µm 的边距。这样设计是为了实现<b>贴合（conformal）</b>接触：薄膜能顺着弯曲表面贴紧，让电极与组织耦合，同时臂与臂之间仍留出氧气和培养液通过的路径。类器官悬在 PDMS 培养井中，顶部开口便于显微镜观察，侧面有电极焊盘，并设有输送培养液或药物的流体端口。

为了让如此细小的电极既适合记录也适合刺激，作者在金电极上沉积了<b>铂纳米颗粒</b>（PtNP）。阻抗从 1–2 MΩ 降到大约 50 kΩ，在 1 kHz 下平均为 46.6 kΩ。镀铂后的电极可以安全注入高达 125 µA 的电流，而裸金电极只有 5 µA。

随后，四种模态可以作用在同一块完整类器官上：电生理、双光子钙成像、定向电微刺激，以及化学干预。

![图 1. INFORM 如何制作、又如何包裹类器官。(a) 从人干细胞生成类器官，再把它放在下阵列上，并盖上上阵列（ii–iii），使电极覆盖两个半球。(b) 是培养井：顶部开口给显微镜，并留有培养液端口。(c–d) 比较 8、16、32 臂阵列的弯曲程度；臂越少弯得越多，实验（蓝）与仿真（红）一致。(e) 是组装好的培养井照片，以及中央的蛇形金导线。(f) 显示臂很容易被拉伸。(g–j) 则是组织长到阵列上的证据：突起沿着臂延伸，双光子下看见类器官夹在两片阵列之间，透明化组织里轴突紧挨着电极。取自 Wilson 等，2026，Figure 1。](/img/readApaper-35/wilson2026_fig1.png)

<i>图 1. INFORM 如何制作、又如何包裹类器官。(a) 从人干细胞生成类器官，再把它放在下阵列上，并盖上上阵列（ii–iii），使电极覆盖两个半球。(b) 是培养井：顶部开口给显微镜，并留有培养液端口。(c–d) 比较 8、16、32 臂阵列的弯曲程度；臂越少弯得越多，实验（蓝）与仿真（红）一致。(e) 是组装好的培养井照片，以及中央的蛇形金导线。(f) 显示臂很容易被拉伸。(g–j) 则是组织长到阵列上的证据：突起沿着臂延伸，双光子下看见类器官夹在两片阵列之间，透明化组织里轴突紧挨着电极。取自 Wilson 等，2026，Figure 1。</i>

## 实验

实验用的是由 hiPSC 分化得到的背侧皮层类器官。类器官在 5–7 月龄时被放到两片 INFORM 阵列之间，先贴附两周——此时已能看见突起沿着臂生长（n = 10 个类器官）——随后每周记录一次，持续一年，中途不必取出或更换类器官。

细胞组成是另外检测的。对培养 120 天的类器官做单细胞 RNA 测序，再结合更晚时间点的免疫染色，确认了背侧前脑身份，以及兴奋性、抑制性神经元，还有前体细胞和胶质细胞。功能性实验中，类器官被转导了突触蛋白启动子驱动的 GCaMP8s，从而可以在电记录的同时成像神经元钙信号。

为了观察组织之间如何形成连接，作者把一对 5–7 月龄类器官共同接种，让它们融合成<b>组装体（assembloid）</b>（3 个接口上共 6 个类器官），并用每周一次的双光子钙成像跟踪块内和块间活动。

扰动实验通过 128 个电极中的两个施加双极微刺激：一个作阴极、一个作阳极，各自接收极性相反的双相脉冲（每相 100 µs，100 Hz）。他们在 20–100 µA 的幅度和 1–20 个脉冲次数之间做了参数搜索（n = 3 个类器官接口），发现 100 µA、10 个脉冲引起的钙反应最强，此后都用这一组参数。为了检验刺激引起的沉默是否依赖于 GABA 能突触，他们加入 <b>荷包牡丹碱（bicuculline）</b>（10 µM）阻断 GABA-A 受体，并比较加药前后的反应。

## 结果

### 长期记录，以及光学信号与电信号的对齐

组织与阵列的整合并不止于最初两周。双光子图像，以及接种三个月后经 CLARI-O 透明化的样品，都显示细胞突起包绕并嵌入阵列；神经丝重链染色说明这些突起是轴突。

电学通路在这一年里仍然可用。每周记录开始时都会测电极阻抗。按阻抗低于 2 MΩ 定义的工作通道比例，在体外 52 周里一直保持在 90% 以上（n = 6 个接口）。这是电学成品率，还不是关于锋电位的结论。

当钙成像和电生理同时进行时，群体爆发在两种信号上对得齐：钙瞬变升高的时刻，也正是锋电位和 LFP 峰出现的时刻（图 3b）。爆发率本身也随接种后的时间变化。接种后四周时还检测不到爆发，只能看到零星放电；到接种后一年，爆发率达到 0.33–1 Hz（n = 3 个类器官）。由于类器官接种时已经 5–7 个月大，按理说同步活动本应存在；作者因此把早期的上升主要解释为组织逐渐锚定到阵列上，之后同一套接口才能在这一年里跟上网络活动的变化。

图 3d 展示了 12 个通道上分拣出的锋电位波形，一直记录到接种后第 371 天。这个 371 天指的是这些分拣单元在每周记录中被跟踪到的时间跨度，并不是连续 371 天不间断采集。平均放电率总体上升，并在接种后约 50–60 周达到高峰（n = 3 个类器官）；主图面板给出的是 64 个通道在 52 周里的平均值（图 3e）。在这些记录中，平均每秒至少检测到 3 个锋电位的电极比例一直保持在 90% 以上（图 3f）。

![图 3. 同时进行的钙成像与电记录，并跨越多月随访。(a) 是类器官（绿）坐在阵列（品红）里的双光子图像。请看 (b) 中的红箭头：上方的钙信号、中间的锋电位光栅和下方的 LFP，在群体爆发时一起升高；右侧放大了其中一次爆发。(c) 把锋电位波形标回类器官上。(d) 是长时间记录：12 个通道上分拣出的锋电位，从接种后第 14 天到第 371 天。(e) 和 (f) 汇总了 52 周的每周记录：(e) 是平均放电率，(f) 是平均每秒至少检测到 3 个锋电位的电极比例。取自 Wilson 等，2026，Figure 3。](/img/readApaper-35/wilson2026_fig3.png)

<i>图 3. 同时进行的钙成像与电记录，并跨越多月随访。(a) 是类器官（绿）坐在阵列（品红）里的双光子图像。请看 (b) 中的红箭头：上方的钙信号、中间的锋电位光栅和下方的 LFP，在群体爆发时一起升高；右侧放大了其中一次爆发。(c) 把锋电位波形标回类器官上。(d) 是长时间记录：12 个通道上分拣出的锋电位，从接种后第 14 天到第 371 天。(e) 和 (f) 汇总了 52 周的每周记录：(e) 是平均放电率，(f) 是平均每秒至少检测到 3 个锋电位的电极比例。取自 Wilson 等，2026，Figure 3。</i>

### 两块类器官融合后的同步

在组装体实验里，两块类器官相互贴附，并在中间长出细胞桥。接种后两周，每一块内部已经有同步爆发，但两块之间的活动并不相关。到第三周，一部分爆发开始跨块相关；到第四周，两块的活动几乎完全同步（图 4c、d）。块间同步指数在 11 周里上升，直到两块组织接近完全一起放电（图 4e）。在其他配对中，同步甚至可能在两周之前就出现。在一次示例爆发里，一侧细胞比另一侧平均领先 0.82 秒（图 4g）。这些观察描述的是融合后功能连接的出现。

![图 4. 两块类器官融成组装体，活动逐渐对齐。(a) 和 (b) 是接种 11 周后同一对组织的明场和双光子图像。在 (c) 中，每一行是一个细胞的钙活动；比较第 14 天——两块类器官按不同节奏爆发——和第 28 天，那时竖直的爆发条已经对齐。(d) 用相关矩阵说同一件事：比较“类器官 1 的细胞”和“类器官 2 的细胞”的那两块离对角线较远的区域，从浅色变成红色。(e) 追踪 11 周的块间同步指数。(f) 是桥接处的细胞；(g) 按一次爆发中细胞达峰的先后上色，较早的偏紫，较晚的偏黄。取自 Wilson 等，2026，Figure 4。](/img/readApaper-35/wilson2026_fig4.png)

<i>图 4. 两块类器官融成组装体，活动逐渐对齐。(a) 和 (b) 是接种 11 周后同一对组织的明场和双光子图像。在 (c) 中，每一行是一个细胞的钙活动；比较第 14 天——两块类器官按不同节奏爆发——和第 28 天，那时竖直的爆发条已经对齐。(d) 用相关矩阵说同一件事：比较“类器官 1 的细胞”和“类器官 2 的细胞”的那两块离对角线较远的区域，从浅色变成红色。(e) 追踪 11 周的块间同步指数。(f) 是桥接处的细胞；(g) 按一次爆发中细胞达峰的先后上色，较早的偏紫，较晚的偏黄。取自 Wilson 等，2026，Figure 4。</i>

### 定向刺激招募局部亚网络

双极微刺激提高了钙爆发频率和放电。锋电位频段功率（0.5–4 kHz）的增加在靠近刺激电极对的通道上更大，符合局部作用。当作者换用不同的刺激电极对时，每一对都会激活不同的空间模式，有时在上、下两片阵列上都能看到（图 5d）。钙成像和电学地图在细胞尺度上一致：出现与刺激锁定的钙瞬变的细胞，邻近电极的锋电位频段功率也会升高；不活动的细胞则不会（图 5e–g）。

![图 5. 局部电刺激及其招募出的空间模式。(a) 是双极脉冲：一个电极阴极领先，另一个阳极领先。(b) 比较不同幅度和脉冲次数下的钙反应；100 µA、10 个脉冲最强，后面都用这一组。在 (c) 中，橙色线是刺激，钙迹线和锋电位光栅都在刺激串期间增强。最关键的是 (d)：四对由黑、红箭头标出的刺激电极，各自产生不同的黄色锋电位频段功率热点。(e–g) 放到单细胞：细胞 A–C（白）出现钙瞬变，旁边的电极 e1–e3 功率上升；细胞 D–E（黄）保持安静，邻近的 e4–e5 也不升高。取自 Wilson 等，2026，Figure 5。](/img/readApaper-35/wilson2026_fig5.png)

<i>图 5. 局部电刺激及其招募出的空间模式。(a) 是双极脉冲：一个电极阴极领先，另一个阳极领先。(b) 比较不同幅度和脉冲次数下的钙反应；100 µA、10 个脉冲最强，后面都用这一组。在 (c) 中，橙色线是刺激，钙迹线和锋电位光栅都在刺激串期间增强。最关键的是 (d)：四对由黑、红箭头标出的刺激电极，各自产生不同的黄色锋电位频段功率热点。(e–g) 放到单细胞：细胞 A–C（白）出现钙瞬变，旁边的电极 e1–e3 功率上升；细胞 D–E（黄）保持安静，邻近的 e4–e5 也不升高。取自 Wilson 等，2026，Figure 5。</i>

### 刺激引起的抑制，以及阻断 GABA-A 受体之后

在细胞分辨率下，刺激把成像视野里的神经元分成了两类，而它们在基线时看起来并无区别。<b>增强（enhanced）</b>细胞会发出与刺激锁定的钙瞬变；<b>抑制（suppressed）</b>细胞则在同一串刺激期间安静下来（图 6a、b）。这两个名称描述的是细胞如何反应，并不能说明它是兴奋性还是抑制性细胞。例如，一个被压静的细胞，也可能是正在接受更强抑制输入的兴奋性神经元。

类器官里确实具备抑制所需的元件。在 180 天的类器官中，同时表达神经元标记 NeuN 和抑制性标记 GAD65/67 的细胞，占 NeuN+ 神经元的 54.4 ± 20.9%（来自两个细胞系的 n = 6 个类器官）。转录组和染色数据还显示，兴奋性和抑制性神经元都表达 GABA-A 受体亚基。

机制检验来自荷包牡丹碱实验。加药前，刺激使视野中 60% 的活动细胞被抑制、40% 被增强；加药后，被抑制的比例降到 9.2%，被增强的比例升到 90.8%，相当于有 50.8% 的细胞从“被抑制”转为“被增强”（图 6h–k）。这个平均值来自一个代表性类器官接口上两次独立记录中的 120 次微刺激，其中包括第 562 天和第 632 天的记录。仍有少数细胞，也就是剩下的 9.2%，在加药后继续被抑制。增强和抑制细胞在成像平面上分布得比较均匀，作者据此认为，其中许多反应是通过网络转递的，而不仅仅是刺激电极旁边的直接激活。

![图 6. 对刺激的两种功能反应，以及阻断 GABA-A 受体之后的变化。在 (a–b) 中，蓝框细胞在橙色刺激串期间继续放电（增强）；红框细胞则安静下来（抑制）。(c–f) 展示抑制性细胞和 GABA-A 受体，其中 (d) 显示 NeuN+ 神经元里抑制性细胞占 54.4%。(g) 是示意图：刺激可以把兴奋性和抑制性输入一起送到被成像的细胞；荷包牡丹碱去掉其中的 GABA-A 成分。(h) 中的迹线是直接比较——被抑制的细胞 S1–S3 在红框里安静，加药后在蓝框里重新响应。(i–k) 对整个视野计数：许多红色（抑制）细胞变成蓝色（增强），(k) 的柱状图显示被抑制比例从 60% 降到 9.2%。取自 Wilson 等，2026，Figure 6。](/img/readApaper-35/wilson2026_fig6.png)

<i>图 6. 对刺激的两种功能反应，以及阻断 GABA-A 受体之后的变化。在 (a–b) 中，蓝框细胞在橙色刺激串期间继续放电（增强）；红框细胞则安静下来（抑制）。(c–f) 展示抑制性细胞和 GABA-A 受体，其中 (d) 显示 NeuN+ 神经元里抑制性细胞占 54.4%。(g) 是示意图：刺激可以把兴奋性和抑制性输入一起送到被成像的细胞；荷包牡丹碱去掉其中的 GABA-A 成分。(h) 中的迹线是直接比较——被抑制的细胞 S1–S3 在红框里安静，加药后在蓝框里重新响应。(i–k) 对整个视野计数：许多红色（抑制）细胞变成蓝色（增强），(k) 的柱状图显示被抑制比例从 60% 降到 9.2%。取自 Wilson 等，2026，Figure 6。</i>

## 分析

这些结果最好分成四件事来读。第一件是接口能在活的类器官上待多久、还能不能记到信号。一年里每周一次的记录、同一批通道上的波形被跟踪到接种后 371 天，以及超过 90% 的通道仍能检测到锋电位，说的是长期耦合和记录成品率。这些数字本身并不表示学习、训练或计算。

第二件是机械贴合和光学通路。上下包裹的几何结构、又薄又透明的导线，以及顶部开口的培养井，使同一块完整类器官可以被成像和记录，而不必被压到平坦阵列上。

第三件是扰动。双极刺激和荷包牡丹碱，加在正在被成像和记录的同一块组织上。正是这一点，把相关观察变成了机制检验。

第四件是这里所说的<b>功能亚网络</b>到底有哪些证据。一条证据是空间上的：不同的刺激电极对招募出不同的活动模式，有时上下两个半球都能看到。另一条是功能上的：刺激揭出了在安静状态下并不明显的“增强”和“抑制”反应类型。荷包牡丹碱的结果支持一个更具体的结论：所观察到的、由刺激引起的沉默，有很大一部分是通过 GABA-A 受体介导的。定量上 50.8% 的转变，来自一个代表性接口上的两次记录。“增强”和“抑制”始终是对反应方式的描述，而不是对细胞类型的判定。至于组装体记录，它们表明两块类器官融合后可以出现功能连接；测量的是同步性的上升，而不是一种被训练出来的技能。

合在一起看，这个平台的价值在于：这四类证据可以从同一块完整的人源类器官上收集到。

## 总结

INFORM 是一套 128 通道、可包裹的接口，能够在活体人源皮层类器官上保持一年的每周记录，同时也支持双光子成像、局部电刺激和药物递送。借助这种组合，作者跟踪了融合类器官对中同步性的出现，通过选择不同的刺激电极招募出空间上不同的活动模式，并表明他们所观察到的、由刺激引起的沉默，在很大程度上依赖于 GABA 能抑制。

## 参考资料

- Wilson, M. N., Kharitonova, E. K., Yeh, J., Lee, J., Hemaidan, S., Essig, S., Shi, M., Crain, C. W., Ramezani, M., Sun, F., Zhou, T., Surucu, I., Mortazavi, F., Cubukcu, E., Thunemann, M., Zeldich, E., & Kuzum, D. (2026). <i>Flexible 3D multimodal organoid interface reveals functional subnetworks and coordinated circuit activity in cortical organoids.</i> bioRxiv. [doi.org/10.64898/2026.10.02.756317](https://doi.org/10.64898/2026.10.02.756317)
- Trujillo, C. A., Gao, R., Negraes, P. D., et al. (2019). <i>Complex oscillatory waves emerging from cortical organoids model early human brain network development.</i> Cell Stem Cell, 25(4), 558–569. [doi.org/10.1016/j.stem.2019.08.002](https://doi.org/10.1016/j.stem.2019.08.002)
- Chiaradia, I., & Lancaster, M. A. (2020). <i>Brain organoids for the study of human neurobiology at the interface of in vitro and in vivo.</i> Nature Neuroscience, 23, 1496–1508. [doi.org/10.1038/s41593-020-00730-3](https://doi.org/10.1038/s41593-020-00730-3)
- Yang, X., Forró, C., Li, T., et al. (2024). <i>Kirigami electronics for long-term electrophysiological recording of human neural organoids and assembloids.</i> Nature Biotechnology, 42, 1836–1843. [doi.org/10.1038/s41587-023-02081-3](https://doi.org/10.1038/s41587-023-02081-3)

图 1、图 3–6 取自 Wilson 等，2026，bioRxiv 预印本，DOI [10.64898/2026.10.02.756317](https://doi.org/10.64898/2026.10.02.756317)。
