import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {UnlockDialog} from 'resource:///org/gnome/shell/ui/unlockDialog.js';

// Replaces the brightness part of Shell.BlurEffect (BLUR_BRIGHTNESS = 0.65)
const DIM_ALPHA = 0.35;

export default class LockScreenNoBlur extends Extension {
    enable() {
        const proto = UnlockDialog.prototype;
        const original = proto._createBackground;
        this._original = original;

        proto._createBackground = function (monitorIndex) {
            original.call(this, monitorIndex);

            // The widget just created is the last child of the background group
            const group = this._backgroundGroup;
            const widget = group.get_last_child();
            if (!widget)
                return;

            // Drop the offscreen blur effect (suspected source of the black actor)
            widget.remove_effect_by_name('blur');

            // Plain dimming overlay as a sibling of the widget, so actors that
            // BackgroundManager adds inside `widget` can never end up above it.
            // _updateBackgrounds() destroys all group children, so overlays are
            // recreated together with the backgrounds.
            group.add_child(new St.Widget({
                x: widget.x,
                y: widget.y,
                width: widget.width,
                height: widget.height,
                style: `background-color: rgba(0, 0, 0, ${DIM_ALPHA});`,
                reactive: false,
            }));
        };
    }

    disable() {
        if (this._original) {
            UnlockDialog.prototype._createBackground = this._original;
            this._original = null;
        }
    }
}
