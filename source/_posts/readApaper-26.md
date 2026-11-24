---
title: "readApaper#26 A brain-computer interface that evokes tactile sensations improves robotic arm control"
title_zh: "readApaper#26 A brain-computer interface that evokes tactile sensations improves robotic arm control"
date: 2026-11-12 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - somatosensory
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 7 minutes · 12 November 2026 · Science, 21 May 2021</i>

Picking up a cup looks like a job for the eyes, but much of what tells you that your fingers have made contact, and how firmly you are holding on, arrives through touch. This paper asks what happens when that missing stream is added back, inside the brain, for a person who controls a robotic arm with a brain-computer interface.

## Background

After a cervical spinal cord injury, the brain can still plan and attempt arm and hand movements, but the commands may no longer reach the muscles. <b>Tetraplegia</b> is paralysis that affects the arms and legs. Among people with cervical injuries, nearly half rank improved arm and hand function as their top rehabilitation priority (Flesher et al., 2021).

A <b>brain-computer interface</b> (BCI) can bypass the damaged pathway. Electrodes in <b>motor cortex</b>—the cortical area that helps generate movement—record the activity that appears when a person attempts to move. A decoder turns that activity into commands for a prosthetic arm or another device. This group had already shown that such a system can support continuous reaching and grasping, even in up to ten dimensions, and that people can complete clinical tests of upper-limb function with it (Collinger et al., 2013; Wodlinger et al., 2015). Those earlier demonstrations, however, relied on vision alone.

Vision is excellent for finding an object and aiming the hand, but it is a poor substitute for the timing and force information that touch normally provides. Receptors in the skin fire as soon as contact occurs and then report how the force is changing. That is how you know a glass has been reached, whether it is starting to slip, and when it is safe to lift. When tactile feedback is lost, even simple manipulation becomes clumsy and slow, even if vision is intact (Rothwell et al., 1982; Johansson & Flanagan, 2009).

For some people with limb amputation, sensation can be restored by stimulating peripheral nerves. That route does not work for tetraplegia: stimulation below the spinal injury cannot carry information up to the brain. The remaining option is to go directly to <b>somatosensory cortex</b>, the area that represents touch. A subregion called <b>area 1</b> is especially concerned with cutaneous, or skin-based, touch (Delhaye, Long, & Bensmaia, 2018).

<b>Intracortical microstimulation</b> (ICMS) delivers tiny electrical pulses through implanted microelectrodes. Stimulating somatosensory cortex can produce sensations that feel as if they come from the hand itself, often with a cutaneous quality, and their location and intensity can be shaped by which electrodes are used and how strong the current is (Penfield & Boldrey, 1937; Flesher et al., 2016). A <b>bidirectional BCI</b> combines both directions: motor-cortex recordings control a prosthetic arm, while sensory-cortex stimulation sends touch information back.

## Problem

The open question was not whether ICMS can evoke a sensation, but whether that sensation helps during real use. Previous motor BCIs already allowed people to reach and grasp with vision. Many tests of artificial touch have measured performance after vision was removed, so that the new signal was the only cue available.

This study asked a more practical question: if a person already has a clear view of a robotic hand, does adding ICMS-evoked tactile feedback improve functional performance? Can artificial touch do the job that natural touch does during grasp—marking contact and force in a way the person can use immediately?

## Method

The system is a closed loop with two halves (Figure 1). On the motor side, activity in motor cortex is decoded into five simultaneously controlled velocities: three for the hand’s position in space, one for wrist rotation, and one for opening and closing the hand. On the sensory side, sensors in the robotic fingers report contact force, and that signal is converted, in real time, into ICMS of somatosensory cortex.

The study included one participant: a man who was 28 years old at implantation and had tetraplegia from a C5 motor / C6 sensory ASIA B spinal cord injury sustained ten years earlier. ASIA B means the injury is incomplete, with some sensory function preserved below the lesion. The work was conducted under a U.S. FDA Investigational Device Exemption and is registered as NCT01894802.

Four microelectrode arrays were implanted in the left hemisphere. Two arrays, each with 88 wired electrodes, sat in the hand and arm region of motor cortex and recorded movement intent. Two additional arrays, each with 32 wired electrodes, sat in area 1 of somatosensory cortex and delivered stimulation. The resulting sensations were described as coming from the palm and fingers of his own right hand, with cutaneous qualities.

Each day, a new five-degree-of-freedom velocity decoder was trained with an observation-based method. The participant watched a prosthetic arm move and imagined performing those motions; an optimal linear estimator then mapped motor-cortex firing rates to the five velocity commands. Stimulation was never delivered during calibration, and he had an unobstructed view of the robotic hand on every trial. By the time of these experiments, he had practiced the tasks for about two years.

Torque sensors in the robotic fingers drove the stimulation. Torque at the index finger controlled the electrode that evoked an index-finger sensation. Torque at the middle finger controlled a group of electrodes whose sensations were referred to the middle, ring, and little fingers. Pulse trains were delivered at 100 pulses per second. Current amplitude was mapped linearly from a light-touch torque of 0.1 Nm to a strong-grasp torque of 0.5 Nm, corresponding to about 14 to 64 µA (Figure 1D). Stronger contact therefore felt stronger, and different fingers were not collapsed into a single, unlocalized buzz.

