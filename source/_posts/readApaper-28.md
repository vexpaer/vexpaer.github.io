---
title: "readApaper#28 Walking naturally after spinal cord injury using a brain–spine interface"
title_zh: "readApaper#28 Walking naturally after spinal cord injury using a brain–spine interface"
date: 2026-11-14 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - spinal-cord-injury
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 14 November 2026 · Nature, 2023</i>

A spinal cord injury can leave the circuits that produce walking intact, yet cut the brain’s commands from reaching them. This paper describes a fully implanted wireless bridge that reconnects those two regions in one person, and it keeps two outcomes distinct: what the system can do while it is switched on, and what the person could still do after training when it was switched off.

## Background

Walking is not produced only in the brain. When you take a step, executive commands travel down to a network of neurons in the lower, or <b>lumbosacral</b>, spinal cord. Those spinal neurons then activate <b>motor pools</b> — groups of motor neurons — that drive the muscles of the hips, knees and ankles through the sequence needed to accept weight, push off, and swing the leg forward.

Most spinal cord injuries do not destroy those lumbar circuits. They damage the long pathways that carry the brain’s commands down to them. If those <b>descending pathways</b> are interrupted, the walking networks below the injury can still be anatomically present, yet they no longer receive the signals they need. The result is lasting paralysis of the legs.

That distinction matters, because it suggests a possible strategy: if the lumbar circuits are still there, they can be recruited from outside. One way to do this is <b>epidural electrical stimulation</b>. A paddle of electrodes is placed on the outer membrane of the cord (the dura), and brief pulses are delivered to the <b>dorsal root entry zones</b> — the places where sensory nerve roots enter the cord. Stimulating these entry zones can recruit specific leg motor pools. In earlier work, including the STIMO clinical trial, preprogrammed sequences of such stimulation restored standing and basic walking in people with paralysis (Wagner et al., 2018; Rowald et al., 2022).

Those earlier systems did not read the brain. To start each stimulation sequence, they relied on wearable motion sensors that detected leftover movement, or on compensatory strategies such as lifting a heel. Participants could walk in a basic way, but the control did not feel completely natural, and it was hard to adapt the legs to ramps, obstacles, stairs, or a sudden decision to start or stop.

A <b>brain–computer interface</b> takes a different starting point: electrodes record brain activity, and a decoder estimates what the person is trying to do. Here the recording is <b>electrocorticography</b> (ECoG) — an array of electrodes resting on the dura over the cerebral cortex, closer to the neurons than a scalp EEG. The decoded intention is then used to update spinal stimulation in real time. That is a <b>closed-loop motor system</b>: the loop runs from intended movement, through a digital bridge, to stimulation that helps produce the movement. It is not a sensory-feedback prosthesis. The system does not write touch or a sense of limb position back into the brain; any sensation the person has still comes from residual pathways, vision, and the feel of crutches or a walker.

The practical question is whether such a bridge can be made fully implantable, wireless, quick to calibrate, and stable enough for daily use — and whether practising with it can also change what the person can do when the bridge is off.

## Problem

The authors set out to restore a direct, volitional link between the brain and the lumbar spinal cord after injury. The aim was not only to trigger a pre-set stepping pattern, but to give the participant continuous control over the timing and amplitude of the muscle activity that makes standing and walking possible, including in settings that change from step to step.

That requires several pieces to work together: a stable recording of cortical activity related to leg movement; a decoder that can be calibrated in minutes and remain reliable; a library of spinal stimulation programs that can target the right motor pools; and a wireless chain that turns decoder output into analogue updates of those programs, fast enough to feel like walking rather than like operating a switch.

## Method

### The two implants and the wireless bridge

The <b>brain–spine interface</b> (BSI) combines two fully implanted systems with a wearable processing unit (Fig. 1a).

On the recording side, two WIMAGINE devices were placed epidurally over the left and right <b>sensorimotor cortex</b>, above the regions that respond to attempted lower-limb movements. Each implant is a 50 mm titanium case, the thickness of the skull, containing an 8-by-8 grid of 64 electrodes. Once in place, the devices sit flush in the bone and are not visible under the scalp. Because of wireless bandwidth, 32 of the 64 contacts on each implant were used, sampled at 586 Hz. A personalized headset holds two external antennas: one powers the implants by inductive coupling at 13.56 MHz; the other receives the ECoG signals at 402–405 MHz and sends them to a portable base station and processing unit.

On the stimulation side, a 16-electrode Specify 5-6-5 paddle lead sits epidurally over the dorsal root entry zones of the lumbosacral cord. It is driven by an ACTIVA RC implantable pulse generator, a device also used for deep brain stimulation, placed in an abdominal pocket. In this participant, the paddle and pulse generator had already been implanted during the earlier STIMO trial. The pulse generator was upgraded with wireless modules so that stimulation could be adjusted in real time, with a latency of about 100 ms.

The <b>wireless bridge</b> is the processing chain that sits between these two implants. It is not itself a third implant. The processing unit extracts spatial, temporal and spectral features from the ECoG, predicts the intended movement, and converts those predictions into updates of spinal stimulation programs. The updates are sent over a wireless link to the pulse generator.

