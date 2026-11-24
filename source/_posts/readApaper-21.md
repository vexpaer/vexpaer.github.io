---
title: "readApaper#21 Reach and grasp by people with tetraplegia using a neurally controlled robotic arm"
title_zh: "readApaper#21 Reach and grasp by people with tetraplegia using a neurally controlled robotic arm"
date: 2026-11-07 22:00:00
tags:
  - readApaper
  - neuroengineering
  - brain-computer-interface
  - robotics
cover: /img/readapaper-cover.png
bilingual: true
---

<i>Reading time: about 8 minutes · 7 November 2026 · Nature, 2012</i>

<b>For nearly 15 years after her brainstem stroke, a woman could not bring a drink to her own mouth. Then she thought about moving a robot arm, and it picked up a bottle of coffee and brought it to her lips.</b> In this 2012 BrainGate2 study, Hochberg and colleagues show that two people with long-standing tetraplegia could steer a robotic arm in three dimensions to reach and grasp objects, using only the activity of a small patch of motor cortex neurons.

## 1. Why the brain still has something to say

A brainstem stroke, a spinal cord injury or ALS can cut the connection between the brain and the body. The brain may still plan an arm movement, but the message never arrives. A <b>neural interface system</b> (NIS) tries to bypass the break: it reads the planning activity directly from the brain and turns it into commands for an assistive device. Earlier work had shown that people with tetraplegia could use such a system to move and click a computer cursor, and that able-bodied monkeys could control a robotic arm. The open question was whether people with profound arm paralysis could direct a useful, three-dimensional arm action.

## 2. Reading neurons with an intracortical array

The <b>motor cortex</b> (here the arm and hand area of primary motor cortex, M1) is the part of the brain most closely tied to voluntary movement. Neurons there fire short electrical pulses called <b>spikes</b>, and many of them have a <b>preferred direction</b>: a neuron fires more when the intended hand movement points in its preferred direction, and less when it points away.

Both participants had a 4 × 4 mm silicon <b>microelectrode array</b> with 96 channels and 1.5 mm-long electrodes implanted in the dominant-hand area of M1. For participant S3, a woman in her late 50s with tetraplegia and no speech after a brainstem stroke, the array had been in place for 5.3 years at the start of the study (implanted in November 2005). Participant T2, a man in his mid-60s with a brainstem stroke in 2006, had been implanted 5 months earlier.

Instead of separating the spikes of individual neurons, the team simply counted <b>threshold crossings</b>: each time the voltage on a channel dipped below a noise-based threshold, it was counted as one spike-like event. Counts were collected every 100 ms for S3 and every 20 ms for T2, and these rates were the features used for decoding.

## 3. Decoding with a Kalman filter

<b>Decoding</b> means turning those firing rates into an estimate of what the person intends to do. For arm movement, the system decoded the <b>velocity of the robot hand</b> (the endpoint of the arm) with a <b>Kalman filter</b>, a classic tool for tracking a changing quantity from noisy measurements. The intuition: at each time step the filter makes two guesses and blends them.

- <b>Guess 1, prediction:</b> hand velocity changes smoothly, so the new velocity should be close to the previous estimate (the paper sets this smoothness factor to 0.965).
- <b>Guess 2, neural evidence:</b> given the firing pattern of the channels and what each channel's preferred direction is, which direction does the population point to?
- The Kalman filter combines the two, leaning on whichever is less noisy.

A second, parallel decoder handled <b>grasping</b>: a linear discriminant classifier looked at the last 300 ms of threshold crossings and decided whether the participant was imagining squeezing the hand. When it said yes, the robot hand closed.

Before each session, the decoders had to be calibrated. In one open-loop block (under 4 minutes) the participant imagined controlling the arm while it made pre-programmed movements, and the filter was initialized from the recorded activity. Then four to eight closed-loop blocks followed, in which the participant actually steered the arm. Early on, the computer reduced the sideways part of decoded errors, and this help was gradually lowered to zero. On average, calibration took about 31 minutes (range 20–48).

![Figure A (schematic, self-drawn). Top: a 96-channel array in motor cortex yields threshold-crossing rates, which feed a Kalman filter for hand velocity and a linear discriminant for grasp; both drive the robot arm. Bottom: the Kalman filter blends a smooth-motion prediction with the evidence in the firing rates.](/img/readApaper-21/p21_schematic_en.png)

<i>Figure A (schematic, self-drawn). Top: a 96-channel array in motor cortex yields threshold-crossing rates, which feed a Kalman filter for hand velocity and a linear discriminant for grasp; both drive the robot arm. Bottom: the Kalman filter blends a smooth-motion prediction with the evidence in the firing rates.</i>

