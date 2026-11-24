---
title: "readApaper#16 Two parallel neural ectoderm progenitors contribute to the developing brain"
title_zh: "readApaper#16 Two parallel neural ectoderm progenitors contribute to the developing brain"
date: 2026-11-02 22:00:00
tags:
  - readApaper
  - neuroscience
  - neurodevelopment
  - stem-cells
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7–8 minutes · 2 November 2026 · Nature Neuroscience, 2026</i>

<b>When do the forebrain, midbrain and hindbrain begin to take separate developmental paths?</b> This study argues that the split starts remarkably early: during gastrulation, before mature brain-region progenitors appear. The authors identify two parallel neural ectoderm populations—anterior neural ectoderm (aNE) and posterior neural ectoderm (pNE)—and trace how they generate different parts of the brain.

## 1. A hidden split at the beginning of neural development

Neural ectoderm is the embryonic tissue that gives rise to the nervous system. In E7.5 mouse embryos, the authors found two spatially distinct populations among SOX2-positive neural ectoderm cells:

- <b>aNE: SOX2⁺ OTX2⁺ cells</b>, located anteriorly and associated with future forebrain and midbrain.
- <b>pNE: SOX2⁺ GBX2⁺ cells</b>, located posteriorly and associated with future hindbrain.

These are early neural ectoderm populations, not yet the later forebrain, midbrain or hindbrain progenitors. Their regional identity is already visible through OTX2 and GBX2 expression.

The team recreated this early decision using human pluripotent stem cells (hPSCs). First, they induced definitive ectoderm. They then blocked BMP, TGFβ and WNT signalling to generate aNE. Adding FGF2 and a retinoic-acid (RA) agonist, TTNPB, during this neural-induction stage instead generated GBX2-positive pNE. FGF and RA signalling were both required for this posterior identity.

This distinction helps explain why the posterior neural ectoderm is not simply an early spinal-cord precursor. In the mouse embryo, pNE shows little WNT activity, while stronger WNT activity is found farther posteriorly, where spinal-cord and neuromesodermal progenitors emerge.

![Figure 1. Anterior and posterior neural ectoderm in mouse embryos and hPSC cultures. The key panels show the SOX2/OTX2 and SOX2/GBX2 populations and the signals used to produce each population in vitro.](/img/readApaper-16/41593_2026_2433_Fig1_HTML.png)

<i>Figure 1. Anterior and posterior neural ectoderm in mouse embryos and hPSC cultures. The key panels show the SOX2/OTX2 and SOX2/GBX2 populations and the signals used to produce each population in vitro.</i>

## 2. How do we know the two routes remain distinct?

The authors combined mouse lineage tracing with controlled differentiation experiments.

For lineage tracing, they used a Gbx2-CreER; ROSA26-tdTomato mouse system. A brief 4-hydroxytamoxifen pulse permanently labelled GBX2-positive pNE cells. The labelled descendants were then followed across embryonic development, from early stages through E18.5. The traced pNE lineage contributed to the hindbrain territory.

They next tested the developmental potential of hPSC-derived aNE and pNE. After two days of differentiation, each population was exposed to signals that normally promote forebrain, midbrain or hindbrain identity.

The outcomes followed the starting population:

- aNE responded to forebrain-inducing signals by producing FOXG1⁺/SIX3⁺ forebrain progenitors, and to midbrain-inducing signals by producing EN1⁺ midbrain progenitors.
- pNE responded to hindbrain-inducing signals by producing MAFB⁺, HNF1B⁺ and HOXA3⁺ hindbrain progenitors.

When the researchers exposed aNE to hindbrain-inducing signals, or pNE to forebrain- and midbrain-inducing signals, the cells largely retained their original regional trajectory. The same pattern was observed when labelled pNE and unlabelled aNE were mixed in a co-culture. Their identities persisted even while the two populations shared the same environment.

![Figure 2. Mouse lineage tracing and hPSC fate-challenge experiments. The labelled pNE descendants occupy the hindbrain, while the in-vitro experiments compare the regional identities produced from aNE and pNE under different developmental signals.](/img/readApaper-16/41593_2026_2433_Fig2_HTML.png)