![Figure 1. How to read this figure: panel a is the whole chain, from cortical recording, through a wearable processing unit, to a pulse generator and a 16-electrode spinal paddle that activates leg muscles. Panel b shows how anatomy and magnetoencephalography guided placement of the two 64-channel cortical implants over the leg region of sensorimotor cortex, with postoperative confirmation. Panel c shows the personalized spinal model used to position the paddle over the relevant dorsal root entry zones, again with postoperative images. From Lorach et al., 2023, Figure 1.](/img/readApaper-28/p28_fig1.png)

<i>Figure 1. How to read this figure: panel a is the whole chain, from cortical recording, through a wearable processing unit, to a pulse generator and a 16-electrode spinal paddle that activates leg muscles. Panel b shows how anatomy and magnetoencephalography guided placement of the two 64-channel cortical implants over the leg region of sensorimotor cortex, with postoperative confirmation. Panel c shows the personalized spinal model used to position the paddle over the relevant dorsal root entry zones, again with postoperative images. From Lorach et al., 2023, Figure 1.</i>

### How intention becomes stimulation

The decoder is a recursive, exponentially weighted Markov-switching multilinear model. It makes two kinds of prediction. A <b>gating</b> model, built around a hidden Markov model, estimates the probability that the person intends to move a particular joint — hip, knee or ankle on either side — or to remain at rest. Separate “expert” regression models then estimate the direction and relative amplitude of that intended movement. During calibration, the model can be updated online.

Those predictions do not simply switch stimulation on or off. They proportionally, or analogously, modulate the amplitude of preconfigured stimulation programs, within ranges that had been shown to recruit the intended muscles. For walking, the authors selected programs that target the muscle groups for weight acceptance, propulsion and swing, and linked them to the decoded probabilities. Updated commands were delivered to the pulse generator every 300 ms.

### Calibration

Setting up the BSI required two independent procedures (Fig. 2). First, the participant attempted left and right hip, knee and ankle movements while seated, so that the spatial and spectral ECoG features related to each intention could be identified (Fig. 2a). Second, electrode configurations and stimulation parameters — pulse width, frequency and amplitude range — were tuned so that each program recruited the intended muscle group, checked with electromyography (Fig. 2b). The two were then linked, first for a single joint, then for six joints plus rest, and finally for walking.

![Figure 2. How to read this figure: panel a maps the cortical features of an attempted left hip flexion; panel b shows how a stimulation configuration is tuned to the left hip flexors, with a polar plot of the resulting muscle responses. In panel c, a short calibration (left) is followed by a test (right): the spectrogram, decoding probability, stimulation amplitude, muscle activity and hip torque rise and fall together, and accuracy climbs to 97% in about 90 seconds. Panels d and e extend the same idea to both legs and three joints, with confusion matrices for decoding and for the muscles actually recruited by stimulation. From Lorach et al., 2023, Figure 2.](/img/readApaper-28/p28_fig2.png)

<i>Figure 2. How to read this figure: panel a maps the cortical features of an attempted left hip flexion; panel b shows how a stimulation configuration is tuned to the left hip flexors, with a polar plot of the resulting muscle responses. In panel c, a short calibration (left) is followed by a test (right): the spectrogram, decoding probability, stimulation amplitude, muscle activity and hip torque rise and fall together, and accuracy climbs to 97% in about 90 seconds. Panels d and e extend the same idea to both legs and three joints, with confusion matrices for decoding and for the muscles actually recruited by stimulation. From Lorach et al., 2023, Figure 2.</i>

## Experiments

The work is a clinical feasibility study, STIMO-BSI (NCT04632290), in a single participant: a 38-year-old man with an <b>incomplete</b> cervical (C5/C6) spinal cord injury from a biking accident ten years earlier. Incomplete here means that some residual pathways through the injury were still present.

He had already completed STIMO (NCT02936453): a five-month rehabilitation programme with targeted epidural stimulation, which allowed him to step with a front-wheel walker when stimulation was on, followed by about three years of home use of stimulation alone. By the time he enrolled in STIMO-BSI, that recovery had plateaued. He had recovered some mobility without stimulation, but he had difficulty going from standing to walking and stopping, could walk only on flat surfaces, and could not adapt his legs to ramps, obstacles or stairs.

The cortical implants were then added. After a two-week rest, there was a six-week mapping and calibration period (30 sessions), then 15 weeks of neurorehabilitation with physiotherapists: 40 sessions of one to three hours. Training emphasized the hip flexors, which were more impaired, and mixed BSI-supported walking, single-joint work, balance, and standard physiotherapy. After this, he could keep using the system at home.

The tests fall into two groups, and they answer different questions.

The first group asks what the BSI does <b>while it is on</b>: calibration accuracy; voluntary hip flexion and walking with the BSI on versus off; walking with the same stimulation programs controlled by foot-mounted motion sensors instead of the brain decoder; walking on ramps, stairs, obstacles and changing terrain; and stability of signals, decoding and stimulation over months, including unsupervised home use with a walker that housed the hardware.

