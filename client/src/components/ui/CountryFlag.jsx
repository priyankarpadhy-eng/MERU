import countryListPkg from 'country-list-with-dial-code-and-flag';
import flagSvgPkg from 'country-list-with-dial-code-and-flag/dist/flag-svg.js';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

// Normalize ESM exports from country-list-with-dial-code-and-flag
const countryList = countryListPkg?.default || countryListPkg;
const flagSvgMap = flagSvgPkg?.default?.default || flagSvgPkg?.default || flagSvgPkg;

/**
 * Detects country details from international phone number dial code
 * Supports all 254 countries and territories worldwide via country-list-with-dial-code-and-flag
 */
export const getCountryFromPhone = (phone) => {
  if (!phone) return null;
  const clean = String(phone).replace(/[^0-9+]/g, '');
  if (!clean) return null;

  const withPlus = clean.startsWith('+') ? clean : `+${clean}`;

  // Longest-prefix match for dial codes (lengths 5 down to 2, e.g. +1684, +971, +91, +1)
  for (let len = Math.min(withPlus.length, 5); len >= 2; len--) {
    const prefix = withPlus.slice(0, len);
    const found = countryList.findOneByDialCode(prefix);
    if (found?.data) {
      const { code, name, dial_code, flag } = found.data;
      return {
        code,
        name,
        dial_code,
        flag,
        svg: flagSvgMap ? flagSvgMap[code] : null,
      };
    }
  }

  return {
    code: 'INTL',
    name: 'International',
    dial_code: '',
    flag: '',
    svg: null,
  };
};

/**
 * Formats mobile/phone numbers with dial code followed by a space, then the rest closely placed
 * e.g. "+1 4155550101", "+91 9876543210", "+44 2079460912"
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '—';
  const clean = String(phone).trim().replace(/[^0-9+]/g, '');
  if (!clean) return phone;

  const withPlus = clean.startsWith('+') ? clean : `+${clean}`;

  for (let len = Math.min(withPlus.length, 5); len >= 2; len--) {
    const prefix = withPlus.slice(0, len);
    const found = countryList.findOneByDialCode(prefix);
    if (found?.data?.dial_code) {
      const dial = found.data.dial_code;
      const national = withPlus.slice(dial.length).replace(/\D/g, '');
      return national ? `${dial} ${national}` : dial;
    }
  }

  // Fallback regex if dial code prefix wasn't identified in country list
  const match = withPlus.match(/^(\+\d{1,4})(.*)$/);
  if (match) {
    const rest = match[2].replace(/\D/g, '');
    return rest ? `${match[1]} ${rest}` : match[1];
  }

  return phone;
};

/**
 * Universal Country Flag component powered by country-list-with-dial-code-and-flag.
 * Renders high-resolution crisp SVGs for all 250+ countries, with fallback to country emoji flag.
 */
export const CountryFlag = ({ phone, className = '' }) => {
  const country = getCountryFromPhone(phone);

  if (!country) return null;

  if (country.code === 'INTL' || (!country.svg && !country.flag)) {
    return (
      <Globe
        className={cn('w-3.5 h-3.5 text-text-tertiary shrink-0 inline-block align-middle', className)}
        title="International"
        aria-label="International"
      />
    );
  }

  // Render SVG flag if available in the package map
  if (country.svg) {
    return (
      <span
        className={cn(
          'w-4 h-3 rounded-[2px] shrink-0 border border-border/80 shadow-xs inline-flex items-center justify-center align-middle overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover',
          className
        )}
        title={`${country.name} (${country.dial_code})`}
        aria-label={country.name}
        dangerouslySetInnerHTML={{ __html: country.svg }}
      />
    );
  }

  // Fallback to unicode country flag
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center text-[13px] leading-none shrink-0 select-none align-middle',
        className
      )}
      title={`${country.name} (${country.dial_code})`}
      aria-label={country.name}
      role="img"
    >
      {country.flag}
    </span>
  );
};
