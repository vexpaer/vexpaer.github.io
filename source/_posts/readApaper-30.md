---
title: "readApaper#30 Real-time brain-controlled selective hearing enhances speech perception in multi-talker environments"
title_zh: "readApaper#30 Real-time brain-controlled selective hearing enhances speech perception in multi-talker environments"
date: 2026-11-16 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - auditory-attention
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 16 November 2026 · Nature Neuroscience, 2026</i>

In a crowded room, the hard part of hearing is not making every sound louder. It is staying with the talker you care about while another conversation continues nearby. This paper asks whether a listener’s own brain signals can steer that choice in real time, and whether the resulting change in the audio actually makes speech easier to follow.

## Background

People are remarkably good at listening to one speaker in a mixture of voices, a skill often called the cocktail-party effect. The key is <b>selective attention</b>: the brain does not treat every sound equally. When you attend to one talker, auditory cortex carries a clearer trace of that talker’s voice, especially of its slowly varying loudness pattern, the <b>speech envelope</b>. The ignored talker is still present in the air, but it is represented more weakly in that neural trace.

This is why a conventional hearing aid can fail in the same setting. Many devices raise the level of whatever reaches the microphones. If two people are speaking at once, both voices get louder. The ratio that matters is the <b>target-to-masker ratio</b> (TMR): how much stronger the talker you want is than the competing talker. A negative TMR means the competitor is louder than the target, which is a difficult listening condition.

<b>Auditory attention decoding</b> (AAD) tries to close that gap with a brain–computer interface. The idea is to read neural activity, infer which talker the listener is attending to, and then boost that talker. Over the past decade, most AAD studies have asked how accurately this inference can be made, often from electroencephalography (EEG) recorded at the scalp. A smaller number have run the decoder in real time, and a few have closed the loop so that the decoder actually changes the sound the listener hears.

Two other distinctions are needed to read this paper. First, <b>attention decoding</b> is not the same as <b>speech separation</b>. Separation is the audio problem of pulling individual voices out of a mixture. Decoding is the neural problem of deciding which of those voices is the one you want. A practical device would eventually need both. Second, “hearing better” can mean more than one thing. <b>Intelligibility</b> is whether the words can be understood, usually tested with comprehension questions. <b>Listening effort</b> is how hard the listener has to work; one physiological proxy is pupil size, which tends to increase when the task is more demanding.

The recordings here are <b>intracranial EEG</b> (iEEG), made in patients who already had electrodes implanted for clinical epilepsy monitoring. Some of those electrodes are depth contacts (stereo-EEG), and some sit on the cortical surface as electrocorticography (ECoG) grids. Because they are closer to the tissue than scalp sensors, they can capture both low-frequency activity (1–30 Hz) and a high-frequency band called high-gamma (70–150 Hz), which is closely tied to local neural firing. The authors treat this as a high-resolution test of whether a closed-loop AAD system can deliver a perceptible benefit.

## Problem

The open question was not only whether attention can be decoded, but whether a real-time, brain-controlled hearing system can improve the listening experience itself. A closed-loop system has to be fast, stable, and accurate enough that changing the volume helps rather than distracts. If the decoder is late or often wrong, amplifying the wrong talker can make the scene harder.

The authors’ aim is to use high-resolution iEEG to build a closed-loop system that dynamically amplifies the attended talker, then test whether that system improves intelligibility, reduces effort, is preferred by listeners, and can follow both instructed and self-initiated switches of attention.

## Method

The system has a simple loop (Fig. 1a). The listener hears two overlapping conversations from loudspeakers 15° to the left and right. iEEG signals go into a subject-specific linear model that reconstructs the envelope of the attended speech from the previous 400 ms of low-frequency and high-gamma activity on speech-responsive electrodes. That reconstructed envelope is then compared, by Pearson correlation, with the actual envelopes of the two conversations, using a 4 s sliding window that hops forward every 0.5 s. The conversation with the higher correlation is treated as the attended one, and its level is raised relative to the other.

Gain is not flipped all at once. A five-state Markov model moves the TMR in steps of up to ±9 dB, while the overall acoustic power is held constant, so the scene gets rebalanced rather than simply turned up. In the main closed-loop sessions, the two conversation streams were available as separate sources, which let the authors change their relative levels directly and isolate the effect of attention-guided gain. A later control analysis asked what happens if those streams are first recovered by an algorithmic separator rather than taken as clean sources.

