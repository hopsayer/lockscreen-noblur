// SPDX-License-Identifier: GPL-2.0-or-later

import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {UnlockDialog} from 'resource:///org/gnome/shell/ui/unlockDialog.js';

// Replaces the brightness part of Shell.BlurEffect (BLUR_BRIGHTNESS = 0.65 in unlockDialog.js)
const DIM_ALPHA = 0.65;

export default class LockScreenNoBlur extends Extension {
    enable() {
        const proto = UnlockDialog.prototype;
        const original = proto._createBackground;
        this._original = original;

        proto._createBackground = function (monitorIndex) {
            const group = this._backgroundGroup;
            const before = new Set(group.get_children());

            original.call(this, monitorIndex);

            // Find the widget that the original method just added
            const widget = group.get_children().find(child => !before.has(child));
            if (!widget)
                return;

            // Drop the offscreen blur effect
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