The second group asks what changed after BSI-supported rehabilitation <b>when stimulation was off</b>: lower-limb motor scores, a change in the light-touch sensory score, the Walking Index for Spinal Cord Injury (WISCI II), a six-minute walk test, independent standing time, the timed up-and-go test, the Berg Balance Scale, and walking quality scored from video by physiotherapists who were blinded to the study. The photographs and scores in Figure 4 were all collected without stimulation.

## Results

### A decoder that could be calibrated in minutes

In the first sessions after surgery, the participant used the decoder to control the hip flexion of an avatar on a screen. With stimulation added, from a lying position, he could control hip-muscle activity and produce torque with 97% accuracy in less than two minutes (97 ± 0.4% after 90 s; Fig. 2c). When the same framework was extended to seven states — left and right hip, knee and ankle, plus rest — gradual control of each joint reached 74 ± 7% accuracy, against a 14% chance level (Fig. 2d,e). The decoder latency for these seven states was 1.1 ± 0.15 s.

For walking, five minutes of calibration were enough for continuous control of hip-flexor activity. During standing, attempts to lift the foot produced about five times more hip-flexor activity with the BSI on than with it off (Fig. 3a).

### Walking with the system on

The same configuration supported walking with crutches (Fig. 3b). With the BSI on, decoding of left and right steps rose and fell with intended steps, stimulation amplitudes followed, and the hip flexors and ankle trajectory produced a regular gait. When the BSI was turned off in the middle of walking, the participant immediately lost the ability to take any step, even though the decoder still registered attempts to walk in the cortical signal. Walking resumed as soon as the system was turned back on. He could also choose to start, keep walking, stop, or stand still without false-positive detections that would have disturbed standing. Berg Balance Scale scores were not reduced with the BSI on; they were slightly improved.

Compared with the same stimulation programs driven in a closed loop by motion sensors on the feet, walking on a treadmill with the BSI had gait features closer to those of healthy walkers. The participant also reported a frequent mismatch in timing when stimulation was triggered from the sensors, which made overground walking harder under that condition. With the BSI, he could walk overground independently with crutches.

The same BSI configuration, without retuning for each task, supported walking up and down a steep ramp — about twice as fast as without stimulation — as well as stairs, obstacles, and surfaces that changed underfoot. Outdoors, he could walk with the system and pause voluntarily without spurious step detections (Fig. 3e).

### Stability during a year of use, including at home

After a transitional first month in which the spectral content of the ECoG changed modestly, signals remained stable, with an average decrease in spectral power of 0.03 dB per day. The same decoder still supported gradual control of six joints after a two-month gap. Decoding of hip flexions during walking stayed high from the first session after implantation (accuracy 0.92 ± 0.1) through 2, 6 and 11 months after the first activation with updated models (0.93 ± 0.1, 0.97 ± 0.1 and 0.97 ± 0.1; Fig. 3f). Signal quality and walking-decoding accuracy remained globally unchanged over nearly a year. The useful ranges of stimulation amplitude, and the stimulation thresholds, were also stable over a year. The decoder was recalibrated when the participant or the physiotherapists judged it useful, but the decoder features themselves remained stable. Over time, the depth of cortical modulation increased, indicating that the participant became better at modulating his own cortical activity while using the BSI.

For home use, the hardware was built into a walker with a simple tactile interface. Setup, including checking the headset and setting stimulation amplitude bounds, took less than five minutes and could be done without assistance. He used the system regularly for seven months with stable decoding, and rated security, skilfulness and the ability to participate at the maximum of a standard assistive-device questionnaire (PIADS).

![Figure 3. How to read this figure: panel a compares a standing hip flexion with the BSI off and on; muscle activity and knee elevation increase when the system is on. Panel b is the key on/off test during walking: stimulation and steps stop when the BSI is switched off, even though cortical attempts are still decoded, and both resume when it is switched back on. Panel e shows outdoor walking and a voluntary pause without false step detections. Panel f tracks decoding of hip flexions from the first sessions through 11 months. From Lorach et al., 2023, Figure 3.](/img/readApaper-28/p28_fig3.png)

<i>Figure 3. How to read this figure: panel a compares a standing hip flexion with the BSI off and on; muscle activity and knee elevation increase when the system is on. Panel b is the key on/off test during walking: stimulation and steps stop when the BSI is switched off, even though cortical attempts are still decoded, and both resume when it is switched back on. Panel e shows outdoor walking and a voluntary pause without false step detections. Panel f tracks decoding of hip flexions from the first sessions through 11 months. From Lorach et al., 2023, Figure 3.</i>

### Recovery measured with the system off

These results describe what the bridge did while it was on. A separate set of measurements, all made without stimulation, asked whether BSI-supported rehabilitation added anything after the earlier plateau (Fig. 4).

After the 40 sessions, voluntary control of the hip flexors, and the hip flexion movements themselves, improved without stimulation (Fig. 4c). This was accompanied by a 4-point gain in the light-touch sensory score and by further change in lower-limb motor scores, which had gone from 23 before STIMO to 29 after STIMO, remained 29 just before BSI rehabilitation, and reached 31 afterwards (Fig. 4d). Standing and walking capacity, scored on WISCI II, rose from 6 before STIMO to 16 after STIMO-BSI. In practical terms, after BSI-supported rehabilitation the participant could walk more than 10 metres with crutches, with no physical assistance and no stimulation. The six-minute walk distance, which had plateaued during years of stimulation-only home use, increased further after this programme (Fig. 4f). Independent standing time increased by 593%, the timed up-and-go improved by 72%, and the Berg Balance Scale improved by 73% (Fig. 4g). Walking quality, scored from the same videos by six blinded physiotherapists, also improved (Fig. 4h).