The work was split into an offline training phase and an online test phase. Offline, participants were cued to attend to one conversation for 26 trials of about 38 s, at several TMRs, while they also pressed a button whenever a word repeated in the attended stream. A decoder was trained and checked with leave-one-segment-out cross-validation, then frozen. Online, that same model ran in real time on new speech material; of eight talkers in this phase, four had not been heard in training. Participants were told they were continuing a listening task. They were not told that their brain activity was controlling the sound until a debriefing at the end.

![Figure 1. Experimental paradigm and offline AAD performance (Choudhari et al., 2026, Fig. 1). Panel a is the closed loop: two conversations, intracranial recordings, envelope reconstruction from high-gamma (HF) and low-frequency (LF) features, comparison with the two speech envelopes, and selective amplification. Panels b and c show, on a template brain, the speech-responsive electrodes from participants S1–S4 and how well single electrodes decode attention; the stronger sites cluster around superior temporal gyrus. Panels d and e show that offline accuracy rises as the decoding window lengthens and as more of the best electrodes are included. A 4 s window was later used online.](/img/readApaper-30/Fig1_paradigm_offline_AAD.png)

<i>Figure 1. Experimental paradigm and offline AAD performance (Choudhari et al., 2026, Fig. 1). Panel a is the closed loop: two conversations, intracranial recordings, envelope reconstruction from high-gamma (HF) and low-frequency (LF) features, comparison with the two speech envelopes, and selective amplification. Panels b and c show, on a template brain, the speech-responsive electrodes from participants S1–S4 and how well single electrodes decode attention; the stronger sites cluster around superior temporal gyrus. Panels d and e show that offline accuracy rises as the decoding window lengthens and as more of the best electrodes are included. A 4 s window was later used online.</i>

## Experiments

The closed-loop study enrolled four adults (S1–S4; three males aged 24, 29 and 38, and one female aged 21) who were undergoing epilepsy monitoring and who reported normal hearing. S1 and S3 had stereo-EEG plus a left-hemisphere ECoG grid, mainly over temporal cortex; S2 had right-hemisphere stereo-EEG; S4 had bilateral stereo-EEG. Speech-responsive electrodes, identified by comparing high-gamma activity during speech and silence, numbered 48, 38, 42 and 21, respectively. Neural data were recorded with Tucker-Davis Technologies hardware in S1–S3 and a Ripple Grapevine Trek system in S4. S2–S4 were native English speakers; S1 was not. The two conversations were naturalistic dialogues, with competing talkers of the same gender, mixed gender, or different genders, plus either pedestrian noise or multi-talker babble.

The online phase had three experiments.

In experiment 1, each of the four participants completed 20 trials of 38 s (80 trials in total). After a 10 s unrated start, they heard 14 s with the system off and the target at a difficult −6 dB TMR, then 14 s with the closed-loop system on, which could raise the decoded talker by up to +9 dB TMR. After each trial they chose which marked segment was easier to follow and answered two multiple-choice questions about the target conversation in each segment. They also performed the repeat-word task throughout. Pupil diameter, recorded with a Tobii Pro Nano eye tracker at 60 Hz, was obtained from S2 and S3; positioning problems prevented usable recordings from S1 and S4.

In experiment 2, each participant completed ten further trials (40 in total). A visual arrow cued attention to one conversation, then flipped midway to request a switch, while the system stayed on. Speech began at 0 dB TMR, and closed-loop control started 5 s after onset. Responsiveness was summarized as switch time: how long the average TMR took to cross 0 dB after the cue.

In experiment 3, participants switched attention at will and pointed to the loudspeaker they were following, as a behavioral reference. The decoder itself was still driven by speech-envelope tracking, not by the pointing gesture. In a small control set of trials, gain was reversed without telling the participant, so the unattended talker was amplified. The figure captions report 13 standard self-initiated trials and 3 reversed-gain trials.

A separate cohort of 40 adults with mild-to-moderate sensorineural hearing loss (mean age 40 years, range 20–73; 25 male, 15 female) was recruited online through Prolific. They did not have intracranial recordings. They listened to the already generated experiment 1 audio, in which TMR had been controlled by the iEEG participants’ real-time decoding, and then gave preference judgments and answered comprehension questions. Audiograms were obtained for this group.

## Results

In the offline training data, average AAD accuracy was well above chance for every participant, ranging from 72.0% to 90.3% (S1 72.0%, S2 87.3%, S3 90.3%, S4 77.0%).