![Figure 1. Overview of the bidirectional BCI. In the center, the participant controls a robotic arm while looking at it. (A) Five continuously controlled dimensions: hand position, wrist rotation, and opening or closing the hand. (B) Four arrays in the left hemisphere: blue in motor cortex (recording) and red in somatosensory cortex (stimulation). (C) Finger torques are mapped onto electrodes whose sensations appear on corresponding fingers; the colored grids show which array sites were linked to which digits. (D) The encoding curve: finger-joint torque (horizontal, Nm) is converted linearly into stimulation amplitude (vertical, µA) between a lower threshold and an upper plateau. (E) A raster of motor-cortex activity is decoded by an optimal linear estimator into the five velocities. (F) The Action Research Arm Test (ARAT): objects start at the green dot, are grasped, and are placed on the green platform. (G) The object-transfer task: the object starts in the gray zone, is carried across the red transit zone, and is released in the green target zone. From Flesher et al., 2021, Figure 1.](/img/readApaper-26/flesher2021_fig1.jpg)

<i>Figure 1. Overview of the bidirectional BCI. In the center, the participant controls a robotic arm while looking at it. (A) Five continuously controlled dimensions: hand position, wrist rotation, and opening or closing the hand. (B) Four arrays in the left hemisphere: blue in motor cortex (recording) and red in somatosensory cortex (stimulation). (C) Finger torques are mapped onto electrodes whose sensations appear on corresponding fingers; the colored grids show which array sites were linked to which digits. (D) The encoding curve: finger-joint torque (horizontal, Nm) is converted linearly into stimulation amplitude (vertical, µA) between a lower threshold and an upper plateau. (E) A raster of motor-cortex activity is decoded by an optimal linear estimator into the five velocities. (F) The Action Research Arm Test (ARAT): objects start at the green dot, are grasped, and are placed on the green platform. (G) The object-transfer task: the object starts in the gray zone, is carried across the red transit zone, and is released in the green target zone. From Flesher et al., 2021, Figure 1.</i>

## Experiments

Vision was available in every trial. The comparison is therefore vision alone versus vision plus ICMS-evoked touch, not touch in a darkened room. The two conditions were tested in a blocked design: the first four sessions included ICMS driven by robotic touch; the next four used the same protocol with no stimulation. Earlier exploratory sessions that mixed the two, and that used variable stimulation parameters, were not the main comparison.

The main functional test was a modified <b>Action Research Arm Test</b> (ARAT), a clinical assessment of upper-limb function (Lyle, 1981; Yozbatiran, Der-Yeghiaian, & Cramer, 2008). The participant picked up one of eight objects and placed it on a raised platform as quickly as possible. A ninth item was also included: picking up a cup of water, pouring it into another cup, and setting the first cup back down upright. Each object was attempted three times in a session, with up to two minutes per attempt, and scored from 0 to 3. A score of 3 meant the transfer was completed in under five seconds, the threshold treated as able-bodied performance. The best score for each of the nine objects was summed, so the maximum session score was 27.

The authors also timed three phases of each trial: <b>reaching</b> (movement onset to first contact), <b>grasping</b> (contact to liftoff), and <b>transport</b> (liftoff to release).

In a second task, the participant picked up an object from the left side of the table (the object zone), carried it across a transit zone in which it was not supposed to touch the table, and released it in a target zone on the right, as many times as possible in two minutes. This was repeated five times per session. The measures were time spent in each zone, the path length of the hand in the object zone, and the number of successful transfers.

Because a better or worse decoder on a given day could masquerade as an effect of stimulation, a random-target sequence task was run each day, always without ICMS, to test independent control of each degree of freedom. ARAT scores and trial times were compared with Wilcoxon rank-sum tests; object-transfer measures, which were normally distributed, were compared with t-tests (n = 20 two-minute trials per condition).

## Results

In the four sessions with ICMS, the median ARAT score was 21 (individual scores: 21, 21, 21, and 20). In the next four sessions without ICMS, the median was 17 (19, 16, 17, and 17), a significant drop (p = 0.029). The ICMS sessions were also higher than 23 earlier sessions collected over the 23 months before this experiment (p = 0.005). The four sessions without ICMS were not different from that historical baseline (p = 0.65). A few of those earlier sessions had included exploratory ICMS, but the parameters varied and stimulation was intermixed with unstimulated trials rather than blocked.

The score improved because successful trials became faster, not because more trials were completed. Across all attempts in each condition (108 attempts: nine objects × three tries × four sessions), the number of successful transfers did not change (p = 0.83). The median number of completed trials per session was 20 with ICMS and 21 without it. What changed was speed. For successful trials, the median time fell by 51.2%, from 20.9 s without ICMS (interquartile range 13.1–40.5 s) to 10.2 s with ICMS (5.5–18.1 s; p \< 0.0001). A score of 3, meaning a transfer in under five seconds, occurred once in the 108 attempts without ICMS and 15 times with ICMS. Fourteen percent of the trials with tactile feedback were faster than the single fastest trial without it. Median completion times were lower for every object, and the improvement was significant for more than half of them.

The authors also describe a 3.5-point improvement in the ARAT score, which matches the difference between the mean scores of the four sessions in each condition (20.75 versus 17.25), and interpret that change as 3.5 more of the nine objects being moved to the platform in a normal time of under five seconds. That 3.5-object reading refers to the best attempt at each object, which is how the session score is built; it is not the same number as the 15 individual attempts that scored 3.

