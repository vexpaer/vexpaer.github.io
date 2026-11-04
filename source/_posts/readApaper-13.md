---
title: "readApaper#13 Brain organoid computing for robotic decision-making"
title_zh: "readApaper#13 Brain organoid computing for robotic decision-making"
date: 2026-10-30 22:00:00
tags:
  - readApaper
  - neuroscience
  - biological-computing
  - robotics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 12–14 minutes · 30 October 2026 · bioRxiv preprint (2026)</i>

<b>Can a dish of living neurons help a robot decide what to do next?</b>

Brainobot connects a human cortical organoid to a humanoid robot. A camera captures the environment; software converts selected visual information into electrical stimulation; the organoid produces neural activity; and a readout model maps that activity to a high-level robot command. The robot then acts, changing the scene that the camera observes next.

The return path matters: the robot's action changes the next sensory input. This is online closed-loop execution, even though the readout model is trained offline.

![Figure 1A. Original system diagram of Brainobot's sense–compute–action loop.](/img/readApaper-13/Brainobot_sense_compute_action.svg)

<i>Figure 1A. Original system diagram of Brainobot's sense–compute–action loop.</i>

## 1. From a neural reservoir to a robot

The system combines five components: a camera and sensors capture the environment; software simplifies the visual input and converts it into stimulation patterns; a cortical organoid on a MaxOne microelectrode array receives stimulation and generates spikes; a logistic-regression classifier maps recorded activity to a discrete action; and a conventional robot controller translates that command into motor movements.

The organoid does not directly drive every motor or calculate each joint trajectory. It contributes to <b>high-level action selection</b>; conventional electronics and control software handle lower-level movement.



## 2. Three tasks: choosing, grasping, and chasing

<b>Hand-raising task.</b> The camera distinguishes two simple visual patterns. The patterns are reduced to a small binary representation and encoded as electrical stimulation. The classifier maps the organoid's responses to a left-hand or right-hand command.

<b>Grasping task.</b> The system distinguishes three inputs: the letter I, the letter U, and a blank scene. These correspond to grasping with one hand, grasping with the other hand, or remaining still. The researchers also apply tetrodotoxin (TTX), which blocks action potentials. Performance falls under TTX, supporting the claim that active neural signaling contributes to the system's decisions.



<b>Laser-chasing task.</b> The camera identifies a laser point on the left, centre, or right. The organoid-assisted classifier selects a movement command, the robot moves, and the camera captures the new position. The loop repeats, with a new decision approximately every five seconds. A distance sensor can stop the robot when it approaches an obstacle.

This last task is especially important: it demonstrates repeated perception and action in a changing physical environment, rather than a one-time classification result.

![Figure 1B. Three demonstrated tasks and the cross-task adaptation concept.](/img/readApaper-13/Brainobot_tasks_and_adaptation.svg)

<i>Figure 1B. Three demonstrated tasks and the cross-task adaptation concept.</i>

## 3. Does the system improve with training?

The authors report performance improvements across training epochs and task switches. In one sequence, laser-tracking performance increased from roughly <b>72% to 92%</b>; after switching to grasping, performance initially changed and then improved again. Another sequence showed grasping performance increasing from roughly <b>72% to 94%</b>. K252a treatment, used to interfere with activity-dependent plasticity, limited the improvement.



There is an important experimental detail: <b>the readout classifier is retrained after training epochs</b>. Improved performance may therefore reflect both changes in the biological reservoir and changes in the external classifier. The results do not isolate the organoid as the sole source of learning.

## 4. What does “closed loop” mean here?

The information flow is: <b>camera → encoding → organoid → readout → robot action → changed environment → camera.</b> The organoid is part of a feedback-controlled system because its output affects the next input. But the system is hybrid: camera processing, classification, robot control, and motor execution remain digital or conventional engineering components.

A system can execute actions online while its decoder was trained offline. Likewise, the robot can complete a task without the organoid independently understanding the visual meaning of a letter or a laser point.

## 5. The engineering pipeline behind the demonstration

Brainobot is a hybrid system with several conventional engineering layers around the biological processor. The organoid is mounted on a MaxOne MEA. A camera captures the scene, a host computer extracts visual features and converts them into stimulation patterns, the MEA delivers those patterns and records neural activity, and a readout classifier converts the activity into a discrete action. A Bluetooth link sends the command to the robot's controller, which executes predefined movements through servo motors.

The paper describes a ROBOTIS Premium humanoid platform, an ESP32-CAM camera, a CM-530 robot controller, Dynamixel AX-12A actuators, and a distance sensor for basic obstacle feedback. This division of labour is important: the organoid participates in selecting a high-level action, while the robot's controller handles the timing and coordination of individual motors.

The input encoding is task-specific. In the hand-raising demonstration, a 400 × 300 camera image is downsampled and thresholded into a 6 × 6 binary matrix, then converted into a 6-electrode × 6-time-step bipolar stimulation sequence. For grasping, the image is reduced to a 7 × 8 binary representation and converted into pulse streams. For laser chasing, a 6 × 12 representation is converted into 12 pulse streams. The system does not feed raw pixels directly into the organoid.

The readout also has a conventional machine-learning component. Evoked spikes are counted in 100-ms bins, assembled into a response matrix, flattened into a feature vector, and passed to logistic regression. The methods report five-fold cross-validation on one epoch of training data. This pipeline is why the paper should be read as a biohybrid computing system rather than a biological robot with no digital assistance.

## 6. Cross-task adaptation: what transfers?

The authors report a representative sequence in which laser-chasing accuracy increases from 72% to 92% over three epochs. After switching to grasping, accuracy is 86%, then rises to 92% with further grasping practice. In another sequence, grasping improves from 72% to 94%, followed by 90% after switching to laser chasing.

A particularly interesting comparison is the first grasping epoch after prior laser-chasing training: the previously trained system reaches 86%, compared with 70% for an untrained condition. This is evidence consistent with cross-task transfer, although it is based on a small experimental group and a representative training sequence.

K252a provides a mechanistic control. With K252a treatment, the reported grasping accuracy remains around 62–64%, and the functional-connectivity changes are minimal. Without the treatment, accuracy rises from 72% to 94% during repeated grasping epochs. The paper also demonstrates a multi-stage “Put I on U” task, in which the robot picks up one block and places it on another to form the “IU” arrangement.

## 7. What should be treated cautiously?

The strongest demonstrations use a small number of organoids; the cross-task analysis reports five organoids from three independent experiments. The system is a preprint, and the results should be interpreted as an early proof of concept.

The biological network does not receive semantic images or plan joint trajectories. The camera pipeline performs segmentation and feature extraction; the stimulation encoder defines what the tissue receives; the logistic-regression readout maps activity to one of a few action labels; and the robot controller executes a predefined motion primitive. The organoid is a decision module within this architecture.

The authors describe high computing efficiency and low energy consumption, but the complete system still depends on an incubator, an MEA platform, a host PC, sensors, wireless communication, and a robot. A fair energy comparison should include the whole system and the overhead required to maintain living tissue. The current work also leaves open how robust the system would be across organoid batches, new objects, new environments, and long-term operation.

## My perspective

Brainobot is useful because it shows how a biological network might be integrated as one module in a larger engineered system. It suggests a practical division of labour: let the biological network contribute to high-level decisions, while conventional controllers provide reliable and precise movement.

The central experimental question is <b>how much of the improvement comes from the organoid itself?</b> A stronger test would compare a frozen readout with a changing biological reservoir, a retrained readout with a fixed reservoir, and a system in which both are allowed to adapt. Evaluation on new sessions and unseen visual conditions would test whether the system learned a reusable mapping rather than memorising a small set of task patterns.

The study is a preprint and uses a small number of organoids. System-level efficiency should be evaluated across the incubator, MEA, computer, sensors, and robot—not just the biological tissue. The paper is best read as an early prototype of organoid-assisted robotic decision-making.

## Takeaway

- Brainobot connects a human cortical organoid to a real humanoid robot.
- It demonstrates hand raising, grasping, and laser chasing.
- The robot's actions change subsequent camera input, creating an online feedback loop.
- The organoid contributes to high-level action selection; conventional controllers execute motor movements.
- Biological adaptation and readout retraining both affect performance, so their contributions need to be separated.

## References / 参考资料

- Cai, H. et al. (2026). <i>Brain organoid computing for robotic decision-making</i>. bioRxiv preprint, posted 15 September 2026. [DOI](https://doi.org/10.64898/2026.09.09.750426)
- [bioRxiv — full preprint](https://www.biorxiv.org/content/10.64898/2026.09.09.750426v1.full)

<!-- BLOG_ZH -->

<i>预计阅读时间：约 12–14 分钟 · 2026-10-30</i>

<b>培养皿里的活神经元，能不能帮助机器人决定下一步做什么？</b>

Brainobot 将人源皮层类器官连接到一台人形机器人。摄像头观察环境，软件把部分视觉信息转换为电刺激，类器官产生神经活动，读出模型再把这些活动映射为机器人动作。机器人执行动作后，环境发生变化，摄像头继续观察新的场景。

这里最重要的是信息回流：机器人的动作会改变下一次接收到的感觉输入。因此，Brainobot 展示的是一种<b>在线闭环执行系统</b>，尽管它的读出模型是在离线阶段训练的。

## 1. 从神经储备池到机器人

系统由几个模块组成：摄像头和传感器获取环境信息；软件简化视觉输入并转换成刺激模式；放置在 MaxOne 微电极阵列上的类器官接收刺激并产生 spikes；逻辑回归分类器将记录到的活动映射为离散动作；传统机器人控制器再把指令转换成电机运动。

类器官不会直接控制每一个电机，也不会计算每个关节的运动轨迹。它主要参与<b>高层动作选择</b>，底层运动仍由传统电子设备和控制软件完成。

## 2. 三种任务：选择、抓取与追踪

<b>举手任务。</b> 摄像头识别两种简单视觉图案，将其转换成小型二值矩阵，再编码为电刺激。分类器根据类器官的响应，输出举左手或举右手的指令。

<b>抓取任务。</b> 系统区分字母 I、字母 U 和空白场景，分别对应左手抓取、右手抓取和保持不动。研究者还使用河豚毒素（TTX）阻断动作电位。处理后性能下降，说明活跃神经信号确实参与了系统决策。

<b>激光点追踪。</b> 摄像头判断激光点位于左侧、中间还是右侧。类器官辅助分类器选择动作，机器人移动，摄像头再读取新的位置。整个过程不断重复，约每五秒做出一次新决策。距离传感器还可以在机器人接近障碍物时触发停止。

第三项任务尤其重要：它展示了机器人在变化的物理环境中反复感知和行动，而不是只完成一次分类。

## 3. 系统是否会随着训练改善？

作者报告，系统在多个训练 epoch 和任务切换过程中出现性能提升。一组实验中，激光追踪表现大约从 <b>72% 提升到 92%</b>；切换到抓取任务后，性能先发生变化，随后再次提高。另一组实验中，抓取表现约从 <b>72% 提升到 94%</b>。作者还报告，使用 K252a 干预活动依赖性可塑性后，性能改善受到限制。

这里有一个重要的实验细节：<b>每个训练 epoch 后，外部读出分类器也会重新训练</b>。因此，性能提升可能同时来自生物储备池变化和外部分类器更新。现有结果没有把类器官单独作为学习来源分离出来。

## 4. 这里的闭环究竟是什么？

信息流可以概括为：<b>摄像头 → 编码 → 类器官 → 读出器 → 机器人动作 → 环境变化 → 摄像头。</b>

类器官的输出会影响下一次输入，所以它确实参与了反馈控制。但整套系统仍是混合架构：视觉处理、分类器、机器人控制器和电机执行都依赖数字或传统工程模块。

系统可以在线执行动作，但解码器仍然是在离线阶段训练的；机器人可以完成任务，也不代表类器官独立理解了字母或激光点的语义。

## 5. 这套系统背后的工程链路

Brainobot 是一个由多层传统工程模块围绕生物处理器构成的混合系统。类器官放置在 MaxOne MEA 上；摄像头获取场景；主机提取视觉特征并将其转换为刺激模式；MEA 把刺激输入类器官，同时记录神经活动；读出分类器再将神经活动转换成离散动作。随后，蓝牙链路把指令发送给机器人控制器，由舵机执行预设动作。

论文描述的硬件包括 ROBOTIS Premium 人形机器人、ESP32-CAM 摄像头、CM-530 控制器、Dynamixel AX-12A 执行器，以及用于基础避障反馈的距离传感器。这个分工很重要：类器官参与高层动作选择，机器人控制器负责各个电机的时序和协调。

输入编码会随任务变化。举手任务中，摄像头获取的 400 × 300 图像被缩小并阈值化为 6 × 6 二值矩阵，再转换成 6 个电极、6 个时间步的双相刺激序列。抓取任务使用 7 × 8 二值表示，再转换成脉冲流；激光追踪任务则把图像转换为 6 × 12 表示，再编码为 12 个脉冲流。类器官接收的不是未经处理的原始像素。

读出器也包含传统机器学习模块。研究者将诱发 spikes 按 100 ms 时间窗计数，形成响应矩阵，再展平为特征向量，输入逻辑回归分类器。方法部分报告使用一个训练 epoch 的数据进行五折交叉验证。因此，这项工作应理解为生物—数字混合计算系统，而不是完全依靠生物组织运行的机器人。

## 6. 跨任务适应：究竟迁移了什么？

作者报告了一组代表性结果：激光追踪准确率在三个 epoch 中从 72% 提高到 92%。切换到抓取任务后，准确率为 86%，继续训练后又提高到 92%。另一组实验中，抓取准确率从 72% 提高到 94%，切换到激光追踪后为 90%。

一个有意思的比较发生在任务切换的第一个 epoch：先进行激光追踪训练的系统，在首次抓取任务中达到 86%；未训练条件下的系统为 70%。这与跨任务迁移相一致，但实验组规模较小，不能直接推导出普遍的迁移能力。

K252a 提供了机制层面的对照。使用 K252a 后，抓取准确率保持在约 62–64%，功能连接变化也很小；未处理组在连续抓取训练中则从 72% 提高到 94%。论文还展示了多阶段的 “Put I on U” 任务：机器人先拿起字母 I，再将其放到字母 U 上，最终组成 “IU”。

## 7. 哪些结论需要谨慎看待？

最重要的实验展示涉及的类器官数量有限；跨任务分析报告的是来自三次独立实验的五个类器官。论文目前是预印本，适合作为早期概念验证来阅读。

生物网络不会直接接收具有语义的图像，也不会规划关节轨迹。摄像头软件负责分割和提取特征；刺激编码器决定组织接收什么输入；逻辑回归读出器把活动映射到少量动作类别；机器人控制器再执行预设动作。类器官只是整个架构中的一个决策模块。

作者强调计算效率和低能耗，但完整系统仍依赖培养箱、MEA 平台、主机、传感器、无线通信和机器人。公平的能耗比较应把这些环节全部纳入，还要计算维持活体组织的基础设施开销。系统在不同批次类器官、新物体、新环境和长期运行条件下的稳健性，也仍需验证。

## My Perspective｜我的思考

Brainobot 的价值在于展示了生物神经网络如何成为复杂工程系统中的一个功能模块。它提供了一种实用的分工方式：生物网络参与高层决策，传统控制器负责稳定、精确的运动执行。

最值得继续追问的是：<b>性能提升有多少真正来自类器官？</b> 更有说服力的实验可以比较三种条件：冻结读出器、只允许生物储备池变化；固定储备池、只重新训练读出器；以及两者都允许适应。再用新的 session 和未见过的视觉条件测试，才能判断系统学到的是可复用的映射，还是只适应了少量任务模式。

这项研究目前是预印本，实验也只涉及少量类器官。系统能耗应把培养箱、MEA、计算机、传感器和机器人全部纳入评价，不能只计算生物组织本身。更合适的定位是：它展示了类器官辅助机器人决策的早期原型。

## 总结

- Brainobot 将人源皮层类器官接入真实人形机器人。
- 实验展示了举手、抓取和激光点追踪。
- 机器人动作会改变后续摄像头输入，形成在线反馈回路。
- 类器官参与高层动作选择，传统控制器负责执行具体运动。
- 生物网络适应与读出器重新训练都会影响表现，需要进一步拆分二者的贡献。

---

## References / 参考资料

- Cai, H. et al. (2026). <i>Brain organoid computing for robotic decision-making</i>. bioRxiv preprint, posted 15 September 2026. [DOI](https://doi.org/10.64898/2026.09.09.750426)
- [bioRxiv — full preprint](https://www.biorxiv.org/content/10.64898/2026.09.09.750426v1.full)