In experiment 1, the online decoder stayed above chance in all four participants (Fig. 2c). Trial-by-trial decoding accuracy strongly predicted the resulting TMR (adjusted R² = 0.98, P \< 0.001), and the average TMR rose by +12 dB from the ‘off’ segment to the ‘on’ segment (Fig. 2d). Listeners preferred the system-on segment: a mixed-effects model on trial ratings was significant (estimate = 1.55, SE = 0.29, P \< 0.001), and individual preference rates ranged from 75% to 95% of trials (Fig. 2e: S1 95%, S4 85%, S2 75%, S3 75%). When intelligibility changed between the two segments, it was more likely to improve with the system on (estimate = 0.73, SE = 0.035, P \< 0.05; Fig. 2f). Pupil size was smaller in the system-on segment for both participants with usable eye-tracking data (S2, P = 0.0008; S3, P = 0.042; two-sided Wilcoxon signed-rank tests, 20 trials each; Fig. 2g).

Decoding held up across same-gender and different-gender talker pairs, across babble and pedestrian noise, and for talkers that had not been in the training set (all P > 0.05). A mixed-effects analysis also found that better repeat-word detection on a trial predicted higher AAD accuracy, and that each 1% increase in decoding accuracy raised the odds of preferring the system-on segment by 4.3% (estimate = 0.042, SE = 0.013, P = 0.0008).

![Figure 2. Real-time enhancement improves perception and reduces effort (Choudhari et al., 2026, Fig. 2). Panel a marks the 10 s unrated start, 14 s with the system off, and 14 s with the system on. In panels b and d, heat maps of all 80 trials show the decoded conversation and the attended-talker TMR flipping toward the target after the system turns on at 24 s; the traces below are averages. Panel c shows online decoding accuracy above the 50% chance line in every subject. Panel e is preference by subject, and panel f is the direction of change among trials in which the comprehension answers differed. Panel g shows reduced pupil size in the system-on segment for S2 and S3.](/img/readApaper-30/Fig2_experiment1_perceptual_benefits.png)

<i>Figure 2. Real-time enhancement improves perception and reduces effort (Choudhari et al., 2026, Fig. 2). Panel a marks the 10 s unrated start, 14 s with the system off, and 14 s with the system on. In panels b and d, heat maps of all 80 trials show the decoded conversation and the attended-talker TMR flipping toward the target after the system turns on at 24 s; the traces below are averages. Panel c shows online decoding accuracy above the 50% chance line in every subject. Panel e is preference by subject, and panel f is the direction of change among trials in which the comprehension answers differed. Panel g shows reduced pupil size in the system-on segment for S2 and S3.</i>

In experiment 2, neural tracking and TMR reversed after the switch cue (Fig. 4b,d), and accuracy remained above chance in each participant (Fig. 4c). Mean switch time was 5.1 s (S1 7.0 s, S2 4.5 s, S3 5.0 s, S4 4.0 s). Repeat-word detection showed a clear crossover: accuracy was high for the first conversation before the cue and for the second conversation after it (interaction P \< 0.001; Fig. 4e).

![Figure 4. The system tracks instructed attention switches (Choudhari et al., 2026, Fig. 4). Panel a: the listener is cued to conversation 1, then mid-trial to conversation 2, with the system on throughout. Panels b and d show trial-by-trial decoding and TMR reversing after the cue at time 0 (40 trials). Panel c is accuracy by subject. Panel e is the behavioral check: orange bars (conversation 1) start high and fall after the switch; green bars (conversation 2) do the opposite, and the colored lines follow individual participants.](/img/readApaper-30/Fig4_instructed_attention_switch.png)

<i>Figure 4. The system tracks instructed attention switches (Choudhari et al., 2026, Fig. 4). Panel a: the listener is cued to conversation 1, then mid-trial to conversation 2, with the system on throughout. Panels b and d show trial-by-trial decoding and TMR reversing after the cue at time 0 (40 trials). Panel c is accuracy by subject. Panel e is the behavioral check: orange bars (conversation 1) start high and fall after the switch; green bars (conversation 2) do the opposite, and the colored lines follow individual participants.</i>

In experiment 3, self-initiated switches were visible in both the decoded correlation difference and the TMR, aligned with the talker the participant pointed to (Fig. 5b,c; 13 trials). In the three reversed-gain trials, the attended talker was made quieter, and participants reported that the scene became harder to follow (Fig. 5d,e).

![Figure 5. The system tracks self-initiated switches (Choudhari et al., 2026, Fig. 5). Panel a: the listener switches at will while the system stays on. Panels b and c (13 trials) show decoding and TMR following the newly attended talker after a voluntary switch. Panels d and e (3 trials) are the reversed-gain control: the attended talker’s TMR is driven negative, and the average traces become less stable.](/img/readApaper-30/Fig5_self_initiated_switch.png)

