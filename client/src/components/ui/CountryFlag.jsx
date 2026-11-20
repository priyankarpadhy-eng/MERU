import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Detects ISO country code from international phone number prefix
 */
export const getCountryFromPhone = (phone) => {
  if (!phone) return null;
  const clean = phone.replace(/[^0-9+]/g, '');

  if (clean.startsWith('+971')) return { code: 'AE', name: 'United Arab Emirates' };
  if (clean.startsWith('+91')) return { code: 'IN', name: 'India' };
  if (clean.startsWith('+44')) return { code: 'GB', name: 'United Kingdom' };
  if (clean.startsWith('+49')) return { code: 'DE', name: 'Germany' };
  if (clean.startsWith('+33')) return { code: 'FR', name: 'France' };
  if (clean.startsWith('+61')) return { code: 'AU', name: 'Australia' };
  if (clean.startsWith('+81')) return { code: 'JP', name: 'Japan' };
  if (clean.startsWith('+65')) return { code: 'SG', name: 'Singapore' };
  if (clean.startsWith('+31')) return { code: 'NL', name: 'Netherlands' };
  if (clean.startsWith('+34')) return { code: 'ES', name: 'Spain' };
  if (clean.startsWith('+39')) return { code: 'IT', name: 'Italy' };
  if (clean.startsWith('+55')) return { code: 'BR', name: 'Brazil' };
  if (clean.startsWith('+52')) return { code: 'MX', name: 'Mexico' };
  if (clean.startsWith('+1')) return { code: 'US', name: 'United States' };

  return { code: 'INTL', name: 'International' };
};

/**
 * Clean, lightweight SVG country flag renderer (no emojis per design standards)
 */
export const CountryFlag = ({ phone, className = '' }) => {
  const country = getCountryFromPhone(phone);

  if (!country) return null;

  const baseSvgClass = cn(
    'w-4 h-3 rounded-[2px] shrink-0 border border-border/80 shadow-xs inline-block align-middle overflow-hidden',
    className
  );

  switch (country.code) {
    case 'US':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#bd3d44" d="M0 0h640v480H0z" />
          <path
            stroke="#fff"
            strokeWidth="37"
            d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
          />
          <path fill="#192f5d" d="M0 0h260v259H0z" />
          <circle cx="50" cy="50" r="10" fill="#fff" />
          <circle cx="100" cy="50" r="10" fill="#fff" />
          <circle cx="150" cy="50" r="10" fill="#fff" />
          <circle cx="200" cy="50" r="10" fill="#fff" />
          <circle cx="75" cy="90" r="10" fill="#fff" />
          <circle cx="125" cy="90" r="10" fill="#fff" />
          <circle cx="175" cy="90" r="10" fill="#fff" />
          <circle cx="50" cy="130" r="10" fill="#fff" />
          <circle cx="100" cy="130" r="10" fill="#fff" />
          <circle cx="150" cy="130" r="10" fill="#fff" />
          <circle cx="200" cy="130" r="10" fill="#fff" />
          <circle cx="75" cy="170" r="10" fill="#fff" />
          <circle cx="125" cy="170" r="10" fill="#fff" />
          <circle cx="175" cy="170" r="10" fill="#fff" />
          <circle cx="50" cy="210" r="10" fill="#fff" />
          <circle cx="100" cy="210" r="10" fill="#fff" />
          <circle cx="150" cy="210" r="10" fill="#fff" />
          <circle cx="200" cy="210" r="10" fill="#fff" />
        </svg>
      );

    case 'GB':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path
            fill="#FFF"
            d="m75 0 245 180L565 0h75v50L440 240l200 150v50h-75L320 260 75 440H0v-50l200-150L0 50V0z"
          />
          <path
            fill="#C8102E"
            d="m0 0 265 195h-50L0 35v-35zm640 0L375 195h50L640 35V0zM0 440l265-195h-50L0 405v35zm640 0L375 245h50L640 405v35z"
          />
          <path fill="#FFF" d="M260 0h120v480H260zM0 180h640v120H0z" />
          <path fill="#C8102E" d="M285 0h70v480h-70zM0 205h640v70H0z" />
        </svg>
      );

    case 'IN':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#f93" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#128807" d="M0 320h640v160H0z" />
          <circle cx="320" cy="240" r="45" fill="none" stroke="#000080" strokeWidth="8" />
          <circle cx="320" cy="240" r="10" fill="#000080" />
        </svg>
      );

    case 'DE':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#000" d="M0 0h640v160H0z" />
          <path fill="#d00" d="M0 160h640v160H0z" />
          <path fill="#ffce00" d="M0 320h640v160H0z" />
        </svg>
      );

    case 'FR':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#002395" d="M0 0h213v480H0z" />
          <path fill="#fff" d="M213 0h214v480H213z" />
          <path fill="#ed2939" d="M427 0h213v480H427z" />
        </svg>
      );

    case 'AU':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#00008b" d="M0 0h640v480H0z" />
          {/* Canton Mini Union Jack */}
          <path fill="#012169" d="M0 0h320v240H0z" />
          <path fill="#FFF" d="m37 0 123 90L282 0h38v25L220 120l100 75v25h-38L160 130 37 220H0v-25l100-75L0 25V0z" />
          <path fill="#FFF" d="M130 0h60v240h-60zM0 90h320v60H0z" />
          <path fill="#C8102E" d="M142 0h36v240h-36zM0 102h320v36H0z" />
          {/* Southern Cross stars */}
          <circle cx="480" cy="100" r="14" fill="#fff" />
          <circle cx="550" cy="180" r="14" fill="#fff" />
          <circle cx="480" cy="360" r="14" fill="#fff" />
          <circle cx="420" cy="220" r="14" fill="#fff" />
          <circle cx="500" cy="240" r="8" fill="#fff" />
        </svg>
      );

    case 'AE':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#00732f" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#000" d="M0 320h640v160H0z" />
          <path fill="#f00" d="M0 0h160v480H0z" />
        </svg>
      );

    case 'JP':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#fff" d="M0 0h640v480H0z" />
          <circle cx="320" cy="240" r="120" fill="#bc002d" />
        </svg>
      );

    case 'SG':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#ed2939" d="M0 0h640v240H0z" />
          <path fill="#fff" d="M0 240h640v240H0z" />
          <circle cx="120" cy="120" r="50" fill="#fff" />
          <circle cx="135" cy="120" r="45" fill="#ed2939" />
        </svg>
      );

    case 'NL':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#ae1c28" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#21468b" d="M0 320h640v160H0z" />
        </svg>
      );

    case 'ES':
      return (
        <svg
          viewBox="0 0 640 480"
          className={baseSvgClass}
          title={country.name}
          aria-label={country.name}
        >
          <path fill="#c60b1e" d="M0 0h640v120H0zM0 360h640v120H0z" />
          <path fill="#ffc400" d="M0 120h640v240H0z" />
        </svg>
      );

    default:
      return (
        <span
          className="inline-flex items-center justify-center w-4 h-3 rounded-[2px] bg-surface-muted border border-border/80 text-text-tertiary shrink-0"
          title={country.name}
          aria-label={country.name}
        >
          <Globe className="w-2.5 h-2.5" strokeWidth={2} />
        </span>
      );
  }
};