<i>Figure 2. Mouse lineage tracing and hPSC fate-challenge experiments. The labelled pNE descendants occupy the hindbrain, while the in-vitro experiments compare the regional identities produced from aNE and pNE under different developmental signals.</i>

## 3. Chromatin records the future identity

The next question was molecular: what makes aNE and pNE respond differently to the same developmental signals?

The team used Omni-ATAC-seq to measure <b>chromatin accessibility</b>. DNA is wrapped around proteins to form chromatin. Regulatory regions that are more accessible are easier for transcription factors to bind, making them more available for controlling gene expression. ATAC-seq therefore provides a map of regulatory DNA that is open in each cell population.

The two populations had distinct accessibility landscapes:

- aNE-enriched regions were associated with OTX2 transcription-factor motifs, consistent with anterior neural identity.
- pNE-enriched regions were associated with HOX, HNF1B and MAFB motifs, alongside transcriptional regulators downstream of FGF and RA signalling, including ETV1, RARB and RXRG.

The researchers also challenged the cells with signals that normally promote the opposite brain region. aNE maintained a forebrain-like regulatory programme when exposed to hindbrain-inducing signals. pNE retained a hindbrain-like programme when exposed to forebrain-inducing signals.

This provides a molecular explanation for the fate experiments: the two populations enter later development with different regulatory landscapes already established.

![Figure 3. Omni-ATAC-seq reveals different accessible chromatin regions and transcription-factor motifs in aNE and pNE, including after exposure to forebrain- or hindbrain-inducing signals.](/img/readApaper-16/41593_2026_2433_Fig3_HTML.png)

<i>Figure 3. Omni-ATAC-seq reveals different accessible chromatin regions and transcription-factor motifs in aNE and pNE, including after exposure to forebrain- or hindbrain-inducing signals.</i>

## 4. From two early populations to four brain territories

Once the anterior–posterior identity had been established, the researchers patterned the cells along the dorsal–ventral axis.

The aNE route generated forebrain progenitors, while the pNE route generated hindbrain progenitors. Each route could then be divided into dorsal and ventral identities by changing WNT, BMP and Hedgehog (HH/SHH) signalling.

This produced four populations:

1. <b>Dorsal forebrain progenitors</b>, associated with cortical development.
2. <b>Ventral forebrain progenitors</b>, associated with cortical interneurons and hypothalamic lineages.
3. <b>Dorsal hindbrain progenitors</b>, associated with sensory-neuron development.
4. <b>Ventral hindbrain progenitors</b>, associated with motor-neuron development.

The important idea is that anterior–posterior identity is established first, and dorsal–ventral patterning adds another layer of regional specification within each route.

![Figure 4. The differentiation roadmap from aNE and pNE to dorsal and ventral forebrain and hindbrain progenitors. Immunostaining and single-cell RNA sequencing distinguish the four resulting populations.](/img/readApaper-16/41593_2026_2433_Fig4_HTML.png)

<i>Figure 4. The differentiation roadmap from aNE and pNE to dorsal and ventral forebrain and hindbrain progenitors. Immunostaining and single-cell RNA sequencing distinguish the four resulting populations.</i>

## 5. Generating functional hindbrain neurons

The team then exposed the four progenitor populations to a shared neuronal differentiation programme, using neurotrophic support and NOTCH inhibition to promote neuronal maturation.

The resulting neurons retained region-specific identities:

- Dorsal forebrain progenitors produced TBR1-positive cortical neurons, including Cajal–Retzius-like cells.
- Ventral forebrain progenitors produced DLX1-positive cortical interneurons and hypothalamic-like populations expressing markers such as OTP and ISL1.
- Dorsal hindbrain progenitors produced TLX3-positive and LBX1-positive sensory-like neurons.
- Ventral hindbrain progenitors produced motor neurons expressing HOXA1, HOXA3, PHOX2A and PHOX2B, consistent with hindbrain rhombomere 5/6 identity.

The hindbrain motor neurons were also tested functionally. GCaMP6f imaging revealed spontaneous calcium transients. Electrophysiological recordings detected voltage-gated sodium and potassium currents and action potentials following current injection. The cells could also be activated optogenetically using the excitatory opsin bReaChES.