<i>Figure 5. The system tracks self-initiated switches (Choudhari et al., 2026, Fig. 5). Panel a: the listener switches at will while the system stays on. Panels b and c (13 trials) show decoding and TMR following the newly attended talker after a voluntary switch. Panels d and e (3 trials) are the reversed-gain control: the attended talker’s TMR is driven negative, and the average traces become less stable.</i>

The 40 listeners with hearing loss preferred the system-on audio (t₃₉ = 17.53, P \< 0.001, Cohen’s d = 1.36) and showed a larger objective intelligibility gain than the normal-hearing iEEG group (t₃₉ = 9.50, P \< 0.001, Cohen’s d = 1.06; Extended Data Fig. 9). The authors note that gains were most pronounced for people with moderate-to-severe loss, while some listeners with milder loss were already near ceiling but still preferred the enhanced audio.

A control analysis found that decoding accuracy using algorithmically separated sources was almost the same as with clean sources (r = 0.97, P \< 0.001; Extended Data Fig. 10).

![Extended Data Figure 9. Perceptual validation in 40 listeners with hearing loss (Choudhari et al., 2026, Extended Data Fig. 9). These participants heard the experiment 1 audio already shaped by the iEEG users’ closed-loop decoding; they did not have their own brain signals recorded. Panel a shows average left- and right-ear audiograms, in the mild-to-moderate range. Panel b is preference for the system-on versus system-off versions of that audio. Panel c is multiple-choice intelligibility on the same stimuli. Lines are individual listeners; both comparisons are significant (two-sided paired t-tests, n = 40, P < 0.001).](/img/readApaper-30/ED9_hearing_loss_validation.jpg)

<i>Extended Data Figure 9. Perceptual validation in 40 listeners with hearing loss (Choudhari et al., 2026, Extended Data Fig. 9). These participants heard the experiment 1 audio already shaped by the iEEG users’ closed-loop decoding; they did not have their own brain signals recorded. Panel a shows average left- and right-ear audiograms, in the mild-to-moderate range. Panel b is preference for the system-on versus system-off versions of that audio. Panel c is multiple-choice intelligibility on the same stimuli. Lines are individual listeners; both comparisons are significant (two-sided paired t-tests, n = 40, P \< 0.001).</i>

## Analysis

The central result is that attention can be decoded from intracranial signals well enough, and quickly enough, to change the sound a person is hearing, and that this change shows up in preference, in comprehension questions, and, in two participants, in a smaller pupil. Experiment 1 is the main evidence for those perceptual benefits. Experiment 2 shows that listeners can still switch when the current talker is being amplified, and that the system follows the new focus in a few seconds. Experiment 3 extends that to voluntary switches and, with the reversed-gain trials, shows that the direction of the gain matters: boosting the wrong talker made listening harder.

The 5.1 s switch time is largely a design choice. A 4 s window already contributes an inherent 2 s delay, and the Markov smoother adds more, in exchange for fewer abrupt volume jumps. The authors describe about +6 dB of TMR as a useful operating region: enough to help intelligibility without fully isolating the listener from the rest of the scene. The average boost in experiment 1 was +12 dB, from a difficult −6 dB baseline to a positive TMR.

It is also important to keep the two cohorts and the two audio problems apart. The closed-loop decoder ran in four iEEG patients with reported normal hearing. The 40 people with hearing loss judged the resulting audio; that experiment supports the quality of the brain-driven mix for a clinically relevant population, not a demonstration that their own neural signals were decoded in real time. In the main sessions, gain was applied to known conversation streams, which isolates attention decoding. The separation analysis is supporting evidence that an algorithmic separator can stand in for those clean streams without much change in decoding accuracy.

Taken together, the evidence supports a clear benchmark: with high-resolution intracranial recordings and a frozen, subject-specific envelope decoder, real-time AAD can steer hearing in a two-talker scene and improve the listening experience.

## Summary

If you remember one thing, remember the loop: intracranial signals are used to reconstruct the attended speech envelope, that envelope is matched to one of two talkers, and the chosen talker is turned up. In four iEEG listeners, switching this loop on improved preference and intelligibility and reduced pupil size in the two people with eye-tracking data. The same system followed instructed and self-initiated attention switches, and 40 listeners with hearing loss preferred and better understood the audio it produced.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-16 · Nature Neuroscience, 2026</i>

在嘈杂的房间里，听力的难点往往不是把所有声音都放大，而是在旁边还有另一段谈话时，仍然跟得上你关心的那个人。这篇论文问的是：听者自己的脑信号能否在实时中引导这一选择，以及由此改变的声音是否真的让言语更容易听懂。