![Figure 2. How ICMS changed ARAT performance. (A) Session scores. “Prior performance” is the historical baseline; blue dots in that column are earlier sessions that sometimes included exploratory ICMS. Red lines are medians. Scores with ICMS are higher than both the historical baseline (p = 0.005) and the later sessions without ICMS (p = 0.029). (B) Histogram of successful trial times: blue with ICMS, gray without. Dotted lines mark the medians; hatched bars are trials finished in under five seconds. (C) Cumulative distribution of all trial times, including failures, on a logarithmic time axis. The vertical red marks show when 50% of successful trials were finished (~10 s with ICMS, ~21 s without). Times to the left of the green line are under five seconds. Shading is a 95% confidence band. (D) Time spent in each phase. The large box plot is grasp; the two smaller plots are reach (top) and transport (bottom). Red lines are medians, boxes are interquartile ranges, and red crosses are outliers. Grasp time accounts for most of the improvement. From Flesher et al., 2021, Figure 2.](/img/readApaper-26/flesher2021_fig2.jpg)

<i>Figure 2. How ICMS changed ARAT performance. (A) Session scores. “Prior performance” is the historical baseline; blue dots in that column are earlier sessions that sometimes included exploratory ICMS. Red lines are medians. Scores with ICMS are higher than both the historical baseline (p = 0.005) and the later sessions without ICMS (p = 0.029). (B) Histogram of successful trial times: blue with ICMS, gray without. Dotted lines mark the medians; hatched bars are trials finished in under five seconds. (C) Cumulative distribution of all trial times, including failures, on a logarithmic time axis. The vertical red marks show when 50% of successful trials were finished (\~10 s with ICMS, \~21 s without). Times to the left of the green line are under five seconds. Shading is a 95% confidence band. (D) Time spent in each phase. The large box plot is grasp; the two smaller plots are reach (top) and transport (bottom). Red lines are medians, boxes are interquartile ranges, and red crosses are outliers. Grasp time accounts for most of the improvement. From Flesher et al., 2021, Figure 2.</i>

The largest change was in the grasp phase: the median time from contact to liftoff fell by 66%, from 13.3 s without ICMS to 4.6 s with it (p \< 0.0001). That reduction accounted for 88% of the overall improvement in trial time. Median times in both the reaching and transport phases decreased by 25%. Once an object had been lifted, drops were rare: four with ICMS and five without, all from an unstable grasp rather than from the participant opening the hand.

In the object-transfer task, time spent in the object zone decreased by 30.3%, from 3.3 ± 1.2 s per transfer without ICMS to 2.3 ± 0.4 s with ICMS (p = 0.002). The hand also traveled less while near the object: mean path length in the object zone was 32.4 ± 5.9 cm per transfer with ICMS and 44.2 ± 13.1 cm without it (p = 0.0007). Time in the target zone decreased as well (p = 0.048); time in the transit zone did not. In total, 352 transfers were completed with ICMS and 315 without it. The mean number of transfers per two-minute trial rose from 15.8 ± 3.8 to 17.8 ± 2.4, a difference that was not statistically significant (p = 0.050).

![Figure 3. How ICMS changed object-transfer performance. (A) Time per transfer in the object, transit, and target zones (n = 20 trials per condition). Red lines are means; whiskers are one standard deviation. Object-zone and target-zone times fall with ICMS (p = 0.002 and p = 0.048); transit time does not. (B) Average path length in the object zone, in cm per transfer. The distribution shifts left with ICMS (p = 0.0007). (C) A spatial map of time spent in 2 × 2 cm squares of the workspace, in milliseconds per transfer. Without ICMS, the object zone lights up in darker red, meaning more time was spent right next to the object; with ICMS that hotspot is weaker. Dashed lines mark the zone boundaries. From Flesher et al., 2021, Figure 3.](/img/readApaper-26/flesher2021_fig3.jpg)

<i>Figure 3. How ICMS changed object-transfer performance. (A) Time per transfer in the object, transit, and target zones (n = 20 trials per condition). Red lines are means; whiskers are one standard deviation. Object-zone and target-zone times fall with ICMS (p = 0.002 and p = 0.048); transit time does not. (B) Average path length in the object zone, in cm per transfer. The distribution shifts left with ICMS (p = 0.0007). (C) A spatial map of time spent in 2 × 2 cm squares of the workspace, in milliseconds per transfer. Without ICMS, the object zone lights up in darker red, meaning more time was spent right next to the object; with ICMS that hotspot is weaker. Dashed lines mark the zone boundaries. From Flesher et al., 2021, Figure 3.</i>

On days when the functional tasks were done with ICMS, the participant completed fewer trials on the sequence-task decoder check, and the median endpoint translation velocity of the robot on that task was slightly slower. Decoder quality itself, measured without stimulation, was therefore not biased toward better arm control on the ICMS days.

## Analysis

The results point to a specific place in the movement where artificial touch helped. The ARAT success count did not rise; what changed was how long a successful grasp took. That is also where natural cutaneous signals are most distinctive: they mark state transitions such as object contact, which vision reports later and less precisely (Johansson & Flanagan, 2009). The object-transfer path lengths tell a similar story. With ICMS, the hand spent less time and traveled a shorter path in the object zone, consistent with fewer corrective adjustments once contact could be felt.

Smaller gains appeared even during reaching, before stimulation would have been triggered by contact. The authors attribute this to a change in how the participant approached the task: knowing that contact would be signaled, he could move toward the object with more speed and confidence. A similar state transition occurs when an object is released, which is a plausible reading of the more modest improvements during ARAT transport and in the object-transfer target zone.

Two further observations tie the improvement to the added sensory stream rather than to practice or to a lucky decoder. After about two years of relatively stable ARAT scores under vision, performance rose when reliable, blocked ICMS was introduced and returned to the earlier level when it was removed. The daily sequence task, always run without ICMS, was if anything slightly weaker on the ICMS days, so a better motor decoder does not explain the faster functional times.