These off-system changes showed up in daily life: walking independently around the house, getting in and out of a car, or standing with friends at a bar. They are improvements in residual function, measured with crutches or a walker as the tests required. They are not a return to walking without any aid.

![Figure 4. How to read this figure: every panel concerns function without stimulation. Panel a compares walking before STIMO, after stimulation-only rehabilitation, and after BSI-supported rehabilitation. Panel b is the timeline of the two trials. Panel c shows larger voluntary hip flexion and flexor muscle activity after the BSI programme. Panels d–h report motor scores, WISCI II, the six-minute walk, standing and balance tests, and blinded observational gait scores. From Lorach et al., 2023, Figure 4.](/img/readApaper-28/p28_fig4.png)

<i>Figure 4. How to read this figure: every panel concerns function without stimulation. Panel a compares walking before STIMO, after stimulation-only rehabilitation, and after BSI-supported rehabilitation. Panel b is the timeline of the two trials. Panel c shows larger voluntary hip flexion and flexor muscle activity after the BSI programme. Panels d–h report motor scores, WISCI II, the six-minute walk, standing and balance tests, and blinded observational gait scores. From Lorach et al., 2023, Figure 4.</i>

## Analysis

The study therefore reports two related but distinct results in the same person.

The first is prosthetic function. While the BSI is on, cortical intention is translated into analogue updates of lumbar epidural stimulation, and that link is sufficient for this participant to stand, walk, climb stairs and handle changing terrain, including outside the laboratory. Turning the system off during early walking tests immediately removed the ability to step, even though the intention was still visible in the cortical recording. At that stage, the digital bridge — not residual descending drive alone — was what made the step happen.

The second is neurological recovery after training. Following a plateau that had lasted through three years of stimulation-only use, a rehabilitation programme that coupled the person’s own intended movements to spinal stimulation produced further gains that were still there when the system was off. The largest motor change was in the hip flexors, which had been the main target of the training. A modest gain in light-touch sensation was also recorded. These residual sensory changes are not evidence that the BSI itself delivered artificial sensory feedback; the implanted loop is a motor bridge.

The word “natural” in the paper is doing specific work. It refers to the participant’s report that he could control the timing and size of his own steps, to the absence of a timing mismatch that had appeared with motion-sensor triggers, and to gait features that were closer to those of uninjured walkers than stimulation alone. It does not mean that walking became equivalent to walking before the injury. After rehabilitation he still used crutches, and many of the clinical walking tests used a walker.

Because residual pathways and the prosthetic stimulation converge on the same lumbar neurons, a continuous match between intention and stimulation is a plausible way to drive further reorganization of the remaining connections between brain and spinal cord. That reading is consistent with the fact that additional recovery appeared only after the BSI programme, once stimulation-only training had already plateaued, and with earlier animal and clinical work on brain-controlled stimulation. The evidence here is from one person with an incomplete cervical injury who already had long experience with epidural stimulation. It shows what was possible in that setting.

## Summary

In one person with a chronic incomplete cervical spinal cord injury, a fully implanted, wireless brain–spine interface linked ECoG recordings of intended leg movements to analogue modulation of lumbar epidural stimulation. With the system on, he could stand, walk, climb stairs and move over complex terrain, and he later used the system independently at home for months. After a rehabilitation programme supported by that bridge, he also recovered further residual function: he could walk overground with crutches even when the interface was switched off. The two results should be kept apart. The first is what the digital bridge does while it is running. The second is a partial, but practically meaningful, change in what the body could still do without it.

## References