This gives researchers a route to generate human hindbrain motor neurons in vitro. Such cells are relevant to studying cranial motor functions, including swallowing, and diseases such as spinal muscular atrophy (SMA) and amyotrophic lateral sclerosis (ALS).

![Figure 5. Region-specific neuronal differentiation and functional assessment. The figure combines neuronal marker staining, single-cell profiles, calcium imaging, electrophysiology and optogenetic stimulation of hindbrain neurons.](/img/readApaper-16/41593_2026_2433_Fig5_HTML.png)

<i>Figure 5. Region-specific neuronal differentiation and functional assessment. The figure combines neuronal marker staining, single-cell profiles, calcium imaging, electrophysiology and optogenetic stimulation of hindbrain neurons.</i>

## 6. An ancient developmental pattern

Finally, the authors asked whether this anterior–posterior division is specific to mice or appears more broadly across evolution.

They examined embryos from macaque, chicken and zebrafish, and also the acorn worm, a hemichordate. Across these species, they identified anterior OTX2-positive and posterior GBX-positive ectodermal populations.

The presence of a similar pattern in both vertebrates and a hemichordate suggests that the separation of anterior and posterior ectoderm may trace back to a common deuterostome ancestor around 550–600 million years ago.

![Figure 6. Anterior and posterior ectodermal identities across macaque, chicken, zebrafish and acorn worm embryos, supporting an evolutionarily conserved developmental pattern.](/img/readApaper-16/41593_2026_2433_Fig6_HTML.png)

<i>Figure 6. Anterior and posterior ectodermal identities across macaque, chicken, zebrafish and acorn worm embryos, supporting an evolutionarily conserved developmental pattern.</i>

## Why this matters for engineered neural tissue

For stem-cell-derived neural tissue, the starting regional identity is an important design variable. A differentiation protocol that produces anterior neural ectoderm is naturally directed toward forebrain and midbrain lineages; producing hindbrain neurons requires an early posterior neural ectoderm route.

For organoid engineering, this means cell identity should be considered before a neural network is assembled and studied. The developmental route influences which neuronal populations can later emerge, and therefore the cellular composition of the resulting tissue.

## Takeaway

- Two neural ectoderm populations appear early in development: aNE (forebrain/midbrain) and pNE (hindbrain).
- FGF and RA signalling help specify pNE, while neural induction with BMP, TGFβ and WNT inhibition produces aNE.
- Their distinct chromatin landscapes help preserve different regional developmental trajectories.
- The two routes can be patterned into four dorsal–ventral progenitor populations and differentiated into region-specific neurons.
- The study establishes a developmental route for producing functional human hindbrain motor neurons and identifies a similar anterior–posterior pattern across distant species.

---

## References and resources

