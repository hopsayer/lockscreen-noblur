# Lock Screen: No Blur

GNOME Shell extension that removes the blur effect from the lock screen background and dims the wallpaper with a plain translucent overlay instead.

It exists as a workaround for [gnome-shell#3206](https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/3206): in multi-monitor setups the lock screen wallpaper can turn black on the primary monitor. With the blur effect removed the problem does not occur in my testing.

The underlying problem is on the mutter side: the redraw clip of one monitor leaks into the offscreen capture of a `ClutterOffscreenEffect` (such as the lock screen blur) and the background of another monitor is skipped, leaving the captured texture blank. A fix is under review in [mutter!5307](https://gitlab.gnome.org/GNOME/mutter/-/merge_requests/5307). Once it is released, this extension is no longer needed.

## How it works

`UnlockDialog._createBackground()` is wrapped. After the original method has created the per-monitor background widget, the `blur` effect (`Shell.BlurEffect`) is removed from it and a sibling `St.Widget` with a semi-transparent black background is added to keep the wallpaper dimmed. `disable()` restores the original method.

The extension declares the `unlock-dialog` session mode because the lock screen is the only place it changes anything.

## Install

### From a release (recommended)

Download `lockscreen-noblur@hopsayer.github.io.shell-extension.zip` from the [latest release](https://github.com/hopsayer/lockscreen-noblur/releases/latest) and run:

```bash
gnome-extensions install --force lockscreen-noblur@hopsayer.github.io.shell-extension.zip
```

### From source

```bash
git clone https://github.com/hopsayer/lockscreen-noblur
cd lockscreen-noblur
mkdir -p ~/.local/share/gnome-shell/extensions/lockscreen-noblur@hopsayer.github.io
cp extension.js metadata.json ~/.local/share/gnome-shell/extensions/lockscreen-noblur@hopsayer.github.io/
```

### Enable

On Wayland a newly installed extension is only picked up after you log out and back in. Then run:

```bash
gnome-extensions enable lockscreen-noblur@hopsayer.github.io
```

## Configuration

The strength of the dimming that replaces the blur's brightness reduction is the `DIM_ALPHA` constant at the top of `extension.js`:

```js
const DIM_ALPHA = 0.35;
```

It is the opacity of the black overlay, from `0` (no dimming) to `1` (fully black). The default `0.35` matches the dimming of GNOME's stock lock screen (blur brightness `0.65`). Increase it if the wallpaper is too bright for the clock and icons to stay readable, for example `0.5` or `0.65`.

To change it for an installed extension, edit

```
~/.local/share/gnome-shell/extensions/lockscreen-noblur@hopsayer.github.io/extension.js
```

and log out and back in (on Wayland the shell has to be restarted to reload the file).

## Compatibility

Tested on GNOME Shell 48.7 (Debian 13, Wayland and X11), 50.5 (Fedora 44, Wayland), and 51.1 (EndeavourOS, Wayland) with dark and light wallpapers. GNOME Shell 45–47 and 49 are declared based on the gnome-shell sources only: the code that the extension patches is the same in 45.0–51.0, but I have not run it on those versions (it's hard to even get them nowadays) and cannot offer support for them.

The bug is reported on Wayland; on X11 it [reportedly](https://gitlab.gnome.org/GNOME/gnome-shell/-/work_items/3206) does not reproduce, so the extension is probably not needed there.

## Uninstall

```bash
gnome-extensions uninstall lockscreen-noblur@hopsayer.github.io
```

## License

GPL-2.0-or-later
