export function softwareApplicationLdJson({ name, description }: { name: string, description: string }) {
  return {
    '@type': 'SoftwareApplication',
    name,
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web, Windows, macOS, Linux, iOS, Android',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.7',
      'ratingCount': '257'
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'description': 'Free'
    },
    description,
    'url': 'https://www.handoff.chat/'
  }
}
