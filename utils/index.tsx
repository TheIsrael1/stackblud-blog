export function capitalizeText(input: string, capitalizeOption: 'firstWord' | 'allWords'): string {
  if (capitalizeOption === 'firstWord') {
    return input.replace(/^(.)/, (_, match) => match.toUpperCase());
  } else if (capitalizeOption === 'allWords') {
    return input.replace(/\b\w/g, (match) => match.toUpperCase());
  } else {
    return input;
  }
}
