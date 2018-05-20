---
title: "Dop SSD update"
cover: "https://picsum.photos/g/800/600?image=0"
date: "30-04-2015"
category: "mypc"
tags:
    - mypc
---

30-2-2015

I'm replacing the 128GB SSD (Samsung 840 pro) by a 500GB SSD (Samsung 850 EVO) so I have enough space to move the /home partition to the SSD as well. I also had [the problem](../dop-wont-boot-and-usb-issues/) that suddenly my SSD is no longer booting, without using super grub disk, so I might solve this as well.

Currently, I have the SSD with the boot and root partitions on it, a 320GB HDD with the /home (ext3) and swap partitions and a 1,5 TB HDD for storage. I will replace the SSD and the 320GB by the 500GB SSD.

Booting a Ubuntu 13.04 live CD already gives some problems. Right after loading the desktop the system freezes. After multiple reboots it works normally. Using gparted to make exact copies of all partitions from the old SSD to the new SSD (just using copy/paste in gparted). I use a GPT partition table instead of msdos.

Now I disconnect the old SSD and reboot with the super grub disk, like I was doing before. This boots as expected. No I try to fix the boot issue.

## Making bootable

After BIOS initialization the message "no bootable partition found" is displayed. Using F12 before boot to select the SSD manually doesn't work either, only super grub disk. I try to follow the official [Boot Repair instructions](https://help.ubuntu.com/community/Boot-Repair).

Following the second option "install Boot-Repair in Ubuntu" I first login to Ubuntu normally (still booting with super grub disk) to install boot-repair:

```
sudo add-apt-repository ppa:yannubuntu/boot-repair
sudo apt-get update
sudo apt-get install -y boot-repair && boot-repair
```

But when I try to run it (```boot-repair``` and selecting "recommended repair") I get a message:

```
Please create a BIOS-Boot partition: (>1MB, unformatted filesystem, bios_grub flag). This can be performed by tools like gparted, then try again.
```

So, let's follow these detailed instructions!

The current situation is:

```
/dev/sdc1 fat32       249MiB    label EFI   flags msftdata
/dev/sdc2 ext4        118.98GiB             flags msftdata
/dev/sdc3 linux-swap   15.62GiB
```

The fat32 partition was copied from the old SSD. I manually removed the fat32 partition and replaced it with an unformatted BIOS-boot partition and then I rebooted as instructed by gparted. Surprisingly, the partition still shows up as a fat32 partition so I select it and choose > format > cleared. Know the partion is listed as "unknown".

Setting the flag "bios_grub" gives this result for /dev/sdc1:

```
/dev/sdc1 unknown 249MiB, flags bios_grub
```

I rerun boot-repair > recommended repair, but get another error:

```
The boot of your PC is in EFI mode, but no EFI partition was deteced. You may want to retry after creating a EFI partiiton (FAT32, 100~250MB, start of disk, boot flag). Do you want to continue.
```

So I cancel and try to create the EFI partition from a part of the bios-boot partition with gparted:

```
/dev/sdc4 fat32      244Mib    label EFI   flags boot, esp
/dev/sdc1 unknown      5MiB                flags bios_grub
/dev/sdc2 ext4       118.98GiB             flags msftdata
/dev/sdc3 linux-swap  15.62GiB
```

Now I close gparted and run boot-repair > recommended repair for the third time, just to get this error again:

```
The boot of your PC is in EFI mode, but no EFI partition was deteced. You may want to retry after creating a EFI partiiton (FAT32, 100~250MB, start of disk, boot flag). Do you want to continue.
```

Now I see no other choice then to continue and I get a progress window telling me that "repair file systems sdb1 this may require several minutes". That's odd, because sdb1 is not the new ssd. Anyway, after 30 minutes of running, I cancelled it and rebooted. And of course it still doesn't work.

