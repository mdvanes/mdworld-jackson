---
title: "Dop won't boot and USB issues"
cover: "https://picsum.photos/g/800/600?image=0"
date: "02-03-2015"
category: "mypc"
tags:
    - mypc
---

When I plugged in an USB stick in the USB3 front panel of my workstation dop, there was no response. The USB stick's light didn't turn on.

After I opened up the sidepanel the USB plug to the motherboard wasn't plugged in, so I fixed that.

After rebooting, I was greeted with this ugly message:

```
Error: no such partition found 
grub rescue>
```

I tried using grub rescue. But using ```ls``` I can't find the boot partion. Then I notice, the bootdisk isn't showing up in the EFI.

After opening up the sidepanel again I notice the power is not plugged in to my SSD, the bootdisk of the machine... Strangely, after plugging it in, the same error occurs.

Booting from an Ubuntu live CD, all drives are visible, but the main SSD (/dev/sda2) shows an error in gparted. It does have the bios_grub flag. It gives the error:

```unable to detect file system```

After deleting the /dev/sda4 bios_grub partition of 17MB this leaves an EFI fat32 partition with boot flag (dev/sda3) and main partition /dev/sda1 with /boot.

Reboot: doesn't change anything.

Now I'm really need to use the system, so I try rebooting with super grub disk. The system boots immediately with first found settings. I think I'll leave it like this because I want to upgrade the SSD in the near future anyway.