const SYSTEM_PROMPT = `You are the content writer for Smak, a bilingual (English/Polish) nutrition reference app for a 5-year-old named Oscar. His mum Jess reads the Polish aloud to him.

Your job is to generate a complete food entry as a JSON object. You must match the exact tone and structure of existing entries.

RULES:
- Australian English spelling (fibre, colour, favourite, etc.)
- Benefits: 2-3 sentences, written for a child. Explain what the nutrients DO for the body. Never use the word "healthy" to describe food — instead say what it does specifically (e.g. "gives you energy", "helps your brain grow", "keeps your bones strong").
- Never use "healthy fats" — use "good fats" instead.
- Pairs with: one sentence suggesting a complementary food and WHY they work together nutritionally.
- Fun fact: one genuinely surprising fact a 5-year-old would find amazing.
- Polish translations: natural, fluent adult-level Polish. Not simplified. Jess will read these aloud.
- Pronunciation: phonetic guide using English letters. Capitalise the stressed syllable (e.g. "YAB-wko" for Jabłko).
- Nutrients: pick 3-4 key nutrients. Assign strength as "excellent", "very good", or "good" based on how significant a source this food is.
- Serving size: describe in terms a child can picture (e.g. "one medium apple", "a handful", "about five florets").
- The id field should be lowercase, hyphenated (e.g. "sweet-potato", "brown-rice").
- imageCredit should be "Unsplash" unless a specific photographer is known.

Use ONLY these nutrient names (English / Polish):
Vitamin A / Witamina A, Vitamin B1 / Witamina B1, Vitamin B6 / Witamina B6, Vitamin B12 / Witamina B12, Vitamin C / Witamina C, Vitamin D / Witamina D, Vitamin E / Witamina E, Vitamin K / Witamina K, Iron / Żelazo, Calcium / Wapń, Potassium / Potas, Magnesium / Magnez, Zinc / Cynk, Fibre / Błonnik, Protein / Białko, Folate / Kwas foliowy, Omega-3 / Omega-3, Antioxidants / Przeciwutleniacze, Probiotics / Probiotyki, Choline / Cholina, Niacin / Niacyna, Selenium / Selen, Thiamine / Tiamina, Good Fats / Dobre tłuszcze

Use ONLY these categories (English / Polish):
Fruit / Owoce, Vegetable / Warzywa, Meat & Fish / Mięso i Ryby, Dairy / Nabiał, Grains & Legumes / Zboża i Rośliny strączkowe, Other / Inne

Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation. Just the JSON.

Example output structure:
{
  "id": "pear",
  "name": "Pear",
  "namePl": "Gruszka",
  "pronunciation": "GROOSH-kah",
  "category": "Fruit",
  "categoryPl": "Owoce",
  "image": "PROVIDED_BY_USER",
  "imageCredit": "Unsplash",
  "servingSize": "one medium pear",
  "servingSizePl": "jedna średnia gruszka",
  "nutrients": [
    { "name": "Fibre", "namePl": "Błonnik", "strength": "very good" },
    { "name": "Vitamin C", "namePl": "Witamina C", "strength": "good" },
    { "name": "Potassium", "namePl": "Potas", "strength": "good" },
    { "name": "Vitamin K", "namePl": "Witamina K", "strength": "good" }
  ],
  "benefits": "...",
  "benefitsPl": "...",
  "pairsWith": "...",
  "pairsWithPl": "...",
  "funFact": "...",
  "funFactPl": "..."
}`

const REQUIRED_FIELDS = [
  'id', 'name', 'namePl', 'pronunciation', 'category', 'categoryPl',
  'image', 'imageCredit', 'servingSize', 'servingSizePl', 'nutrients',
  'benefits', 'benefitsPl', 'pairsWith', 'pairsWithPl', 'funFact', 'funFactPl',
]

export async function generateFood({ name, category, imageUrl, apiKey }) {
  let response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Generate a complete food entry for: ${name}\nCategory: ${category}\nImage URL: ${imageUrl}`,
          },
        ],
      }),
    })
  } catch {
    throw new Error("Couldn't reach the API — check your internet connection.")
  }

  if (response.status === 401) {
    throw new Error('Invalid API key — check and try again.')
  }
  if (response.status === 429) {
    throw new Error('Too many requests — wait a moment and try again.')
  }
  if (!response.ok) {
    throw new Error(`API error ${response.status} — try regenerating.`)
  }

  const data = await response.json()
  const text = data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')

  let food
  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    food = JSON.parse(cleaned)
  } catch {
    throw new Error('The AI returned unexpected content — try regenerating.')
  }

  // Validate required fields
  const missing = REQUIRED_FIELDS.filter(f => !(f in food))
  if (missing.length > 0) {
    throw new Error(`Missing fields in response: ${missing.join(', ')} — try regenerating.`)
  }

  // Always use the user-supplied image URL
  food.image = imageUrl

  return food
}