## 背景

人在多说话人的环境中听一个人说话的能力，常被称为鸡尾酒会效应。关键是<b>选择性注意</b>：大脑并不会平等对待每一种声音。当你注意某一位说话人时，听觉皮层会更清晰地跟随他的声音，尤其是音量随时间缓慢起伏的轮廓，也就是<b>言语包络</b>。被忽略的说话人在空气中仍然存在，但在这条神经轨迹里更弱。

这也是传统助听器在同样场景中容易失效的原因。许多设备会提高麦克风收到的所有声音。两个人同时说话时，两路声音都会变响。真正关键的是<b>目标—掩蔽比</b>（TMR）：你想听的人比竞争者强多少。负的 TMR 意味着竞争者比目标更响，听起来会很吃力。

<b>听觉注意解码</b>（AAD）试图用脑机接口弥补这一差距。它读取神经活动，推断听者正在注意哪一位说话人，再增强这一路声音。过去十年，多数 AAD 研究关心的是推断能有多准，记录手段常常是头皮脑电（EEG）。少数研究把解码器跑到了实时，更少的研究闭合了回路，让解码结果真正改变听者听到的声音。

读这篇论文还需要分清两对概念。第一，<b>注意解码</b>不是<b>语音分离</b>。分离是从混合声音里抽出各路人声的音频问题；解码是判断其中哪一路是你想听的神经问题。实用设备最终两者都需要。第二，“听得更好”不止一种含义。<b>可懂度</b>是词句能否被理解，通常用理解题来测。<b>听辨负担</b>（listening effort）是听者要花费多少力气；一种生理指标是瞳孔大小，任务越吃力，瞳孔往往越大。

这里的记录是<b>颅内脑电</b>（iEEG），来自因临床癫痫监测而已经植入电极的患者。其中既有立体脑电（sEEG）的深部触点，也有皮层表面的皮层脑电（ECoG）网格。因为比头皮电极更靠近组织，它们既能记录低频活动（1–30 Hz），也能记录与局部神经元放电密切相关的高频伽马（high-gamma，70–150 Hz）。作者把这视为一种高分辨率检验：闭环 AAD 系统能否带来可被感知的好处。

## 问题

尚待回答的问题，不只是注意能否被解码，而是一套实时、由脑信号控制的听力系统，能否改善听的体验本身。闭环系统必须足够快、足够稳、足够准，改变音量才是帮助而不是干扰。如果解码来得太晚或经常出错，放大错误的说话人反而会让场景更难听。

作者的目标，是用高分辨率 iEEG 做成一套动态放大被注意说话人的闭环系统，然后检验它是否提高可懂度、减轻听辨负担、为听者所偏好，并且能否跟上被指示的以及自发的注意转换。

## 方法

系统的回路很直接（图 1a）。听者通过左右偏 15° 的扬声器听到两段重叠的对话。iEEG 信号进入针对每位被试训练的线性模型，用言语响应电极上过去 400 ms 的低频和高频伽马活动，重建被注意言语的包络。随后，在每 0.5 s 向前滑动一次的 4 s 窗口里，用皮尔逊相关把这条重建包络与两路对话的真实包络比较。相关更高的那一路被视为被注意的对话，其音量相对另一路被提高。

增益不会一次翻转到头。一个五状态马尔可夫模型把 TMR 按最多 ±9 dB 的步进调节，同时保持总体声功率不变，因此场景是被重新平衡，而不是整体被调响。在主要的闭环实验中，两路对话作为分开的声源使用，这样可以直接改变它们的相对音量，从而单独考察由注意引导的增益。随后的对照分析则问：如果这些声源先由算法分离，而不是直接使用干净声源，结果会怎样。

研究分为离线训练和在线测试。离线阶段，被试在约 38 s、共 26 个试次中，按提示注意其中一段对话，TMR 有多种设置；同时，只要被注意的对话里出现重复词，就按键。解码器用留一段交叉验证来训练和检查，然后固定。在线阶段，同一个模型在实时中处理新的言语材料；这一阶段的八位说话人里，有四位未出现在训练中。被试只被告知继续做听力任务，直到结束时的说明，才知道自己的脑活动在控制声音。

![图 1. 实验范式与离线 AAD 表现（Choudhari 等，2026，Fig. 1）。面板 a 是闭环：两段对话、颅内记录、用高频伽马（HF）和低频（LF）特征重建包络、与两路言语包络比较，再做选择性放大。面板 b、c 在模板脑上标出 S1–S4 的言语响应电极，以及单电极注意解码的准确程度；表现更好的位点集中在颞上回附近。面板 d、e 显示，加长解码窗口、纳入更多最优电极，离线准确率都会上升。在线阶段后来采用 4 s 窗口。](/img/readApaper-30/Fig1_paradigm_offline_AAD.png)