The comparison is from one participant, on two tasks, in eight experimental sessions plus a long historical ARAT record. Within that record, the reversal—improvement on, return to baseline off—is the strongest evidence that the change tracks the presence of reliable tactile information. The paper also notes that two previous participants had reached similar vision-only ARAT scores with the same family of decoders, and that this participant exceeded those scores only when ICMS was added. Unlike sensory substitution, in which a person must learn to interpret a novel sound or visual cue, ICMS in area 1 produced an immediate benefit: the sensations were already localized to the hand and graded with force.

## Summary

In one person with chronic tetraplegia, a bidirectional BCI that supplemented vision with ICMS-evoked tactile sensations cut the median time of successful trials on a clinical grasp-and-place test roughly in half, from 20.9 s to 10.2 s. Most of that gain came from the grasp itself: the median interval from contact to liftoff fell from 13.3 s to 4.6 s. Vision was available throughout; the comparison is vision versus vision plus touch. A second, repetitive transfer task showed shorter, more direct approaches to the object, while the number of transfers per trial did not rise significantly. When the artificial touch was added after years of stable visual performance, times improved; when it was taken away, performance returned to baseline. The study shows that a neural interface designed around the usual roles of motor and somatosensory cortex can make brain-controlled grasp faster, in some trials reaching the clinical time criterion used for able-bodied ARAT performance.

## References and resources

