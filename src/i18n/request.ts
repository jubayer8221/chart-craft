import en from './messages/en.json';
import bn from './messages/bn.json';

const messages = {
  en,
  bn,
};

export async function getMessages(locale: string) {
  return messages[locale as keyof typeof messages] || messages.en;
}

export default async function request({ params }: { params: { lang: string } }) {
  const locale = params.lang || 'en';
  return getMessages(locale);
}