Apparently this was all futile and I switch to the [non-graphical instructions to restore grub]((https://help.ubuntu.com/community/RecoveringUbuntuAfterInstallingWindows)). Now I'm trying:

```
sudo grub-install /dev/sdc
```

This is done instantly. After rebooting and using F12 to select the boot device, I can now select the new SSD partition and boot Ubuntu. Progress!

Unfortunately, booting still requires me to select the correct drive manually. This should be easy, just go into the BIOS and change the boot order. But where the boot order is listed, only 2 devices show up: the 1,5TB HDD and the optical drive. After frantic searching in the BIOS and online, I realize something like this might be mentioned in the manual (it is a Gigabyte Z87-HD3 motherboard), and indeed:

* go to BIOS, switch to classic mode 
* go to tab BIOS features
* now below boot order there is something like:
    * DVD bbs priorities
    * hard disk bbs priorities
* click hard disk bbs priorities and here I can change the order.

Now it boots directly into Ubuntu! It's using legacy boot and not EFI, but that's fine.


## Moving /home

Copying data from one disk to another is easy, but I want to change the formatting from ext3 to ext4 at the same time and of course it contains /home, so I need to update the mount point.

* Use gparted to create new partition on the new SSD:

```
/dev/sdc5 ext4 330.91GiB
```

* Use rsync to copy from the old to the new partition. 
    * The syntax is ```rsync --progress -a source dest```
    * from /dev/sda3 -> /media/ubuntu/9af1dc04-72d9-43a9-a67c-c11f2118dfa6
    * to /dev/sdc5 -> /media/ubuntu/211c3ec1-1314-492d-946e-8cb3d24888a9
    * so using ```rsync --progress -a /media/ubuntu/9af1dc04-72d9-43a9-a67c-c11f2118dfa6 /media/ubuntu/211c3ec1-1314-492d-946e-8cb3d24888a9``` (WARNING: this is a minor mistake because it creates a dir 9af1dc04-72d9-43a9-a67c-c11f2118dfa6 on the new drive, see below)
    * I also run ```watch -n30 df --type=ext4 --type=ext3 -BG``` to have an indication of the progress
* I immediately see that plenty of dirs give the error "rsync: open dir: permission denied", so I run the same instruction but with sudo. Now it runs much longer. In a couple of hours everything is copied. Running it again logs nothing copied, so it seems to have been successful.

Now the reference of the /home mount point needs to be [fixed](https://help.ubuntu.com/community/Partitioning/Home/Moving)

* the contents of /media/ubuntu/1ea18a24-56eb-4a89-9f54-f9d547c88e35/etc/fstab list as (only relevant parts):

```
# / was on /dev/sda1 during installation
UUID=1ea18a24-56eb-4a89-9f54-f9d547c88e35 /       ext4   errors=remount-ro  0  1
# /home was on /dev/sdb3 during installation
UUID=9af1dc04-72d9-43a9-a67c-c11f2118dfa6 /home   ext3   defaults           0  2
# swap was on /dev/sdb2 during installation
UUID=079723eb-16f6-487f-b5bb-588d48ce0d55 none    swap   sw                 0  0
```

* listing all UUID with ```sudo blkid``` (only relevant parts):

```
/dev/sda2: UUID="079723eb-16f6-487f-b5bb-588d48ce0d55" TYPE="swap"
/dev/sda3: UUID="9af1dc04-72d9-43a9-a67c-c11f2118dfa6" SEC_TYPE="ext2" TYPE="ext3"
/dev/sdc2: UUID="1ea18a24-56eb-4a89-9f54-f9d547c88e35" TYPE="ext4"
/dev/sdc3: UUID="fbac86d0-4f93-4d8e-a762-dda9c2a61105" TYPE="swap"
/dev/sdc5: UUID="211c3ec1-1314-492d-946e-8cb3d24888a9" TYPE="ext4"
```

* changed fstab to (only relevant parts:

```
# / was on /dev/sdc2 after move to new SSD
UUID=1ea18a24-56eb-4a89-9f54-f9d547c88e35 /       ext4   errors=remount-ro 0  1
# /home was on /dev/sdc5 after move to new SSD
UUID=211c3ec1-1314-492d-946e-8cb3d24888a9 /home   ext4   defaults          0  2
# swap was on /dev/sdc3 after move to new SSD
UUID=fbac86d0-4f93-4d8e-a762-dda9c2a61105 none    swap   sw                0  0
```

* after rebooting, login failed. Relogged with live CD and found that the /home was copied to a subdir of the new drive. Copied it to the main dir and rebooted. Login in worked normally and is very fast! (How fast? 30 seconds from pressing the power button to seeing the homepage in Firefox)

And finally, when removing the old HDD from the case, I accidentally broke off a system fan pin from the motherboard. The other system fan pins are too far away and the other system fan already died some time ago. Now the only fan is the CPU fan, but so far it seems to be managing with a coretemp of max. 35&deg;C and a CPU temp of max 26&deg;C.