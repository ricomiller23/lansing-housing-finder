import re

path = '/Users/ericmiller/.gemini/antigravity/scratch/lansing-housing-finder/lib/providers/rentcast.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the template strings that got eaten by shell
content = content.replace("id: ,", "id: 'rentcast:' + (item.id || item.formattedAddress || String(Math.random())),")
content = content.replace("googleMapsUrl: getGoogleMapsRouteUrl(, r.address.lat, r.address.lng),", "googleMapsUrl: getGoogleMapsRouteUrl(r.address.line1 + ', ' + r.address.city + ', MI ' + r.address.zip, r.address.lat, r.address.lng),")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed rentcast.ts")
