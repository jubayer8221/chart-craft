import en from '@/i18n/messages/en.json';
import bn from '@/i18n/messages//bn.json';
import { Locale } from '../config';

const messages = { en, bn };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en;
}
