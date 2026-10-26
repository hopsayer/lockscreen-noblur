# Lock Screen: No Blur

GNOME Shell extension that removes the blur effect from the lock screen background and dims the wallpaper with a plain translucent overlay instead.

It exists as a workaround for [gnome-shell#7052](https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/7052): in multi-monitor setups the lock screen wallpaper can turn black on one monitor. With the blur effect removed the problem does not occur.

## How it works

`UnlockDialog._createBackground()` is wrapped. After the original method has created the per-monitor background widget, the `blur` effect (`Shell.BlurEffect`) is removed from it and a sibling `St.Widget` with a semi-transparent black background is added to keep the wallpaper dimmed. `disable()` restores the original method.

The extension declares the `unlock-dialog` session mode because the lock screen is the only place it changes anything.

## Configuration

The dim level is the `DIM_ALPHA` constant at the top of `extension.js`.

## Install

```bash
git clone https://github.com/hopsayer/lockscreen-noblur
cd lockscreen-noblur
mkdir -p ~/.local/share/gnome-shell/extensions/lockscreen-noblur@hopsayer.github.io
cp extension.js metadata.json ~/.local/share/gnome-shell/extensions/lockscreen-noblur@hopsayer.github.io/
```

Log out and back in (Wayland), then `gnome-extensions enable lockscreen-noblur@hopsayer.github.io`.

## License

GPL-2.0-or-later
