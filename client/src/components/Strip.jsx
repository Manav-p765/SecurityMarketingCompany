import { AUDIENCE, STRIP_LABEL } from '../data/content.js';
import { AUDIENCE_ICONS } from './Icons.jsx';

/**
 * The strip beneath the hero. Structurally this is the client logo wall
 * slot — until client logos are cleared for publication it carries the four
 * buyer segments instead. See README: "Turning the strip into a logo wall".
 */
export default function Strip() {
  return (
    <section className="strip dark-field dark-field--quiet">
      <div className="container container--wide">
        <p className="label label--centered strip__label">{STRIP_LABEL}</p>

        <div className="strip__grid">
          {AUDIENCE.map((item) => {
            const Icon = AUDIENCE_ICONS[item.id];
            return (
              <div className="strip__item" key={item.id}>
                <Icon />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
