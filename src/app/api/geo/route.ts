import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_PRICING, SUPPORTED_COUNTRIES, DEFAULT_COUNTRY, type CountryCode } from '@/lib/pricing/countryPricing';

export async function GET(request: NextRequest) {
  // 1. Vérifier cookie de préférence utilisateur (priorité max)
  const userPref = request.cookies.get('zencall_country')?.value;
  
  // 2. Headers de géolocalisation
  const cfCountry = request.headers.get('cf-ipcountry');
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  
  // 3. Déterminer le pays
  let country: CountryCode = DEFAULT_COUNTRY;
  
  if (userPref && SUPPORTED_COUNTRIES.includes(userPref as CountryCode)) {
    country = userPref as CountryCode;
  } else if (cfCountry && SUPPORTED_COUNTRIES.includes(cfCountry as CountryCode)) {
    country = cfCountry as CountryCode;
  } else if (vercelCountry && SUPPORTED_COUNTRIES.includes(vercelCountry as CountryCode)) {
    country = vercelCountry as CountryCode;
  }
  
  // 4. Retourner les données pricing
  const pricing = COUNTRY_PRICING[country];
  
  return NextResponse.json({
    country,
    pricing,
    supported: SUPPORTED_COUNTRIES,
    detectedFrom: userPref ? 'cookie' : (cfCountry || vercelCountry) ? 'ip' : 'default',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const country = body?.country;

    if (!country || !SUPPORTED_COUNTRIES.includes(country as CountryCode)) {
      return NextResponse.json({ ok: false, error: 'invalid_country' }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true, country });
    res.cookies.set('zencall_country', country, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 an
    });
    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }
}