- Jokhai, R. T., Dundes, C. E. et al. (2026). <i>Two parallel neural ectoderm progenitors contribute to the developing brain</i>. Nature Neuroscience. [Published article](https://doi.org/10.1038/s41593-026-02433-7)
- Earlier preprint: [Two parallel lineage-committed progenitors contribute to the developing brain](https://doi.org/10.1101/2025.07.02.662771)
- Sequencing data: [GEO SuperSeries GSE286214](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE286214)
- Analysis scripts: [Loh Laboratory GitHub repository](https://github.com/lohlaboratory/ane-pne)
- Cell-type browser: [Interactive single-cell RNA-seq browser](https://anglohlabs.shinyapps.io/dundes_jokhai_lohlab/)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7–8 分钟 · 2026-11-02 · Nature Neuroscience, 2026</i>

<b>前脑、中脑和后脑究竟从什么时候开始走上不同的发育道路？</b> 这项研究提出，脑区分化的起点比成熟脑区祖细胞出现得更早：在原肠胚形成阶段，神经外胚层就已经分化出两条平行的发育路线。作者将它们称为前部神经外胚层（anterior neural ectoderm，aNE）和后部神经外胚层（posterior neural ectoderm，pNE），并追踪了它们如何形成不同脑区。

## 1. 神经发育早期已经出现分流

神经外胚层是胚胎中最终形成神经系统的组织。在小鼠胚胎 E7.5 阶段，研究者发现 SOX2 阳性的神经外胚层细胞中存在两个空间上不同的群体：

- <b>aNE：SOX2⁺ OTX2⁺</b>，位于胚胎前部，对应未来的前脑和中脑。
- <b>pNE：SOX2⁺ GBX2⁺</b>，位于胚胎后部，对应未来的后脑。

这两类细胞仍处于早期神经外胚层阶段，还没有成为后续成熟的前脑、中脑或后脑祖细胞，但 OTX2 和 GBX2 已经显示出不同的区域身份。

研究团队使用人多能干细胞（hPSCs）重建了这一过程。首先将 hPSCs 诱导为确定性外胚层（definitive ectoderm），随后抑制 BMP、TGFβ 和 WNT 信号，得到 aNE。如果在神经诱导阶段同时加入 FGF2 和维甲酸（retinoic acid，RA）受体激动剂 TTNPB，则会产生 GBX2 阳性的 pNE。FGF 和 RA 两种信号需要协同作用，才能建立这种后部神经外胚层身份。

这一发现也帮助区分后脑与脊髓的发育来源：小鼠胚胎中的 pNE 几乎没有明显的 WNT 活性；更靠后的胚胎区域才具有较强 WNT 信号，并产生脊髓和神经—中胚层祖细胞。

## 2. 两条发育路线如何得到验证？

研究者结合了小鼠谱系追踪和人多能干细胞分化实验。

在小鼠实验中，作者使用 Gbx2-CreER; ROSA26-tdTomato 系统，通过短暂给予 4-羟基他莫昔芬（4OHT），永久标记 GBX2 阳性的 pNE 细胞。随后在 E8.5 至 E18.5 的不同胚胎发育阶段追踪这些细胞的后代。结果显示，被标记的 pNE 后代进入后脑区域。

接下来，研究团队测试了 hPSC 来源的 aNE 和 pNE 各自能够形成哪些脑区祖细胞。两类细胞分化两天后，分别接受促进前脑、中脑或后脑形成的信号。

结果与它们最初的身份一致：

- aNE 在前脑诱导条件下形成 FOXG1⁺/SIX3⁺ 前脑祖细胞，在中脑诱导条件下形成 EN1⁺ 中脑祖细胞。
- pNE 在后脑诱导条件下形成 MAFB⁺、HNF1B⁺ 和 HOXA3⁺ 后脑祖细胞。

当研究者用后脑诱导信号处理 aNE，或用前脑、中脑诱导信号处理 pNE 时，两类细胞总体上仍沿着原来的区域发育路线前进。将带荧光标记的 pNE 与未标记的 aNE 混合培养，也观察到了相同趋势：即使处于同一个培养环境，两类细胞仍保持各自的区域身份。

## 3. 染色质提前记录了细胞的发育身份

为什么 aNE 和 pNE 面对相同的发育信号时，会产生不同的反应？

作者使用 Omni-ATAC-seq 检测两类细胞的<b>染色质可及性（chromatin accessibility）</b>。DNA 与蛋白质结合形成染色质，其中更开放的调控区域更容易被转录因子结合，从而参与基因表达调控。ATAC-seq 可以帮助研究者识别不同细胞中处于开放状态的 DNA 区域。

两类细胞呈现出不同的染色质图谱：

- aNE 中开放区域富集 OTX2 转录因子结合基序，与前部神经身份一致。
- pNE 中开放区域富集 HOX、HNF1B 和 MAFB 等后脑相关转录因子基序，同时富集 FGF 和 RA 信号下游调控因子 ETV1、RARB 和 RXRG。

研究者进一步给两类细胞施加与其原始身份相反的发育信号。结果显示，aNE 仍然保留前脑相关的调控程序，pNE 则保留后脑相关的调控程序。

这解释了前面的分化实验：两类细胞进入后续发育阶段时，已经建立了不同的基因调控基础。

## 4. 从两类早期祖细胞到四种脑区祖细胞

确定前后轴身份后，研究者继续沿背腹轴（dorsal–ventral axis）对细胞进行分化。

aNE 路线形成前脑祖细胞，pNE 路线形成后脑祖细胞。随后通过调节 WNT、BMP 和 Hedgehog（HH/SHH）信号，可以进一步形成背侧和腹侧身份。

最终得到四类祖细胞：

1. <b>背侧前脑祖细胞</b>：与大脑皮层发育相关。
2. <b>腹侧前脑祖细胞</b>：与皮层中间神经元和部分下丘脑细胞相关。
3. <b>背侧后脑祖细胞</b>：与感觉神经元发育相关。
4. <b>腹侧后脑祖细胞</b>：与运动神经元发育相关。

整个过程体现出两个连续的区域分化步骤：首先确定前部或后部身份，再在各自的发育路线中建立背侧或腹侧身份。

## 5. 生成具有功能的后脑神经元

接下来，研究者对四类祖细胞使用相同的神经元诱导方案，通过神经营养因子支持和 NOTCH 信号抑制，促进细胞向神经元分化。

最终产生的神经元保留了各自的区域特征：

- 背侧前脑祖细胞产生 TBR1 阳性的皮层神经元，包括 Cajal–Retzius 样细胞。
- 腹侧前脑祖细胞产生 DLX1 阳性的皮层中间神经元，以及表达 OTP、ISL1 等标记的下丘脑样细胞。
- 背侧后脑祖细胞产生 TLX3 和 LBX1 阳性的感觉神经元样细胞。
- 腹侧后脑祖细胞产生表达 HOXA1、HOXA3、PHOX2A 和 PHOX2B 的运动神经元，对应后脑 rhombomere 5/6 区域身份。

研究团队还对后脑运动神经元进行了功能验证。GCaMP6f 钙成像检测到了自发钙瞬变；电生理记录检测到了电压门控钠、钾电流，以及电流注入后产生的动作电位。研究者还通过兴奋性光遗传蛋白 bReaChES 对细胞进行光刺激，诱发了动作电位。

这为体外生成特定人类后脑运动神经元提供了路线。这类细胞与吞咽等脑神经运动功能相关，也可用于研究脊髓性肌萎缩症（SMA）和肌萎缩侧索硬化症（ALS）等疾病。

## 6. 一种古老的发育模式

最后，作者研究了这种前后部神经外胚层分化是否只存在于小鼠。

他们观察了猕猴、鸡、斑马鱼以及半索动物玉钩虫（acorn worm）的胚胎。在这些物种中，都发现了 OTX2 阳性的前部外胚层和 GBX 阳性的后部外胚层群体。

这一模式同时出现在脊椎动物和半索动物中，提示前部与后部外胚层的分化可能可以追溯到约 5.5–6 亿年前的后口动物共同祖先。

## 对人工神经组织构建的启发

对于干细胞来源的神经组织，起始细胞的区域身份是一个重要的设计变量。以 aNE 为起点，分化路线自然指向前脑和中脑；如果希望获得后脑神经元，则需要在早期建立 pNE 身份。

对于类器官工程，这意味着细胞组成需要在神经网络形成之前就纳入设计。早期发育路线会影响后续能够出现哪些神经元群体，进而影响最终组织的细胞组成。

## 总结

- 神经发育早期存在两类神经外胚层：aNE 对应前脑/中脑，pNE 对应后脑。
- BMP、TGFβ、WNT 抑制参与神经诱导；FGF 与 RA 协同促进 pNE 形成。
- 两类细胞具有不同的染色质调控图谱，并沿各自的脑区发育路线分化。
- 两条路线可以进一步形成四种背腹侧祖细胞，并产生具有区域特征的神经元。
- 研究建立了体外生成具有电生理功能的人类后脑运动神经元的路线，并在多个物种中发现了相似的前后部外胚层分化模式。

---

## References and resources

- Jokhai, R. T., Dundes, C. E. et al. (2026). <i>Two parallel neural ectoderm progenitors contribute to the developing brain</i>. Nature Neuroscience. [正式发表版本](https://doi.org/10.1038/s41593-026-02433-7)
- 早期预印本：[Two parallel lineage-committed progenitors contribute to the developing brain](https://doi.org/10.1101/2025.07.02.662771)
- 测序数据：[GEO SuperSeries GSE286214](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE286214)
- 分析代码：[Loh Laboratory GitHub repository](https://github.com/lohlaboratory/ane-pne)
- 单细胞数据浏览器：[Interactive single-cell RNA-seq browser](https://anglohlabs.shinyapps.io/dundes_jokhai_lohlab/)
