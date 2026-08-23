// ─────────────────────────────────────────────────────────────────────────────
// ENTREGA POR CORREO
//
// Sin backend ni OAuth no es posible adjuntar automáticamente un PDF generado en
// el navegador: `mailto:` no admite adjuntos. No se finge lo contrario. El flujo
// es explícito: generar → descargar → abrir el correo preparado → adjuntar.
// ─────────────────────────────────────────────────────────────────────────────
import { class1Meta, delivery } from '@/content/class1/manifest';
import { bitacoraFilename } from './bitacoraPdf';
import { fullName, type Class1State } from './state';

export function deliverySubject(state: Class1State): string {
  return `DIAT · Clase 1 · Entrega · ${fullName(state.student) || 'Estudiante'}`;
}

export function deliveryBody(state: Class1State): string {
  const name = fullName(state.student) || '[nombre]';
  return [
    'Estimado equipo DIAT:',
    '',
    `Adjunto mi Bitácora de Razonamiento Jurídico Asistido correspondiente a la Clase 1 del Taller de IA y Prompting Jurídico (${class1Meta.date}).`,
    '',
    `Archivo: ${bitacoraFilename(state)}`,
    '',
    'Saludos cordiales,',
    name,
    state.student.email || '',
  ].join('\n');
}

export function deliveryMailto(state: Class1State): string {
  const params = new URLSearchParams({
    cc: delivery.cc,
    subject: deliverySubject(state),
    body: deliveryBody(state),
  });
  // URLSearchParams codifica los espacios como «+»; mailto exige %20.
  return `mailto:${delivery.to}?${params.toString().replace(/\+/g, '%20')}`;
}

export { delivery };