<i>图 1. 实验范式与离线 AAD 表现（Choudhari 等，2026，Fig. 1）。面板 a 是闭环：两段对话、颅内记录、用高频伽马（HF）和低频（LF）特征重建包络、与两路言语包络比较，再做选择性放大。面板 b、c 在模板脑上标出 S1–S4 的言语响应电极，以及单电极注意解码的准确程度；表现更好的位点集中在颞上回附近。面板 d、e 显示，加长解码窗口、纳入更多最优电极，离线准确率都会上升。在线阶段后来采用 4 s 窗口。</i>

## 实验

闭环研究纳入四名因癫痫监测而接受 iEEG 的成人（S1–S4；三名男性，24、29、38 岁，一名女性，21 岁），他们自述听力正常。S1 和 S3 有立体脑电，并在左侧半球、主要是颞叶覆盖皮层脑电网格；S2 为右侧立体脑电；S4 为双侧立体脑电。用言语与静音时的高频伽马比较来确定言语响应电极，四人分别为 48、38、42 和 21 个。S1–S3 的神经数据用 Tucker-Davis Technologies 设备记录，S4 用 Ripple Grapevine Trek。S2–S4 以英语为母语，S1 不是。两段对话是自然风格的对白，竞争说话人有同性别、混合性别和不同性别，并加上行人噪声或多说话人嘈杂声。

在线阶段包含三项实验。

实验 1 中，四名被试各完成 20 个 38 s 的试次（共 80 个）。10 s 不评分的起始之后，先是 14 s 系统关闭、目标处于较难的 −6 dB TMR，再是 14 s 闭环打开，最多可把解码出的说话人提高 +9 dB TMR。每个试次结束后，他们选择哪一段更好跟，并就两段中的目标对话各回答两道选择题。全程还做重复词任务。瞳孔直径用 Tobii Pro Nano 眼动仪以 60 Hz 记录，S2 和 S3 的数据可用；S1 和 S4 因眼动仪位置问题未能稳定追踪。

实验 2 中，每名被试再完成 10 个试次（共 40 个）。视觉箭头先提示注意其中一段对话，中途翻转以要求转换，系统则一直开启。语音从 0 dB TMR 开始，闭环控制在开始 5 s 后启动。响应速度用转换时间概括：提示之后，平均 TMR 穿过 0 dB 需要多久。

实验 3 中，被试可以自行转换注意，并用手指向正在跟随的扬声器，作为行为参照。解码器本身仍由言语包络跟踪驱动，而不是由指向动作驱动。在少量对照试次中，增益在被试不知情时被反转，从而放大未被注意的说话人。图注给出的是 13 个标准自发转换试次和 3 个反向增益试次。

另外有 40 名轻到中度感音神经性听力损失的成人（平均年龄 40 岁，范围 20–73 岁；25 男，15 女）通过 Prolific 在线招募。他们没有颅内记录，听到的是实验 1 中已经由 iEEG 被试的实时解码控制过 TMR 的音频，然后给出偏好判断并回答理解题。该组采集了听力图。

## 结果

在离线训练数据中，每名被试的平均 AAD 准确率都明显高于随机水平，范围为 72.0% 至 90.3%（S1 72.0%，S2 87.3%，S3 90.3%，S4 77.0%）。

实验 1 中，在线解码器在四名被试上都高于随机水平（图 2c）。试次水平的解码准确率能够很好地预测随后的 TMR（校正 R² = 0.98，P \< 0.001），从“关”到“开”，平均 TMR 提高了 +12 dB（图 2d）。听者更偏好系统打开的那一段：对试次评分的混合效应模型显著（估计值 = 1.55，SE = 0.29，P \< 0.001），个人偏好比例在 75% 到 95% 的试次之间（图 2e：S1 95%，S4 85%，S2 75%，S3 75%）。当两段之间的可懂度发生变化时，系统打开后更可能是提高（估计值 = 0.73，SE = 0.035，P \< 0.05；图 2f）。在两名有可用眼动数据的被试中，系统打开时瞳孔更小（S2，P = 0.0008；S3，P = 0.042；双侧 Wilcoxon 符号秩检验，各 20 个试次；图 2g）。