- Lorach, H., Galvez, A., Spagnolo, V., et al. (2023). <i>Walking naturally after spinal cord injury using a brain–spine interface.</i> Nature, 618, 126–133. [doi.org/10.1038/s41586-023-06094-5](https://doi.org/10.1038/s41586-023-06094-5) · [Nature](https://www.nature.com/articles/s41586-023-06094-5) · [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10232367/)
- Wagner, F. B., et al. (2018). <i>Targeted neurotechnology restores walking in humans with spinal cord injury.</i> Nature, 563, 65–71. [doi.org/10.1038/s41586-018-0649-2](https://doi.org/10.1038/s41586-018-0649-2)
- Rowald, A., et al. (2022). <i>Activity-dependent spinal cord neuromodulation rapidly restores trunk and leg motor functions after complete paralysis.</i> Nature Medicine, 28, 260–271. [doi.org/10.1038/s41591-021-01663-5](https://doi.org/10.1038/s41591-021-01663-5)
- Clinical trials: STIMO-BSI, NCT04632290; STIMO, NCT02936453.
- Figures 1–4 are from Lorach et al. (2023).

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-14 · Nature, 2023</i>

脊髓损伤常常并不毁掉负责走路的脊髓回路，而是切断大脑指令到达这些回路的通路。这篇论文介绍的，是在一名患者身上用全植入、无线的“数字桥”重新连接这两个区域。阅读时需要分清两种结果：系统打开时能够辅助完成什么，以及训练之后、系统关闭时患者自身还能做到什么。

## 背景

走路并不只发生在大脑里。迈出一步时，执行性指令会下行到位于脊髓下段、也就是<b>腰骶段</b>的神经元网络。这些脊髓神经元再去激活相应的<b>运动神经元池</b>，让髋、膝、踝的肌肉按顺序完成承重、蹬伸和摆腿。

大多数脊髓损伤并不会直接破坏这些腰段回路，而是损伤把大脑指令向下传递的长传导束。一旦这些<b>下行通路</b>被打断，损伤平面以下的步行网络在解剖上仍可能存在，却收不到所需的指令，结果就是下肢的持续性瘫痪。

这个区分很重要，因为它提示了一种修复思路：如果腰段回路还在，也许可以从外部把它们重新招募起来。其中一条路是<b>硬膜外电刺激</b>。把一组电极放在脊髓外膜（硬膜）上，向<b>背根进入区</b>——感觉神经根进入脊髓的位置——施加短脉冲，就可以招募特定的下肢运动神经元池。在更早的工作里，包括 STIMO 临床试验，按预设时空序列施加这样的刺激，已经能让瘫痪患者重新站立并完成基本步行（Wagner et al., 2018; Rowald et al., 2022）。

那些系统并不读取大脑信号。每一段刺激序列的启动，要靠穿戴式运动传感器去捕捉残余动作，或者靠患者用抬脚跟一类代偿策略来触发。患者可以走起来，但控制并不完全自然，也很难根据坡道、障碍、楼梯，或临时决定的起步与停止，去调整腿部动作。

<b>脑机接口</b>则从另一端入手：用电极记录脑活动，再由解码器估计患者想做什么。这里采用的记录方式是<b>皮层脑电</b>（ECoG），也就是把电极阵列放在大脑皮层外的硬膜上，比头皮脑电更靠近神经元。解码出的运动意图再被用来实时更新脊髓刺激。这是一套<b>闭环运动系统</b>：回路从“想要移动”，经过数字桥，再到帮助完成动作的刺激。它不是感觉反馈假体。系统并没有把触觉或肢体位置觉写回大脑；患者此时拥有的感觉，仍然来自残留通路、视觉，以及拐杖或助行器的接触。

接下来要回答的实际问题是：这样的桥能否做成全植入、无线、几分钟内可校准、并且稳定到足以日常使用；以及，用它来训练，会不会也改变系统关闭之后患者自己还能做的事情。

## 问题

作者希望在损伤之后，重新建立大脑与腰段脊髓之间直接、可由意志控制的连接。目标不只是触发一套预设的踏步模式，而是让患者能够连续控制站立和行走所需肌肉活动的时机与幅度，并在一步与下一步之间条件就会变化的环境中使用。

这需要几部分同时工作：稳定记录与下肢运动有关的皮层活动；一套能在几分钟内校准、并且保持可靠的解码器；一个能够瞄准正确运动神经元池的脊髓刺激程序库；以及一条无线链路，把解码结果变成对这些程序的模拟（连续）更新，快到让人感觉像在走路，而不是在按开关。

## 方法

### 两套植入装置和无线桥

这套<b>脑–脊髓接口</b>（brain–spine interface, BSI）由两套全植入系统，再加上一个可穿戴处理单元组成（图 1a）。

在记录一侧，两台 WIMAGINE 装置被硬膜外放置在左右<b>感觉运动皮层</b>、对下肢运动尝试有反应的区域上方。每台植入物是直径 50 mm、厚度与颅骨相当的钛壳，内含 8×8 共 64 个电极。就位后，装置与骨面齐平，头皮外看不出来。受无线带宽限制，每台实际使用 64 个触点中的 32 个，采样率为 586 Hz。个性化头戴装置里有两根体外天线：一根以 13.56 MHz 电感耦合为植入物供电；另一根在 402–405 MHz 接收 ECoG 信号，送到便携式基站和处理单元。

在刺激一侧，一根 16 电极的 Specify 5-6-5 电极板硬膜外覆盖在腰骶段背根进入区上，由放置在腹部皮下囊袋中的 ACTIVA RC 植入式脉冲发生器驱动，这种脉冲发生器也常用于帕金森病的脑深部刺激。在这名患者身上，电极板和脉冲发生器已经在更早的 STIMO 试验中植入。这次为脉冲发生器增加了无线通信模块，使刺激能以大约 100 毫秒的延迟被实时调节。

所谓<b>无线桥</b>，就是夹在这两套植入装置之间的处理链路，它本身并不是第三套植入物。处理单元从 ECoG 中提取空间、时间和频谱特征，预测运动意图，再把预测转换成脊髓刺激程序的更新，并通过无线链路发送给脉冲发生器。

![Figure 1. 读图提示：面板 a 是整条链路，从皮层记录、可穿戴处理单元，到脉冲发生器和用于激活下肢肌肉的 16 电极脊髓电极板。面板 b 展示如何用解剖和脑磁图把两台 64 通道皮层植入物放到感觉运动皮层的腿区，并给出术后确认。面板 c 是用于把电极板放到相应背根进入区的个性化脊髓模型，同样附有术后影像。取自 Lorach 等，2023，Figure 1。](/img/readApaper-28/p28_fig1.png)

<i>Figure 1. 读图提示：面板 a 是整条链路，从皮层记录、可穿戴处理单元，到脉冲发生器和用于激活下肢肌肉的 16 电极脊髓电极板。面板 b 展示如何用解剖和脑磁图把两台 64 通道皮层植入物放到感觉运动皮层的腿区，并给出术后确认。面板 c 是用于把电极板放到相应背根进入区的个性化脊髓模型，同样附有术后影像。取自 Lorach 等，2023，Figure 1。</i>

### 意图如何变成刺激

解码器是一个递归、指数加权的马尔可夫切换多线性模型。它同时做两类预测。<b>门控</b>模型建立在隐马尔可夫模型上，估计患者打算活动哪一个关节——左侧或右侧的髋、膝、踝——或者保持静止。另外一组“专家”回归模型再估计该意图运动的方向和相对幅度。校准过程中，模型可以在线更新。

这些预测并不是简单地把刺激打开或关掉，而是按比例、也就是以模拟方式，调节预先配置好的刺激程序的幅度，并且限制在已经验证能招募目标肌肉的范围内。用于步行时，作者从程序库中选出针对承重、蹬伸和摆腿肌群的程序，并把它们与解码概率联系起来。更新后的指令每 300 毫秒发送给脉冲发生器一次。

### 校准

建立 BSI 需要两套彼此独立的步骤（图 2）。第一，患者坐位下尝试左右髋、膝、踝的运动，以识别与每种意图相关的 ECoG 空间和频谱特征（图 2a）。第二，调整电极配置和刺激参数——脉宽、频率和幅度范围——使每个程序招募到目标肌群，并用肌电图检查（图 2b）。随后把两者连接起来，先用于单个关节，再扩展到双侧六个关节加静息，最后用于步行。

![Figure 2. 读图提示：面板 a 给出一次左侧屈髋尝试的皮层特征；面板 b 展示如何把刺激配置调向左侧屈髋肌，极坐标图是相应的肌肉反应。面板 c 左侧是校准、右侧是测试：频谱图、解码概率、刺激幅度、肌肉活动和髋关节力矩一起起伏，准确率在大约 90 秒内升到 97%。面板 d 和 e 把同一思路扩展到双腿三个关节，并给出解码以及刺激实际招募到的肌肉的混淆矩阵。取自 Lorach 等，2023，Figure 2。](/img/readApaper-28/p28_fig2.png)

<i>Figure 2. 读图提示：面板 a 给出一次左侧屈髋尝试的皮层特征；面板 b 展示如何把刺激配置调向左侧屈髋肌，极坐标图是相应的肌肉反应。面板 c 左侧是校准、右侧是测试：频谱图、解码概率、刺激幅度、肌肉活动和髋关节力矩一起起伏，准确率在大约 90 秒内升到 97%。面板 d 和 e 把同一思路扩展到双腿三个关节，并给出解码以及刺激实际招募到的肌肉的混淆矩阵。取自 Lorach 等，2023，Figure 2。</i>

## 实验

这项工作是临床可行性研究 STIMO-BSI（NCT04632290），只有一名参与者：一名 38 岁男性，十年前因骑行事故造成<b>不完全性</b>颈段（C5/C6）脊髓损伤。所谓不完全，是指损伤部位仍保留部分残存通路。

他此前已经完成 STIMO（NCT02936453）：为期五个月、由靶向性硬膜外刺激支持的康复，使他在刺激打开时能借助前轮助行器迈步；随后大约三年在家中单独使用刺激。参加 STIMO-BSI 时，这一恢复已经进入平台期。没有刺激时他也恢复了部分活动能力，但从站立转到行走、以及停下都比较困难，只能在平坦地面行走，无法让下肢适应坡道、障碍或楼梯。

随后加装了皮层植入物。休息两周后，先进行六周的标测与校准（30 次训练），再由物理治疗师进行 15 周神经康复：共 40 次、每次一至三小时的训练。训练更侧重受损更明显的屈髋肌，内容包括 BSI 辅助步行、单关节练习、平衡训练和常规物理治疗。结束后，他可以在家中继续使用这套系统。

测试分成两组，回答的问题并不相同。

第一组问的是：BSI <b>打开时</b>能做什么。包括校准准确率；系统开、关条件下的自主屈髋和步行；用脚上运动传感器、而不是脑解码器，去闭环控制同一套刺激程序时的步行；在坡道、楼梯、障碍和变化地面上行走；以及数月内信号、解码和刺激的稳定性，也包括把硬件放进助行器、在家中独立使用。

第二组问的是：在 BSI 支持的康复之后，<b>刺激关闭时</b>发生了什么变化。指标包括下肢运动评分、轻触觉感觉评分的变化、脊髓损伤步行指数（WISCI II）、六分钟步行试验、独立站立时间、计时起立行走、Berg 平衡量表，以及由对研究设计不知情的物理治疗师根据录像给出的步行质量评分。图 4 中的照片和分数都是在没有刺激的情况下采集的。

## 结果

### 几分钟内可以校准的解码器

手术后最初的几次训练中，患者先用解码器控制屏幕上虚拟形象的屈髋。加入刺激后，他在卧位下用不到两分钟就能控制髋部肌肉活动并产生力矩，准确率为 97%（90 秒后达到 97 ± 0.4%；图 2c）。把同一框架扩展到七个状态——左右髋、膝、踝，再加上静息——对各关节的渐进控制准确率为 74 ± 7%，随机水平只有 14%（图 2d,e）。这七个状态的解码延迟为 1.1 ± 0.15 秒。

用于步行的校准只需五分钟，就能连续控制屈髋肌活动。站立时抬脚，BSI 打开时的屈髋肌活动大约是关闭时的五倍（图 3a）。

### 系统打开时的步行

同一配置也支持拄拐行走（图 3b）。BSI 打开时，左右步的解码随意图起伏，刺激幅度随之变化，屈髋肌和踝关节轨迹形成规律步态。走到中途关掉 BSI，患者立刻无法再迈出任何一步，尽管解码器仍然能从皮层信号里检测到行走尝试。系统重新打开后，步行立即恢复。他还可以自己决定起步、连续走、停下或安静站立，而不会出现干扰站立的假阳性检测。打开 BSI 并没有损害 Berg 平衡量表得分，反而略有提高。

与用脚上运动传感器闭环驱动同一套刺激程序相比，用 BSI 在跑步机上行走时的步态特征更接近健康人。患者还报告，由传感器触发刺激时经常出现时间错位，这会妨碍平地行走。使用 BSI 时，他可以拄着拐杖在平地上独立行走。

同一套 BSI 配置无需按任务重新调节，就能支持上下陡坡——大约比无刺激快一倍——以及上下楼梯、跨越障碍和在变化的地面上行走。在户外，他可以带着系统行走，并在主动暂停时不出现错误的迈步检测（图 3e）。

### 一年使用中的稳定性，包括居家使用

在最初一个月的过渡期里，ECoG 各频段的频谱内容有过轻度变化；此后信号保持稳定，频谱功率平均每天只下降 0.03 dB。同一解码器在间隔两个月后，仍能支持对六个关节的渐进控制。步行中屈髋解码始终保持在高位：植入后第一次使用时准确率为 0.92 ± 0.1；在首次用更新模型启动 BSI 之后的第 2、6、11 个月，分别为 0.93 ± 0.1、0.97 ± 0.1 和 0.97 ± 0.1（图 3f）。近一年里，信号质量和步行解码准确率整体没有明显下降。刺激的有效幅度范围和阈值在一年中也保持稳定。当患者或治疗师认为有必要时会重新校准，但解码器特征本身保持稳定。随着时间推移，皮层调制深度增强，说明患者在使用 BSI 时，对自己皮层活动的调节变得更好。

居家使用时，硬件被集成进一台助行器，并用简单的触控界面操作。完成设置——包括检查头戴装置位置、设定刺激幅度上下限——不到五分钟，而且无需他人协助。他规律使用该系统七个月，解码表现稳定，并在标准辅助器具问卷（PIADS）中，把安全性、熟练程度和参与能力都评为最高分。

![Figure 3. 读图提示：面板 a 比较站立屈髋在 BSI 关闭和打开时的表现，系统打开后肌肉活动和膝部抬高都增加。面板 b 是步行中的开/关关键试验：关掉 BSI 后，刺激和迈步都停止，尽管皮层里仍能解码到尝试；重新打开后两者恢复。面板 e 是户外行走和一次主动暂停，没有错误的迈步检测。面板 f 追踪从最初使用到 11 个月的屈髋解码。取自 Lorach 等，2023，Figure 3。](/img/readApaper-28/p28_fig3.png)

<i>Figure 3. 读图提示：面板 a 比较站立屈髋在 BSI 关闭和打开时的表现，系统打开后肌肉活动和膝部抬高都增加。面板 b 是步行中的开/关关键试验：关掉 BSI 后，刺激和迈步都停止，尽管皮层里仍能解码到尝试；重新打开后两者恢复。面板 e 是户外行走和一次主动暂停，没有错误的迈步检测。面板 f 追踪从最初使用到 11 个月的屈髋解码。取自 Lorach 等，2023，Figure 3。</i>

### 系统关闭后测到的恢复

以上结果描述的是桥在打开时做了什么。另一组测量全部在没有刺激的条件下进行，用来看 BSI 支持的康复是否在早先的平台期之后又带来了新的变化（图 4）。

40 次训练结束后，患者在没有刺激时对屈髋肌的自主控制，以及屈髋动作本身，都有改善（图 4c）。与此同时，轻触觉感觉评分提高了 4 分；下肢运动评分则从 STIMO 前的 23 分升至 STIMO 后的 29 分，BSI 康复前仍为 29 分，之后达到 31 分（图 4d）。用 WISCI II 评定的站立和行走能力，从 STIMO 前的 6 分升至 STIMO-BSI 后的 16 分。具体来说，经过 BSI 支持的康复后，患者可以在没有他人帮助、也没有刺激的情况下，拄拐行走 10 米以上。六分钟步行距离在仅使用刺激的居家训练年间已经进入平台期，在这一康复方案后又进一步增加（图 4f）。独立站立时间增加 593%，计时起立行走改善 72%，Berg 平衡量表改善 73%（图 4g）。由六位不知情的物理治疗师根据同一批录像评定的步行质量也有提高（图 4h）。

这些在系统关闭后测到的变化，也进入了日常生活：在房子里独立行走、进出汽车，或和朋友一起站在吧台前。它们是残存功能的改善，测试中仍然使用拐杖或助行器，并不是回到完全不借助辅具的行走。

![Figure 4. 读图提示：所有面板都是在没有刺激的条件下看功能。面板 a 比较 STIMO 前、仅刺激康复后，以及 BSI 支持的康复后的步行。面板 b 是两次试验的时间线。面板 c 显示 BSI 方案后更大的自主屈髋和屈肌活动。面板 d–h 分别是运动评分、WISCI II、六分钟步行、站立与平衡测试，以及盲法观察步态评分。取自 Lorach 等，2023，Figure 4。](/img/readApaper-28/p28_fig4.png)

<i>Figure 4. 读图提示：所有面板都是在没有刺激的条件下看功能。面板 a 比较 STIMO 前、仅刺激康复后，以及 BSI 支持的康复后的步行。面板 b 是两次试验的时间线。面板 c 显示 BSI 方案后更大的自主屈髋和屈肌活动。面板 d–h 分别是运动评分、WISCI II、六分钟步行、站立与平衡测试，以及盲法观察步态评分。取自 Lorach 等，2023，Figure 4。</i>

## 分析

因此，这项研究在同一个人身上报告了两种相关、但需要分开看待的结果。

第一种是假体功能。BSI 打开时，皮层意图被转成对腰段硬膜外刺激的模拟更新；对这名患者而言，这条链路足以支持站立、行走、上下楼梯，以及在实验室之外应对变化的地形。在早期步行测试中关掉系统，迈步能力立即消失，尽管皮层记录里仍然能看到意图。在那个阶段，让这一步发生的是数字桥，而不是单独的残存下行驱动。

第二种是训练之后的神经功能恢复。在仅使用刺激、并已经维持三年的平台期之后，一套把患者自己的运动意图与脊髓刺激耦合起来的康复方案，带来了系统关闭后仍然存在的进一步改善。运动方面最明显的变化出现在作为训练主要目标的屈髋肌；轻触觉也有小幅提高。这些残存感觉的变化，并不能说明 BSI 本身提供了人工感觉反馈——这套植入回路是一条运动桥。

论文里的“自然”，有具体所指。它指的是患者报告自己能够控制步伐的时机和幅度，指运动传感器触发时出现的那种时间错位在这里没有出现，也指步态特征比单独刺激时更接近未受伤行走者。它并不表示步行已经回到受伤前的水平。康复之后他仍然使用拐杖，许多临床步行测试也使用了助行器。

由于残存通路和假体刺激会聚到损伤以下同一批神经元，意图与刺激之间持续对齐，是推动大脑与脊髓之间残存连接进一步重组的一种合理机制。这一理解，与“仅刺激训练已经平台期之后、BSI 方案才带来额外恢复”这一观察相一致，也与此前关于脑控刺激的动物和临床工作相一致。这里的证据来自一名已有长期硬膜外刺激经验、损伤为不完全性颈髓损伤的患者，它说明的是在这一条件下能够实现什么。

## 总结

在一名慢性不完全性颈髓损伤患者身上，全植入、无线的脑–脊髓接口把记录运动意图的 ECoG，与腰段硬膜外刺激的模拟调节连接起来。系统打开时，他能够站立、行走、上下楼梯并在复杂地形中移动，之后还在家中独立使用了数月。在这套桥支持的康复之后，残存功能也有进一步恢复：即使接口关闭，他仍能拄拐在平地上行走。这两种结果应当分开看。前者是数字桥在运行时做的事情；后者是身体在没有它时仍能做到的、有实际意义但并不完全的改变。

## 参考文献

- Lorach, H., Galvez, A., Spagnolo, V., et al. (2023). <i>Walking naturally after spinal cord injury using a brain–spine interface.</i> Nature, 618, 126–133。[doi.org/10.1038/s41586-023-06094-5](https://doi.org/10.1038/s41586-023-06094-5) · [Nature](https://www.nature.com/articles/s41586-023-06094-5) · [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10232367/)
- Wagner, F. B., et al. (2018). <i>Targeted neurotechnology restores walking in humans with spinal cord injury.</i> Nature, 563, 65–71。[doi.org/10.1038/s41586-018-0649-2](https://doi.org/10.1038/s41586-018-0649-2)
- Rowald, A., et al. (2022). <i>Activity-dependent spinal cord neuromodulation rapidly restores trunk and leg motor functions after complete paralysis.</i> Nature Medicine, 28, 260–271。[doi.org/10.1038/s41591-021-01663-5](https://doi.org/10.1038/s41591-021-01663-5)
- 临床试验：STIMO-BSI，NCT04632290；STIMO，NCT02936453。
- Figure 1–4 取自 Lorach 等（2023）。