## 4. The task: reach out and grab a ball

Two robot arms were used: the DLR Light-Weight Robot III (a 14 kg arm with 7 degrees of freedom, built as an assistive device) and the DEKA arm (a 3.64 kg prototype prosthetic arm with 6 degrees of freedom in the arm). On each trial a motor lifted a 6 cm foam ball into one of seven positions spread over a space about 30 cm wide, 52 cm deep and 23 cm high, and the participant had to steer the robot hand to it and close the hand around it. The hand opening was only 1.3 times the ball size for the DLR hand and 1.8 times for the DEKA hand, so the path had to be curved and precise. Success was judged by reviewing the videos.

![Figure 1. Setup and performance. (a) Overhead view of the participant, the table with the targets (purple spheres), the robot, and the two cameras. (b) Photographs of the DLR and DEKA robots. (c, d) Example trials: a 3D hand path (top), wrist position along each axis (middle), and threshold crossings from all units used in decoding (bottom). (e) Percentage of trials in which the target was touched (blue) and grasped (red) for each session. (f) Time to touch and to grasp; each circle is one successful trial.](/img/readApaper-21/p21_fig1_en.jpg)

<i>Figure 1. Setup and performance. (a) Overhead view of the participant, the table with the targets (purple spheres), the robot, and the two cameras. (b) Photographs of the DLR and DEKA robots. (c, d) Example trials: a 3D hand path (top), wrist position along each axis (middle), and threshold crossings from all units used in decoding (bottom). (e) Percentage of trials in which the target was touched (blue) and grasped (red) for each session. (f) Time to touch and to grasp; each circle is one successful trial.</i>

## 5. Results: how often did it work?

S3 performed 158 trials across 4 sessions (80 with the DLR arm, 78 with the DEKA arm), and T2 performed 45 trials in one session with the DEKA arm.

- <b>Touching the target:</b> S3 touched it in 48.8% of DLR trials and 69.2% of DEKA trials. T2 touched it in 95.6% of trials.
- <b>Grasping it:</b> counted over all trials, S3 grasped the target in 21.3% (DLR) and 46.2% (DEKA) of trials; T2 in 62.2%.
- <b>Speed:</b> it took S3 about 6.2 seconds to touch a target, and T2 about 6.1 seconds. Reach plus grasp took about 9.4 seconds for S3 and 9.5 seconds for T2.

In every session from both participants, performance was significantly higher than expected by chance. The participants did this without explicit training on the 3D task, across a workspace the authors describe as 1.4 to 7.7 times larger than those used in earlier monkey experiments.

## 6. Drinking coffee

To test everyday usefulness, S3 was asked to reach for a bottle of coffee, pick it up, drink from it through a straw, and put it back. For this task the arm moved in the 2D plane of the table, and the neurally decoded grasp state triggered one of four hand actions depending on the phase of the task (close the hand and lift, turn the bottle toward her, turn it back, lower the bottle and release). After about 14 minutes of familiarization, she completed the whole sequence on <b>4 of 6 attempts</b> in the following 8.5 minutes. The authors note that this was the first time in more than 14 years since her stroke that she had been able to drink from a container of her own volition.

![Figure 2. Participant S3 drinking from a bottle with the DLR arm. Four sequential frames from the first successful trial: grasping the bottle, bringing it toward her mouth, drinking through a straw, and putting it back on the table.](/img/readApaper-21/p21_fig2_en.jpg)

<i>Figure 2. Participant S3 drinking from a bottle with the DLR arm. Four sequential frames from the first successful trial: grasping the bottle, bringing it toward her mouth, drinking through a straw, and putting it back on the table.</i>

## 7. Neurons that still speak after years

The array was working more than five years after implantation. S3's recordings had smaller spikes and fewer useful channels than in her first years, but the channels in the Kalman filter were still directionally tuned, and the filters used between 13 and 50 channels across the six sessions. Figure 3 shows the evidence: units whose firing changes with the direction of movement, and units that respond to the intention to grasp. The authors also checked that S3's occasional arm flexion did not explain the control, and T2 produced no consistent volitional movement during the task.

![Figure 3. Neural signals from three sessions. (a–c) S3, 3D reach and grasp; (d–f) T2, 3D reach and grasp; (g–i) S3, 2D drinking session. (a, d, g) Average waveforms of two units with strong directional modulation. (b, e, h) Rasters and histograms of threshold crossings for movements toward opposing targets. (c, f, i) Units that modulate with the intended grasp.](/img/readApaper-21/p21_fig3_en.jpg)