解码在同性别和不同性别的说话人对、嘈杂声和行人噪声、以及未进入训练集的说话人之间保持稳定（均 P > 0.05）。混合效应分析还发现，同一试次中重复词检测更好，AAD 准确率也更高；解码准确率每提高 1%，偏好系统打开的几率增加 4.3%（估计值 = 0.042，SE = 0.013，P = 0.0008）。

![图 2. 实时增强改善感知并减轻听辨负担（Choudhari 等，2026，Fig. 2）。面板 a 标出 10 s 不评分起始、14 s 系统关闭和 14 s 系统打开。面板 b、d 的热图包含全部 80 个试次，显示 24 s 系统打开后，解码出的对话和被注意说话人的 TMR 转向目标；下方曲线是平均值。面板 c 显示每名被试的在线解码准确率都在 50% 随机线之上。面板 e 是各被试的偏好，面板 f 是理解题答案发生变化的那些试次中，变化的方向。面板 g 是 S2 和 S3 在系统打开段瞳孔减小。](/img/readApaper-30/Fig2_experiment1_perceptual_benefits.png)

<i>图 2. 实时增强改善感知并减轻听辨负担（Choudhari 等，2026，Fig. 2）。面板 a 标出 10 s 不评分起始、14 s 系统关闭和 14 s 系统打开。面板 b、d 的热图包含全部 80 个试次，显示 24 s 系统打开后，解码出的对话和被注意说话人的 TMR 转向目标；下方曲线是平均值。面板 c 显示每名被试的在线解码准确率都在 50% 随机线之上。面板 e 是各被试的偏好，面板 f 是理解题答案发生变化的那些试次中，变化的方向。面板 g 是 S2 和 S3 在系统打开段瞳孔减小。</i>

实验 2 中，转换提示之后，神经跟踪和 TMR 发生反转（图 4b、d），每名被试的准确率仍高于随机（图 4c）。平均转换时间为 5.1 s（S1 7.0 s，S2 4.5 s，S3 5.0 s，S4 4.0 s）。重复词检测出现明显的交叉：提示前第一段对话准确率高，提示后第二段对话准确率高（交互作用 P \< 0.001；图 4e）。

![图 4. 系统能够跟踪被指示的注意转换（Choudhari 等，2026，Fig. 4）。面板 a：听者先被提示注意对话 1，中途转向对话 2，系统全程开启。面板 b、d 显示提示（时间 0）之后，逐试次的解码和 TMR 发生反转（40 个试次）。面板 c 是各被试的准确率。面板 e 是行为核对：橙色柱（对话 1）在转换前高、转换后低，绿色柱（对话 2）相反，彩色折线是各被试的趋势。](/img/readApaper-30/Fig4_instructed_attention_switch.png)

<i>图 4. 系统能够跟踪被指示的注意转换（Choudhari 等，2026，Fig. 4）。面板 a：听者先被提示注意对话 1，中途转向对话 2，系统全程开启。面板 b、d 显示提示（时间 0）之后，逐试次的解码和 TMR 发生反转（40 个试次）。面板 c 是各被试的准确率。面板 e 是行为核对：橙色柱（对话 1）在转换前高、转换后低，绿色柱（对话 2）相反，彩色折线是各被试的趋势。</i>

实验 3 中，自发转换在解码相关差和 TMR 上都可以看到，并与被试所指的说话人对齐（图 5b、c；13 个试次）。在 3 个反向增益试次中，被注意的说话人被调得更轻，被试报告场景更难跟随（图 5d、e）。

![图 5. 系统能够跟踪自发的注意转换（Choudhari 等，2026，Fig. 5）。面板 a：听者自行转换，系统保持开启。面板 b、c（13 个试次）显示解码和 TMR 在自愿转换后跟随新的被注意说话人。面板 d、e（3 个试次）是反向增益对照：被注意说话人的 TMR 被推到负值，平均曲线也更不稳定。](/img/readApaper-30/Fig5_self_initiated_switch.png)

<i>图 5. 系统能够跟踪自发的注意转换（Choudhari 等，2026，Fig. 5）。面板 a：听者自行转换，系统保持开启。面板 b、c（13 个试次）显示解码和 TMR 在自愿转换后跟随新的被注意说话人。面板 d、e（3 个试次）是反向增益对照：被注意说话人的 TMR 被推到负值，平均曲线也更不稳定。</i>

40 名听力损失听者更偏好系统打开的音频（t₃₉ = 17.53，P \< 0.001，Cohen’s d = 1.36），客观可懂度的提高也大于听力正常的 iEEG 组（t₃₉ = 9.50，P \< 0.001，Cohen’s d = 1.06；扩展数据图 9）。作者指出，获益在中到重度损失者中更明显；部分轻度损失者成绩已接近上限，但仍然偏好增强后的音频。