- Flesher, S. N., Downey, J. E., Weiss, J. M., Hughes, C. L., Herrera, A. J., Tyler-Kabara, E. C., Boninger, M. L., Collinger, J. L., & Gaunt, R. A. (2021). <i>A brain-computer interface that evokes tactile sensations improves robotic arm control.</i> Science, 372(6544), 831–836. [doi.org/10.1126/science.abd0380](https://doi.org/10.1126/science.abd0380) · [PubMed Central author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715714/)
- Flesher, S. N., Collinger, J. L., Foldes, S. T., Weiss, J. M., Downey, J. E., Tyler-Kabara, E. C., Bensmaia, S. J., Schwartz, A. B., Boninger, M. L., & Gaunt, R. A. (2016). <i>Intracortical microstimulation of human somatosensory cortex.</i> Science Translational Medicine, 8(361), 361ra141. [doi.org/10.1126/scitranslmed.aaf8083](https://doi.org/10.1126/scitranslmed.aaf8083)
- Collinger, J. L., Wodlinger, B., Downey, J. E., Wang, W., Tyler-Kabara, E. C., Weber, D. J., McMorland, A. J., Velliste, M., Boninger, M. L., & Schwartz, A. B. (2013). <i>High-performance neuroprosthetic control by an individual with tetraplegia.</i> The Lancet, 381(9866), 557–564. [doi.org/10.1016/S0140-6736(12)61816-9](<https://doi.org/10.1016/S0140-6736(12)61816-9>)
- Wodlinger, B., Downey, J. E., Tyler-Kabara, E. C., Schwartz, A. B., Boninger, M. L., & Collinger, J. L. (2015). <i>Ten-dimensional anthropomorphic arm control in a human brain-machine interface: difficulties, solutions, and limitations.</i> Journal of Neural Engineering, 12(1), 016011. [doi.org/10.1088/1741-2560/12/1/016011](https://doi.org/10.1088/1741-2560/12/1/016011)
- Johansson, R. S., & Flanagan, J. R. (2009). <i>Coding and use of tactile signals from the fingers in object manipulation.</i> Nature Reviews Neuroscience, 10, 345–359. [doi.org/10.1038/nrn2621](https://doi.org/10.1038/nrn2621)
- Rothwell, J. C., Traub, M. M., Day, B. L., Obeso, J. A., Thomas, P. K., & Marsden, C. D. (1982). <i>Manual motor performance in a deafferented man.</i> Brain, 105(Pt 3), 515–542. [doi.org/10.1093/brain/105.3.515](https://doi.org/10.1093/brain/105.3.515)
- Monzée, J., Lamarre, Y., & Smith, A. M. (2003). <i>The effects of digital anesthesia on force control using a precision grip.</i> Journal of Neurophysiology, 89(2), 672–683. [doi.org/10.1152/jn.00434.2001](https://doi.org/10.1152/jn.00434.2001)
- Penfield, W., & Boldrey, E. (1937). <i>Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation.</i> Brain, 60(4), 389–443. [doi.org/10.1093/brain/60.4.389](https://doi.org/10.1093/brain/60.4.389)
- Delhaye, B. P., Long, K. H., & Bensmaia, S. J. (2018). <i>Neural basis of touch and proprioception in primate cortex.</i> Comprehensive Physiology, 8(4), 1575–1602. [doi.org/10.1002/cphy.c170033](https://doi.org/10.1002/cphy.c170033)
- Lyle, R. C. (1981). <i>A performance test for assessment of upper limb function in physical rehabilitation treatment and research.</i> International Journal of Rehabilitation Research, 4(4), 483–492.
- Yozbatiran, N., Der-Yeghiaian, L., & Cramer, S. C. (2008). <i>A standardized approach to performing the Action Research Arm Test.</i> Neurorehabilitation and Neural Repair, 22(1), 78–90. [doi.org/10.1177/1545968307305353](https://doi.org/10.1177/1545968307305353)
- [ClinicalTrials.gov](http://ClinicalTrials.gov). [NCT01894802](https://clinicaltrials.gov/study/NCT01894802)
- Figures 1–3 are from Flesher et al. (2021), taken from the PubMed Central author manuscript.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 7 分钟 · 2026-11-12 · Science, 21 May 2021</i>

拿起一只杯子，看起来像是眼睛在做的事，但告诉你手指已经碰到杯子、以及握得有多紧的，很大程度上是触觉。这篇论文问的是：如果把这条缺失的信息在大脑里补回去，一个用脑机接口控制机械臂的人，实际操作会不会变得更好。

## 背景

颈椎脊髓损伤之后，大脑往往仍能计划和尝试手臂、手部动作，但指令可能到不了肌肉。<b>四肢瘫痪</b>（tetraplegia）指的是双臂和双腿都受到影响的瘫痪。在颈椎损伤者里，将近一半把改善手臂和手部功能列为最优先的康复目标（Flesher 等, 2021）。

<b>脑机接口</b>（brain-computer interface, BCI）可以绕过这段受损通路。植入<b>运动皮层</b>（帮助产生运动的皮质区域）的电极，记录人在尝试运动时出现的神经活动，再由解码器把它转成假肢或其他设备的指令。这个研究组此前已经证明，这样的系统可以支持连续的伸手和抓握，甚至能同时控制多达十个维度，受试者也能完成上肢功能的临床评估（Collinger 等, 2013；Wodlinger 等, 2015）。那些早期演示主要依靠视觉。

视觉很擅长找到物体、把手当准，但很难替代触觉提供的时机和力度信息。皮肤中的感受器在接触发生的瞬间就会发放，并持续报告接触力如何变化。正因如此，你才知道已经碰到杯子、它是否开始滑动、以及何时可以安全举起。失去触觉反馈后，即使视力正常，简单的操作也会变得笨拙而缓慢（Rothwell 等, 1982；Johansson 与 Flanagan, 2009）。

对一部分截肢者，可以通过刺激周围神经来恢复感觉。这条路并不适用于四肢瘫痪：损伤平面以下的刺激无法把信息送到大脑。剩下的办法是直接作用于<b>体感皮层</b>（代表触觉的皮质区域）。其中称为<b>1 区</b>（area 1）的亚区，尤其与来自皮肤的触觉有关（Delhaye、Long 与 Bensmaia, 2018）。

<b>皮层内微刺激</b>（intracortical microstimulation, ICMS）是通过植入的微电极送入微小电脉冲。刺激体感皮层可以产生被体验为来自自己手的感觉，常常带有皮肤感觉的性质，并且可以通过选择电极和电流强度来调节位置和强度（Penfield 与 Boldrey, 1937；Flesher 等, 2016）。<b>双向脑机接口</b>把两个方向合在一起：用运动皮层的记录控制假肢，同时用体感皮层的刺激把触觉信息送回去。

## 问题

真正要回答的，不只是 ICMS 能不能引出感觉，而是这种感觉在实际使用中有没有帮助。先前的运动脑机接口已经能让人在有视觉的情况下伸手和抓握。许多关于人工触觉的测试会在去掉视觉后再测量表现，让新信号成为唯一可用的线索。

这项研究问的是一个更接近真实使用的问题：如果一个人已经能清楚地看见机械手，再加上由 ICMS 引出的触觉反馈，功能表现会不会提高？人工触觉能否承担自然触觉在抓握中的工作——及时标出接触和力度，并让人立刻用上？

## 方法

整套系统是一个有两半的闭环（图 1）。在运动一侧，运动皮层的活动被解码成五个同时控制的速度：三个用于手在空间中的位置，一个用于手腕旋转，一个用于张开和闭合手。在感觉一侧，机械手指上的传感器报告接触力，并实时转成对体感皮层的 ICMS。

研究只有一名受试者：一名在植入时 28 岁的男性，因 10 年前的 C5 运动 / C6 感觉 ASIA B 级脊髓损伤导致四肢瘫痪。ASIA B 表示损伤不完全，损伤平面以下仍保留部分感觉功能。研究在美国 FDA 的试验器械豁免下进行，注册号为 NCT01894802。

左侧半球植入了四组微电极阵列。两组各有 88 个有线电极，位于运动皮层的手和手臂代表区，用于记录运动意图。另外两组各有 32 个有线电极，位于体感皮层 1 区，用于刺激。引出的感觉，受试者描述为来自自己右手的手掌和手指，并具有皮肤感觉的性质。

每天都用观察法重新训练一个五自由度速度解码器。受试者观看假肢运动并想象自己在做同样的动作，再用最优线性估计把运动皮层发放率映射到这五个速度指令。校准过程中从不给予刺激，而且每一次试验他都能无遮挡地看见机械手。到这些实验开始时，他已经练习相关任务约两年。

机械手指的力矩传感器驱动刺激。食指力矩控制引出食指感觉的电极；中指力矩控制一组感觉投射到中指、无名指和小指的电极。脉冲串以每秒 100 个脉冲发放。电流幅度按线性关系，把约 0.1 Nm 的轻触力矩映射到约 0.5 Nm 的用力抓握，对应大约 14 到 64 µA（图 1D）。接触越强，感觉越强，不同手指也不会被压成一团无法分辨的刺激。

![图 1. 双向脑机接口概览。中间是受试者一边看着机械臂、一边控制它。(A) 五个连续控制的维度：手的位置、手腕旋转，以及手的张开和闭合。(B) 左侧半球的四组阵列：蓝色在运动皮层，用于记录；红色在体感皮层，用于刺激。(C) 手指力矩被映射到能在对应手指引出感觉的电极；彩色网格表示阵列位点与手指的对应关系。(D) 编码曲线：手指关节力矩（横轴，单位 Nm）在下限和上限之间被线性转换成刺激幅度（纵轴，单位 µA）。(E) 运动皮层活动的光栅图，经最优线性估计解码成五个速度。(F) 上肢动作研究测试（ARAT）：物体从绿点处被抓起，放到绿色平台上。(G) 物体转移任务：物体从灰色区域出发，经过红色过渡区，在绿色目标区放下。取自 Flesher 等，2021，Figure 1。](/img/readApaper-26/flesher2021_fig1.jpg)

<i>图 1. 双向脑机接口概览。中间是受试者一边看着机械臂、一边控制它。(A) 五个连续控制的维度：手的位置、手腕旋转，以及手的张开和闭合。(B) 左侧半球的四组阵列：蓝色在运动皮层，用于记录；红色在体感皮层，用于刺激。(C) 手指力矩被映射到能在对应手指引出感觉的电极；彩色网格表示阵列位点与手指的对应关系。(D) 编码曲线：手指关节力矩（横轴，单位 Nm）在下限和上限之间被线性转换成刺激幅度（纵轴，单位 µA）。(E) 运动皮层活动的光栅图，经最优线性估计解码成五个速度。(F) 上肢动作研究测试（ARAT）：物体从绿点处被抓起，放到绿色平台上。(G) 物体转移任务：物体从灰色区域出发，经过红色过渡区，在绿色目标区放下。取自 Flesher 等，2021，Figure 1。</i>

## 实验

每一次试验都有视觉。因此比较的是“只有视觉”和“视觉加上 ICMS 引出的触觉”，而不是在黑暗中单独使用触觉。两种条件按区组设计安排：前四个实验日提供由机械手接触驱动的 ICMS；后四个实验日用同样的流程，但不给刺激。更早一些把两种条件混在一起、并且刺激参数不固定的探索性实验，不作为主要比较。

主要的功能测试是改良版<b>上肢动作研究测试</b>（Action Research Arm Test, ARAT），这是一项上肢功能的临床评估（Lyle, 1981；Yozbatiran、Der-Yeghiaian 与 Cramer, 2008）。受试者要从八种物体中拿起一件，尽快放到升高的平台上。还加入了第九项：拿起一杯水，倒进另一只杯子，再把原来的杯子竖直放回桌面。每种物体每场尝试三次，单次最多两分钟，按 0 到 3 分计分。在五秒内完成转移得 3 分，这个时间被当作健全人表现的标准。九种物体各自取最好成绩后相加，一场满分是 27 分。

作者还测量了三个阶段：<b>伸手</b>（动作开始到第一次接触）、<b>抓握</b>（接触到提起）和<b>运送</b>（提到放下）。

在第二项任务中，受试者从桌子左侧（物体区）拿起物体，经过一段物体不应碰到桌面的过渡区，在右侧目标区放下，并在两分钟内尽可能多做几次。每场重复五轮。指标包括在各区域停留的时间、手在物体区走过的路径长度，以及成功转移的次数。

某一天解码器较好或较差，有可能被误当成刺激的效果，因此每天都会做一项随机目标序列任务，并且始终不给予 ICMS，以检验各自由度能否被独立控制。ARAT 分数和试验时间用 Wilcoxon 秩和检验比较；物体转移的指标呈正态分布，用 t 检验比较（每种条件各 20 次两分钟试验）。

## 结果

在有 ICMS 的四场中，ARAT 分数的中位数是 21（各场为 21、21、21 和 20）。随后没有 ICMS 的四场，中位数是 17（19、16、17 和 17），显著更低（p = 0.029）。有 ICMS 的场次也高于这次实验之前 23 个月里的 23 场（p = 0.005）。没有 ICMS 的四场与这段历史基线没有差别（p = 0.65）。历史记录里有少数场次曾探索性地用过 ICMS，但参数不固定，而且刺激与非刺激试验是混在一起的，而不是按区组进行。

分数提高，是因为成功的试验变快了，而不是因为完成的次数变多。在每种条件的全部尝试中（108 次：9 种物体 × 3 次 × 4 场），成功转移的次数没有变化（p = 0.83）。每场完成试验数的中位数，有 ICMS 时是 20，没有时是 21。真正改变的是速度。在成功的试验里，中位时间下降了 51.2%，从没有 ICMS 时的 20.9 秒（四分位距 13.1–40.5 秒）降到有 ICMS 时的 10.2 秒（5.5–18.1 秒；p \< 0.0001）。表示五秒内完成的 3 分，在没有 ICMS 的 108 次尝试中只出现 1 次，有 ICMS 时出现 15 次。有触觉反馈的试验中，有 14% 比没有 ICMS 时最快的那一次还要快。每一种物体的中位完成时间都更短，其中一半以上达到显著。

作者还提到 ARAT 分数提高了 3.5 分，这与两种条件各自四场平均分之差相符（20.75 对 17.25），并把这一变化解释为：九种物体里，又有 3.5 种能够在正常时间（五秒以内）被放到平台上。这个“3.5 种物体”指的是每种物体的最好一次尝试，也就是场次分数的计算方式；它和得到 3 分的那 15 次单独尝试不是同一个数字。

![图 2. ICMS 如何改变 ARAT 表现。(A) 各场分数。“Prior performance”是历史基线，该列中的蓝点是早期偶尔包含探索性 ICMS 的场次。红线是中位数。有 ICMS 的分数高于历史基线（p = 0.005），也高于后来没有 ICMS 的场次（p = 0.029）。(B) 成功试验时间的直方图：蓝色为有 ICMS，灰色为没有。虚线标出中位数；斜线填充的柱子是五秒内完成的试验。(C) 包含失败在内的全部试验时间的累积分布，横轴为对数时间。红色竖线标出 50% 的成功试验完成的时刻（有 ICMS 约 10 秒，没有时约 21 秒）。绿线左侧是五秒以内。阴影是 95% 置信带。(D) 各阶段所用时间。大的箱线图是抓握，右上是伸手，右下是运送。红线是中位数，方框是四分位距，红十字是离群值。抓握时间贡献了大部分提高。取自 Flesher 等，2021，Figure 2。](/img/readApaper-26/flesher2021_fig2.jpg)

<i>图 2. ICMS 如何改变 ARAT 表现。(A) 各场分数。“Prior performance”是历史基线，该列中的蓝点是早期偶尔包含探索性 ICMS 的场次。红线是中位数。有 ICMS 的分数高于历史基线（p = 0.005），也高于后来没有 ICMS 的场次（p = 0.029）。(B) 成功试验时间的直方图：蓝色为有 ICMS，灰色为没有。虚线标出中位数；斜线填充的柱子是五秒内完成的试验。(C) 包含失败在内的全部试验时间的累积分布，横轴为对数时间。红色竖线标出 50% 的成功试验完成的时刻（有 ICMS 约 10 秒，没有时约 21 秒）。绿线左侧是五秒以内。阴影是 95% 置信带。(D) 各阶段所用时间。大的箱线图是抓握，右上是伸手，右下是运送。红线是中位数，方框是四分位距，红十字是离群值。抓握时间贡献了大部分提高。取自 Flesher 等，2021，Figure 2。</i>

最大的变化发生在抓握阶段：从接触到提起的中位时间下降了 66%，从没有 ICMS 时的 13.3 秒降到有 ICMS 时的 4.6 秒（p \< 0.0001）。这一下降占总体试验时间改善的 88%。伸手和运送阶段的中位时间都下降了 25%。物体一旦被提起，掉落很少：有 ICMS 时 4 次，没有时 5 次，都是因为抓得不稳，而不是受试者主动张开了手。

在物体转移任务中，停留在物体区的时间下降了 30.3%，从没有 ICMS 时每次转移 3.3 ± 1.2 秒，降到有 ICMS 时的 2.3 ± 0.4 秒（p = 0.002）。手在物体附近走过的路径也更短：物体区的平均路径长度，有 ICMS 时是每次转移 32.4 ± 5.9 厘米，没有时是 44.2 ± 13.1 厘米（p = 0.0007）。目标区的时间同样下降（p = 0.048）；过渡区的时间没有变化。总共完成了 352 次有 ICMS 的转移，以及 315 次没有 ICMS 的转移。每次两分钟试验的平均转移次数从 15.8 ± 3.8 增加到 17.8 ± 2.4，这一差异没有达到统计显著（p = 0.050）。

![图 3. ICMS 如何改变物体转移表现。(A) 每次转移在物体区、过渡区和目标区的时间（每种条件 n = 20 次试验）。红线是均值，触须是一个标准差。物体区和目标区的时间随 ICMS 下降（p = 0.002 和 p = 0.048），过渡区没有下降。(B) 物体区平均路径长度，单位是每次转移的厘米数。有 ICMS 时分布向左移动（p = 0.0007）。(C) 工作空间按 2 × 2 厘米格子着色的时间地图，单位是每次转移的毫秒。没有 ICMS 时，物体区出现更深的红色，表示更多时间花在物体旁边；有 ICMS 时这个热点变弱。虚线是区域边界。取自 Flesher 等，2021，Figure 3。](/img/readApaper-26/flesher2021_fig3.jpg)

<i>图 3. ICMS 如何改变物体转移表现。(A) 每次转移在物体区、过渡区和目标区的时间（每种条件 n = 20 次试验）。红线是均值，触须是一个标准差。物体区和目标区的时间随 ICMS 下降（p = 0.002 和 p = 0.048），过渡区没有下降。(B) 物体区平均路径长度，单位是每次转移的厘米数。有 ICMS 时分布向左移动（p = 0.0007）。(C) 工作空间按 2 × 2 厘米格子着色的时间地图，单位是每次转移的毫秒。没有 ICMS 时，物体区出现更深的红色，表示更多时间花在物体旁边；有 ICMS 时这个热点变弱。虚线是区域边界。取自 Flesher 等，2021，Figure 3。</i>

在功能任务伴随 ICMS 的那些天，受试者在序列任务这项解码器检查中完成的试验更少，机械臂末端平移速度的中位数也略慢。因此，在不给予刺激时测到的解码质量，并没有偏向于让 ICMS 当天的机械臂控制更好。

## 分析

结果指向动作中一个具体的环节：人工触觉主要帮在了抓握上。ARAT 的成功次数并没有增加，改变的是一次成功抓握所需的时间。这也正是自然皮肤信号最有特点的地方：它们标记接触物体这类状态转换，而视觉对这一点的报告更晚、也不那么精确（Johansson 与 Flanagan, 2009）。物体转移中的路径长度说明了类似的事情。有了 ICMS，手在物体区停留的时间更短、走过的路也更短，这与一旦能感觉到接触、就更少做纠正调整是一致的。

在伸手阶段，也就是接触尚未触发刺激之前，也出现了较小的提高。作者把它归因于受试者接近物体的方式发生了变化：既然知道接触会被提示，他就可以更快、更有把握地伸过去。物体被放下时同样存在状态转换，这也可以用来理解 ARAT 运送阶段以及物体转移目标区里那些较温和的提高。

还有两点，把提高和额外练习或碰巧更好的解码器区分开来。在大约两年相对稳定的视觉 ARAT 分数之后，引入可靠、按区组安排的 ICMS，表现随之提高；撤掉之后，又回到原来的水平。每天都在无 ICMS 条件下进行的序列任务，在 ICMS 实验日上甚至略弱一些，所以并不是更好的运动解码器造成了更快的功能时间。

这一比较来自一名受试者、两项任务、八个实验日，再加上一段很长的历史 ARAT 记录。在这段记录里，最有力的证据是这种可逆变化：加上可靠触觉后提高，去掉后又回到基线。论文还提到，用同一类解码方法，此前两名受试者在只有视觉时达到过相近的 ARAT 分数；而这一名受试者只有在加入 ICMS 之后，才超过那些分数。这和感觉替代不同。感觉替代往往要让人重新学习如何理解一种新的声音或视觉提示；在 1 区给予 ICMS 带来的提高是立即出现的，因为感觉本身已经被体验为来自手、并随力度变化。

## 总结

在一名慢性四肢瘫痪的受试者中，一套在视觉之外补充 ICMS 触觉的双向脑机接口，把临床抓取放置测试中成功试验的中位时间大约缩短了一半，从 20.9 秒降到 10.2 秒。其中大部分来自抓握本身：从接触到提起的中位时间从 13.3 秒降到 4.6 秒。全程都有视觉；比较的是“只有视觉”和“视觉加触觉”。第二项重复性转移任务显示，接近物体时路径更短、更直接，但每次试验的转移次数没有显著增加。在多年稳定的视觉表现之后加上人工触觉，时间随之缩短；拿掉之后，表现回到基线。这项研究表明，一套按运动皮层和体感皮层通常分工来设计的神经接口，可以让脑控抓握更快，并在部分试验中达到 ARAT 里用于健全人表现的时间标准。

## 参考文献与资料

- Flesher, S. N., Downey, J. E., Weiss, J. M., Hughes, C. L., Herrera, A. J., Tyler-Kabara, E. C., Boninger, M. L., Collinger, J. L., & Gaunt, R. A. (2021). <i>A brain-computer interface that evokes tactile sensations improves robotic arm control.</i> Science, 372(6544), 831–836. [doi.org/10.1126/science.abd0380](https://doi.org/10.1126/science.abd0380) · [PubMed Central 作者稿](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715714/)
- Flesher, S. N., Collinger, J. L., Foldes, S. T., Weiss, J. M., Downey, J. E., Tyler-Kabara, E. C., Bensmaia, S. J., Schwartz, A. B., Boninger, M. L., & Gaunt, R. A. (2016). <i>Intracortical microstimulation of human somatosensory cortex.</i> Science Translational Medicine, 8(361), 361ra141. [doi.org/10.1126/scitranslmed.aaf8083](https://doi.org/10.1126/scitranslmed.aaf8083)
- Collinger, J. L., Wodlinger, B., Downey, J. E., Wang, W., Tyler-Kabara, E. C., Weber, D. J., McMorland, A. J., Velliste, M., Boninger, M. L., & Schwartz, A. B. (2013). <i>High-performance neuroprosthetic control by an individual with tetraplegia.</i> The Lancet, 381(9866), 557–564. [doi.org/10.1016/S0140-6736(12)61816-9](<https://doi.org/10.1016/S0140-6736(12)61816-9>)
- Wodlinger, B., Downey, J. E., Tyler-Kabara, E. C., Schwartz, A. B., Boninger, M. L., & Collinger, J. L. (2015). <i>Ten-dimensional anthropomorphic arm control in a human brain-machine interface: difficulties, solutions, and limitations.</i> Journal of Neural Engineering, 12(1), 016011. [doi.org/10.1088/1741-2560/12/1/016011](https://doi.org/10.1088/1741-2560/12/1/016011)
- Johansson, R. S., & Flanagan, J. R. (2009). <i>Coding and use of tactile signals from the fingers in object manipulation.</i> Nature Reviews Neuroscience, 10, 345–359. [doi.org/10.1038/nrn2621](https://doi.org/10.1038/nrn2621)
- Rothwell, J. C., Traub, M. M., Day, B. L., Obeso, J. A., Thomas, P. K., & Marsden, C. D. (1982). <i>Manual motor performance in a deafferented man.</i> Brain, 105(Pt 3), 515–542. [doi.org/10.1093/brain/105.3.515](https://doi.org/10.1093/brain/105.3.515)
- Monzée, J., Lamarre, Y., & Smith, A. M. (2003). <i>The effects of digital anesthesia on force control using a precision grip.</i> Journal of Neurophysiology, 89(2), 672–683. [doi.org/10.1152/jn.00434.2001](https://doi.org/10.1152/jn.00434.2001)
- Penfield, W., & Boldrey, E. (1937). <i>Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation.</i> Brain, 60(4), 389–443. [doi.org/10.1093/brain/60.4.389](https://doi.org/10.1093/brain/60.4.389)
- Delhaye, B. P., Long, K. H., & Bensmaia, S. J. (2018). <i>Neural basis of touch and proprioception in primate cortex.</i> Comprehensive Physiology, 8(4), 1575–1602. [doi.org/10.1002/cphy.c170033](https://doi.org/10.1002/cphy.c170033)
- Lyle, R. C. (1981). <i>A performance test for assessment of upper limb function in physical rehabilitation treatment and research.</i> International Journal of Rehabilitation Research, 4(4), 483–492.
- Yozbatiran, N., Der-Yeghiaian, L., & Cramer, S. C. (2008). <i>A standardized approach to performing the Action Research Arm Test.</i> Neurorehabilitation and Neural Repair, 22(1), 78–90. [doi.org/10.1177/1545968307305353](https://doi.org/10.1177/1545968307305353)
- [ClinicalTrials.gov](http://ClinicalTrials.gov). [NCT01894802](https://clinicaltrials.gov/study/NCT01894802)
- 图 1–3 取自 Flesher 等（2021）的 PubMed Central 作者稿。