<i>Figure 3. Neural signals from three sessions. (a–c) S3, 3D reach and grasp; (d–f) T2, 3D reach and grasp; (g–i) S3, 2D drinking session. (a, d, g) Average waveforms of two units with strong directional modulation. (b, e, h) Rasters and histograms of threshold crossings for movements toward opposing targets. (c, f, i) Units that modulate with the intended grasp.</i>

## Why this matters

The robot arms were slower and less accurate than a healthy arm, but the result shows that a small sample of motor cortex neurons, years after the injury, still carries enough information to steer a complex machine in three dimensions and to drive a hand open and closed. For a person with no arm control, the authors argue that even basic reach and grasp could be substantially liberating, restoring the ability to eat and drink independently, and that motor cortex signals might also be used to stimulate paralyzed muscles.

## Takeaway

- A 96-channel array in motor cortex gives enough signal to control a 3D robotic reach and grasp in two people with long-standing tetraplegia.
- A Kalman filter decodes hand velocity from threshold-crossing rates, and a second decoder switches the hand between open and closed.
- Across targets, S3 touched 48.8% (DLR) and 69.2% (DEKA) of the time and T2 95.6%; grasps happened on 21.3%, 46.2% and 62.2% of trials.
- S3 drank coffee from a bottle with the robot on 4 of 6 attempts, using an array implanted more than five years earlier.

---

## References and resources

