---
title: "Full update for Broek"
cover: "https://picsum.photos/g/800/600?image=0"
date: "02-12-2015"
category: "mypc"
tags:
    - mypc
---

**2-12-2015** After updating some packages, I rebooted for the first time after a long time. I thought it would help with cleaning up unused kernels on the boot partition. The box apparently hangs on boot, but no keyboard/monitor are connected so this can still be anything. After connecting some peripherals, nothing happened. Upon trying to reboot the power LED stays on and doesn't respond to pressing (and holding) the power button. Removing and reinserting the power cable is the final straw: now nothing happens, even the power LED stays off.

**3-12-2015** In a last attempt to find the culprit, I disassembled the box and plugged in old PSU. Upon connecting power and switching the PSU on, it's fan twitches, but does not start spinning normally. Pressing the power button on the motherboard has no visible effect. The motherboard has probably died.

Building a replacement was already planned, but now has to be rushed unfortunately, so these parts were ordered:

* (mobo) ASRock B85M Pro4
* (ram) 2x  Crucial DDR3 DIMM 1x4GB 1600 C11
* (cpu) Intel Celeron G1840
* (case) Cooler Master Silencio 352
* (fan) Noctua NH-L9i
* (psu) Seasonic G-Serie 360Watt

Additionally, I will re-use the drives (80GB + 3TB) and a Samsung 840 SSD (128GB) that I have lying around.

**12-12-2015** After assembeling the parts and just popping in the hard drives the system boots normally, although getting the secondary drive to work this requires fixing its entry in /etc/fstab.

The ethernet adapter is not working, which makes sense, because it is a different on-board adapter.

* I can't ping outside the system
* The ethernet lights next to the port are on
* ```ifconfig``` lists a br0 and an lo device, but no eth0
* lspci lists the Ethernet Controller as Intel I217-V
* running ```sudo lshw -C network``` gives ```*-network DISABLED```
* running ```dmesg | grep eth``` gives ```eth0: link is not ready```
* renamed network interface eth0 to eth1, then ran:

```
sudo modprobe e100
sudo ifconfig eth1 up
```

* did not work, but no errors.
* According to [this article](http://www.serenux.com/2009/11/howto-fix-a-missing-eth0-adapter-after-moving-ubuntu-server-from-one-box-to-another/) I need to edit ```/etc/udev/rules.d/70-persistent-net.rules``` (as root) and comment out the old ethernet device
* After rebooting, it detects the ethernet adapter automatically.

**13-12-2015** Of course, since the on-board sound card also changed, its drivers also needs to be reconfigured. I plugged the speakers into the lime port, I just want to use 2 channel sound.

* ```aplay /usr/share/sounds/alsa/Front_Center.wav``` gives an error.
* ```sudo aplay -l``` does lists several cards, one being PCH ALC892 analog
* when using alsamixer, I see that HDMI is set as the default out. The old motherboard did not have HDMI out, so it did detect this new HDMI correctly. This should be changed to analog.
* I tried several things that had no effect, such as reinstalling alsa and rebooting, and changing the default device with ```pacmd list-cards```
* Eventually, running ```lspci -knn|grep -iA2 audio``` shows I'm using snd_hda_intel kernel driver
* I edit ```/etc/modprobe.d/alsa-base.conf``` as root
* I add the line ```options snd_hda_intel index=1``` under the last "install"  statement
* Now I run ```sudo alsa force-reload```
* run alsamixer: now analog is active!
* run ```aplay /usr/share/sounds/alsa/Front_Center.wav```. I hear the sound!

The case and fans were picked for being very silent. Unfortunately, they are still quite loud at the moment. I did have the sense to pick a case with PWM fans, so I need to configure those.

[This article](http://askubuntu.com/questions/22108/how-to-control-fan-speed) describes how to set it up.

* Install: ```sudo apt-get install lm-sensors fancontrol```
* Configure lm-sensors: ```sudo sensors-detect```

With the result:

```
#----cut here----
# Chip drivers
coretemp
nct6775
#----cut here----
```

* After starting the service, ```sensors``` gives output. I see coretemp around 30 C and RPMs for fan1, fan2, fan5.
* Configure fancontrol: ```sudo pwmconfig```

```
Found the following devices:
   hwmon0/device is coretemp
   hwmon1 is nct6776

Found the following PWM controls:
  hwmon1/pwm2           current value: 165
  hwmon1/pwm3           current value: 165
respond to changes, pwm1 doesn't. Probably the two chassis fans.
```

I have a [Noctua NH-L9i CPU fan](http://www.silentpcreview.com/Noctua_NH-L9i) so I could use the Low-Noise adapter, but lets first try PWM.

Fan2 seems to be the CPU fan, because the fan speed corresponds with the max speed of the Noctua NH-L9i. During pwmconfig I found out that setting the speed below 2000 RPM will greatly reduce the sound production. This means the low-noise adapter would definitely help. The CPU fan is hwmon1/fan2_input and is controlled by pwm hwmon1/pwm2.

After configuring both fans with pwmconfig, I start fancontrol service: ```sudo service fancontrol start``` and the noise dropped significantly!

The front fan (I think, I can't really hear it that well) is still quite noisy. It doesn't respond to configuring by pwmconfig, for some reason. I might just turn it off. The state after configuring:

* fan1 (front?): was 1100 before configuration &rarr; after configuration 1100 (unchanged)
* fan2 (cpu): 2500 &rarr; 1150
* fan3 (rear?): 1100 &rarr; 380

**15-12-2015** Added the low noise adapter to the front fan. Running ```sensors```:

* fan1 (front): 1100 &rarr; 881. 
* fan2 (cpu): 980
* fan5 (rear): 327. 
* Cpu temp around 32 C

The noise production is now is very low.

I've also added two extra drives (an SSD and an old 1,5TB HDD) that need to be configured. Running ```sudo lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL``` gives:

```
NAME                    FSTYPE        SIZE MOUNTPOINT  LABEL
sda                                   2.7T            
`-sda1                  ext4          2.7T /mnt/disk3t
sdb                                  74.5G            
|-sdb1                  ext2          243M /boot      
|-sdb2                                  1K            
`-sdb5                  LVM2_member  74.3G            
  |-broek-root (dm-0)   ext4         71.8G /          
  `-broek-swap_1 (dm-1) swap          2.5G [SWAP]     
sdc                                   1.4T            
`-sdc1                  ext3          1.4T             OldDrive
sdd                                 119.2G            
|-sdd1                  ext4          119G            
`-sdd3                  vfat          249M             EFI
```

The filesystem sizes give away which drives are which and even the label of one of the drives is still intact.
For the moment I mount them manually:

```bash
sudo mount /dev/sdc1 /mnt/disk1500g
sudo mount /dev/sdd1 /mnt/diskSsdTemp
```

Both seem to work, so I just added them to the fstab and configured the 1,5TB drive as an export via Webmin.


At this moment only the USB device [Rekelbox](https://bitbucket.org/mdvanes/mderekelbox) doesn't work anymore. I thought it might need an update of the USB drivers, not unlike the audio and network drivers before. The initPort.sh script fails with
```stty: /dev/ttyUSB0: Inappropriate ioctl for device```. Trying to find a solution gives many hits, non of which seem appropriate for my case. Trying a USB flash drive works fine, so I don't think it's the USB drivers.

After searching messageboards for a long time, I just tried rebooting with the USB device plugged in: it started working immediately!