type LooksLikeLocaleParams = {
  segment: string | undefined;
};

const localeLikePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i;

export function looksLikeLocale({ segment }: LooksLikeLocaleParams): boolean {
  if (!segment) {
    return false;
  }

  return localeLikePattern.test(segment);
}