- Hochberg, L. R., Bacher, D., Jarosiewicz, B., Masse, N. Y., Simeral, J. D., Vogel, J., Haddadin, S., Liu, J., Cash, S. S., van der Smagt, P., & Donoghue, J. P. (2012). <i>Reach and grasp by people with tetraplegia using a neurally controlled robotic arm.</i> Nature, 485, 372–375. [Nature](https://www.nature.com/articles/nature11076) · [PMC author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3640850/)
- Figures 1–3 are from the PMC author manuscript, which is distributed for academic research under Nature's terms of use; copyright stays with the publisher and authors. The numbers above are from that manuscript. The schematic is self-drawn. Please confirm rights before publishing these figures on the public blog.

<!-- BLOG_ZH -->

<i>预计阅读时间：约 8 分钟 · 2026-11-07 · Nature, 2012</i>

<b>脑干中风后近 15 年，一位女士无法自己把饮料送到嘴边。后来她只需想着移动机械臂，机械臂就抓起了一瓶咖啡，送到她的唇边。</b> 在这项 2012 年的 BrainGate2 研究中，Hochberg 等人表明，两位长期四肢瘫痪的参与者，仅凭运动皮层中一小片神经元的活动，就能操控机械臂在三维空间中伸手并抓取物体。

## 1. 为什么大脑仍然“有话可说”

脑干中风、脊髓损伤或渐冻症都可能切断大脑与身体之间的联系。大脑也许仍在规划手臂的动作，但指令传不出去。<b>神经接口系统（neural interface system，NIS）</b>试图绕过这个断点：直接从大脑读取规划活动，并把它转化为辅助设备的控制指令。此前的研究已经表明，四肢瘫痪的人可以用这类系统移动并点击电脑光标，健康的猴子也能控制机械臂。尚未回答的问题是：严重手臂瘫痪的人，能否指挥一个有实用价值的三维手臂动作。

## 2. 用皮层内电极阵列读取神经元

<b>运动皮层（motor cortex）</b>（这里是初级运动皮层 M1 的手臂和手部区域）是大脑中与自主运动联系最紧密的部分。那里的神经元会发出称为 <b>spike（脉冲）</b>的短促电信号，其中许多神经元有一个<b>偏好方向（preferred direction）</b>：当想要的手部运动指向它的偏好方向时，它发放得更多；背离时则更少。

两位参与者都被植入了一个 4 × 4 毫米的硅<b>微电极阵列</b>，有 96 个通道、电极长 1.5 毫米，位置在 M1 的惯用手区域。参与者 S3 是一位五十多岁、因脑干中风而四肢瘫痪且无法说话的女士，研究开始时阵列已经植入 5.3 年（2005 年 11 月植入）。参与者 T2 是一位六十多岁的男士，2006 年发生脑干中风，在研究前 5 个月植入了阵列。

团队没有把单个神经元的 spike 分开，而是直接统计<b>阈值穿越（threshold crossings）</b>：每当某个通道的电压低于一个基于噪声的阈值，就记为一次类似 spike 的事件。S3 每 100 毫秒、T2 每 20 毫秒统计一次，这些发放率就是解码用的特征。

## 3. 用卡尔曼滤波器解码

<b>解码</b>就是把这些发放率变成对“这个人想做什么”的估计。对于手臂运动，系统用<b>卡尔曼滤波器（Kalman filter）</b>解码<b>机械手（手臂末端）的速度</b>。卡尔曼滤波器是一种经典工具，用来从带噪声的测量中跟踪一个不断变化的量。直觉是：每个时间步，滤波器先做两个猜测，再把它们混合起来。

- <b>猜测 1，预测：</b>手的速度变化是平滑的，所以新速度应该接近上一次的估计（论文中把这个平滑系数设为 0.965）。
- <b>猜测 2，神经证据：</b>已知各通道的发放模式，以及每个通道的偏好方向，整个神经元群体指向哪个方向？
- 卡尔曼滤波器把两者结合，更多地依赖噪声较小的那个。

另一个并行的解码器负责<b>抓握</b>：线性判别分类器查看最近 300 毫秒的阈值穿越，判断参与者是否在想象握紧手。判断为是时，机械手就合拢。

每次实验前，解码器都要校准。在一个开环块（不到 4 分钟）中，参与者一边观看机械臂做预设动作，一边想象自己在控制它，滤波器根据记录到的活动完成初始化。随后是四到八个闭环块，参与者真正去操控机械臂。早期，计算机会减弱解码出来的侧向误差，这种帮助逐步降到零。平均而言，校准用时约 31 分钟（范围 20–48 分钟）。

![图 A（示意图，自绘）。上方：运动皮层中的 96 通道阵列产生阈值穿越发放率，分别送入估计手部速度的卡尔曼滤波器和判断抓握的线性判别分类器，两者共同驱动机械臂。下方：卡尔曼滤波器把平滑运动的预测与发放率中的证据混合起来。](/img/readApaper-21/p21_schematic_en.png)

<i>图 A（示意图，自绘）。上方：运动皮层中的 96 通道阵列产生阈值穿越发放率，分别送入估计手部速度的卡尔曼滤波器和判断抓握的线性判别分类器，两者共同驱动机械臂。下方：卡尔曼滤波器把平滑运动的预测与发放率中的证据混合起来。</i>

## 4. 任务：伸手去抓一个球

研究用了两种机械臂：DLR Light-Weight Robot III（14 公斤、7 个自由度，设计为辅助设备）和 DEKA 手臂（3.64 公斤的假肢原型，手臂部分 6 个自由度）。每次试验中，电机会把一个直径 6 厘米的泡沫球升到七个位置之一，这些位置分布在大约宽 30 厘米、深 52 厘米、高 23 厘米的空间里，参与者要操控机械手到达球的位置并合拢手抓住它。DLR 机械手的开口只有球大小的 1.3 倍，DEKA 机械手为 1.8 倍，所以路径必须弯曲而精确。成功与否通过回看视频判定。

![Figure 1. 实验设置与表现。(a) 俯视图：参与者、摆放目标（紫色球）的桌子、机器人和两台摄像机。(b) DLR 与 DEKA 机器人的照片。(c, d) 示例试验：三维手部轨迹（上）、手腕在各轴上的位置（中），以及参与解码的所有 unit 的阈值穿越（下）。(e) 各次实验中触碰（蓝色）和抓住（红色）目标的试验百分比。(f) 触碰和抓住所需的时间，每个圆圈是一次成功的试验。](/img/readApaper-21/p21_fig1_en.jpg)

<i>Figure 1. 实验设置与表现。(a) 俯视图：参与者、摆放目标（紫色球）的桌子、机器人和两台摄像机。(b) DLR 与 DEKA 机器人的照片。(c, d) 示例试验：三维手部轨迹（上）、手腕在各轴上的位置（中），以及参与解码的所有 unit 的阈值穿越（下）。(e) 各次实验中触碰（蓝色）和抓住（红色）目标的试验百分比。(f) 触碰和抓住所需的时间，每个圆圈是一次成功的试验。</i>

## 5. 结果：成功率如何？

S3 在 4 次实验中共做了 158 次试验（DLR 手臂 80 次，DEKA 手臂 78 次），T2 在一次实验中用 DEKA 手臂做了 45 次试验。

- <b>触碰目标：</b>S3 在 DLR 试验中有 48.8%、DEKA 试验中有 69.2% 触碰到了目标；T2 在 95.6% 的试验中触碰到了目标。
- <b>抓住目标：</b>按全部试验计，S3 抓住目标的比例是 21.3%（DLR）和 46.2%（DEKA）；T2 是 62.2%。
- <b>速度：</b>S3 触碰到目标约需 6.2 秒，T2 约需 6.1 秒。伸手加抓握，S3 约 9.4 秒，T2 约 9.5 秒。

两位参与者的所有实验中，表现都显著高于随机水平。参与者没有针对这个三维任务做过明确训练，工作空间是作者所说的此前猴子实验的 1.4 到 7.7 倍。

## 6. 喝咖啡

为了测试日常实用性，S3 被要求伸手去拿一瓶咖啡、拿起来、用吸管喝，再放回去。这个任务中手臂只在桌面的二维平面内移动，由神经解码出的抓握状态按任务阶段触发四种手部动作之一（合拢手并抬起、把瓶子转向自己、转回去、放下瓶子并松手）。经过约 14 分钟的熟悉后，她在接下来的 8.5 分钟里，<b>6 次尝试中有 4 次</b>完成了整个流程。作者指出，这是她中风 14 年多以来，第一次靠自己的意愿从容器里喝到东西。

![Figure 2. 参与者 S3 用 DLR 机械臂从瓶子里喝水。取自第一次成功试验的四帧连续画面：抓住瓶子、把瓶子送向嘴边、用吸管喝、把瓶子放回桌上。](/img/readApaper-21/p21_fig2_en.jpg)

<i>Figure 2. 参与者 S3 用 DLR 机械臂从瓶子里喝水。取自第一次成功试验的四帧连续画面：抓住瓶子、把瓶子送向嘴边、用吸管喝、把瓶子放回桌上。</i>

## 7. 多年之后神经元依然“发声”

阵列在植入五年多之后仍在工作。S3 的记录中 spike 幅度比最初几年更小，有用的通道也更少，但卡尔曼滤波器中的通道依然有方向调谐，六次实验中滤波器使用了 13 到 50 个通道。Figure 3 给出了证据：发放随运动方向变化的 unit，以及对抓握意图有响应的 unit。作者还检查了 S3 偶尔出现的手臂屈曲并不能解释这种控制，而 T2 在任务期间没有任何一致的自主运动。

![Figure 3. 三次实验的神经信号。(a–c) S3，三维伸手抓握；(d–f) T2，三维伸手抓握；(g–i) S3，二维喝水实验。(a, d, g) 两个方向调制很强的 unit 的平均波形。(b, e, h) 朝相反目标运动时阈值穿越的栅格图和直方图。(c, f, i) 随抓握意图变化的 unit。](/img/readApaper-21/p21_fig3_en.jpg)

<i>Figure 3. 三次实验的神经信号。(a–c) S3，三维伸手抓握；(d–f) T2，三维伸手抓握；(g–i) S3，二维喝水实验。(a, d, g) 两个方向调制很强的 unit 的平均波形。(b, e, h) 朝相反目标运动时阈值穿越的栅格图和直方图。(c, f, i) 随抓握意图变化的 unit。</i>

## 这项研究说明了什么？

机械臂比健康的手臂更慢、更不精确，但结果表明：即使在受伤多年之后，运动皮层中一小撮神经元仍然携带足够的信息，可以操控一台复杂的机器在三维空间中运动，并驱动一只手张开和合拢。对于完全无法控制手臂的人来说，作者认为哪怕是基本的伸手和抓握，也可能带来很大的解放，让人重新获得独立吃饭喝水的能力；运动皮层的信号还可能用来刺激瘫痪的肌肉。

## 总结

- 运动皮层中的 96 通道阵列，足以让两位长期四肢瘫痪的参与者控制机械臂完成三维伸手抓握。
- 卡尔曼滤波器根据阈值穿越发放率解码手部速度，另一个解码器负责切换手的张开与合拢。
- 在所有目标上，S3 触碰到目标的比例为 48.8%（DLR）和 69.2%（DEKA），T2 为 95.6%；抓住目标的试验比例分别为 21.3%、46.2% 和 62.2%。
- S3 用机械臂从瓶子里喝咖啡，6 次尝试成功 4 次，所用阵列已植入五年多。

---

## References and resources

- Hochberg, L. R., Bacher, D., Jarosiewicz, B., Masse, N. Y., Simeral, J. D., Vogel, J., Haddadin, S., Liu, J., Cash, S. S., van der Smagt, P., & Donoghue, J. P. (2012). <i>Reach and grasp by people with tetraplegia using a neurally controlled robotic arm.</i> Nature, 485, 372–375. [Nature](https://www.nature.com/articles/nature11076) · [PMC 作者手稿](https://pmc.ncbi.nlm.nih.gov/articles/PMC3640850/)
- Figure 1–3 取自 PMC 作者手稿，该手稿依据 Nature 的使用条款，仅供学术研究使用；版权归出版社和作者所有。上文数字来自该手稿。示意图为自绘。正式发布到公开博客前，请先确认这些图的使用授权。