对照分析显示，用算法分离声源得到的解码准确率与干净声源几乎相同（r = 0.97，P \< 0.001；扩展数据图 10）。

![扩展数据图 9. 在 40 名听力损失听者中的感知验证（Choudhari 等，2026，Extended Data Fig. 9）。这些被试听到的是已由 iEEG 使用者的闭环解码塑造过的实验 1 音频，他们自己没有记录脑信号。面板 a 是左右耳平均听力图，处于轻到中度范围。面板 b 是对系统打开与关闭两个版本的偏好。面板 c 是同一刺激上的选择题可懂度。细线为每位听者；两项比较均显著（双侧配对 t 检验，n = 40，P < 0.001）。](/img/readApaper-30/ED9_hearing_loss_validation.jpg)

<i>扩展数据图 9. 在 40 名听力损失听者中的感知验证（Choudhari 等，2026，Extended Data Fig. 9）。这些被试听到的是已由 iEEG 使用者的闭环解码塑造过的实验 1 音频，他们自己没有记录脑信号。面板 a 是左右耳平均听力图，处于轻到中度范围。面板 b 是对系统打开与关闭两个版本的偏好。面板 c 是同一刺激上的选择题可懂度。细线为每位听者；两项比较均显著（双侧配对 t 检验，n = 40，P \< 0.001）。</i>

## 分析

核心结果是：从颅内信号里解码注意，已经足够准、也足够及时，能够改变一个人正在听的声音；而这种改变出现在偏好、理解题，以及两名被试更小的瞳孔上。实验 1 是这些感知益处的主要证据。实验 2 表明，当前说话人正在被放大时，听者仍然能够转换注意，系统也能在数秒内跟上新的焦点。实验 3 把这一点扩展到自发转换，并用反向增益说明增益方向很重要：增强错误的说话人会让听变更难。

5.1 s 的转换时间在很大程度上是设计选择。4 s 窗口本身就带来约 2 s 的固有延迟，马尔可夫平滑还会再增加延迟，以换取更少的突然音量跳动。作者把大约 +6 dB 的 TMR 描述为一个有用的工作区间：足以帮助可懂度，又不会把听者与周围环境完全隔开。实验 1 中的平均提升是 +12 dB，从困难的 −6 dB 基线到正的 TMR。

两组被试和两类音频问题也需要分开看。闭环解码是在四名自述听力正常的 iEEG 患者中运行的。40 名听力损失者评判的是由此产生的音频；这项实验支持的是脑驱动混音对相关临床人群的听感质量，而不是证明他们自己的神经信号被实时解码。在主要实验中，增益加在已知的对话声源上，从而突出注意解码。分离分析则是旁证：算法分离器可以代替那些干净声源，而解码准确率没有明显变化。

综合来看，这些证据给出一个清楚的基准：在高分辨率颅内记录和针对个人、已固定的包络解码器下，实时 AAD 可以在双说话人场景中引导听力，并改善听的体验。

## 总结

如果只记一件事，请记住这条回路：用颅内信号重建被注意言语的包络，把包络与两路说话人匹配，再提高被选中的那一路。在四名 iEEG 听者中，打开这条回路提高了偏好和可懂度，并在两名有眼动数据的人中减小了瞳孔。同一系统能够跟上被指示的和自发的注意转换；40 名听力损失听者更偏好、也更能听懂它产生的音频。

## References

- Choudhari, V., Nentwich, M., Johnson, S., Herrero, J. L., Bickel, S., Mehta, A. D., Friedman, D., Flinker, A., Chang, E. F., & Mesgarani, N. (2026). <i>Real-time brain-controlled selective hearing enhances speech perception in multi-talker environments.</i> Nature Neuroscience, 29, 2408–2418. Published 11 May 2026. [doi.org/10.1038/s41593-026-02281-5](https://doi.org/10.1038/s41593-026-02281-5) · [Article](https://www.nature.com/articles/s41593-026-02281-5)
- Supplementary information, including Supplementary Table 1: [41593\_2026\_2281\_MOESM1\_ESM.pdf](https://static-content.springer.com/esm/art%3A10.1038%2Fs41593-026-02281-5/MediaObjects/41593_2026_2281_MOESM1_ESM.pdf)
- Online experimental code: [github.com/naplab/Real-Time-Brain-Controlled-Hearing](https://github.com/naplab/Real-Time-Brain-Controlled-Hearing)
- Figures 1, 2, 4, 5 and Extended Data Figure 9 are from Choudhari et al. (2026).
